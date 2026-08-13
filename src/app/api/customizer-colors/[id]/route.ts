import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CustomizerColor from "@/models/CustomizerColor";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";
import mongoose from "mongoose";
import { CasingSchema } from "@/lib/schemas";

// PUT: Admin update customizer color details by id
export async function PUT(
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
    const body = await request.json();

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const result = CasingSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message || "Invalid input data" }, { status: 400 });
    }
    const validatedData = result.data;

    const colorItem = await CustomizerColor.findById(id);
    if (!colorItem) {
      return NextResponse.json({ error: "Casing color not found" }, { status: 404 });
    }

    // Update fields
    const fields = ["name", "hex", "image", "desc"] as const;
    for (const field of fields) {
      if (validatedData[field] !== undefined) {
        colorItem[field] = validatedData[field] as any;
      }
    }

    await colorItem.save();

    // Log update safely
    try {
      await ActivityLog.create({
        adminEmail: decoded?.email || "admin@fyneae.com",
        action: "CUSTOMIZER_COLOR_UPDATE",
        details: `Updated customizer casing: ${colorItem.name} (${colorItem.hex})`,
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1"
      });
    } catch (logErr) {
      console.error("ActivityLog error (non-fatal):", logErr);
    }

    return NextResponse.json({ success: true, color: colorItem });
  } catch (err: any) {
    console.error("PUT Customizer Color Error:", err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Admin delete customizer color by id
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

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const colorItem = await CustomizerColor.findByIdAndDelete(id);
    if (!colorItem) {
      return NextResponse.json({ error: "Casing color not found" }, { status: 404 });
    }

    // Log deletion safely
    try {
      await ActivityLog.create({
        adminEmail: decoded?.email || "admin@fyneae.com",
        action: "CUSTOMIZER_COLOR_DELETE",
        details: `Deleted customizer casing: ${colorItem.name} (${colorItem.hex})`,
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1"
      });
    } catch (logErr) {
      console.error("ActivityLog error (non-fatal):", logErr);
    }

    return NextResponse.json({ success: true, message: "Casing color deleted successfully" });
  } catch (err: any) {
    console.error("DELETE Customizer Color Error:", err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}
