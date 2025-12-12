import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./features/auth/pages/Login";
import SignUp from "./features/auth/pages/SignUp";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";
import OTPVerificationForm from "./features/auth/pages/OTPVerificationForm";

import loginAction from "./features/auth/actions/login";
import signUpAction from "./features/auth/actions/signUp";
import verifyOtpAction from "./features/auth/actions/verifyOtp";
import forgotPasswordAction from "./features/auth/actions/forgotPassword";
import resetPasswordAction from "./features/auth/actions/resetPassword";

import requireEmailQueryLoader from "./features/auth/loader/requireEmailQueryLoader";

import "./index.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
      action: loginAction,
    },
    {
      path: "/register",
      element: <SignUp />,
      action: signUpAction,
    },
    {
      path: "/verify-otp",
      element: <OTPVerificationForm />,
      action: verifyOtpAction,
      loader: requireEmailQueryLoader,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
      action: forgotPasswordAction,
    },

    {
      path: "/reset-password",
      element: <ResetPassword />,
      loader: requireEmailQueryLoader,
      action: resetPasswordAction,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
