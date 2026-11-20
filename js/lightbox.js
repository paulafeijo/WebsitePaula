/*
  Lightbox / carrossel simples.

  Como usar em uma página de álbum:
  1. Defina um array global `photos`, ex:
     const photos = [
       { src: "../images/verao-2024/foto1.jpg", caption: "Praia ao pôr do sol" },
       { src: "../images/verao-2024/foto2.jpg", caption: "Trilha na manhã" }
     ];
  2. Tenha na página um elemento <ul id="gallery" class="photo-grid"></ul>
  3. Inclua este script depois de definir `photos`.
  Miniatura e imagem grande usam o mesmo arquivo por padrão; se quiser
  miniaturas separadas, adicione um campo "thumb" em cada foto.
*/

(function () {
  const gallery = document.getElementById('gallery');
  if (!gallery || typeof photos === 'undefined') return;

  let currentIndex = 0;

  // Monta as miniaturas
  photos.forEach((photo, index) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.className = 'photo-thumb';
    button.type = 'button';
    button.setAttribute('aria-label', 'Abrir foto: ' + (photo.caption || 'foto ' + (index + 1)));

    const img = document.createElement('img');
    img.src = photo.thumb || photo.src;
    img.alt = photo.caption || '';
    img.loading = 'lazy';
    button.appendChild(img);

    // A legenda não é mais exibida abaixo da miniatura: ela só aparece
    // dentro do carrossel (lightbox), no elemento .lightbox-caption.

    button.addEventListener('click', () => openLightbox(index));
    li.appendChild(button);
    gallery.appendChild(li);
  });

  // Monta a estrutura do lightbox uma única vez
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <div class="lightbox-box">
      <button class="lightbox-close" type="button" aria-label="Fechar">X</button>
      <button class="lightbox-prev" type="button" aria-label="Foto anterior">&lt;</button>
      <img src="" alt="">
      <button class="lightbox-next" type="button" aria-label="Próxima foto">&gt;</button>
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector('img');
  const captionEl = overlay.querySelector('.lightbox-caption');

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    overlay.classList.add('open');
  }

  function closeLightbox() {
    overlay.classList.remove('open');
  }

  function updateLightbox() {
    const photo = photos[currentIndex];
    imgEl.src = photo.src;
    imgEl.alt = photo.caption || '';
    captionEl.textContent = photo.caption
      ? photo.caption + ' (' + (currentIndex + 1) + '/' + photos.length + ')'
      : (currentIndex + 1) + '/' + photos.length;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    updateLightbox();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % photos.length;
    updateLightbox();
  }

  overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  overlay.querySelector('.lightbox-prev').addEventListener('click', showPrev);
  overlay.querySelector('.lightbox-next').addEventListener('click', showNext);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
})();
