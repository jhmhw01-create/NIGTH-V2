const memberPortraits = {
  'member-doha.html': ['assets/images/doha.webp', 'assets/images/member-doha.webp'],
  'member-woohyun.html': ['assets/images/woohyun.webp', 'assets/images/member-woohyun.webp'],
  'member-jiwoo.html': ['assets/images/jiwoo.webp', 'assets/images/member-jiwoo.webp'],
  'member-ihwan.html': ['assets/images/ihwan.webp', 'assets/images/member-ihwan.webp']
};

export function normalizeMemberPage(page) {
  const portrait = memberPortraits[page?.route];
  if (!portrait || typeof page.contentHtml !== 'string') return page;

  const contentHtml = page.contentHtml.replace(`src="${portrait[0]}"`, `src="${portrait[1]}"`);
  return {...page, contentHtml};
}

export const currentMemberPortraits = Object.fromEntries(
  Object.entries(memberPortraits).map(([route, [, current]]) => [route, current])
);
