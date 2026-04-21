import { z } from "zod";

export const createDonationProjectSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10),
  image_url: z.string().url(),
  goal_amount: z.number().positive(),
  current_amount: z.number().min(0).optional(),
  max_date: z.string().datetime().optional(),
});

export const updateDonationProjectSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().min(10).optional(),
  image_url: z.string().url().optional(),
  goal_amount: z.number().positive().optional(),
  current_amount: z.number().min(0).optional(),
  max_date: z.string().datetime().nullable().optional(),
});
