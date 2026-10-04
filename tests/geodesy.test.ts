import {test} from 'node:test';
import assert from 'node:assert/strict';
import {gcjToWgs,wgsToGcj,project,unproject,fromSource} from '../src/data/geodesy.ts';
test('坐标转换往返与本地米制投影保持一致',()=>{const p:[number,number]=[116.32443,40.003693],w=gcjToWgs(p),q=wgsToGcj(w);assert.ok(Math.hypot(p[0]-q[0],p[1]-q[1])<1e-8);const r=unproject(project(w));assert.ok(Math.hypot(w[0]-r[0],w[1]-r[1])<1e-10);});
test('公开轮廓的大礼堂中心与高德 POI 交叉对照',()=>{const raw:[number,number]=[116.3310106864325,40.009428115814],source=fromSource(raw),poi=project(gcjToWgs([116.324430,40.003693]));assert.ok(Math.hypot(source[0]-poi[0],source[1]-poi[1])<10);});
