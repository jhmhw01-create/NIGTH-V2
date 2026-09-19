export function DetailNavigation({item,bottom=false}){
  if(!item)return null;
  if(bottom)return <nav className="detail-return container" aria-label="상세 페이지 이동"><a className="btn secondary" href={item.parent.href}>{item.parent.back} ←</a><a href="#night-page-start">맨 위로 ↑</a></nav>;
  const related=item.related??[];
  const hasNavigation=item.sections.length>1||related.length>0;
  return <div className="detail-navigation container" id="night-page-start">
    <nav aria-label="현재 위치" className="detail-breadcrumb"><a href="index.html">HOME</a><span aria-hidden="true">›</span><a href={item.parent.href}>{item.parent.label}</a><span aria-hidden="true">›</span><span aria-current="page">{item.title}</span></nav>
    {hasNavigation&&<details className="detail-toc" open={related.length>0}><summary>페이지 목차 · {item.sections.length}개 구역{related.length>0?' + 관련 아카이브':''}</summary><nav aria-label="페이지 목차">{item.sections.map(section=><a key={section.id} href={'#'+section.id}>{section.label}</a>)}{related.map(link=><a key={link.href} href={link.href}>{link.label}</a>)}</nav></details>}
  </div>;
}
