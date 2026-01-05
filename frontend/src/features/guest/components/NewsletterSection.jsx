import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal animation="scale" duration={500}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 mb-6">
            <Mail className="w-7 h-7" />
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={100} duration={600}>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Stay Updated
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Get the best articles delivered straight to your inbox. No spam,
            just quality content once a week.
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200} duration={600}>
          {status === "success" ? (
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full font-medium">
              <CheckCircle className="w-5 h-5" />
              Thanks for subscribing!
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-full font-semibold transition-colors disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          )}

          <p className="text-xs text-slate-400 mt-4">
            By subscribing, you agree to our Privacy Policy. Unsubscribe
            anytime.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
