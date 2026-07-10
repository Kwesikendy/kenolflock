import { NextResponse } from 'next/server';
import { createPaymentLink } from '@/lib/moolre';

export async function POST(request: Request) {
  try {
    const { amount, email, purpose } = await request.json();

    if (!amount || !email) {
      return NextResponse.json(
        { error: 'Amount and Email are required' },
        { status: 400 }
      );
    }

    // Generate unique transaction reference without any dashes '-'
    const reference = `TXN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;

    // Redirect URL to success page
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const redirectUrl = `${protocol}://${host}/dashboard/donations/success?reference=${reference}&amount=${amount}`;

    const result = await createPaymentLink({
      amount: parseFloat(amount),
      email,
      reference,
      redirectUrl,
      currency: 'GHS', // GHS currency for Moolre Mobile Money collections
    });

    if (result.status && result.data?.authorization_url) {
      return NextResponse.json({ 
        success: true, 
        authorizationUrl: result.data.authorization_url,
        reference 
      });
    } else {
      return NextResponse.json(
        { error: result.message || 'Failed to generate payment link' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Donation Charge Error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}
