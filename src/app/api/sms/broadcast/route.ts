import { NextResponse } from 'next/server';
import { sendSms } from '@/lib/moolre';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { campaignName, targetAudience, customNumbers, message } = await request.json();

    if (!message || !campaignName) {
      return NextResponse.json(
        { error: 'Campaign Name and Message content are required' },
        { status: 400 }
      );
    }

    // Determine recipients list
    let recipientsList: string[] = [];
    if (customNumbers && customNumbers.trim().length > 0) {
      recipientsList = customNumbers
        .split(/[\n,]+/)
        .map((num: string) => num.trim())
        .filter((num: string) => num.length >= 9);
    } else if (targetAudience === 'all') {
      // Default test numbers or placeholder representation for congregation
      recipientsList = ['233541234567']; // Sample recipient for demonstration
    } else {
      recipientsList = ['233541234567'];
    }

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    // Send SMS via live Moolre API
    for (const phone of recipientsList) {
      try {
        await sendSms(phone, message);
        successCount++;
      } catch (err: any) {
        console.error(`Failed sending to ${phone}:`, err);
        failCount++;
        errors.push(`${phone}: ${err.message || 'Error'}`);
      }
    }

    // Attempt to log campaign in Firebase Firestore
    let firebaseLogged = false;
    try {
      await addDoc(collection(db, 'sms_broadcasts'), {
        campaignName,
        targetAudience,
        message,
        recipientsCount: recipientsList.length,
        successCount,
        failCount,
        createdAt: new Date().toISOString(),
      });
      firebaseLogged = true;
    } catch (fbErr) {
      console.warn('Firebase Firestore logging skipped or failed (check credentials):', fbErr);
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalRecipients: recipientsList.length,
        successCount,
        failCount,
        firebaseLogged,
      },
      message: `Broadcast completed. Sent: ${successCount}, Failed: ${failCount}`,
    });
  } catch (error: any) {
    console.error('SMS Broadcast Error:', error);
    return NextResponse.json(
      { error: error.message || 'Broadcast initiation failed' },
      { status: 500 }
    );
  }
}
