import { Mail } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function ContactHero() {
  return (
    <div className="bg-ink-950 text-paper py-16 sm:py-20 w-full font-ui">
      <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-full max-w-2xl mx-auto">
          <ScrollReveal animation="fade-up" duration={500}>
            <span className="flex mx-auto items-center justify-center w-14 h-14 rounded-full bg-paper/10 mb-6">
              <Mail className="w-6 h-6 text-paper" strokeWidth={1.75} />
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl mb-5">
              Get in touch
            </h1>
            <p className="text-lg text-paper/70 mb-2">
              Have a question or want to work together? We'd love to hear
              from you.
            </p>
            <p className="text-sm text-paper/50">
              Whether you're a writer with ideas or a reader with feedback,
              we're here to help.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
