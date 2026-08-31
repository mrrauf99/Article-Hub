import { ScrollReveal } from "@/components/ScrollReveal";

export default function LegalLayout({ title, description, children }) {
  return (
    <div className="bg-paper font-ui">
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <ScrollReveal animation="fade-up" duration={500}>
          <header className="mb-10 sm:mb-12 pb-8 border-b border-hairline">
            <h1 className="font-editorial text-3xl sm:text-4xl text-ink mb-3">
              {title}
            </h1>
            <p className="text-ink-muted">{description}</p>
          </header>
        </ScrollReveal>

        <div className="space-y-9">{children}</div>
      </section>
    </div>
  );
}
