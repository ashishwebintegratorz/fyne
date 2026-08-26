import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CustomizerColor from "@/models/CustomizerColor";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";
import { CasingSchema } from "@/lib/schemas";

const DEFAULT_CASING_COLORS = [
  { name: "Cocoa Brown", hex: "#5c4033", image: "/products/cocoa-brown.jpg", desc: "Crocodile Embossed Cocoa" },
  { name: "Celeste Blue", hex: "#4ba3e3", image: "/products/sky-blue.png", desc: "Crocodile Embossed Sky" },
  { name: "Midnight Navy", hex: "#1d2951", image: "/products/midnight-navy.jpg", desc: "Crocodile Embossed Navy" },
  { name: "Forest Green", hex: "#1b4d3e", image: "/products/forest-green.jpg", desc: "Crocodile Embossed Green" },
  { name: "Ruby Red", hex: "#800020", image: "/products/ruby-red.jpg", desc: "Crocodile Embossed Ruby" }
];

// GET: Public fetch of all customizer colors (seeds if empty)
export async function GET(request: Request) {
  try {
    await connectToDatabase();

    let colors = await CustomizerColor.find().sort({ createdAt: 1 });

    if (colors.length === 0) {
      console.log("No customizer colors found in DB. Seeding defaults...");
      await CustomizerColor.insertMany(DEFAULT_CASING_COLORS);
      colors = await CustomizerColor.find().sort({ createdAt: 1 });
    }

    return NextResponse.json({ success: true, colors });
  } catch (err: any) {
    console.error("GET Customizer Colors Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Admin protected endpoint to create a customizer color
export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const decoded = await authenticateAdmin(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const result = CasingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message || "Invalid input data" }, { status: 400 });
    }
    const { name, hex, image, desc } = result.data;

    // Check unique casing name
    const existing = await CustomizerColor.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existing) {
      return NextResponse.json({ error: "A casing color option with this name already exists." }, { status: 400 });
    }

    const newColor = new CustomizerColor({
      name,
      hex,
      image,
      desc: desc || ""
    });

    await newColor.save();

    // Log action safely
    try {
      await ActivityLog.create({
        adminEmail: decoded?.email || "admin@fyneae.com",
        action: "CUSTOMIZER_COLOR_CREATE",
        details: `Created customizer casing: ${name} (${hex})`,
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1"
      });
    } catch (logErr) {
      console.error("ActivityLog error (non-fatal):", logErr);
    }

    return NextResponse.json({ success: true, color: newColor }, { status: 201 });
  } catch (err: any) {
    console.error("POST Customizer Color Error:", err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}
