export default function GuestLayout({ sidebar, children }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">

      <div className="mb-4 md:mb-0 md:flex md:gap-6">
    
        <div className="md:w-64 md:shrink-0">{sidebar}</div>

        <main className="flex-1 min-w-0 mt-4 md:mt-0">{children}</main>
      </div>
    </div>
  );
}
