import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const decoded = await authenticateAdmin(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (email) {
      // Find single customer with full details and population of their orders
      const customer = await Customer.findOne({ email }).populate("orders");
      if (!customer) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, customer });
    }

    // List all customers
    const customers = await Customer.find().sort({ totalSpend: -1 });

    return NextResponse.json({ success: true, customers });
  } catch (err: any) {
    console.error("GET Customers Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
