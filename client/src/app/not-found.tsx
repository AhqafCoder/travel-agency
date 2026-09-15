import Link from "next/link";
import { MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-muted mb-6">
          <MapPin className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-7xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Looks like you&apos;re lost
        </h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist. Maybe the trail
          changed, or you took a wrong turn.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/explore">Explore Trips</Link>
        </Button>
      </div>
    </div>
  );
}
