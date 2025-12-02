import DashboardStats from "./DashboardStats";
import ArticlesSection from "../../../../components/ArticlesSection";

export default function Main({ initialArticles }) {
  return (
    <>
      <DashboardStats articles={initialArticles} />

      <ArticlesSection
        initialArticles={initialArticles}
        mode="user"
        title="My Articles"
        showCreateButton
        createLabel="+ Create New Article"
        onCreate={() => {
          alert("Create New Article clicked");
        }}
      />
    </>
  );
}
