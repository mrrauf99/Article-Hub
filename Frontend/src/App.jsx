import { createBrowserRouter, RouterProvider } from "react-router-dom";

import NewArticle from "./features/user_panel/pages/NewArticle.jsx";
import DashBoard from "./features/user_panel/pages/DashBoard.jsx";
import ProfilePage from "./features/user_panel/pages/Profile.jsx";
import AdminDashboard from "./features/admin/pages/AdminDashboard.jsx";
import Home from "./features/guest/pages/Home.jsx";
import GuestPanel from "./features/guest/pages/GuestPanel.jsx";
import AboutContent from "./features/static/components/AboutContent.jsx";
import ContactPage from "./features/static/pages/ContactPage.jsx";
import ManageUser from "./features/admin/pages/ManageUser.jsx";
import ArticleDetailPage from "./components/ArticleDetailPage.jsx";
import "./index.css";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },

    {
      path: "/home",
      element: <Home />,
    },

    {
      path: "/guest",
      element: <GuestPanel />,
    },

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

    {
      path: "/admin/dashboard",
      element: <AdminDashboard />,
    },
    {
      path: "/about",
      element: <AboutContent />,
    },
    {
      path: "/contact",
      element: <ContactPage />,
    },
    {
      path: "/admin/users",
      element: <ManageUser />,
    },
    {
      path: "/articles/:id",
      element: <ArticleDetailPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
