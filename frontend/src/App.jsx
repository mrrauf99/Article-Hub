import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import PageLoader from "./components/PageLoader.jsx";

// Auth - Critical (keep static)
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import SignUpPage from "./features/auth/pages/SignUpPage.jsx";

// Auth - Secondary (lazy load)
const ForgotPasswordPage = lazy(
  () => import("./features/auth/pages/ForgotPasswordPage.jsx"),
);
const ResetPasswordPage = lazy(
  () => import("./features/auth/pages/PasswordResetPage.jsx"),
);
const TwoFactorPage = lazy(
  () => import("./features/auth/pages/TwoFactorPage.jsx"),
);
const OTPVerificationFormPage = lazy(
  () => import("./features/auth/pages/OTPVerificationFormPage.jsx"),
);
const CompleteProfile = lazy(
  () => import("./features/auth/pages/CompleteProfile.jsx"),
);

import loginAction from "./features/auth/actions/login";
import signUpAction from "./features/auth/actions/signUp";
import otpAction from "./features/auth/actions/otp";
import forgotPasswordAction from "./features/auth/actions/forgotPassword";
import resetPasswordAction from "./features/auth/actions/passwordReset";
import verifyTwoFactorLoginAction from "./features/auth/actions/verifyTwoFactorLogin.js";
import completeProfileAction from "./features/auth/actions/completeProfile.js";

import completeProfileLoader from "./features/auth/loaders/completeProfile.js";
import resetPasswordLoader from "./features/auth/loaders/passwordReset.js";
import twoFactorSessionLoader from "./features/auth/loaders/twoFactorSession.js";
import verifyOtpPageLoader from "./features/auth/loaders/verifyOtpPage.js";

// Public - Critical (keep static)
import HomePage from "./features/guest/pages/HomePage.jsx";

// Public - Static pages (lazy load)
const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const ContactPage = lazy(
  () => import("./features/contact/pages/ContactPage.jsx"),
);
const PrivacyPage = lazy(() => import("./pages/PrivacyPage.jsx"));
const TermsPage = lazy(() => import("./pages/Terms.jsx"));

import submitContactAction from "./features/contact/actions/submitContact.js";
import publicLayoutLoader from "./loaders/publicLayout.js";
import homePageLoader from "./features/guest/loaders/homePage.js";
import publicArticlesLoader from "./features/articles/loaders/publicArticles.js";

// User - All lazy loaded (require auth)
const UserDashBoardPage = lazy(
  () => import("./features/user/pages/UserDashBoardPage.jsx"),
);
const CreateArticlePage = lazy(
  () => import("./features/user/pages/CreateArticlePage.jsx"),
);
const ExploreArticlesPage = lazy(
  () => import("./features/user/pages/ExploreArticlesPage.jsx"),
);

import editArticleLoader from "./features/user/loaders/editArticle.js";
import myArticlesLoader from "./features/user/loaders/myArticles.js";
import userProfileLoader from "./features/user/loaders/profile.js";

import createArticleAction from "./features/user/actions/createArticle.js";

// Profile - Lazy loaded (shared by admin and user)
const ProfilePage = lazy(
  () => import("./features/profile/pages/ProfilePage.jsx"),
);
import profileStatsLoader from "./features/profile/loaders/profileStats.js";
import updateProfileAction from "./features/profile/actions/updateProfile.js";

// Admin - All lazy loaded (admin only)
const AdminDashboardPage = lazy(
  () => import("./features/admin/pages/AdminDashboardPage.jsx"),
);
const AdminArticlesPage = lazy(
  () => import("./features/admin/pages/AdminArticlesPage.jsx"),
);
const AdminUsersPage = lazy(
  () => import("./features/admin/pages/AdminUsersPage.jsx"),
);
const AdminUserProfilePage = lazy(
  () => import("./features/admin/pages/AdminUserProfilePage.jsx"),
);

// ErrorPage - lazy loaded, needs its own Suspense (no layout wraps it)
const ErrorPage = lazy(() => import("./pages/ErrorPage.jsx"));

