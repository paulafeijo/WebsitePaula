/* Efeito de digitar sozinho no título da página inicial */
(function () {
  var el = document.querySelector('.home-title');
  if (!el) return;
  var text = el.getAttribute('data-text') || el.textContent.trim();
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  el.setAttribute('aria-label', text);
  el.innerHTML = '<span class="typed" aria-hidden="true"></span><span class="cursor" aria-hidden="true"></span>';
  var out = el.querySelector('.typed');

  if (reduce) { out.textContent = text; return; }

  var i = 0;
  function step() {
    i++;
    out.textContent = text.slice(0, i);
    if (i < text.length) setTimeout(step, 130);
  }
  setTimeout(step, 400);
})();
