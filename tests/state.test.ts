import {test} from 'node:test';
import assert from 'node:assert/strict';
import {defaults,sanitizeState,encodeState,decodeState,seededRandom} from '../src/state.ts';
test('分享链接保留机位、时段、季节和所选建筑',()=>{const s={...defaults,season:'autumn' as const,selected:'law',time:18.5,camera:{position:[100,300,600] as [number,number,number],target:[0,0,0] as [number,number,number]}};assert.deepEqual(decodeState(encodeState(s)),s);});
test('损坏或未来版本的分享状态回退默认值',()=>{assert.deepEqual(decodeState('invalid'),defaults);assert.deepEqual(sanitizeState({version:99,season:'autumn'}),defaults);});
test('参数越界与非有限相机被安全处理',()=>{const s=sanitizeState({version:1,time:90,trees:-9,season:'alien',exposure:Infinity,camera:{position:[NaN,0,0],target:[0,0,0]}});assert.equal(s.time,24);assert.equal(s.trees,0);assert.equal(s.season,'spring');assert.equal(s.exposure,defaults.exposure);assert.equal(s.camera,undefined);});
test('相同种子恢复相同装饰序列，不同种子产生不同序列',()=>{const a=seededRandom(1911),b=seededRandom(1911),c=seededRandom(2025);const x=Array.from({length:20},a);assert.deepEqual(x,Array.from({length:20},b));assert.notDeepEqual(x,Array.from({length:20},c));});
