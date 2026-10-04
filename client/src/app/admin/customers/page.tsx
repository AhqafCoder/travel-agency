"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { User } from "@/types";

export default function AdminCustomersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: () => api.adminListCustomers(),
  });

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      accessor: (user) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-medium text-slate-600 dark:text-slate-300">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{user.name}</div>
          </div>
        </div>
      )
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      accessor: (user) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          user.role === "CUSTOMER"
            ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
            : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
        }`}>
          {user.role}
        </span>
      )
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      accessor: (user) => user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage user accounts and view their booking history.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.users || []}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search customers..."
        filterOptions={[
          {
            key: "role",
            label: "Role",
            options: [
              { label: "Customer", value: "CUSTOMER" },
              { label: "Admin", value: "ADMIN" },
              { label: "Super Admin", value: "SUPER_ADMIN" },
              { label: "Operations", value: "OPERATIONS" },
              { label: "Editor", value: "EDITOR" },
            ]
          }
        ]}
        actions={(user) => (
          <>
            <Button variant="ghost" size="icon" title="View Profile">
              <Eye className="h-4 w-4 text-blue-500" />
            </Button>
            <Button variant="ghost" size="icon" title="Edit User">
              <Edit className="h-4 w-4 text-slate-500" />
            </Button>
          </>
        )}
      />
    </div>
  );
}
