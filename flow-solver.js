import {cases,caseSpec,gpuSpec,fanPose,fanFlow,isLiquid} from './model.js?v=4';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function componentLayout(s){const c=caseSpec(s),z=-c.d/2+.5,spec=gpuSpec(s),len=spec.length,gpuH=spec.height,towerDepth=Math.max(.6,s.coolerHeight/100-.25),towerWidth=s.coolerProfile==='dualTower'?1.4:1,towerCenter=z+.1+towerDepth/2;const fans=s.fans.map(f=>{const p=fanPose(f,s);return {position:p.position,direction:p.direction,radius:f.size/200,strength:fanFlow(f,s)/28,type:'case'}});const regions=[];
 if(s.cooler==='tower'){regions.push({min:[-.9-towerWidth/2,.12,z+.1],max:[-.9+towerWidth/2,1.37,z+.1+towerDepth],permeability:.38,heat:s.cpu/110,type:'cpu'});fans.push({position:[-.9+towerWidth/2+.1,.68,towerCenter],direction:[-1,0,0],radius:.47,strength:(s.cpuFan??1400)/1400*1.3,type:'cpu'});}
 else if(s.cooler==='stock'){regions.push({min:[-1.4,.12,z],max:[-.4,1.2,z+.35],permeability:.35,heat:s.cpu/110,type:'cpu'});fans.push({position:[-.9,.65,z+.12+.26*(s.coolerHeight??65)/65],direction:[0,0,-1],radius:.43,strength:(s.cpuFan??1400)/1400*1.15,type:'cpu'});}
 if(s.gpu!=='none'){regions.push({min:[-len/2-.1,-.82-gpuH,-.67],max:[len/2-.1,-.86,.68],permeability:.32,heat:s.gpuHeat/180,type:'gpu'});regions.push({min:[-len/2-.1,-.86,-.72],max:[len/2-.1,-.75,.74],permeability:0,heat:0,type:'pcb'});for(let i=0;i<spec.count;i++)fans.push({position:[spec.count===1?-.1:-len/2+.5+i*(len-1.2)/(spec.count-1),-.90-gpuH,0],direction:[0,1,0],radius:.42,strength:(s.gpuFan??1300)/1300*1.3,type:'gpu'});}
 if(isLiquid(s))regions.push({min:[-(s.radiatorSize/100+.3)/2,c.h/2-.48,-.68],max:[(s.radiatorSize/100+.3)/2,c.h/2-.2,.68],permeability:.3,heat:s.cpu/170,type:'radiator'});
 return {fans:fans.filter(f=>f.strength>0),regions};}
