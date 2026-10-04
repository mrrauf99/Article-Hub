import { z } from "zod";
import {
  emailSchema,
  PASSWORD_MAX,
  PASSWORD_MIN,
  requiredTextSchema,
  usernameSchema,
} from "./common.validation.js";

export const signUpSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  name: requiredTextSchema("Name", { min: 1 }),
  country: requiredTextSchema("Country", { min: 1 }),
  password: requiredTextSchema("Password", { min: PASSWORD_MIN, max: PASSWORD_MAX }),
});

export const loginSchema = z.object({
  identifier: requiredTextSchema("Email or username", { min: 1 }),
  password: requiredTextSchema("Password", { min: 1 }),
});

export const emailAvailabilitySchema = z.object({ email: emailSchema });
export const usernameAvailabilitySchema = z.object({ username: usernameSchema });
export const googleCompleteSchema = z.object({ username: usernameSchema });

export const otpSchema = z.object({
  otp: requiredTextSchema("Verification code", { min: 1 }),
});

export const googleCredentialSchema = z.object({
  credential: z.string().min(1, "Google credential is required."),
});

export const passwordResetSchema = z.object({
  password: requiredTextSchema("Password", { min: PASSWORD_MIN, max: PASSWORD_MAX }),
});

export const twoFactorCodeSchema = z.object({
  code: requiredTextSchema("Authentication code", { min: 1 }),
});
