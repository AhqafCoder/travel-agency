"use client";

import { useAuth } from "@/components/auth/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Your profile
        </h2>
        <div className="mt-4 flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-orange-500/20 text-lg text-orange-600">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="mt-1 inline-block rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-600">
              {user?.role}
            </span>
          </div>
        </div>
      </section>

      {/* Storefront settings */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Storefront
        </h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between border-b border-border/60 pb-3">
            <dt className="text-muted-foreground">Currency</dt>
            <dd className="font-medium text-foreground">INR (₹)</dd>
          </div>
          <div className="flex justify-between border-b border-border/60 pb-3">
            <dt className="text-muted-foreground">Image storage</dt>
            <dd className="font-medium text-foreground">Cloudinary</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Database</dt>
            <dd className="font-medium text-foreground">MongoDB (Atlas)</dd>
          </div>
        </dl>
      </section>

      <p className="text-xs text-muted-foreground/80">
        Role management, webhook configuration and advanced settings are coming soon.
      </p>
    </div>
  );
}
