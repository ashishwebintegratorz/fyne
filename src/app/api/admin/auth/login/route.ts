import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import ActivityLog from "@/models/ActivityLog";
import { signToken } from "@/lib/auth";
import { LoginSchema } from "@/lib/schemas";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// Dummy bcrypt hash for timing attack mitigation
const DUMMY_HASH = "$2a$10$e8W/695d7wZ8y8/N8q5L2e1lK1v3n4m5o6p7q8r9s0t1u2v3w4x5y";

// In-memory rate limiting map for login attempts: ip -> { count, resetTime }
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return true;
  if (now > record.resetTime) {
    loginAttempts.delete(ip);
    return true;
  }
  return record.count < MAX_ATTEMPTS;
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now > record.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + LOCKOUT_MS });
  } else {
    record.count += 1;
  }
}

function clearRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(request: Request) {
  const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "unknown agent";

  // Rate limit check
  if (!checkRateLimit(ipAddress)) {
    return NextResponse.json(
      { error: "Too many failed login attempts. Account temporarily locked for 15 minutes." },
      { status: 429 }
    );
  }

  try {
    await connectToDatabase();
    
    // Seed initial superadmin if database has 0 admin accounts
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const initialEmail = (process.env.ADMIN_INITIAL_EMAIL || "admin@fyneae.com").toLowerCase().trim();
      const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || "FyneAdmin2026!";
      const initialAdmin = new Admin({
        name: "Fyné Administrator",
        email: initialEmail,
        password: initialPassword,
        role: "superadmin"
      });
      await initialAdmin.save();
    }

    const body = await request.json();
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message || "Invalid input format" }, { status: 400 });
    }
    
    // Explicit string coercion to prevent NoSQL object injection
    const emailStr = String(result.data.email).toLowerCase().trim();
    const passwordStr = String(result.data.password);

    const admin = await Admin.findOne({ email: emailStr });

    // Timing-attack prevention: perform bcrypt compare even if admin does not exist
    const passwordToCompare = admin ? admin.password : DUMMY_HASH;
    const isMatch = await bcrypt.compare(passwordStr, passwordToCompare);

    if (!admin || !isMatch) {
      recordFailedAttempt(ipAddress);
      
      // Audit log failed attempt
      try {
        await ActivityLog.create({
          adminEmail: emailStr,
          action: "LOGIN_FAILED",
          details: `Failed authentication attempt for ${emailStr}`,
          ipAddress: ipAddress
        });
      } catch (logErr) {
        // Ignore log write failure
      }

      return NextResponse.json({ error: "Invalid email or security password." }, { status: 401 });
    }

    // Success! Clear failed attempts
    clearRateLimit(ipAddress);

    // Sign JWT
    const token = signToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

    const isHttps = request.headers.get("x-forwarded-proto") === "https" || request.url.startsWith("https://");
    const useSecureCookie = process.env.NODE_ENV === "production" && isHttps;

    // Set HTTP-Only Cookie with strict security
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: useSecureCookie,
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "strict",
    });

    // Log successful login activity
    try {
      await ActivityLog.create({
        adminEmail: admin.email,
        action: "LOGIN_SUCCESS",
        details: `Administrator logged in from ${userAgent}`,
        ipAddress: ipAddress
      });
    } catch (logErr) {
      // Ignore log write failure
    }

    return response;

  } catch (err: any) {
    console.error("Secure Admin Login Error:", err);
    return NextResponse.json({ error: "Internal Authentication Error." }, { status: 500 });
  }
}
