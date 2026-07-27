import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";
import { ROLES } from "./schema";

// ============= QUERIES =============

export const list = query({
  args: {
    category: v.optional(v.string()),
    club: v.optional(v.string()),
    decade: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
    isPromotion: v.optional(v.boolean()),
    isNew: v.optional(v.boolean()),
    isBestSeller: v.optional(v.boolean()),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let products = ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isPublished"), args.isPublished ?? true));

    if (args.category) {
      products = products.filter((q) =>
        q.eq(q.field("category"), args.category)
      );
    }
    if (args.club) {
      products = products.filter((q) => q.eq(q.field("club"), args.club));
    }
    if (args.decade) {
      products = products.filter((q) =>
        q.eq(q.field("decade"), args.decade)
      );
    }
    if (args.isPromotion) {
      products = products.filter((q) =>
        q.neq(q.field("promotionalPrice"), undefined)
      );
    }
    if (args.isNew) {
      products = products.filter((q) => q.eq(q.field("isNew"), true));
    }
    if (args.isBestSeller) {
      products = products.filter((q) => q.eq(q.field("isBestSeller"), true));
    }

    let result = await products.order("desc").take(args.limit ?? 50);

    // Search filter (client-side since Convex doesn't have full-text search built-in)
    if (args.search) {
      const term = args.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.club.toLowerCase().includes(term) ||
          p.tags?.some((t) => t.toLowerCase().includes(term)) ||
          p.country?.toLowerCase().includes(term)
      );
    }

    return result;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!product) return null;

    const images = await ctx.db
      .query("productImages")
      .withIndex("productOrder", (q) =>
        q.eq("productId", product._id)
      )
      .collect();

    const variants = await ctx.db
      .query("productVariants")
      .withIndex("productSize", (q) =>
        q.eq("productId", product._id)
      )
      .collect();

    return { ...product, images, variants };
  },
});

export const getRelated = query({
  args: {
    productId: v.id("products"),
    club: v.string(),
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .filter((q) =>
        q.and(
          q.neq(q.field("_id"), args.productId),
          q.eq(q.field("isPublished"), true),
          q.or(
            q.eq(q.field("club"), args.club),
            q.eq(q.field("category"), args.category)
          )
        )
      )
      .order("desc")
      .take(args.limit ?? 4);

    return products;
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .filter((q) =>
        q.and(
          q.eq(q.field("isPublished"), true),
          q.eq(q.field("isBestSeller"), true)
        )
      )
      .order("desc")
      .take(8);
  },
});

// ============= MUTATIONS =============

export const create = mutation({
  args: {
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
    competition: v.optional(v.string()),
    legendaryPlayers: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    decade: v.number(),
    images: v.optional(v.array(v.string())),
    variants: v.optional(
      v.array(
        v.object({
          size: v.string(),
          sku: v.string(),
          stock: v.number(),
          price: v.optional(v.number()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== ROLES.ADMIN) {
      throw new Error("Unauthorized: Admin access required");
    }

    const { images, variants, ...productData } = args;

    const productId = await ctx.db.insert("products", productData);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        await ctx.db.insert("productImages", {
          productId,
          url: images[i],
          order: i,
        });
      }
    }

    if (variants) {
      for (const variant of variants) {
        await ctx.db.insert("productVariants", {
          productId,
          ...variant,
        });
      }
    }

    return productId;
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    club: v.optional(v.string()),
    year: v.optional(v.number()),
    type: v.optional(v.string()),
    category: v.optional(v.string()),
    country: v.optional(v.string()),
    description: v.optional(v.string()),
    history: v.optional(v.string()),
    price: v.optional(v.number()),
    promotionalPrice: v.optional(v.number()),
    isNew: v.optional(v.boolean()),
    isBestSeller: v.optional(v.boolean()),
    isPromotion: v.optional(v.boolean()),
    isPublished: v.optional(v.boolean()),
    isDraft: v.optional(v.boolean()),
    competition: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    decade: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== ROLES.ADMIN) {
      throw new Error("Unauthorized: Admin access required");
    }

    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== ROLES.ADMIN) {
      throw new Error("Unauthorized: Admin access required");
    }

    await ctx.db.delete(args.id);

    // Also delete related data
    const images = await ctx.db
      .query("productImages")
      .withIndex("productId", (q) => q.eq("productId", args.id))
      .collect();
    for (const img of images) {
      await ctx.db.delete(img._id);
    }

    const variants = await ctx.db
      .query("productVariants")
      .withIndex("productId", (q) => q.eq("productId", args.id))
      .collect();
    for (const v of variants) {
      await ctx.db.delete(v._id);
    }
  },
});
