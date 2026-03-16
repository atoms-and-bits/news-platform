/**
 * POST /api/payments/verify
 * Checks a Snippe payment reference and activates the subscription if completed.
 * Use this as a fallback when webhooks fail (e.g. ngrok offline, network issues).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { getPaymentStatus } from '../../../../lib/snippe/client';
import type { Database } from '../../../../lib/supabase/database.types';

function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase service role environment variables.');
  }

  return createServerClient<Database>(url, serviceKey, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  });
}

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

    // 2. Parse reference from body
    const { reference } = (await request.json()) as { reference?: string };

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required.' },
        { status: 400 }
      );
    }

    // 3. Check payment status with Snippe
    const payment = await getPaymentStatus(reference);

    if (payment.data.status !== 'completed') {
      return NextResponse.json({
        status: payment.data.status,
        message: `Payment is ${payment.data.status}. No action taken.`,
      });
    }

    // 4. Payment is completed — activate subscription
    const serviceClient = createServiceClient();
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data: existingSub } = await serviceClient
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    const subPayload = {
      user_id: user.id,
      plan: 'premium' as const,
      status: 'active' as const,
      started_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      payment_provider_id: reference,
    };

    const { error: subError } = existingSub
      ? await serviceClient
          .from('subscriptions')
          .update(subPayload)
          .eq('id', existingSub.id)
      : await serviceClient.from('subscriptions').insert(subPayload);

    if (subError) {
      console.error('Failed to save subscription:', subError);
      return NextResponse.json(
        { error: 'Failed to activate subscription.' },
        { status: 500 }
      );
    }

    await serviceClient
      .from('users')
      .update({ plan: 'premium' })
      .eq('id', user.id);

    return NextResponse.json({
      status: 'activated',
      message: 'Premium subscription activated successfully.',
      expires_at: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment.' },
      { status: 500 }
    );
  }
}
