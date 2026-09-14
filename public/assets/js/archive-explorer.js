(() => {
  const catalog = window.NightArchiveCatalog;
  if (!catalog) return;
  const grid = document.querySelector('#archive-grid');
  const filters = document.querySelector('#archive-filters');
  const query = document.querySelector('#archive-query');
  const sort = document.querySelector('#archive-sort');
  const more = document.querySelector('#archive-more');
  const status = document.querySelector('#archive-status');
  const empty = document.querySelector('#archive-empty');
  const params = new URLSearchParams(location.search);
  let category = Object.hasOwn(catalog.labels, params.get('category')) ? params.get('category') : 'all';
  let limit = 18;
  query.value = params.get('q') || '';
  sort.value = params.get('sort') === 'title' ? 'title' : 'category';
  const normalize = value => value.normalize('NFKC').toLocaleLowerCase().trim();
  const categories = Object.keys(catalog.labels);
  const make = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  for (const key of ['all', ...categories]) {
    const count = catalog.records.filter(record => key === 'all' || record.category === key).length;
    const button = make('button', (key === 'all' ? '전체' : catalog.labels[key]) + ' · ' + count);
    button.type = 'button';
    button.dataset.category = key;
    button.addEventListener('click', () => { category = key; limit = 18; render(); });
    filters.append(button);
  }
  const render = () => {
    const terms = normalize(query.value).split(/\s+/).filter(Boolean);
    const results = catalog.records.filter(record => {
      if (category !== 'all' && record.category !== category) return false;
      const text = normalize([record.title, record.summary, record.keywords, record.searchText].join(' '));
      return terms.every(term => text.includes(term));
    }).sort((a, b) => {
      if (sort.value === 'category') {
        const order = categories.indexOf(a.category) - categories.indexOf(b.category);
        if (order) return order;
      }
      return a.title.localeCompare(b.title, 'ko');
    });
    grid.replaceChildren();
    for (const record of results.slice(0, limit)) {
      const card = make('a', undefined, 'archive-result-card');
      card.href = record.href;
      const imageArea = make('div', undefined, 'archive-result-image');
      if (record.image) {
        const image = make('img');
        image.src = record.image;
        image.alt = record.title;
        image.loading = 'lazy';
        image.decoding = 'async';
        imageArea.append(image);
      } else imageArea.append(make('span', 'NIGHT', 'archive-result-placeholder'));
      const copy = make('div', undefined, 'archive-result-copy');
      copy.append(make('small', catalog.labels[record.category]), make('h2', record.title), make('p', record.summary), make('span', 'OPEN ARCHIVE →'));
      card.append(imageArea, copy);
      grid.append(card);
    }
    filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
    const visible = Math.min(limit, results.length);
    status.textContent = (category === 'all' ? '전체' : catalog.labels[category]) + ' · ' + results.length + '개 기록 · ' + visible + '개 표시';
    more.hidden = visible === results.length;
    more.textContent = '더 보기 · 남은 ' + (results.length - visible) + '개';
    empty.hidden = results.length !== 0;
    const nextParams = new URLSearchParams();
    if (category !== 'all') nextParams.set('category', category);
    if (query.value.trim()) nextParams.set('q', query.value.trim());
    if (sort.value === 'title') nextParams.set('sort', 'title');
    history.replaceState(null, '', location.pathname + (nextParams.size ? '?' + nextParams.toString() : '') + location.hash);
  };
  query.addEventListener('input', () => { limit = 18; render(); });
  sort.addEventListener('change', () => { limit = 18; render(); });
  more.addEventListener('click', () => {
    const previous = grid.children.length;
    limit += 18;
    render();
    const firstNew = grid.children[previous];
    if (firstNew) firstNew.focus();
  });
  document.querySelector('#archive-search-form').addEventListener('submit', event => event.preventDefault());
  document.querySelector('#archive-search-form').addEventListener('reset', event => {
    event.preventDefault();query.value = '';category = 'all';sort.value = 'category';limit = 18;render();
  });
  render();
})();
