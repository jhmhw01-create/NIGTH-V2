import {readFile,writeFile} from 'node:fs/promises';

const mustReplace=(text,from,to,label)=>{
  if(!text.includes(from)) throw new Error(`Missing source text: ${label}`);
  return text.replace(from,to);
};

{
  const path='src/react/HomePage.jsx';
  let text=await readFile(path,'utf8');
  const edits=[
    ['다크 섹시를 기반으로 한 강렬한 퍼포먼스와 도시적인 비주얼로 시작해, 음악과 콘셉트의 경계를 넓혀온 5인조 아이돌 그룹.','강렬한 퍼포먼스와 도시적인 비주얼로 데뷔해, 앨범마다 새로운 음악과 무대를 선보여온 5인조 아이돌 그룹.','home hero'],
    ['이후 하나의 이미지에 머무르지 않고 음악과 퍼포먼스, 콘셉트와 비주얼의 영역을 끊임없이 확장하며 NIGHT만의 색을 만들어왔다.','이후 다양한 음악과 콘셉트를 선보이며 NIGHT만의 스타일을 만들어왔다.','home about 1'],
    ['서로 다른 개성과 표현 방식이 하나의 무대에서 만나며, 앨범마다 새로운 모습을 보여주면서도 NIGHT만의 정체성을 잃지 않는다.','서로 다른 다섯 멤버의 개성과 표현 방식은 한 무대에서 NIGHT만의 색으로 이어진다.','home about 2'],
    ['정해진 하나의 콘셉트가 아니라, 다섯 사람이 함께할 때 완성되는 색.','다섯 사람이 함께할 때 가장 선명해지는 팀.','home about 3'],
    ['앨범과 활동, 공식 콘텐츠와 최신 소식까지 원하는 NIGHT를 찾아보세요.','앨범과 공연, 공식 콘텐츠와 최신 소식까지 NIGHT의 활동을 한곳에서 만나보세요.','home explore'],
    ['데뷔부터 공연과 팬클럽, 주요 활동까지 NIGHT가 지나온 시간을 확인하세요.','데뷔부터 앨범, 공연, 팬클럽 활동까지 NIGHT의 주요 순간을 시간순으로 확인하세요.','home history card'],
    ['콘셉트 포토와 공식 활동, 캠페인에서 공개된 NIGHT의 사진을 모았습니다.','콘셉트 포토와 활동 사진, 다양한 공식 비주얼을 모아보세요.','home gallery card']
  ];
  for(const [from,to,label] of edits) text=mustReplace(text,from,to,label);
  await writeFile(path,text,'utf8');
}

