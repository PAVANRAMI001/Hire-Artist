// app/api/get-users/route.js
import { connectDB } from "@/app/utils/db";
import { ProfilePic } from "../models/profile";

export async function GET() {
  await connectDB();
  const artists = await ProfilePic.find({ user_roal: "artist" });
  return Response.json(artists);
}
