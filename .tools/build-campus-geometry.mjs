import fs from 'node:fs';
import {fromSource,unproject} from '../src/data/geodesy.ts';
const csv=fs.readFileSync('artifacts/reference/coordinates.csv','utf8').trim().split(/\r?\n/).map((line,i)=>{const [name,...values]=line.split(',');const coords=values.filter(Boolean).map(Number);const raw=[];for(let j=0;j<coords.length;j+=2)raw.push([coords[j],coords[j+1]]);const ring=raw.map(fromSource);return {id:'source-'+i,name,ring,raw};});
const mean=ring=>ring.reduce((s,p)=>[s[0]+p[0]/ring.length,s[1]+p[1]/ring.length],[0,0]);
const source=name=>csv.find(s=>s.name===name);
// Registration points read from the December 2025 campus map, in source pixels.
// The graphic is a schematic map: registration is not a surveying accuracy claim.
const controls=[{pixel:[5100,8870],point:mean(source('大礼堂').ring)},{pixel:[5060,10095],point:mean(source('二校门').ring)},{pixel:[6700,8500],point:mean(source('人文社科图书馆').ring)}];
function solve(a,b){a=a.map((r,i)=>[...r,b[i]]);for(let i=0;i<3;i++){const k=a[i][i];for(let j=i;j<4;j++)a[i][j]/=k;for(let r=0;r<3;r++)if(r!==i){const t=a[r][i];for(let j=i;j<4;j++)a[r][j]-=t*a[i][j];}}return a.map(r=>r[3]);}
const m=controls.map(c=>[...c.pixel,1]),cx=solve(m,controls.map(c=>c.point[0])),cz=solve(m,controls.map(c=>c.point[1]));
const mapPoint=([x,y])=>[cx[0]*x+cx[1]*y+cx[2],cz[0]*x+cz[1]*y+cz[2]].map(v=>Math.round(v*10)/10);
const trace=JSON.parse(fs.readFileSync('artifacts/reference/traced-map.json','utf8'));
const area=ring=>Math.abs(ring.reduce((s,a,i)=>{const b=ring[(i+1)%ring.length];return s+a[0]*b[1]-b[0]*a[1];},0)/2);
const traced=trace.filter(s=>s.kind<4).map((s,i)=>({id:'map-'+i,position:mapPoint(s.center),footprint:s.ring.map(mapPoint),size:[0,s.kind===2?10:s.kind===3?24:18,0],style:s.kind===2?'residential':s.kind===3?'dorm':'modern',source:'official-map-2025',heightStatus:'unverified'})).filter(s=>area(s.footprint)>45&&area(s.footprint)<30000);
const water=trace.filter(s=>s.kind===4&&area(s.ring.map(mapPoint))>100).map((s,i)=>({id:'map-water-'+i,kind:'water',points:s.ring.map(mapPoint)}));
for(const s of traced){const xs=s.footprint.map(p=>p[0]),zs=s.footprint.map(p=>p[1]);s.size[0]=Math.max(...xs)-Math.min(...xs);s.size[2]=Math.max(...zs)-Math.min(...zs);}
const filtered=traced.filter(s=>area(s.footprint)/(s.size[0]*s.size[2])>.2);
const paths=[['清华路',18,[[1750,10680],[2900,10680],[4100,10285],[6800,10200],[9630,10200]]],['学堂路',14,[[6320,5980],[6320,10200],[6320,13100],[5900,13400],[5900,14400]]],['新民路',14,[[7280,5990],[7280,10200],[7860,10200],[7860,14300]]],['紫荆路',14,[[3080,6520],[6130,6520],[6100,5990],[9540,5990]]],['校河东岸',7,[[4840,8530],[4770,9620],[4660,10180]]],['新民路北段',12,[[7280,4080],[7280,5990]]],['照澜院路',9,[[4690,10180],[4690,12300],[5480,12300]]],['西大操场东侧',8,[[4430,6650],[4430,8450],[5100,8450],[5100,8660]]],['近春园路',8,[[2820,8480],[2820,10700]]],['工字厅南路',7,[[3120,9470],[4890,9470],[5800,9470],[6040,9750]]],['大礼堂南路',7,[[4720,9070],[5480,9070]]],['紫荆公寓东路',9,[[8400,4110],[9350,5960],[9560,14300]]],['北部生活区',10,[[4460,4300],[4460,6470]]],['西北门路',9,[[3080,6520],[3950,6520],[3950,8400]]],['东大操场南路',8,[[6340,8250],[9480,8250]]],['荷塘北侧',6,[[2820,8490],[6200,8490]]],['东南门路',12,[[7860,12940],[9440,12940]]]];
const roads=paths.map(([name,width,points],i)=>({id:'map-road-'+i,name,width,major:i<4,points:points.map(mapPoint),source:'official-map-2025'}));
const outlines=csv.map(s=>({id:s.id,name:s.name,position:mean(s.ring).map(v=>Math.round(v*10)/10),footprint:s.ring.map(p=>p.map(v=>Math.round(v*10)/10)),coordinates:unproject(mean(s.ring))}));
const result={origin:[116.3215,40.002],sourceUrl:'https://github.com/lizy14/Tsinghua-Coordinates',sourceYear:2014,license:'WTFPL',coordinateNote:'原始坐标按 BD-09 解释，经两处高德 POI 交叉对照；图形注册不等同于测绘精度。',controls,buildings:filtered,outlines,water,roads,mapProjection:{x:cx,z:cz}};
fs.writeFileSync('src/data/campus-geometry.json',JSON.stringify(result));console.log('Map buildings',traced.length,'source outlines',outlines.length,'water',water.length);
