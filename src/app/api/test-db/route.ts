import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import Coupon from "@/models/Coupon";
import ShippingZone from "@/models/ShippingZone";
import ActivityLog from "@/models/ActivityLog";

export async function GET() {
  try {
    await connectToDatabase();

    // 2. Seed default Coupon if empty
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      const defaultCoupon = new Coupon({
        code: "WELCOME10",
        type: "percentage",
        value: 10,
        usageLimit: null,
        usageCount: 0,
        active: true
      });
      await defaultCoupon.save();
      console.log("Diag: Seeded default coupon WELCOME10");
    }

    // 3. Seed default ShippingZone if empty
    const zoneCount = await ShippingZone.countDocuments();
    if (zoneCount === 0) {
      const defaultZone = new ShippingZone({
        zoneName: "Middle East Zone",
        countries: ["United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain"],
        baseRate: 0, // Complimentary Standard
        priorityRate: 15, // USD for Hot-stamping express
        minFreeShippingSubtotal: 80 // USD
      });
      await defaultZone.save();
      console.log("Diag: Seeded default GCC ShippingZone");
    }

    // Gather collection stats
    const stats = {
      admins: await Admin.countDocuments(),
      products: await Product.countDocuments(),
      orders: await Order.countDocuments(),
      customers: await Customer.countDocuments(),
      coupons: await Coupon.countDocuments(),
      shippingZones: await ShippingZone.countDocuments(),
      activityLogs: await ActivityLog.countDocuments()
    };

    return NextResponse.json({
      success: true,
      message: "MongoDB connection is healthy and default data models have been seeded.",
      stats
    });

  } catch (err: any) {
    console.error("Database Diag API error:", err);
    return NextResponse.json({
      success: false,
      error: err.message || "Database connection failure."
    }, { status: 500 });
  }
}
