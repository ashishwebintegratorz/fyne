import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";
import { ProductSchema } from "@/lib/schemas";

// GET: Public endpoint to fetch all active products (optionally show drafts if admin)
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const categoryQuery = searchParams.get("category");

    // Check if requester is admin
    const isAdmin = await authenticateAdmin(request);
    
    // Admins can see drafts, clients only see active
    const query: any = isAdmin ? {} : { status: "active" };
    if (categoryQuery) {
      const normalizedQuery = categoryQuery.replace(/-/g, " ").trim();
      query.$or = [
        { category: { $regex: new RegExp(`^${normalizedQuery}$`, "i") } },
        { category: { $regex: new RegExp(`^${categoryQuery.trim()}$`, "i") } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    console.error("GET Products Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Admin protected endpoint to create a product
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const decoded = await authenticateAdmin(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const result = ProductSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message || "Invalid input data" }, { status: 400 });
    }

    const { productId, name, price, description, benefits, faqs, category, defaultColor, colorHex, textPosition, textPositionY, textPositionX, stock, images, status } = result.data;
    const cleanProductId = productId.toLowerCase().trim().replace(/[^a-z0-9-]/g, "") || productId;

    // Check unique productId
    const existing = await Product.findOne({
      $or: [{ productId: cleanProductId }, { productId }]
    });
    if (existing) {
      return NextResponse.json({ error: `A product with SKU ID "${cleanProductId}" already exists.` }, { status: 400 });
    }

    const newProduct = new Product({
      productId: cleanProductId,
      name,
      price,
      description,
      benefits: benefits || [],
      faqs: faqs || [],
      category: category || "Lip Balm",
      defaultColor: defaultColor || "",
      colorHex: colorHex || "",
      textPosition: textPosition || "center",
      textPositionY: textPositionY !== undefined ? textPositionY : 48,
      textPositionX: textPositionX || "center",
      stock: stock !== undefined ? stock : 100,
      images: images || [],
      status: status || "active"
    });

    await newProduct.save();

    // Log action safely
    try {
      await ActivityLog.create({
        adminEmail: decoded?.email || "admin@fyneae.com",
        action: "PRODUCT_CREATE",
        details: `Created product: ${name} (${cleanProductId})`,
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1"
      });
    } catch (logErr) {
      console.error("ActivityLog error (non-fatal):", logErr);
    }

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });

  } catch (err: any) {
    console.error("POST Product Error:", err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}
