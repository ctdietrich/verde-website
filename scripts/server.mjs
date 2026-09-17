import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
const root=path.resolve('dist');
const {production}=JSON.parse(await readFile(path.join(root,'build-config.json')));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.json':'application/json','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options','SAMEORIGIN');
  if(!production) res.setHeader('X-Robots-Tag','noindex, nofollow');
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end();}
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let file=path.resolve(root,'.'+pathname);
    if(!file.startsWith(root+path.sep)&&file!==root) throw Error('Invalid path');
    if(['build-config.json','routes.json'].includes(path.basename(file))) throw Error('Internal file');
    if((await stat(file)).isDirectory()){
      if(!pathname.endsWith('/')){res.writeHead(308,{'Location':encodeURI(pathname)+'/'});return res.end();}
      file=path.join(file,'index.html');
    }
    const ext=path.extname(file);
    res.setHeader('Content-Type',types[ext]||'application/octet-stream');
    res.setHeader('Cache-Control',ext==='.webp'?'public, max-age=86400':'no-cache');
    let data=await readFile(file);
    if(['.html','.css','.js','.xml','.txt'].includes(ext)){
      res.setHeader('Vary','Accept-Encoding');
      if(/\bgzip\b/.test(req.headers['accept-encoding']||'')){data=gzipSync(data);res.setHeader('Content-Encoding','gzip');}
    }
    res.setHeader('Content-Length',data.length);
    res.end(req.method==='HEAD'?undefined:data);
  }catch{
    res.statusCode=404;
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag','noindex');
    res.end(req.method==='HEAD'?undefined:await readFile(path.join(root,'404.html')));
  }
}).listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('Verde ready on port '+(process.env.PORT||3000)));
