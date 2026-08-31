import { useFetcher } from "react-router-dom";
import { useState, useEffect, useRef, startTransition } from "react";
import { useContactForm } from "../hooks/useContactForm";
import { ScrollReveal } from "@/components/ScrollReveal";

import { Send, CheckCircle, User, XCircle, Mail, MessageSquare } from "lucide-react";
import InputField from "@/components/InputField";

export default function ContactForm() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const [feedback, setFeedback] = useState(null);
  const lastFetcherDataRef = useRef(null);

  const { values, errors, handleChange, handleBlur, validate, reset } =
    useContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    fetcher.submit(values, { method: "post" });
  };

  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data?.success &&
      fetcher.data !== lastFetcherDataRef.current
    ) {
      lastFetcherDataRef.current = fetcher.data;
      const data = fetcher.data;
      startTransition(() => {
        setFeedback(data);
        reset();

        const t = setTimeout(() => setFeedback(null), 5000);
        return () => clearTimeout(t);
      });
    }
  }, [fetcher.state, fetcher.data, reset]);

  return (
    <ScrollReveal animation="fade-right" duration={500}>
      <div className="rounded-xl border border-hairline bg-paper-raised p-6 sm:p-8 font-ui">
        <h2 className="font-editorial text-2xl text-ink mb-1.5">
          Send us a message
        </h2>
        <p className="text-ink-muted mb-7">
          Fill out the form below and we'll get back to you as soon as
          possible.
        </p>

        <fetcher.Form method="post" onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Your name"
            icon={User}
            name="name"
            value={values.name}
            placeholder="Jordan Ellis"
            onBlur={handleBlur}
            onChange={handleChange}
            maxLength={50}
            error={errors.name}
            aria-required="true"
          />

          <InputField
            label="Email address"
            icon={Mail}
            name="email"
            type="email"
            value={values.email}
            placeholder="jordan@example.com"
            onBlur={handleBlur}
            onChange={handleChange}
            maxLength={100}
            error={errors.email}
            aria-required="true"
          />

          <InputField
            label="Subject"
            icon={MessageSquare}
            name="subject"
            value={values.subject}
            placeholder="How can we help you?"
            onBlur={handleBlur}
            onChange={handleChange}
            maxLength={120}
            error={errors.subject}
            aria-required="true"
          />

          <div className="space-y-1.5">
            <label htmlFor="message" className="block text-sm font-medium text-ink">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={values.message}
              placeholder="Tell us more about your inquiry..."
              onBlur={handleBlur}
              onChange={handleChange}
              maxLength={2000}
              aria-required="true"
              aria-invalid={Boolean(errors.message) || undefined}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={`w-full px-4 py-3 rounded-lg resize-none border outline-none transition-colors bg-paper-raised text-ink placeholder-ink-faint ${
                errors.message
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
                  : "border-hairline-strong focus:border-moss-600 focus:ring-2 focus:ring-moss-600/15"
              }`}
            />
            {errors.message && (
              <p id="message-error" className="text-sm text-red-600" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          {!feedback && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-ink text-paper py-3 rounded-full hover:bg-moss-700 disabled:opacity-60 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 focus-visible:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-paper/40 border-t-paper rounded-full" />
                  Sending message...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send message
                </>
              )}
            </button>
          )}

          {feedback && (
            <div
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
                feedback.success
                  ? "border-moss-200 bg-moss-50 text-moss-700"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {feedback.success ? (
                <CheckCircle className="h-5 w-5 text-moss-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}
        </fetcher.Form>
      </div>
    </ScrollReveal>
  );
}
