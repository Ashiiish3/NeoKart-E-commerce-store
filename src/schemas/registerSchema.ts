import { z } from "zod";

export const registerSchema = z.object({
  userName: z
    .string()
    .min(2, "Username must be minimum 2 character.")
    .max(15, "Username must be maximum 15 character.")
    .regex(/^[A-Za-z0-9_]+$/, "Username must not contain special character."),
  fullName: z.string(),
  email: z.string().email({ message: "Invalid Email address." }).toLowerCase(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 character." })
    .max(200, { message: "Password must be 200 character." }),
});
