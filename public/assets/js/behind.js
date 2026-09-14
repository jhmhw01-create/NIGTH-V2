const behindPhotos = [...document.querySelectorAll('.behind-photo[data-full]')];
const behindLightbox = document.querySelector('#behindLightbox');

if (behindPhotos.length && behindLightbox) {
  const image = behindLightbox.querySelector('.behind-lightbox-image');
  const title = behindLightbox.querySelector('.behind-lightbox-title');
  const index = behindLightbox.querySelector('.behind-lightbox-index');
  const close = behindLightbox.querySelector('.behind-lightbox-close');
  const prev = behindLightbox.querySelector('.behind-lightbox-prev');
  const next = behindLightbox.querySelector('.behind-lightbox-next');
  let current = 0;
  let lastFocused = null;

  const render = () => {
    const item = behindPhotos[current];
    const thumb = item.querySelector('img');
    const thumbUrl = thumb ? (thumb.currentSrc || thumb.src) : '';
    const fullUrl = thumbUrl.includes('/thumbs/')
      ? thumbUrl.replace('/thumbs/', '/full/')
      : new URL(item.dataset.full, document.baseURI).href;
    image.onerror = () => { image.onerror = null; if (thumbUrl) image.src = thumbUrl; };
    image.src = fullUrl;
    image.alt = `${item.dataset.title || 'NIGHT BEHIND LOG'} 확대 이미지`;
    title.textContent = item.dataset.title || '';
    index.textContent = `${current + 1} / ${behindPhotos.length}`;
  };

  const open = (item) => {
    current = Math.max(0, behindPhotos.indexOf(item));
    lastFocused = document.activeElement;
    render();
    behindLightbox.classList.add('is-open');
    behindLightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('behind-lightbox-open');
    close.focus();
  };

  const dismiss = () => {
    behindLightbox.classList.remove('is-open');
    behindLightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('behind-lightbox-open');
    image.removeAttribute('src');
    if (lastFocused) lastFocused.focus();
  };

  const move = (step) => { current = (current + step + behindPhotos.length) % behindPhotos.length; render(); };
  behindPhotos.forEach((item) => item.addEventListener('click', () => open(item)));
  close.addEventListener('click', dismiss);
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  behindLightbox.addEventListener('click', (event) => { if (event.target === behindLightbox) dismiss(); });
  document.addEventListener('keydown', (event) => {
    if (!behindLightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') dismiss();
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  });
}
