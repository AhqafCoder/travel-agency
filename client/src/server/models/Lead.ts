import mongoose, { Schema, Document, type Model } from "mongoose";

export interface ILead extends Document {
  name: string;
  phone: string;
  email: string;
  destination: string;
  date: string;
  noOfPeople: number;
  status: "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    destination: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    noOfPeople: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "CONVERTED", "CLOSED"],
      default: "NEW",
    },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
LeadSchema.index({ name: "text", email: "text", destination: "text" });

export const Lead: Model<ILead> =
  (mongoose.models.Lead as Model<ILead>) ?? mongoose.model<ILead>("Lead", LeadSchema);
