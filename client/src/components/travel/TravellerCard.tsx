import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TravellerCardProps {
  user: User;
  tripsCount?: number;
}

export function TravellerCard({ user, tripsCount = 0 }: TravellerCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border/20 bg-background/50 hover:bg-accent/50 transition-colors">
      <Avatar className="w-10 h-10 border border-border/20">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="font-semibold text-sm">{user.name}</h4>
        <p className="text-xs text-muted-foreground">
          {tripsCount} {tripsCount === 1 ? "Trip" : "Trips"} with us
        </p>
      </div>
    </div>
  );
}