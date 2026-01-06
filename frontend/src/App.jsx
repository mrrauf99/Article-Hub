import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Auth
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import SignUpPage from "./features/auth/pages/SignUpPage.jsx";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage.jsx";
import OTPVerificationFormPage from "./features/auth/pages/OTPVerificationFormPage.jsx";
import CompleteProfile from "./features/auth/pages/CompleteProfile.jsx";

import loginAction from "./features/auth/actions/login";
import signUpAction from "./features/auth/actions/signUp";
import otpAction from "./features/auth/actions/otp";
import forgotPasswordAction from "./features/auth/actions/forgotPassword";
import resetPasswordAction from "./features/auth/actions/resetPassword";
import completeProfileAction from "./features/auth/actions/completeProfile.js";

import completeProfileLoader from "./features/auth/loaders/completeProfile.js";
import resetPasswordLoader from "./features/auth/loaders/resetPassword.js";
import verifyOtpPageLoader from "./features/auth/loaders/verifyOtpPage.js";

// Public
import HomePage from "./features/guest/pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./features/contact/pages/ContactPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/Terms.jsx";

import submitContactAction from "./features/contact/actions/submitContact.js";
import publicArticlesLoader from "./features/articles/loaders/publicArticles.js";
import publicLayoutLoader from "./loaders/publicLayout.js";

// User
import UserDashBoardPage from "./features/user/pages/UserDashBoardPage.jsx";
import CreateArticlePage from "./features/user/pages/CreateArticlePage.jsx";
import UserProfilePage from "./features/user/pages/UserProfilePage.jsx";
import ExploreArticlesPage from "./features/user/pages/ExploreArticlesPage.jsx";

import editArticleLoader from "./features/user/loaders/editArticle.js";
import myArticlesLoader from "./features/user/loaders/myArticles.js";
import userProfileLoader from "./features/user/loaders/userProfile.js";

import profileStatsLoader from "./loaders/profileStats.js";

import createArticleAction from "./features/user/actions/createArticle.js";
import updateProfileAction from "./features/user/actions/updateProfile.js";

// Admin
import AdminDashboardPage from "./features/admin/pages/AdminDashboardPage.jsx";
import AdminArticlesPage from "./features/admin/pages/AdminArticlesPage.jsx";
import AdminUsersPage from "./features/admin/pages/AdminUsersPage.jsx";

import adminProfileLoader from "./features/admin/loaders/adminProfile.js";
import adminDashboardLoader from "./features/admin/loaders/adminDashboard.js";
import adminArticlesLoader from "./features/admin/loaders/adminArticles.js";
import adminUsersLoader from "./features/admin/loaders/adminUsers.js";
import { adminArticlesAction } from "./features/admin/actions/adminArticles.js";
import { adminUsersAction } from "./features/admin/actions/adminUsers.js";

// Layouts
import PublicLayout from "./layouts/PublicLayout.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";

// (Admin, User and Public)
import ArticleDetailPage from "./features/articles/pages/ArticleDetailPage.jsx";
import articleDetailLoader from "./features/articles/loaders/articleDetail.js";
import NotFoundPage from "./pages/NotFoundPage.jsx";

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
          path: "/complete-profile",
          element: <CompleteProfile />,
          action: completeProfileAction,
          loader: completeProfileLoader,
        },
      ],
    },

    /* ---------- PUBLIC ---------- */
    {
      element: <PublicLayout />,
      loader: publicLayoutLoader,
      children: [
        {
          index: true, // "/"
          element: <HomePage />,
          loader: publicArticlesLoader,
        },
        { path: "about", element: <AboutPage /> },
        {
          path: "contact",
          element: <ContactPage />,
          action: submitContactAction,
        },
        { path: "privacy", element: <PrivacyPage /> },
        { path: "terms", element: <TermsPage /> },
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
          element: <UserProfilePage />,
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
          path: "users",
          element: <AdminUsersPage />,
          loader: adminUsersLoader,
          action: adminUsersAction,
        },
        {
          path: "profile",
          element: <UserProfilePage />,
          loader: profileStatsLoader,
          action: updateProfileAction,
        },
      ],
    },

    /* ---------- 404 ---------- */
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}
