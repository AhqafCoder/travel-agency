"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarPlus, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { TripDeparture, DepartureStatus } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FormField, adminInputClass } from "@/components/admin/FormPage";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const departureSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  capacity: z.number().min(1, "Capacity is required"),
  price: z.number().min(0, "Price is required"),
  meetingPoint: z.string().optional(),
  meetingTime: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "CLOSED", "CANCELLED", "COMPLETED"]),
  notes: z.string().optional(),
});

type DepartureFormValues = z.infer<typeof departureSchema>;

const fmt = (d?: string | Date) => (d ? new Date(d).toISOString().slice(0, 10) : "");

export function DeparturesManager({ tripId }: { tripId: string }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<TripDeparture | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<TripDeparture | null>(null);
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "departures", tripId],
    queryFn: () => api.admin.trips.departures.list(tripId),
  });

  const form = useForm<DepartureFormValues>({
    resolver: zodResolver(departureSchema),
  });

  const departures: TripDeparture[] = data ?? [];

  const openCreate = () => {
    form.reset({
      startDate: "",
      endDate: "",
      capacity: 20,
      price: 0,
      meetingPoint: "",
      meetingTime: "",
      status: "DRAFT",
      notes: "",
    });
    setCreating(true);
  };

  const openEdit = (dep: TripDeparture) => {
    form.reset({
      startDate: fmt(dep.startDate),
      endDate: fmt(dep.endDate),
      capacity: dep.capacity,
      price: dep.price,
      meetingPoint: dep.meetingPoint ?? "",
      meetingTime: dep.meetingTime ?? "",
      status: dep.status,
      notes: dep.notes ?? "",
    });
    setEditing(dep);
  };

  const onSave = async (values: DepartureFormValues) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
      };
      if (editing) {
        await api.admin.trips.departure.update(editing._id, payload);
        toast.success("Departure updated");
      } else {
        await api.admin.trips.departures.create(tripId, payload);
        toast.success("Departure created");
      }
      setCreating(false);
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "departures", tripId] });
    } catch (error: any) {
      toast.error(error?.message || "Failed to save departure");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!deleting) return;
    try {
      await api.admin.trips.departure.delete(deleting._id);
      toast.success("Departure deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "departures", tripId] });
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete departure");
    } finally {
      setDeleting(null);
    }
  };

  const dialogOpen = creating || !!editing;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Departures ({departures.length})
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openCreate}
          className="border-border text-foreground hover:bg-muted/60"
        >
          <CalendarPlus className="mr-1.5 h-3.5 w-3.5" />
          Add Departure
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-24 items-center justify-center rounded-xl border border-border/60">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/80" />
        </div>
      ) : departures.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground/80">
          No departures yet. Add one so travellers can book this trip.
        </p>
      ) : (
        <div className="space-y-2">
          {departures.map((dep) => (
            <div
              key={dep._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {fmt(dep.startDate)} → {fmt(dep.endDate)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ₹{dep.price.toLocaleString()} • {dep.bookedSeats}/{dep.capacity} booked
                  {dep.meetingPoint ? ` • ${dep.meetingPoint}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    dep.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : dep.status === "CANCELLED"
                      ? "bg-red-500/10 text-red-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {dep.status}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(dep)}
                  title="Edit departure"
                >
                  <Pencil className="h-3.5 w-3.5 text-sky-600" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleting(dep)}
                  title="Delete departure"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!open) {
          setCreating(false);
          setEditing(null);
        }
      }}>
        <DialogContent className="max-w-lg border-border bg-card text-foreground">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Departure" : "New Departure"}</DialogTitle>
            <DialogDescription>
              A departure is a bookable date for this trip.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Start date" required error={form.formState.errors.startDate?.message}>
                <input
                  type="date"
                  {...form.register("startDate")}
                  className={adminInputClass}
                />
              </FormField>
              <FormField label="End date" required error={form.formState.errors.endDate?.message}>
                <input
                  type="date"
                  {...form.register("endDate")}
                  className={adminInputClass}
                />
              </FormField>
              <FormField label="Capacity" required error={form.formState.errors.capacity?.message}>
                <input
                  type="number"
                  min={1}
                  {...form.register("capacity", { valueAsNumber: true })}
                  className={adminInputClass}
                />
              </FormField>
              <FormField label="Price (₹)" required error={form.formState.errors.price?.message}>
                <input
                  type="number"
                  min={0}
                  {...form.register("price", { valueAsNumber: true })}
                  className={adminInputClass}
                />
              </FormField>
              <FormField label="Meeting point">
                <input
                  {...form.register("meetingPoint")}
                  placeholder="e.g. Mall Road, Manali"
                  className={adminInputClass}
                />
              </FormField>
              <FormField label="Meeting time">
                <input
                  {...form.register("meetingTime")}
                  placeholder="e.g. 6:00 AM"
                  className={adminInputClass}
                />
              </FormField>
            </div>

            <FormField label="Status">
              <select {...form.register("status")} className={adminInputClass}>
                {(["DRAFT", "ACTIVE", "CLOSED", "CANCELLED", "COMPLETED"] as DepartureStatus[]).map((s) => (
                  <option key={s} value={s} className="bg-popover">
                    {s}
                  </option>
                ))}
              </select>
            </FormField>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? "Saving…" : "Save Departure"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete Departure"
        description="Travellers booked on this departure will lose their seat reference. Continue?"
        onConfirm={onDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
