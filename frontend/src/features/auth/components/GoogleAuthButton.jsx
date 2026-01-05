export default function GoogleAuthButton({ children }) {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
  };

  return (
    <button
      className="
        w-full mt-3 py-3.5 px-4
        bg-white
        rounded-xl
        text-slate-700 text-base font-medium
        flex items-center justify-center gap-3
        hover:bg-slate-50
        transition-all
        shadow-sm hover:shadow-md
        active:scale-[0.98]
        border border-slate-300
        focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
      "
      onClick={handleGoogleLogin}
      type="button"
    >
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google"
        width="20"
        height="20"
      />
      {children}
    </button>
  );
}
