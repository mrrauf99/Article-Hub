import { Clock } from "lucide-react";

export default function OTPTimer({ timer, canResend, isResending }) {
  if (canResend) {
    return (
      <button
        disabled={isResending}
        className="text-indigo-600 font-semibold underline underline-offset-2
                   hover:text-indigo-500 focus:outline-none transition-colors"
      >
        {isResending ? "Sending code…" : "Resend code"}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 text-gray-500">
      <Clock className="w-4 h-4 text-indigo-500 mt-[3px]" />

      <p>
        Resend code in
        <span className="ml-1 font-bold text-indigo-600 text-lg">{timer}s</span>
      </p>
    </div>
  );
}
