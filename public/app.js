const statusBox = document.querySelector('#status');
const buttons = document.querySelectorAll('.buy-button');

const STRIPE_PAYMENT_LINK =
  'https://buy.stripe.com/9B6eVf8572VscUR5pV0VO00';

function showStatus(message) {
  statusBox.textContent = message;
  statusBox.className = 'status-message visible';

  window.clearTimeout(showStatus.timer);

  showStatus.timer = window.setTimeout(() => {
    statusBox.className = 'status-message';
  }, 4000);
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.product;

    if (productId === 'classic') {
      button.disabled = true;
      button.textContent = 'جارٍ فتح الدفع…';
      window.location.href = STRIPE_PAYMENT_LINK;
      return;
    }

    showStatus(
      'هذه الساعة للعرض فقط. الدفع مفعّل على ساعة €3.'
    );
  });
});
