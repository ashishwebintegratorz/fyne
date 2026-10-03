import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";

const DEFAULT_CATEGORIES = [
  { name: "Lip Balm", slug: "lip-balm", description: "Luxury handcrafted lip balms" },
  { name: "Lipliner Case", slug: "lipliner-case", description: "Bespoke monogrammed lipliner leather cases" },
  { name: "Leather Casing", slug: "leather-casing", description: "Bespoke monogrammed leather cases" },
  { name: "Refill Cartridge", slug: "refill-cartridge", description: "Nourishing replacement balm cartridges" },
  { name: "Gift Sets", slug: "gift-sets", description: "Curated luxury gift packaging" },
  { name: "Accessories", slug: "accessories", description: "Signature atelier accessories" }
];

// GET: Public fetch of all product categories (seeds defaults if none exist)
export async function GET() {
  try {
    await connectToDatabase();

    let categories = await Category.find().sort({ name: 1 });

    if (categories.length === 0) {
      console.log("No categories found in DB. Seeding defaults...");
      await Category.insertMany(DEFAULT_CATEGORIES);
      categories = await Category.find().sort({ name: 1 });
    }

    return NextResponse.json({ success: true, categories });
  } catch (err: any) {
    console.error("GET Categories Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Admin protected endpoint to create a category
export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const decoded = await authenticateAdmin(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const name = (body.name || "").trim();
    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Category name must be at least 2 characters long." }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const description = (body.description || "").trim();

    // Check unique category
    const existing = await Category.findOne({
      $or: [{ name: { $regex: new RegExp(`^${name}$`, "i") } }, { slug }]
    });

    if (existing) {
      return NextResponse.json({ error: `Category "${name}" already exists.` }, { status: 400 });
    }

    const newCategory = new Category({
      name,
      slug,
      description
    });

    await newCategory.save();

    // Log action safely
    try {
      await ActivityLog.create({
        adminEmail: decoded?.email || "admin@fyneae.com",
        action: "CATEGORY_CREATE",
        details: `Created category: ${name} (${slug})`,
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1"
      });
    } catch (logErr) {
      console.error("ActivityLog error (non-fatal):", logErr);
    }

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (err: any) {
    console.error("POST Category Error:", err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}
