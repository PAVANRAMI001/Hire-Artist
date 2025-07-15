// app/api/update-profile/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { put } from '@vercel/blob';
import {del} from '@vercel/blob';
import { connectDB } from "@/app/utils/db";
import { ProfilePic } from "@/app/api/models/profile"; // adjust if needed

export const dynamic = "force-dynamic"; // allow FS ops in route

/* ─────────────────────────────── PUT /api/update-profile */
export async function PUT(req) {
  /* 1️⃣  Authenticate */
  const token = cookies().get("authToken")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload;
  try {
    payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_default_fallback_key"
    );
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  /* 2️⃣  Parse multipart form‑data */
  const form = await req.formData();
  console.log("The form data:",form);
  const scalarKeys = [
    "name",
    "roal",
    "rate",
    "description",
    "phone",
    "Video",      // text URL for demo video (optional)
    "user_roal",
    "password"    // stored as‑is (⚠️ not hashed)
  ];

  const update = {};
  scalarKeys.forEach((k) => {
    const val = form.get(k);
    if (val !== null && val !== "") update[k] = val;
  });

  /* 3️⃣  Fetch current profile to know existing file paths */
  await connectDB();
  const filter = { name: payload.username }; // or payload._id/email
  const oldDoc = await ProfilePic.findOne(filter);
  if (!oldDoc)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  /* 4️⃣  Helper: save a file & return public URL */
  const saveFile = async (fileObj) => {
    /*
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ts = Date.now();
    const parts = fileObj.name.split(".");
    const ext = parts.length > 1 ? parts.pop() : "";
    const base = parts.join(".").replace(/\s+/g, "_");
    const filename = `${base}_${ts}${ext ? "." + ext : ""}`;
    const dest = path.join(uploadsDir, filename);

    await writeFile(dest, Buffer.from(await fileObj.arrayBuffer()));
    return `/uploads/${filename}`; // public‑facing path
    */
    const filename = fileObj.name || 'upload.file';
  
    const blob = await put(filename, fileObj, {
      access: 'public',
      addRandomSuffix: true, // ✅ avoids duplicate filename errors
    });
  
    return blob.url;
  };

  /* 5️⃣  Handle avatar file */
  const avatarFile = form.get("file");
  if (avatarFile && typeof avatarFile === "object" && avatarFile.size > 0) {
    update.url = await saveFile(avatarFile);
  }

  /* 6️⃣  Handle video upload (optional) */
  const videoFile = form.get("video");
  if (videoFile && typeof videoFile === "object" && videoFile.size > 0) {
    update.Video = await saveFile(videoFile);
  }

  /* 7️⃣  Update the document */
  const options = { new: true };
  const newDoc = await ProfilePic.findOneAndUpdate(
    filter,
    { $set: update },
    options
  );

  /* 8️⃣  Delete old local files if they were replaced */
  const deleteIfBlob = async (url) => {
    if (!url || !url.includes('vercel-storage.com')) return;
  
    try {
      // Get the path from the full URL
      const pathname = new URL(url).pathname.slice(1); // remove leading "/"
      await del(pathname);
    } catch (err) {
      console.warn('Blob deletion failed or already gone:', err.message);
    }
  };

  if (update.url && oldDoc.url && oldDoc.url !== update.url) {
    await deleteIfBlob(oldDoc.url);
  }
  
  if (update.Video && oldDoc.Video && oldDoc.Video !== update.Video) {
    await deleteIfBlob(oldDoc.Video);
  }
  

  return NextResponse.json({ ok: true, profile: newDoc });
}

/* ─────────────────────────────── Reject other methods */
export function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, headers: { Allow: "PUT" } }
  );
}
