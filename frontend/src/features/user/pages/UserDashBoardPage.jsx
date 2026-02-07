import { useMemo } from "react";
import {
  useLoaderData,
  useSearchParams,
  useRevalidator,
} from "react-router-dom";

import DashboardStats from "../components/DashboardStats";
import ArticlesSection from "@/features/articles/components/ArticlesSection";
import { calculatePagination } from "@/features/articles/utils/pagination.utils";
import Pagination from "@/features/articles/components/Pagination";
import { ScrollReveal } from "@/components/ScrollReveal";
import useScrollOnChange from "@/hooks/useScrollOnChange";

export default function UserDashBoardPage() {
  const { articles, stats } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const revalidator = useRevalidator();

  const pageParam = Number(searchParams.get("page")) || 1;
  const statusParam = searchParams.get("status") || "all";

  const { paginatedArticles, totalPages, safePage } = useMemo(
    () => calculatePagination(articles, statusParam, true, pageParam),
    [articles, statusParam, pageParam],
  );

  useScrollOnChange({
    deps: [pageParam, statusParam],
    behavior: "smooth",
    delay: 100,
  });

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

  const handleArticleDelete = () => {
    // Revalidate to refresh the data from the loader
    revalidator.revalidate();
  };

  return (
    <div className="space-y-6">
      <DashboardStats articles={articles} stats={stats} />

      <ArticlesSection
        articles={paginatedArticles}
        page={safePage}
        onPageChange={handlePageChange}
        mode="user"
        title="My Articles"
        statusFilter={statusParam}
        onStatusChange={handleStatusChange}
        showStatusFilter
        showPagination={false}
        onDelete={handleArticleDelete}
      />

      {/* Pagination - Outside Articles Section */}
      {totalPages > 1 && paginatedArticles.length > 0 && (
        <ScrollReveal animation="fade-up" duration={400}>
          <div className="flex justify-center">
            <Pagination
              current={safePage}
              total={totalPages}
              onChange={handlePageChange}
            />
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
