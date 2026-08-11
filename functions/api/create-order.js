export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { amount, currency, receipt } = body;

    // Validate amount >= 100 paise
    if (!amount || amount < 100) {
      return new Response(JSON.stringify({ error: "Amount must be at least 100 paise" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const keyId = env.RAZORPAY_KEY_ID;
    const keySecret = env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return new Response(JSON.stringify({ error: "Razorpay credentials are not configured on the server." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Call Razorpay API
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${keyId}:${keySecret}`)}`
      },
      body: JSON.stringify({
        amount,
        currency: currency || "INR",
        receipt: receipt || `receipt_${Date.now()}`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.description || "Razorpay API error" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      key_id: keyId
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
