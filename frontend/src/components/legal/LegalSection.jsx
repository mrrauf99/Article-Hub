import { ScrollReveal } from "@/components/ScrollReveal";

export default function LegalSection({ heading, content }) {
  return (
    <ScrollReveal animation="fade-up" duration={450}>
      <section>
        <h2 className="text-lg font-semibold text-ink mb-2.5">{heading}</h2>

        {Array.isArray(content) ? (
          <ul className="list-disc pl-5 space-y-1.5 text-ink-muted">
            {content.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-muted leading-relaxed">{content}</p>
        )}
      </section>
    </ScrollReveal>
  );
}
