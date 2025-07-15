import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('authToken')?.value;
  const greeting = await get('greeting');
  if(greeting){
    return NextResponse.json(greeting);
  }
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next(); // ✅ allow access
  } catch (err) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
}

export const config = {
  matcher: ['/hiring/:path*','/upgrade-client/:path*','/welcome'], // protect hiring and subroutes
};

/*
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('authToken')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');

  // Redirect to dashboard if already logged in and on login page
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to login if trying to access protected page
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/login'],
};
*/