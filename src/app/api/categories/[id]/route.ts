import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";
import mongoose from "mongoose";

// DELETE: Admin protected endpoint to delete a category
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const decoded = await authenticateAdmin(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const decodedId = decodeURIComponent(id).trim();

    const query = mongoose.isValidObjectId(decodedId)
      ? { $or: [{ _id: decodedId }, { slug: decodedId.toLowerCase() }] }
      : { slug: decodedId.toLowerCase() };

    const deleted = await Category.findOneAndDelete(query);
    if (!deleted) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Log deletion safely
    try {
      await ActivityLog.create({
        adminEmail: decoded?.email || "admin@fyneae.com",
        action: "CATEGORY_DELETE",
        details: `Deleted category: ${deleted.name} (${deleted.slug})`,
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1"
      });
    } catch (logErr) {
      console.error("ActivityLog error (non-fatal):", logErr);
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (err: any) {
    console.error("DELETE Category Error:", err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}
