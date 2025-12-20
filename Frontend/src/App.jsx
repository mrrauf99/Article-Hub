import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "./features/auth/pages/LoginPage.jsx";
import SignUpPage from "./features/auth/pages/SignUpPage.jsx";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage.jsx";
import OTPVerificationFormPage from "./features/auth/pages/OTPVerificationFormPage.jsx";

import loginAction from "./features/auth/actions/login";
import signUpAction from "./features/auth/actions/signUp";
import verifyOtpAction from "./features/auth/actions/verifyOtp";
import forgotPasswordAction from "./features/auth/actions/forgotPassword";
import resetPasswordAction from "./features/auth/actions/resetPassword";

import HomePage from "./features/guest/pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./features/contact/pages/ContactPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/Terms.jsx";

import ArticleDetailPage from "./features/articles/pages/ArticleDetailPage.jsx";

import PublicLayout from "./layouts/PublicLayout.jsx";

import { submitContactAction } from "./features/contact/actions/submitContact.js";

import requireEmailQueryLoader from "./features/auth/loaders/requireEmailQuery.js";

import { publicArticlesLoader } from "./features/articles/loaders/publicArticles.js";
import { articleDetailLoader } from "./features/articles/loaders/articleDetail.js";

import "./index.css";

function App() {
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
      action: verifyOtpAction,
      loader: requireEmailQueryLoader,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
      action: forgotPasswordAction,
    },
    {
      path: "/reset-password",
      element: <ResetPasswordPage />,
      loader: requireEmailQueryLoader,
      action: resetPasswordAction,
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

export default App;
