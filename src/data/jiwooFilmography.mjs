const imagePaths=(slug,count)=>Array.from({length:count},(_,index)=>`assets/images/jiwoo/acting/${slug}/${slug}-${String(index+1).padStart(2,'0')}.webp`);

export const jiwooFilmography=[
  {year:2026,title:'열아홉의 온도',type:'DRAMA',period:'2026.02 — 03',role:'학생 1',roleType:'연기 데뷔 / 학생 1 → 조연 승격',slug:'temperature-of-nineteen',images:imagePaths('temperature-of-nineteen',7)},
  {year:2026,title:'사각지대',type:'DRAMA',period:'2026.11 — 12',role:'강수호',roleType:'형사 조연',slug:'blind-spot',images:imagePaths('blind-spot',3)},
  {year:2027,title:'좋아한다는 말 대신',type:'DRAMA',period:'2027.09 — 10',role:'윤재현',roleType:'로맨스 서브남주',slug:'instead-of-saying-i-like-you',images:imagePaths('instead-of-saying-i-like-you',4)},
  {year:2028,title:'완벽한 불일치',type:'DRAMA',period:'2028.11 — 2029.01',role:'한진영',roleType:'본격 로맨스 주연',slug:'perfect-mismatch',images:imagePaths('perfect-mismatch',17)},
  {year:2029,title:'무결점',type:'DRAMA',period:'2029.06 — 07',role:'구도경',roleType:'첫 본격 악역',slug:'flawless',images:imagePaths('flawless',20)},
  {year:2030,title:'경계선',type:'FILM',period:'2030년 여름 개봉',role:'성태주',roleType:'액션영화 주연',slug:'borderline',images:imagePaths('borderline',12)},
  {year:2031,title:'평범한 날',type:'FILM',period:'2031년 상반기 개봉',role:'김영수',roleType:'미스터리·오컬트 영화',slug:'ordinary-day',images:imagePaths('ordinary-day',7)}
];

export const jiwooActingImageCount=jiwooFilmography.reduce((total,work)=>total+work.images.length,0);
