
export default function CategorySidebar({ categories, active, onSelect }) {
  return (
    <nav className="space-y-1">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`block w-full text-left px-3 py-2 rounded-lg text-sm
            ${
              active === cat
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "hover:bg-slate-50"
            }`}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}
