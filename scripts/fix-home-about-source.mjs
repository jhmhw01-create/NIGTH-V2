import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const path = resolve('src/react/HomePage.jsx');
const source = await readFile(path, 'utf8');
const from = 'src={"assets/images/home-night.webp"}';
const to = 'src={"assets/images/night-group-profile.webp"}';

const matches = source.split(from).length - 1;
if (matches !== 1) {
  throw new Error(`Expected exactly one HOME About legacy image reference, found ${matches}.`);
}

await writeFile(path, source.replace(from, to));
console.log('Updated HOME About image source to assets/images/night-group-profile.webp.');
