import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ShippingZone from "@/models/ShippingZone";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";

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
    const zone = await ShippingZone.findById(id);

    if (!zone) {
      return NextResponse.json({ error: "Shipping zone not found" }, { status: 404 });
    }

    const fields = ["zoneName", "countries", "baseRate", "priorityRate", "minFreeShippingSubtotal"];
    for (const field of fields) {
      if (body[field] !== undefined) {
        zone[field] = body[field];
      }
    }

    await zone.save();

    await ActivityLog.create({
      adminEmail: decoded.email,
      action: "SHIPPING_ZONE_UPDATE",
      details: `Updated shipping zone: ${zone.zoneName}`,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1"
    });

    return NextResponse.json({ success: true, zone });
  } catch (err: any) {
    console.error("PUT Shipping Zone Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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
    const zone = await ShippingZone.findByIdAndDelete(id);

    if (!zone) {
      return NextResponse.json({ error: "Shipping zone not found" }, { status: 404 });
    }

    await ActivityLog.create({
      adminEmail: decoded.email,
      action: "SHIPPING_ZONE_DELETE",
      details: `Deleted shipping zone: ${zone.zoneName}`,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1"
    });

    return NextResponse.json({ success: true, message: "Shipping zone deleted successfully" });
  } catch (err: any) {
    console.error("DELETE Shipping Zone Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
