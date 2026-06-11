import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fyne-luxury-secret-key-123456";

let isJwtSecretValidated = false;

function validateJwtSecret() {
  if (isJwtSecretValidated) return;
  if (process.env.NODE_ENV === "production") {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is missing in production environment.");
    }
    if (process.env.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET must be at least 32 characters long in production.");
    }
    if (process.env.JWT_SECRET === "fyne-luxury-secret-key-123456") {
      throw new Error("Cannot use the default development JWT_SECRET in production environment.");
    }
  }
  isJwtSecretValidated = true;
}

export interface DecodedAdmin {
  id: string;
  email: string;
  role: string;
}

export function signToken(payload: { id: string; email: string; role: string }): string {
  validateJwtSecret();
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string): DecodedAdmin | null {
  validateJwtSecret();
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
