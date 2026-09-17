import {readdir, readFile} from 'node:fs/promises';
import {extname, join, relative, resolve, sep} from 'node:path';

const repositoryRoot = resolve(new URL('..', import.meta.url).pathname);
const publicRoot = join(repositoryRoot, 'public');
const rootImages = join(publicRoot, 'assets', 'images');
const textExtensions = new Set(['.css', '.html', '.js', '.jsx', '.json', '.md', '.mjs', '.ts', '.tsx', '.txt']);

const slash = (path) => path.split(sep).join('/');

async function walk(directory, predicate = () => true) {
  const files = [];
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path, predicate));
    else if (entry.isFile() && predicate(path)) files.push(path);
  }
  return files;
}

async function sourceCorpus() {
  const roots = ['src', 'scripts', 'public'].map((name) => join(repositoryRoot, name));
  const chunks = [];
  for (const root of roots) {
    for (const path of await walk(root, (path) => {
      if (path.startsWith(join(publicRoot, 'assets', 'images') + sep)) return false;
      if (path.startsWith(join(publicRoot, 'assets', 'audio') + sep)) return false;
      return textExtensions.has(extname(path).toLowerCase());
    })) {
      chunks.push(await readFile(path, 'utf8'));
    }
  }
  return chunks.join('\n');
}

const corpus = await sourceCorpus();
const entries = await readdir(rootImages, {withFileTypes: true});
const rootFiles = entries
  .filter((entry) => entry.isFile())
  .map((entry) => slash(relative(publicRoot, join(rootImages, entry.name))))
  .sort();

const referenced = [];
const unreferenced = [];
for (const path of rootFiles) {
  (corpus.includes(path) ? referenced : unreferenced).push(path);
}

console.log(`Root image files: ${rootFiles.length}`);
console.log(`Referenced: ${referenced.length}`);
console.log(`Unreferenced candidates: ${unreferenced.length}`);
console.log('--- ROOT UNREFERENCED CANDIDATES ---');
for (const path of unreferenced) console.log(path);
console.log('--- END ROOT UNREFERENCED CANDIDATES ---');
console.log('These are review candidates only. Do not delete without checking route compatibility and generated output.');
