import { z } from "zod";

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 64;
export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  subject: { min: 5, max: 200 },
  message: { min: 10, max: 2000 },
};

export function normalizeText(value) {
  if (typeof value !== "string") return "";
  const cleaned = value.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : "";
}

export function requiredTextSchema(fieldName, { min, max }) {
  return z.unknown().transform((value) => (typeof value === "string" ? value : "")).superRefine((value, context) => {
    const normalized = normalizeText(value);
    if (!normalized) {
      context.addIssue({ code: "custom", message: `${fieldName} is required.` });
      return;
    }
    if (min !== undefined && normalized.length < min) {
      context.addIssue({ code: "custom", message: `${fieldName} must be at least ${min} characters.` });
    }
    if (max !== undefined && normalized.length > max) {
      context.addIssue({ code: "custom", message: `${fieldName} must be at most ${max} characters.` });
    }
  });
}

export function optionalLimitedTextSchema(fieldName, max) {
  return z.string().optional().superRefine((value, context) => {
    const normalized = normalizeText(value);
    if (!normalized) return;
    if (normalized.length > max) {
      context.addIssue({ code: "custom", message: `${fieldName} must be at most ${max} characters.` });
    }
  });
}

export const emailSchema = z.unknown().transform((value) => (typeof value === "string" ? value : "")).superRefine((value, context) => {
  const normalized = normalizeText(value);
  if (!normalized) {
    context.addIssue({ code: "custom", message: "Email is required." });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    context.addIssue({ code: "custom", message: "Invalid email format." });
  }
});

export const usernameSchema = z.unknown().transform((value) => (value == null ? "" : String(value))).superRefine((value, context) => {
  if (!value) {
    context.addIssue({ code: "custom", message: "Username is required." });
    return;
  }
  if (value.length < 3) {
    context.addIssue({ code: "custom", message: "Username must be at least 3 characters." });
  }
  if (value.length > 20) {
    context.addIssue({ code: "custom", message: "Username cannot exceed 20 characters." });
  }
  if (!/^[a-z0-9_]+$/.test(value)) {
    context.addIssue({ code: "custom", message: "Username can only contain lowercase letters, numbers, and underscores." });
  }
});

function pageNumber(defaultValue, maxValue) {
  return z.preprocess((value) => {
    if (value === undefined) return defaultValue;
    const parsed = Number.parseInt(value, 10);
    if (!parsed) return defaultValue;
    return Math.min(Math.max(parsed, 1), maxValue ?? Number.MAX_SAFE_INTEGER);
  }, z.number().int().positive());
}

export const paginationQuerySchema = z.object({
  page: pageNumber(1),
  limit: pageNumber(9, 45),
});

export const articleIdSchema = z.string().regex(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  "Invalid article ID.",
);
export const userIdSchema = z.string().regex(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  "Invalid user ID.",
);

export const contactSchema = z.object({
  name: requiredTextSchema("Name", CONTACT_LIMITS.name),
  email: emailSchema,
  subject: requiredTextSchema("Subject", CONTACT_LIMITS.subject),
  message: requiredTextSchema("Message", CONTACT_LIMITS.message),
});

export function validateRequest(schema, {
  source = "body",
  status = 400,
  format = "firstMessage",
} = {}) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((issue) => issue.message);
      const response = { success: false };
      if (format === "messageArray") response.message = messages;
      else if (format === "errors") response.errors = messages;
      else if (format === "joinedMessage") response.message = messages.join(" ");
      else response.message = messages[0] ?? "Invalid request.";
      return res.status(status).json(response);
    }

    req.validated ??= {};
    req.validated[source] = parsed.data;
    if (source === "body") req.body = parsed.data;
    next();
  };
}
