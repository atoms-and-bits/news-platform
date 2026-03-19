/**
 * POST /api/payments/subscribe
 * Initiates a Snippe payment for premium subscription.
 * Requires authenticated user. Supports mobile money and card payments.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import {
  createMobilePayment,
  createCardPayment,
  SnippeError,
} from '../../../../lib/snippe/client';

// TODO: Change back to 18_000 before launch
const PREMIUM_PRICE_TZS = 1000;

interface MobilePaymentBody {
  payment_type: 'mobile';
  phone_number: string;
}

interface CardPaymentBody {
  payment_type: 'card';
  phone_number: string;
  billing: {
    address: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
}

type PaymentBody = MobilePaymentBody | CardPaymentBody;

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      );
    }

    // 2. Check if already premium with active subscription
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id, status, expires_at')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (existingSub && existingSub.expires_at) {
      const expiresAt = new Date(existingSub.expires_at);
      if (expiresAt > new Date()) {
        return NextResponse.json(
          {
            error: 'You already have an active premium subscription.',
            expires_at: existingSub.expires_at,
          },
          { status: 409 }
        );
      }
    }

    // 3. Parse request body
    const body = (await request.json()) as PaymentBody;

    if (!body.payment_type || !['mobile', 'card'].includes(body.payment_type)) {
      return NextResponse.json(
        { error: 'Invalid payment_type. Must be "mobile" or "card".' },
        { status: 400 }
      );
    }

    // 4. Get user profile for customer info
    const { data: profile } = await supabase
      .from('users')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    const nameParts = (profile?.full_name || 'Member').split(' ');
    const firstname = nameParts[0] || 'Member';
    const lastname = nameParts.slice(1).join(' ') || '-';
    const email = profile?.email || user.email || '';

    // In dev, use APP_URL (e.g. ngrok) so Snippe can reach the webhook.
    // In prod, derive from the request origin.
    const baseUrl =
      process.env.APP_URL ||
      (request.headers.get('x-forwarded-host')
        ? `https://${request.headers.get('x-forwarded-host')}`
        : request.nextUrl.origin);
    const webhookUrl = `${baseUrl}/api/webhooks/snippe`;

    // Idempotency key to prevent duplicate payments
    const idempotencyKey = `sub_${user.id}_${Date.now()}`;

    // Metadata to link payment back to user
    const metadata = {
      user_id: user.id,
      plan: 'premium',
      type: 'subscription',
    };

    // 5. Create payment with Snippe
    if (body.payment_type === 'mobile') {
      if (!body.phone_number) {
        return NextResponse.json(
          { error: 'phone_number is required for mobile payments.' },
          { status: 400 }
        );
      }

      const result = await createMobilePayment({
        amount: PREMIUM_PRICE_TZS,
        phoneNumber: body.phone_number,
        customer: { firstname, lastname, email },
        webhookUrl,
        metadata,
        idempotencyKey,
      });

      return NextResponse.json({
        payment_type: 'mobile',
        reference: result.data.reference,
        status: result.data.status,
        message:
          'A USSD push has been sent to your phone. Enter your PIN to complete payment.',
      });
    }

    // Card payment
    const billing = body.billing;
    if (
      !billing?.address ||
      !billing?.city ||
      !billing?.state ||
      !billing?.postcode ||
      !billing?.country
    ) {
      return NextResponse.json(
        {
          error:
            'All billing fields (address, city, state, postcode, country) are required for card payments.',
        },
        { status: 400 }
      );
    }

    const redirectUrl = `${baseUrl}/premium/success`;
    const cancelUrl = `${baseUrl}/subscribe?cancelled=true`;

    const customerPayload = {
      firstname,
      lastname,
      email,
      address: billing.address,
      city: billing.city,
      state: billing.state,
      postcode: billing.postcode,
      country: billing.country,
    };
    console.log('Card payment customer payload:', JSON.stringify(customerPayload, null, 2));

    const result = await createCardPayment({
      amount: PREMIUM_PRICE_TZS,
      phoneNumber: body.phone_number,
      customer: customerPayload,
      redirectUrl,
      cancelUrl,
      webhookUrl,
      metadata,
      idempotencyKey,
    });

    return NextResponse.json({
      payment_type: 'card',
      reference: result.data.reference,
      status: result.data.status,
      payment_url: result.data.payment_url,
      message: 'Redirect to complete card payment.',
    });
  } catch (error) {
    if (error instanceof SnippeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment. Please try again.' },
      { status: 500 }
    );
  }
}
