const PRODUCTS = {
  classic: { name: 'الساعة الكلاسيكية', amount: 300 },
  sport: { name: 'الساعة الرياضية', amount: 400 },
  elegant: { name: 'الساعة الأنيقة', amount: 1000 }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

export async function onRequestPost({ request, env }) {
  if (!env.STRIPE_SECRET_KEY) {
    return json({ error: 'مفتاح Stripe غير مضاف بعد في إعدادات Cloudflare.' }, 500);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'بيانات الطلب غير صحيحة.' }, 400);
  }

  const product = PRODUCTS[payload.productId];
  if (!product) {
    return json({ error: 'المنتج غير موجود.' }, 400);
  }

  const origin = new URL(request.url).origin;
  const form = new URLSearchParams();

  form.set('mode', 'payment');
  form.set('payment_method_types[0]', 'card');
  form.set('line_items[0][price_data][currency]', 'eur');
  form.set('line_items[0][price_data][product_data][name]', product.name);
  form.set('line_items[0][price_data][unit_amount]', String(product.amount));
  form.set('line_items[0][quantity]', '1');
  form.set('success_url', `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`);
  form.set('cancel_url', `${origin}/?cancelled=1`);
  form.set('locale', 'auto');
  form.set('submit_type', 'pay');
  form.set('payment_method_options[card][request_three_d_secure]', 'automatic');
  form.set('metadata[product_id]', payload.productId);
  form.set('payment_intent_data[description]', `MiniWatch demo - ${product.name}`);

  try {
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: form.toString()
    });

    const session = await stripeResponse.json();

    if (!stripeResponse.ok || !session.url) {
      console.error('Stripe checkout error:', session);
      return json({ error: 'تعذر فتح صفحة الدفع. تأكد من مفتاح Stripe ثم حاول مجددًا.' }, 502);
    }

    return json({ url: session.url });
  } catch (error) {
    console.error('Stripe network error:', error);
    return json({ error: 'تعذر الاتصال بخدمة الدفع.' }, 502);
  }
}
