import { model, Schema, Types, type InferSchemaType } from "mongoose";
import { StoryStatus } from "./enums.js";

const storySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" }, // rich HTML/story content
    coverImage: { type: String, default: "" },
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    category: { type: String, default: "Travel" },
    tags: [{ type: String }],
    status: { type: String, enum: Object.values(StoryStatus), default: StoryStatus.DRAFT },
    featured: { type: Boolean, default: false },
    metaTitle: { type: String },
    metaDescription: { type: String },
    ogImage: { type: String },
    readTime: { type: Number },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

storySchema.index({ title: "text", excerpt: "text", content: "text" });
storySchema.index({ status: 1, featured: 1, category: 1 });

export type StoryDoc = InferSchemaType<typeof storySchema> & { _id: Types.ObjectId };

export const Story = model<StoryDoc>("Story", storySchema);