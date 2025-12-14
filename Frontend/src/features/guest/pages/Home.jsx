import Hero from "../components/Hero";
import GuestHighlights from "../components/GuestHighlights";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Hero />
        <GuestHighlights />
      </div>
    </div>
  );
}
