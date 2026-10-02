import {readFile,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {localGuides} from '../content/local-services.mjs';
import {services,cities,slug,projects} from '../content/site.mjs';
for(const p of projects){
  assert(!p.gallery.includes(p.image),`${p.name}: hero repeated in gallery`);
  assert.equal(new Set(p.gallery).size,p.gallery.length,`${p.name}: repeated gallery photo`);
}
const config=JSON.parse(await readFile('dist/build-config.json'));
const plan=JSON.parse(await readFile('planning/page-plan.json'));
assert.equal(plan.length,179); assert.equal(new Set(plan.map(p=>p.path)).size,179);
const routes=JSON.parse(await readFile('dist/routes.json'));
assert.equal(routes.length,179,'All approved pages must be built');
assert.deepEqual(new Set(localGuides.map(g=>g.city)),new Set(cities),'Every approved city needs its own guide');
for(const city of cities)for(const service of services)assert(routes.some(r=>r.path===`/${slug(city)}/${slug(service)}/`),`Missing ${service} in ${city}`);
const stylesText=await readFile('dist/styles.css','utf8');
assert(stylesText.includes('grid-template-columns:minmax(0,.8fr) minmax(540px,1.2fr)'), 'Contact desktop layout must remain two-column');
assert(stylesText.includes('height:460px') && stylesText.includes('max-height:460px'), 'Homepage project image must remain balanced above the desktop fold');
assert(stylesText.includes('.header nav{font-size:16px'), 'Desktop navigation must remain clearly readable');
assert(stylesText.includes('.footer{font-size:16px'), 'Footer typography must remain clearly readable');
assert(stylesText.includes('.button{font-size:16px'), 'Major CTA text must remain readable');
assert(stylesText.includes('.about-team-photo img[data-photo-id="44"]') && stylesText.includes('height:clamp(500px,36vw,560px)') && stylesText.includes('object-position:50% 60%'), 'Lower About vehicle photo must keep the approved lower crop');

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
  assert.match(html, /class="call-bar"[\s\S]*?href="tel:\+17373009848"/, `${path}: missing top click-to-call link`);
  assert(!html.includes('Design preview · Website in development'), `${path}: development preview banner must not appear in production pages`);
  if(path==='/') {
    assert.match(html,/Landscape &amp; hardscape <br>construction for Central Texas <br>properties\./,'Homepage headline must preserve word spacing when line breaks are hidden on mobile');
    assert.match(html,/class="hero home-hero"/,'Homepage must use the fold-safe scoped hero layout');
    assert.match(html,/high-end residential and commercial landscapes/,'Homepage hero must describe Verde’s actual market and project scope');
    assert.match(html,/class="hero-phone" href="tel:\+17373009848"/,'Homepage needs a direct call action');
    assert.match(html,/data-photo-id="9"/,'Homepage hero must use a real Providence Estates project photo');
    assert.match(html,/Providence Estates Townhomes · San Antonio, Texas/,'Project photo must be captioned accurately');
    assert.match(html,/href="\/contact\/"/,'Homepage needs a direct inquiry path');
  }
  if(path==='/contact/') {
    assert(!html.includes('Good work starts'));
    assert.match(html,/class="contact-phone" href="tel:\+17373009848"/);
    const form=html.match(/<form\b[\s\S]*?<\/form>/)?.[0];
    assert(form,'Contact form must render');
    assert.equal((form.match(/\srequired(?=\s|>)/g)||[]).length,5,'Exactly five lead fields should be required');
    for(const field of ['Name','email','Phone','Property address','Project details']) assert(form.includes('name="'+field+'"'), 'Missing contact field: '+field);
    assert.match(form,/id="property-address"[\s\S]*?name="Property address"[\s\S]*?required/,'Property address must be required and autocomplete-ready');
    assert.match(form,/name="Project details"[\s\S]*?required/,'Project details must be required');
    assert(!form.includes('name="Project type"'),'Project type selection should not appear');
    assert(!form.includes('name="Project location"'),'Project city or area should not appear');
    assert(html.includes('Just a bit of information. We’ll take it from there.'),'Lead-form intro must use the approved wording');
    assert.match(html,/class="contact-layout"[\s\S]*?class="contact-left"[\s\S]*?class="inquiry-panel"/,'Contact page must keep information on the left and form on the right');
    assert(html.indexOf('class="contact-phone"') < html.indexOf('class="contact-intro-copy"'),'Phone must precede intro copy so phone and email stay above the fold');
    assert(form.includes('https://formsubmit.co/hello&#64;verdelandscapes&#46;com'),'FormSubmit delivery must remain intact');
  }
  if(path==='/case-studies/bare-ranch/') {
    for(const id of ['42','43']) assert(html.includes(`data-photo-id="${id}"`), `Bare Ranch missing approved gallery photo ${id}`);
    assert(!html.includes('data-photo-id="23"'),'Old Bare Ranch trail photo must be replaced');
  }
  if(path==='/about/') {
    assert.match(html,/class="about-hero-photo"/,'About page must include the approved top-right hero photo');
    assert.match(html,/class="about-hero-photo"[\s\S]*?data-photo-id="45"/,'About hero must use the approved Verde team photo');
    assert.match(html,/class="about-team-photo"/,'About page must include a team photo beside Who we are');
    assert.match(html,/class="about-team-photo"[\s\S]*?data-photo-id="44"/,'Who we are section must use the approved Bare Ranch vehicle photo');
    assert.match(html,/data-photo-id="9"/,'Selected-work card must use a different Providence Estates photo');
    assert.match(html,/Certified Expertise/);
    assert.match(html,/Licensed Irrigators and Arborists on staff/);
    assert.match(html,/Fully Insured/);
    assert.match(html,/Commercial Liability and all insurance coverages to meet requirements/);
    assert.match(html,/certified arborist leadership/i);
    assert.match(html,/workers’ compensation/);
    assert.match(html,/Schedule a consultation/);
    assert.match(html,/Landscape &amp; hardscape construction shaped by Central Texas/);
    assert.match(html,/Capability for the complex/);
    assert.match(html,/230 yards of river rock/);
    assert.match(html,/commercial liability coverage/);
    assert(!html.includes('Ongoing maintenance is available, but it isn’t the focus of our business'),'Negative positioning must stay off the About page');
    assert(!html.includes('class="closing green"'),'Do not repeat the CTA on About page');
  }
  assert.match(html,config.production?/content="index,follow"/:/noindex,nofollow/);
  const title=html.match(/<title>(.*?)<\/title>/)[1]; assert(!titles.has(title)); titles.add(title);
  const description=html.match(/<meta name="description" content="([^"]+)"/)[1]; assert(!descriptions.has(description)); descriptions.add(description);
  for(const [,json]of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) assert(JSON.parse(json)['@graph'].length>=3);
  for(const [,url]of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)){
    const target='dist'+url.split(/[?#]/)[0];await stat(target.endsWith('/')?target+'index.html':target);
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
