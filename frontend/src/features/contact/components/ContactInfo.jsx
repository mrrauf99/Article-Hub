import { Clock } from "lucide-react";
import ContactInfoItem from "./ContactInfoItem";
import { CONTACT_INFO } from "../data/contactInfo";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function ContactInfo() {
  return (
    <div className="space-y-6 font-ui">
      <ScrollReveal animation="fade-left" duration={500}>
        <div className="rounded-xl border border-hairline bg-paper-raised p-6 sm:p-8">
          <h2 className="font-editorial text-2xl text-ink mb-1.5">
            Contact information
          </h2>
          <p className="text-ink-muted mb-6">
            Reach out through any of these channels.
          </p>

          <div className="divide-y divide-hairline">
            {CONTACT_INFO.map((item) => (
              <ContactInfoItem key={item.title} {...item} />
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-left" delay={120} duration={500}>
        <div className="rounded-xl bg-ink-950 p-6 sm:p-8 text-paper">
          <h3 className="font-editorial text-xl mb-2">Quick response</h3>
          <div className="flex items-center gap-2 text-paper/65 text-sm">
            <Clock className="w-4 h-4" />
            <span>We aim to reply within 24 hours, every message read personally.</span>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
