import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fyne-luxury-secret-key-123456";

export interface DecodedAdmin {
  id: string;
  email: string;
  role: string;
}

export function signToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string): DecodedAdmin | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedAdmin;
  } catch (err) {
    return null;
  }
}

// Helper to authenticate admin API requests
export async function authenticateAdmin(request: Request): Promise<DecodedAdmin | null> {
  const cookieHeader = request.headers.get("cookie") || "";
  // Simple regex parser for cookie values
  const match = cookieHeader.match(/admin_token=([^;]+)/);
  const token = match ? match[1] : null;

  if (!token) {
    // Check Authorization header fallback
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const tokenFromHeader = authHeader.substring(7);
      return verifyToken(tokenFromHeader);
    }
    return null;
  }

  return verifyToken(token);
}
