export default function GuestSidebar({ categories, active, onSelect }) {
  return (
    <aside className="bg-white border rounded-xl shadow-sm p-3">
      <div className="flex md:flex-col gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)} // THIS TRIGGERS FILTER
            className={`
              shrink-0 px-4 py-2 text-sm font-medium
              rounded-full md:rounded-lg
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
