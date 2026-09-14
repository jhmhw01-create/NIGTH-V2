(() => {
  const items = [...document.querySelectorAll('.fansign-photo')];
  const lightbox = document.querySelector('#fansignLightbox');
  if (!items.length || !lightbox) return;

  const image = lightbox.querySelector('.fansign-lightbox-image');
  const title = lightbox.querySelector('.fansign-lightbox-title');
  const index = lightbox.querySelector('.fansign-lightbox-index');
  const close = lightbox.querySelector('.fansign-lightbox-close');
  let current = 0;
  let lastFocused = null;

  const render = () => {
    const item = items[current];
    image.src = item.dataset.full;
    image.alt = item.querySelector('img')?.alt || '';
    title.textContent = item.dataset.title || '';
    index.textContent = `${current + 1} / ${items.length}`;
  };
  const open = (item) => {
    current = items.indexOf(item);
    lastFocused = document.activeElement;
    render();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('fansign-lightbox-open');
    close.focus();
  };
  const dismiss = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('fansign-lightbox-open');
    image.removeAttribute('src');
    lastFocused?.focus();
  };
  const move = (step) => {
    current = (current + step + items.length) % items.length;
    render();
  };

  items.forEach((item) => item.addEventListener('click', () => open(item)));
  close.addEventListener('click', dismiss);
  lightbox.querySelector('.fansign-lightbox-prev').addEventListener('click', () => move(-1));
  lightbox.querySelector('.fansign-lightbox-next').addEventListener('click', () => move(1));
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) dismiss(); });
  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') dismiss();
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  });
})();
