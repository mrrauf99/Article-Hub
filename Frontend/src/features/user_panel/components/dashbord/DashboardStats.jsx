import { FileText, Clock, CheckCircle } from "lucide-react";

export default function DashboardStats({ articles = [] }) {
  const total = articles.length;
  const approved = articles.filter((a) => a.status === "approved").length;
  const pending = articles.filter((a) => a.status === "pending").length;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        label="Total Articles"
        value={total}
        Icon={FileText}
        borderClass="border-indigo-600"
        iconClass="text-indigo-600"
      />
      <StatCard
        label="Approved"
        value={approved}
        Icon={CheckCircle}
        borderClass="border-green-600"
        iconClass="text-green-600"
      />
      <StatCard
        label="Pending"
        value={pending}
        Icon={Clock}
        borderClass="border-yellow-600"
        iconClass="text-yellow-600"
      />
    </section>
  );
}

function StatCard({ label, value, Icon, borderClass, iconClass }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${borderClass}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <Icon className={`w-10 h-10 ${iconClass} opacity-80`} />
      </div>
    </div>
  );
}
