import type { Request, Response } from "express";
import { Story, type StoryDoc } from "../models/Story.js";
import { User } from "../models/User.js";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** GET /api/stories?search=&category=&featured= */
export async function listStories(req: Request, res: Response): Promise<void> {
  const { search, category, featured } = req.query;
  const filter: Record<string, unknown> = { status: "PUBLISHED" };

  if (search) {
    filter.$or = [
      { title: { $regex: escapeRegExp(String(search)), $options: "i" } },
      { excerpt: { $regex: escapeRegExp(String(search)), $options: "i" } },
    ];
  }
  if (category) filter.category = String(category);
  if (featured === "true") filter.featured = true;

  const stories = (await Story.find(filter)
    .sort({ featured: -1, publishedAt: -1 })
    .lean()) as StoryDoc[];

  // Fetch author names alongside the query result.
  const authorIds = [...new Set(stories.map((s) => String(s.authorId)))];
  const authors = await User.find({ _id: { $in: authorIds } })
    .select("name avatar")
    .lean();
  const authorMap = new Map(authors.map((a) => [String(a._id), a]));

  const data = stories.map((s) => ({
    ...s,
    author: authorMap.get(String(s.authorId)),
  }));

  res.json({ success: true, data });
}

/** GET /api/stories/:slug */
export async function getStory(req: Request, res: Response): Promise<void> {
  const story = (await Story.findOne({
    slug: req.params.slug,
    status: "PUBLISHED",
  }).lean()) as StoryDoc | null;

  if (!story) {
    res.status(404).json({ success: false, error: "Story not found" });
    return;
  }

  // Increment view count asynchronously — no need to await.
  Story.updateOne({ _id: story._id }, { $inc: { views: 1 } }).exec();

  const author = story.authorId
    ? await User.findById(story.authorId).select("name avatar").lean()
    : null;

  res.json({ success: true, data: { ...story, author } });
}