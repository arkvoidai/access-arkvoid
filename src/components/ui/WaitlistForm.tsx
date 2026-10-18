import React, { useId, useRef, useState } from 'react';
import { SITE, WAITLIST_ENDPOINT } from '../../config/site.config';
import { CONTENT } from '../../content/site';
import { Button } from './Button';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const WaitlistForm: React.FC = () => {
  const inputId = useId();
  const errorId = useId();
  const honeypotId = useId();

  const [email, setEmail] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [usedMailto, setUsedMailto] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Hidden honeypot check: silently pretend success if filled
    if (honeypot.trim().length > 0) {
      setUsedMailto(false);
      setStatus('success');
      return;
    }

    const trimmed = email.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
      setErrorMessage(CONTENT.join.form.errorInvalid);
      setStatus('error');
      inputRef.current?.focus();
      return;
    }

    setErrorMessage('');

    if (WAITLIST_ENDPOINT.trim().length > 0) {
      setStatus('submitting');
      try {
        const res = await fetch(WAITLIST_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed, source: 'arkvoid.com' }),
        });

        if (!res.ok) {
          throw new Error('Request failed');
        }

        setUsedMailto(false);
        setStatus('success');
      } catch {
        setErrorMessage(CONTENT.join.form.errorNetwork);
        setStatus('error');
      }
      return;
    }

    // Empty WAITLIST_ENDPOINT -> open mailto in visitor's email client
    const encodedEmail = encodeURIComponent(trimmed);
    const mailtoHref = `mailto:${SITE.email}?subject=Arkvoid%20waitlist&body=Please%20add%20me%20to%20the%20Arkvoid%20waitlist.%0D%0A%0D%0AMy%20email%3A%20${encodedEmail}`;

    const link = document.createElement('a');
    link.href = mailtoHref;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setUsedMailto(true);
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mx-auto w-full max-w-[620px] rounded-[28px] border border-line bg-[#FFFFFF] p-6 sm:p-8 shadow-soft transition-all duration-500 ease-expo-out"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <circle
              cx="22"
              cy="22"
              r="20"
              stroke="var(--ember)"
              strokeWidth="2"
            />
            <path
              d="M14 22.5L19.5 28L30 16.5"
              stroke="var(--ember)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div>
            <h3 className="font-sans text-[22px] font-medium tracking-[-0.02em] text-ink">
              {CONTENT.join.form.successTitle}
            </h3>
            <p className="mt-1 text-[16px] text-ink-soft">
              {usedMailto
                ? CONTENT.join.form.successSubMailto
                : CONTENT.join.form.successSubEndpoint}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto w-full max-w-[620px] text-left"
    >
      {/* Honeypot field hidden from human visitors and screen readers */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={honeypotId}>Company website</label>
        <input
          id={honeypotId}
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <label
        htmlFor={inputId}
        className="mb-2.5 block pl-4 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.14em] text-ink-soft"
      >
        {CONTENT.join.form.label}
      </label>

      <div className="flex flex-col gap-3 sm:relative sm:flex-row sm:items-center">
        <input
          ref={inputRef}
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder={CONTENT.join.form.placeholder}
          value={email}
          aria-invalid={status === 'error'}
          aria-describedby={status === 'error' ? errorId : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') {
              setStatus('idle');
              setErrorMessage('');
            }
          }}
          className="h-[68px] w-full rounded-full border border-line bg-[#FFFFFF] pl-7 pr-7 sm:pr-[240px] text-[18px] text-ink placeholder:text-ink-soft/50 shadow-soft transition-colors focus:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-violet-deep"
        />

        <div className="sm:absolute sm:right-1.5 sm:top-1.5 sm:bottom-1.5 flex">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon="arrow"
            disabled={status === 'submitting'}
            className="w-full sm:w-auto h-[56px]"
          >
            {CONTENT.join.form.submitLabel}
          </Button>
        </div>
      </div>

      {/* Inline accessible error state with icon and text */}
      {status === 'error' && errorMessage && (
        <div
          id={errorId}
          role="alert"
          className="mt-3 flex items-start gap-2.5 pl-4 text-[15px] text-ember-deep"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
            className="mt-0.5 shrink-0"
          >
            <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="9" y1="5.5" x2="9" y2="9.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="9" cy="12.5" r="1" fill="currentColor" />
          </svg>
          <div>
            <span>{errorMessage}</span>
            {errorMessage === CONTENT.join.form.errorNetwork && (
              <>
                {' '}
                <a
                  href={`mailto:${SITE.email}?subject=Arkvoid%20waitlist`}
                  className="underline text-violet-deep font-medium"
                >
                  Email {SITE.email}
                </a>
              </>
            )}
          </div>
        </div>
      )}

      <p className="mt-3 text-center font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
        {CONTENT.join.form.smallPrint}
      </p>
    </form>
  );
};
