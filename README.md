<div align="center">

# Article Hub

<p>
  An article publishing and moderation platform designed for readers, writers, and administrators.
</p>

<p>
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/React%20Router-7-CA4245?style=flat&logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Node.js-20.19+-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=flat&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat" alt="MIT License" />
</p>

</div>

---

## Platform Functionalities

### 1. Reader & Exploration Functionalities
- **Article Discovery:** Browse published stories filtered by categories and topics.
- **Search & Filtering:** Search for articles using keywords, titles, or specific criteria.
- **Optimized Reading View:** Clean, distraction-free reading experience with structured formatting and cover imagery.
- **Engagement & View Tracking:** Automatic view counting for published articles.

### 2. Bookmarking & Reading List Functionalities
- **Save Articles:** Bookmark articles directly from story cards or article reading pages for later reference.
- **Personal Reading Collection:** Dedicated reading list page displaying saved articles with pagination, ordered by recently saved.
- **Bookmark Management:** Easily remove bookmarks or unsave articles at any time.
- **Visibility Control:** Automatic sync with publication status so only available articles remain visible in reading lists.

### 3. Writing & Content Publishing Functionalities
- **Article Composition:** Write and format articles using rich Markdown syntax with structured headlines and sections.
- **Cover Image Uploads:** Attach and showcase cover images for every article.
- **Drafts & Revision:** Save articles in progress as drafts and update them whenever needed.
- **Editorial Submission:** Submit completed drafts into the review queue for moderation.
- **Author Dashboard:** A private workspace to monitor submitted articles, view pending statuses, manage drafts, and see approved publications.

### 4. Editorial & Moderation Functionalities
- **Review Queue:** Administrators can access all pending article submissions awaiting review.
- **Content Approval:** Approve articles to immediately publish them to the public catalog.
- **Content Rejection:** Reject submissions that do not meet guidelines.
- **Content Governance:** Delete or manage published and draft articles across the platform to maintain community standards.

### 5. Profile & Community Management Functionalities
- **Custom Profiles:** Customize public author profiles with biographical details and social links.
- **Avatar Management:** Upload and interactively crop profile avatars.
- **User Directory & Roster:** Administrator view to browse registered members, inspect user profiles, and monitor user roles.
- **Role Permissions:** Distinct privilege tiers for guests, registered users (writers/readers), and administrators.

### 6. Authentication & Security Functionalities
- **Email Verification:** Account registration protected via email One-Time Password (OTP) verification.
- **Password Recovery:** Secure self-service password reset workflow powered by email OTP confirmation.
- **Google Sign-In:** One-click authentication through Google Identity Services.
- **Two-Factor Authentication (2FA):** Optional multi-factor security using authenticator apps (TOTP) with QR code configuration.
- **Protected Sessions:** Secure, role-enforced sessions ensuring users and administrators only access authorized features.

---

## Article Publishing Lifecycle

1. **Draft:** The writer composes the article, uploads a cover image, and refines the content.
2. **Pending Review:** The writer submits the article for editorial review.
3. **Moderation:** An administrator reviews the article content and either approves or rejects it.
4. **Published:** Once approved, the article becomes publicly visible and searchable to all readers.

## Backend Development

The backend uses Prisma with the existing PostgreSQL schema. From `backend/`, run `npm install`, `npm run prisma:generate`, and then `npm run dev` or `npm start`. Prisma schema changes are not applied to the database by these commands.

Configure the backend with `DATABASE_URL`, `JWT_SECRET`, `CLIENT_BASE_URL`, `GOOGLE_CLIENT_ID`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RESEND_API_KEY`, `MAIL_FROM`, and `ADMIN_EMAIL`. `PORT`, `SALT_ROUNDS`, and `NODE_ENV` are optional. Google Identity Services uses the web client ID in `GOOGLE_CLIENT_ID`; set the same ID as `VITE_GOOGLE_CLIENT_ID` in the frontend. Set `VITE_API_BASE_URL` to the backend origin without `/api`.

Install and run the frontend separately from `frontend/`. When `VITE_GOOGLE_CLIENT_ID` is set, login and registration use the official Google Identity Services button; One Tap is an optional enhancement. Both send the Google credential to `/api/auth/google/callback`, where the backend verifies the Google ID token before issuing the existing session cookies or starting profile completion. Set `GOOGLE_CLIENT_ID` on the backend to the same web client ID and authorize each frontend origin (development and production) in Google Cloud Console.

---

## 📄 License

This project is licensed under the **MIT License**.
