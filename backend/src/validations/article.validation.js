import { z } from "zod";
import { paginationQuerySchema, requiredTextSchema } from "./common.validation.js";

export const articleWriteSchema = z.object({
  title: requiredTextSchema("Title", { min: 20, max: 150 }),
  introduction: requiredTextSchema("Introduction", { min: 150, max: 1000 }),
  content: requiredTextSchema("Content", { min: 600, max: 20000 }),
  summary: requiredTextSchema("Summary", { min: 80, max: 500 }),
  category: requiredTextSchema("Category", { min: 1 }),
});

export const approvedArticlesQuerySchema = paginationQuerySchema.extend({
  category: z.string().optional(),
});

export const adminArticlesQuerySchema = paginationQuerySchema.extend({
  status: z.string().default("all"),
  search: z.string().default(""),
});

export const adminUsersQuerySchema = paginationQuerySchema.extend({
  role: z.string().default("all"),
  search: z.string().default(""),
});

export const reasonSchema = z.object({
  reason: z.string().trim().min(1, "Rejection reason is required."),
});

export const deletionReasonSchema = z.object({
  reason: z.string().trim().min(1, "Deletion reason is required."),
});
