import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";
import mongoose from "mongoose";

// GET: Public fetch of single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    // Search by Mongoose ObjectId if valid, else search by productId slug
    let query = {};
    if (mongoose.isValidObjectId(id)) {
      query = { $or: [{ _id: id }, { productId: id }] };
    } else {
      query = { productId: id };
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
    const body = await request.json();

    // Query to find by ID or productId
    const query = mongoose.isValidObjectId(id)
      ? { $or: [{ _id: id }, { productId: id }] }
      : { productId: id };

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
    ];

    for (const field of fields) {
      if (body[field] !== undefined) {
        product[field] = body[field];
      }
    }

    await product.save();

    // Log update
    await ActivityLog.create({
      adminEmail: decoded.email,
      action: "PRODUCT_UPDATE",
      details: `Updated product: ${product.name} (${product.productId})`,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1"
    });

    return NextResponse.json({ success: true, product });

  } catch (err: any) {
    console.error("PUT Product Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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
    const query = mongoose.isValidObjectId(id)
      ? { $or: [{ _id: id }, { productId: id }] }
      : { productId: id };

    const product = await Product.findOneAndDelete(query);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Log deletion
    await ActivityLog.create({
      adminEmail: decoded.email,
      action: "PRODUCT_DELETE",
      details: `Deleted product: ${product.name} (${product.productId})`,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1"
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });

  } catch (err: any) {
    console.error("DELETE Product Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
