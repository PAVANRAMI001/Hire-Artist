import mongoose from "mongoose";

let isConnected = false;
const MongodbUrl=process.env.Mongodb_Url;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MongodbUrl, {
      dbName: "HireArtist",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
}
