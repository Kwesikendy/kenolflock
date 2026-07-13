export async function sendSms(recipient: string, message: string, simulate: boolean = false) {
  const apiKey = process.env.MOOLRE_SMS_KEY || process.env.MOOLRE_VAS_KEY || process.env.MOOLRE_SECRET_KEY || process.env.MOORLE_SMS_KEY;
  const senderId = process.env.MOOLRE_SENDER_ID || 'KenolFlock';
  const isProduction = process.env.NODE_ENV === 'production' || process.env.MOOLRE_ENV === 'production';

  if (simulate) {
    console.log(`[Moolre SMS Simulation Mode Forced] To: ${recipient} | Sender: ${senderId} | Msg: "${message}"`);
    return {
      status: true,
      code: '100',
      message: 'Message dispatched successfully (Simulated Sandbox Mode)',
      messageId: `sim_sms_${Date.now()}_${Math.floor(Math.random() * 9000)}`,
      simulated: true,
    };
  }

  // If live Moolre API key is provided, execute actual HTTP request to Moolre SMS Gateway
  if (apiKey && apiKey !== 'YOUR_MOOLRE_SMS_KEY' && !apiKey.includes('placeholder')) {
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
        'X-API-KEY': apiKey,
        'X-API-SECRETKEY': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'X-API-USER': process.env.MOOLRE_USERNAME || '',
        'X-API-ACCOUNT': process.env.MOOLRE_ACCOUNT_NUMBER || '',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send SMS via Moolre HTTP Gateway: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const json = await response.json();

    // Check if Moolre returned an error JSON inside HTTP 200 OK (e.g. status: 0 or code: AIN11)
    if (json.status !== 1 && json.status !== true) {
      const errCode = json.code || 'Moolre_Error';
      const errMsg = json.message || 'Unknown SMS dispatch failure';

      if (errCode === 'AIN11' || errMsg.toLowerCase().includes('authentication')) {
        throw new Error(`Moolre Authentication Error (${errCode}): Your Moolre API key is not authorized for VAS SMS sending. Please ensure you generated a dedicated VAS/SMS API Key ('MOOLRE_SMS_KEY') in your Moolre dashboard, and that your account has VAS permissions enabled.`);
      }

      throw new Error(`Moolre SMS Gateway Error (${errCode}): ${errMsg}`);
    }

    return json;
  }

  // Graceful Demo / Sandbox Simulation (if Moolre API keys are unset)
  console.log(`[Moolre SMS Simulation] To: ${recipient} | Sender: ${senderId} | Msg: "${message}"`);
  return {
    status: true,
    code: '100',
    message: 'Message dispatched successfully (Simulated Mode)',
    messageId: `sim_sms_${Date.now()}_${Math.floor(Math.random() * 9000)}`,
  };
}

export async function createPaymentLink(params: {
  amount: number;
  email: string;
  reference: string;
  redirectUrl: string;
  callbackUrl?: string;
  currency?: string;
}) {
  const pubKey = process.env.MOOLRE_PUBLIC_KEY || process.env.MOOLRE_SECRET_KEY;
  const isProduction = process.env.NODE_ENV === 'production' || process.env.MOOLRE_ENV === 'production';

  // If live Moolre Public Key or Secret Key is provided, request live embed checkout link from Moolre Gateway
  if (pubKey && pubKey !== 'YOUR_MOOLRE_PUBLIC_KEY' && !pubKey.includes('placeholder')) {
    const baseUrl = isProduction ? 'https://api.moolre.com' : 'https://sandbox.moolre.com';
    const url = `${baseUrl}/embed/link`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-PUBKEY': pubKey,
        'X-API-KEY': pubKey,
        'Authorization': `Bearer ${pubKey}`,
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

    return await response.json();
  }

  // Check if merchant provided their direct Moolre POS Link or checkout code
  const posLink = process.env.MOOLRE_POS_LINK || (pubKey && pubKey.includes('pos.moolre.com') ? pubKey : null);
  if (posLink) {
    console.log(`[Moolre POS Redirect] Redirecting to live POS link: ${posLink}`);
    return {
      status: true,
      code: '200',
      message: 'Redirecting to Moolre POS Link',
      data: {
        authorization_url: posLink,
        reference: params.reference,
      },
    };
  }

  // Graceful Demo / Sandbox Simulation (if Moolre Public Key or POS link is unset)
  console.log(`[Moolre Payment Simulation] Reference: ${params.reference} | Amount: ${params.currency || 'GHS'} ${params.amount} | Email: ${params.email}`);
  return {
    status: true,
    code: '200',
    message: 'Payment link generated successfully (Simulated Mode)',
    data: {
      authorization_url: params.redirectUrl,
      reference: params.reference,
    },
  };
}
