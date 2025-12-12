export default function OTPTimer({ timer, canResend, isResending }) {
  if (canResend) {
    return (
      <button
        disabled={isResending}
        className="text-indigo-600 font-semibold underline underline-offset-2 hover:text-indigo-500 focus:outline-none transition-colors"
      >
        {isResending ? "Sending code…" : "Resend code"}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 text-gray-500">
      <svg
        className="w-4 h-4 mt-1 text-indigo-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p>
        Resend code in
        <span className="font-bold text-indigo-600 text-lg"> {timer}s</span>
      </p>
    </div>
  );
}
