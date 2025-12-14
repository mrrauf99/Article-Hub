const items = [
  {
    title: "Curated Content",
    text: "Discover high-quality articles across technology, design, health, and business.",
  },
  {
    title: "Creator Friendly",
    text: "Sign up to write, manage, and track your articles from one dashboard.",
  },
  {
    title: "Focused Reading",
    text: "Clean, distraction-free reading experience.",
  },
];

export default function GuestHighlights() {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        Why Article Hub?
      </h2>
      <p className="text-sm text-slate-600 mb-6 max-w-2xl">
        Built for readers and creators who value quality and simplicity.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="bg-white border rounded-xl p-4 shadow-sm"
          >
            <h3 className="font-medium mb-1">{item.title}</h3>
            <p className="text-sm text-slate-600">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
