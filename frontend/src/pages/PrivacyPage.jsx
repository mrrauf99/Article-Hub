import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import { PRIVACY_SECTIONS } from "@/data/privacy.js";
import SEO from "@/components/SEO";
import { useLocation } from "react-router-dom";

export default function PrivacyPage() {
  const location = useLocation();

  return (
    <>
      <SEO
        title="Privacy & Data"
        description="We respect your privacy. Learn how Article Hub collects and uses data."
        canonicalPath={location.pathname}
      />
      <LegalLayout
        title="Privacy & Data"
        description="We respect your privacy. This page explains how your data is collected and used."
      >
        {PRIVACY_SECTIONS.map((section) => (
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
