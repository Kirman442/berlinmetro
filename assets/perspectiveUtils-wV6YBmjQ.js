import{q as a,t as l,v as k,bz as q,e_ as d,dP as w,b4 as E,e$ as $,f0 as y,f1 as g,f2 as p,au as h,f3 as z,at as c,aN as J}from"./index-VKzKZO7f.js";import{p as M}from"./normalizeUtilsSync-Dy1jsTGX.js";import{e as u}from"./mat3f64-sunSSgMR.js";let n=class extends q{constructor(t){super(t)}get bounds(){const t=this.coords;return(t==null?void 0:t.extent)==null?null:d(t.extent)}get coords(){var o;const t=(o=this.element.georeference)==null?void 0:o.coords;return w(t,this.spatialReference).geometry}get normalizedCoords(){return E.fromJSON(M(this.coords))}get normalizedBounds(){const t=this.normalizedCoords!=null?this.normalizedCoords.extent:null;return t!=null?d(t):null}};a([l()],n.prototype,"spatialReference",void 0),a([l()],n.prototype,"element",void 0),a([l()],n.prototype,"bounds",null),a([l()],n.prototype,"coords",null),a([l()],n.prototype,"normalizedCoords",null),a([l()],n.prototype,"normalizedBounds",null),n=a([k("esri.layers.support.MediaElementView")],n);const r=J(),s=u(),i=u(),m=u();function _(e,t,o){return $(r,t[0],t[1],1),y(r,r,g(s,o)),r[2]===0?p(e,r[0],r[1]):p(e,r[0]/r[2],r[1]/r[2])}function A(e,t,o){return f(i,t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7]),f(m,o[0],o[1],o[2],o[3],o[4],o[5],o[6],o[7]),h(e,z(i,i),m),e[8]!==0&&(e[0]/=e[8],e[1]/=e[8],e[2]/=e[8],e[3]/=e[8],e[4]/=e[8],e[5]/=e[8],e[6]/=e[8],e[7]/=e[8],e[8]/=e[8]),e}function f(e,t,o,x,b,C,v,j,B){c(e,t,x,C,o,b,v,1,1,1),$(r,j,B,1),z(s,e);const[N,R,S]=y(r,r,g(s,s));return c(s,N,0,0,0,R,0,0,0,S),h(e,s,e)}export{_ as h,n as i,A as j};