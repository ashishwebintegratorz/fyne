import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";
import { OrderUpdateSchema } from "@/lib/schemas";

export async function GET(
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
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error("GET Order Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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
    const result = OrderUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message || "Invalid order update details" }, { status: 400 });
    }
    const { status, trackingNumber } = result.data;

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const oldStatus = order.status;

    if (status !== undefined) order.status = status;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;

    await order.save();

    // Log the update
    await ActivityLog.create({
      adminEmail: decoded.email,
      action: "ORDER_UPDATE",
      details: `Updated order: ${order.orderReference} status from '${oldStatus}' to '${order.status}'`,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1"
    });

    // Update customer activity feed
    try {
      const customer = await Customer.findOne({ email: order.customerInfo.email });
      if (customer) {
        customer.activity.push({
          action: `ORDER_UPDATED: Status changed to ${order.status}`,
          timestamp: new Date()
        });
        await customer.save();
      }
    } catch (custErr) {
      console.error("Failed to update customer activity:", custErr);
    }

    return NextResponse.json({ success: true, order });

  } catch (err: any) {
    console.error("PUT Order Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
