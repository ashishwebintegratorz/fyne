import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ShippingZone from "@/models/ShippingZone";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";

// GET: Fetch all shipping zones
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const decoded = await authenticateAdmin(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const zones = await ShippingZone.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, zones });
  } catch (err: any) {
    console.error("GET Shipping Zones Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create a shipping zone
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const decoded = await authenticateAdmin(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { zoneName, countries, baseRate, priorityRate, minFreeShippingSubtotal } = body;

    if (!zoneName || !countries || !Array.isArray(countries) || countries.length === 0) {
      return NextResponse.json({ error: "Required fields missing: zoneName, countries list" }, { status: 400 });
    }

    // Check unique zoneName
    const existing = await ShippingZone.findOne({ zoneName });
    if (existing) {
      return NextResponse.json({ error: "A shipping zone with this name already exists." }, { status: 400 });
    }

    const zone = new ShippingZone({
      zoneName,
      countries,
      baseRate: baseRate !== undefined ? baseRate : 0,
      priorityRate: priorityRate !== undefined ? priorityRate : 15,
      minFreeShippingSubtotal: minFreeShippingSubtotal !== undefined ? minFreeShippingSubtotal : 100
    });

    await zone.save();

    // Log action
    await ActivityLog.create({
      adminEmail: decoded.email,
      action: "SHIPPING_ZONE_CREATE",
      details: `Created shipping zone: ${zoneName}`,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1"
    });

    return NextResponse.json({ success: true, zone }, { status: 201 });

  } catch (err: any) {
    console.error("POST Shipping Zone Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
