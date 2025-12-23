import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

import CompleteProfileLoader from "./features/auth/loaders/CompleteProfile.js";
import resetPasswordLoader from "./features/auth/loaders/resetPassword.js";
import verifyOtpPageLoader from "./features/auth/loaders/verifyOtpPage.js";

import HomePage from "./features/guest/pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./features/contact/pages/ContactPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/Terms.jsx";

import ArticleDetailPage from "./features/articles/pages/ArticleDetailPage.jsx";

import PublicLayout from "./layouts/PublicLayout.jsx";

import submitContactAction from "./features/contact/actions/submitContact.js";

import publicArticlesLoader from "./features/articles/loaders/publicArticles.js";
import articleDetailLoader from "./features/articles/loaders/articleDetail.js";

import "./index.css";

export default function App() {
  const router = createBrowserRouter([
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
      loader: CompleteProfileLoader,
    },
    {
      element: <PublicLayout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
          loader: publicArticlesLoader,
        },
        {
          path: "/about",
          element: <AboutPage />,
        },
        {
          path: "/contact",
          element: <ContactPage />,
          action: submitContactAction,
        },
        {
          path: "/privacy",
          element: <PrivacyPage />,
        },
        {
          path: "/terms",
          element: <TermsPage />,
        },
      ],
    },

    {
      path: "/articles/:id",
      element: <ArticleDetailPage />,
      loader: articleDetailLoader,
    },
  ]);

  return <RouterProvider router={router} />;
}
