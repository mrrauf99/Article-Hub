// Components
export { default as ArticleDetailModal } from "./components/ArticleDetailModal.jsx";
export { default as ArticlesTable } from "./components/ArticlesTable.jsx";
export { default as ConfirmDeleteModal } from "./components/ConfirmDeleteModal.jsx";
export { default as DashboardStats } from "./components/DashboardStats.jsx";
export { default as QuickActions } from "./components/QuickActions.jsx";
export { default as RecentActivity } from "./components/RecentActivity.jsx";
export { default as RoleChangeModal } from "./components/RoleChangeModal.jsx";
export { default as UsersGrid } from "./components/UsersGrid.jsx";
export {
  PillFilter,
  SearchInput,
  PageHeader,
  SimplePagination,
} from "./components/AdminFilters.jsx";

// Pages
export { default as AdminDashboardPage } from "./pages/AdminDashboardPage.jsx";
export { default as AdminArticlesPage } from "./pages/AdminArticlesPage.jsx";
export { default as AdminUsersPage } from "./pages/AdminUsersPage.jsx";

// Actions
export { adminArticlesAction } from "./actions/adminArticles.js";
export { adminUsersAction } from "./actions/adminUsers.js";

// Loaders
export { default as adminDashboardLoader } from "./loaders/adminDashboard.js";
export { default as adminArticlesLoader } from "./loaders/adminArticles.js";
export { default as adminUsersLoader } from "./loaders/adminUsers.js";
export { default as adminProfileLoader } from "./loaders/adminProfile.js";

// Utils
export { handleLoaderError, getQueryParams } from "./utils/loaderHelpers.js";
export { handleActionError, handleActionSuccess } from "./utils/actionHelpers.js";
