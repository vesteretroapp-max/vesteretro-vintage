import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getMyCart = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("cartItems")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const addItem = mutation({
  args: {
    productId: v.id("products"),
    productName: v.string(),
    productImage: v.string(),
    size: v.string(),
    quantity: v.number(),
    unitPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check if item already exists
    const existing = await ctx.db
      .query("cartItems")
      .withIndex("userProduct", (q) =>
        q.eq("userId", user._id).eq("productId", args.productId).eq("size", args.size)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        quantity: existing.quantity + args.quantity,
      });
    } else {
      await ctx.db.insert("cartItems", {
        userId: user._id,
        ...args,
      });
    }
  },
});

export const updateQuantity = mutation({
  args: {
    cartItemId: v.id("cartItems"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    if (args.quantity <= 0) {
      await ctx.db.delete(args.cartItemId);
    } else {
      await ctx.db.patch(args.cartItemId, { quantity: args.quantity });
    }
  },
});

export const removeItem = mutation({
  args: { cartItemId: v.id("cartItems") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    await ctx.db.delete(args.cartItemId);
  },
});

export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const items = await ctx.db
      .query("cartItems")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();

    for (const item of items) {
      await ctx.db.delete(item._id);
    }
  },
});

export const syncFromLocalStorage = mutation({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        productImage: v.string(),
        size: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Clear existing cart
    const existing = await ctx.db
      .query("cartItems")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();
    for (const item of existing) {
      await ctx.db.delete(item._id);
    }

    // Insert all items
    for (const item of args.items) {
      await ctx.db.insert("cartItems", {
        userId: user._id,
        ...item,
      });
    }
  },
});
