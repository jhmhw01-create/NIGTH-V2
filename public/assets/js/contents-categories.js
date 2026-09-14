(() => {
  const panel = document.querySelector('.contents-filter-panel');
  const grid = document.getElementById('contents-grid');
  if (!panel || !grid) return;
  const buttons = [...panel.querySelectorAll('[data-content-filter]')];
  const cards = [...grid.querySelectorAll('.content-card')];
  const status = panel.querySelector('.contents-filter-status');
  const apply = category => {
    const selected = buttons.find(button => button.dataset.contentFilter === category) || buttons[0];
    category = selected.dataset.contentFilter;
    let count = 0;
    cards.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
      if (!card.hidden) count += 1;
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
    grid.classList.toggle('is-filtered', category !== 'all');
    const label = selected.childNodes[0].textContent.trim();
    status.textContent = `${label} · ${count}개 기록`;
  };
  buttons.forEach(button => button.addEventListener('click', () => apply(button.dataset.contentFilter)));
  // Existing deep links must always open with their target card visible.
  const revealAnchor = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = cards.find(card => card.id === id);
    if (target?.hidden) {
      apply('all');
      target.scrollIntoView({ block: 'center' });
    }
  };
  window.addEventListener('hashchange', revealAnchor);
  panel.hidden = false;
  apply('all');
})();
