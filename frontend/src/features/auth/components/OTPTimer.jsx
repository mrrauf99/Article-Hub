import { Clock } from "lucide-react";

export default function OTPTimer({ timer, canResend, isResending }) {
  if (canResend) {
    return (
      <button
        disabled={isResending}
        className="text-sm font-semibold text-moss-700 underline underline-offset-4
                   hover:text-moss-800 focus:outline-none transition-colors font-ui disabled:opacity-60"
      >
        {isResending ? "Sending code..." : "Resend code"}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-ink-muted font-ui">
      <Clock className="w-4 h-4 text-ink-faint" />
      <p>
        Resend code in
        <span className="ml-1 font-semibold text-ink">{timer}s</span>
      </p>
    </div>
  );
}
