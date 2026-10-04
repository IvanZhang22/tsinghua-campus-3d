import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base='https://tsinghua-campus-3d.vercel.app';
const html=await fetch(base,{signal:AbortSignal.timeout(20000)}).then(r=>{if(!r.ok)throw Error(`HTTP ${r.status}`);return r.text()});
const scripts=[...html.matchAll(/src="(\/assets\/[^\"]+\.js)"/g)].map(m=>m[1]);
const hash=b=>createHash('sha256').update(b).digest('hex');
for(const path of [...scripts,'/photos/dome-0.jpg','/photos/law.jpg']){
 const res=await fetch(base+path,{signal:AbortSignal.timeout(20000)});if(!res.ok)throw Error(`${path} HTTP ${res.status}`);
 const remote=Buffer.from(await res.arrayBuffer());
 const local=await readFile(path.startsWith('/assets/')?'dist'+path:'public'+path);
 if(hash(remote)!==hash(local))throw Error(`${path} differs from local production build`);
 console.log(JSON.stringify({path,status:res.status,bytes:remote.length,sha256:hash(remote),matchesLocal:true}));
}
console.log(JSON.stringify({site:base,title:html.match(/<title>(.*?)<\/title>/)?.[1],status:'verified'}));
