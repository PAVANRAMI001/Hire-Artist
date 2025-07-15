import { ProfilePic } from '../models/profile';
import mongoose from 'mongoose';

mongoose.connect("mongodb://127.0.0.1:27017/HireArtist")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

export async function GET() {
  const images = await ProfilePic.find(); // includes name + url
  return Response.json(images);
}
