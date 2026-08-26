import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const SITE_PASSWORD = process.env.SITE_ACCESS_PASSWORD || "ALLGOOD";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (password.trim() !== SITE_PASSWORD) {
      return NextResponse.json({ error: "Invalid access password" }, { status: 401 });
    }

    const isHttps = req.headers.get("x-forwarded-proto") === "https" || req.url.startsWith("https://");
    const useSecureCookie = process.env.NODE_ENV === "production" && isHttps;

    const cookieStore = await cookies();
    cookieStore.set("site_access", "true", {
      httpOnly: true,
      secure: useSecureCookie,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verify access error:", err);
    return NextResponse.json({ error: "Failed to process access verification" }, { status: 500 });
  }
}
