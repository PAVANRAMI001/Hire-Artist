export const dynamic = "force-dynamic";

import { connectDB } from "@/app/utils/db";
import { ProfilePic } from "@/app/api/models/profile";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { userid } = await req.json();

    const user = await ProfilePic.findOne({ _id: userid, user_roal: "artist" });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      url: user.url,
      roal: user.roal,
      rate: user.rate,
      description: user.description,
      phone: user.phone,
      Video: user.Video,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
