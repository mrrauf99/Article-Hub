import ContactHero from "../components/ContactHero";
import ContactForm from "../components/ContactForm";
import ContactInfo from "../components/ContactInfo";
import ContactStats from "../components/ContactStats";
import SEO from "@/components/SEO";
import { useLocation } from "react-router-dom";

export default function ContactPage() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Contact"
        description="Get in touch with the Article Hub team for support, partnerships, or general inquiries."
        canonicalPath={location.pathname}
      />
      {/* Hero Section */}
      <ContactHero />

      {/* Main Content */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            <ContactForm />

            <ContactInfo />
          </div>

          <ContactStats />
        </div>
      </div>
    </div>
  );
}