{
  const path='src/pages/about-night.json';
  const page=JSON.parse(await readFile(path,'utf8'));
  page.headHtml=mustReplace(page.headHtml,'NIGHT의 그룹 프로필, 음악과 퍼포먼스 정체성, 현재 멤버, 변화와 주요 기록을 소개하는 공식 그룹 페이지.','NIGHT의 그룹 프로필과 음악, 퍼포먼스, 현재 멤버와 주요 활동을 소개하는 공식 페이지.','about meta');
  const edits=[
    ['다크하고 관능적인 무대에서 출발해 음악과 퍼포먼스, 비주얼을 통해 자신들만의 밤을 끊임없이 확장해온 5인조 그룹.','다크하고 관능적인 무대로 데뷔해 음악과 퍼포먼스, 비주얼을 꾸준히 넓혀온 5인조 그룹.','about lead'],
    ['2022년 시작된 NIGHT의 현재를 가장 간결하게 소개합니다.','NIGHT의 기본 정보를 한눈에 확인하세요.','about glance'],
    ['그러나 NIGHT의 정체성은 하나의 콘셉트에 머무르지 않는다. 몽환적인 밤, 확장되는 세계, 인물의 내면과 욕망, 완벽한 낙원의 모순까지 앨범마다 서로 다른 이야기를 선택해왔다.','NIGHT는 데뷔 이후 몽환적인 팝과 R&B, 시네마틱한 사운드까지 다양한 음악을 선보여왔다. 앨범마다 새로운 분위기를 시도하면서도 강렬한 퍼포먼스와 팀의 색은 이어진다.','about identity story'],
    ['변화하는 콘셉트 속에서도 강한 무대 장악력, 멤버 각각의 표현 방식, 패션 하우스에서 출발한 CASTLE 특유의 절제된 비주얼 감각은 NIGHT를 하나의 팀으로 연결하는 공통된 축이다.','강한 무대 장악력과 멤버별 표현력, CASTLE 특유의 절제된 비주얼 감각은 NIGHT의 활동 전반을 이어주는 특징이다.','about identity close'],
    ['다크한 데뷔 사운드에서 몽환, 팝, R&amp;B, 시네마틱한 전개까지 앨범마다 장르와 질감을 확장한다. 변화 자체가 NIGHT의 디스코그래피를 관통하는 특징이다.','다크한 데뷔 사운드부터 몽환적인 팝, R&amp;B, 시네마틱한 곡까지 앨범마다 새로운 장르와 분위기를 들려준다.','about music'],
    ['안무만이 아니라 표정, 시선, 동선과 멤버 간의 에너지까지 퍼포먼스의 일부로 다룬다. 서로 다른 다섯 사람의 개성이 하나의 장면에서 만나는 것을 중요하게 생각한다.','안무와 동선은 물론 표정과 시선까지 세밀하게 활용한다. 서로 다른 다섯 멤버의 개성이 한 무대에서 자연스럽게 어우러지는 퍼포먼스가 강점이다.','about performance'],
    ['도시의 밤과 럭셔리한 재질, 실버와 어두운 색조에서 출발해 앨범의 세계에 따라 과감하게 변주한다. 콘셉트는 달라져도 NIGHT만의 밀도와 긴장감을 유지한다.','도시적인 밤의 이미지와 절제된 컬러를 바탕으로, 앨범마다 새로운 스타일을 더한다. 서로 다른 콘셉트에서도 NIGHT 특유의 세련된 분위기를 유지한다.','about visual'],
    ['멤버의 변화 역시 NIGHT가 지나온 시간의 일부입니다.','데뷔부터 현재까지 이어진 멤버 구성을 소개합니다.','about evolution desc'],
    ['CHAPTER 01','2022 · DEBUT','about chapter1'],
    ['CHAPTER 02','TRANSITION','about chapter2'],
    ['CHAPTER 03','CURRENT LINE-UP','about chapter3'],
    ['DOHA, WOOHYUN, JIWOO, IHWAN, ANGELO의 초대 5인 체제로 2022년 데뷔했다. NIGHT의 첫 음악과 무대 언어가 이 시기에 만들어졌다.','DOHA, WOOHYUN, JIWOO, IHWAN, ANGELO의 5인 체제로 2022년 데뷔했다.','about original five'],
    ['ANGELO의 활동 종료 이후 NIGHT는 잠시 네 멤버로 활동했다. 기존의 색을 유지하면서도 다음 형태를 준비한 전환기였다.','ANGELO의 활동 종료 이후 한동안 네 멤버로 활동했다.','about transition'],
    ['TAEHOON이 합류하며 현재의 5인 체제가 완성됐다. 새로운 관계와 목소리가 더해진 이후 NIGHT의 음악과 활동 범위는 다시 확장됐다.','TAEHOON의 합류로 현재의 5인 체제가 완성됐으며, 이후 다섯 멤버로 활동을 이어가고 있다.','about current five'],
    ['Records of the night.','Key moments.','about milestones title'],
    ['전체 연혁이 아닌 NIGHT를 설명하는 대표 기록만 담았습니다.','NIGHT의 주요 순간을 간단히 정리했습니다.','about milestones desc']
  ];
  for(const [from,to,label] of edits) page.contentHtml=mustReplace(page.contentHtml,from,to,label);
  await writeFile(path,JSON.stringify(page,null,2)+'\n','utf8');
}

