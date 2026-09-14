const travelPhotos = [...document.querySelectorAll('.travel-photo[data-full]')];
const travelLightbox = document.querySelector('#travelLightbox');

if (travelPhotos.length && travelLightbox) {
  const image = travelLightbox.querySelector('.travel-lightbox-image');
  const title = travelLightbox.querySelector('.travel-lightbox-title');
  const index = travelLightbox.querySelector('.travel-lightbox-index');
  const close = travelLightbox.querySelector('.travel-lightbox-close');
  const prev = travelLightbox.querySelector('.travel-lightbox-prev');
  const next = travelLightbox.querySelector('.travel-lightbox-next');
  let current = 0;
  let lastFocused = null;

  const render = () => {
    const item = travelPhotos[current];
    const thumb = item.querySelector('img');
    const resolvedThumb = thumb ? (thumb.currentSrc || thumb.src) : '';
    const resolvedFull = resolvedThumb.includes('/thumbs/')
      ? resolvedThumb.replace('/thumbs/', '/full/')
      : new URL(item.dataset.full, document.baseURI).href;

    image.onerror = () => {
      image.onerror = null;
      if (resolvedThumb) image.src = resolvedThumb;
    };
    image.src = resolvedFull;
    image.alt = `${item.dataset.title || 'NIGHT TRAVEL LOG'} 확대 이미지`;
    title.textContent = item.dataset.title || '';
    index.textContent = `${current + 1} / ${travelPhotos.length}`;
  };

  const open = (item) => {
    current = Math.max(0, travelPhotos.indexOf(item));
    lastFocused = document.activeElement;
    render();
    travelLightbox.classList.add('is-open');
    travelLightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('travel-lightbox-open');
    close.focus();
  };

  const dismiss = () => {
    travelLightbox.classList.remove('is-open');
    travelLightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('travel-lightbox-open');
    image.removeAttribute('src');
    if (lastFocused) lastFocused.focus();
  };

  const move = (step) => {
    current = (current + step + travelPhotos.length) % travelPhotos.length;
    render();
  };

  travelPhotos.forEach((item) => item.addEventListener('click', () => open(item)));
  close.addEventListener('click', dismiss);
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  travelLightbox.addEventListener('click', (event) => {
    if (event.target === travelLightbox) dismiss();
  });
  document.addEventListener('keydown', (event) => {
    if (!travelLightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') dismiss();
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  });
}
