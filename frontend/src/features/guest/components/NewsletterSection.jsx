import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  return (
    <section className="py-14 sm:py-16 bg-paper border-y border-hairline font-ui">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal animation="fade-up" duration={500}>
          <span className="flex mx-auto items-center justify-center w-11 h-11 rounded-full bg-moss-50 text-moss-700 mb-5">
            <Mail className="w-5 h-5" />
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-ink mb-2.5">
            Stay in the loop
          </h2>
          <p className="text-ink-muted mb-7">
            One email a week with the best writing on Article Hub. No spam.
          </p>

          {status === "success" ? (
            <div className="inline-flex items-center gap-2 bg-moss-50 text-moss-700 px-5 py-2.5 rounded-full font-medium text-sm">
              <CheckCircle className="w-4 h-4" />
              Thanks for subscribing!
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="flex-1 px-4 py-2.5 rounded-full border border-hairline-strong bg-paper-raised text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-moss-600/15 focus:border-moss-600 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 bg-ink hover:bg-moss-700 text-paper px-6 py-2.5 rounded-full font-semibold text-sm transition-colors disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subscribing
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          )}

          <p className="text-xs text-ink-faint mt-4">
            By subscribing, you agree to our{" "}
            <a href="/privacy" className="underline hover:text-ink-muted">
              Privacy Policy
            </a>
            . Unsubscribe anytime.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
