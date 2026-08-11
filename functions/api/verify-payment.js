export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ error: "Missing required signature verification fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const keySecret = env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return new Response(JSON.stringify({ error: "Razorpay credentials are not configured on the server." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Verify signature using Web Crypto API
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(keySecret);
    const messageData = encoder.encode(text);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      messageData
    );

    // Convert signatureBuffer to hex string
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    const generatedSignature = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    if (generatedSignature === razorpay_signature) {
      return new Response(JSON.stringify({ status: "success", message: "Payment verified successfully." }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ status: "failure", error: "Signature mismatch. Verification failed." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
