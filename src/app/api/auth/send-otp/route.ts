import { NextResponse } from 'next/server';
import { sendSms } from '@/lib/moolre';
import crypto from 'crypto';

const SECRET = process.env.MOOLRE_SECRET_KEY || 'default_secret_key_kenol_flock';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create an HMAC hash of phone + otp + expiry timestamp
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes validity
    const data = `${phone}.${otp}.${expires}`;
    const hash = crypto.createHmac('sha256', SECRET).update(data).digest('hex');

    // Send live SMS via Moolre API
    const message = `Your Kenol Flock login code is ${otp}. Valid for 5 minutes. Do not share this code.`;
    await sendSms(phone, message);

    // Store secure hash cookie for verification
    const response = NextResponse.json({ success: true, message: 'OTP sent via SMS' });
    response.cookies.set('kf_otp', `${hash}.${expires}.${phone}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 300, // 5 minutes
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Send OTP Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send SMS OTP' },
      { status: 500 }
    );
  }
}
