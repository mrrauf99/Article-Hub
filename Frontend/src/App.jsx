// src/App.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import NewArticle from "./features/user_panel/pages/NewArticle.jsx";
import DashBoard from "./features/user_panel/pages/DashBoard.jsx";
import ProfilePage from "./features/user_panel/pages/Profile.jsx";
import AdminDashboard from "./features/admin/pages/AdminDashboard.jsx";
import Home from "./features/guest/Home.jsx";
import GuestPanel from "./features/guest/GuestPanel.jsx";
import AboutContent from "./features/static/components/AboutContent.jsx";
import ContactPage from "./features/static/pages/ContactPage.jsx";
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
      path: "/admin/home",
      element: <AdminDashboard />,
    },
    {
      path:"/about",
      element:<AboutContent/>
    },
    {
      path:"/contact",
      element:<ContactPage/>
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
