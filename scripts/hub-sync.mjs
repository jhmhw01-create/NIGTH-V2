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
    const original=page.contentHtml;
    page.contentHtml=page.contentHtml.replace(
      '<section class="section-tight member-switch-section">',
      '<section class="section-tight" aria-labelledby="jiwoo-personal-schedule"><div class="container"><article class="doha-personal-card reveal"><div><div class="member-meta">PERSONAL SCHEDULE</div><h2 id="jiwoo-personal-schedule">ACTING</h2><p>DRAMA · FILM</p></div><a class="btn secondary" href="jiwoo-acting.html">VIEW FILMOGRAPHY →</a></article></div></section>\n<section class="section-tight member-switch-section">'
    );
    if(page.contentHtml===original||!page.contentHtml.includes('jiwoo-personal-schedule'))throw Error('Unable to place JIWOO acting archive after the keyword section');
  }
  if (page.route==='member-ihwan.html'&&!page.contentHtml.includes('ihwan-musical.html')) {
    page.headHtml+=hubStyle;
    const original=page.contentHtml;
    page.contentHtml=page.contentHtml.replace(
      '<section class="section-tight member-switch-section">',
      '<section class="section-tight" aria-labelledby="ihwan-personal-schedule"><div class="container"><article class="doha-personal-card reveal"><div><div class="member-meta">PERSONAL SCHEDULE</div><h2 id="ihwan-personal-schedule">MUSICAL</h2><p>STAGE · PHOTO</p></div><a class="btn secondary" href="ihwan-musical.html">VIEW ARCHIVE →</a></article></div></section>\n<section class="section-tight member-switch-section">'
    );
    if(page.contentHtml===original||!page.contentHtml.includes('ihwan-personal-schedule'))throw Error('Unable to place IHWAN musical archive after the keyword section');
  }
  if (page.route==='member-woohyun.html'&&!page.contentHtml.includes('woohyun-night-off.html')) {
    page.headHtml+=hubStyle;
    const original=page.contentHtml;
    page.contentHtml=page.contentHtml.replace(
      '<section class="section-tight member-switch-section">',
      '<section class="section-tight" aria-labelledby="woohyun-personal-schedule"><div class="container"><article class="doha-personal-card reveal"><div><div class="member-meta">PERSONAL SCHEDULE</div><h2 id="woohyun-personal-schedule">RADIO</h2><p>WOOHYUN\'S NIGHT OFF</p></div><a class="btn secondary" href="woohyun-night-off.html">VIEW NIGHT OFF →</a></article></div></section>\n<section class="section-tight member-switch-section">'
    );
    if(page.contentHtml===original||!page.contentHtml.includes('woohyun-personal-schedule'))throw Error('Unable to place WOOHYUN radio archive after the keyword section');
  }
  if (page.route==='member-taehoon.html'&&!page.contentHtml.includes('taehoon-camera-on-off.html')) {
    page.headHtml+=hubStyle;
    const original=page.contentHtml;
    page.contentHtml=page.contentHtml.replace(
      '<section class="section-tight member-switch-section">',
      '<section class="section-tight" aria-labelledby="taehoon-personal-schedule"><div class="container"><article class="doha-personal-card reveal"><div><div class="member-meta">PERSONAL SCHEDULE</div><h2 id="taehoon-personal-schedule">태훈의 카메라 <span>ON-OFF</span></h2><p>EPISODE · 01—06</p></div><a class="btn secondary" href="taehoon-camera-on-off.html">VIEW ARCHIVE →</a></article></div></section>\n<section class="section-tight member-switch-section">'
    );
    if(page.contentHtml===original)throw Error('Unable to place TAEHOON personal schedule after the keyword section');
  }
  if (page.route==='fanmeeting.html'&&!page.contentHtml.includes('night-in-the-house-2030.html')) {
    page.headHtml+=hubStyle;
    page.contentHtml=page.contentHtml.replace(
      '\n</main>',
      '\n<section class="section" aria-labelledby="night-in-the-house-entry"><div class="container"><article class="fm-archive-entry reveal"><time datetime="2030-07-06">2030.07.06</time><div><small>FANMEETING</small><h2 id="night-in-the-house-entry">NIGHT IN THE HOUSE</h2></div><a class="btn secondary" href="night-in-the-house-2030.html">ENTER THE HOUSE →</a></article></div></section>\n</main>'
    );
  }
  return page;
}
