import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/db";
import { ProfilePic } from "@/app/api/models/profile";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Connect to MongoDB
await connectDB();

export async function DELETE(req) {
  try {
    // ✅ Auth (Optional but recommended)
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;
    cookieStore.set('authToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
        path: '/',
        sameSite: 'strict',
      });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || "your_default_fallback_key");
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // ✅ Parse ID or name from the request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;      // Optional: ?id=xxx
    const username = decoded.username;   // Optional: ?name=xxx

    if (!userId && !username) {
      return NextResponse.json({ error: "User ID or name required" }, { status: 400 });
    }

    const filter = userId ? { _id: userId } : { name: username };

    const result = await ProfilePic.findOneAndDelete(filter);

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedUser: result });
    
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong", details: err.message }, { status: 500 });
  }
}
