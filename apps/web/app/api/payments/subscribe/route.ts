/**
 * POST /api/payments/subscribe
 * Initiates a Snippe payment for premium subscription.
 * Requires authenticated user. Supports mobile money and card payments.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '../../../../lib/supabase/server';
import {
  createMobilePayment,
  createCardPayment,
  SnippeError,
} from '../../../../lib/snippe/client';

// TODO: Change back to 18_000 before launch
const PREMIUM_PRICE_TZS = 1000;

// ─── Input Validation Schemas ────────────────────────────────
const phoneNumberSchema = z.string()
  .min(7, 'Phone number too short')
  .max(15, 'Phone number too long')
  .regex(/^\d+$/, 'Phone number must contain only digits');

const billingSchema = z.object({
  address: z.string().min(3, 'Address too short').max(200, 'Address too long'),
  city: z.string().min(1, 'City is required').max(100, 'City too long'),
  state: z.string().min(1, 'State is required').max(100, 'State too long'),
  postcode: z.string().min(1, 'Postcode is required').max(20, 'Postcode too long'),
  country: z.string().length(2, 'Country must be a 2-letter ISO code'),
});

const mobilePaymentSchema = z.object({
  payment_type: z.literal('mobile'),
  phone_number: phoneNumberSchema,
});

const cardPaymentSchema = z.object({
  payment_type: z.literal('card'),
  phone_number: phoneNumberSchema,
  billing: billingSchema,
});

const paymentBodySchema = z.discriminatedUnion('payment_type', [
  mobilePaymentSchema,
  cardPaymentSchema,
]);

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

    // 3. Parse and validate request body
    const rawBody = await request.json();
    const parsed = paymentBodySchema.safeParse(rawBody);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Invalid input.';
      return NextResponse.json(
        { error: firstError },
        { status: 400 }
      );
    }

    const body = parsed.data;

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
    const baseUrl = process.env.APP_URL || request.nextUrl.origin; // either from env or request origin
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
      phoneNumber: body.phone_number,
    };

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
      console.error('Snippe API error:', error.message, error.errorCode);
      return NextResponse.json(
        { error: 'Payment service error. Please try again.' },
        { status: 502 }
      );
    }

    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment. Please try again.' },
      { status: 500 }
    );
  }
}
