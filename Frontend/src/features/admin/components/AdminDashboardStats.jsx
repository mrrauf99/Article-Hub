import { FileText, CheckCircle2, Clock } from "lucide-react";

export default function AdminDashboardStats({ articles = [] }) {
  const total = articles.length;
  const approved = articles.filter((a) => a.status === "approved").length;
  const pending = articles.filter((a) => a.status === "pending").length;

  const cards = [
    {
      label: "Total Articles",
      value: total,
      icon: FileText,
      accent: "border-indigo-500 text-indigo-600",
    },
    {
      label: "Approved",
      value: approved,
      icon: CheckCircle2,
      accent: "border-emerald-500 text-emerald-600",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      accent: "border-amber-500 text-amber-600",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`bg-white rounded-xl shadow-sm border-l-4 ${card.accent} px-4 py-4 flex items-center justify-between`}
          >
            <div>
              <p className="text-xs font-medium text-gray-500">{card.label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {card.value}
              </p>
            </div>
            <Icon className="w-8 h-8 opacity-80" />
          </div>
        );
      })}
    </section>
  );
}
