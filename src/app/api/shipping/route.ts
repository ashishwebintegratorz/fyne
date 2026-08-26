import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ShippingZone from "@/models/ShippingZone";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";
import { ShippingZoneSchema } from "@/lib/schemas";

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
    const result = ShippingZoneSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message || "Invalid shipping zone data" }, { status: 400 });
    }
    const { zoneName, countries, baseRate, priorityRate, minFreeShippingSubtotal } = result.data;

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

    // Log action safely
    try {
      await ActivityLog.create({
        adminEmail: decoded?.email || "admin@fyneae.com",
        action: "SHIPPING_ZONE_CREATE",
        details: `Created shipping zone: ${zoneName}`,
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1"
      });
    } catch (logErr) {
      console.error("ActivityLog error (non-fatal):", logErr);
    }

    return NextResponse.json({ success: true, zone }, { status: 201 });

  } catch (err: any) {
    console.error("POST Shipping Zone Error:", err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}
