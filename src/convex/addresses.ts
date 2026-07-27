import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("addresses")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("addresses") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const address = await ctx.db.get(args.id);
    if (!address || address.userId !== user._id) return null;
    return address;
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    if (args.isDefault) {
      const currentDefault = await ctx.db
        .query("addresses")
        .withIndex("userDefault", (q) =>
          q.eq("userId", user._id).eq("isDefault", true)
        )
        .first();
      if (currentDefault) {
        await ctx.db.patch(currentDefault._id, { isDefault: false });
      }
    }

    return await ctx.db.insert("addresses", {
      userId: user._id,
      ...args,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("addresses"),
    name: v.optional(v.string()),
    cep: v.optional(v.string()),
    street: v.optional(v.string()),
    number: v.optional(v.string()),
    complement: v.optional(v.string()),
    neighborhood: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    reference: v.optional(v.string()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const { id, ...fields } = args;
    const address = await ctx.db.get(id);
    if (!address || address.userId !== user._id) {
      throw new Error("Address not found");
    }

    if (fields.isDefault) {
      const currentDefault = await ctx.db
        .query("addresses")
        .withIndex("userDefault", (q) =>
          q.eq("userId", user._id).eq("isDefault", true)
        )
        .first();
      if (currentDefault && currentDefault._id !== id) {
        await ctx.db.patch(currentDefault._id, { isDefault: false });
      }
    }

    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("addresses") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const address = await ctx.db.get(args.id);
    if (!address || address.userId !== user._id) {
      throw new Error("Address not found");
    }

    await ctx.db.delete(args.id);
  },
});
