export default function Layout({ sidebar, children }) {
  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 pt-6 sm:pt-8 pb-8 sm:pb-12">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-4 md:mb-0 md:flex md:gap-6">
          <aside className="md:w-64 md:shrink-0">{sidebar}</aside>
          <section className="flex-1 min-w-0 mt-4 md:mt-0">{children}</section>
        </div>
      </div>
    </div>
  );
}
