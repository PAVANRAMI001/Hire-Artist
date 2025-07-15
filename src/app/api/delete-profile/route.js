import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/db";
import { ProfilePic } from "@/app/api/models/profile";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { del } from "@vercel/blob";

// Connect to MongoDB
await connectDB();

// 🔥 Helper to delete from Vercel Blob
const deleteIfBlob = async (url) => {
  if (!url || !url.includes('vercel-storage.com')) return;

  try {
    const pathname = new URL(url).pathname.slice(1); // remove leading "/"
    await del(pathname);
  } catch (err) {
    console.warn('Blob deletion failed or already gone:', err.message);
  }
};

export async function DELETE(req) {
  try {
    // ✅ Auth
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    cookieStore.set('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
      sameSite: 'strict',
    });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "your_default_fallback_key");
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;
    const username = decoded.username;

    if (!userId && !username) {
      return NextResponse.json({ error: "User ID or name required" }, { status: 400 });
    }

    const filter = userId ? { _id: userId } : { name: username };

    const result = await ProfilePic.findOneAndDelete(filter);

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔥 Delete image and video blobs (if URLs exist)
    await deleteIfBlob(result.url);   // profile image
    await deleteIfBlob(result.Video); // video

    return NextResponse.json({ success: true, deletedUser: result });

  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong", details: err.message },
      { status: 500 }
    );
  }
}
