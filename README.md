<div align="center">

<h1>Article Hub</h1>

<p>
  A modern, high-performance full-stack platform for publishing, managing, and discovering thoughtful articles.
</p>

<p>
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/React%20Router-7-CA4245?style=flat&logo=reactrouter&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=flat&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat" />
</p>

</div>

---

## 🌟 Overview

**Article Hub** is a full-stack web application designed for writers, readers, and administrators. It features clean markdown article editing, Cloudinary image management, role-based access control, security mechanisms (Two-Factor Authentication, OTP verification, Rate Limiting, Helmet headers), and dynamic routing with lazy loading and code splitting.

---

## ✨ Features

### 🌍 Public & Guest Experience
- **Explore & Search:** Filter articles by category, status, and dynamic text queries.
- **Reading View:** Optimized, distraction-free reading experience with markdown rendering.
- **SEO & Performance:** Fully responsive layout with metadata management (`react-helmet-async`) and lazy-loaded route views.

### 👤 Registered Writers / Users
- **Authentication & Security:** Email OTP signup verification, secure login, password reset, and Two-Factor Authentication (2FA via Speakeasy/TOTP).
- **Article Publishing:** Markdown-based content editor, Cloudinary image uploading, tag selection, and draft/published state management.
- **Profile Customization:** Profile management with interactive image cropping (`react-easy-crop`) uploaded to Cloudinary, and security settings.
- **User Dashboard:** Personal workspace for managing published articles, draft items, and analytics.

### 🛡️ Admin Management
- **Dashboard Analytics:** Platform activity overview, user metrics, and content statistics.
- **Article Moderation:** Search, filter, review article content details, approve, or delete articles.
- **User Management:** Manage registered accounts, review roles, and monitor user statuses.

---

## 🛠️ Tech Stack

### Frontend
- **Core Framework & Router:** React 18, React Router 7, Vite 7
- **Styling & UI:** Tailwind CSS 3.4, Lucide React Icons
- **Content & Utilities:** React Markdown, React Easy Crop, React Helmet Async, Axios

### Backend
- **Runtime & Server:** Node.js, Express 5
- **Database:** PostgreSQL (`pg`)
- **Authentication & Security:** JWT, bcrypt, Speakeasy (2FA), Passport.js (Google OAuth 2.0), Express Rate Limit, Helmet
- **Media & Email Services:** Cloudinary API, Resend Email API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database instance
- Cloudinary account credentials

### 1. Clone the Repository
```bash
git clone https://github.com/mrrauf99/Article-Hub.git
cd Article-Hub
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with required parameters:
```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RESEND_API_KEY=your_resend_api_key
```
Start backend dev server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

<div align="center">

**Made with ❤️ by Abdul Rauf**

[GitHub](https://github.com/mrrauf99) •
[LinkedIn](https://www.linkedin.com/in/abdul-rauf-026852381/) •
[Email](mailto:itxrauf99@gmail.com)

</div>

---

⭐ If you find this project helpful, consider giving it a star!
