import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import ActivityLog from "@/models/ActivityLog";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    // Auto-seed a default superadmin if no admins exist in DB
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log("No admins found. Seeding default admin admin@fyne.com / admin123");
      const defaultAdmin = new Admin({
        name: "Fyné Administrator",
        email: "admin@fyne.com",
        password: "admin123", // Will be hashed via Pre-save hook
        role: "superadmin"
      });
      await defaultAdmin.save();
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Sign JWT
    const token = signToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

    // Set HTTP-Only Cookie
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: "/",
      sameSite: "strict",
    });

    // Log login activity
    try {
      await ActivityLog.create({
        adminEmail: admin.email,
        action: "LOGIN",
        details: `Administrator logged in from ${request.headers.get("user-agent") || "unknown agent"}`,
        ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1"
      });
    } catch (logErr) {
      console.error("Failed to write activity log:", logErr);
    }

    return response;

  } catch (err: any) {
    console.error("Login API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
