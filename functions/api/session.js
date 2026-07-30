function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

export async function onRequestGet({ request, env }) {
  if (!env.STRIPE_SECRET_KEY) {
    return json({ error: 'مفتاح Stripe غير مضاف بعد في إعدادات Cloudflare.' }, 500);
  }

  const sessionId = new URL(request.url).searchParams.get('session_id');
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    return json({ error: 'رقم عملية الدفع غير صحيح.' }, 400);
  }

  try {
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=line_items`,
      {
        headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` }
      }
    );

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      console.error('Stripe session error:', session);
      return json({ error: 'تعذر التحقق من عملية الدفع.' }, 502);
    }

    return json({
      paid: session.payment_status === 'paid',
      amountTotal: session.amount_total,
      currency: session.currency,
      product: session.line_items?.data?.[0]?.description || null
    });
  } catch (error) {
    console.error('Stripe session network error:', error);
    return json({ error: 'تعذر الاتصال بخدمة الدفع.' }, 502);
  }
}
