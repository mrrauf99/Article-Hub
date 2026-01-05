import AboutHero from "@/components/about/AboutHero";
import MissionSection from "@/components/about/MissionSection";
import StatsSection from "@/components/about/StatsSection";
import StorySection from "@/components/about/StorySection";
import ValuesSection from "@/components/about/ValuesSection";
import FoundersSection from "@/components/about/FoundersSection";
import OfferSection from "@/components/about/OfferSection";
import AboutCTA from "@/components/about/AboutCTA";

export default function AboutPage() {
  return (
    <>
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
