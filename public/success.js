const icon = document.querySelector('#resultIcon');
const title = document.querySelector('#resultTitle');
const text = document.querySelector('#resultText');
const summary = document.querySelector('#paymentSummary');
const productName = document.querySelector('#productName');
const amountPaid = document.querySelector('#amountPaid');
const paymentStatus = document.querySelector('#paymentStatus');

function formatAmount(amount, currency) {
  return new Intl.NumberFormat('ar-BE', {
    style: 'currency',
    currency: (currency || 'eur').toUpperCase()
  }).format((amount || 0) / 100);
}

async function verifyPayment() {
  const sessionId = new URLSearchParams(window.location.search).get('session_id');

  if (!sessionId) {
    icon.textContent = '!';
    title.textContent = 'لا توجد عملية دفع للتحقق منها';
    text.textContent = 'ارجع إلى المتجر وابدأ عملية شراء جديدة.';
    return;
  }

  try {
    const response = await fetch(`/api/session?session_id=${encodeURIComponent(sessionId)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'تعذر التحقق من الدفع.');
    }

    if (data.paid) {
      icon.textContent = '✓';
      title.textContent = 'تم الدفع بنجاح';
      text.textContent = 'وصل تأكيد العملية من Stripe، وتم تسجيل الدفعة.';
      productName.textContent = data.product || 'ساعة من MiniWatch';
      amountPaid.textContent = formatAmount(data.amountTotal, data.currency);
      paymentStatus.textContent = 'مدفوع';
      summary.classList.add('visible');
    } else {
      icon.textContent = '!';
      title.textContent = 'الدفع غير مكتمل';
      text.textContent = 'لم يؤكد Stripe استلام الدفعة. لم يتم عرض العملية كعملية ناجحة.';
    }
  } catch (error) {
    icon.textContent = '!';
    title.textContent = 'تعذر التحقق من الدفع';
    text.textContent = error.message || 'حدث خطأ غير متوقع.';
  }
}

verifyPayment();
