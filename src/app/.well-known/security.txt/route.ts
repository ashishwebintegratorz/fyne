import { NextResponse } from "next/server";

export async function GET() {
  const content = `Contact: mailto:security@fyneae.com
Expires: 2027-12-31T23:59:59.000Z
Preferred-Languages: en, ar
Canonical: https://fyneae.com/.well-known/security.txt
Policy: https://fyneae.com/security`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
