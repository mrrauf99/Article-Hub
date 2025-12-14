import { useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer";
import AdminUsersSection from "../components/AdminUsersSection";

const seedUsers = [
  {
    id: 1,
    name: "Tayyab",
    email: "tayyab@example.com",
    role: "user",
    active: true,
  },
  {
    id: 2,
    name: "Rauf",
    email: "rauf@example.com",
    role: "user",
    active: true,
  },
  {
    id: 3,
    name: "Sara Admin",
    email: "admin@example.com",
    role: "admin",
    active: false,
  },
];

export default function ManageUser() {
  const [users, setUsers] = useState(seedUsers);

  const handleUserDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleToggleUserStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
  };

  const handleLogout = () => {
    alert("Admin logged out");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="admin" userName="Admin" onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminUsersSection
          users={users}
          onDelete={handleUserDelete}
          onToggleStatus={handleToggleUserStatus}
        />
      </main>

      <Footer />
    </div>
  );
}
