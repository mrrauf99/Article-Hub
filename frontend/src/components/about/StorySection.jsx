import { BookOpen } from "lucide-react";

export default function StorySection() {
  return (
    <section className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-sky-600" />
        Our Story
      </h2>

      <div className="prose prose-lg max-w-none">
        <p>
          It started with a shared frustration. As developers and content
          creators ourselves, we were tired of platforms that prioritized
          engagement over experience, quantity over quality, and ad revenue over
          user respect.
        </p>

        <p>
          We noticed something troubling: the best writers we knew were
          publishing on platforms that actively worked against them. Intrusive
          ads, algorithmic suppression, confusing interfaces, and a constant
          push toward viral content rather than valuable content.
        </p>

        <p>
          So we decided to build something different. Article Hub isn't trying
          to be the biggest platform or the most profitable. We're trying to be
          the <strong>best</strong>—for writers who care about their craft and
          readers who value their time.
        </p>

        <p>
          This is just the beginning. We're a small team with big ambitions, and
          we're building in public, learning from our community, and staying
          true to our core values every step of the way.
        </p>
      </div>
      </div>
    </section>
  );
}
