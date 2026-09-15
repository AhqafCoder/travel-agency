import { Captain } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, ShieldCheck, Map } from "lucide-react";

interface CaptainCardProps {
  captain: Captain;
}

export function CaptainCard({ captain }: CaptainCardProps) {
  return (
    <div className="flex flex-col items-center p-6 rounded-2xl border border-border/40 bg-card/50 shadow-sm text-center">
      <div className="relative mb-4">
        <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
          <AvatarImage src={captain.avatar} alt={captain.user?.name} className="object-cover" />
          <AvatarFallback>{captain.user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 bg-teal text-white rounded-full p-1 border-2 border-background">
          <ShieldCheck className="w-4 h-4" />
        </div>
      </div>

      <h3 className="text-lg font-bold mb-1">{captain.user?.name || "Trip Captain"}</h3>
      <div className="flex items-center gap-1.5 text-sm mb-3">
        <Star className="w-4 h-4 fill-primary text-primary" />
        <span className="font-semibold">{captain.rating}</span>
        <span className="text-muted-foreground">({captain.reviewCount} reviews)</span>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {captain.bio}
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {captain.specializations.slice(0, 3).map((spec) => (
          <Badge key={spec} variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
            {spec}
          </Badge>
        ))}
      </div>

      <div className="w-full pt-4 border-t border-border/10 grid grid-cols-2 gap-4">
        <div className="text-center border-r border-border/10">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Trips Led</p>
          <p className="font-bold text-primary">{captain.tripsLed}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Exp.</p>
          <p className="font-bold text-primary">{captain.experience} Yrs</p>
        </div>
      </div>
    </div>
  );
}