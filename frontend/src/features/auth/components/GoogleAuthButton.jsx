export default function GoogleAuthButton({ children }) {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
  };

  return (
    <button
      className="
        w-full mt-3 py-3 px-4
        bg-paper-raised
        rounded-full
        text-ink text-[0.9375rem] font-medium font-ui
        flex items-center justify-center gap-3
        hover:bg-paper
        transition-colors
        active:scale-[0.98]
        border border-hairline-strong
        focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 focus-visible:ring-offset-2
      "
      onClick={handleGoogleLogin}
      type="button"
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" role="img">
        <path
          fill="#4285F4"
          d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42Z"
        />
        <path
          fill="#34A853"
          d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.75Z"
        />
        <path
          fill="#FBBC05"
          d="M6.53 13.83A5.86 5.86 0 0 1 6.22 12c0-.64.11-1.26.31-1.83V7.64H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.36l3.24-2.53Z"
        />
        <path
          fill="#EA4335"
          d="M12 6.14c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.24 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.71 5.39l3.24 2.53c.77-2.31 2.93-4.03 5.47-4.03Z"
        />
      </svg>
      {children}
    </button>
  );
}
