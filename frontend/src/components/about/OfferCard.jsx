export default function OfferCard({ icon, title, text, gradient }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${gradient} p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>
      <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
        {text}
      </p>
    </div>
  );
}
