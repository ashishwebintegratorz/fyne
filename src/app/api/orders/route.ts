import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const decoded = await authenticateAdmin(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const orders = await Order.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    console.error("GET Orders Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
