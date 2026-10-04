import {test} from 'node:test';
import assert from 'node:assert/strict';
import {landmarks,tours,buildings,roads,landscapes} from '../src/data/campus.ts';
import {createTrees,inside,distanceToSegment} from '../src/scene/geometry.ts';
test('重点清单扩展、稳定 ID 不重复且四条导览可达',()=>{
 assert.ok(landmarks.length>=69);assert.equal(new Set(landmarks.map(l=>l.id)).size,landmarks.length);assert.equal(tours.length,4);
 for(const l of landmarks){assert.ok(l.description&&l.facts.length&&l.sources.length);assert.ok([...l.position,...l.size].every(Number.isFinite));assert.ok(l.sources.every(s=>new URL(s.url).protocol==='https:'));}
 for(const route of tours)assert.ok(route.stops.every(id=>landmarks.some(l=>l.id===id)));
});
test('六组教学楼及官方风物清单登记完整',()=>{
 for(const id of ['teach1','teach2','teach3','teach4','teach5','six','art','guestJia','guestBing','guyu','scienceFaculty','wenting','campusRoad','comprehensive'])assert.ok(landmarks.some(l=>l.id===id));
 assert.ok(landmarks.find(l=>l.id==='main')!.footprints!.length>=3);
 assert.equal(landmarks.find(l=>l.id==='six')!.footprints!.length,3);
 assert.equal(landmarks.find(l=>l.id==='library')!.footprints!.length,3);
});
test('来源轮廓替代随机楼体，地理与高程缺口明确记录',()=>{
 assert.ok(buildings.length>200);assert.ok(buildings.every(b=>b.footprint&&b.footprint.length>=3));assert.ok(buildings.every(b=>!b.id.startsWith('context-')));
 for(const l of landmarks){assert.ok(l.geo?.source);assert.ok(l.geo?.elevation.includes('待核实'));assert.ok(l.geo!.coordinates.every(Number.isFinite));}
 const primary=landmarks.find(l=>l.id==='primary')!,gate=landmarks.find(l=>l.id==='gate')!,mingli=landmarks.find(l=>l.id==='mingli')!;
 assert.ok(primary.position[1]>gate.position[1]);assert.ok(mingli.position[1]>gate.position[1]);
});
test('实际树木布景可确定性恢复，并避开池塘与道路',()=>{
 const a=createTrees(1911,buildings,landmarks,landscapes,roads),b=createTrees(1911,buildings,landmarks,landscapes,roads),c=createTrees(2026,buildings,landmarks,landscapes,roads);
 assert.equal(a.length,1750);assert.deepEqual(a,b);assert.notDeepEqual(a,c);
 for(const p of a){assert.ok(!landscapes.some(l=>['water','sports'].includes(l.kind)&&inside([p.x,p.z],l.points)));assert.ok(!roads.some(r=>r.points.slice(1).some((q,i)=>distanceToSegment([p.x,p.z],r.points[i],q)<r.width/2+3)));}
});
test('学校创办年份不会被当作现存楼宇年代',()=>{for(const id of ['primary','highschool','dorm','neighborhood'])assert.equal(landmarks.find(l=>l.id===id)!.built,undefined);});
