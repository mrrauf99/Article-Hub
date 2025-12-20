export function Field({ label, icon: Icon, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1 text-slate-700">
        {label}
      </label>

      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />

        <input
          {...props}
          className={`
            w-full pl-11 pr-4 py-3 rounded-lg border outline-none 
            transition-all duration-200 focus:border-blue-600 
            ${error ? "border-red-500" : "border-slate-300"}
          `}
        />
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
