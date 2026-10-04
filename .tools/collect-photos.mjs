import fs from 'node:fs/promises';
const categories=['Buildings in Tsinghua University','Teaching buildings of Tsinghua University','Tsinghua University Library','Tsinghua University Auditorium','Tsinghua Second Gate','Gardens of Tsinghua University'];
const collected=new Map();
const api=async params=>{const url=new URL('https://commons.wikimedia.org/w/api.php');url.search=new URLSearchParams({action:'query',format:'json',...params});const r=await fetch(url,{signal:AbortSignal.timeout(30000),headers:{'User-Agent':'TsinghuaCampusExplorer/1.1 (educational campus visualization)'}});if(!r.ok)throw new Error('Commons '+r.status);return r.json();};
for(const cat of categories){try{const data=await api({generator:'categorymembers',gcmtitle:'Category:'+cat,gcmtype:'file',gcmlimit:'500',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'960'});for(const p of Object.values(data.query?.pages??{}))collected.set(p.title,p);}catch(e){console.log(cat+': '+e.message);}}
const extra=await api({generator:'search',gsrsearch:'Tsinghua University',gsrnamespace:'6',gsrlimit:'100',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'960'});for(const p of Object.values(extra.query?.pages??{}))collected.set(p.title,p);
const specific=await api({titles:['File:清華大學李兆基科技大樓2.jpg','File:清華大學李兆基科技大樓.jpg','File:View of Tsinghua Auditorium in Tsinghua University.jpg','File:Thu gate.JPG','File:Tsinghua University Observatory.jpg','File:Tsinghua University Art Museum Huang Rulun Building (20240707145554).jpg'].join('|'),prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'960'});for(const p of Object.values(specific.query?.pages??{}))collected.set(p.title,p);
const clean=x=>(x??'').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').trim();
const photos=[];
for(const p of collected.values()){
 const i=p.imageinfo?.[0],m=i?.extmetadata,license=clean(m?.LicenseShortName?.value);if(!i||!/CC BY|CC0|Public domain/.test(license)||!/^image\/(jpeg|png|webp)$/.test(i.mime??'image/jpeg')||!(/\.(jpg|jpeg|png)$/i.test(p.title)))continue;
 photos.push({title:p.title,remote:i.thumburl??i.url,source:i.descriptionurl,author:clean(m?.Artist?.value),license,licenseUrl:m?.LicenseUrl?.value??'https://creativecommons.org/publicdomain/zero/1.0/',date:clean(m?.DateTimeOriginal?.value),description:clean(m?.ImageDescription?.value)});
}
await fs.writeFile('artifacts/reference/photos-catalog.json',JSON.stringify(photos,null,2));
console.log('Licensed photo catalog:',photos.length);console.log(photos.map(p=>p.title).join('\n'));
