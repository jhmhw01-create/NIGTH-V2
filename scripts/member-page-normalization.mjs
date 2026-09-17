const memberPortraits = {
  'member-doha.html': ['assets/images/doha.webp', 'assets/images/member-doha.webp'],
  'member-woohyun.html': ['assets/images/woohyun.webp', 'assets/images/member-woohyun.webp'],
  'member-jiwoo.html': ['assets/images/jiwoo.webp', 'assets/images/member-jiwoo.webp'],
  'member-ihwan.html': ['assets/images/ihwan.webp', 'assets/images/member-ihwan.webp'],
  'member-taehun.html': ['assets/images/taehun.webp', 'assets/images/member-taehoon.webp']
};

const taehoonFamilyOld = '<dt>FAMILY</dt><dd>부모님 · 외동</dd>';
const taehoonFamilyCurrent = '<dt>FAMILY</dt><dd>부모님 · 외동 (어릴 때부터 옆집 누나와 함께 자람)</dd>';
const taehoonPersonalityOld = '<p>이 친화력은 특정 인물이나 특정한 성장 배경 때문에 만들어진 것이 아니라, 태훈이 원래부터 가지고 있는 성격이다.</p>';
const taehoonPersonalityCurrent = '<p>외동이지만 어릴 때부터 옆집 누나와 자주 어울려 자라 혼자 지내는 데 익숙한 외동 스타일은 아니며, 이런 성장 배경은 NIGHT 형들에게 자연스럽게 붙고 함께 시간을 보내는 친밀한 성향과도 이어진다.</p>';

export function normalizeMemberPage(page) {
  const portrait = memberPortraits[page?.route];
  if (!portrait || typeof page.contentHtml !== 'string') return page;

  let contentHtml = page.contentHtml.replace(`src="${portrait[0]}"`, `src="${portrait[1]}"`);

  if (page.route === 'member-taehun.html') {
    contentHtml = contentHtml
      .replace(taehoonFamilyOld, taehoonFamilyCurrent)
      .replace(taehoonPersonalityOld, taehoonPersonalityCurrent);
  }

  return {...page, contentHtml};
}

export const currentMemberPortraits = Object.fromEntries(
  Object.entries(memberPortraits).map(([route, [, current]]) => [route, current])
);
