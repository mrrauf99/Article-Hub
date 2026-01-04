import { useLoaderData, useSearchParams } from "react-router-dom";

import DashboardStats from "../components/DashboardStats";
import ArticlesSection from "@/features/articles/components/ArticlesSection";

export default function UserDashBoardPage() {
  const { articles, stats } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number(searchParams.get("page")) || 1;
  const statusParam = searchParams.get("status") || "all";

  function handlePageChange(page) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params, { preventScrollReset: true });
  }

  function handleStatusChange(status) {
    const params = new URLSearchParams(searchParams);
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.set("page", "1");
    setSearchParams(params, { preventScrollReset: true });
  }

  return (
    <>
      <DashboardStats articles={articles} stats={stats} />

      <ArticlesSection
        articles={articles}
        page={pageParam}
        onPageChange={handlePageChange}
        mode="user"
        title="My Articles"
        showCreateButton
        onCreate="/user/articles/new"
        statusFilter={statusParam}
        onStatusChange={handleStatusChange}
        showStatusFilter
      />
    </>
  );
}
