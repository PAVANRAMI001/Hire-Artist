import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  console.log("The Recived Token Is:",cookieStore.get('authToken'));
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return Response.json({ username: decoded.username ,userId:decoded.id});
  } catch {
    return new Response('Invalid token', { status: 401 });
  }
}
