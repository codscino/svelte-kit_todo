import { z } from "zod";
 
export const siFormSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

export const suFormSchema = z.object({
  name: z.string().min(2).max(50),
  surname: z.string().min(2).max(50),
  email: z.string().email().min(2).max(50),
  password: z.string().min(2).max(50),
});
 
export type FormSchema = typeof siFormSchema;
export type ExtendedFormSchema = typeof suFormSchema;