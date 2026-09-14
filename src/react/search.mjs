export function archiveState(search, labels) {
  const params=new URLSearchParams(search);
  return {query:params.get('q')||'',category:Object.hasOwn(labels,params.get('category'))?params.get('category'):'all',sort:params.get('sort')==='title'?'title':'category'};
}
export function searchRecords(catalog,{query='',category='all',sort='category'}) {
  const normalize=value=>value.normalize('NFKC').toLocaleLowerCase().trim();
  const terms=normalize(query).split(/\s+/).filter(Boolean);
  const categories=Object.keys(catalog.labels);
  return catalog.records.filter(record=>(category==='all'||record.category===category)&&terms.every(term=>normalize([record.title,record.summary,record.keywords,record.searchText].join(' ')).includes(term))).sort((a,b)=>(sort==='category'?categories.indexOf(a.category)-categories.indexOf(b.category):0)||a.title.localeCompare(b.title,'ko'));
}
