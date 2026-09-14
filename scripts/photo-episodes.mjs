import {readFile} from 'node:fs/promises';
export function parsePhotoEpisodes(source){
  const data=JSON.parse(source.replace(/^\s*window\.NightCollections\s*=\s*/,'').replace(/;\s*$/,''));
  if(!Array.isArray(data.originals)||!Array.isArray(data.flowers))throw Error('Missing original photo episode data');
  for(const episode of data.originals){
    if(!episode.id||!episode.title||!episode.scenes?.length||!Array.isArray(episode.extras))throw Error('Invalid original photo episode');
  }
  if(!data.luna?.length||!data.gallery?.length)throw Error('Missing collection photo data');
  for(const member of data.luna)if(!member.id||!member.name||!member.scenes?.length)throw Error('Invalid LUNA photo data');
  for(const theme of data.gallery)if(!theme.id||!theme.title||!theme.images?.length)throw Error('Invalid IF theme data');
  return {originals:data.originals,flowers:data.flowers,luna:data.luna,gallery:data.gallery};
}
export async function readPhotoEpisodes(root){return parsePhotoEpisodes(await readFile(new URL('public/assets/js/night-collections-data.js',root),'utf8'));}
