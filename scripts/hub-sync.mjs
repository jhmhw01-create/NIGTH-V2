const hubStyle='<link rel="stylesheet" href="assets/css/hub-sync.css">';

export function syncHubPage(page) {
  if (page.route==='member-doha.html'&&!page.contentHtml.includes('doha-play-on.html')) {
    page.headHtml+=hubStyle;
    page.contentHtml=page.contentHtml.replace(
      '<section class="section-tight member-switch-section">',
      '<section class="section-tight" aria-labelledby="doha-personal-schedule"><div class="container"><article class="doha-personal-card reveal"><div><div class="member-meta">PERSONAL SCHEDULE</div><h2 id="doha-personal-schedule">PLAY ON</h2><p>VARIETY · SPORTS</p></div><a class="btn secondary" href="doha-play-on.html">VIEW PLAY ON →</a></article></div></section>\n<section class="section-tight member-switch-section">'
    );
  }
  if (page.route==='member-jiwoo.html'&&!page.contentHtml.includes('jiwoo-acting.html')) {
    page.headHtml+=hubStyle;
    page.contentHtml=page.contentHtml.replace(
      '<section class="section-tight member-switch-section">',
      '<section class="section-tight" aria-labelledby="jiwoo-personal-schedule"><div class="container"><article class="doha-personal-card reveal"><div><div class="member-meta">PERSONAL SCHEDULE</div><h2 id="jiwoo-personal-schedule">ACTING</h2><p>DRAMA · FILM</p></div><a class="btn secondary" href="jiwoo-acting.html">VIEW FILMOGRAPHY →</a></article></div></section>\n<section class="section-tight member-switch-section">'
    );
  }
  if (page.route==='fanmeeting.html'&&!page.contentHtml.includes('night-in-the-house-2030.html')) {
    page.headHtml+=hubStyle;
    page.contentHtml=page.contentHtml.replace(
      '\n</main>',
      '\n<section class="section" aria-labelledby="night-in-the-house-entry"><div class="container"><article class="fm-archive-entry reveal"><time datetime="2030-07-06">2030.07.06</time><div><small>FANMEETING</small><h2 id="night-in-the-house-entry">NIGHT IN THE HOUSE</h2></div><a class="btn secondary" href="night-in-the-house-2030.html">ENTER THE HOUSE →</a></article></div></section>\n</main>'
    );
  }
  if (page.route==='contents.html'&&!page.contentHtml.includes('{{contentsEntries:35}}')) {
    page.contentHtml=page.contentHtml
      .replace('전체 <span>35</span>','전체 <span>36</span>')
      .replace('일상·자체 콘텐츠 <span>7</span>','일상·자체 콘텐츠 <span>8</span>')
      .replace('전체 · 35개 기록','전체 · 36개 기록')
      .replace('{{contentsEntries:6}}\n','{{contentsEntries:6}}\n{{contentsEntries:35}}\n');
  }
  if (page.route==='notice.html'&&!page.contentHtml.includes('{{notices:32}}')) {
    page.contentHtml=page.contentHtml
      .replace('전체 공지 32건','전체 공지 34건')
      .replace('{{notices:30}}\n','{{notices:33}}\n{{notices:32}}\n{{notices:30}}\n');
  }
  return page;
}