// Finite-volume pressure projection on a staggered grid. Fan actuators provide
// momentum, while pressure redirects it through openings and around solids.
// This is a steady, coarse flow approximation, not transient Navier–Stokes CFD.
export function solveFlow(s,options={}){
 const c=caseSpec(s),h=options.h??.17,margin=1.5;
 const nx=Math.ceil((c.w+margin*2)/h),ny=Math.ceil((c.h+margin*2)/h),nz=Math.ceil((c.d+margin*2)/h),n=nx*ny*nz,xy=nx*ny,origin=[-nx*h/2,-ny*h/2,-nz*h/2];
 const {fans,regions}=componentLayout(s),permeability=new Float32Array(n),sources=new Float32Array(n),neighbors=new Int32Array(n*6).fill(-1),weights=new Float32Array(n*6),diag=new Float64Array(n),active=[];
 const X=c.w/2,Y=c.h/2,Z=c.d/2;
 // Porous front/top/rear vents; solid glass, motherboard wall and PSU shroud.
 function material(x,y,z){let k=1;const skin=h*.57;const inX=Math.abs(x)<X+skin,inY=Math.abs(y)<Y+skin,inZ=Math.abs(z)<Z+skin;
  if(inY&&inZ&&Math.abs(x-X)<skin){const vent=y>-Y+.6&&y<Y-.16&&Math.abs(z)<Z-.13;k=vent?Math.max(.22,1-s.filter/100)*c.restriction:0;}
  if(inY&&inZ&&Math.abs(x+X)<skin){const rear=(y>-.05&&y<1.6&&Math.abs(z)<.8)||(y<-0.6&&y>-1.65&&Math.abs(z)<.65);k=Math.min(k,rear?.85:0);}
  if(inX&&inZ&&Math.abs(y-Y)<skin)k=Math.min(k,Math.abs(x)<X-.17&&Math.abs(z)<Z-.16?.85:0);
  if(inX&&inZ&&Math.abs(y+Y)<skin)k=0;
  if(inX&&inY&&Math.abs(z+Z)<skin)k=0;
  if(inX&&inY&&Math.abs(z-Z)<skin){const seam=Math.abs(x)>X-.22||y>Y-.22;const open=s.panel==='open'||seam;k=Math.min(k,open?(s.panel==='open'?1:.24):0);}
  if(Math.abs(x)<X&&Math.abs(z)<Z&&y>-Y&&y<-Y+.53)k=0;
  if(Math.abs(x)<X&&Math.abs(y)<Y&&Math.abs(z)<Z){for(const r of regions)if(x>r.min[0]&&x<r.max[0]&&y>r.min[1]&&y<r.max[1]&&z>r.min[2]&&z<r.max[2])k=Math.min(k,r.permeability);}
  return k;}
 const coords=(i,j,k)=>[origin[0]+(i+.5)*h,origin[1]+(j+.5)*h,origin[2]+(k+.5)*h];
 for(let k=0;k<nz;k++)for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const id=i+j*nx+k*xy,[x,y,z]=coords(i,j,k);const p=material(x,y,z);permeability[id]=p;if(p>0){active.push(id);let heat=0;for(const r of regions){if(r.heat&&x>r.min[0]-.15&&x<r.max[0]+.15&&y>r.min[1]-.15&&y<r.max[1]+.15&&z>r.min[2]-.15&&z<r.max[2]+.15)heat+=r.heat;}sources[id]=heat;}}
 const harmonic=(a,b)=>a>0&&b>0?2*a*b/(a+b):0;
 const offsets=[1,-1,nx,-nx,xy,-xy];
 for(let k=0;k<nz;k++)for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const id=i+j*nx+k*xy;if(!permeability[id])continue;const valid=[i<nx-1,i>0,j<ny-1,j>0,k<nz-1,k>0];for(let d=0;d<6;d++){const nb=valid[d]?id+offsets[d]:-1,weight=nb<0?permeability[id]:harmonic(permeability[id],permeability[nb]);neighbors[id*6+d]=nb;weights[id*6+d]=weight;diag[id]+=weight;}}
 const fx=new Float64Array(n),fy=new Float64Array(n),fz=new Float64Array(n);
 function forcing(x,y,z,axis){let value=0;for(const f of fans){const dx=x-f.position[0],dy=y-f.position[1],dz=z-f.position[2],ax=dx*f.direction[0]+dy*f.direction[1]+dz*f.direction[2],r2=Math.max(0,dx*dx+dy*dy+dz*dz-ax*ax);if(Math.abs(ax)>h*1.4||r2>f.radius*f.radius)continue;const disk=(1-r2/(f.radius*f.radius))**.4,thickness=Math.exp(-ax*ax/(h*h*.35));value+=f.direction[axis]*f.strength*disk*thickness;}return value;}
 for(let k=0;k<nz;k++)for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const id=i+j*nx+k*xy;if(!permeability[id])continue;const [x,y,z]=coords(i,j,k),base=id*6;fx[id]=weights[base]*forcing(x+h/2,y,z,0);fy[id]=weights[base+2]*(forcing(x,y+h/2,z,1)+sources[id]*.009);fz[id]=weights[base+4]*forcing(x,y,z+h/2,2);}
 const b=new Float64Array(n);let before=0;for(const id of active){const base=id*6;const left=neighbors[base+1],down=neighbors[base+3],back=neighbors[base+5];const div=fx[id]-(left>=0?fx[left]:0)+fy[id]-(down>=0?fy[down]:0)+fz[id]-(back>=0?fz[back]:0);b[id]=-div;before+=div*div;}
 const p=new Float64Array(n),r=b.slice(),zv=new Float64Array(n),d=new Float64Array(n),ad=new Float64Array(n);let rz=0;
 for(const id of active){if(diag[id]>0){zv[id]=r[id]/diag[id];d[id]=zv[id];rz+=r[id]*zv[id];}}
 const apply=(v,out)=>{for(const id of active){const base=id*6;let value=diag[id]*v[id];for(let q=0;q<6;q++){const nb=neighbors[base+q];if(nb>=0)value-=weights[base+q]*v[nb];}out[id]=value;}};
 let residual=before,iterations=0;const maxIterations=options.maxIterations??220,tolerance=options.tolerance??2e-5;
 for(;iterations<maxIterations&&residual>Math.max(1e-16,before*tolerance*tolerance);iterations++){apply(d,ad);let den=0;for(const id of active)den+=d[id]*ad[id];if(Math.abs(den)<1e-24)break;const alpha=rz/den;residual=0;let nextRz=0;for(const id of active){p[id]+=alpha*d[id];r[id]-=alpha*ad[id];residual+=r[id]*r[id];zv[id]=diag[id]>0?r[id]/diag[id]:0;nextRz+=r[id]*zv[id];}const beta=rz?nextRz/rz:0;for(const id of active)d[id]=zv[id]+beta*d[id];rz=nextRz;}
 // Project all open faces. Blocked faces are exactly zero.
 for(const id of active){const base=id*6;for(let axis=0;axis<3;axis++){const q=axis*2,nb=neighbors[base+q],f=[fx,fy,fz][axis];f[id]+=weights[base+q]*(p[id]-(nb>=0?p[nb]:0));}}
 const vx=new Float32Array(n),vy=new Float32Array(n),vz=new Float32Array(n);let after=0,maxSpeed=0;
 for(const id of active){const base=id*6,left=neighbors[base+1],down=neighbors[base+3],back=neighbors[base+5];const ux=left>=0?fx[left]:-weights[base+1]*p[id],uy=down>=0?fy[down]:-weights[base+3]*p[id],uz=back>=0?fz[back]:-weights[base+5]*p[id];vx[id]=(fx[id]+ux)/2;vy[id]=(fy[id]+uy)/2;vz[id]=(fz[id]+uz)/2;const div=fx[id]-ux+fy[id]-uy+fz[id]-uz;after+=div*div;maxSpeed=Math.max(maxSpeed,Math.hypot(vx[id],vy[id],vz[id]));}
 return {nx,ny,nz,h,origin,permeability,sources,vx,vy,vz,pressure:new Float32Array(p),fx:new Float32Array(fx),fy:new Float32Array(fy),fz:new Float32Array(fz),maxSpeed,regions,fans,stats:{cells:n,fluidCells:active.length,iterations,relativeResidual:before?Math.sqrt(after/before):0,divergenceBefore:Math.sqrt(before/active.length)/h,divergenceAfter:Math.sqrt(after/active.length)/h}};
}
export function sampleField(g,p,out=[0,0,0]){const {nx,ny,nz,h,origin}=g,xy=nx*ny;for(let axis=0;axis<3;axis++){const x=(p[0]-origin[0])/h-(axis===0?1:.5),y=(p[1]-origin[1])/h-(axis===1?1:.5),z=(p[2]-origin[2])/h-(axis===2?1:.5),i=Math.floor(x),j=Math.floor(y),k=Math.floor(z),a=x-i,b=y-j,c=z-k,field=[g.fx,g.fy,g.fz][axis];let value=0;for(let dz=0;dz<2;dz++)for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){const ix=i+dx,iy=j+dy,iz=k+dz;if(ix<0||ix>=nx||iy<0||iy>=ny||iz<0||iz>=nz)continue;const id=ix+iy*nx+iz*xy,weight=(dx?a:1-a)*(dy?b:1-b)*(dz?c:1-c);value+=field[id]*weight;}out[axis]=value;}return out;}
export function fieldCell(g,p){const i=Math.floor((p[0]-g.origin[0])/g.h),j=Math.floor((p[1]-g.origin[1])/g.h),k=Math.floor((p[2]-g.origin[2])/g.h);return i<0||i>=g.nx||j<0||j>=g.ny||k<0||k>=g.nz?-1:i+j*g.nx+k*g.nx*g.ny;}
