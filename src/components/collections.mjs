const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function Record(tag, record) {
  if (!record || typeof record.title !== 'string' || typeof record.bodyTemplateHtml !== 'string') throw Error('Invalid collection record');
  // HTML fields are trusted, authored website content, not public user input.
  return '<' + tag + record.attributesHtml + '>' + record.bodyTemplateHtml.replaceAll('{{title}}',escape(record.title)) + '</' + tag + '>';
}
export const AlbumCard = record => Record('article',record);
export const NoticeItem = record => Record('details',record);
export const MembershipCard = record => Record('article',record);
export function ContentsEntry(record) {
  return '<a class="content-card contents-text-entry" href="'+escape(record.href)+'" data-category="'+escape(record.category)+'"'+(record.anchor?' id="'+escape(record.anchor)+'"':'')+'><small class="contents-entry-label">'+escape(record.label)+'</small><h3>'+escape(record.title)+'</h3><p>'+escape(record.summary)+'</p><span class="contents-entry-action">'+escape(record.action)+'</span></a>';
}
export function renderCollections(content, collections) {
  const renderers = {albums:AlbumCard,notices:NoticeItem,memberships:MembershipCard,galleryCards:record=>Record('div',record),contentsEntries:ContentsEntry};
  return content.replace(/\{\{(albums|notices|memberships|galleryCards|contentsEntries):(\d+)\}\}/g, (_, name, index) => {
    if (!collections[name]?.[index]) throw Error('Unknown record: ' + name + ':' + index);
    return renderers[name](collections[name][index]);
  });
}
