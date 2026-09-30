const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function Record(tag, record) {
  if (!record || typeof record.title !== 'string' || typeof record.bodyTemplateHtml !== 'string') throw Error('Invalid collection record');
  // HTML fields are trusted, authored website content, not public user input.
  return '<' + tag + record.attributesHtml + '>' + record.bodyTemplateHtml.replaceAll('{{title}}',escape(record.title)) + '</' + tag + '>';
}
export const AlbumCard = record => {
  const normalized=record?.id==='phantom'?{...record,bodyTemplateHtml:record.bodyTemplateHtml.replace(/href="assets\/images\/phantom-package-preview-0908\.webp"[^>]*aria-label="PHANTOM FULL PACKAGE PREVIEW 크게 보기"/,'href="phantom-2026.html" aria-label="PHANTOM 공식 아카이브 열기"')}:record;
  return Record('article',normalized);
};
export const NoticeItem = record => Record('details',/\bid=/.test(record.attributesHtml)?record:{...record,attributesHtml:' id="'+escape(record.id)+'"'+record.attributesHtml});
export const MembershipCard = record => Record('article',record);
export function ContentsEntry(record) {
  const external=/^https?:\/\//.test(record.href);
  return '<a class="content-card contents-text-entry" href="'+escape(record.href)+'"'+(external?' target="_blank" rel="noopener noreferrer"':'')+' data-category="'+escape(record.category)+'"'+(record.anchor?' id="'+escape(record.anchor)+'"':'')+'><small class="contents-entry-label">'+escape(record.label)+'</small><h3>'+escape(record.title)+'</h3><p>'+escape(record.summary)+'</p><span class="contents-entry-action">'+escape(record.action)+'</span></a>';
}
export function NoticeArchive(records) {
  const ids=new Set();
  for(const record of records){
    if(!record?.id||ids.has(record.id))throw Error('Invalid or duplicate notice id: '+record?.id);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(record.date)||record.year!==Number(record.date.slice(0,4)))throw Error('Invalid notice date: '+record.id);
    ids.add(record.id);
  }
  const sorted=[...records].sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
  const years=[...new Set(sorted.map(record=>record.year))].sort((a,b)=>b-a);
  return years.map(year=>'<section class="notice-year-group" aria-labelledby="notice-year-'+year+'"><h2 class="notice-year-title" id="notice-year-'+year+'">'+year+'</h2><div class="notice-list">\n'+sorted.filter(record=>record.year===year).map(NoticeItem).join('\n')+'\n</div></section>').join('\n');
}
export function renderCollections(content, collections) {
  const contentsSlots=[...content.matchAll(/\{\{contentsEntries:(\d+)\}\}/g)].map(match=>Number(match[1]));
  const contentsRecords=contentsSlots.map(index=>collections.contentsEntries?.[index]);
  if(contentsRecords.some(record=>!record))throw Error('Unknown contents record');
  const renderers = {albums:AlbumCard,notices:NoticeItem,memberships:MembershipCard,galleryCards:record=>Record('div',record),contentsEntries:ContentsEntry};
  const membershipSlots=[...content.matchAll(/\{\{memberships:(\d+)\}\}/g)].map(match=>Number(match[1]));
  const membershipMax=membershipSlots.length?Math.max(...membershipSlots):-1;
  const newerMemberships=membershipMax>=0?(collections.memberships||[]).slice(membershipMax+1).toReversed():[];
  const expanded=content
    .replace(/\{\{contentsCount:([a-z]+)\}\}/g,(_,category)=>String(contentsRecords.filter(record=>category==='all'||record.category===category).length))
    .replaceAll('{{noticeCount}}',String(collections.notices?.length||0))
    .replaceAll('{{noticesByDate}}',NoticeArchive(collections.notices||[]));
  return expanded.replace(/\{\{(albums|notices|memberships|galleryCards|contentsEntries):(\d+)\}\}/g, (_, name, indexText) => {
    const index=Number(indexText);
    if (!collections[name]?.[index]) throw Error('Unknown record: ' + name + ':' + index);
    const rendered=renderers[name](collections[name][index]);
    if(name==='memberships'&&index===0&&newerMemberships.length)return newerMemberships.map(MembershipCard).join('\n')+'\n'+rendered;
    return rendered;
  });
}
