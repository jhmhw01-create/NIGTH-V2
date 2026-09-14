export function archiveMarkup(page,kind='archive') {
  const viewer=/id="(?:archive26Lightbox|fmLightbox|behindLightbox|travelLightbox|sg-viewer)"/;
  if(viewer.test(page.contentHtml))return page.contentHtml;
  const suffix=page.afterFooterHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').trim();
  if(!suffix)return page.contentHtml;
  if(!viewer.test(suffix))throw Error('Unexpected '+kind+' footer markup: '+page.route);
  return page.contentHtml+suffix;
}
