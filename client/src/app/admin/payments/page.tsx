"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Payment } from "@/types";

export default function AdminPaymentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "payments"],
    queryFn: () => api.adminListPayments(),
  });

  const columns: Column<Payment>[] = [
    {
      key: "bookingId",
      header: "Booking",
      sortable: true,
      accessor: (payment) => (
        <span className="font-mono text-xs font-semibold text-orange-600">
          {(payment.bookingId as any)?.bookingNumber || payment.bookingId}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      accessor: (payment) => (
        <span className="font-semibold">
          {payment.currency} {payment.amount?.toLocaleString()}
        </span>
      ),
    },
    {
      key: "provider",
      header: "Provider",
      sortable: true,
    },
    {
      key: "paymentMethod",
      header: "Method",
      sortable: false,
      accessor: (payment) => payment.paymentMethod || "—",
    },
    {
      key: "transactionId",
      header: "Transaction",
      sortable: false,
      accessor: (payment) => (
        <span className="font-mono text-xs text-muted-foreground">
          {payment.transactionId || payment.orderId || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessor: (payment) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            payment.status === "PAID"
              ? "bg-emerald-500/10 text-emerald-600"
              : payment.status === "FAILED"
              ? "bg-red-500/10 text-red-600"
              : payment.status === "REFUNDED"
              ? "bg-amber-500/10 text-amber-600"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {payment.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      accessor: (payment) => new Date(payment.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data?.data || []}
      isLoading={isLoading}
      searchPlaceholder="Search payments..."
      filterOptions={[
        {
          key: "status",
          label: "Status",
          options: [
            { label: "Paid", value: "PAID" },
            { label: "Pending", value: "PENDING" },
            { label: "Failed", value: "FAILED" },
            { label: "Refunded", value: "REFUNDED" },
          ],
        },
      ]}
    />
  );
}
