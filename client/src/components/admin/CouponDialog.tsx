"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Coupon } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField, adminInputClass } from "@/components/admin/FormPage";

const couponSchema = z
  .object({
    code: z.string().min(3, "Code is required"),
    description: z.string().optional(),
    type: z.enum(["PERCENTAGE", "FIXED"]),
    value: z.number().min(1, "Value must be at least 1"),
    minimumAmount: z.number().min(0),
    maximumDiscount: z.number().min(0).optional(),
    usageLimit: z.number().min(0),
    validFrom: z.string().min(1, "Start date is required"),
    validUntil: z.string().min(1, "End date is required"),
    active: z.boolean(),
    promoted: z.boolean(),
  })
  .refine((v) => new Date(v.validUntil) > new Date(v.validFrom), {
    message: "End date must be after the start date",
    path: ["validUntil"],
  });

type CouponFormValues = z.input<typeof couponSchema>;

const fmt = (d?: string | Date) => (d ? new Date(d).toISOString().slice(0, 10) : "");

export function CouponDialog({
  open,
  onOpenChange,
  coupon,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: Coupon | null;
}) {
  const queryClient = useQueryClient();
  const isEdit = !!coupon;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      description: "",
      type: "PERCENTAGE",
      value: 10,
      minimumAmount: 0,
      maximumDiscount: undefined,
      usageLimit: 0,
      validFrom: fmt(new Date()),
      validUntil: "",
      active: true,
      promoted: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        coupon
          ? {
              code: coupon.code,
              description: coupon.description ?? "",
              type: coupon.type,
              value: coupon.value,
              minimumAmount: coupon.minimumAmount ?? 0,
              maximumDiscount: coupon.maximumDiscount,
              usageLimit: coupon.usageLimit ?? 0,
              validFrom: fmt(coupon.validFrom),
              validUntil: fmt(coupon.validUntil),
              active: coupon.active,
              promoted: coupon.promoted ?? false,
            }
          : {
              code: "",
              description: "",
              type: "PERCENTAGE",
              value: 10,
              minimumAmount: 0,
              maximumDiscount: undefined,
              usageLimit: 0,
              validFrom: fmt(new Date()),
              validUntil: "",
              active: true,
              promoted: false,
            }
      );
    }
  }, [open, coupon, reset]);

  const onSubmit = async (values: CouponFormValues) => {
    try {
      const payload = {
        ...values,
        code: values.code.toUpperCase(),
        validFrom: new Date(values.validFrom),
        validUntil: new Date(values.validUntil),
      };
      if (isEdit && coupon) {
        await api.admin.coupons.update(coupon._id, payload);
        toast.success("Coupon updated");
      } else {
        await api.admin.coupons.create(payload);
        toast.success("Coupon created");
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to save coupon");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-border bg-card text-foreground">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Coupon" : "New Coupon"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the discount terms or validity."
              : "Create a discount code customers can apply at checkout."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Code" required error={errors.code?.message as string}>
              <input
                {...register("code")}
                placeholder="e.g. SUMMER25"
                className={`${adminInputClass} font-mono uppercase`}
              />
            </FormField>
            <FormField label="Type" required>
              <select {...register("type")} className={adminInputClass}>
                <option value="PERCENTAGE" className="bg-popover">
                  Percentage (%)
                </option>
                <option value="FIXED" className="bg-popover">
                  Fixed (₹)
                </option>
              </select>
            </FormField>
            <FormField
              label="Value"
              required
              error={errors.value?.message as string}
              hint="% off or ₹ off depending on type"
            >
              <input {...register("value")} type="number" min={1} className={adminInputClass} />
            </FormField>
            <FormField label="Minimum order (₹)" error={errors.minimumAmount?.message as string}>
              <input {...register("minimumAmount")} type="number" min={0} className={adminInputClass} />
            </FormField>
            <FormField label="Max discount (₹)" hint="Cap for percentage coupons">
              <input {...register("maximumDiscount")} type="number" min={0} className={adminInputClass} />
            </FormField>
            <FormField label="Usage limit" hint="0 = unlimited">
              <input {...register("usageLimit")} type="number" min={0} className={adminInputClass} />
            </FormField>
            <FormField label="Valid from" required error={errors.validFrom?.message as string}>
              <input {...register("validFrom")} type="date" className={adminInputClass} />
            </FormField>
            <FormField label="Valid until" required error={errors.validUntil?.message as string}>
              <input {...register("validUntil")} type="date" className={adminInputClass} />
            </FormField>
          </div>

          <FormField label="Description">
            <input {...register("description")} placeholder="Shown to customers at checkout" className={adminInputClass} />
          </FormField>

          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <input type="checkbox" {...register("active")} className="h-4 w-4 accent-orange-500" />
            Active (customers can use this code)
          </label>

          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <input type="checkbox" {...register("promoted")} className="h-4 w-4 accent-orange-500" />
            Suggest on booking page (shows the code publicly as an offer chip)
          </label>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Create Coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
