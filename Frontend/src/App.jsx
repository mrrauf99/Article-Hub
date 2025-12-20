import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./features/guest/pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./features/contact/pages/ContactPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/Terms.jsx";

import ArticleDetailPage from "./features/articles/pages/ArticleDetailPage.jsx";

import PublicLayout from "./layouts/PublicLayout.jsx";

import { submitContactAction } from "./features/contact/actions/submitContact.js";

import { publicArticlesLoader } from "./features/articles/loaders/publicArticles.js";
import { articleDetailLoader } from "./features/articles/loaders/articleDetail.js";

import "./index.css";

function App() {
  const router = createBrowserRouter([
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
