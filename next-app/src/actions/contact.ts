'use server';

import { contactSchema } from '@/lib/validations';

export interface ContactState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  errors?: Partial<Record<'name' | 'email' | 'subject' | 'message' | 'budget', string>>;
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    subject: String(formData.get('subject') ?? ''),
    message: String(formData.get('message') ?? ''),
    budget: String(formData.get('budget') ?? '') as ContactState['errors'] extends object ? never : never,
    website: String(formData.get('website') ?? ''), // honeypot
  };

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    const errs: NonNullable<ContactState['errors']> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState['errors']> | undefined;
      if (key) errs[key] = issue.message;
    }
    return { status: 'error', message: 'validation', errors: errs };
  }

  // Honeypot: silently succeed (don't tip off the bot).
  if (parsed.data.website && parsed.data.website.length > 0) {
    return { status: 'success', message: 'sent' };
  }

  // Real delivery would go here (Resend, SendGrid, Postmark, SMTP, etc.).
  // For now we log server-side and return success; the user configures this.
  console.info('[contact] new lead', {
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    budget: parsed.data.budget,
    length: parsed.data.message.length,
  });

  return { status: 'success', message: 'sent' };
}
