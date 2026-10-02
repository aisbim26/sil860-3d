import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';

const $=s=>document.querySelector(s);
const viewport=$('#viewport');const dimensions=()=>({w:viewport.clientWidth,h:viewport.clientHeight});
const scene=new THREE.Scene();scene.background=new THREE.Color('#e7ebe4');
scene.fog=new THREE.Fog('#e7ebe4',650,1300);
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch(error){fail('WebGL is unavailable. Please use a browser with 3D graphics support.');throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(dimensions().w,dimensions().h);
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.22;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
$('#viewport').appendChild(renderer.domElement);renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','Drag to orbit; scroll to zoom; right-drag to pan. Arrow keys pan. R resets the view.');
const perspectiveCamera=new THREE.PerspectiveCamera(39,dimensions().w/dimensions().h,.4,1800);
const planCamera=new THREE.OrthographicCamera(-80*dimensions().w/dimensions().h,80*dimensions().w/dimensions().h,80,-80,.1,1800);let camera=perspectiveCamera;
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=20;controls.maxDistance=850;controls.maxPolarAngle=Math.PI*.485;controls.listenToKeyEvents(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xe7f0ff,0x8b8d71,2.0));
const sun=new THREE.DirectionalLight(0xfff1d9,3.1);sun.position.set(-150,260,100);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-160,right:160,top:180,bottom:-160,near:1,far:650});sun.shadow.bias=-.0003;sun.shadow.normalBias=.25;scene.add(sun);
const base=new THREE.Mesh(new THREE.CylinderGeometry(200,200,2,128),new THREE.MeshStandardMaterial({color:0xc9d0be,roughness:1}));base.position.y=-8;base.receiveShadow=true;scene.add(base);
const groups={structure:new THREE.Group(),context:new THREE.Group(),trees:new THREE.Group(),terrain:new THREE.Group(),roads:new THREE.Group(),trams:new THREE.Group(),cars:new THREE.Group()};Object.values(groups).forEach(g=>scene.add(g));
const draco=new DRACOLoader();draco.setDecoderPath('./vendor/three/addons/libs/draco/gltf/');draco.setWorkerLimit(2);
const loader=new GLTFLoader();loader.setDRACOLoader(draco);
const lods=[];let loaded=0,meta,ready=false;const stages=9;
function progress(text){$('#load-message').textContent=text;$('#progress').style.width=`${++loaded/stages*100}%`;}
function prepare(root,shadows=true){root.traverse(o=>{if(o.isMesh){o.castShadow=shadows;o.receiveShadow=true;const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){m.side=THREE.DoubleSide;if(m.map)m.map.anisotropy=renderer.capabilities.getMaxAnisotropy();}}});return root;}
async function loadModel(name,group){const result=await loader.loadAsync(`./assets/${name}.glb?v=5.0`);group.add(prepare(result.scene,name==='structure'));return result.scene;}
function fail(text){$('#loader').classList.remove('done');$('#load-message').textContent=text;$('#status').textContent='Scene could not be loaded';if(!$('#retry')){const b=document.createElement('button');b.id='retry';b.className='error-retry';b.textContent='Reload';b.onclick=()=>location.reload();$('.loader-inner').appendChild(b);}}
const views={site:{position:[-155,145,195],target:[0,49,0]},area:{position:[-285,320,390],target:[0,25,0]},top:{position:[-10,400,22.001],target:[-10,0,22]}};
let flight=null;
function view(name,animate=true){const next=name==='top'?planCamera:perspectiveCamera;if(camera!==next){camera=next;controls.object=camera;animate=false;flight=null;}controls.enableRotate=name!=='top';if(name==='top'){planCamera.zoom=1;planCamera.updateProjectionMatrix();}const v=views[name];const pos=new THREE.Vector3(...v.position);if(innerWidth<600)pos.multiplyScalar(1.05);const target=new THREE.Vector3(...v.target);if(name==='site'&&innerWidth<600)target.y=50;
 if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)flight={start:performance.now(),from:camera.position.clone(),to:pos,fromTarget:controls.target.clone(),toTarget:target};else{camera.position.copy(pos);controls.target.copy(target);controls.update();}
 document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));
}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));$('#reset-view').onclick=()=>view('site');
for(const name of ['structure','context','trees','roads','trams','cars'])$(`#${name}-toggle`).onchange=e=>{groups[name].visible=e.target.checked;};
controls.addEventListener('start',()=>flight=null);
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='r'&&!['INPUT','TEXTAREA'].includes(e.target.tagName))view('site');});
addEventListener('resize',()=>{perspectiveCamera.aspect=dimensions().w/dimensions().h;perspectiveCamera.updateProjectionMatrix();planCamera.left=-80*dimensions().w/dimensions().h;planCamera.right=80*dimensions().w/dimensions().h;planCamera.updateProjectionMatrix();renderer.setSize(dimensions().w,dimensions().h);});
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('The 3D graphics context was lost. Please reload.');});
new ResizeObserver(()=>{perspectiveCamera.aspect=dimensions().w/dimensions().h;perspectiveCamera.updateProjectionMatrix();planCamera.left=-80*dimensions().w/dimensions().h;planCamera.right=80*dimensions().w/dimensions().h;planCamera.updateProjectionMatrix();renderer.setSize(dimensions().w,dimensions().h);}).observe(viewport);
view('site',false);

