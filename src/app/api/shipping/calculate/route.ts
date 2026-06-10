import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ShippingZone from "@/models/ShippingZone";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { country, subtotal } = await request.json();

    if (!country) {
      return NextResponse.json({ error: "Country destination is required" }, { status: 400 });
    }

    // Attempt to match the country with a defined shipping zone
    // Case-insensitive query via simple matching (or regex)
    const zone = await ShippingZone.findOne({
      countries: { $regex: new RegExp(`^${country}$`, "i") }
    });

    if (zone) {
      const isFree = zone.minFreeShippingSubtotal !== null && subtotal >= zone.minFreeShippingSubtotal;
      return NextResponse.json({
        success: true,
        zoneName: zone.zoneName,
        baseRate: isFree ? 0 : zone.baseRate,
        priorityRate: zone.priorityRate,
        minFreeShippingSubtotal: zone.minFreeShippingSubtotal
      });
    }

    // Default global fallback: OVIA's standard signature free delivery, priority 15 USD
    return NextResponse.json({
      success: true,
      zoneName: "Global Default Zone",
      baseRate: 0, // Complimentary
      priorityRate: 15,
      minFreeShippingSubtotal: 0
    });

  } catch (err: any) {
    console.error("Calculate Shipping API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
