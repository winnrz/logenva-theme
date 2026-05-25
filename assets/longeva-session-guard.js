(function () {
  const body = document.body;
  if (!body) return;

  const approved = body.dataset.longevaApproved === 'true';
  const cartCount = parseInt(body.dataset.cartCount || '0', 10);

  if (approved || cartCount <= 0) return;

  fetch(`${window.shopUrl || ''}/cart/clear.js`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  })
    .then((response) => (response.ok ? response.json() : null))
    .then((cart) => {
      body.dataset.cartCount = '0';
      if (cart && typeof publish === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
        publish(PUB_SUB_EVENTS.cartUpdate, { source: 'longeva-session-guard', cartData: cart });
      }
      document.querySelectorAll('.cart-count-bubble').forEach((node) => node.remove());
    })
    .catch(() => {});
})();