let tramTime=0,tramPaused=matchMedia('(prefers-reduced-motion: reduce)').matches,routePoints=[],routeDistances=[],routeLength=0;
const tramVehicles=[];const pauseButton=$('#pause-trams');
function updatePauseButton(){pauseButton.textContent=tramPaused?'Resume traffic':'Pause traffic';pauseButton.setAttribute('aria-pressed',String(tramPaused));}
pauseButton.onclick=()=>{tramPaused=!tramPaused;updatePauseButton();};updatePauseButton();
async function loadTrams(){
 const response=await fetch('./assets/tram-route.json?v=5.0');if(!response.ok)throw new Error('Tram route');const route=await response.json();
 routePoints=route.points.map(p=>new THREE.Vector3(p.x,p.z,-p.y));routeDistances=[0];for(let i=1;i<routePoints.length;i++)routeDistances.push(routeDistances[i-1]+routePoints[i].distanceTo(routePoints[i-1]));routeLength=routeDistances.at(-1);
 const source=prepare((await loader.loadAsync('./assets/tram.glb?v=5.0')).scene,true);
 for(let i=0;i<3;i++){const vehicle=source.clone(true);vehicle.traverse(o=>{if(o.isMesh){o.material=o.material.clone();if(o.material.name==='Tram livery')o.material.color.set([0x28634a,0x963d34,0xb4944f][i]);}});groups.trams.add(vehicle);tramVehicles.push(vehicle);}animateTrams();
}
function routePoint(distance){
 distance=THREE.MathUtils.clamp(distance,0,routeLength);let lo=0,hi=routeDistances.length-1;while(lo<hi-1){const mid=(lo+hi)>>1;if(routeDistances[mid]<distance)lo=mid;else hi=mid;}const length=routeDistances[hi]-routeDistances[lo];return routePoints[lo].clone().lerp(routePoints[hi],length?(distance-routeDistances[lo])/length:0);
}
function animateTrams(){
 if(!routeLength)return;
 tramVehicles.forEach((vehicle,i)=>{const distance=(tramTime*2.4+routeLength*(.48+i/3))%routeLength;const point=routePoint(distance),front=routePoint(distance+1),back=routePoint(distance-1);const tangent=front.sub(back).normalize();vehicle.position.copy(point);vehicle.rotation.y=Math.atan2(-tangent.x,-tangent.z);vehicle.visible=distance>4.5&&distance<routeLength-4.5;});
 renderer.domElement.dataset.tramDistance=String(Math.round(tramTime*2.4*100)/100);
}


const movingCars=[];let carPoints=[],carDistances=[],carLength=0;
function carPoint(d){d=((d%carLength)+carLength)%carLength;let lo=0,hi=carDistances.length-1;while(lo<hi-1){const mid=(lo+hi)>>1;if(carDistances[mid]<d)lo=mid;else hi=mid;}return carPoints[lo].clone().lerp(carPoints[hi],(d-carDistances[lo])/(carDistances[hi]-carDistances[lo]));}
async function loadCars(){
 const response=await fetch('./assets/car-route.json?v=5.0');if(!response.ok)throw new Error('Car route');const route=await response.json();carPoints=route.points.map(p=>new THREE.Vector3(p.x,p.z,-p.y));carPoints.push(carPoints[0].clone());carDistances=[0];for(let i=1;i<carPoints.length;i++)carDistances.push(carDistances[i-1]+carPoints[i].distanceTo(carPoints[i-1]));carLength=carDistances.at(-1);
 const source=prepare((await loader.loadAsync('./assets/car.glb?v=5.0')).scene,true);const colors=[0x223e54,0xb8b9b6,0x7e2824,0x24272b,0xc4b99e,0xe6e5de];
 for(let i=0;i<6;i++){const car=source.clone(true);car.traverse(o=>{if(o.isMesh){o.material=o.material.clone();if(o.material.name==='Car paint')o.material.color.set(colors[i]);}});groups.cars.add(car);if(i<3)movingCars.push(car);else{const p=route.parked[i-3];car.position.set(p.x,p.z,-p.y);car.rotation.y=p.heading;}}
 animateCars();
}
function animateCars(){if(!carLength)return;movingCars.forEach((car,i)=>{const d=tramTime*3.2+carLength*i/3;car.position.copy(carPoint(d));const tangent=carPoint(d+1).sub(carPoint(d-1));car.rotation.y=Math.atan2(-tangent.x,-tangent.z);});renderer.domElement.dataset.carDistance=String(Math.round(tramTime*3.2*100)/100);}

