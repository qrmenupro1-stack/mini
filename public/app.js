const statusBox = document.querySelector('#status');
const buttons = document.querySelectorAll('.buy-button');

const REVOLUT_PAYMENT_LINK =
  'https://revolut.me/ibrahiq7g5?currency=EUR&amount=300';

function showStatus(message) {
  if (!statusBox) return;

  statusBox.textContent = message;
  statusBox.className = 'status-message visible';

  clearTimeout(showStatus.timer);

  showStatus.timer = setTimeout(() => {
    statusBox.className = 'status-message';
  }, 4000);
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.product;

    // تفعيل الدفع فقط للساعة الكلاسيكية بسعر 3 يورو
    if (productId === 'classic') {
      button.disabled = true;
      button.textContent = 'جارٍ فتح الدفع…';

      window.location.href = REVOLUT_PAYMENT_LINK;
      return;
    }

    // الساعات الأخرى للعرض فقط
    showStatus('هذه الساعة للعرض فقط. الدفع مفعّل على ساعة €3.');
  });
});
