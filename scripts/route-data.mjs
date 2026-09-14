import {vlogEpisodes,expandVlog} from '../src/react/photo-data.mjs';
export function routeData(route,{trees,navigation,catalog,photos,products}){
  const data={navigation:navigation[route]??null};
  if(trees[route])data.nodes=trees[route];
  if(route==='archive.html')data.catalog=catalog;
  if(route==='store.html')data.products=products;
  if(route==='vlog.html')data.photos={vlogs:vlogEpisodes.map(expandVlog)};
  if(route==='night-originals.html')data.photos={originals:photos.originals,flowers:photos.flowers};
  if(route==='with-luna.html')data.photos={luna:photos.luna};
  if(route==='if-night.html')data.photos={gallery:photos.gallery};
  return data;
}
export function serializeRouteData(data){
  return JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
}
