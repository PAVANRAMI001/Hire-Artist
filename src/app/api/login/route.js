import { NextResponse } from 'next/server';
import { connectDB } from '@/app/utils/db';
import { ProfilePic } from '../models/profile';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  await connectDB();
  console.log("The Secrate Is:",JWT_SECRET);
  const { username, password } = await req.json();

  const user = await ProfilePic.findOne({ name: username, password });
  

  if (!user) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  const token = jwt.sign(
    { username: user.name, id: user._id },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const cookieStore = await cookies();
  console.log("The Token Is:",token);
  cookieStore.set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600,
    sameSite: 'strict',
    path: '/',
  });

  return NextResponse.json({ success: true });
}
