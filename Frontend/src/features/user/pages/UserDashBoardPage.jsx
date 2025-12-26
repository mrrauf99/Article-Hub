import { useLoaderData, useSearchParams } from "react-router-dom";

import DashboardStats from "../components/DashboardStats";
import ArticlesSection from "@/features/articles/components/ArticlesSection";

export default function UserDashBoardPage() {
  const { articles } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number(searchParams.get("page")) || 1;

  function handlePageChange(page) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  }

  return (
    <>
      <DashboardStats articles={articles} />

      <ArticlesSection
        articles={articles}
        page={pageParam}
        onPageChange={handlePageChange}
        mode="user"
        title="My Articles"
        showCreateButton
        onCreate="/user/articles/new"
      />
    </>
  );
}
