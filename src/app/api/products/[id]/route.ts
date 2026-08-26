import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";
import mongoose from "mongoose";
import { ProductSchema } from "@/lib/schemas";

// GET: Public fetch of single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const decodedId = decodeURIComponent(id).trim();

    let query = {};
    if (mongoose.isValidObjectId(decodedId)) {
      query = { $or: [{ _id: decodedId }, { productId: decodedId }, { productId: decodedId.toLowerCase() }] };
    } else {
      query = { $or: [{ productId: decodedId }, { productId: decodedId.toLowerCase() }] };
    }

    const product = await Product.findOne(query);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    console.error("GET Product Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT: Admin update product details
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
    const decodedId = decodeURIComponent(id).trim();
    const body = await request.json();
    const result = ProductSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message || "Invalid input data" }, { status: 400 });
    }
    const validatedData = result.data;

    // Query to find by ID or productId
    const query = mongoose.isValidObjectId(decodedId)
      ? { $or: [{ _id: decodedId }, { productId: decodedId }, { productId: decodedId.toLowerCase() }] }
      : { $or: [{ productId: decodedId }, { productId: decodedId.toLowerCase() }] };

    const product = await Product.findOne(query);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update fields
    const fields = [
      "name",
      "price",
      "description",
      "benefits",
      "faqs",
      "category",
      "stock",
      "images",
      "status"
    ] as const;

    for (const field of fields) {
      if (validatedData[field] !== undefined) {
        product[field] = validatedData[field] as any;
        if (field === "images" || field === "benefits" || field === "faqs") {
          product.markModified(field);
        }
      }
    }

    await product.save();

    // Log update safely
    try {
      await ActivityLog.create({
        adminEmail: decoded?.email || "admin@fyneae.com",
        action: "PRODUCT_UPDATE",
        details: `Updated product: ${product.name} (${product.productId})`,
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1"
      });
    } catch (logErr) {
      console.error("ActivityLog error (non-fatal):", logErr);
    }

    return NextResponse.json({ success: true, product });

  } catch (err: any) {
    console.error("PUT Product Error:", err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Admin delete product
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
      ? { $or: [{ _id: decodedId }, { productId: decodedId }, { productId: decodedId.toLowerCase() }] }
      : { $or: [{ productId: decodedId }, { productId: decodedId.toLowerCase() }] };

    const product = await Product.findOneAndDelete(query);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Log deletion safely
    try {
      await ActivityLog.create({
        adminEmail: decoded?.email || "admin@fyneae.com",
        action: "PRODUCT_DELETE",
        details: `Deleted product: ${product.name} (${product.productId})`,
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1"
      });
    } catch (logErr) {
      console.error("ActivityLog error (non-fatal):", logErr);
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });

  } catch (err: any) {
    console.error("DELETE Product Error:", err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}
