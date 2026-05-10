import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'name_too_short').max(120, 'name_too_long'),
  email: z.string().trim().email('email_invalid'),
  subject: z.string().trim().min(2, 'subject_too_short').max(140, 'subject_too_long').optional().or(z.literal('')),
  message: z.string().trim().min(10, 'message_too_short').max(4000, 'message_too_long'),
  budget: z.enum(['starter', 'aerial', 'travel', 'editorial', 'custom', '']).optional(),
  // Honeypot field — must be empty. Bots will fill it.
  website: z.string().max(0).optional().or(z.literal('')),
});

export type ContactInput = z.infer<typeof contactSchema>;
