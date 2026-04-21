import { z } from "zod";

export const createAssociationSchema = z.object({
  social_number: z.string().min(2).max(100),
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  logo_url: z.string().url(),
  wilaya: z.string().min(1).max(100),
  Maps_link: z.string().url(),
  phone_number: z.string().min(8).max(20),
  social_media_links: z.record(z.string().url()).optional(),
  opening_hours: z.string().max(255).optional(),
  agreed_to_tos: z.literal(true),
});

export const updateAssociationSchema = z.object({
  social_number: z.string().min(2).max(100).optional(),
  name: z.string().min(2).max(200).optional(),
  description: z.string().min(10).optional(),
  logo_url: z.string().url().optional(),
  wilaya: z.string().min(1).max(100).optional(),
  Maps_link: z.string().url().optional(),
  phone_number: z.string().min(8).max(20).optional(),
  social_media_links: z.record(z.string().url()).optional(),
  opening_hours: z.string().max(255).optional(),
  agreed_to_tos: z.boolean().optional(),
});
