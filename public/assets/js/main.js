const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Current NIGHT line-up normalization.
// Legacy page routes remain unchanged for backward compatibility.
const currentMemberOrder = [
  'member-doha.html',
  'member-woohyun.html',
  'member-jiwoo.html',
  'member-ihwan.html',
  'member-taehun.html'
];

const homeMemberImages = {
  'member-doha.html': 'assets/images/home-profile-doha.webp',
  'member-woohyun.html': 'assets/images/home-profile-woohyun.webp',
  'member-jiwoo.html': 'assets/images/home-profile-jiwoo.webp',
  'member-ihwan.html': 'assets/images/home-profile-ihwan.webp',
  'member-taehun.html': 'assets/images/home-profile-taehoon.webp'
};

const memberGrid = document.querySelector('#members .member-grid');
if (memberGrid) {
  const cards = [...memberGrid.querySelectorAll('.member-card')];
  const byHref = new Map(cards.map(card => [card.getAttribute('href'), card]));

  currentMemberOrder.forEach((href) => {
    const card = byHref.get(href);
    if (!card) return;

    const image = card.querySelector('img');
    if (image && homeMemberImages[href]) image.src = homeMemberImages[href];
    memberGrid.appendChild(card);
  });
}

// Keep HOME hero and About imagery independent.
const homeHero = document.querySelector('.hero > .hero-image');
if (homeHero) homeHero.src = 'assets/images/home-hero-night.webp';

// TAEHOON current profile note: only-child family record + childhood context.
if (document.querySelector('.member-title')?.textContent.trim() === '유태훈') {
  const profileRows = [...document.querySelectorAll('.profile-lines dt')];
  const familyLabel = profileRows.find(dt => dt.textContent.trim() === 'FAMILY');
  if (familyLabel?.nextElementSibling) {
    familyLabel.nextElementSibling.textContent = '부모님 · 외동 (어릴 때부터 옆집 누나와 함께 자람)';
  }

  const personalitySection = [...document.querySelectorAll('.member-about-section')]
    .find(section => section.querySelector('.section-label')?.textContent.trim() === 'PERSONALITY');
  const personalityArticle = personalitySection?.querySelector('.member-intro');
  if (personalityArticle && !personalityArticle.querySelector('[data-current-profile-note]')) {
    const note = document.createElement('p');
    note.dataset.currentProfileNote = 'taehoon-childhood';
    note.textContent = '외동이지만 어릴 때부터 옆집 누나와 자주 어울려 자라 혼자 지내는 데 익숙한 외동 스타일은 아니며, 이런 성장 배경은 NIGHT 형들에게 자연스럽게 붙고 함께 시간을 보내는 친밀한 성향과도 이어진다.';
    personalityArticle.appendChild(note);
  }
}

// Gallery v03
const galleryItems = [...document.querySelectorAll('.gallery-item')];
const galleryFilters = [...document.querySelectorAll('.gallery-filter')];
const galleryCount = document.querySelector('.gallery-count');
const lightbox = document.querySelector('#galleryLightbox');

if (galleryItems.length && galleryFilters.length) {
  let currentFilter = 'all';
  let visibleItems = [...galleryItems];
  let currentIndex = 0;

  const updateFilter = (filter) => {
    currentFilter = filter;
    galleryFilters.forEach(btn => btn.classList.toggle('is-active', btn.dataset.filter === filter));
    galleryItems.forEach(item => {
      const categories = (item.dataset.category || '').split(/\s+/);
      const show = filter === 'all' || categories.includes(filter);
      item.hidden = !show;
    });
    visibleItems = galleryItems.filter(item => !item.hidden);
    if (galleryCount) galleryCount.textContent = `${visibleItems.length} PHOTOS`;
  };

  galleryFilters.forEach(btn => btn.addEventListener('click', () => updateFilter(btn.dataset.filter)));

  if (lightbox) {
    const image = lightbox.querySelector('.lightbox-image');
    const title = lightbox.querySelector('.lightbox-title');
    const index = lightbox.querySelector('.lightbox-index');
    const close = lightbox.querySelector('.lightbox-close');
    const prev = lightbox.querySelector('.lightbox-prev');
    const next = lightbox.querySelector('.lightbox-next');
    let lastFocused = null;

    const renderLightbox = () => {
      const item = visibleItems[currentIndex];
      if (!item) return;

      // Use the already-resolved thumbnail URL as the base for the full image.
      // This works both on local/GitHub Pages and in file-preview environments
      // that do not rewrite relative URLs stored only in data-* attributes.
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
      image.alt = item.getAttribute('aria-label') || 'NIGHT 갤러리 확대 이미지';
      title.textContent = item.dataset.title || '';
      index.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
    };

    const openLightbox = (item) => {
      visibleItems = galleryItems.filter(el => !el.hidden);
      currentIndex = Math.max(0, visibleItems.indexOf(item));
      lastFocused = document.activeElement;
      renderLightbox();
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      close.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      image.removeAttribute('src');
      if (lastFocused) lastFocused.focus();
    };

    const move = (step) => {
      currentIndex = (currentIndex + step + visibleItems.length) % visibleItems.length;
      renderLightbox();
    };

    galleryItems.filter(item => item.dataset.full).forEach(item => item.addEventListener('click', () => openLightbox(item)));
    close.addEventListener('click', closeLightbox);
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    });
  }
}
