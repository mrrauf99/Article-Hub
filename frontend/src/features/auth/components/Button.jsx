export default function Button({ children, disabled, isLoading, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      style={props.style}
      className={`
        w-full py-3 px-4 rounded-full mt-6 font-semibold text-[0.9375rem] font-ui
        flex items-center justify-center gap-2 transition-colors border-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-600
        focus-visible:ring-offset-2 active:scale-[0.98] text-paper
        bg-ink
        ${
          disabled || isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-moss-700"
        }
      `}
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
          {children ? children : "Loading..."}
        </>
      ) : (
        children
      )}
    </button>
  );
}
