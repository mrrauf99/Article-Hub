export default function MainContainer({
  children,
  className = "",
  containerClassName = "",
}) {
  return (
    <main
      className={`w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden ${className}`}
    >
      <div className={`w-full max-w-7xl mx-auto ${containerClassName}`}>
        {children}
      </div>
    </main>
  );
}
