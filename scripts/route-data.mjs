import {vlogEpisodes,expandVlog,vlogReaction} from '../src/react/photo-data.mjs';
function referencedImageDimensions(value,imageDimensions){
  const paths=new Set();
  const visit=item=>{
    if(typeof item==='string'){
      if(imageDimensions[item])paths.add(item);
      const thumb=item.replace('/full/','/thumbs/');
      if(thumb!==item&&imageDimensions[thumb])paths.add(thumb);
      return;
    }
    if(Array.isArray(item)){item.forEach(visit);return;}
    if(item&&typeof item==='object')Object.values(item).forEach(visit);
  };
  visit(value);
  return Object.fromEntries([...paths].map(path=>[path,imageDimensions[path]]));
}
export function routeData(route,{trees,navigation,catalog,photos,products,imageDimensions={},updates=[]}){
  const data={navigation:navigation[route]??null};
  if(route==='index.html')data.updates=updates;
  if(trees[route])data.nodes=trees[route];
  if(route==='archive.html')data.catalog=catalog;
  if(route==='store.html')data.products=products;
  if(route==='vlog.html')data.photos={vlogs:vlogEpisodes.map(expandVlog)};
  if(route==='night-originals.html')data.photos={originals:photos.originals,flowers:photos.flowers};
  if(route==='with-luna.html')data.photos={luna:photos.luna};
  if(route==='if-night.html')data.photos={gallery:photos.gallery};
  if(data.catalog||data.products||data.photos){
    const source=data.catalog??data.products??(route==='vlog.html'?[data.photos,data.photos.vlogs.map(vlogReaction)]:data.photos);
    const referenced=referencedImageDimensions(source,imageDimensions);
    if(Object.keys(referenced).length)data.imageDimensions=referenced;
  }
  return data;
}
export function serializeRouteData(data){
  return JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
}
