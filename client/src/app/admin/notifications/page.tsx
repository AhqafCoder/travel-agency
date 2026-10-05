"use client";

import { Bell } from "lucide-react";

export default function AdminNotificationsPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600">
        <Bell className="h-6 w-6" />
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
        Notifications centre
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Booking alerts, trip reminders and WhatsApp/email broadcast tools are on
        the roadmap. Transactional emails already fire automatically from the
        server.
      </p>
    </div>
  );
}
