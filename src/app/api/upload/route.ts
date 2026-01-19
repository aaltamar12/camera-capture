import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  // In production: stream to S3, extract text with Textract
  return NextResponse.json({ name: file.name, size: file.size, processedAt: new Date().toISOString() });
}
