// app/api/upgrade-client/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { put } from '@vercel/blob'

import { connectDB } from "@/app/utils/db";
import { ProfilePic } from "@/app/api/models/profile";

export const dynamic = "force-dynamic"; // Required for Vercel file writes

/* ─────────── Helper to save file to public/uploads ─────────── */
async function saveToUploads(fileObj) {
  //const uploadsDir = path.join(process.cwd(), "public", "uploads");
  //await mkdir(uploadsDir, { recursive: true });
  /*
  const ts = Date.now();
  const ext = path.extname(fileObj.name);
  const base = path.basename(fileObj.name, ext).replace(/\s+/g, "_");
  const filename = `${base}_${ts}${ext}`;
  const dest = path.join(uploadsDir, filename);
  */
  const filename = fileObj.name || 'upload.file';
  
  const blob = await put(filename, fileObj, {
    access: 'public',
    addRandomSuffix: true, // ✅ avoids duplicate filename errors
  });

  return blob.url;
 
}

/* ─────────── PUT /api/upgrade-client ─────────── */
export async function PUT(req) {
  // 1️⃣ Auth check
  const token = cookies().get("authToken")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret-key");
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // 2️⃣ Parse form
  const form = await req.formData();

  // 3️⃣ Extract scalar fields
  const update = {};
  ["roal", "rate", "phone", "description"].forEach((key) => {
    const val = form.get(key);
    if (val) update[key] = val;
  });

  // 4️⃣ Save avatar (key: file)
  const avatar = form.get("file");
  if (avatar && typeof avatar === "object" && avatar.size > 0) {
    update.url = await saveToUploads(avatar); // ← Save and set URL
  }

  // 5️⃣ Save intro video (key: video)
  const video = form.get("video");
  if (video && typeof video === "object" && video.size > 0) {
    update.Video = await saveToUploads(video); // ← Save and set video URL
  }

  // 6️⃣ Set role
  update.user_roal = "artist";

  // 7️⃣ Update MongoDB
  await connectDB();
  const filter = { name: payload.username, user_roal: "custumer" };
  const updated = await ProfilePic.findOneAndUpdate(filter, { $set: update }, { new: true });

  if (!updated) {
    return NextResponse.json({ error: "Client not found or already upgraded" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, profile: updated });
}

/* ─────────── Reject GETs ─────────── */
export function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, headers: { Allow: "PUT" } }
  );
}
