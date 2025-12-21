export default function AuthLayout({
  title,
  subtitle,
  children,
  subtitleStyle,
}) {
  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gradient-to-br
     from-indigo-50 via-indigo-100 to-purple-50"
    >
      <div className="w-full max-w-xl p-5">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 max-[480px]:p-5">
          <h1 className="text-[1.875rem] text-center font-bold  text-indigo-600 max-[480px]:text-[1.375rem]">
            {title}
          </h1>

          <h2
            style={subtitleStyle}
            className="text-2xl mt-2 mb-4 text-[#333] text-center max-[480px]:text-[1.125rem]"
          >
            {subtitle}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
}
