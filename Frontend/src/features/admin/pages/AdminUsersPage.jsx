import { useState } from "react";
import { useLoaderData, useSearchParams, useFetcher } from "react-router-dom";
import { Users, User, Shield } from "lucide-react";

import {
  PageHeader,
  PillFilter,
  SearchInput,
  SimplePagination,
} from "../components/AdminFilters";
import UsersGrid from "../components/UsersGrid";
import RoleChangeModal from "../components/RoleChangeModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const ROLE_OPTIONS = [
  {
    value: "all",
    label: "All Users",
    icon: Users,
    activeClasses: "bg-slate-900 text-white shadow-lg shadow-slate-900/25",
  },
  {
    value: "user",
    label: "Users",
    icon: User,
    activeClasses:
      "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30",
  },
  {
    value: "admin",
    label: "Admins",
    icon: Shield,
    activeClasses:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30",
  },
];

export default function AdminUsersPage() {
  const { users, pagination, filters } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();

  const [searchValue, setSearchValue] = useState(filters.search);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmRoleChange, setConfirmRoleChange] = useState(null);

  const isSubmitting = fetcher.state !== "idle";
  const pendingIntent = fetcher.formData?.get("intent");

  const handleRoleFilter = (role) => {
    const params = new URLSearchParams(searchParams);
    if (role === "all") {
      params.delete("role");
    } else {
      params.set("role", role);
    }
    params.delete("page");
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleRoleChange = (userId, newRole) => {
    fetcher.submit(
      { intent: "changeRole", userId, newRole },
      { method: "post" }
    );
    setConfirmRoleChange(null);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    fetcher.submit(
      { intent: "delete", userId: confirmDelete.id },
      { method: "post" }
    );
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Users"
        subtitle="View, search, and manage platform users"
      >
        <div className="text-sm text-slate-500">
          Total:{" "}
          <span className="font-semibold text-slate-900">
            {pagination.totalCount}
          </span>{" "}
          users
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <PillFilter
            options={ROLE_OPTIONS}
            value={filters.role}
            onChange={handleRoleFilter}
          />
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            onSubmit={handleSearch}
            placeholder="Search by name or email..."
          />
        </div>
      </div>

      {/* Users Grid */}
      <UsersGrid
        users={users}
        onChangeRole={setConfirmRoleChange}
        onDelete={setConfirmDelete}
      />

      {/* Pagination */}
      <SimplePagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      {/* Role Change Modal */}
      {confirmRoleChange && (
        <RoleChangeModal
          user={confirmRoleChange}
          isLoading={isSubmitting && pendingIntent === "changeRole"}
          onChangeRole={handleRoleChange}
          onClose={() => setConfirmRoleChange(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <ConfirmDeleteModal
          title="Delete User"
          message={
            <>
              Are you sure you want to delete{" "}
              <strong>{confirmDelete.name}</strong>?
            </>
          }
          warning={
            <>
              <strong>Warning:</strong> This will also delete all{" "}
              {confirmDelete.article_count} articles by this user.
            </>
          }
          isLoading={isSubmitting && pendingIntent === "delete"}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          confirmText="Delete User"
        />
      )}
    </div>
  );
}
