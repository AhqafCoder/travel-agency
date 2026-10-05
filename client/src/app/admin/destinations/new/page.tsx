"use client";

import { DestinationForm } from "@/components/admin/DestinationForm";
import { FormPage } from "@/components/admin/FormPage";

export default function NewDestinationPage() {
  return (
    <FormPage
      title="New Destination"
      description="Add a destination that trips and experiences can attach to."
      backHref="/admin/destinations"
    >
      <DestinationForm />
    </FormPage>
  );
}
