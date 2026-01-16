import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

import DashboardStats from "../components/DashboardStats";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";
import { adminApi } from "../../api/adminApi.js";

export default function AdminDashboardPage() {
  const { stats } = useLoaderData();
  const [recentData, setRecentData] = useState(null);
  const [recentLoading, setRecentLoading] = useState(true);

  useEffect(() => {
    let active = true;
    adminApi
      .getDashboardRecent()
      .then((response) => {
        if (!active) return;
        setRecentData(response.data.data);
      })
      .catch(() => {
        if (!active) return;
        setRecentData({ recentArticles: [], recentUsers: [] });
      })
      .finally(() => {
        if (!active) return;
        setRecentLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <DashboardStats stats={stats} />

      {recentLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-4 w-40 rounded bg-slate-100 animate-pulse" />
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-40 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-40 rounded-lg bg-slate-100 animate-pulse" />
          </div>
        </div>
      ) : (
        <RecentActivity
          stats={stats}
          recentArticles={recentData?.recentArticles ?? []}
          recentUsers={recentData?.recentUsers ?? []}
        />
      )}

      <QuickActions pendingCount={stats.pending_articles} />
    </div>
  );
}
