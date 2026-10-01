import { Request, Response } from "express";
import { Lead } from "../models/Lead";

// Public: Submit a new enquiry lead from the website pop-up form
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, destination, date, noOfPeople, notes } = req.body;

    if (!name || !phone || !email || !destination || !date || !noOfPeople) {
      res.status(400).json({ error: "All required fields (name, phone, email, destination, date, noOfPeople) must be provided." });
      return;
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

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      lead,
    });
  } catch (error: any) {
    console.error("Error creating lead:", error);
    res.status(500).json({ error: error.message || "Failed to submit enquiry" });
  }
};

// Admin: List all leads with search and filtering
export const adminListLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, status, page = "1", pageSize = "10" } = req.query;
    const query: any = {};

    if (search && typeof search === "string") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { destination: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (status && typeof status === "string" && status !== "ALL") {
      query.status = status;
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(pageSize as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Lead.countDocuments(query),
    ]);

    res.json({
      leads,
      total,
      page: pageNum,
      pageSize: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error: any) {
    console.error("Error listing leads:", error);
    res.status(500).json({ error: error.message || "Failed to fetch leads" });
  }
};

// Admin: Get single lead details
export const adminGetLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    res.json({ lead });
  } catch (error: any) {
    console.error("Error getting lead:", error);
    res.status(500).json({ error: error.message || "Failed to fetch lead details" });
  }
};

// Admin: Update lead status or notes
export const adminUpdateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const lead = await Lead.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    res.json({
      success: true,
      message: "Lead updated successfully",
      lead,
    });
  } catch (error: any) {
    console.error("Error updating lead:", error);
    res.status(500).json({ error: error.message || "Failed to update lead" });
  }
};

// Admin: Delete lead
export const adminDeleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    res.json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ error: error.message || "Failed to delete lead" });
  }
};
