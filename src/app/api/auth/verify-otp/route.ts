import { NextResponse } from 'next/server';
import crypto from 'crypto';

const SECRET = process.env.MOOLRE_SECRET_KEY || 'default_secret_key_kenol_flock';

export async function POST(request: Request) {
  try {
    const { otp } = await request.json();
    const cookieHeader = request.headers.get('cookie');
    
    // Extract kf_otp cookie
    const match = cookieHeader?.match(/kf_otp=([^;]+)/);
    if (!match) {
      return NextResponse.json({ error: 'Verification session expired. Please request a new code.' }, { status: 400 });
    }

    const [hash, expiresStr, phone] = match[1].split('.');
    const expires = parseInt(expiresStr, 10);

    if (Date.now() > expires) {
      return NextResponse.json({ error: 'Code has expired. Please request a new code.' }, { status: 400 });
    }

    // Recompute expected hash
    const data = `${phone}.${otp}.${expires}`;
    const expectedHash = crypto.createHmac('sha256', SECRET).update(data).digest('hex');

    if (hash !== expectedHash) {
      return NextResponse.json({ error: 'Invalid 6-digit verification code.' }, { status: 400 });
    }

    // OTP is valid! Create authenticated session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete('kf_otp');
    response.cookies.set('kf_session', phone, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days session
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ error: 'Verification failed.' }, { status: 500 });
  }
}
