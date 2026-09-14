export function CollectionPhotoCard({photo,onOpen,full=false}){
  return <button className="nc-photo" type="button" aria-label={photo.label+' 크게 보기'} onClick={()=>onOpen(photo)}><img src={full?photo.full:photo.thumb} alt={photo.label} loading="lazy"/><span><b>{photo.label}</b><small>확대 ↗</small></span></button>;
}
