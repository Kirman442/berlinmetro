import{e as L}from"./mat3f64-sunSSgMR.js";import{e as I}from"./quatf64-5VCgza3C.js";import{c2 as A,c3 as O,c4 as S,c5 as T,c6 as Y,c7 as D,c8 as N,c9 as W,ca as X,cb as Z,cc as k,cd as w,ce as B,cf as P,cg as C,ch as F,aN as G,aP as _,ci as H}from"./index-VKzKZO7f.js";function J(n){return n[0]=0,n[1]=0,n[2]=0,n[3]=1,n}function b(n,o,e){e*=.5;const c=Math.sin(e);return n[0]=c*o[0],n[1]=c*o[1],n[2]=c*o[2],n[3]=Math.cos(e),n}function K(n,o){const e=2*Math.acos(o[3]),c=Math.sin(e/2);return c>A()?(n[0]=o[0]/c,n[1]=o[1]/c,n[2]=o[2]/c):(n[0]=1,n[1]=0,n[2]=0),e}function j(n,o,e){const c=o[0],r=o[1],a=o[2],t=o[3],u=e[0],i=e[1],h=e[2],M=e[3];return n[0]=c*M+t*u+r*h-a*i,n[1]=r*M+t*i+a*u-c*h,n[2]=a*M+t*h+c*i-r*u,n[3]=t*M-c*u-r*i-a*h,n}function Q(n,o,e){e*=.5;const c=o[0],r=o[1],a=o[2],t=o[3],u=Math.sin(e),i=Math.cos(e);return n[0]=c*i+t*u,n[1]=r*i+a*u,n[2]=a*i-r*u,n[3]=t*i-c*u,n}function R(n,o,e){e*=.5;const c=o[0],r=o[1],a=o[2],t=o[3],u=Math.sin(e),i=Math.cos(e);return n[0]=c*i-a*u,n[1]=r*i+t*u,n[2]=a*i+c*u,n[3]=t*i-r*u,n}function U(n,o,e){e*=.5;const c=o[0],r=o[1],a=o[2],t=o[3],u=Math.sin(e),i=Math.cos(e);return n[0]=c*i+r*u,n[1]=r*i-c*u,n[2]=a*i+t*u,n[3]=t*i-a*u,n}function V(n,o){const e=o[0],c=o[1],r=o[2];return n[0]=e,n[1]=c,n[2]=r,n[3]=Math.sqrt(Math.abs(1-e*e-c*c-r*r)),n}function g(n,o,e,c){const r=o[0],a=o[1],t=o[2],u=o[3];let i,h,M,f,l,m=e[0],q=e[1],$=e[2],p=e[3];return h=r*m+a*q+t*$+u*p,h<0&&(h=-h,m=-m,q=-q,$=-$,p=-p),1-h>A()?(i=Math.acos(h),M=Math.sin(i),f=Math.sin((1-c)*i)/M,l=Math.sin(c*i)/M):(f=1-c,l=c),n[0]=f*r+l*m,n[1]=f*a+l*q,n[2]=f*t+l*$,n[3]=f*u+l*p,n}function nn(n){const o=H,e=o(),c=o(),r=o(),a=Math.sqrt(1-e),t=Math.sqrt(e);return n[0]=a*Math.sin(2*Math.PI*c),n[1]=a*Math.cos(2*Math.PI*c),n[2]=t*Math.sin(2*Math.PI*r),n[3]=t*Math.cos(2*Math.PI*r),n}function on(n,o){const e=o[0],c=o[1],r=o[2],a=o[3],t=e*e+c*c+r*r+a*a,u=t?1/t:0;return n[0]=-e*u,n[1]=-c*u,n[2]=-r*u,n[3]=a*u,n}function cn(n,o){return n[0]=-o[0],n[1]=-o[1],n[2]=-o[2],n[3]=o[3],n}function v(n,o){const e=o[0]+o[4]+o[8];let c;if(e>0)c=Math.sqrt(e+1),n[3]=.5*c,c=.5/c,n[0]=(o[5]-o[7])*c,n[1]=(o[6]-o[2])*c,n[2]=(o[1]-o[3])*c;else{let r=0;o[4]>o[0]&&(r=1),o[8]>o[3*r+r]&&(r=2);const a=(r+1)%3,t=(r+2)%3;c=Math.sqrt(o[3*r+r]-o[3*a+a]-o[3*t+t]+1),n[r]=.5*c,c=.5/c,n[3]=(o[3*a+t]-o[3*t+a])*c,n[a]=(o[3*a+r]+o[3*r+a])*c,n[t]=(o[3*t+r]+o[3*r+t])*c}return n}function rn(n,o,e,c){const r=.5*Math.PI/180;o*=r,e*=r,c*=r;const a=Math.sin(o),t=Math.cos(o),u=Math.sin(e),i=Math.cos(e),h=Math.sin(c),M=Math.cos(c);return n[0]=a*i*M-t*u*h,n[1]=t*u*M+a*i*h,n[2]=t*i*h-a*u*M,n[3]=t*i*M+a*u*h,n}function en(n){return"quat("+n[0]+", "+n[1]+", "+n[2]+", "+n[3]+")"}const an=O,tn=S,un=T,hn=j,Mn=Y,sn=D,fn=N,z=W,ln=z,E=X,mn=E,d=Z,qn=k,$n=w;function pn(n,o,e){const c=B(o,e);return c<-.999999?(P(s,gn,o),C(s)<1e-6&&P(s,Pn,o),F(s,s),b(n,s,Math.PI),n):c>.999999?(n[0]=0,n[1]=0,n[2]=0,n[3]=1,n):(P(s,o,e),n[0]=s[0],n[1]=s[1],n[2]=s[2],n[3]=1+c,d(n,n))}const s=G(),gn=_(1,0,0),Pn=_(0,1,0);function dn(n,o,e,c,r,a){return g(x,o,r,a),g(y,e,c,a),g(n,x,y,2*a*(1-a)),n}const x=I(),y=I();function xn(n,o,e,c){const r=yn;return r[0]=e[0],r[3]=e[1],r[6]=e[2],r[1]=c[0],r[4]=c[1],r[7]=c[2],r[2]=-o[0],r[5]=-o[1],r[8]=-o[2],d(n,v(n,r))}const yn=L();Object.freeze(Object.defineProperty({__proto__:null,add:un,calculateW:V,conjugate:cn,copy:an,dot:sn,equals:$n,exactEquals:qn,fromEuler:rn,fromMat3:v,getAxisAngle:K,identity:J,invert:on,len:ln,length:z,lerp:fn,mul:hn,multiply:j,normalize:d,random:nn,rotateX:Q,rotateY:R,rotateZ:U,rotationTo:pn,scale:Mn,set:tn,setAxes:xn,setAxisAngle:b,slerp:g,sqlerp:dn,sqrLen:mn,squaredLength:E,str:en},Symbol.toStringTag,{value:"Module"}));export{an as B,qn as K,cn as O,rn as T,b as v,K as x,j as y};