import adminProfileLoader from "./features/admin/loaders/profile.js";
import adminDashboardLoader from "./features/admin/loaders/dashboard.js";
import adminArticlesLoader from "./features/admin/loaders/articles.js";
import adminUsersLoader from "./features/admin/loaders/users.js";
import adminUserDetailsLoader from "./features/admin/loaders/userDetails.js";
import { adminArticlesAction } from "./features/admin/actions/adminArticles.js";
import { adminUsersAction } from "./features/admin/actions/adminUsers.js";

// Layouts — each layout owns a <Suspense> around its <Outlet />
import PublicLayout from "./layouts/PublicLayout.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";

import ArticleDetailPage from "./features/articles/pages/ArticleDetailPage.jsx";
import articleDetailLoader from "./features/articles/loaders/articleDetail.js";

import "./index.css";

const router = createBrowserRouter([
  {
    errorElement: (
      <Suspense fallback={<PageLoader />}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      /* ---------- PUBLIC ---------- */
      {
        id: "public-layout",
        element: <PublicLayout />,
        loader: publicLayoutLoader,
        children: [
          {
            index: true, // "/"
            element: <HomePage />,
            loader: homePageLoader,
          },
          {
            path: "about",
            element: <AboutPage />,
          },
          {
            path: "contact",
            element: <ContactPage />,
            action: submitContactAction,
          },
          {
            path: "privacy",
            element: <PrivacyPage />,
          },
          {
            path: "terms",
            element: <TermsPage />,
          },
          {
            path: "articles/:id",
            element: <ArticleDetailPage />,
            loader: articleDetailLoader,
          },
        ],
      },

      /* ---------- AUTH ---------- */
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
            action: loginAction,
          },
          {
            path: "/register",
            element: <SignUpPage />,
            action: signUpAction,
          },
          {
            path: "/verify-otp",
            element: <OTPVerificationFormPage />,
            action: otpAction,
            loader: verifyOtpPageLoader,
          },
          {
            path: "/forgot-password",
            element: <ForgotPasswordPage />,
            action: forgotPasswordAction,
          },
          {
            path: "/reset-password",
            element: <ResetPasswordPage />,
            action: resetPasswordAction,
            loader: resetPasswordLoader,
          },
          {
            path: "/two-factor",
            element: <TwoFactorPage />,
            action: verifyTwoFactorLoginAction,
            loader: twoFactorSessionLoader,
          },
          {
            path: "/complete-profile",
            element: <CompleteProfile />,
            action: completeProfileAction,
            loader: completeProfileLoader,
          },
        ],
      },

      /* ---------- USER ---------- */
      {
        id: "user-layout",
        path: "/user",
        element: <UserLayout />,
        loader: userProfileLoader,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <UserDashBoardPage />,
            loader: myArticlesLoader,
          },
          {
            path: "articles",
            children: [
              {
                index: true,
                element: <ExploreArticlesPage />,
                loader: publicArticlesLoader,
              },
              {
                path: "new",
                element: <CreateArticlePage />,
                action: createArticleAction,
              },
              {
                path: ":id/edit",
                element: <CreateArticlePage />,
                loader: editArticleLoader,
                action: createArticleAction,
              },
              {
                path: ":id",
                element: <ArticleDetailPage />,
                loader: articleDetailLoader,
              },
            ],
          },
          {
            path: "profile",
            element: <ProfilePage />,
            loader: profileStatsLoader,
            action: updateProfileAction,
          },
        ],
      },

      /* ---------- ADMIN ---------- */
      {
        id: "admin-layout",
        path: "/admin",
        element: <AdminLayout />,
        loader: adminProfileLoader,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <AdminDashboardPage />,
            loader: adminDashboardLoader,
          },
          {
            path: "articles",
            element: <AdminArticlesPage />,
            loader: adminArticlesLoader,
            action: adminArticlesAction,
          },
          {
            path: "articles/:id",
            element: <ArticleDetailPage />,
            loader: articleDetailLoader,
          },
          {
            path: "users",
            element: <AdminUsersPage />,
            loader: adminUsersLoader,
            action: adminUsersAction,
          },
          {
            path: "users/:userId",
            element: <AdminUserProfilePage />,
            loader: adminUserDetailsLoader,
          },
          {
            path: "profile",
            element: <ProfilePage />,
            loader: profileStatsLoader,
            action: updateProfileAction,
          },
        ],
      },

      /* ---------- 404 / Catch-all ---------- */
      {
        path: "*",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ErrorPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
