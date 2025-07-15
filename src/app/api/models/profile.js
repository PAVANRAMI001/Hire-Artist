import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  user_roal: String,
  url: String,
  name: String, // 👈 match with `formData.append("name", user_name)`
  roal:String,
  rate:String,
  description:String,
  phone:String,
  Video:String,
  password:String,

});

/*export const ProfilePic =  mongoose.model("User", ImageSchema);*/
export const ProfilePic = mongoose.models.User || mongoose.model("User", ImageSchema);
