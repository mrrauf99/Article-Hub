export default function FounderCard({ founder }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <img
        src={founder.avatar}
        alt={founder.name}
        className="h-24 w-24 rounded-xl mb-4 object-cover"
      />

      <h3 className="text-xl font-bold text-slate-800">{founder.name}</h3>

      <p className="text-sky-600 font-medium">{founder.role}</p>

      <p className="text-slate-600 mt-3 leading-relaxed">{founder.bio}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        {founder.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-100 text-sky-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
