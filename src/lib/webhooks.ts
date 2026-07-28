/**
 * Webhook Handler for Payment Notifications
 * 
 * Handles incoming webhooks from payment providers (Mercado Pago).
 * Validates, processes, and stores payment status updates.
 * 
 * In production, this should be a Supabase Edge Function or similar backend.
 * For now, we provide a client-side handler for demo mode.
 */

import { getPaymentProvider } from './payment-provider';

export interface WebhookEvent {
  id: string;
  provider: string;
  event_type: string;
  payload: unknown;
  processed: boolean;
  processing_error?: string;
  created_at: string;
  processed_at?: string;
}

export interface WebhookProcessResult {
  success: boolean;
  payment_id?: string;
  external_reference?: string;
  status?: string;
  error?: string;
}

// In-memory store for demo mode (should use database in production)
const webhookEvents: WebhookEvent[] = [];

/**
 * Process incoming webhook from Mercado Pago
 */
export async function processMercadoPagoWebhook(
  payload: Record<string, unknown>,
  headers?: Record<string, string>
): Promise<WebhookProcessResult> {
  try {
    // Validate payload
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid webhook payload');
    }

    // Extract event info
    const eventType = payload.type as string;
    const action = payload.action as string;
    const data = payload.data as Record<string, unknown> | undefined;
    const resourceId = data?.id as string;

    if (!eventType || !action) {
      throw new Error('Missing event type or action');
    }

    // Check for duplicate events
    const existingEvent = webhookEvents.find(
      (e) => e.provider === 'mercadopago' && e.event_type === `${eventType}.${action}` && e.payload === payload
    );

    if (existingEvent) {
      console.log('[Webhook] Duplicate event detected, skipping');
      return { success: true };
    }

    // Store event
    const event: WebhookEvent = {
      id: `wh_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      provider: 'mercadopago',
      event_type: `${eventType}.${action}`,
      payload,
      processed: false,
      created_at: new Date().toISOString(),
    };

    webhookEvents.push(event);

    // Process via payment provider
    const paymentProvider = await getPaymentProvider();
    const result = await paymentProvider.processWebhook(payload, headers);

    // Update event status
    event.processed = true;
    event.processed_at = new Date().toISOString();

    // Log the event
    console.log('[Webhook] Processed event:', {
      id: event.id,
      type: event.event_type,
      payment_id: result.payment_id,
      status: result.status,
    });

    return {
      success: true,
      payment_id: result.payment_id,
      external_reference: result.external_reference,
      status: result.status,
    };
  } catch (error) {
    console.error('[Webhook] Processing error:', error);

    // Store error event
    const errorEvent: WebhookEvent = {
      id: `wh_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      provider: 'mercadopago',
      event_type: 'error',
      payload,
      processed: false,
      processing_error: error instanceof Error ? error.message : 'Unknown error',
      created_at: new Date().toISOString(),
    };

    webhookEvents.push(errorEvent);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process webhook',
    };
  }
}

/**
 * Get webhook events history (for admin panel)
 */
export function getWebhookEvents(limit: number = 50): WebhookEvent[] {
  return webhookEvents
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

/**
 * Get webhook events statistics
 */
export function getWebhookStats(): {
  total: number;
  processed: number;
  failed: number;
  byProvider: Record<string, number>;
} {
  const total = webhookEvents.length;
  const processed = webhookEvents.filter((e) => e.processed).length;
  const failed = webhookEvents.filter((e) => !e.processed && e.processing_error).length;

  const byProvider: Record<string, number> = {};
  webhookEvents.forEach((e) => {
    byProvider[e.provider] = (byProvider[e.provider] || 0) + 1;
  });

  return { total, processed, failed, byProvider };
}

export default {
  processMercadoPagoWebhook,
  getWebhookEvents,
  getWebhookStats,
};
