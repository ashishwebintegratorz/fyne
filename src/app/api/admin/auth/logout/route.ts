import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    // Attempt authentication first to log the event
    const decoded = await authenticateAdmin(request);
    if (decoded) {
      await ActivityLog.create({
        adminEmail: decoded.email,
        action: "LOGOUT",
        details: "Administrator logged out manually",
        ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1"
      });
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    
    // Invalidate cookie
    response.cookies.set({
      name: "admin_token",
      value: "",
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;

  } catch (err: any) {
    console.error("Logout API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
