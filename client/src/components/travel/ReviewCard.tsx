import { Review } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="p-6 rounded-xl border border-border/40 bg-card/50 shadow-sm">
      {/* Header: User Info + Rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-border/20">
            <AvatarImage src={review.user?.avatar} alt={review.user?.name} />
            <AvatarFallback>{review.user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-semibold text-sm">{review.user?.name}</h4>
              {review.verifiedBooking && (
                <CheckCircle2 className="w-3.5 h-3.5 text-teal fill-teal/10" aria-label="Verified Traveller" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {review.createdAt ? format(new Date(review.createdAt), "MMM d, yyyy") : ""}
            </p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < review.rating 
                  ? "fill-primary text-primary" 
                  : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {review.title && (
          <h5 className="font-bold text-sm leading-tight">{review.title}</h5>
        )}
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          &quot;{review.content}&quot;
        </p>
      </div>

      {/* Optional: Trip Reference */}
      {review.trip && (
        <div className="mt-4 pt-4 border-t border-border/10 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            Review for:
          </span>
          <span className="text-xs font-medium text-primary hover:underline cursor-pointer">
            {review.trip.title}
          </span>
        </div>
      )}
    </div>
  );
}