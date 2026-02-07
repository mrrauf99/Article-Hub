import AboutHero from "@/components/about/AboutHero";
import MissionSection from "@/components/about/MissionSection";
import StatsSection from "@/components/about/StatsSection";
import StorySection from "@/components/about/StorySection";
import ValuesSection from "@/components/about/ValuesSection";
import FoundersSection from "@/components/about/FoundersSection";
import OfferSection from "@/components/about/OfferSection";
import AboutCTA from "@/components/about/AboutCTA";
import SEO from "@/components/SEO";
import { SITE_CONFIG } from "@/config/site.config";
import { useLocation } from "react-router-dom";

export default function AboutPage() {
  const location = useLocation();

  return (
    <>
      <SEO
        title="About"
        description={`Learn about ${SITE_CONFIG.name}, our mission, and the team behind the platform.`}
        canonicalPath={location.pathname}
      />
      <AboutHero />
      <MissionSection />
      <StatsSection />
      <StorySection />
      <ValuesSection />
      <FoundersSection />
      <OfferSection />
      <AboutCTA />
    </>
  );
}
