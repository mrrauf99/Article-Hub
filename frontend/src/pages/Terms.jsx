import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import { TERMS_SECTIONS } from "@/data/terms.js";
import SEO from "@/components/SEO";
import { useLocation } from "react-router-dom";

export default function TermsPage() {
  const location = useLocation();

  return (
    <>
      <SEO
        title="Terms of Use"
        description="Review the terms that govern use of Article Hub."
        canonicalPath={location.pathname}
      />
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
    </>
  );
}
