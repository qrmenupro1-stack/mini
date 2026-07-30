const statusBox = document.querySelector('#status');
const buttons = document.querySelectorAll('.buy-button');

function showStatus(message, type = 'info') {
  statusBox.textContent = message;
  statusBox.className = `status-message visible${type === 'error' ? ' error' : ''}`;
  window.clearTimeout(showStatus.timer);
  showStatus.timer = window.setTimeout(() => {
    statusBox.className = 'status-message';
  }, 4500);
}

const params = new URLSearchParams(window.location.search);
if (params.get('cancelled') === '1') {
  showStatus('تم إلغاء الدفع، ولم يتم خصم أي مبلغ.');
  window.history.replaceState({}, '', '/');
}

buttons.forEach((button) => {
  button.addEventListener('click', async () => {
    const productId = button.dataset.product;
    const originalText = button.textContent;

    buttons.forEach((item) => { item.disabled = true; });
    button.textContent = 'جارٍ فتح الدفع…';

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'تعذر بدء عملية الدفع.');
      }

      window.location.assign(data.url);
    } catch (error) {
      showStatus(error.message || 'حدث خطأ غير متوقع.', 'error');
      buttons.forEach((item) => { item.disabled = false; });
      button.textContent = originalText;
    }
  });
});
