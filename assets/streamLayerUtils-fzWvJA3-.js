import{I as o,b as m}from"./utils-CHiaNObz.js";import{l as c,i as u,f as y}from"./index-NTpjkr2x.js";import"./originUtils-1w5HeAJR.js";import"./multiOriginJSONSupportUtils-R5XHSAtL.js";import"./jsonContext-mPj8dIdF.js";import"./saveAPIKeyUtils-iuzgr4za.js";const s="Stream Service",p="stream-layer-save",f="stream-layer-save-as";function i(r){return{isValid:r.type==="stream"&&!!r.url&&!r.webSocketUrl,errorMessage:"Stream layer should be created using a url to a stream service"}}function l(r){const e=r.layerJSON;return Promise.resolve(e&&Object.keys(e).length?e:null)}async function v(r,e){const{parsedUrl:t,title:n,fullExtent:a}=r;e.url=t.path,e.title||(e.title=n),e.extent=null,a!=null&&(e.extent=await c(a)),u(e,y.SINGLE_LAYER)}async function N(r,e){return o({layer:r,itemType:s,validateLayer:i,createItemData:l,errorNamePrefix:p},e)}async function P(r,e,t){return m({layer:r,itemType:s,validateLayer:i,createItemData:l,errorNamePrefix:f,newItem:e,setItemProperties:v},t)}export{N as save,P as saveAs};