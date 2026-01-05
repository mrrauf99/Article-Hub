export default function Sidebar({ categories, active, onSelect }) {
  return (
    <aside
      className="
        bg-white border rounded-xl shadow-sm p-3
        md:sticky md:top-20
        md:max-h-[calc(100vh-6rem)]
        md:overflow-y-auto
      "
    >
      <div className="flex md:flex-col pt-3 pb-2 gap-3 md:gap-2 overflow-x-auto md:overflow-x-hidden">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`
              shrink-0 px-4 py-2 text-sm font-medium
              rounded-full md:rounded-lg text-left
              transition-colors
              ${
                active === cat
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>
    </aside>
  );
}
