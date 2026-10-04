import {test} from 'node:test';
import assert from 'node:assert/strict';
import {landmarks,tours,buildings,roads,landscapes} from '../src/data/campus.ts';
import {createTrees,inside,distanceToSegment} from '../src/scene/geometry.ts';
test('24 处地点、四条导览均有完整资料且路线可达',()=>{
 assert.equal(landmarks.length,24);assert.equal(new Set(landmarks.map(l=>l.id)).size,24);assert.equal(tours.length,4);
 for(const l of landmarks){assert.ok(l.description&&l.facts.length&&l.sources.length);assert.ok([...l.position,...l.size].every(Number.isFinite));assert.ok(l.sources.every(s=>new URL(s.url).protocol==='https:'));}
 for(const route of tours)assert.ok(route.stops.every(id=>landmarks.some(l=>l.id===id)));
});
test('实际树木布景可确定性恢复，并避开池塘与道路',()=>{
 const a=createTrees(1911,buildings,landmarks,landscapes,roads),b=createTrees(1911,buildings,landmarks,landscapes,roads),c=createTrees(2026,buildings,landmarks,landscapes,roads);
 assert.equal(a.length,1750);assert.deepEqual(a,b);assert.notDeepEqual(a,c);
 for(const p of a){assert.ok(!landscapes.some(l=>['water','sports'].includes(l.kind)&&inside([p.x,p.z],l.points)));assert.ok(!roads.some(r=>r.points.slice(1).some((q,i)=>distanceToSegment([p.x,p.z],r.points[i],q)<r.width/2+3)));}
});
test('学校创办年份不会被当作现存楼宇年代',()=>{for(const id of ['primary','highschool','dorm','neighborhood'])assert.equal(landmarks.find(l=>l.id===id)!.built,undefined);});
