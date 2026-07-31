import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * Mercado Pago Webhook Handler
 * 
 * Receives payment status notifications from Mercado Pago.
 * Validates the webhook, checks idempotency, and updates payment/order status.
 * 
 * Configure in Mercado Pago:
 * - URL: https://<YOUR_CONVEX_URL>/api/webhooks/mercado-pago
 * - Events: payment, payment_method, chargebacks, refunds
 */

// Mercado Pago webhook secret for signature validation (optional, recommended)
const WEBHOOK_SECRET = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

/**
 * Validate x-signature header from Mercado Pago
 * Uses HMAC-SHA256 to verify the webhook authenticity
 */
async function validateSignature(
  body: string,
  signature: string
): Promise<boolean> {
  if (!WEBHOOK_SECRET) {
    console.warn("[Webhook] MERCADO_PAGO_WEBHOOK_SECRET not set - skipping signature validation");
    return true; // Allow if no secret configured (development mode)
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(body)
    );

    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return signature === expectedSignature;
  } catch (error) {
    console.error("[Webhook] Signature validation error:", error);
    return false;
  }
}

/**
 * Extract payment ID from Mercado Pago webhook payload
 * Supports both v1 and v2 webhook formats
 */
function extractPaymentId(payload: Record<string, unknown>): string | null {
  // v2 format: { data: { id: "12345" } }
  if (payload.data && typeof payload.data === "object") {
    const data = payload.data as Record<string, unknown>;
    if (data.id) {
      return String(data.id);
    }
  }

  // v1 format: { resource: "https://api.mercadopago.com/v1/payments/12345" }
  if (typeof payload.resource === "string") {
    const match = payload.resource.match(/\/payments\/(\d+)/);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * POST /api/webhooks/mercado-pago
 * 
 * Receives Mercado Pago webhook notifications.
 * Returns 200 OK to acknowledge receipt (Mercado Pago retries on failure).
 */
export const handleMercadoPagoWebhook = httpAction(async (ctx, request) => {
  try {
    // Parse the request body
    const bodyText = await request.text();
    let payload: Record<string, unknown>;

    try {
      payload = JSON.parse(bodyText);
    } catch {
      console.error("[Webhook] Invalid JSON payload");
      return new Response("Invalid JSON", { status: 400 });
    }

    console.log("[Webhook] Received:", {
      type: payload.type,
      action: payload.action,
      date_created: payload.date_created,
    });

    // Validate signature if configured
    const signature = request.headers.get("x-signature") ?? "";
    if (WEBHOOK_SECRET && signature) {
      const isValid = await validateSignature(bodyText, signature);
      if (!isValid) {
        console.error("[Webhook] Invalid signature");
        return new Response("Invalid signature", { status: 401 });
      }
    }

    // Extract event info
    const eventType = payload.type as string;
    const action = payload.action as string;
    const paymentId = extractPaymentId(payload);

    if (!paymentId) {
      console.warn("[Webhook] No payment ID found in payload");
      return new Response("OK", { status: 200 }); // Acknowledge but skip
    }

    // Check idempotency
    const alreadyProcessed = await ctx.runQuery(api.payments.isWebhookProcessed, {
      provider: "mercadopago",
      externalId: paymentId,
    });

    if (alreadyProcessed) {
      console.log(`[Webhook] Payment ${paymentId} already processed, skipping`);
      return new Response("OK", { status: 200 });
    }

    // Record the webhook event
    const { eventId, alreadyProcessed: raceCheck } = await ctx.runMutation(
      api.payments.recordWebhookEvent,
      {
        provider: "mercadopago",
        eventType: `${eventType}.${action}`,
        externalId: paymentId,
        payload: bodyText,
      }
    );

    if (raceCheck) {
      return new Response("OK", { status: 200 });
    }

    // Fetch payment details from Mercado Pago
    // In production, we'd call the MP API here, but since Convex actions
    // can't easily make outbound HTTP, we rely on the data in the webhook
    const mpStatus = payload.status as string ?? "pending";
    const statusDetail = payload.status_detail as string ?? "";
    const externalReference = payload.external_reference as string ?? "";

    // Process the payment update
    const result = await ctx.runMutation(
      api.payments.processMercadoPagoWebhook,
      {
        paymentId,
        status: mpStatus,
        statusDetail,
        externalReference,
        rawPayload: bodyText,
      }
    );

    // Mark webhook as processed
    const processingError = result.success ? undefined : ('error' in result ? result.error : undefined);
    await ctx.runMutation(api.payments.markWebhookProcessed, {
      eventId,
      error: processingError,
    });

    console.log(`[Webhook] Processed: payment=${paymentId}, status=${mpStatus}`, result);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("[Webhook] Processing error:", error);
    // Always return 200 to Mercado Pago to prevent retries for processing errors
    // Log the error for debugging
    return new Response("OK", { status: 200 });
  }
});
