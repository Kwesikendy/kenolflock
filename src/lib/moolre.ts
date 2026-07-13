export async function sendSms(recipient: string, message: string, simulate: boolean = false) {
  // Use user's exact JWT VAS API key as the primary fallback if environment variable is not explicitly set
  const defaultVasKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2YXNpZCI6OTUzMywiZXhwIjoxOTU2NTI3OTk5fQ.Xak84Z8Rqwdp6eofQL2mixy-LhQaMNVJz2CRFWfpS0o';
  const apiKey = process.env.MOOLRE_SMS_KEY || process.env.MOOLRE_VAS_KEY || defaultVasKey;
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

    // Extract vasid from JWT payload if present (defaults to 9533)
    let vasId = '9533';
    try {
      const parts = apiKey.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        if (payload.vasid) vasId = String(payload.vasid);
      }
    } catch (e) {
      console.warn('Could not decode JWT payload for vasid, using 9533');
    }

    const headers = {
      'X-API-VASKEY': apiKey,
      'X-API-KEY': apiKey,
      'X-API-SECRETKEY': apiKey,
      'Authorization': `Bearer ${apiKey}`,
      'vasid': vasId,
      'X-API-USER': process.env.MOOLRE_USERNAME || '',
      'X-API-ACCOUNT': process.env.MOOLRE_ACCOUNT_NUMBER || '',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // 1st Attempt: GET request with parameters right in query string
    const params = new URLSearchParams({
      type: '1',
      senderid: senderId,
      recipient: recipient,
      message: message,
      vaskey: apiKey,
      token: apiKey,
      vasid: vasId,
    });

    const getUrl = `${MOOLRE_API_URL}?${params.toString()}`;
    let response = await fetch(getUrl, { method: 'GET', headers });
    let json: any = null;

    if (response.ok) {
      try {
        json = await response.json();
      } catch (e) {
        json = null;
      }
    }

    // 2nd Attempt: If GET returned status 0/AIN11 or failed, try POST with JSON body
    if (!response.ok || !json || (json.status !== 1 && json.status !== true)) {
      console.log(`[Moolre SMS] GET attempt returned ${json?.code || response.status}. Attempting POST with JSON payload...`);
      response = await fetch(MOOLRE_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: 1,
          senderid: senderId,
          recipient: recipient,
          message: message,
          vaskey: apiKey,
          token: apiKey,
          vasid: Number(vasId),
        }),
      });

      if (response.ok) {
        try {
          const postJson = await response.json();
          if (postJson.status === 1 || postJson.status === true) {
            return postJson;
          }
          json = postJson;
        } catch (e) {}
      }
    }

    if (!response.ok && !json) {
      const errorText = await response.text();
      throw new Error(`Failed to send SMS via Moolre HTTP Gateway: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Check if Moolre returned an error JSON inside HTTP 200 OK (e.g. status: 0 or code: AIN11)
    if (json && json.status !== 1 && json.status !== true) {
      const errCode = json.code || 'Moolre_Error';
      const errMsg = json.message || 'Unknown SMS dispatch failure';

      if (errCode === 'AIN11' || errMsg.toLowerCase().includes('authentication')) {
        throw new Error(`Moolre Authentication Error (${errCode}): Your Moolre API key (${apiKey.slice(0, 10)}...) was rejected by the gateway. Please verify that VAS ID ${vasId} has sufficient balance and active SMS broadcast permissions in your Moolre Merchant Portal.`);
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
