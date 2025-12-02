// src/App.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import NewArticle from "./features/user_panel/pages/NewArticle.jsx";
import DashBoard from "./features/user_panel/pages/DashBoard.jsx";
import ProfilePage from "./features/user_panel/pages/Profile.jsx";
import AdminHome from "./features/admin/pages/AdminHome.jsx";
import Home from "./features/guest/Home.jsx";
import GuestPanel from "./features/guest/GuestPanel.jsx";

import "./index.css";

function App() {
  const router = createBrowserRouter([
    // Landing page (no navbar / footer)
    {
      path: "/",
      element: <Home />,
    },
    // optional: keep /home working as alias
    {
      path: "/home",
      element: <Home />,
    },

    // Guest panel: navbar + sidebar + approved cards + footer
    {
      path: "/guest",
      element: <GuestPanel />,
    },

    // User panel
    {
      path: "/dashboard",
      element: <DashBoard />,
    },
    {
      path: "/new-article",
      element: <NewArticle />,
    },
    {
      path: "/profile",
      element: <ProfilePage />,
    },

    // Admin
    {
      path: "/admin/home",
      element: <AdminHome />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
