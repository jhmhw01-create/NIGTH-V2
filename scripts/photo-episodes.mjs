import {readFile} from 'node:fs/promises';
export function parsePhotoEpisodes(source){
  const data=JSON.parse(source.replace(/^\s*window\.NightCollections\s*=\s*/,'').replace(/;\s*$/,''));
  if(!Array.isArray(data.originals)||!Array.isArray(data.flowers))throw Error('Missing original photo episode data');
  for(const episode of data.originals){
    if(!episode.id||!episode.title||!episode.scenes?.length||!Array.isArray(episode.extras))throw Error('Invalid original photo episode');
  }
  return {originals:data.originals,flowers:data.flowers};
}
export async function readPhotoEpisodes(root){return parsePhotoEpisodes(await readFile(new URL('public/assets/js/night-collections-data.js',root),'utf8'));}
