import { z } from "zod";
 
export const siFormSchema = z.object({
  email: z.string().email("C'é qualcosa di strano che non va in questa email..."),
  password: z.string().min(8, "Ce l'hai troppo corta").max(50),
});

export const suFormSchema = z.object({
  name: z.string().min(5).max(50),
  surname: z.string().min(2).max(50),
  email: z.string().email("C'é qualcosa di strano che non va in questa email..."),
  password: z.string().min(8, "Ce l'hai troppo corta").max(50),
});
 
export type iFormSchema = typeof siFormSchema;
export type uFormSchema = typeof suFormSchema;