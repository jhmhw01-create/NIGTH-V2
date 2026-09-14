(() => {
  const dialog = document.getElementById('fv-viewer');
  if (!dialog) return;
  let opener;
  document.querySelectorAll('.fv-photo').forEach(button => button.addEventListener('click', () => {
    opener = button;
    const image = dialog.querySelector('.fv-full');
    image.src = button.dataset.full;
    image.alt = button.dataset.caption;
    dialog.querySelector('.fv-caption').textContent = button.dataset.caption;
    dialog.showModal();
    document.body.classList.add('fv-lock');
  }));
  dialog.querySelector('.fv-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('fv-lock');
    dialog.querySelector('.fv-full').removeAttribute('src');
    opener?.focus();
  });
})();
