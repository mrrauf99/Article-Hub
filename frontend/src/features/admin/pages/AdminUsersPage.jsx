import { useState } from "react";
import { useLoaderData, useLocation, useSearchParams } from "react-router-dom";
import { SearchX, Users } from "lucide-react";

import Pagination from "@/features/articles/components/Pagination";
import PageHeader from "@/features/user/components/PageHeader";
import SearchField from "@/features/user/components/SearchField";
import EmptyState from "@/features/user/components/EmptyState";
import useScrollOnChange from "@/hooks/useScrollOnChange";
import { BTN_SECONDARY } from "@/styles/panelClasses";
import MemberRoster from "../components/MemberRoster";
import ActionNotice from "../components/ActionNotice";
import useMemberActions from "../hooks/useMemberActions";

export default function AdminUsersPage() {
  const { users, pagination, filters } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(filters.search);
  const location = useLocation();
  const members = useMemberActions({ initialNotice: location.state?.notice ?? null });

  const updateParams = (mutate) => {
    const params = new URLSearchParams(searchParams);
    mutate(params);
    params.delete("page");
    setSearchParams(params, { preventScrollReset: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const value = searchValue.trim();
    updateParams((p) => (value ? p.set("search", value) : p.delete("search")));
  };

  const clearSearch = () => {
    setSearchValue("");
    updateParams((p) => p.delete("search"));
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params, { preventScrollReset: true });
  };

  useScrollOnChange({ deps: [pagination.page], behavior: "smooth", delay: 100 });

  const first = (pagination.page - 1) * pagination.limit + 1;
  const last = Math.min(pagination.page * pagination.limit, pagination.totalCount);

  return (
    <>
      <PageHeader
        title="Writers"
        description="Writer accounts, newest first. Deleting a writer also deletes every article they wrote."
      />

      <div className="mt-8">
        <ActionNotice notice={members.notice} onDismiss={members.dismissNotice} />
      </div>

      <div className="flex justify-end border-b border-hairline">
        <form role="search" onSubmit={handleSearch} className="w-full pb-3 md:w-72">
          <SearchField
            id="admin-member-search"
            label="Search writers by name, username or email"
            placeholder="Search writers"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
      </div>

      {users.length === 0 ? (
        filters.search ? (
          <EmptyState
            icon={SearchX}
            title={`No writers match "${filters.search}"`}
            action={
              <button type="button" onClick={clearSearch} className={BTN_SECONDARY}>
                Clear search
              </button>
            }
          >
            Search looks at names, usernames and email addresses.
          </EmptyState>
        ) : (
          <EmptyState icon={Users} title="No writers yet" />
        )
      ) : (
        <>
          <p className="py-4 text-sm text-ink-muted" aria-live="polite">
            <span className="tabular-nums">
              {first}–{last}
            </span>{" "}
            of <span className="tabular-nums">{pagination.totalCount}</span>
            {filters.search && (
              <>
                {" "}matching "<span className="text-ink">{filters.search}</span>"{" "}
                <button
                  type="button"
                  onClick={clearSearch}
                  className="ml-1 rounded-sm font-medium text-moss-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
                >
                  Clear
                </button>
              </>
            )}
          </p>

          <MemberRoster members={users} onAction={members.open} />

          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                current={pagination.page}
                total={pagination.totalPages}
                onChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {members.dialog}
    </>
  );
}
