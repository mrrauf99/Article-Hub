export default function Button({ children, disabled, isLoading, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      style={props.style}
      className={`
        w-full py-3 px-4 rounded-xl mt-4 font-bold text-lg
        flex items-center justify-center gap-2 shadow-sm transition-all duration-200 border-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
        focus-visible:ring-offset-2 active:scale-[0.98] text-white 
        bg-gradient-to-r from-indigo-500 to-purple-600 
        ${
          disabled || isLoading
            ? "cursor-not-allowed"
            : "hover:from-indigo-600 hover:to-purple-700 hover:shadow-md"
        }
      `}
    >
      {isLoading ? (
        <>
          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          {children ? children : "Loading..."}
        </>
      ) : (
        children
      )}
    </button>
  );
}
