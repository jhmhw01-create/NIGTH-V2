(() => {
  const container = document.querySelector('#gallery-collections');
  if (!container) return;
  const buttons = [...container.querySelectorAll('[data-collection-filter]')];
  const groups = [...container.querySelectorAll('[data-collection-group]')];
  const status = container.querySelector('.gallery-collection-status');
  buttons.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.collectionFilter;
    let count = 0;
    groups.forEach(group => {
      group.hidden = category !== 'all' && category !== group.dataset.collectionGroup;
      if (!group.hidden) count += group.querySelectorAll('.gallery-archive-entry').length;
    });
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    status.textContent = button.textContent.split(' · ').slice(0,-1).join(' · ') + ' · ' + count + '개 아카이브';
  }));
})();
