import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./auth/pages/Login";
import SignUp from "./auth/pages/SignUp";

import loginAction from "./auth/actions/login";
import signUpAction from "./auth/actions/signUp";

import "./index.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
      action: loginAction,
    },
    {
      path: "/signup",
      element: <SignUp />,
      action: signUpAction,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
