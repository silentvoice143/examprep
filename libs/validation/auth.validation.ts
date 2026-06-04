import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema=z.object({
    email:z.email("Invalid email"),
    password:z.string().min(8,"Password must be at least 8 characters"),
    name:z.string().min(3,"Name must be at least 3 characters"),
    phone:z.string().min(10,"Phone must be at least 10 digits"),
    confirmPassword:z.string().min(8,"Confirm Password must be at least 8 characters"),
    agreeToTerms:z.boolean().refine((value)=>value===true,"You must agree to the terms and conditions")
})

export type SignupFormData = z.infer<typeof signupSchema>;