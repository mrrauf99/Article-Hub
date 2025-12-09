export default function Button({ children, disabled, isLoading, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      style={props.style}
      className={`
        w-full py-3 px-4
        rounded-xl
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
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children ? children : "Loading..."}
        </>
      ) : (
        children
      )}
    </button>
  );
}
