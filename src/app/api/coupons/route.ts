import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";
import { CouponSchema } from "@/lib/schemas";

// GET: List all coupons
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const decoded = await authenticateAdmin(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, coupons });
  } catch (err: any) {
    console.error("GET Coupons Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create a coupon
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const decoded = await authenticateAdmin(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const result = CouponSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message || "Invalid coupon details" }, { status: 400 });
    }
    const { code, type, value, expirationDate, usageLimit, active } = result.data;

    const uppercaseCode = code.trim().toUpperCase();

    // Check unique code
    const existing = await Coupon.findOne({ code: uppercaseCode });
    if (existing) {
      return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 400 });
    }

    const coupon = new Coupon({
      code: uppercaseCode,
      type,
      value,
      expirationDate: expirationDate ? new Date(expirationDate) : null,
      usageLimit: usageLimit !== undefined ? usageLimit : null,
      active: active !== undefined ? active : true
    });

    await coupon.save();

    // Log coupon creation
    await ActivityLog.create({
      adminEmail: decoded.email,
      action: "COUPON_CREATE",
      details: `Created coupon code: ${uppercaseCode} (${type}: ${value})`,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1"
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });

  } catch (err: any) {
    console.error("POST Coupon Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
