import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST() {
    const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
    response.cookies.set('userId', '', {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 0, // hapus cookie
    });
    return response;
}
