"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { UserCheck } from "lucide-react";
import { Captain } from "@/types";

export default function AdminCaptainsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "captains"],
    queryFn: () => api.adminListCaptains(),
  });

  const columns: Column<Captain>[] = [
    {
      key: "name",
      header: "Captain",
      sortable: true,
      accessor: (captain) => {
        const user = captain.userId as any;
        return (
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user?.name || "Captain"}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10 text-sm font-bold text-orange-600">
                {user?.name?.charAt(0) || "?"}
              </div>
            )}
            <div>
              <div className="font-medium text-foreground">{user?.name || "Unknown"}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      accessor: (captain) => (
        <span className="font-semibold">
          {captain.rating?.toFixed(1) || "—"}
          <span className="ml-1 text-xs text-amber-600">★</span>
          {captain.reviewCount ? (
            <span className="ml-1 text-xs text-muted-foreground">({captain.reviewCount})</span>
          ) : null}
        </span>
      ),
    },
    {
      key: "tripsLed",
      header: "Trips Led",
      sortable: true,
    },
    {
      key: "experience",
      header: "Experience",
      sortable: true,
      accessor: (captain) => `${captain.experience ?? 0} yrs`,
    },
    {
      key: "specializations",
      header: "Specializations",
      sortable: false,
      accessor: (captain) => (
        <div className="flex max-w-[220px] flex-wrap gap-1">
          {(captain.specializations ?? []).slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-full bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "available",
      header: "Available",
      sortable: true,
      accessor: (captain) =>
        captain.available ? (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600">
            <UserCheck className="h-3.5 w-3.5" /> Yes
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">No</span>
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data?.data || []}
      isLoading={isLoading}
      searchKey="name"
      searchPlaceholder="Search captains..."
    />
  );
}
