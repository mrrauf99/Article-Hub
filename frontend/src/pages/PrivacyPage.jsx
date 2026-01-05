import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import { PRIVACY_SECTIONS } from "@/data/privacy.js";

export default function PrivacyPage() {
  return (
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
  );
}
