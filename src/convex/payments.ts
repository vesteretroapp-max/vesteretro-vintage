import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============= QUERIES =============

export const getByOrderId = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const payments = await ctx.db
      .query("payments")
      .withIndex("orderId", (q) => q.eq("orderId", args.orderId))
      .order("desc")
      .collect();

    return payments;
  },
});

export const getByExternalId = query({
  args: { externalPaymentId: v.string() },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("externalPaymentId", (q) =>
        q.eq("externalPaymentId", args.externalPaymentId)
      )
      .first();

    return payment;
  },
});

export const getByExternalReference = query({
  args: { externalReference: v.string() },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("externalReference", (q) =>
        q.eq("externalReference", args.externalReference)
      )
      .first();

    return payment;
  },
});

// ============= MUTATIONS =============

/**
 * Create a new payment record when a payment is initiated
 */
export const create = mutation({
  args: {
    orderId: v.id("orders"),
    provider: v.string(),
    externalPaymentId: v.string(),
    externalReference: v.optional(v.string()),
    paymentMethod: v.string(),
    status: v.string(),
    amount: v.number(),
    currency: v.optional(v.string()),
    installments: v.optional(v.number()),
    installmentAmount: v.optional(v.number()),
    pixQrCode: v.optional(v.string()),
    pixQrCodeBase64: v.optional(v.string()),
    pixExpiration: v.optional(v.string()),
    boletoUrl: v.optional(v.string()),
    boletoBarcode: v.optional(v.string()),
    boletoExpiration: v.optional(v.string()),
    isTest: v.boolean(),
  },
  handler: async (ctx, args) => {
    const paymentId = await ctx.db.insert("payments", {
      orderId: args.orderId,
      provider: args.provider,
      externalPaymentId: args.externalPaymentId,
      externalReference: args.externalReference,
      paymentMethod: args.paymentMethod,
      status: args.status,
      amount: args.amount,
      currency: args.currency ?? "BRL",
      installments: args.installments,
      installmentAmount: args.installmentAmount,
      pixQrCode: args.pixQrCode,
      pixQrCodeBase64: args.pixQrCodeBase64,
      pixExpiration: args.pixExpiration,
      boletoUrl: args.boletoUrl,
      boletoBarcode: args.boletoBarcode,
      boletoExpiration: args.boletoExpiration,
      isTest: args.isTest,
    });

    return { paymentId };
  },
});

/**
 * Check if a webhook event has already been processed (idempotency)
 */
export const isWebhookProcessed = query({
  args: {
    provider: v.string(),
    externalId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("webhookEvents")
      .withIndex("externalId", (q) =>
        q.eq("externalId", args.externalId)
      )
      .first();

    return existing?.processed ?? false;
  },
});

/**
 * Record a webhook event for idempotency tracking
 */
export const recordWebhookEvent = mutation({
  args: {
    provider: v.string(),
    eventType: v.string(),
    externalId: v.optional(v.string()),
    payload: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already processed
    if (args.externalId) {
      const existing = await ctx.db
        .query("webhookEvents")
        .withIndex("externalId", (q) =>
          q.eq("externalId", args.externalId)
        )
        .first();

      if (existing?.processed) {
        console.log(`[Webhook] Event ${args.externalId} already processed, skipping`);
        return { alreadyProcessed: true, eventId: existing._id };
      }
    }

    const eventId = await ctx.db.insert("webhookEvents", {
      provider: args.provider,
      eventType: args.eventType,
      externalId: args.externalId,
      payload: args.payload,
      processed: false,
      createdAt: Date.now(),
    });

    return { alreadyProcessed: false, eventId };
  },
});

/**
 * Mark a webhook event as processed
 */
export const markWebhookProcessed = mutation({
  args: {
    eventId: v.id("webhookEvents"),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.eventId, {
      processed: !args.error,
      processingError: args.error,
      processedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Process a Mercado Pago webhook event and update payment/order status
 */
export const processMercadoPagoWebhook = mutation({
  args: {
    paymentId: v.string(),
    status: v.string(),
    statusDetail: v.optional(v.string()),
    externalReference: v.optional(v.string()),
    rawPayload: v.string(),
  },
  handler: async (ctx, args) => {
    // Map Mercado Pago status to our order status
    const orderStatusMap: Record<string, string> = {
      approved: "Pago",
      authorized: "Pago",
      pending: "Aguardando pagamento",
      in_process: "Pagamento em análise",
      in_review: "Pagamento em análise",
      rejected: "Aguardando pagamento",
      cancelled: "Cancelado",
      refunded: "Reembolsado",
      charged_back: "Reembolsado",
      expired: "Cancelado",
    };

    const orderStatus = orderStatusMap[args.status] ?? "Aguardando pagamento";

    // Find the payment record by external payment ID
    const payment = await ctx.db
      .query("payments")
      .withIndex("externalPaymentId", (q) =>
        q.eq("externalPaymentId", args.paymentId)
      )
      .first();

    if (!payment) {
      console.warn(`[Webhook] No payment found for external ID: ${args.paymentId}`);

      // Try to find by external reference (order number)
      if (args.externalReference) {
        const paymentByRef = await ctx.db
          .query("payments")
          .withIndex("externalReference", (q) =>
            q.eq("externalReference", args.externalReference)
          )
          .first();

        if (paymentByRef) {
          return updatePaymentAndOrder(ctx, paymentByRef._id, paymentByRef.orderId, args.status, orderStatus, args.statusDetail, args.rawPayload);
        }
      }

      return { success: false, error: "Payment not found" };
    }

    return updatePaymentAndOrder(ctx, payment._id, payment.orderId, args.status, orderStatus, args.statusDetail, args.rawPayload);
  },
});

/**
 * Helper: Update payment record and order status
 */
async function updatePaymentAndOrder(
  ctx: any,
  paymentId: string,
  orderId: string,
  mpStatus: string,
  orderStatus: string,
  statusDetail: string | undefined,
  rawPayload: string
) {
  const now = Date.now();

  // Update payment status
  await ctx.db.patch(paymentId, {
    status: mpStatus,
    gatewayResponse: rawPayload,
    ...(mpStatus === "approved" ? { paidAt: now } : {}),
    ...(mpStatus === "cancelled" || mpStatus === "expired" ? { cancelledAt: now } : {}),
    ...(mpStatus === "refunded" || mpStatus === "charged_back" ? { refundedAt: now } : {}),
  });

  // Update order status
  await ctx.db.patch(orderId, {
    status: orderStatus,
    paymentStatus: mpStatus,
  });

  // Record in order status history
  await ctx.db.insert("orderStatusHistory", {
    orderId,
    status: orderStatus as any,
    note: `Status atualizado via webhook: ${mpStatus}${statusDetail ? ` (${statusDetail})` : ""}`,
  });

  console.log(`[Webhook] Payment ${paymentId} updated: ${mpStatus} → Order ${orderId} → ${orderStatus}`);

  return { success: true, orderStatus, paymentStatus: mpStatus };
}