{
  const path='src/pages/history.json';
  const page=JSON.parse(await readFile(path,'utf8'));
  page.headHtml=mustReplace(page.headHtml,'NIGHT official history archive.','NIGHT의 데뷔부터 최신 활동까지 주요 앨범, 공연, 팬클럽과 프로젝트를 소개합니다.','history meta');
  const edits=[
    ['데뷔부터 PARADOX와 REST까지. NIGHT의 앨범, 공연, 팬클럽과 주요 프로젝트를 기록한다.','데뷔부터 REST까지, NIGHT의 앨범과 공연, 팬클럽 활동과 주요 프로젝트를 시간순으로 만나보세요.','history hero'],
    ['잔잔한 위로와 휴식을 담은 디지털 싱글 REST 발표. 타이틀곡은 NEXT TIME.','디지털 싱글 REST 발표. 타이틀곡은 NEXT TIME으로, 편안하고 잔잔한 분위기를 담았다.','history rest'],
    ['완벽함의 모순을 주제로 한 앨범 PARADOX 발표. 타이틀곡은 PARADISE.','앨범 PARADOX 발표. 타이틀곡은 PARADISE.','history paradox'],
    ['NIGHT OFF-CAMERA ARCHIVE. 다섯 전시 공간과 공식 티켓으로 만나는 프레임 밖의 NIGHT.','무대 밖 NIGHT의 모습을 담은 공식 전시 OUT OF FRAME 개최. 다섯 개의 전시 공간으로 구성됐다.','history exhibition'],
    ['악몽에서 탈출하려는 이야기의 끝에서 NIGHT 자신들이 악몽 그 자체였음이 드러나는 반전의 앨범. 타이틀곡은 BLACK NIGHT.','어둡고 긴장감 있는 사운드와 비주얼을 선보인 앨범 NIGHTMARE 발표. 타이틀곡은 BLACK NIGHT.','history nightmare'],
    ['ANGEL과 FALLEN, 빛과 상흔 사이의 경계를 따라가는 WINGS의 공식 기록.','미니앨범 WINGS 발표. 공식 비주얼과 활동 기록을 함께 공개했다.','history wings'],
    ['NIGHT SKY에서 THE NIGHT BEYOND까지. 초야의 포스터와 티켓, 무대의 흐름을 담은 콘서트 아카이브.','네 번째 단독 콘서트 超夜 개최. 이틀간의 공연과 공식 포스터, 티켓, 무대 기록을 공개했다.','history concert4'],
    ['DAY와 NIGHT, 두 얼굴로 이어지는 PERSONA의 콘셉트와 앨범, 뮤직비디오 스틸 및 무대 기록.','미니앨범 PERSONA 발표. DAY와 NIGHT 두 버전의 비주얼과 무대 활동을 선보였다.','history persona'],
    ['빛이 사라진 뒤에도 남는 잔상을 테마로 한 여섯 번째 공식 멤버십 공개.','공식 팬클럽 LUNA 6기 멤버십 키트 AFTERIMAGE 공개.','history luna6'],
    ['Where the Night Begins to Dream. 공연과 VCR, 굿즈 및 비하인드를 담은 세 번째 단독 콘서트.','세 번째 단독 콘서트 夢夜 개최. 공연과 VCR, 굿즈 및 비하인드 콘텐츠를 공개했다.','history concert3'],
    ['ORBIT와 CONVERGENCE 두 버전으로 전개한 정규앨범. 타이틀곡은 NOT FINISH.','정규앨범 COMPLETE 발표. ORBIT와 CONVERGENCE 두 버전으로 발매됐으며 타이틀곡은 NOT FINISH.','history complete'],
    ['LOOP와 EXPANSION의 두 방향으로 확장한 미니앨범. 타이틀곡은 RESTART.','미니앨범 INFINITY 발표. LOOP와 EXPANSION 두 버전으로 발매됐으며 타이틀곡은 RESTART.','history infinity'],
    ['달빛 아래 흑호의 이미지를 전개한 미니앨범. 타이틀곡은 범(虎).','미니앨범 SENSATIONAL 발표. 타이틀곡은 범(虎).','history sensational'],
    ['NIGHT의 다섯 해를 하나의 동선으로 연결한 5주년 팝업스토어 공개.','데뷔 5주년을 기념한 팝업스토어 FIVE YEARS. ONE NIGHT. 개최.','history fifth'],
    ['NIGHT의 공식 에디토리얼 화보 공개. 팀의 성숙한 비주얼 아이덴티티를 확장한 첫 공식 포토북 프로젝트.','NIGHT의 공식 에디토리얼 포토북 공개.','history photobook'],
    ['공식 디지털 매거진 화보와 인터뷰 특집 공개. 무대 밖 NIGHT의 스타일과 이야기를 담은 아카이브.','공식 디지털 매거진 화보와 인터뷰 특집 공개.','history magazine'],
    ['NIGHT의 밤, 꿈, 그림자와 환영을 집약한 4년 차 컴백. 타이틀곡은 ILLUSION.','앨범 PHANTOM 발표. 타이틀곡은 ILLUSION.','history phantom']
  ];
  for(const [from,to,label] of edits) page.contentHtml=mustReplace(page.contentHtml,from,to,label);
  await writeFile(path,JSON.stringify(page,null,2)+'\n','utf8');
}

console.log('Naturalized HOME / ABOUT / HISTORY copy.');
