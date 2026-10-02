import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';

const $=s=>document.querySelector(s);
const scene=new THREE.Scene();scene.background=new THREE.Color('#e7ebe4');
scene.fog=new THREE.Fog('#e7ebe4',650,1300);
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch(error){fail('此瀏覽器無法啟動 WebGL。請使用支援 3D 圖像的瀏覽器。');throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.22;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
$('#viewport').appendChild(renderer.domElement);renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','拖曳旋轉；滾輪縮放；右鍵平移。亦可使用方向鍵平移，R 返回起始視角。');
const camera=new THREE.PerspectiveCamera(39,innerWidth/innerHeight,.4,1800);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=20;controls.maxDistance=850;controls.maxPolarAngle=Math.PI*.485;controls.listenToKeyEvents(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xe7f0ff,0x8b8d71,2.0));
const sun=new THREE.DirectionalLight(0xfff1d9,3.1);sun.position.set(-150,260,100);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-160,right:160,top:180,bottom:-160,near:1,far:650});sun.shadow.bias=-.0003;sun.shadow.normalBias=.25;scene.add(sun);
const base=new THREE.Mesh(new THREE.CylinderGeometry(200,200,2,128),new THREE.MeshStandardMaterial({color:0xc9d0be,roughness:1}));base.position.y=-8;base.receiveShadow=true;scene.add(base);
const groups={structure:new THREE.Group(),context:new THREE.Group(),trees:new THREE.Group(),terrain:new THREE.Group()};Object.values(groups).forEach(g=>scene.add(g));
const draco=new DRACOLoader();draco.setDecoderPath('./vendor/three/addons/libs/draco/gltf/');draco.setWorkerLimit(2);
const loader=new GLTFLoader();loader.setDRACOLoader(draco);
const lods=[];let loaded=0,meta,ready=false;const stages=6;
function progress(text){$('#load-message').textContent=text;$('#progress').style.width=`${++loaded/stages*100}%`;}
function prepare(root,shadows=true){root.traverse(o=>{if(o.isMesh){o.castShadow=shadows;o.receiveShadow=true;const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){m.side=THREE.DoubleSide;if(m.map)m.map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());}}});return root;}
async function loadModel(name,group){const result=await loader.loadAsync(`./assets/${name}.glb`);group.add(prepare(result.scene,name==='structure'));return result.scene;}
function fail(text){$('#loader').classList.remove('done');$('#load-message').textContent=text;$('#status').textContent='場景未能完整載入';if(!$('#retry')){const b=document.createElement('button');b.id='retry';b.className='error-retry';b.textContent='重新載入';b.onclick=()=>location.reload();$('.loader-inner').appendChild(b);}}
const views={site:{position:[-155,145,195],target:[0,49,0]},area:{position:[-285,320,390],target:[0,25,0]},top:{position:[0,530,.01],target:[0,0,0]}};
let flight=null;
function view(name,animate=true){const v=views[name];const pos=new THREE.Vector3(...v.position);if(innerWidth<600)pos.multiplyScalar(1.25);const target=new THREE.Vector3(...v.target);if(name==='site'&&innerWidth<600)target.y=50;
 if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)flight={start:performance.now(),from:camera.position.clone(),to:pos,fromTarget:controls.target.clone(),toTarget:target};else{camera.position.copy(pos);controls.target.copy(target);controls.update();}
 document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));
}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));$('#reset-view').onclick=()=>view('site');
for(const name of ['structure','context','trees'])$(`#${name}-toggle`).onchange=e=>{groups[name].visible=e.target.checked;};
controls.addEventListener('start',()=>flight=null);
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='r'&&!['INPUT','TEXTAREA'].includes(e.target.tagName))view('site');});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('3D 圖像連線已中斷。請重新載入場景。');});
view('site',false);
async function init(){
 const response=await fetch('./assets/scene.json');if(!response.ok)throw new Error('scene.json');meta=await response.json();
 await loadModel('terrain',groups.terrain);progress('現有地形已就緒');
 await loadModel('structure',groups.structure);progress('重建結構已就緒');
 await loadModel('context',groups.context);progress('周邊建築已就緒');
 const footprint=meta.site.footprint.map(([x,y])=>new THREE.Vector3(x,4,-y));footprint.push(footprint[0].clone());scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(footprint),new THREE.LineBasicMaterial({color:0xc2984a,depthTest:false,transparent:true,opacity:.8})));
 const trees={};for(const level of ['low','medium','high']){trees[level]=prepare((await loader.loadAsync(`./assets/tree-${level}.glb`)).scene,level==='high');if(level!=='high')trees[level].traverse(o=>{if(o.isMesh){const convert=m=>new THREE.MeshBasicMaterial({map:m.map,color:new THREE.Color(2.6,3.0,2.2),alphaTest:.45,side:THREE.DoubleSide});o.material=Array.isArray(o.material)?o.material.map(convert):convert(o.material);o.receiveShadow=false;}});progress(`樹木 ${level==='high'?'近景':level==='medium'?'中景':'遠景'}已就緒`);}
 const treeResponse=await fetch('./assets/tree-positions.json');if(!treeResponse.ok)throw new Error('tree positions');const positions=await treeResponse.json();
 const box=new THREE.Box3().setFromObject(trees.high);const height=box.max.y-box.min.y;
 for(const p of positions){const lod=new THREE.LOD();const levels=p.near?[['high',0],['medium',330],['low',480]]:[['medium',0],['low',115]];
  for(const [level,distance] of levels){const asset=trees[level].clone(true);asset.position.y=-box.min.y;lod.addLevel(asset,distance,.12);}
  lod.position.set(p.x,p.z,-p.y);lod.scale.setScalar(p.height/height);lod.rotation.y=p.rotation||0;lod.userData.near=p.near;groups.trees.add(lod);lods.push(lod);
 }
 $('#loader').classList.add('done');ready=true;$('#status').textContent=`200 m 場景 · ${meta.buildings.length} 棟周邊建築 · ${positions.length} 棵樹`;
 renderer.domElement.dataset.ready='true';
}
init().catch(error=>{console.error(error);fail('模型載入未完成。請確認網絡連線，或使用提供的本機啟動方式開啟網站。');});
let last=0;function tick(t){requestAnimationFrame(tick);if(document.hidden)return;if(t-last<1000/45)return;last=t;
 if(flight){const k=Math.min((t-flight.start)/1000,1),s=k*k*(3-2*k);camera.position.lerpVectors(flight.from,flight.to,s);controls.target.lerpVectors(flight.fromTarget,flight.toTarget,s);if(k===1)flight=null;}
 controls.update();for(const lod of lods)lod.update(camera);$('#compass-arrow').style.transform=`rotate(${THREE.MathUtils.radToDeg(controls.getAzimuthalAngle())}deg)`;renderer.render(scene,camera);
 if(ready)renderer.domElement.dataset.triangles=String(renderer.info.render.triangles);
}requestAnimationFrame(tick);
