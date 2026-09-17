export const navigation = [
  ['HOME', 'index.html'], ['MEMBERS', 'index.html#members'],
  ['DISCOGRAPHY', 'discography.html'], ['HISTORY', 'history.html'],
  ['LISTEN', 'listen.html'], ['GALLERY', 'gallery.html'],
  ['CONTENTS', 'contents.html'], ['ARCHIVE', 'archive.html'],
  ['NOTICE', 'notice.html'], ['FANCLUB', 'fanclub.html']
];
const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const siteUrl = 'https://jhmhw01-create.github.io/NIGTH-V2/';
const defaultDescription = 'NIGHT 공식 홈페이지. 그룹과 멤버, 음악, 공연, LUNA 및 공식 아카이브 정보를 확인하세요.';
const defaultImage = siteUrl + 'assets/images/home-hero-night.webp';
const favicon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23080812'/%3E%3Ctext x='32' y='44' text-anchor='middle' font-family='Georgia,serif' font-size='42' fill='%23eeeae2'%3EN%3C/text%3E%3C/svg%3E";
const metaTag = (head, key, attribute = 'name') => {
  const attributeName = String(attribute).toLowerCase();
  const target = String(key).toLowerCase();
  return (head.match(/<meta\b[^>]*>/gi) || []).find(item => {
    const normalized = item.toLowerCase();
    return normalized.includes(attributeName + '="' + target + '"') || normalized.includes(attributeName + "='" + target + "'");
  });
};
const metaContent = (head, key, attribute = 'name') => metaTag(head, key, attribute)?.match(/\bcontent=["']([^"']*)["']/i)?.[1] || '';
const hasMeta = (head, key, attribute = 'name') => Boolean(metaTag(head, key, attribute));
export function enhanceHead(page) {
  const head = page.headHtml || '';
  const route = page.route === 'index.html' ? '' : page.route;
  const canonical = new URL(route, siteUrl).href;
  const title = (head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || 'NIGHT — Official Website').replace(/<[^>]*>/g, '').trim();
  const description = metaContent(head, 'description') || defaultDescription;
  const tags = [];
  if (!metaContent(head, 'description')) tags.push('<meta name="description" content="' + escape(defaultDescription) + '"/>');
  if (!/<link\b[^>]*rel=["'][^"']*\bcanonical\b[^"']*["']/i.test(head)) tags.push('<link rel="canonical" href="' + escape(canonical) + '"/>');
  if (!hasMeta(head, 'og:type', 'property')) tags.push('<meta property="og:type" content="website"/>');
  if (!hasMeta(head, 'og:locale', 'property')) tags.push('<meta property="og:locale" content="ko_KR"/>');
  if (!hasMeta(head, 'og:site_name', 'property')) tags.push('<meta property="og:site_name" content="NIGHT"/>');
  if (!hasMeta(head, 'og:title', 'property')) tags.push('<meta property="og:title" content="' + escape(title) + '"/>');
  if (!hasMeta(head, 'og:description', 'property')) tags.push('<meta property="og:description" content="' + escape(description) + '"/>');
  if (!hasMeta(head, 'og:url', 'property')) tags.push('<meta property="og:url" content="' + escape(canonical) + '"/>');
  if (!hasMeta(head, 'og:image', 'property')) tags.push('<meta property="og:image" content="' + escape(defaultImage) + '"/>');
  if (!hasMeta(head, 'og:image:type', 'property')) tags.push('<meta property="og:image:type" content="image/webp"/>');
  if (!hasMeta(head, 'og:image:width', 'property')) tags.push('<meta property="og:image:width" content="1672"/>');
  if (!hasMeta(head, 'og:image:height', 'property')) tags.push('<meta property="og:image:height" content="941"/>');
  if (!hasMeta(head, 'og:image:alt', 'property')) tags.push('<meta property="og:image:alt" content="NIGHT 공식 단체 이미지"/>');
  if (!hasMeta(head, 'twitter:card')) tags.push('<meta name="twitter:card" content="summary_large_image"/>');
  if (!hasMeta(head, 'twitter:title')) tags.push('<meta name="twitter:title" content="' + escape(title) + '"/>');
  if (!hasMeta(head, 'twitter:description')) tags.push('<meta name="twitter:description" content="' + escape(description) + '"/>');
  if (!hasMeta(head, 'twitter:image')) tags.push('<meta name="twitter:image" content="' + escape(defaultImage) + '"/>');
  if (!hasMeta(head, 'theme-color')) tags.push('<meta name="theme-color" content="#080812"/>');
  if (!hasMeta(head, 'color-scheme')) tags.push('<meta name="color-scheme" content="dark"/>');
  if (!/<link\b[^>]*rel=["'][^"']*\bicon\b[^"']*["']/i.test(head)) tags.push('<link rel="icon" href="' + favicon + '"/>');
  if (!tags.length) return head;
  const block = '\n' + tags.join('\n') + '\n';
  const stylesheet = head.search(/<link\b[^>]*rel=["']stylesheet["']/i);
  return stylesheet >= 0 ? head.slice(0, stylesheet) + block + head.slice(stylesheet) : head + block;
}

export function Header');
const metaContent = (head, key, attribute = 'name') => {
  const pattern = new RegExp('\\b' + attribute + '=["\\']' + escapePattern(key) + '["\\']', 'i');
  const tag = (head.match(/<meta\b[^>]*>/gi) || []).find(item => pattern.test(item));
  return tag?.match(/\bcontent=["']([^"']*)["']/i)?.[1] || '';
};
const hasMeta = (head, key, attribute = 'name') => {
  const pattern = new RegExp('\\b' + attribute + '=["\\']' + escapePattern(key) + '["\\']', 'i');
  return (head.match(/<meta\b[^>]*>/gi) || []).some(item => pattern.test(item));
};
export function enhanceHead(page) {
  const head = page.headHtml || '';
  const route = page.route === 'index.html' ? '' : page.route;
  const canonical = new URL(route, siteUrl).href;
  const title = (head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || 'NIGHT — Official Website').replace(/<[^>]*>/g, '').trim();
  const description = metaContent(head, 'description') || defaultDescription;
  const tags = [];
  if (!metaContent(head, 'description')) tags.push('<meta name="description" content="' + escape(defaultDescription) + '"/>');
  if (!/<link\b[^>]*rel=["'][^"']*\bcanonical\b[^"']*["']/i.test(head)) tags.push('<link rel="canonical" href="' + escape(canonical) + '"/>');
  if (!hasMeta(head, 'og:type', 'property')) tags.push('<meta property="og:type" content="website"/>');
  if (!hasMeta(head, 'og:locale', 'property')) tags.push('<meta property="og:locale" content="ko_KR"/>');
  if (!hasMeta(head, 'og:site_name', 'property')) tags.push('<meta property="og:site_name" content="NIGHT"/>');
  if (!hasMeta(head, 'og:title', 'property')) tags.push('<meta property="og:title" content="' + escape(title) + '"/>');
  if (!hasMeta(head, 'og:description', 'property')) tags.push('<meta property="og:description" content="' + escape(description) + '"/>');
  if (!hasMeta(head, 'og:url', 'property')) tags.push('<meta property="og:url" content="' + escape(canonical) + '"/>');
  if (!hasMeta(head, 'og:image', 'property')) tags.push('<meta property="og:image" content="' + escape(defaultImage) + '"/>');
  if (!hasMeta(head, 'og:image:type', 'property')) tags.push('<meta property="og:image:type" content="image/webp"/>');
  if (!hasMeta(head, 'og:image:width', 'property')) tags.push('<meta property="og:image:width" content="1672"/>');
  if (!hasMeta(head, 'og:image:height', 'property')) tags.push('<meta property="og:image:height" content="941"/>');
  if (!hasMeta(head, 'og:image:alt', 'property')) tags.push('<meta property="og:image:alt" content="NIGHT 공식 단체 이미지"/>');
  if (!hasMeta(head, 'twitter:card')) tags.push('<meta name="twitter:card" content="summary_large_image"/>');
  if (!hasMeta(head, 'twitter:title')) tags.push('<meta name="twitter:title" content="' + escape(title) + '"/>');
  if (!hasMeta(head, 'twitter:description')) tags.push('<meta name="twitter:description" content="' + escape(description) + '"/>');
  if (!hasMeta(head, 'twitter:image')) tags.push('<meta name="twitter:image" content="' + escape(defaultImage) + '"/>');
  if (!hasMeta(head, 'theme-color')) tags.push('<meta name="theme-color" content="#080812"/>');
  if (!hasMeta(head, 'color-scheme')) tags.push('<meta name="color-scheme" content="dark"/>');
  if (!/<link\b[^>]*rel=["'][^"']*\bicon\b[^"']*["']/i.test(head)) tags.push('<link rel="icon" href="' + favicon + '"/>');
  if (!tags.length) return head;
  const block = '\n' + tags.join('\n') + '\n';
  const stylesheet = head.search(/<link\b[^>]*rel=["']stylesheet["']/i);
  return stylesheet >= 0 ? head.slice(0, stylesheet) + block + head.slice(stylesheet) : head + block;
}

export function Header({route, activeNav}) {
  const links = navigation.map(([title, href]) => {
    const active = activeNav === title || (!activeNav && route === href);
    return '<a href="' + escape(href) + '"' + (active ? ' aria-current="page"' : '') + '>' + title + '</a>';
  }).join('\n');
  return '<header class="site-header"><nav class="nav container"><a class="brand" href="index.html">N<span>I</span>GHT</a><button class="menu-toggle" aria-label="메뉴 열기" type="button">☰</button><div class="nav-links">' + links + '</div></nav></header>';
}
export function Footer() {
  return '<footer class="site-footer"><div class="footer-inner container"><span>© CASTLE ENTERTAINMENT. ALL RIGHTS RESERVED.</span><a href="index.html">BACK TO HOME</a></div></footer>';
}
export function PageLayout(page) {
  return '<!DOCTYPE html>\n<html ' + page.htmlAttributes + '>\n<head>' + enhanceHead(page) + '</head>\n<body ' + page.bodyAttributes + '>' + page.beforeHeaderHtml + Header(page) + page.contentHtml + Footer() + page.afterFooterHtml + '</body>\n</html>\n';
}
