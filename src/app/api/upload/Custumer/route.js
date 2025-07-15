

import { ProfilePic } from '../../models/profile';

import mongoose from 'mongoose';

const MongodbUrl=process.env.Mongodb_Url;
export async function POST(req) {
  await mongoose.connect(MongodbUrl, {
    dbName: "HireArtist",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const data = await req.formData();
  
  const name = data.get('name');
  const password = data.get('password');
  console.log("The Request is recived!! And the data is:",data);
  


  if (!password || !name ) return Response.json({ success: false });

  //const result1=await ProfilePic_developer.findOne({name});
  const result2=await ProfilePic.findOne({name});
  
  if(result2){
    return Response.json({ success: false})
  }
  

  await ProfilePic.create({
    name,
    password,
    user_roal:"custumer",
    
  });

  return Response.json({ success: true});
  
}
