import { useFetcher } from "react-router-dom";
import { useState, useEffect, useRef, startTransition } from "react";
import { useContactForm } from "../hooks/useContactForm";
import { ScrollReveal } from "@/components/ScrollReveal";

import {
  Send,
  CheckCircle,
  User,
  XCircle,
  Mail,
  MessageSquare,
} from "lucide-react";
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
    <ScrollReveal animation="fade-right" duration={600}>
      <div className="bg-white rounded-2xl border border-slate-200 p-8 w-full">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Send us a Message
        </h2>

        <p className="text-slate-600 mb-8">
          Fill out the form below and we'll get back to you as soon as possible.
        </p>

        <fetcher.Form
          method="post"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <InputField
            label="Your Name"
            icon={User}
            name="name"
            value={values.name}
            placeholder="John Doe"
            onBlur={handleBlur}
            onChange={handleChange}
            maxLength={50}
            error={errors.name}
          />

          <InputField
            label="Email Address"
            icon={Mail}
            name="email"
            type="email"
            value={values.email}
            placeholder="john@example.com"
            onBlur={handleBlur}
            onChange={handleChange}
            maxLength={100}
            error={errors.email}
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
          />

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-700">
              Message
            </label>
            <textarea
              name="message"
              rows="5"
              value={values.message}
              placeholder="Tell us more about your inquiry..."
              onBlur={handleBlur}
              onChange={handleChange}
              maxLength={2000}
              className={`w-full px-4 py-3 rounded-lg resize-none border outline-none focus:border-blue-600 
            transition-all duration-200
            ${errors.message ? "border-red-500" : "border-slate-300"}
          `}
            />
            {errors.message && (
              <p className="text-sm text-red-600 mt-1">{errors.message}</p>
            )}
          </div>

          {!feedback && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 
        disabled:bg-blue-400 disabled:cursor-not-allowed
          font-semibold flex items-center justify-center gap-2 
          transition-colors duration-200 focus:outline-none focus-visible:ring-2
         focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Sending message...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>
          )}

          {/* FEEDBACK */}
          {feedback && (
            <div
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
                feedback.success
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {feedback.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
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
