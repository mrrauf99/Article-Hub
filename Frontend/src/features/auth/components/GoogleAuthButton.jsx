export default function GoogleAuthButton({ children }) {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <button
      className="
        w-full mt-2.5 py-3 px-4
        bg-white
        rounded-xl
        text-black text-base font-medium
        flex items-center justify-center gap-3
        hover:bg-gray-50
        transition-all
        shadow-sm hover:shadow
        active:scale-[0.99]
        border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
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
