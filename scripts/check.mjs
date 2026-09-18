import {readFile,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {localGuides} from '../content/local-services.mjs';
import {services,cities,slug} from '../content/site.mjs';
const config=JSON.parse(await readFile('dist/build-config.json'));
const plan=JSON.parse(await readFile('planning/page-plan.json'));
assert.equal(plan.length,179); assert.equal(new Set(plan.map(p=>p.path)).size,179);
const routes=JSON.parse(await readFile('dist/routes.json'));
assert.equal(routes.length,179,'All approved pages must be built');
assert.deepEqual(new Set(localGuides.map(g=>g.city)),new Set(cities),'Every approved city needs its own guide');
for(const city of cities)for(const service of services)assert(routes.some(r=>r.path===`/${slug(city)}/${slug(service)}/`),`Missing ${service} in ${city}`);
const buildInfo=JSON.parse(await readFile('dist/build-info.json'));
assert.equal(buildInfo.pageCount,routes.length);
assert.equal(new Set(routes.map(r=>r.path)).size,routes.length);
const imagePaths=new Set(), titles=new Set(), descriptions=new Set(), paragraphs=new Set();
for(const guide of localGuides) for(const service of services){
  const note=guide.notes[service]; assert(note,`${guide.city}: missing ${service}`);
  assert(guide.sources[note[3]],`${guide.city}: missing source`);
  for(const paragraph of note.slice(1,3)){assert(!paragraphs.has(paragraph),'Duplicate local copy'); paragraphs.add(paragraph);}
}
for(const {path} of routes){
  const html=await readFile('dist'+path+'index.html','utf8');
  assert.equal((html.match(/<h1>/g)||[]).length,1,path);
  assert.match(html,config.production?/content="index,follow"/:/noindex,nofollow/);
  const title=html.match(/<title>(.*?)<\/title>/)[1]; assert(!titles.has(title)); titles.add(title);
  const description=html.match(/<meta name="description" content="([^"]+)"/)[1]; assert(!descriptions.has(description)); descriptions.add(description);
  for(const [,json]of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) assert(JSON.parse(json)['@graph'].length>=3);
  for(const [,url]of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)){
    const target='dist'+url.split('#')[0];await stat(target.endsWith('/')?target+'index.html':target);
    if(url.endsWith('.webp')) imagePaths.add(target);
  }
  for(const [,candidates] of html.matchAll(/srcset="([^"]+)"/g)) for(const candidate of candidates.split(',')){
    const [url,width]=candidate.trim().split(/\s+/); assert.match(width,/^\d+w$/);imagePaths.add('dist'+url);
  }
  assert(!html.includes('An extraordinary home'));
  assert(!html.includes('project-16-1600.webp'),'Damaged hero candidate reintroduced');
  assert(html.includes('hello&#64;verdelandscapes&#46;com'),'Email must survive preview domain substitution');
}
for(const file of imagePaths){
  const bytes=await readFile(file);assert.equal(bytes.toString('ascii',0,4),'RIFF',file);assert.equal(bytes.toString('ascii',8,12),'WEBP',file);
  assert.equal(bytes.readUInt32LE(4)+8,bytes.length,`${file}: incomplete WebP file`);
}
console.log(`PASS: ${routes.length} pages, ${imagePaths.size} image files, links, unique metadata/local paragraphs, structured data and indexing configuration.`);
