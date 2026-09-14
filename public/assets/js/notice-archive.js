(() => {
  const section = document.querySelector('.notice-section');
  if (!section) return;
  const buttons = [...section.querySelectorAll('[data-notice-filter]')];
  const yearSelect = section.querySelector('#notice-year-filter');
  const groups = [...section.querySelectorAll('.notice-year-group')];
  const status = section.querySelector('.notice-results');
  const empty = section.querySelector('.notice-empty');
  let category = 'all';
  const update = () => {
    let total = 0;
    for (const group of groups) {
      let count = 0;
      for (const item of group.querySelectorAll('.notice-item')) {
        const year = item.querySelector('time').textContent.slice(0, 4);
        const visible = (category === 'all' || item.dataset.noticeCategory === category) && (yearSelect.value === 'all' || yearSelect.value === year);
        item.hidden = !visible;
        if (visible) count++;
      }
      group.hidden = count === 0;
      total += count;
    }
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.noticeFilter === category)));
    status.textContent = `${buttons.find(button => button.dataset.noticeFilter === category).textContent} · ${yearSelect.value === 'all' ? '전체 연도' : yearSelect.value} · 공지 ${total}건`;
    empty.hidden = total !== 0;
  };
  buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.noticeFilter; update(); }));
  yearSelect.addEventListener('change', update);
  update();
})();
