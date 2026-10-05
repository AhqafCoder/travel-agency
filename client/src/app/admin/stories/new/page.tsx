"use client";

import { StoryForm } from "@/components/admin/StoryForm";
import { FormPage } from "@/components/admin/FormPage";

export default function NewStoryPage() {
  return (
    <FormPage
      title="New Story"
      description="Write a travel story, guide or trip recap."
      backHref="/admin/stories"
    >
      <StoryForm />
    </FormPage>
  );
}
