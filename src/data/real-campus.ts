import geometry from './campus-geometry.json' with {type:'json'};
import photoCatalog from './photos.json' with {type:'json'};
import {placeNotes} from './place-notes.ts';
import {gcjToWgs,project,unproject} from './geodesy.ts';
import type {Landmark,Building,Landscape,Road,Point,Photo} from '../types.ts';
const map='https://www.tsinghua.edu.cn/zjqh/xyfg/xydt.htm';
const scenic='https://www.tsinghua.edu.cn/zjqh/xyfg/xyjg.htm';
const ring=(p:number[][])=>p as Point[];
const outlines=geometry.outlines.map(o=>({...o,position:o.position as Point,footprint:ring(o.footprint)}));
export const mapPoint=([x,y]:Point):Point=>[geometry.mapProjection.x[0]*x+geometry.mapProjection.x[1]*y+geometry.mapProjection.x[2],geometry.mapProjection.z[0]*x+geometry.mapProjection.z[1]*y+geometry.mapProjection.z[2]];
function bounds(rings:Point[][]){const p=rings.flat(),xs=p.map(p=>p[0]),zs=p.map(p=>p[1]);return {center:[(Math.min(...xs)+Math.max(...xs))/2,(Math.min(...zs)+Math.max(...zs))/2] as Point,w:Math.max(...xs)-Math.min(...xs),d:Math.max(...zs)-Math.min(...zs)};}
function contains(p:Point,r:Point[]){let v=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const a=r[i],b=r[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])v=!v;}return v;}
const matches:Record<string,string[]>={gate:['二校门'],dome:['大礼堂'],school:['清华学堂'],courtyard:['工字厅'],water:['水木清华'],science:['科学馆'],library:['图书馆老馆','图书馆新馆（逸夫馆）','图书馆北楼'],gym:['西区体育馆'],observatory:['气象台'],main:['西主楼','中央主楼','东主楼','东配楼','西配楼','主楼后厅 计算机开放实验室'],six:['第六教学楼A区','第六教学楼B区','第六教学楼C区'],humanities:['人文社科图书馆'],museum:['艺术博物馆'],theater:['新清华学堂'],mingli:['法学院明理楼'],mechanical:['机械工程馆'],art:['美术学院大楼'],guestJia:['甲所'],guestBing:['丙所'],guyu:['古月堂'],scienceFaculty:['物理系'],teach1:['第一教室楼'],teach2:['第二教室楼'],teach3:['第三教室楼一段、二段','第三教室楼三段'],teach4:['第四教室楼（真维斯楼）'],teach5:['第五教室楼（郑年锦楼）'],zijingDining:['紫荆园'],taoli:['桃李园'],zhilan:['芝兰园餐厅'],yushu:['玉树园餐厅'],qingfen:['南区学生食堂'],tingtao:['听涛园'],dingxiang:['丁香园'],guanchou:['观畴园 清青餐厅 学生会 研究生会'],wenxin:['闻馨园（清青快餐）'],heDining:['荷园餐厅 工会俱乐部'],xichun:['强斋 静斋 熙春园餐厅'],comprehensive:['综合体育馆'],swimming:['陈明游泳馆'],shooting:['射击馆'],airGym:['气膜体育馆'],eastGym:['东区体育馆'],westField:['西大操场'],eastField:['东大操场'],zijingField:['紫荆操场'],baseball:['棒垒场'],eastTennis:['东网球场'],westTennis:['西网球场'],redCourt:['红场（篮球场）'],sandVolley:['沙滩排球场'],skating:['轮滑场']};
type Registration=[string,string,Landmark['category'],string,number,Point?,string?];
const registrations:Registration[]=[
 ['art','美术学院','modern','学院教学、创作与展览空间',26],['guestJia','甲所','heritage','庭院、坡顶与园林相接',9],['guestBing','丙所','heritage','清华园中的接待建筑与园林',9],['guyu','古月堂','heritage','工字厅西侧的传统院落',8],['scienceFaculty','理学院楼','modern','理科教学与研究建筑群',23,[5440,7560]],['wenting','闻亭钟声','heritage','亭、钟与校园记忆',7,[4990,9450],'pavilion'],['campusRoad','清华路','heritage','从二校门走向校园的新旧空间',1,[5250,10250],'marker'],
 ['teach1','第一教学楼','teaching','一教 · 老校区课堂',12],['teach2','第二教学楼','teaching','二教 · 学堂旁的教学空间',13],['teach3','第三教学楼','teaching','三教 · 一、二、三段组合',16],['teach4','第四教学楼','teaching','四教 · 真维斯楼',18],['teach5','第五教学楼','teaching','五教 · 郑年锦楼',18],
 ['zijingDining','紫荆园','dining','紫荆生活区食堂',18],['taoli','桃李园','dining','学生生活区餐饮空间',18],['zhilan','芝兰园','dining','东北生活区餐饮空间',12],['yushu','玉树园','dining','国际学生生活区餐厅',12],['qingfen','清芬园','dining','教学区与宿舍区之间的食堂',16],['tingtao','听涛园','dining','学生宿舍区的日常餐饮',10],['dingxiang','丁香园','dining','校园中的餐饮与公共空间',10],['guanchou','观畴园','dining','学生宿舍区食堂',18],['wenxin','闻馨园／清青快餐','dining','运动场与生活区旁的餐厅',8],['heDining','荷园餐厅','dining','西部校园餐饮空间',9],['xichun','熙春园餐厅','dining','传统院落中的餐饮空间',8],['lanDining','澜园餐厅','dining','照澜院生活区餐厅',9,[4990,11530]],['nanDining','南园餐厅','dining','南部教工住宅区餐厅',9,[5750,13200]],['yuDining','寓园餐厅','dining','西部住宅生活服务',9,[2450,11400]],['beiDining','北园餐厅','dining','北部教工生活区餐厅',9,[3600,4800]],['jiaDining','家园餐厅','dining','附小附近的生活服务',9,[4030,13330]],['rongDining','融园','dining','南部餐饮服务',12,[8450,14600]],
 ['comprehensive','综合体育馆','sports','室内运动与比赛空间',23],['swimming','陈明游泳馆','sports','校园游泳训练与活动',15],['shooting','射击馆','sports','专项运动设施',8],['airGym','气膜体育馆','sports','轻型膜结构运动空间',15],['eastGym','东体育馆','sports','东部校园运动设施',16],['northGym','北体育馆','sports','北部运动空间',15,[5940,5250]],['westField','西大操场','sports','跑道、草坪与田径活动',1,undefined,'field'],['eastField','东大操场','sports','校园主要田径与足球场地',1,undefined,'field'],['zijingField','紫荆操场','sports','学生生活区的运动场地',1,undefined,'field'],['southField','南操场','sports','南部校园运动空间',1,[5340,12980],'field'],['baseball','棒垒球场','sports','校园专项运动场地',1,undefined,'court'],['eastTennis','东网球场','sports','东部网球训练场地',1,undefined,'court'],['westTennis','西网球场','sports','校园网球场地',1,undefined,'court'],['redCourt','红场篮球场','sports','宿舍区旁的露天篮球场',1,undefined,'court'],['sandVolley','沙滩排球场','sports','沙地运动设施',1,undefined,'court'],['skating','轮滑场','sports','校园轮滑活动空间',1,undefined,'court']
];
export function calibrateCampus(base:Landmark[]){
 const list=base;
 matches.scienceFaculty=['理科楼（蒙民伟理科楼）'];
 // The old CSV associates Wenxin with a different dining building. Do not reuse it.
 matches.wenxin=[];
 for(const [id,name,category,subtitle,h,pixel,model] of registrations)list.push({id,name,category,subtitle,position:pixel?mapPoint(pixel):[0,0],size:[35,h,25],model:model??'footprint',style:category==='heritage'?'传统院落 · 灰瓦坡顶':category==='sports'?'运动设施 · 场地与入口':'校园公共建筑 · 立面与入口',description:`${name}是官方校园地图登记的${category==='dining'?'餐饮服务地点':category==='teaching'?'教学建筑':category==='sports'?'运动设施':'校园风物'}。${subtitle}。可切换近景，比较地图轮廓与实拍资料；建筑高度及细部仍在逐项核实。`,facts:['地点名称以 2025 年 12 月官方地图为依据','模型依据公开轮廓组织，未核实高度不作测量值使用'],sources:[{title:'清华官方校园地图',url:map},...(category==='heritage'||category==='modern'?[{title:'清华官方校园景观',url:scenic}]:[])]});
 const fieldIds=new Set(['westField','eastField','zijingField','southField']);
 const sourceIds=new Set<string>();
 for(const l of list){
  const found=(matches[l.id]??[]).flatMap(name=>outlines.filter(o=>o.name===name));
  if(found.length){const b=bounds(found.map(o=>o.footprint));l.position=b.center;l.size=[b.w,l.size[1],b.d];l.footprints=found.map(o=>o.footprint);found.forEach(o=>sourceIds.add(o.id));}
  if(l.id==='wenxin'){const guanchou=list.find(p=>p.id==='guanchou')!;l.position=[guanchou.position[0]-34,guanchou.position[1]+27];l.size=[25,8,22];}
  l.focus=[l.category==='heritage'||l.category==='modern'?'scenic':l.category];
  if(['technology','law','dorm','six','comprehensive'].includes(l.id))l.focus.push('scenic');
  if(l.id==='six')l.focus.push('teaching');
  if(l.id==='gym')l.focus.push('sports');
  l.aliases=[l.subtitle,...(matches[l.id]??[])];
  if(l.id.startsWith('teach'))l.aliases.push(['一教','二教','三教','四教','五教'][Number(l.id.slice(-1))-1]);
  if(l.id==='six')l.aliases.push('六教');
  if(l.id==='law'){l.aliases.push('法图','法律图书馆','胡宝星法律图书馆','明法楼');l.sources.push({title:'法学院沿革与法律图书馆',url:'https://www.law.tsinghua.edu.cn/xygk/xyjj.htm'});}
  if(l.id==='qingfen'){l.name='清芬园／清青快餐';l.aliases.push('清青快餐');l.description='清芬园位于学生生活区与教学区之间。现有食堂在原址重建，清青快餐位于地下一层，两者共用同一建筑，因此合并登记。这里展示建筑整体轮廓和入口，不将地下餐厅另造一栋楼。';l.sources.push({title:'饮食服务中心 · 特色餐厅',url:'https://www.tsinghua.edu.cn/ysfwzx/info/1004/1009.htm'});}
  if(l.id==='wenxin'){l.name='闻馨园';l.aliases=['闻馨园'];l.description='闻馨园位于观畴园西南侧，是学生生活区的小尺度餐饮空间。部分早期资料将清青快餐与这里一并表述；新版按饮食服务中心资料区分当前地点，清青快餐合并在清芬园建筑中。';l.sources.push({title:'饮食服务中心 · 学生食堂',url:'https://www.tsinghua.edu.cn/ysfwzx/info/1004/1007.htm'});}
  l.photos=(photoCatalog as Record<string,Photo[]>)[l.id]??[];
  const notes=placeNotes[l.id];if(notes){l.description=notes.description;l.facts=notes.facts;if(notes.style)l.style=notes.style;}
  l.geo={coordinates:unproject(l.position),source:found.length?'公开建筑轮廓（2014）＋官方地图（2025）':'官方地图（2025）图形注册',date:'2026-10-04',status:found.length?'轮廓已对照 · 现状待复核':'位置待进一步校准',elevation:'高程与建筑高度待核实'};
 }
 const poi=(id:string,gcj:Point,size?:Landmark['size'])=>{const l=list.find(l=>l.id===id)!;l.position=project(gcjToWgs(gcj));if(size)l.size=size;l.geo!.coordinates=unproject(l.position);l.geo!.source='高德公开 POI（GCJ-02）转换＋官方地图';l.geo!.status='位置交叉对照 · 轮廓待校准';};
 poi('technology',[116.329747,39.996865],[130,38,95]);poi('primary',[116.323053,39.995666],[125,12,110]);poi('garden',[116.319846,40.002049],[150,8,150]);
 const law=list.find(l=>l.id==='law')!;law.position=mapPoint([6500,11120]);law.size=[55,25,65];law.geo!.coordinates=unproject(law.position);
 const override:Record<string,Point>={highschool:[3200,5140],dorm:[7300,5050],houses:[4700,10750],neighborhood:[3480,5840]};
 for(const [id,p] of Object.entries(override)){const l=list.find(l=>l.id===id)!;l.position=mapPoint(p);l.geo!.coordinates=unproject(l.position);l.model='marker';}
 list.find(l=>l.id==='dome')!.size[1]=24;list.find(l=>l.id==='gate')!.size[1]=10;list.find(l=>l.id==='mechanical')!.size[1]=15;
 const wenting=list.find(l=>l.id==='wenting')!;wenting.position=mapPoint([4830,8850]);wenting.size=[10,7,10];wenting.geo!.coordinates=unproject(wenting.position);
 const main=list.find(l=>l.id==='main')!;main.size[1]=40;main.geo!.elevation='地面高程待核实 · 中央主楼标高 40 米（官方景观介绍）';
 const detailed=new Set(['main','library','six','school','science','mechanical','mingli','humanities','museum','theater','gym']);
 for(const l of list)if(detailed.has(l.id)&&l.footprints)l.model='footprint';
 const mappedIds=new Set<string>();
 for(const l of list.filter(l=>!l.footprints&&!['marker','garden','pavilion','field','court'].includes(l.model))){
  const candidates=geometry.buildings.filter(b=>contains(l.position,ring(b.footprint))||Math.hypot(b.position[0]-l.position[0],b.position[1]-l.position[1])<30);
  const match=candidates.sort((a,b)=>Math.hypot(a.position[0]-l.position[0],a.position[1]-l.position[1])-Math.hypot(b.position[0]-l.position[0],b.position[1]-l.position[1]))[0];
  if(match&&!mappedIds.has(match.id)){l.footprints=[ring(match.footprint)];const b=bounds(l.footprints);l.position=b.center;l.size=[b.w,l.size[1],b.d];l.geo!.coordinates=unproject(l.position);mappedIds.add(match.id);l.geo!.source='官方地图（2025）图形注册 · 轮廓待现场复核';if(!['law','technology','primary'].includes(l.id))l.model='footprint';}
 }
 const context:Building[]=outlines.filter(o=>!sourceIds.has(o.id)&&!/(场|园|体育馆)/.test(o.name)).map(o=>{const b=bounds([o.footprint]);return {id:o.id,position:b.center,size:[b.w,/宿舍|紫荆/.test(o.name)?24:/家属|斋|院/.test(o.name)?9:18,b.d],footprint:o.footprint,style:/宿舍|紫荆/.test(o.name)?'dorm':/家属/.test(o.name)?'residential':'modern'};});
 const existing=[...context.map(b=>b.footprint!),...list.flatMap(l=>l.footprints??[])];
 for(const b of geometry.buildings){const p=b.position as Point;if(mappedIds.has(b.id)||p[1]>1050||existing.some(r=>contains(p,r)))continue;const bb=bounds([ring(b.footprint)]);if(bb.w>180||bb.d>180)continue;context.push({id:b.id,position:bb.center,size:[bb.w,b.size[1],bb.d],style:b.style as Building['style'],footprint:ring(b.footprint)});}
 const terrain:Landscape[]=geometry.water.map(w=>({id:w.id,kind:'water',points:ring(w.points)}));
 for(const l of list.filter(l=>fieldIds.has(l.id)))if(l.footprints)terrain.push({id:l.id,kind:'sports',points:l.footprints[0]});
 // Roads and water are registered from the official diagram, never randomized.
 return {landmarks:list,buildings:context,landscapes:terrain,roads:geometry.roads.map(r=>({...r,points:ring(r.points)})) as Road[]};
}
export const terrainReview=[{name:'近春园岛、桥与池岸',status:'缺少地面实测高程；保持待核实'},{name:'甲所、丙所及周边园林',status:'需核对局部台地与建筑基底高差'},{name:'校园南北与运动场地',status:'需可靠地面模型，不能用包含树木和屋顶的 DSM 替代'}];
