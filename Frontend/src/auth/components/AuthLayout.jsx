export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="text-[1.875rem] text-center font-bold  text-indigo-600 mb-2 max-[480px]:text-[1.375rem]">
          {title}
        </h1>

        <h2 className="text-2xl my-4 text-[#333] text-center max-[480px]:text-[1.125rem]">
          {subtitle}
        </h2>
        {children}
      </div>
    </div>
  );
}
