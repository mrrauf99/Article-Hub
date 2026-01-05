export default function Button({ children, disabled, isLoading, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      style={props.style}
      className={`
        w-full py-3.5 px-4 rounded-xl mt-6 font-semibold text-base
        flex items-center justify-center gap-2 transition-all duration-200 border-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
        focus-visible:ring-offset-2 active:scale-[0.98] text-white 
        bg-gradient-to-r from-indigo-600 to-purple-600 
        shadow-lg shadow-indigo-500/25
        ${
          disabled || isLoading
            ? "opacity-60 cursor-not-allowed"
            : "hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/30"
        }
      `}
    >
      {isLoading ? (
        <>
          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          {children ? children : "Loading..."}
        </>
      ) : (
        children
      )}
    </button>
  );
}
