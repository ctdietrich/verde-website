import {cities} from '../content/site.mjs';

// This repository now backs the live production website.
 // Build as production by default so hosting providers do not need custom env vars.
 // Set SITE_MODE=preview explicitly only when creating a noindex preview build.
export const production = process.env.SITE_MODE !== 'preview';
export const siteOrigin = 'https://www.verdelandscapes.com';
const attribute = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export function metadata(path, title, description) {
  const url = siteOrigin + path;
  const organization = {'@type':'Organization','@id':siteOrigin+'/#organization',name:'Verde Landscape Services',url:siteOrigin,telephone:'+1-737-300-9848',email:'hello@verdelandscapes.com',contactPoint:{'@type':'ContactPoint',telephone:'+1-737-300-9848',contactType:'customer service',areaServed:'US-TX',availableLanguage:'English'},areaServed:cities.map(name=>({'@type':'City',name:name+', Texas'}))};
  const webpage = {'@type':'WebPage','@id':url+'#webpage',url,name:title,description,isPartOf:{'@id':siteOrigin+'/#website'},about:{'@id':organization['@id']}};
  const graph = [organization,{'@type':'WebSite','@id':siteOrigin+'/#website',url:siteOrigin,name:'Verde Landscape Services',publisher:{'@id':organization['@id']}},webpage];
  const parts=path.split('/').filter(Boolean);
  if(parts.length===2 && parts[0]!=='case-studies') graph.push({'@type':'Service',name:title,description,provider:{'@id':organization['@id']},url});
  const data=JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c');
  return `<meta name="robots" content="${production?'index,follow':'noindex,nofollow'}">${production?`<link rel="canonical" href="${attribute(url)}">`:''}<meta property="og:type" content="website"><meta property="og:site_name" content="Verde Landscape Services"><meta property="og:locale" content="en_US"><meta property="og:title" content="${attribute(title)}"><meta property="og:description" content="${attribute(description)}">${production?`<meta property="og:url" content="${attribute(url)}"><meta property="og:image" content="${siteOrigin}/assets/project-5-1600.webp"><meta property="og:image:alt" content="Landscape construction by Verde Landscape Services in Central Texas"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${attribute(title)}"><meta name="twitter:description" content="${attribute(description)}"><meta name="twitter:image" content="${siteOrigin}/assets/project-5-1600.webp">`:''}<script type="application/ld+json">${data}</script>`;
}

export function sitemap(pages) {
  return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.map(p=>`<url><loc>${siteOrigin}${p.path}</loc></url>`).join('')+'</urlset>';
}
