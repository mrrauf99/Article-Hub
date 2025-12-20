export default function Layout({ sidebar, children }) {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
      <div className="mb-4 md:mb-0 md:flex md:gap-6">
        <aside className="md:w-64 md:shrink-0">{sidebar}</aside>
        <section className="flex-1 min-w-0 mt-4 md:mt-0">{children}</section>
      </div>
    </div>
  );
}
