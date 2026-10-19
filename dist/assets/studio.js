'use strict';
const menuButton=document.querySelector('.menu-button'),navigation=document.querySelector('#navigation');
function closeNavigation(restoreFocus=false){navigation?.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');if(menuButton)menuButton.textContent='Menu';if(restoreFocus)menuButton?.focus()}
menuButton?.addEventListener('click',()=>{const open=navigation.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'Close':'Menu'});
navigation?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeNavigation()));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navigation?.classList.contains('open'))closeNavigation(true)});
document.addEventListener('click',e=>{if(navigation?.classList.contains('open')&&!navigation.contains(e.target)&&!menuButton.contains(e.target))closeNavigation()});
matchMedia('(min-width:801px)').addEventListener('change',()=>closeNavigation());
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=String(new Date().getFullYear()));
const form=document.querySelector('#project-brief');let briefURL;
form?.addEventListener('submit',event=>{
 event.preventDefault();const status=form.querySelector('.form-status'),ready=document.querySelector('#brief-ready');ready.hidden=true;status.textContent='';
 const fields=[...form.querySelectorAll('input:not([type=checkbox]),textarea')];for(const input of fields){input.setCustomValidity(input.required&&!input.value.trim()?'Please complete this field.':'')}
 if(!form.reportValidity()){status.textContent='Please complete the required fields, check your email address, and confirm the investment.';return}
 try{const data=new FormData(form);const content=['MERIDIUS AI — PROJECT BRIEF','Prepared locally. Not submitted to Meridius.','',...['business','name','email','phone','ambition','concept'].map(key=>key.toUpperCase()+': '+(String(data.get(key)||'').trim()||'Not supplied')),'','Investment acknowledged: $999 for the website; $89/month from month two.'].join('\n');
 const nextURL=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));if(briefURL)URL.revokeObjectURL(briefURL);briefURL=nextURL;document.querySelector('#brief-download').href=briefURL;ready.hidden=false;status.textContent='';ready.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
 }catch(error){status.textContent='Your brief could not be prepared. Please try again. Nothing has been sent.'}
});
form?.addEventListener('input',event=>{event.target.setCustomValidity?.('');document.querySelector('#brief-ready').hidden=true;form.querySelector('.form-status').textContent=''});
window.addEventListener('pagehide',()=>{if(briefURL)URL.revokeObjectURL(briefURL)});
// Original 3D meridian sculpture. Projected torus mesh, depth-sorted and lit locally.
// It is decoration only; all navigation and content work without the canvas.
const canvas=document.querySelector('#meridian');
if(canvas){
 const ctx=canvas.getContext('2d'),stage=canvas.parentElement,pause=stage.querySelector('.motion-control'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 if(ctx){
 let width=1,height=1,angle=0,frame=0,last=0,visible=true,userPaused=false,pointerX=0,pointerY=0;
 const mesh=[];const segments=72,sides=14;
 for(let ring=0;ring<2;ring++)for(let u=0;u<segments;u++)for(let v=0;v<sides;v++){
  const points=[];for(const [du,dv] of [[0,0],[1,0],[1,1],[0,1]]){
   const a=(u+du)/segments*Math.PI*2,b=(v+dv)/sides*Math.PI*2,R=1.48,r=.35;
   let x=(R+r*Math.cos(b))*Math.cos(a),y=(R+r*Math.cos(b))*Math.sin(a),z=r*Math.sin(b);
   if(ring){const yy=y;y=z;z=yy;x+=.17}else x-=.17;
   points.push([x,y,z]);
  }mesh.push({points,ring});
 }
 function rotate(p,a,b){let[x,y,z]=p;let xx=x*Math.cos(a)+z*Math.sin(a),zz=-x*Math.sin(a)+z*Math.cos(a);return[xx,y*Math.cos(b)-zz*Math.sin(b),y*Math.sin(b)+zz*Math.cos(b)]}
 function draw(){
  ctx.clearRect(0,0,width,height);const scale=Math.min(width,height)*.205,cx=width*.53,cy=height*.46;
  const shadow=ctx.createRadialGradient(cx,height*.84,2,cx,height*.84,width*.28);shadow.addColorStop(0,'rgba(48,44,24,.17)');shadow.addColorStop(1,'rgba(48,44,24,0)');ctx.save();ctx.translate(0,height*.62);ctx.scale(1,.26);ctx.fillStyle=shadow;ctx.fillRect(0,0,width,height);ctx.restore();
  const faces=mesh.map(face=>{const points=face.points.map(p=>rotate(p,angle+.53+pointerX,.43+pointerY));const z=points.reduce((s,p)=>s+p[2],0)/4;return{points,z,ring:face.ring}}).sort((a,b)=>a.z-b.z);
  for(const f of faces){const [p,q,s]=f.points;const ux=q[0]-p[0],uy=q[1]-p[1],uz=q[2]-p[2],vx=s[0]-p[0],vy=s[1]-p[1],vz=s[2]-p[2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;let n=Math.hypot(nx,ny,nz)||1;nx/=n;ny/=n;nz/=n;
   const light=Math.abs(nx*-.45+ny*-.65+nz*.6),highlight=Math.pow(Math.max(0,nz*.8-ny*.5),12);const lum=29+light*24+highlight*17;
   ctx.beginPath();f.points.forEach((p,i)=>{const perspective=5.8/(5.8-p[2]);const x=cx+p[0]*scale*perspective,y=cy+p[1]*scale*perspective;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y)});ctx.closePath();ctx.fillStyle=`hsl(${f.ring?16:13} 72% ${lum}%)`;ctx.fill();ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=.55;ctx.stroke();
  }
 }
 function resize(){const rect=stage.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
 function tick(time){if(!visible||userPaused||reduce.matches||document.hidden){frame=0;return}if(time-last>34){angle+=.004;draw();last=time}frame=requestAnimationFrame(tick)}
 function sync(){cancelAnimationFrame(frame);frame=0;pause.hidden=reduce.matches;pause.textContent=userPaused?'Play motion':'Pause motion';pause.setAttribute('aria-pressed',String(userPaused));if(visible&&!userPaused&&!reduce.matches&&!document.hidden)frame=requestAnimationFrame(tick);else draw()}
 pause.addEventListener('click',()=>{userPaused=!userPaused;sync()});reduce.addEventListener('change',()=>{pointerX=0;pointerY=0;sync()});document.addEventListener('visibilitychange',sync);
 stage.addEventListener('pointermove',e=>{if(reduce.matches||userPaused||!matchMedia('(pointer:fine)').matches)return;const r=stage.getBoundingClientRect();pointerX=((e.clientX-r.left)/r.width-.5)*.25;pointerY=((e.clientY-r.top)/r.height-.5)*.15});stage.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:0});observer.observe(stage);new ResizeObserver(resize).observe(stage);resize();stage.classList.add('rendered');sync();
 }
}
