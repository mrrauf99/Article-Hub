import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Auth - Critical (keep static)
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import SignUpPage from "./features/auth/pages/SignUpPage.jsx";

// Auth - Secondary (lazy load)
const ForgotPasswordPage = lazy(
  () => import("./features/auth/pages/ForgotPasswordPage.jsx"),
);
const ResetPasswordPage = lazy(
  () => import("./features/auth/pages/ResetPasswordPage.jsx"),
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
import resetPasswordAction from "./features/auth/actions/resetPassword";
import verifyTwoFactorLoginAction from "./features/auth/actions/verifyTwoFactorLogin.js";
import completeProfileAction from "./features/auth/actions/completeProfile.js";

import completeProfileLoader from "./features/auth/loaders/completeProfile.js";
import resetPasswordLoader from "./features/auth/loaders/resetPassword.js";
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
import publicArticlesLoader from "./features/articles/loaders/publicArticles.js";
import publicLayoutLoader from "./loaders/publicLayout.js";
import homePageLoader from "./features/guest/loaders/homePage.js";

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
import userProfileLoader from "./features/user/loaders/userProfile.js";
import createArticleLoader from "./features/user/loaders/createArticle.js";

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

import adminProfileLoader from "./features/admin/loaders/adminProfile.js";
import adminDashboardLoader from "./features/admin/loaders/adminDashboard.js";
import adminArticlesLoader from "./features/admin/loaders/adminArticles.js";
import adminUsersLoader from "./features/admin/loaders/adminUsers.js";
import adminUserDetailsLoader from "./features/admin/loaders/adminUserDetails.js";
import { adminArticlesAction } from "./features/admin/actions/adminArticles.js";
import { adminUsersAction } from "./features/admin/actions/adminUsers.js";

// Layouts
import PublicLayout from "./layouts/PublicLayout.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";

import ArticleDetailPage from "./features/articles/pages/ArticleDetailPage.jsx";
import articleDetailLoader from "./features/articles/loaders/articleDetail.js";

// NotFoundPage - Lazy loaded
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

import "./index.css";

export default function App() {
  const router = createBrowserRouter([
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
          element: (
            <Suspense fallback={<PageLoader />}>
              <OTPVerificationFormPage />
            </Suspense>
          ),
          action: otpAction,
          loader: verifyOtpPageLoader,
        },
        {
          path: "/forgot-password",
          element: (
            <Suspense fallback={<PageLoader />}>
              <ForgotPasswordPage />
            </Suspense>
          ),
          action: forgotPasswordAction,
        },
        {
          path: "/reset-password",
          element: (
            <Suspense fallback={<PageLoader />}>
              <ResetPasswordPage />
            </Suspense>
          ),
          action: resetPasswordAction,
          loader: resetPasswordLoader,
        },
        {
          path: "/two-factor",
          element: (
            <Suspense fallback={<PageLoader />}>
              <TwoFactorPage />
            </Suspense>
          ),
          action: verifyTwoFactorLoginAction,
          loader: twoFactorSessionLoader,
        },
        {
          path: "/complete-profile",
          element: (
            <Suspense fallback={<PageLoader />}>
              <CompleteProfile />
            </Suspense>
          ),
          action: completeProfileAction,
          loader: completeProfileLoader,
        },
      ],
    },

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
          element: (
            <Suspense fallback={<PageLoader />}>
              <AboutPage />
            </Suspense>
          ),
        },
        {
          path: "contact",
          element: (
            <Suspense fallback={<PageLoader />}>
              <ContactPage />
            </Suspense>
          ),
          action: submitContactAction,
        },
        {
          path: "privacy",
          element: (
            <Suspense fallback={<PageLoader />}>
              <PrivacyPage />
            </Suspense>
          ),
        },
        {
          path: "terms",
          element: (
            <Suspense fallback={<PageLoader />}>
              <TermsPage />
            </Suspense>
          ),
        },
        {
          path: "articles/:id",
          element: <ArticleDetailPage />,
          loader: articleDetailLoader,
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
          path: "dashboard",
          element: (
            <Suspense fallback={<PageLoader />}>
              <UserDashBoardPage />
            </Suspense>
          ),
          loader: myArticlesLoader,
        },
        {
          path: "articles",
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<PageLoader />}>
                  <ExploreArticlesPage />
                </Suspense>
              ),
              loader: publicArticlesLoader,
            },
            {
              path: "new",
              element: (
                <Suspense fallback={<PageLoader />}>
                  <CreateArticlePage />
                </Suspense>
              ),
              loader: createArticleLoader,
              action: createArticleAction,
            },
            {
              path: ":id/edit",
              element: (
                <Suspense fallback={<PageLoader />}>
                  <CreateArticlePage />
                </Suspense>
              ),
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
          element: (
            <Suspense fallback={<PageLoader />}>
              <ProfilePage />
            </Suspense>
          ),
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
          path: "dashboard",
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminDashboardPage />
            </Suspense>
          ),
          loader: adminDashboardLoader,
        },
        {
          path: "articles",
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminArticlesPage />
            </Suspense>
          ),
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
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminUsersPage />
            </Suspense>
          ),
          loader: adminUsersLoader,
          action: adminUsersAction,
        },
        {
          path: "users/:userId",
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminUserProfilePage />
            </Suspense>
          ),
          loader: adminUserDetailsLoader,
        },
        {
          path: "profile",
          element: (
            <Suspense fallback={<PageLoader />}>
              <ProfilePage />
            </Suspense>
          ),
          loader: profileStatsLoader,
          action: updateProfileAction,
        },
      ],
    },

    /* ---------- 404 ---------- */
    {
      path: "*",
      element: (
        <Suspense fallback={<PageLoader />}>
          <NotFoundPage />
        </Suspense>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}
