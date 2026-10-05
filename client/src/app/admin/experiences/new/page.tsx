"use client";

import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { FormPage } from "@/components/admin/FormPage";

export default function NewExperiencePage() {
  return (
    <FormPage
      title="New Experience"
      description="Add a local activity or day tour."
      backHref="/admin/experiences"
    >
      <ExperienceForm />
    </FormPage>
  );
}
