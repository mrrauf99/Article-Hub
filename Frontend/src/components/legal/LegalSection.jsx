import { ScrollReveal } from "@/components/ScrollReveal";

export default function LegalSection({ heading, content }) {
  return (
    <ScrollReveal animation="fade-up" duration={500}>
      <section>
        <h2 className="text-xl font-semibold text-slate-900 mb-3">{heading}</h2>

        {Array.isArray(content) ? (
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            {content.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-600 leading-relaxed">{content}</p>
        )}
      </section>
    </ScrollReveal>
  );
}
