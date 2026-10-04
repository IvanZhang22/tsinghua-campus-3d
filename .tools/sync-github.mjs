import {spawnSync} from 'node:child_process';
const repo='IvanZhang22/tsinghua-campus-3d';
function run(command,args,input){const r=spawnSync(command,args,{encoding:'utf8',input,maxBuffer:20*1024*1024});if(r.status!==0)throw new Error(r.stderr||r.stdout);return r.stdout;}
const git=(...args)=>run('git',args);
function api(path,body){return JSON.parse(run('gh',['api',`repos/${repo}/${path}`,'--method',body?'POST':'GET',...(body?['--input','-']:[])],body?JSON.stringify(body):undefined));}
const commits=git('rev-list','--reverse','HEAD').trim().split('\n');
let bootstrap=false;
try{api('git/trees',{tree:[{path:'.gitkeep',mode:'100644',type:'blob',content:''}]});}
catch(e){if(!e.message.includes('empty'))throw e;
 const r=spawnSync('gh',['api',`repos/${repo}/contents/.gitkeep`,'--method','PUT','--input','-'],{encoding:'utf8',input:JSON.stringify({message:'chore: initialize GitHub repository',content:''})});if(r.status!==0)throw new Error(r.stderr);bootstrap=true;
}
let parent;const uploaded=[];
for(const sha of commits){
 const elements=git('ls-tree','-r','--name-only','-z',sha).split('\0').filter(Boolean).map(path=>{
  if(/\.(png|jpg)$/i.test(path)){
   const binary=spawnSync('git',['show',`${sha}:${path}`],{maxBuffer:20*1024*1024});if(binary.status!==0)throw new Error('Cannot read screenshot');
   const blob=api('git/blobs',{content:binary.stdout.toString('base64'),encoding:'base64'});
   if(blob.sha!==git('rev-parse',`${sha}:${path}`).trim())throw new Error('Screenshot mismatch');
   return {path,mode:'100644',type:'blob',sha:blob.sha};
  }
  return {path,mode:'100644',type:'blob',content:git('show',`${sha}:${path}`)};
 });
 const tree=api('git/trees',{tree:elements});
 const data=git('show','-s','--format=%an%n%ae%n%aI%n%cn%n%ce%n%cI',sha).trim().split('\n');
 const raw=git('cat-file','-p',sha);const message=raw.slice(raw.indexOf('\n\n')+2);
 const commit=api('git/commits',{message,tree:tree.sha,parents:parent?[parent]:[],author:{name:data[0],email:data[1],date:data[2]},committer:{name:data[3],email:data[4],date:data[5]}});
 if(tree.sha!==git('rev-parse',`${sha}^{tree}`).trim())throw new Error('Source tree mismatch');
 if(sha!==commit.sha)throw new Error(`Commit mismatch: ${sha} != ${commit.sha}`);
 console.log(`Verified source tree ${tree.sha.slice(0,7)} / commit ${commit.sha.slice(0,7)}`);parent=commit.sha;uploaded.push(commit.sha);
}
const main=uploaded[0];
for(const [branch,sha] of [['main',main],['feat/campus-explorer',parent]]){
 try{api('git/refs',{ref:`refs/heads/${branch}`,sha});}
 catch(e){if(!e.message.includes('already exists'))throw e;
  if(branch==='main'&&!bootstrap){const current=api('commits/main');if(current.sha===main){console.log('Main already synchronized');continue;}if(current.commit.message!=='chore: initialize GitHub repository'){console.log('Existing main retained');continue;}bootstrap=true;}
  const r=spawnSync('gh',['api',`repos/${repo}/git/refs/heads/${branch}`,'--method','PATCH','--input','-'],{encoding:'utf8',input:JSON.stringify({sha,force:branch==='main'&&bootstrap})});if(r.status!==0)throw new Error(r.stderr);
 }
 console.log(`Published ${branch}: ${sha.slice(0,7)}`);
}
