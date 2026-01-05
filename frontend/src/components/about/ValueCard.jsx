export default function ValueCard({ icon: Icon, title, description }) {
  return (
    <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 bg-gradient-to-br from-sky-50 to-indigo-50 text-sky-600 rounded-xl">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
