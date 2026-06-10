import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ActivityLog from "@/models/ActivityLog";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const decoded = await authenticateAdmin(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Get all logs, sorted by latest first, limit to 200
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(200);

    return NextResponse.json({
      success: true,
      logs: logs.map((log) => ({
        id: log._id.toString(),
        adminEmail: log.adminEmail,
        action: log.action,
        details: log.details,
        ipAddress: log.ipAddress || "127.0.0.1",
        timestamp: log.timestamp
      }))
    });

  } catch (err: any) {
    console.error("Fetch Activity Logs API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
