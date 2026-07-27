import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// ============= QUERIES =============

export const list = query({
  args: {
    userId: v.optional(v.id("users")),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let ordersQuery = ctx.db.query("orders");

    if (args.userId) {
      ordersQuery = ordersQuery.filter((q) =>
        q.eq(q.field("userId"), args.userId)
      );
    }
    if (args.status) {
      ordersQuery = ordersQuery.filter((q) =>
        q.eq(q.field("status"), args.status)
      );
    }

    const orders = await ordersQuery.order("desc").take(args.limit ?? 50);

    // Get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await ctx.db
          .query("orderItems")
          .withIndex("orderId", (q) => q.eq("orderId", order._id))
          .collect();

        const history = await ctx.db
          .query("orderStatusHistory")
          .withIndex("orderId", (q) => q.eq("orderId", order._id))
          .collect();

        return { ...order, items, history };
      })
    );

    return ordersWithItems;
  },
});

export const getByNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("orderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .first();

    if (!order) return null;

    const items = await ctx.db
      .query("orderItems")
      .withIndex("orderId", (q) => q.eq("orderId", order._id))
      .collect();

    const history = await ctx.db
      .query("orderStatusHistory")
      .withIndex("orderId", (q) => q.eq("orderId", order._id))
      .collect();

    return { ...order, items, history };
  },
});

export const getMyOrders = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const orders = await ctx.db
      .query("orders")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);

    return await Promise.all(
      orders.map(async (order) => {
        const items = await ctx.db
          .query("orderItems")
          .withIndex("orderId", (q) => q.eq("orderId", order._id))
          .collect();
        return { ...order, items };
      })
    );
  },
});

// ============= MUTATIONS =============

export const create = mutation({
  args: {
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    customerCpf: v.optional(v.string()),
    shippingAddressId: v.id("addresses"),
    paymentMethod: v.string(),
    paymentStatus: v.string(),
    shippingMethod: v.string(),
    subtotal: v.number(),
    shipping: v.number(),
    discount: v.optional(v.number()),
    total: v.number(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        productImage: v.string(),
        size: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        subtotal: v.number(),
      })
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    // Generate order number
    const prefix = "VR";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `${prefix}${timestamp}${random}`;

    // Get shipping address
    const address = await ctx.db.get(args.shippingAddressId);
    if (!address) throw new Error("Address not found");

    const shippingAddressStr = `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ""} - ${address.neighborhood}, ${address.city}/${address.state} - CEP: ${address.cep}`;

    // Create order
    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      userId: user?._id,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      customerCpf: args.customerCpf,
      status: "Aguardando pagamento",
      subtotal: args.subtotal,
      shipping: args.shipping,
      discount: args.discount,
      total: args.total,
      paymentMethod: args.paymentMethod,
      paymentStatus: args.paymentStatus,
      shippingAddress: shippingAddressStr,
      shippingMethod: args.shippingMethod,
      isTest: true,
    });

    // Create order items
    for (const item of args.items) {
      await ctx.db.insert("orderItems", {
        orderId,
        ...item,
      });
    }

    // Create order status history
    await ctx.db.insert("orderStatusHistory", {
      orderId,
      status: "Aguardando pagamento",
      note: "Pedido criado",
    });

    // Clear user's cart
    if (user) {
      const cartItems = await ctx.db
        .query("cartItems")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .collect();
      for (const item of cartItems) {
        await ctx.db.delete(item._id);
      }
    }

    return { orderId, orderNumber };
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
    note: v.optional(v.string()),
    trackingCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.orderId, {
      status: args.status as any,
      ...(args.trackingCode ? { trackingCode: args.trackingCode } : {}),
    });

    await ctx.db.insert("orderStatusHistory", {
      orderId: args.orderId,
      status: args.status as any,
      note: args.note,
    });
  },
});
