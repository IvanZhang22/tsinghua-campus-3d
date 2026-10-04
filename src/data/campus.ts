import type { Landmark, Building, Road, Landscape, District, TourRoute, Era, Point } from '../types';
const school='https://www.tsinghua.edu.cn';
const source=(path:string,title='清华大学 · 建筑与校园')=>({title,url:school+path});
type Entry=[string,string,string,Landmark['category'],number,number,number,number,number,string,number,string,string,string[],string];
const entries:Entry[]=[
 ['gate','二校门','走进清华园','heritage',-530,410,42,17,8,'gate',1909,'青砖白柱 · 三拱牌坊','二校门坐落于清华路，是清华园最熟悉的入口意象。青砖、白色柱体与三个拱门共同构成轻盈的牌坊轮廓。从早期学校正门到今天的校园地标，它见证了清华园的扩展与几代人的校园记忆。模型突出三拱开口、匾额和两侧柱体。',['始建于 1909 年','历史上曾毁坏，后重建','它与清华学堂、机械工程馆共同构成老校区入口景观'],'/info/1360/1397.htm'],
 ['dome','大礼堂','红砖与穹顶的校园中心','heritage',-480,100,82,40,86,'dome',1920,'红砖古典建筑 · 穹顶与柱廊','大礼堂以红砖墙体、圆形穹顶和白色柱廊成为清华校园的视觉中心。礼堂前的草坪将几座早期建筑串联起来，体现了早期校园开阔而有秩序的空间组织。此处模型强调穹顶、入口柱列、山花和主体的层次。',['早期“四大建筑”之一','官方场地资料记载 1920 年 3 月建成','建成时间与落成典礼时间应分别理解'],'/info/1360/1400.htm'],
 ['school','清华学堂','从学堂走向大学','heritage',-350,260,104,24,54,'school',1911,'德国古典风格 · 红砖坡顶','清华学堂是清华大学早期办学的重要建筑，位于工字厅东侧。红砖立面、坡屋顶、入口与窗列的节奏记录着早期校园的建筑语言。“学堂”既是一座建筑，也连接着 1911 年开学与清华后来发展的历史。',['清华学堂于 1911 年开学','位于工字厅东侧','模型以屋顶、门廊和红砖窗列表达特征'],'/info/1360/82496.htm'],
 ['courtyard','工字厅','清代园林的空间记忆','heritage',-680,205,97,10,75,'courtyard',1802,'清代院落 · 青瓦廊殿','工字厅保留着清代园林建筑的院落尺度。前后殿与连接空间形成“工”字关系，灰瓦、木构与围合的院落构成与红砖校园不同的风景。其具体年代在研究中有修订，本导览采用“清代园林建筑”的表述，并保留出处供进一步阅读。',['清代清华园的重要遗存','前后殿及连接空间形成“工”字关系','具体年代依据较新的考证，避免沿用过时说法'],'/info/1360/1401.htm'],
 ['water','水木清华','一池清水，一园林荫','heritage',-685,125,95,9,47,'water',1802,'园中园 · 亭廊水景','水木清华位于工字厅北侧，池水、林木、亭廊构成细致而安静的园中园。它与清华校园的名字和园林气质相互呼应。沙盘把池塘与亭廊作为景观组合表达，春季的花木和黄昏光影可在这里自由调节。',['位于工字厅北侧','以池塘、亭廊、林木组成园林空间','花木分布为程序化布景，非真实植株清点'],'/zjqh.htm'],
 ['garden','近春园 · 荷塘','荷塘月色的园林意境','heritage',-805,-90,190,10,155,'garden',1860,'荷塘小岛 · 曲桥与林木','近春园的荷塘、岛屿、长廊与林木提供了不同于校园轴线的游园体验。“荷塘月色”让这片景观成为许多人的文学记忆。模型通过池塘、岛屿与拱桥组织空间；夜晚可体验月色氛围，历史说明则区分园林沿革和后来修复。',['荷塘环抱小岛','近春园经历历史变迁与修复','当前形态不能直接等同于早期园林全貌'],'/info/1360/1403.htm'],
 ['science','科学馆','早期科学教育的场所','heritage',-585,150,74,22,40,'science',1919,'古典红砖 · 对称立面','科学馆在大礼堂西南，是早期“四大建筑”之一。它与礼堂、图书馆和体育馆一起，呈现清华早期校园的学习、科学、文化与体育生活。模型采用对称红砖体量、入口柱廊和简洁坡屋顶，强调建筑之间的空间关系。',['1919 年落成','墨菲设计','位于大礼堂西南'],'/zjqh.htm'],
 ['library','老图书馆及扩建馆','跨越百年的知识空间','heritage',-370,-50,115,25,83,'library',1919,'红砖古典 · 新旧馆接续','清华图书馆的建筑群是校园生长的直观记录。老馆及历次扩建在材料、体量和入口组织上形成延续，也呈现不同年代的设计语言。导览介绍一期、二期与后来扩建，沙盘用连接的多个体量表达这种接续关系。',['一期 1919 年，二期 1931 年','逸夫西馆 1991 年启用','李文正北馆 2016 年启用'],'/info/1360/1391.htm'],
 ['gym','西体育馆','体育也是校园传统','heritage',-740,360,100,19,42,'gym',1919,'红砖体育建筑 · 山墙与坡顶','西体育馆是清华早期“四大建筑”之一，建筑以实用的大空间与古典红砖外观结合。前馆与后馆分期建设，见证了校园体育设施的成长。导览关注建筑轮廓与清华体育传统，不把学校体育历史简化为一座建筑的建成年份。',['前馆 1916—1919 年建设','后馆 1931—1932 年建设','早期“四大建筑”之一'],'/info/1360/1404.htm'],
 ['observatory','天文台','小尺度的科学地标','heritage',-680,-310,22,24,22,'observatory',1931,'圆顶塔楼 · 科学设施','天文台的圆顶和塔身在林木间形成小而鲜明的地标。其前身为 1931 年建成的气象台，后来与天文教学研究相联系。模型强调圆形观测顶与竖向体量，适合从地面机位观察近景。',['前身为气象台','气象台于 1931 年夏建成','模型保留圆顶与塔身的辨识度'],'/info/1360/1393.htm'],
 ['main','主楼建筑群','东扩校园的新轴线','modern',430,380,260,48,96,'main',1966,'对称建筑群 · 中央与两翼','主楼不是一座孤立的塔楼，而是东、西、中三部分组成的建筑群。它体现了清华向东扩展后的校园轴线与公共空间。沙盘保留中央主体、两侧楼体与连接关系；历史阶段介绍分期建设及中央主楼的建设变化。',['西主楼 1956 年开工，东主楼 1957 年开工','中央主楼 1960 年开始施工','历史工程经历停工及调整'],'/info/1360/1408.htm'],
 ['six','第六教学楼','当代教学的日常','modern',205,205,110,29,70,'six',2003,'教学组团 · 庭院与连廊','第六教学楼位于主楼西北侧，属于当代校园的教学核心。建筑通过多个体量与公共空间组织课堂生活，与老校区的单体古典建筑形成区别。模型采用组团和连廊表达，不复原教室内部。',['2003 年竣工','位于主楼西北侧','表现当代教学楼的组团关系'],'/info/1360/1410.htm'],
 ['humanities','人文社科图书馆','阅读与建筑的相遇','modern',160,30,88,28,70,'humanities',2011,'当代建筑 · 几何与砖色','人文社科图书馆于 2011 年投入运行，由马里奥·博塔与中国建筑科学研究院联合设计。富于几何秩序的体量与立面让它区别于老图书馆。沙盘强调其立面节奏与独特几何，介绍文案提供设计背景和使用用途。',['2011 年投入运行','博塔与中国建筑科学研究院联合设计','平面形态具有钥匙般的组织特征'],'/info/1360/81966.htm'],
 ['museum','艺术博物馆','艺术进入校园','modern',860,140,115,26,70,'museum',2016,'现代公共建筑 · 横向体量','艺术博物馆位于校园东区，是清华当代公共文化空间的重要节点。横向体量、入口与立面节奏在校园中形成明确的公共建筑形象。导览介绍其艺术收藏与展览用途，建筑模型以体量和材料差异表达。',['位于校园东区','建筑面积约 3 万平方米','当代文化建筑的重要节点'],'/info/1360/81964.htm'],
 ['theater','新清华学堂','校园的文化舞台','modern',605,695,122,30,78,'theater',2011,'当代剧场 · 体量与入口','新清华学堂是百年校庆时期建成的重要文化设施，由李道增主持设计。它承接校园演出与文化活动，名称则与早期清华学堂形成历史呼应。沙盘以剧场主厅、前厅和入口空间表现建筑层次。',['百年校庆时期建成','李道增主持设计','与早期清华学堂分别介绍'],'/info/1360/1407.htm'],
 ['dorm','紫荆公寓区','校园北部的学生生活','life',390,-875,210,25,145,'dorm',2001,'学生公寓 · 徽派建筑语言','紫荆公寓区位于校园北部，是学生生活的重要区域。其建筑采用带有徽派语言的外观，宿舍组团、院落和生活设施共同构成校园日常。这里与教职工家属区分开标注，避免把不同居住功能混为一谈。',['位于校园北部','建筑采用徽派语言','属于学生公寓，区别于家属区'],'/info/1360/1399.htm'],
 ['mingli','明理楼','法学院的教学与研究','department',420,-175,86,23,60,'mingli',1999,'学院建筑 · 端正庭院','明理楼是法学院的重要建筑，1999 年 12 月投入使用。早期法律图书馆曾设于其中，后来迁至新的廖凯原楼。此处介绍以学院发展与馆址变化为主线，模型保留对称楼体、入口和庭院关系。',['1999 年 12 月投入使用','历史上曾容纳法律图书馆','当前法律图书馆位于廖凯原楼'],'/info/1360/81965.htm'],
 ['law','廖凯原楼','胡宝星法律图书馆','department',210,-225,67,30,67,'law',2019,'方印体量 · 书脊式立面','廖凯原楼中的胡宝星法律图书馆于 2019 年 5 月迎来迁入。建筑以方印般的整体体量和竖立书籍般的立面形成鲜明识别。导览将它与明理楼串联，呈现法学教学、学术资源与建筑空间的变化。',['法律图书馆 2019 年 5 月迁入','方印式体量与书脊式立面','与明理楼的历史馆址明确区分'],'/info/1360/81965.htm'],
 ['mechanical','机械工程馆','能动学科的历史线索','department',-315,420,103,24,46,'mechanical',1935,'老机械馆 · 红砖与拱窗','机械工程馆位于二校门东侧，1935 年春落成，是清华工科发展的重要历史建筑。早期资料曾把这里称为热能系系馆。本导览把它作为能源与动力学科历史线索，不据旧资料断言它是今天唯一的能动系院馆。',['位于二校门东侧','1935 年春落成','历史归属与当前办公地址分别说明'],'/info/1661/55991.htm'],
 ['technology','李兆基科技大楼','当代能源与动力研究','department',865,765,170,43,100,'technology',2015,'现代科研建筑 · 中庭与玻璃','李兆基科技大楼位于校园东南，2015 年 10 月启用，是当代科研设施的代表。能源与动力工程系官网当前综合办公室地址在此楼 A141-2。导览从机械工程馆来到这里，讨论科研空间从早期工科校园到现代实验研究的演进。',['2015 年 10 月启用','能动系当前综合办公室：A141-2','从老机械馆到现代科研空间的导览终点'],'/info/1360/81967.htm'],
 ['highschool','清华附中本部','清华园北侧的附属学校','life',-770,-1110,175,23,95,'highschool',1952,'附校组团 · 教学与运动空间','清华附中本部位于清华大学北侧，属于本沙盘覆盖的附属教育区域。校园以教学楼、运动空间和绿化组团表现。这里使用本部名称，与上地学校及其他分校区分；学校历史和现有楼宇年代也分别理解。',['采用附中本部，不混入其他分校','本部位于清华大学北侧','教学楼体与操场采用概化表达'],'/info/2116/81137.htm'],
 ['primary','清华附小','清华园校区','life',-950,-610,105,15,100,'primary',2010,'青砖连廊 · 园林式校园','清华附小清华园校区以园林式的学习环境著称。青砖、连廊与六角形教室等设计元素，让它具有区别于普通校园楼群的亲切尺度。沙盘突出低层体量和围合空间，相关介绍以公开的学校资料与设计访谈为依据。',['清华园校区，不混入其他校区','建筑以青砖、连廊等元素组织空间','学校创办年份不等于现有楼宇年代'],'/info/1660/32896.htm'],
 ['houses','照澜院与西南住宅区','校园里生活的历史','life',-760,675,170,8,125,'houses',1921,'早期教工住宅 · 中西融合','照澜院及周边早期教工住宅体现了校园作为生活场所的一面。较低的院落、树木和小路与教学楼区形成区别。照澜院建于 1921 年，1946 年改为现名。沙盘使用概化院落体块，只讲述公开建筑与社区历史。',['照澜院 1921 年建成','1946 年改为现名','住宅区仅作概化示意，不呈现住户信息'],'/info/1942/76123.htm'],
 ['neighborhood','校内西北家属区','校园生活的延伸','life',-945,-875,150,16,150,'neighborhood',0,'教工住宅 · 概化组团','校内西北家属区以住宅组团、绿地与支路表达，补全清华园中的生活空间。本项目将主要精力投入重点公共建筑，住宅区域采用概化示意。范围不延伸至荷清苑、蓝旗营或双清苑等外围住宅小区。',['仅覆盖校内家属区','住宅体量与布局为概化示意','不包含荷清苑、蓝旗营、双清苑'],'/info/1183/94818.htm']
];
export const landmarks:Landmark[]=entries.map(([id,name,subtitle,category,x,z,w,h,d,model,built,style,description,facts,path])=>({id,name,subtitle,category,position:[x,z],size:[w,h,d],model,built:built||undefined,style,description,facts,sources:[source(path)]}));
// The present-day school and dormitory footprints have no verified construction year.
// School founding dates must not be used as the construction dates of current buildings.
for(const id of ['primary','highschool','dorm'])landmarks.find(l=>l.id===id)!.built=undefined;
landmarks.find(l=>l.id==='science')!.position=[-555,150];
landmarks.find(l=>l.id==='science')!.size=[64,22,40];
landmarks.find(l=>l.id==='museum')!.position=[860,150];
landmarks.find(l=>l.id==='courtyard')!.sources.push(source('/info/1182/86305.htm','工字厅年代的新考证'));
landmarks.find(l=>l.id==='technology')!.sources.push({title:'能源与动力工程系 · 当前联系地址',url:'https://www.te.tsinghua.edu.cn/lxwm/lxwm.htm'});
landmarks.find(l=>l.id==='mechanical')!.sources.push({title:'机械学科简史',url:'https://www.sme.tsinghua.edu.cn/info/1005/1062.htm'});
landmarks.find(l=>l.id==='mingli')!.sources.push({title:'法学院 · 明理楼历史资料',url:'https://www.law.tsinghua.edu.cn/info/1124/8843.htm'});
landmarks.find(l=>l.id==='dome')!.sources=[{title:'艺术教育中心 · 大礼堂',url:'https://www.arts.tsinghua.edu.cn/cgzy/dlt.htm'}];
landmarks.find(l=>l.id==='highschool')!.sources.push({title:'附中本部校园',url:'https://en.qhfz.edu.cn/About_Us/Our_Campus.htm'});
landmarks.find(l=>l.id==='primary')!.sources.push({title:'附小学校简介',url:'https://www.qhfx.edu.cn/html/schooldesc'});
export const eras:{id:Era;title:string;period:string;year:number;description:string}[]=[
 {id:'garden',title:'园林与学堂',period:'1909—1913',year:1913,description:'清代园林与早期学堂相遇。院落、池塘与红砖建筑呈现清华园的早期空间；未核实的普通楼淡化为当代参照。'},
 {id:'university',title:'大学成形',period:'1914—1937',year:1937,description:'四大建筑、图书馆扩建与机械工程馆勾勒大学校园。草坪、柱廊和红砖构成早期校园的建筑秩序。'},
 {id:'engineering',title:'东扩与工科',period:'1954—1966',year:1966,description:'主楼建筑群与新的校园轴线记录向东扩展和工科建设。画面为阶段性地标示意，不是某一年的完整复原。'},
 {id:'today',title:'当代清华园',period:'1990—2025',year:2025,description:'现代图书馆、文化设施、科研楼与学生公寓加入校园。新旧建筑共处，成为综合研究型大学的日常空间。'}
];
export const tours:TourRoute[]=[
 {id:'heritage',name:'园林与学堂',subtitle:'从二校门出发，遇见百年清华',color:'#927e5d',stops:['gate','school','courtyard','water','garden','dome','library']},
 {id:'energy',name:'能源与动力',subtitle:'机械工程馆 → 李兆基科技大楼',color:'#b2734b',stops:['mechanical','technology']},
 {id:'legal',name:'法学与书香',subtitle:'明理楼 → 廖凯原楼',color:'#660874',stops:['mingli','law']},
 {id:'life',name:'在清华生活',subtitle:'公寓、附校与树影下的家',color:'#588574',stops:['gym','dorm','highschool','primary','houses','neighborhood']}
];
export const roads:Road[]=[
 {id:'tsinghua',name:'清华路',major:true,width:18,points:[[-1120,450],[-760,450],[-530,450],[-100,450],[150,480],[1050,480]]},
 {id:'xuetang',name:'学堂路',major:true,width:17,points:[[85,-1150],[85,-580],[85,-300],[85,100],[85,480],[85,1080]]},
 {id:'xinmin',name:'新民路',major:true,width:13,points:[[-600,-1190],[-600,-550],[-600,-100],[-600,50],[-610,300],[-610,450],[-610,810]]},
 {id:'zijing',name:'紫荆路',major:true,width:16,points:[[-1080,-535],[-600,-535],[85,-535],[620,-535],[1100,-535]]},
 {id:'east',major:true,width:16,points:[[670,-1200],[670,-535],[670,40],[670,480],[670,900]]},
 {id:'north',width:12,points:[[-1020,-1020],[-600,-1020],[85,-1020],[1050,-1020]]},
 {id:'librarypath',width:10,points:[[-1040,-185],[-600,-185],[-370,-185],[85,-185],[85,-300],[620,-300]]},
 {id:'hallpath',width:8,points:[[-680,310],[-500,310],[-270,310],[-135,200],[85,200]]},
 {id:'eastwest',major:true,width:14,points:[[85,100],[340,100],[670,100],[1090,100]]},
 {id:'eastnorth',width:12,points:[[85,-650],[670,-650],[1050,-650]]},
 {id:'academic',width:12,points:[[340,-535],[340,-320],[340,100],[340,220]]},
 {id:'south',width:13,points:[[-1000,830],[-610,830],[85,830],[670,890],[1100,890]]},
 {id:'primarypath',width:9,points:[[-1090,-1080],[-1090,-535],[-1090,450]]},
 {id:'museum',width:10,points:[[780,-480],[780,100],[780,520],[780,890]]},
 {id:'northsouth',width:10,points:[[1090,-1140],[1090,-535],[1090,100],[1090,890]]},
 {id:'residential',width:8,points:[[-1020,550],[-1020,830],[-610,830]]}
];
const rectangle=(x:number,z:number,w:number,d:number):Point[]=>[[x-w/2,z-d/2],[x+w/2,z-d/2],[x+w/2,z+d/2],[x-w/2,z+d/2]];
export const landscapes:Landscape[]=[
 {id:'lotus',kind:'water',points:[[-930,-130],[-865,-200],[-750,-172],[-686,-85],[-737,12],[-860,0],[-944,-48]]},
 {id:'shuimu-pond',kind:'water',points:rectangle(-685,125,105,49)},
 {id:'hall-lawn',kind:'lawn',points:rectangle(-480,220,110,118)},
 {id:'main-lawn',kind:'lawn',points:rectangle(435,550,260,120)},
 {id:'west-sports',kind:'sports',points:rectangle(-875,270,140,180)},
 {id:'north-sports',kind:'sports',points:rectangle(-775,-935,155,125)},
 {id:'east-sports',kind:'sports',points:rectangle(470,-450,170,130)},
 {id:'zijing-garden',kind:'garden',points:rectangle(410,-740,350,75)},
 {id:'heritage-garden',kind:'garden',points:rectangle(-745,-380,250,185)},
 {id:'east-garden',kind:'lawn',points:rectangle(990,670,100,170)}
];
export const districts:District[]=[
 {id:'heritage',name:'历史校园',position:[-600,90],points:rectangle(-620,20,750,920)},
 {id:'academic',name:'教学与科研',position:[450,180],points:rectangle(480,160,1000,1080)},
 {id:'student',name:'紫荆学生生活区',position:[420,-830],points:rectangle(390,-860,1000,620)},
 {id:'residential-southwest',name:'西南家属区',position:[-800,760],points:rectangle(-840,680,490,340)},
 {id:'residential-northwest',name:'西北家属区',position:[-965,-785],points:rectangle(-970,-840,320,500)}
];
const body:Building[]=[];let next=0;let randomSeed=2026;const rng=()=>{randomSeed=(Math.imul(randomSeed,1664525)+1013904223)>>>0;return randomSeed/4294967296;};
const blocks=[{x0:-1000,x1:-160,z0:-470,z1:800,style:'brick' as const},{x0:150,x1:1040,z0:-470,z1:880,style:'modern' as const},{x0:160,x1:1040,z0:-1160,z1:-660,style:'dorm' as const},{x0:-1060,x1:-860,z0:-1020,z1:-700,style:'residential' as const}];
function segmentDistance(p:Point,a:Point,b:Point){const dx=b[0]-a[0],dz=b[1]-a[1],q=dx*dx+dz*dz,t=q?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dz)/q)):0;return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dz);}
for(const block of blocks)for(let x=block.x0;x<block.x1;x+=90)for(let z=block.z0;z<block.z1;z+=88){const w=28+rng()*25,d=20+rng()*20,h=block.style==='dorm'?24:12+rng()*19;const px=x+(rng()-.5)*13,pz=z+(rng()-.5)*13;
 if(landmarks.some(l=>Math.abs(px-l.position[0])<l.size[0]/2+w/2+22&&Math.abs(pz-l.position[1])<l.size[2]/2+d/2+22))continue;
 if(roads.some(r=>r.points.slice(1).some((b,i)=>segmentDistance([px,pz],r.points[i],b)<Math.max(w,d)/2+r.width/2+8)))continue;
 if(landscapes.some(l=>{const xs=l.points.map(p=>p[0]),zs=l.points.map(p=>p[1]);return px>Math.min(...xs)-w/2&&px<Math.max(...xs)+w/2&&pz>Math.min(...zs)-d/2&&pz<Math.max(...zs)+d/2;}))continue;
 body.push({id:`context-${next++}`,position:[px,pz],size:[w,h,d],style:block.style});
}
export const buildings=body;
export const mapMeta={source:'https://www.tsinghua.edu.cn/zjqh/xyfg/xydt.htm',updated:'2025 年 12 月',precision:'校园示意沙盘 · 重点地标按公开资料组织，普通楼与住宅概化；空间坐标为近似校准，非测绘数据。'};
