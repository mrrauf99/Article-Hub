import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import { TERMS_SECTIONS } from "@/data/terms.js";

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Use"
      description="These terms define how Article Hub can be used."
    >
      {TERMS_SECTIONS.map((section) => (
        <LegalSection
          key={section.heading}
          heading={section.heading}
          content={section.content}
        />
      ))}
    </LegalLayout>
  );
}
