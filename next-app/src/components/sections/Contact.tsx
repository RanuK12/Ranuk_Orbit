'use client';

import { useTranslations } from 'next-intl';
import { useFormState, useFormStatus } from 'react-dom';
import { submitContact, type ContactState } from '@/actions/contact';
import { SOCIAL_LINKS } from '@/data/content';
import { cn } from '@/lib/utils';

const initialState: ContactState = { status: 'idle' };

function SubmitBtn({ label, sendingLabel }: { label: string; sendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn('btn-pill btn-pill--primary', pending && 'opacity-70 cursor-wait')}
    >
      {pending ? sendingLabel : label}
      <span aria-hidden="true">→</span>
    </button>
  );
}

export default function Contact() {
  const t = useTranslations('contact');
  const [state, action] = useFormState(submitContact, initialState);

  const errMsg = (key: 'name' | 'email' | 'message'): string | undefined => {
    const code = state.errors?.[key];
    if (!code) return undefined;
    switch (key) {
      case 'name':
        return t('errorNameShort');
      case 'email':
        return t('errorEmailInvalid');
      case 'message':
        return t('errorMessageShort');
      default:
        return code;
    }
  };

  return (
    <section id="contact" className="section">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <div aria-hidden="true" className="mx-auto mb-6 h-12 w-px bg-celestial/40" />
        <p className="text-overline mb-3">{t('overline')}</p>
        <h2 className="section-title">{t('title1')}<br /><span className="font-italic italic text-desert">{t('title2')}</span></h2>
        <p className="section-sub mx-auto">{t('sub')}</p>
      </div>

      <form action={action} className="max-w-2xl mx-auto corner-brackets p-8 md:p-12 relative" aria-live="polite" noValidate>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="c-name" className="form-label">{t('labelName')}</label>
            <div className="form-field">
              <input id="c-name" name="name" type="text" autoComplete="name" required aria-describedby={errMsg('name') ? 'err-name' : undefined} aria-invalid={Boolean(errMsg('name'))} />
            </div>
            {errMsg('name') && <p id="err-name" role="alert" className="mt-2 text-xs text-red-400">{errMsg('name')}</p>}
          </div>
          <div>
            <label htmlFor="c-email" className="form-label">{t('labelEmail')}</label>
            <div className="form-field">
              <input id="c-email" name="email" type="email" autoComplete="email" required aria-describedby={errMsg('email') ? 'err-email' : undefined} aria-invalid={Boolean(errMsg('email'))} />
            </div>
            {errMsg('email') && <p id="err-email" role="alert" className="mt-2 text-xs text-red-400">{errMsg('email')}</p>}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="c-subject" className="form-label">{t('labelSubject')}</label>
          <div className="form-field">
            <input id="c-subject" name="subject" type="text" />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="c-message" className="form-label">{t('labelMessage')}</label>
          <div className="form-field">
            <textarea id="c-message" name="message" rows={5} required aria-describedby={errMsg('message') ? 'err-msg' : undefined} aria-invalid={Boolean(errMsg('message'))} />
          </div>
          {errMsg('message') && <p id="err-msg" role="alert" className="mt-2 text-xs text-red-400">{errMsg('message')}</p>}
        </div>

        <div className="mt-6">
          <label htmlFor="c-budget" className="form-label">{t('labelBudget')}</label>
          <div className="form-field">
            <select id="c-budget" name="budget" defaultValue="">
              <option value="">{t('budgetPlaceholder')}</option>
              <option value="starter">{t('budgetStarter')}</option>
              <option value="aerial">{t('budgetAerial')}</option>
              <option value="travel">{t('budgetTravel')}</option>
              <option value="editorial">{t('budgetEditorial')}</option>
              <option value="custom">{t('budgetCustom')}</option>
            </select>
          </div>
        </div>

        {/* Honeypot — hidden from humans, visible to bots */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px opacity-0" />

        <div className="mt-10 flex items-center justify-between gap-4 flex-wrap">
          <SubmitBtn label={t('submit')} sendingLabel={t('submitting')} />
          {state.status === 'success' && <p role="status" className="font-italic italic text-desert">{t('success')}</p>}
          {state.status === 'error' && !state.errors && <p role="alert" className="text-red-400 text-sm">{t('error')}</p>}
        </div>
      </form>

      <div className="mt-16 max-w-2xl mx-auto border-t border-line pt-10 text-center">
        <p className="text-overline mb-5">{t('directTitle')}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={`mailto:${SOCIAL_LINKS.email}`} className="btn-pill">{t('email')}</a>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="btn-pill">{t('instagram')}</a>
          <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-pill">{t('whatsapp')}</a>
        </div>
      </div>
    </section>
  );
}
