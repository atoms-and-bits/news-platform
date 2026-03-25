/**
 * POST /api/webhooks/snippe
 * Handles payment event notifications from Snippe.
 * On payment.completed: activates premium subscription.
 * On payment.failed: logs for debugging (no user-facing action needed).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { verifyWebhookSignature } from '../../../../lib/snippe/client';
import type { Database } from '../../../../lib/supabase/database.types';
import { parse } from 'path';

// Use service role client — webhook has no user session
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

interface SnippeWebhookPayload {
  event: string;
  data: {
    reference: string;
    status: 'completed' | 'failed' | 'voided' | 'expired';
    amount: { currency: string; value: number };
    payment_type: 'mobile' | 'card';
    metadata?: Record<string, string>;
    settlement?: { fees: number; gross: number; net: number };
  };
}

export async function POST(request: NextRequest) {
  try {
    // 1. Read raw body for signature verification
    const rawBody = await request.text();
    const timestamp = request.headers.get('X-Webhook-Timestamp') || '';
    const signature = request.headers.get('X-Webhook-Signature') || '';
    const event = request.headers.get('X-Webhook-Event') || '';

    // Verify timestamp is recent (within 5 minutes) to prevent replay attacks
    const now = Math.floor(Date.now() / 1000);
    const timestampInt = parseInt(timestamp, 10);

    if (isNaN(timestampInt) || Math.abs(now - timestampInt) > 300) {
      console.error('Snippe webhook timestamp verification failed.');
      return NextResponse.json(
        { error: 'Invalid timestamp.' },
        { status: 401 }
      );
    }

    // 2. Verify signature
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook headers.' },
        { status: 400 }
      );
    }

    const isValid = verifyWebhookSignature(rawBody, timestamp, signature);
    if (!isValid) {
      console.error('Snippe webhook signature verification failed.');
      return NextResponse.json(
        { error: 'Invalid signature.' },
        { status: 401 }
      );
    }

    // 3. Parse payload
    const payload: SnippeWebhookPayload = JSON.parse(rawBody);
    const { data } = payload;
    const userId = data.metadata?.user_id;

    console.log(`Snippe webhook: ${event} | ref=${data.reference} | user=${userId}`);

    // 4. Handle payment.completed
    if (event === 'payment.completed' && userId) {
      const supabase = createServiceClient();
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Check for existing subscription row for this user
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      const subPayload = {
        user_id: userId,
        plan: 'premium' as const,
        status: 'active' as const,
        started_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        payment_provider_id: data.reference,
      };

      const { error: subError } = existingSub
        ? await supabase
            .from('subscriptions')
            .update(subPayload)
            .eq('id', existingSub.id)
        : await supabase.from('subscriptions').insert(subPayload);

      if (subError) {
        console.error('Failed to save subscription:', subError);
      }

      // Update user plan to premium
      const { error: userError } = await supabase
        .from('users')
        .update({ plan: 'premium' })
        .eq('id', userId);

      if (userError) {
        console.error('Failed to update user plan:', userError);
      }

      console.log(`Premium activated for user ${userId} until ${expiresAt.toISOString()}`);
    }

    if (event === 'payment.failed' && userId) {
      console.log(`Payment failed for user ${userId}: ref=${data.reference}`);
      // No action needed — user can retry from the UI
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Return 200 even on processing errors to prevent Snippe from retrying
    // with the same (potentially malformed) payload
    return NextResponse.json({ received: true, error: 'Processing error' });
  }
}
