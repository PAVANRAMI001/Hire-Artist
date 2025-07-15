
import { put } from '@vercel/blob'
import { ProfilePic } from '../../models/profile'
import mongoose from 'mongoose'

const MongodbUrl = process.env.Mongodb_Url

export async function POST(req) {
  try {
    // Connect to DB
    await mongoose.connect(MongodbUrl, {
      dbName: 'HireArtist',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const data = await req.formData()

    const file = data.get('file')
    const Video = data.get('Video')
    const name = data.get('name')
    const password = data.get('password')
    const roal = data.get('roal')
    const rate = data.get('rate')
    const description = data.get('description')
    const phone = data.get('phone')

    let videoUrl = ''
    let PhotoUrl = ''

    // ✅ Check required fields
    if (!name || !password || !roal || !rate || !description || !phone) {
      return Response.json({ success: false, error: 'Missing fields' }, { status: 400 })
    }

    // ✅ Check for duplicate
    const existing = await ProfilePic.findOne({ name })
    if (existing) {
      return Response.json({ success: false, error: 'User already exists' }, { status: 409 })
    }

    // ✅ Upload image to Vercel Blob
    if (file) {
      try {
        const fallbackName = `photo-${Date.now()}.jpg`; // default if file.name is missing
        const filename = file.name || fallbackName;
    
        const photoBlob = await put(filename, file, {
          access: 'public',
          addRandomSuffix: true, // avoids duplicate error
        });
    
        PhotoUrl = photoBlob.url;
      } catch (e) {
        console.error('Image upload failed:', e);
        return Response.json({ success: false, error: 'Image upload failed' }, { status: 500 });
      }
    }
    

    // ✅ Upload video to Vercel Blob
    if (Video) {
      try {
        const fallbackName = `video-${Date.now()}.mp4`; // use this if Video.name is missing
        const filename = Video.name || fallbackName;
    
        const videoBlob = await put(filename, Video, {
          access: 'public',
          addRandomSuffix: true,
        });
    
        videoUrl = videoBlob.url;
      } catch (e) {
        console.error('Video upload failed:', e);
        return Response.json({ success: false, error: 'Video upload failed' }, { status: 500 });
      }
    }
    

    // ✅ Create in DB
    await ProfilePic.create({
      user_roal: 'artist',
      name,
      password,
      url: PhotoUrl,
      roal,
      rate,
      description,
      phone,
      Video: videoUrl,
    })

    // ✅ Always return JSON
    return Response.json({ success: true, videoUrl, imageUrl: PhotoUrl })

  } catch (err) {
    console.error('Server error:', err)
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
