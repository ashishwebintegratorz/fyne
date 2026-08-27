import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const uppercaseCode = code.trim().toUpperCase();
    let coupon = await Coupon.findOne({ code: uppercaseCode });

    if (!coupon && uppercaseCode === "FIRST") {
      coupon = await Coupon.create({
        code: "FIRST",
        type: "percentage",
        value: 5,
        active: true
      });
    }

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code." }, { status: 400 });
    }

    if (!coupon.active) {
      return NextResponse.json({ error: "This coupon is no longer active." }, { status: 400 });
    }

    // Check expiration
    if (coupon.expirationDate && new Date() > new Date(coupon.expirationDate)) {
      return NextResponse.json({ error: "This coupon has expired." }, { status: 400 });
    }

    // Check usage limit
    if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "This coupon has reached its maximum usage limit." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value
      }
    });

  } catch (err: any) {
    console.error("Validate Coupon API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
