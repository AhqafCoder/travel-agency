import { Coupon } from "@/server/models/Coupon";
import { ok, handle } from "@/server/lib/http";

/**
 * Public list of admin-promoted coupon codes, shown as suggestions on the
 * booking page. Only returns codes that are active, inside their validity
 * window and not exhausted — and projects away internal fields
 * (usedCount, usageLimit, applicableTripIds).
 */
export const GET = handle(async () => {
  const now = new Date();
  const docs = await Coupon.find({
    promoted: true,
    active: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now },
    $or: [{ usageLimit: 0 }, { $expr: { $lt: ["$usedCount", "$usageLimit"] } }],
  })
    .select("code description type value minimumAmount maximumDiscount")
    .sort({ value: -1 })
    .limit(10)
    .lean();

  return ok(docs);
});
