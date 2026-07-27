import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();

    const products = await Promise.all(
      favorites.map(async (fav) => {
        const product = await ctx.db.get(fav.productId);
        return product;
      })
    );

    return products.filter(Boolean);
  },
});

export const toggle = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("favorites")
      .withIndex("userProduct", (q) =>
        q.eq("userId", user._id).eq("productId", args.productId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { favorited: false };
    } else {
      await ctx.db.insert("favorites", {
        userId: user._id,
        productId: args.productId,
      });
      return { favorited: true };
    }
  },
});

export const isFavorited = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    const existing = await ctx.db
      .query("favorites")
      .withIndex("userProduct", (q) =>
        q.eq("userId", user._id).eq("productId", args.productId)
      )
      .first();

    return !!existing;
  },
});
