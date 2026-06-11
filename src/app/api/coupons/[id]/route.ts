import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";
import { CouponSchema } from "@/lib/schemas";

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
    const result = CouponSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message || "Invalid coupon details" }, { status: 400 });
    }
    const validatedData = result.data;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    const fields = ["code", "type", "value", "expirationDate", "usageLimit", "active"] as const;
    for (const field of fields) {
      if (validatedData[field] !== undefined) {
        if (field === "code" && validatedData.code) {
          coupon.code = validatedData.code.trim().toUpperCase();
        } else if (field === "expirationDate") {
          coupon.expirationDate = validatedData.expirationDate ? new Date(validatedData.expirationDate) : null;
        } else {
          coupon[field] = validatedData[field] as any;
        }
      }
    }

    await coupon.save();

    await ActivityLog.create({
      adminEmail: decoded.email,
      action: "COUPON_UPDATE",
      details: `Updated coupon: ${coupon.code}`,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1"
    });

    return NextResponse.json({ success: true, coupon });
  } catch (err: any) {
    console.error("PUT Coupon Error:", err);
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
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    await ActivityLog.create({
      adminEmail: decoded.email,
      action: "COUPON_DELETE",
      details: `Deleted coupon: ${coupon.code}`,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1"
    });

    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (err: any) {
    console.error("DELETE Coupon Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
