// src/app/api/find-loggedUser-data/route.ts (or .js)

import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/db";
import { ProfilePic } from "../models/profile";   // ← keep this if models/ lives next to api/

export async function POST(req) {
  try {
    // 1️⃣ open (or reuse) the Mongo connection
    await connectDB();

    // 2️⃣ parse and validate the request body
    const { username } = await req.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "username is required" },
        { status: 400 }
      );
    }

    // 3️⃣ query exactly one profile (findOne) — or use find/lean if you expect many
    const profile = await ProfilePic.findOne({ name: username }).lean();

    if (!profile) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 4️⃣ success
    return NextResponse.json(profile); // status 200 by default
    
  } catch (err) {
    console.error("find-loggedUser-data error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
