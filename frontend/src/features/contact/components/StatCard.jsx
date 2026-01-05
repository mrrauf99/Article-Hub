export default function StatCard({ icon: Icon, value, label, description }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-14 h-14 bg-blue-600/10 rounded-lg flex items-center justify-center">
          <Icon className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900">{value}</div>
          <div className="text-sm font-semibold text-slate-700">{label}</div>
        </div>
      </div>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}
