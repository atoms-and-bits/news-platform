/**
 * Snippe Payment Gateway — Server-side client
 * Handles payment creation and status checks via the Snippe REST API.
 * NEVER import this file from client components.
 */

const SNIPPE_BASE_URL = 'https://api.snippe.sh/v1';

function getApiKey(): string {
  const key = process.env.SNIPPE_API_KEY;
  if (!key) {
    throw new Error('Missing SNIPPE_API_KEY environment variable.');
  }
  return key;
}

async function snippeFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${SNIPPE_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    console.error('Snippe API error response:', JSON.stringify(json, null, 2));
    console.error('Snippe request path:', path);
    throw new SnippeError(
      json.message || `Snippe API error: ${res.status}`,
      res.status,
      json.error_code
    );
  }

  return json as T;
}

// ─── Error class ─────────────────────────────────────────────
export class SnippeError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'SnippeError';
  }
}

// ─── Types ───────────────────────────────────────────────────
interface SnippeCustomer {
  firstname: string;
  lastname: string;
  email: string;
}

interface SnippePaymentResponse {
  status: 'success';
  code: number;
  data: {
    reference: string;
    status: 'pending' | 'completed' | 'failed' | 'voided' | 'expired';
    payment_type: 'mobile' | 'card';
    amount: { currency: string; value: number };
    expires_at: string;
    payment_url?: string; // Card payments only
    payment_token?: string; // Card payments only
  };
}

interface SnippePaymentStatusResponse {
  status: 'success';
  code: number;
  data: {
    reference: string;
    status: 'pending' | 'completed' | 'failed' | 'voided' | 'expired';
    amount: { currency: string; value: number };
    payment_type: 'mobile' | 'card';
    settlement?: { fees: number; gross: number; net: number };
  };
}

// ─── Payment creation ────────────────────────────────────────
export async function createMobilePayment(params: {
  amount: number;
  phoneNumber: string;
  customer: SnippeCustomer;
  webhookUrl: string;
  metadata?: Record<string, string>;
  idempotencyKey?: string;
}): Promise<SnippePaymentResponse> {
  const headers: Record<string, string> = {};
  if (params.idempotencyKey) {
    headers['Idempotency-Key'] = params.idempotencyKey;
  }

  return snippeFetch<SnippePaymentResponse>('/payments', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      payment_type: 'mobile',
      details: {
        amount: params.amount,
        currency: 'TZS',
      },
      phone_number: params.phoneNumber,
      customer: params.customer,
      webhook_url: params.webhookUrl,
      metadata: params.metadata,
    }),
  });
}

export async function createCardPayment(params: {
  amount: number;
  phoneNumber: string;
  customer: SnippeCustomer & {
    address: string;
    city: string;
    state: string;
    postcode: string;
    country: string; // ISO 3166-1 alpha-2
  };
  redirectUrl: string;
  cancelUrl: string;
  webhookUrl: string;
  metadata?: Record<string, string>;
  idempotencyKey?: string;
}): Promise<SnippePaymentResponse> {
  const headers: Record<string, string> = {};
  if (params.idempotencyKey) {
    headers['Idempotency-Key'] = params.idempotencyKey;
  }

  return snippeFetch<SnippePaymentResponse>('/payments', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      payment_type: 'card',
      details: {
        amount: params.amount,
        currency: 'TZS',
        redirect_url: params.redirectUrl,
        cancel_url: params.cancelUrl,
      },
      phone_number: params.phoneNumber,
      customer: params.customer,
      webhook_url: params.webhookUrl,
      metadata: params.metadata,
    }),
  });
}

// ─── Payment status ──────────────────────────────────────────
export async function getPaymentStatus(
  reference: string
): Promise<SnippePaymentStatusResponse> {
  return snippeFetch<SnippePaymentStatusResponse>(`/payments/${reference}`);
}

// ─── Webhook verification ────────────────────────────────────
export function verifyWebhookSignature(
  rawBody: string,
  timestamp: string,
  signature: string
): boolean {
  const secret = process.env.SNIPPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('Missing SNIPPE_WEBHOOK_SECRET environment variable.');
  }

  // Use Node.js crypto (available in Next.js API routes)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require('crypto') as typeof import('crypto');
  const message = `${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
}