async function init(){
 const response=await fetch('./assets/scene.json?v=5.0');if(!response.ok)throw new Error('scene.json?v=5.0');meta=await response.json();
 await loadModel('terrain',groups.terrain);progress('Terrain ready');
 await loadModel('structure',groups.structure);progress('Structure ready');
 await loadModel('context',groups.context);progress('Neighbouring buildings ready');
 await loadModel('roads',groups.roads);progress('Roads and tram loop ready');
 const trees={};for(const level of ['low','medium','high']){trees[level]=prepare((await loader.loadAsync(`./assets/tree-${level}.glb`)).scene,level==='high');if(level!=='high')trees[level].traverse(o=>{if(o.isMesh){const convert=m=>new THREE.MeshBasicMaterial({map:m.map,color:new THREE.Color(6.5,8.0,5.3),alphaTest:.45,side:THREE.DoubleSide});o.material=Array.isArray(o.material)?o.material.map(convert):convert(o.material);o.receiveShadow=false;}});progress(`Trees: ${level} detail ready`);}
 const treeResponse=await fetch('./assets/tree-positions.json');if(!treeResponse.ok)throw new Error('tree positions');const positions=await treeResponse.json();
 const box=new THREE.Box3().setFromObject(trees.high);const height=box.max.y-box.min.y;
 for(const p of positions.filter(p=>p.lod!=='low')){const lod=new THREE.LOD();const levels=p.near?[['high',0],['medium',330],['low',480]]:[['medium',0],['low',115]];
  for(const [level,distance] of levels){const asset=trees[level].clone(true);asset.position.y=-box.min.y;lod.addLevel(asset,distance,.12);}
  lod.position.set(p.x,p.z,-p.y);lod.scale.setScalar(p.height/height);lod.rotation.y=p.rotation||0;lod.userData.near=p.near;groups.trees.add(lod);lods.push(lod);
 }
 const hill=positions.filter(p=>p.lod==='low');trees.low.updateMatrixWorld(true);
 const dummy=new THREE.Object3D(),offset=new THREE.Matrix4().makeTranslation(0,-box.min.y,0);
 trees.low.traverse(source=>{if(!source.isMesh)return;const mesh=new THREE.InstancedMesh(source.geometry,source.material,hill.length);mesh.castShadow=false;mesh.receiveShadow=false;
  hill.forEach((p,i)=>{dummy.position.set(p.x,p.z,-p.y);dummy.rotation.set(0,p.rotation||0,0);dummy.scale.setScalar(p.height/height);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix.clone().multiply(offset).multiply(source.matrixWorld));});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();groups.trees.add(mesh);});
 await loadTrams();progress('Trams ready');await loadCars();progress('Traffic ready');
 $('#loader').classList.add('done');ready=true;$('#status').textContent=`200 m context · ${meta.buildings.length} buildings · ${positions.length} trees`;
 renderer.domElement.dataset.ready='true';
}
init().catch(error=>{console.error(error);fail('Models could not be loaded. Check your connection or launch the included local server.');});
let last=0;function tick(t){requestAnimationFrame(tick);if(document.hidden)return;if(t-last<1000/45)return;const delta=Math.min((t-last)/1000,.1);last=t;if(!tramPaused)tramTime+=delta;animateTrams();animateCars();
 if(flight){const k=Math.min((t-flight.start)/1000,1),s=k*k*(3-2*k);camera.position.lerpVectors(flight.from,flight.to,s);controls.target.lerpVectors(flight.fromTarget,flight.toTarget,s);if(k===1)flight=null;}
 controls.update();for(const lod of lods)lod.update(camera);$('#compass-arrow').style.transform=`rotate(${THREE.MathUtils.radToDeg(controls.getAzimuthalAngle())}deg)`;renderer.render(scene,camera);
 if(ready)renderer.domElement.dataset.triangles=String(renderer.info.render.triangles);
}requestAnimationFrame(tick);








