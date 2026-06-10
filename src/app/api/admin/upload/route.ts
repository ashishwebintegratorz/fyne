import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const decoded = await authenticateAdmin(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const urls: string[] = [];
    const uploadDir = join(process.cwd(), "public", "uploads");
    
    // Ensure upload directory exists recursively
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (!file.name) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean file name and prepend timestamp
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;
      const filePath = join(uploadDir, uniqueName);
      
      await writeFile(filePath, buffer);
      
      // Store public URL
      urls.push(`/uploads/${uniqueName}`);
    }

    return NextResponse.json({ success: true, urls });

  } catch (err: any) {
    console.error("Upload API Error:", err);
    return NextResponse.json({ error: "Internal Server Error during upload" }, { status: 500 });
  }
}
