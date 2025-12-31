import { useLoaderData } from "react-router-dom";

import DashboardStats from "../components/DashboardStats";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";

export default function AdminDashboardPage() {
  const { dashboardData } = useLoaderData();
  const { stats, recentArticles, recentUsers } = dashboardData;

  return (
    <div className="space-y-8">
      <DashboardStats stats={stats} />

      <RecentActivity
        stats={stats}
        recentArticles={recentArticles}
        recentUsers={recentUsers}
      />

      <QuickActions pendingCount={stats.pending_articles} />
    </div>
  );
}
