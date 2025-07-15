import { writeFile } from 'fs/promises';
import path from 'path';
import { ProfilePic } from '../../models/profile';
//import { connectDB } from '@/app/utils/db';
import mongoose from 'mongoose';

const MongodbUrl=process.env.Mongodb_Url;
export async function POST(req) {
  await mongoose.connect(MongodbUrl, {
    dbName: "HireArtist",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const data = await req.formData();
  console.log("Hahaha the Request is come at this data base yaooooooooo! And the data is:",data);
  const file = data.get('file');
  const name = data.get('name');
  const password = data.get('password');

  const roal = data.get('roal');
  const rate = data.get('rate');
  const description = data.get('description');
  const phone = data.get('phone');
  const Video = data.get('Video');


  if (!file || !name || !roal || !rate || !description || !phone) return Response.json({ success: false });
  const result2=await ProfilePic.findOne({name});
  
  if(result2){
    return Response.json({ success: false})
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(process.cwd(), 'public/uploads', filename);

  await writeFile(filepath, buffer);

  const bytes1 = await Video.arrayBuffer();
  const buffer1 = Buffer.from(bytes1);
  const filename1 = `${Date.now()}-${Video.name}`;
  const filepath1 = path.join(process.cwd(), 'public/uploads', filename1);

  await writeFile(filepath1, buffer1);
  
  
  await ProfilePic.create({
    user_roal:"artist",
    name,
    password,
    url: `/uploads/${filename}`,
    roal,
    rate,
    description,
    phone,
    Video: `/uploads/${filename1}`,
  });

  return Response.json({ success: true});
  
}
