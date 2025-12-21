import { Loader2 } from "lucide-react";

export default function Button({ children, disabled, isLoading, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      style={props.style}
      className={`
        w-full py-3 px-4
        rounded-xl
        mt-4
        font-bold text-lg
        flex items-center justify-center gap-2
        shadow-sm
        transition-all duration-200
        border-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
        active:scale-[0.98]
        ${
          disabled || isLoading
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-md"
        }
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
          {children ? children : "Loading..."}
        </>
      ) : (
        children
      )}
    </button>
  );
}
