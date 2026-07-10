export async function sendSms(recipient: string, message: string) {
  const apiKey = process.env.MOOLRE_SMS_KEY || process.env.MOORLE_SMS_KEY;
  if (!apiKey) {
    throw new Error('MOOLRE_SMS_KEY is not set in environment variables');
  }

  const senderId = process.env.MOOLRE_SENDER_ID || 'KenolFlock';
  const isProduction = process.env.NODE_ENV === 'production' || process.env.MOOLRE_ENV === 'production';
  const baseUrl = isProduction ? 'https://api.moolre.com' : 'https://sandbox.moolre.com';
  const MOOLRE_API_URL = `${baseUrl}/open/sms/send`;

  const params = new URLSearchParams({
    type: '1',
    senderid: senderId,
    recipient: recipient,
    message: message,
  });

  const url = `${MOOLRE_API_URL}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-API-VASKEY': apiKey,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send SMS: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data;
}

export async function createPaymentLink(params: {
  amount: number;
  email: string;
  reference: string;
  redirectUrl: string;
  callbackUrl?: string;
  currency?: string;
}) {
  const pubKey = process.env.MOOLRE_PUBLIC_KEY;
  if (!pubKey) {
    throw new Error('MOOLRE_PUBLIC_KEY is not set in environment variables');
  }

  // Toggle between sandbox and production url
  const isProduction = process.env.NODE_ENV === 'production' || process.env.MOOLRE_ENV === 'production';
  const baseUrl = isProduction ? 'https://api.moolre.com' : 'https://sandbox.moolre.com';
  const url = `${baseUrl}/embed/link`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-API-PUBKEY': pubKey,
      'X-API-USER': process.env.MOOLRE_USERNAME || '',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      amount: params.amount,
      email: params.email,
      externalref: params.reference,
      type: 1,
      reusable: "0",
      accountnumber: process.env.MOOLRE_ACCOUNT_NUMBER || '',
      redirect: params.redirectUrl,
      callback: params.callbackUrl,
      currency: params.currency || 'GHS',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Moolre API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data;
}
