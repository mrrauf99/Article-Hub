import { z } from "zod";
import {
  normalizeText,
  PASSWORD_MAX,
  PASSWORD_MIN,
  optionalLimitedTextSchema,
} from "./common.validation.js";

const optionalProfileString = z.string().optional();
const urlFields = [
  ["portfolio_url", "Portfolio"],
  ["linkedin_url", "LinkedIn"],
  ["x_url", "X (Twitter)"],
  ["instagram_url", "Instagram"],
  ["facebook_url", "Facebook"],
];

export const profileSchema = z.object({
  name: optionalProfileString.superRefine((value, context) => {
    if (value === undefined) return;
    const normalized = normalizeText(value);
    if (!normalized) context.addIssue({ code: "custom", message: "Name is required." });
    else if (normalized.length < 2) context.addIssue({ code: "custom", message: "Name must be at least 2 characters." });
    else if (normalized.length > 100) context.addIssue({ code: "custom", message: "Name must be at most 100 characters." });
  }),
  bio: optionalLimitedTextSchema("Bio", 500),
  expertise: optionalLimitedTextSchema("Expertise", 100),
  portfolio_url: optionalProfileString,
  linkedin_url: optionalProfileString,
  x_url: optionalProfileString,
  instagram_url: optionalProfileString,
  facebook_url: optionalProfileString,
  gender: optionalProfileString,
  country: optionalProfileString,
}).superRefine((profile, context) => {
  if (profile.gender?.trim() && !["male", "female", "other", "prefer_not_to_say"].includes(profile.gender.toLowerCase())) {
    context.addIssue({ code: "custom", path: ["gender"], message: "Please choose a gender option from the list." });
  }

  for (const [field, label] of urlFields) {
    const value = profile[field];
    if (!value?.trim()) continue;
    try {
      const url = new URL(value);
      if (url.protocol === "http:" || url.protocol === "https:") continue;
    } catch {
      // The validation issue below keeps the field-specific API message.
    }
    context.addIssue({
      code: "custom",
      path: [field],
      message: `Enter a full web address for ${label}, starting with https://.`,
    });
  }

});

const bodyString = z.unknown().transform((value) => (typeof value === "string" ? value : ""));

export const changePasswordSchema = z.object({
  currentPassword: bodyString,
  newPassword: bodyString,
}).superRefine(({ currentPassword, newPassword }, context) => {
  if (!currentPassword || !newPassword) {
    context.addIssue({ code: "custom", message: "Current and new password are required." });
  } else if (newPassword.length < PASSWORD_MIN || newPassword.length > PASSWORD_MAX) {
    context.addIssue({ code: "custom", message: "Password must be between 8 and 64 characters." });
  }
});

export const twoFactorSetupSchema = z.object({
  password: z.string().min(1, "Password is required to enable 2FA."),
});

export const twoFactorCodeSchema = z.object({
  code: z.string().min(1, "Authentication code is required."),
});

export const twoFactorDisableSchema = z.object({
  password: z.string().min(1, "Password and authentication code are required."),
  code: z.string().min(1, "Password and authentication code are required."),
});
