import{bX as i,bW as s,aM as l,aR as y,aN as c,aO as u,aP as p,q as o,aQ as f,t as g,v as h}from"./index-VKzKZO7f.js";function $(r,e=!1){return r<=i?e?new Array(r).fill(0):new Array(r):new Float64Array(r)}function m(r){return(s(r)?r.length:r.byteLength/8)<=i?Array.from(r):new Float64Array(r)}function w(r,e,t){return Array.isArray(r)?r.slice(e,e+t):r.subarray(e,e+t)}function b(r,e){for(let t=0;t<e.length;++t)r[t]=e[t];return r}function x(r){return Array.isArray(r)?new Float64Array(r):r}let a=class extends l(y){constructor(r){super(r),this.type="local",this.isRelative=!0,this.isGeoreferenced=!1,this.origin=c()}getOriginPoint(r){const[e,t,n]=this.origin;return new u({x:e,y:t,z:n,spatialReference:r})}setOriginFromPoint({x:r,y:e,z:t}){this.origin=p(r,e,t??0)}};o([f({local:"local"},{readOnly:!0})],a.prototype,"type",void 0),o([g({type:[Number],nonNullable:!0,json:{write:!0}})],a.prototype,"origin",void 0),a=o([h("esri.geometry.support.MeshLocalVertexSpace")],a);const d=a;export{w as a,m as e,d as m,b as o,$ as t,x as y};
