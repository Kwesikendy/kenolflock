import { NextResponse } from 'next/server';
import { sendSms } from '@/lib/moolre';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipient, message } = body;

    if (!recipient || !message) {
      return NextResponse.json(
        { error: 'Missing recipient or message' },
        { status: 400 }
      );
    }

    const result = await sendSms(recipient, message);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('SMS Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send SMS' },
      { status: 500 }
    );
  }
}
