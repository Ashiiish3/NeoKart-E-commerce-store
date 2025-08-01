import { z } from "zod";

export const loginSchema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(2, "Username must be minimum 2 character.")
      .max(15, "Username must be maximum 15 character.")
      .regex(/^[A-Za-z0-9_]+$/, "Username must not contain special character.")
      .optional(),
    email: z.string().email({ message: "Invalid Email address." }).optional(),
    password: z
      .string()
      .min(6, { message: "Password must be minimum 6 letters" })
      .max(200, { message: "Password must be maximum 200 letters." }),
  })
  .refine((data) => data.userName || data.email, {
    message: "Either username or email is required.",
    path: ["email", "username"],
  });
