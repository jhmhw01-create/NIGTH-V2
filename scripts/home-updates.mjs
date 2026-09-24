export function homeUpdates(notices){
  return notices
    .filter(item=>/^\d{4}-\d{2}-\d{2}$/.test(item.date??''))
    .sort((a,b)=>b.date.localeCompare(a.date))
    .slice(0,3)
    .map(item=>({id:item.id,title:item.title,date:item.dateDisplay,href:item.href}));
}
