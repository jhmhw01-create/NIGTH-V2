const fmPhotos = [...document.querySelectorAll('.fm-photo[data-full]')];
const fmLightbox = document.querySelector('#fmLightbox');

if (fmPhotos.length && fmLightbox) {
  const image = fmLightbox.querySelector('.fm-lightbox-image');
  const title = fmLightbox.querySelector('.fm-lightbox-title');
  const index = fmLightbox.querySelector('.fm-lightbox-index');
  const close = fmLightbox.querySelector('.fm-lightbox-close');
  const prev = fmLightbox.querySelector('.fm-lightbox-prev');
  const next = fmLightbox.querySelector('.fm-lightbox-next');
  let current = 0;
  let lastFocused = null;

  const render = () => {
    const item = fmPhotos[current];
    const thumb = item.querySelector('img');
    const thumbUrl = thumb ? (thumb.currentSrc || thumb.src) : '';
    const fullUrl = thumbUrl.includes('/thumbs/') ? thumbUrl.replace('/thumbs/', '/full/') : new URL(item.dataset.full, document.baseURI).href;
    image.onerror = () => { image.onerror = null; if (thumbUrl) image.src = thumbUrl; };
    image.src = fullUrl;
    image.alt = `${item.dataset.title || 'NIGHT FANMEETING'} 확대 이미지`;
    title.textContent = item.dataset.title || '';
    index.textContent = `${current + 1} / ${fmPhotos.length}`;
  };
  const open = (item) => {
    current = Math.max(0, fmPhotos.indexOf(item)); lastFocused = document.activeElement; render();
    fmLightbox.classList.add('is-open'); fmLightbox.setAttribute('aria-hidden', 'false'); document.body.classList.add('fm-lightbox-open'); close.focus();
  };
  const dismiss = () => {
    fmLightbox.classList.remove('is-open'); fmLightbox.setAttribute('aria-hidden', 'true'); document.body.classList.remove('fm-lightbox-open'); image.removeAttribute('src'); if (lastFocused) lastFocused.focus();
  };
  const move = (step) => { current = (current + step + fmPhotos.length) % fmPhotos.length; render(); };
  fmPhotos.forEach((item) => item.addEventListener('click', () => open(item)));
  close.addEventListener('click', dismiss); prev.addEventListener('click', () => move(-1)); next.addEventListener('click', () => move(1));
  fmLightbox.addEventListener('click', (event) => { if (event.target === fmLightbox) dismiss(); });
  document.addEventListener('keydown', (event) => { if (!fmLightbox.classList.contains('is-open')) return; if (event.key === 'Escape') dismiss(); if (event.key === 'ArrowLeft') move(-1); if (event.key === 'ArrowRight') move(1); });
}
