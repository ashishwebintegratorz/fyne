import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";

// GET: Public endpoint to fetch all active products (optionally show drafts if admin)
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Check if requester is admin
    const isAdmin = await authenticateAdmin(request);
    
    // Admins can see drafts, clients only see active
    const query = isAdmin ? {} : { status: "active" };
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
    const { productId, name, price, description, benefits, faqs, category, stock, images, status } = body;

    if (!productId || !name || price === undefined || !description) {
      return NextResponse.json({ error: "Required fields missing: productId, name, price, description" }, { status: 400 });
    }

    // Check unique productId
    const existing = await Product.findOne({ productId });
    if (existing) {
      return NextResponse.json({ error: "A product with this Product ID already exists." }, { status: 400 });
    }

    const newProduct = new Product({
      productId,
      name,
      price,
      description,
      benefits: benefits || [],
      faqs: faqs || [],
      category: category || "Lip Balm",
      stock: stock !== undefined ? stock : 100,
      images: images || [],
      status: status || "active"
    });

    await newProduct.save();

    // Log action
    await ActivityLog.create({
      adminEmail: decoded.email,
      action: "PRODUCT_CREATE",
      details: `Created product: ${name} (${productId})`,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1"
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });

  } catch (err: any) {
    console.error("POST Product Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
