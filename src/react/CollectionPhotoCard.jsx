import {imageProps} from './image-props.mjs';
export function CollectionPhotoCard({photo,onOpen,full=false,dimensions={}}){
  const source=full?photo.full:photo.thumb;
  return <button className="nc-photo" type="button" aria-label={photo.label+' 크게 보기'} onClick={()=>onOpen(photo)}><img src={source} alt={photo.label} loading="lazy" decoding="async" {...imageProps(dimensions,source)}/><span><b>{photo.label}</b><small>확대 ↗</small></span></button>;
}
