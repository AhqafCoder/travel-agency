import { Lead } from "@/server/models/Lead";
import { created, fail, body, handle } from "@/server/lib/http";

/** POST /api/leads — public enquiry form submission. */
export const POST = handle(async (req) => {
  const { name, phone, email, destination, date, noOfPeople, notes } = await body<{
    name?: string;
    phone?: string;
    email?: string;
    destination?: string;
    date?: string;
    noOfPeople?: number | string;
    notes?: string;
  }>(req);

  if (!name || !phone || !email || !destination || !date || !noOfPeople) {
    return fail("All required fields (name, phone, email, destination, date, noOfPeople) must be provided.", 400);
  }

  const lead = await Lead.create({
    name,
    phone,
    email,
    destination,
    date,
    noOfPeople: Number(noOfPeople),
    notes: notes || "",
    status: "NEW",
  });

  return created(lead, "Enquiry submitted successfully");
});
