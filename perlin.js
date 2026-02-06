class Perlin{
 constructor(){this.g={}}
 r(){let t=Math.random()*Math.PI*2;return{x:Math.cos(t),y:Math.sin(t)}}
 d(x,y,ix,iy){
  let k=ix+","+iy
  if(!this.g[k])this.g[k]=this.r()
  let g=this.g[k],dx=x-ix,dy=y-iy
  return dx*g.x+dy*g.y
 }
 s(t){return t*t*t*(t*(t*6-15)+10)}
 l(t,a,b){return a+t*(b-a)}
 get(x,y){
  let ix=Math.floor(x),iy=Math.floor(y)
  let tl=this.d(x,y,ix,iy)
  let tr=this.d(x,y,ix+1,iy)
  let bl=this.d(x,y,ix,iy+1)
  let br=this.d(x,y,ix+1,iy+1)
  let u=this.s(x-ix),v=this.s(y-iy)
  return this.l(v,this.l(u,tl,tr),this.l(u,bl,br))
 }
}
