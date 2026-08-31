export default function StorySection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20 bg-paper font-ui">
      <div className="w-full max-w-3xl mx-auto">
        <h2 className="font-editorial text-3xl sm:text-4xl text-ink mb-6">
          Our story
        </h2>

        <div className="max-w-[58ch] space-y-5 text-ink-muted leading-relaxed">
          <p>
            It started with a simple frustration. As developers and content
            creators ourselves, we were tired of platforms that prioritized
            engagement over experience, quantity over quality, and ad revenue
            over user respect. The best writers we knew were publishing on
            platforms that actively worked against them: intrusive ads,
            algorithmic suppression, confusing interfaces, and a constant
            push toward viral content rather than valuable content.
          </p>

          <p>
            So we decided to build something different. Article Hub isn't
            trying to be the biggest platform or the most profitable. We're
            trying to be the <strong className="text-ink">best</strong>, for
            writers who care about their craft and readers who value their
            time. This is just the beginning. We're a small team with big
            ambitions, building in public and learning from our community.
          </p>
        </div>
      </div>
    </section>
  );
}
