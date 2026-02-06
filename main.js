let scene,camera,renderer,controls;
let blocks=[],velY=0,onGround=false,hp=100;
const perlin=new Perlin();

init();loop();

function init(){
 scene=new THREE.Scene();
 scene.background=new THREE.Color(0x87ceeb);

 camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.1,1000);
 renderer=new THREE.WebGLRenderer({antialias:true});
 renderer.setSize(innerWidth,innerHeight);
 document.body.appendChild(renderer.domElement);

 controls=new THREE.PointerLockControls(camera,document.body);
 document.getElementById("lock").onclick=()=>controls.lock();
 controls.addEventListener("lock",()=>lock.style.display="none");
 controls.addEventListener("unlock",()=>lock.style.display="flex");
 scene.add(controls.getObject());

 camera.position.y=15;

 scene.add(new THREE.AmbientLight(0xffffff,.5));
 let sun=new THREE.DirectionalLight(0xffffff,1);
 sun.position.set(50,100,50);scene.add(sun);

 generateWorld();

 document.addEventListener("mousedown",clickBlock);
 document.addEventListener("keydown",key);
 window.onresize=()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
 };
}

function mat(t){
 return new THREE.MeshLambertMaterial({
  map:new THREE.TextureLoader().load("textures/"+t)
 });
}

function generateWorld(){
 for(let x=-32;x<32;x++)
 for(let z=-32;z<32;z++){
  let h=Math.floor(perlin.get(x/10,z/10)*6+8);
  for(let y=0;y<h;y++){
   let tex=y==h-1?"grass.png":"dirt.png";
   let b=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),mat(tex));
   b.position.set(x,y,z);
   scene.add(b);blocks.push(b);
  }
 }
}

function clickBlock(e){
 let ray=new THREE.Raycaster();
 ray.setFromCamera({x:0,y:0},camera);
 let hit=ray.intersectObjects(blocks)[0];
 if(!hit)return;

 if(e.button===0){
  scene.remove(hit.object);
  blocks.splice(blocks.indexOf(hit.object),1);
 }
 if(e.button===2){
  let p=hit.object.position.clone();p.y++;
  let b=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),mat("dirt.png"));
  b.position.copy(p);
  scene.add(b);blocks.push(b);
 }
}

let keys={};
function key(e){
 keys[e.code]=e.type==="keydown";
 if(e.code==="Space"&&onGround){velY=0.25;onGround=false}
}

function physics(){
 velY-=0.01;
 camera.position.y+=velY;
 onGround=false;

 blocks.forEach(b=>{
  let d=camera.position.distanceTo(b.position);
  if(d<1){
   camera.position.y=b.position.y+1.01;
   velY=0;onGround=true;
  }
 });

 if(camera.position.y<-10){
  hp-=10;
  camera.position.set(0,20,0);
  document.getElementById("hp").textContent=hp;
 }
}

function loop(){
 requestAnimationFrame(loop);
 if(keys.KeyW)controls.moveForward(.15);
 if(keys.KeyS)controls.moveForward(-.15);
 if(keys.KeyA)controls.moveRight(-.15);
 if(keys.KeyD)controls.moveRight(.15);
 physics();
 renderer.render(scene,camera);
     }
