import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

export const ORDER_STATUS = {
  AWAITING_PAYMENT: "Aguardando pagamento",
  PAYMENT_ANALYSIS: "Pagamento em análise",
  PAID: "Pago",
  SEPARATING: "Em separação",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
} as const;

export const orderStatusValidator = v.union(
  v.literal(ORDER_STATUS.AWAITING_PAYMENT),
  v.literal(ORDER_STATUS.PAYMENT_ANALYSIS),
  v.literal(ORDER_STATUS.PAID),
  v.literal(ORDER_STATUS.SEPARATING),
  v.literal(ORDER_STATUS.SHIPPED),
  v.literal(ORDER_STATUS.DELIVERED),
  v.literal(ORDER_STATUS.CANCELLED),
  v.literal(ORDER_STATUS.REFUNDED),
);

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      phone: v.optional(v.string()),
      whatsapp: v.optional(v.string()),
      cpf: v.optional(v.string()),
    }).index("email", ["email"]),

    // Products
    products: defineTable({
      name: v.string(),
      slug: v.string(),
      club: v.string(),
      year: v.number(),
      type: v.string(),
      category: v.string(),
      country: v.optional(v.string()),
      description: v.string(),
      history: v.optional(v.string()),
      price: v.number(),
      promotionalPrice: v.optional(v.number()),
      isNew: v.optional(v.boolean()),
      isBestSeller: v.optional(v.boolean()),
      isPromotion: v.optional(v.boolean()),
      isPublished: v.boolean(),
      isDraft: v.boolean(),
      rating: v.optional(v.number()),
      reviewCount: v.optional(v.number()),
      competition: v.optional(v.string()),
      legendaryPlayers: v.optional(v.array(v.string())),
      tags: v.optional(v.array(v.string())),
      decade: v.number(),
      importedFrom: v.optional(v.string()),
    })
      .index("slug", ["slug"])
      .index("category", ["category"])
      .index("club", ["club"])
      .index("decade", ["decade"])
      .index("published", ["isPublished"]),

    productImages: defineTable({
      productId: v.id("products"),
      url: v.string(),
      order: v.number(),
    })
      .index("productId", ["productId"])
      .index("productOrder", ["productId", "order"]),

    productVariants: defineTable({
      productId: v.id("products"),
      size: v.string(),
      sku: v.string(),
      stock: v.number(),
      price: v.optional(v.number()),
      weight: v.optional(v.number()),
      width: v.optional(v.number()),
      length: v.optional(v.number()),
      sleeve: v.optional(v.number()),
    })
      .index("productId", ["productId"])
      .index("productSize", ["productId", "size"]),

    // Addresses
    addresses: defineTable({
      userId: v.id("users"),
      name: v.string(),
      cep: v.string(),
      street: v.string(),
      number: v.string(),
      complement: v.optional(v.string()),
      neighborhood: v.string(),
      city: v.string(),
      state: v.string(),
      reference: v.optional(v.string()),
      isDefault: v.boolean(),
    })
      .index("userId", ["userId"])
      .index("userDefault", ["userId", "isDefault"]),

    // Orders
    orders: defineTable({
      orderNumber: v.string(),
      userId: v.optional(v.id("users")),
      customerName: v.string(),
      customerEmail: v.string(),
      customerPhone: v.optional(v.string()),
      customerCpf: v.optional(v.string()),
      status: orderStatusValidator,
      subtotal: v.number(),
      shipping: v.number(),
      discount: v.optional(v.number()),
      total: v.number(),
      paymentMethod: v.string(),
      paymentStatus: v.string(),
      shippingAddress: v.string(),
      shippingMethod: v.string(),
      trackingCode: v.optional(v.string()),
      notes: v.optional(v.string()),
      isTest: v.boolean(),
    })
      .index("orderNumber", ["orderNumber"])
      .index("userId", ["userId"])
      .index("status", ["status"])
      ,

    orderItems: defineTable({
      orderId: v.id("orders"),
      productId: v.id("products"),
      productName: v.string(),
      productImage: v.string(),
      size: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      subtotal: v.number(),
    })
      .index("orderId", ["orderId"]),

    orderStatusHistory: defineTable({
      orderId: v.id("orders"),
      status: orderStatusValidator,
      note: v.optional(v.string()),
    })
      .index("orderId", ["orderId"]),

    // Favorites
    favorites: defineTable({
      userId: v.id("users"),
      productId: v.id("products"),
    })
      .index("userId", ["userId"])
      .index("userProduct", ["userId", "productId"]),

    // Cart (for signed-in users)
    cartItems: defineTable({
      userId: v.id("users"),
      productId: v.id("products"),
      productName: v.string(),
      productImage: v.string(),
      size: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
    })
      .index("userId", ["userId"])
      .index("userProduct", ["userId", "productId", "size"]),

    // Reviews
    reviews: defineTable({
      productId: v.id("products"),
      userId: v.id("users"),
      rating: v.number(),
      title: v.optional(v.string()),
      comment: v.optional(v.string()),
      isApproved: v.boolean(),
    })
      .index("productId", ["productId"])
      .index("productApproved", ["productId", "isApproved"]),

    // Newsletter
    newsletterSubscribers: defineTable({
      email: v.string(),
      name: v.optional(v.string()),
      isActive: v.boolean(),
    })
      .index("email", ["email"]),

    // Coupons
    coupons: defineTable({
      code: v.string(),
      type: v.union(v.literal("percentage"), v.literal("fixed")),
      value: v.number(),
      minPurchase: v.optional(v.number()),
      maxUses: v.optional(v.number()),
      currentUses: v.optional(v.number()),
      expiresAt: v.optional(v.number()),
      isActive: v.boolean(),
    })
      .index("code", ["code"]),

    couponUsage: defineTable({
      couponId: v.id("coupons"),
      userId: v.optional(v.id("users")),
      orderId: v.optional(v.id("orders")),
    })
      .index("couponId", ["couponId"]),

    // Site settings
    siteSettings: defineTable({
      key: v.string(),
      value: v.any(),
    })
      .index("key", ["key"]),

    // Import jobs
    importJobs: defineTable({
      url: v.string(),
      status: v.string(),
      totalItems: v.optional(v.number()),
      importedItems: v.optional(v.number()),
      error: v.optional(v.string()),
      startedAt: v.optional(v.number()),
      completedAt: v.optional(v.number()),
    })
      .index("status", ["status"]),

    // Audit logs
    auditLogs: defineTable({
      userId: v.optional(v.id("users")),
      action: v.string(),
      entityType: v.string(),
      entityId: v.optional(v.string()),
      details: v.optional(v.string()),
    })
      .index("userId", ["userId"])
      .index("action", ["action"]),

    // Banners
    banners: defineTable({
      title: v.string(),
      subtitle: v.optional(v.string()),
      imageUrl: v.string(),
      linkUrl: v.optional(v.string()),
      order: v.number(),
      isActive: v.boolean(),
    })
      .index("active", ["isActive", "order"]),

    // Payments (Mercado Pago integration)
    payments: defineTable({
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
      gatewayResponse: v.optional(v.string()),
      paidAt: v.optional(v.number()),
      cancelledAt: v.optional(v.number()),
      refundedAt: v.optional(v.number()),
      isTest: v.boolean(),
    })
      .index("orderId", ["orderId"])
      .index("externalPaymentId", ["externalPaymentId"])
      .index("externalReference", ["externalReference"])
      .index("status", ["status"]),

    // Webhook events (idempotency)
    webhookEvents: defineTable({
      provider: v.string(),
      eventType: v.string(),
      externalId: v.optional(v.string()),
      payload: v.string(),
      processed: v.boolean(),
      processingError: v.optional(v.string()),
      createdAt: v.number(),
      processedAt: v.optional(v.number()),
    })
      .index("externalId", ["externalId"])
      .index("provider", ["provider"])
      .index("processed", ["processed"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
