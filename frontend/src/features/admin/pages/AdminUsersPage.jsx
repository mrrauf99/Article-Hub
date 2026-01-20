import { useState, useEffect, useRef, useMemo } from "react";
import {
  useLoaderData,
  useSearchParams,
  useFetcher,
  useOutletContext,
  useRevalidator,
} from "react-router-dom";
import { Users, User, Shield } from "lucide-react";

import {
  PageHeader,
  PillFilter,
  SearchInput,
} from "../components/AdminFilters";
import Pagination from "@/features/articles/components/Pagination";
import UsersGrid from "../components/UsersGrid";
import RoleChangeModal from "../components/RoleChangeModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import ConfirmDialog from "@/components/ConfirmDialog";

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
  const { users: allUsers, pagination, filters } = useLoaderData();
  const outletContext = useOutletContext();
  const currentUser = outletContext?.user;
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();

  const [searchValue, setSearchValue] = useState(filters.search);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedUserForRoleChange, setSelectedUserForRoleChange] =
    useState(null);
  const [confirmRoleChange, setConfirmRoleChange] = useState(null);

  const isSubmitting = fetcher.state !== "idle";
  const pendingIntent = fetcher.formData?.get("intent");

  // Filter out the current admin from the users list
  const users = useMemo(() => {
    if (!allUsers || !Array.isArray(allUsers)) return [];
    if (!currentUser?.id) return allUsers;
    return allUsers.filter((user) => user.id !== currentUser.id);
  }, [allUsers, currentUser]);

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

  const prevPageRef = useRef(pagination.page);
  const prevFiltersRef = useRef({ role: filters.role, search: filters.search });

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params, { preventScrollReset: true });
  };

  useEffect(() => {
    const pageChanged = prevPageRef.current !== pagination.page;
    const filtersChanged =
      prevFiltersRef.current.role !== filters.role ||
      prevFiltersRef.current.search !== filters.search;

    if (pageChanged || filtersChanged) {
      const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      };

      const timeoutId = setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(scrollToTop);
        });
      }, 100);

      prevPageRef.current = pagination.page;
      prevFiltersRef.current = { role: filters.role, search: filters.search };

      return () => clearTimeout(timeoutId);
    }
  }, [pagination.page, filters.role, filters.search]);

  // Revalidate loaders when action succeeds
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      revalidator.revalidate();
    }
  }, [fetcher.state, fetcher.data?.success, revalidator]);

  const handleRoleChange = (userId, newRole) => {
    fetcher.submit(
      { intent: "changeRole", userId, newRole },
      { method: "post" },
    );
    setConfirmRoleChange(null);
    setSelectedUserForRoleChange(null);
  };

  const handleRoleChangeConfirm = (userId, newRole) => {
    const user = selectedUserForRoleChange;
    setSelectedUserForRoleChange(null);
    setConfirmRoleChange({ user, newRole });
  };

  const handleInitiateRoleChange = (user) => {
    setSelectedUserForRoleChange(user);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    fetcher.submit(
      { intent: "delete", userId: confirmDelete.id },
      { method: "post" },
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 w-full">
          <div className="w-full lg:w-auto overflow-x-auto scrollbar-hide -mx-3 sm:mx-0 px-3 sm:px-0">
            <PillFilter
              options={ROLE_OPTIONS}
              value={filters.role}
              onChange={handleRoleFilter}
            />
          </div>
          <div className="w-full lg:w-auto">
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              onSubmit={handleSearch}
              placeholder="Search by name or email..."
            />
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <UsersGrid
        users={users}
        onChangeRole={handleInitiateRoleChange}
        onDelete={setConfirmDelete}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          current={pagination.page}
          total={pagination.totalPages}
          onChange={handlePageChange}
        />
      )}

      {/* Role Change Modal */}
      {selectedUserForRoleChange && (
        <RoleChangeModal
          user={selectedUserForRoleChange}
          isLoading={isSubmitting && pendingIntent === "changeRole"}
          onChangeRole={handleRoleChangeConfirm}
          onClose={() => setSelectedUserForRoleChange(null)}
        />
      )}

      {/* Confirm Role Change Dialog */}
      {confirmRoleChange && (
        <ConfirmDialog
          isOpen={!!confirmRoleChange}
          title="Confirm Role Change"
          message={`Are you sure you want to change ${confirmRoleChange.user.name}'s role to "${confirmRoleChange.newRole}"?`}
          confirmText={`Yes, Change to ${confirmRoleChange.newRole.charAt(0).toUpperCase() + confirmRoleChange.newRole.slice(1)}`}
          cancelText="Cancel"
          variant="info"
          isLoading={isSubmitting && pendingIntent === "changeRole"}
          onConfirm={() =>
            handleRoleChange(
              confirmRoleChange.user.id,
              confirmRoleChange.newRole,
            )
          }
          onCancel={() => setConfirmRoleChange(null)}
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
