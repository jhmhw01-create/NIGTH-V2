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
export const NoticeItem = record => Record('details',record);
export const MembershipCard = record => Record('article',record);
export function ContentsEntry(record) {
  return '<a class="content-card contents-text-entry" href="'+escape(record.href)+'" data-category="'+escape(record.category)+'"'+(record.anchor?' id="'+escape(record.anchor)+'"':'')+'><small class="contents-entry-label">'+escape(record.label)+'</small><h3>'+escape(record.title)+'</h3><p>'+escape(record.summary)+'</p><span class="contents-entry-action">'+escape(record.action)+'</span></a>';
}
export function renderCollections(content, collections) {
  const renderers = {albums:AlbumCard,notices:NoticeItem,memberships:MembershipCard,galleryCards:record=>Record('div',record),contentsEntries:ContentsEntry};
  const membershipSlots=[...content.matchAll(/\{\{memberships:(\d+)\}\}/g)].map(match=>Number(match[1]));
  const membershipMax=membershipSlots.length?Math.max(...membershipSlots):-1;
  const newerMemberships=membershipMax>=0?(collections.memberships||[]).slice(membershipMax+1).toReversed():[];
  return content.replace(/\{\{(albums|notices|memberships|galleryCards|contentsEntries):(\d+)\}\}/g, (_, name, indexText) => {
    const index=Number(indexText);
    if (!collections[name]?.[index]) throw Error('Unknown record: ' + name + ':' + index);
    const rendered=renderers[name](collections[name][index]);
    if(name==='memberships'&&index===0&&newerMemberships.length)return newerMemberships.map(MembershipCard).join('\n')+'\n'+rendered;
    return rendered;
  });
}
