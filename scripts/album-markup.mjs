// Some original album pages put their image dialog after the footer.
// Bring only that authored markup into React, never the legacy event scripts.
export function albumMarkup(page) {
  if(page.contentHtml.includes('id="archive26Lightbox"'))return page.contentHtml;
  const suffix=page.afterFooterHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').trim();
  if(!suffix)return page.contentHtml;
  if(!suffix.includes('id="archive26Lightbox"'))throw Error('Unexpected album footer markup: '+page.route);
  return page.contentHtml+suffix;
}
