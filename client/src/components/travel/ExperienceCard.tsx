import Image from "next/image";
import { Experience } from "@/types";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border/20 bg-background/50 shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative w-full h-48">
        <Image
          src={experience.images[0]}
          alt={experience.title}
          fill
          sizes="(max-width: 640px) 100vw, 25vw"
          className="absolute inset-0 object-cover transition-transform group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs font-medium rounded-md backdrop-blur-sm">
          {experience.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>{experience.rating} ({experience.reviewCount} reviews)</span>
          <span className="mx-1">•</span>
          <span>{experience.duration}</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
          {experience.title}
        </h3>
        
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-sm text-muted-foreground">From</span>
            <span className="ml-1 font-bold text-foreground">₹{experience.price}</span>
          </div>
          <Button size="sm" variant="outline" className="h-8">Book Now</Button>
        </div>
      </div>
    </div>
  );
}