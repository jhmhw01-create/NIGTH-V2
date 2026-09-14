export const navigation = [
  ['HOME', 'index.html'], ['MEMBERS', 'index.html#members'],
  ['DISCOGRAPHY', 'discography.html'], ['HISTORY', 'history.html'],
  ['LISTEN', 'listen.html'], ['GALLERY', 'gallery.html'],
  ['CONTENTS', 'contents.html'], ['ARCHIVE', 'archive.html'],
  ['NOTICE', 'notice.html'], ['FANCLUB', 'fanclub.html']
];
const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
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
  return '<!DOCTYPE html>\n<html ' + page.htmlAttributes + '>\n<head>' + page.headHtml + '</head>\n<body ' + page.bodyAttributes + '>' + page.beforeHeaderHtml + Header(page) + page.contentHtml + Footer() + page.afterFooterHtml + '</body>\n</html>\n';
}
