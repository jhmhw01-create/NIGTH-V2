(() => {
  const items = [...document.querySelectorAll('.sg-photo')];
  const dialog = document.getElementById('sg-viewer');
  if (!dialog || !items.length) return;
  const image = dialog.querySelector('.sg-full');
  let current = 0;
  let opener;
  const render = () => {
    const item = items[current];
    image.src = item.dataset.full;
    image.alt = item.dataset.caption;
    dialog.querySelector('.sg-caption span').textContent = item.dataset.caption;
    dialog.querySelector('.sg-caption small').textContent = `${current + 1} / ${items.length}`;
  };
  const move = step => { current = (current + step + items.length) % items.length; render(); };
  items.forEach((item, i) => item.addEventListener('click', () => {
    current = i; opener = item; render(); dialog.showModal(); document.body.classList.add('sg-lock');
  }));
  dialog.querySelector('.sg-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.sg-prev').addEventListener('click', () => move(-1));
  dialog.querySelector('.sg-next').addEventListener('click', () => move(1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.classList.remove('sg-lock'); image.removeAttribute('src'); opener?.focus(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  });
})();
