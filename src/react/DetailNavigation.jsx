import navigation from '../../.react-build/detail-navigation.json';
export function DetailNavigation({route,bottom=false}){
  const item=navigation[route];if(!item)return null;
  if(bottom)return <nav className="detail-return container" aria-label="상세 페이지 이동"><a className="btn secondary" href={item.parent.href}>{item.parent.back} ←</a><a href="#night-page-start">맨 위로 ↑</a></nav>;
  return <div className="detail-navigation container" id="night-page-start">
    <nav aria-label="현재 위치" className="detail-breadcrumb"><a href="index.html">HOME</a><span aria-hidden="true">›</span><a href={item.parent.href}>{item.parent.label}</a><span aria-hidden="true">›</span><span aria-current="page">{item.title}</span></nav>
    {item.sections.length>1&&<details className="detail-toc"><summary>페이지 목차 · {item.sections.length}개 구역</summary><nav aria-label="페이지 목차">{item.sections.map(section=><a key={section.id} href={'#'+section.id}>{section.label}</a>)}</nav></details>}
  </div>;
}
