import{s as m,aC as c,ck as g,co as _,cp as d,m as F,o as w,j as S}from"./index-VKzKZO7f.js";import{r as E,s as q}from"./featureConversionUtils-BWQUVu-o.js";import{m as x}from"./FeatureStore-uLiuxGc2.js";import{x as T,j as R}from"./projectionSupport-BWmnjjdZ.js";import{W as I}from"./QueryEngine-T_q95dVl.js";import{E as b,N as j}from"./geojson-mfIq7hjC.js";import{p as C}from"./sourceUtils-otgxZMCZ.js";import{a as k,B as P}from"./wfsUtils-iBOS3aBY.js";import"./OptimizedFeature-5RGb7-P9.js";import"./OptimizedFeatureSet-smVI1ez9.js";import"./OptimizedGeometry-CbNXANBG.js";import"./BoundsStore-lx0dGsUo.js";import"./PooledRBush-1OAEHJJJ.js";import"./timeSupport-fDop0zQW.js";import"./json-v6EOeNTY.js";import"./WhereClause-eLAz8AoY.js";import"./TimeOnly-wEYL_T2J.js";import"./QueryEngineCapabilities-PzVpW5yD.js";import"./quantizationUtils-2fXOOP7N.js";import"./utils-OEKDtoed.js";import"./generateRendererUtils-qpv01FDE.js";import"./date-be_IQzZd.js";import"./xmlUtils-Q_9cB30b.js";class ae{constructor(){this._queryEngine=null,this._customParameters=null}destroy(){var e;(e=this._queryEngine)==null||e.destroy(),this._queryEngine=null}async load(e,t){const{getFeatureUrl:r,getFeatureOutputFormat:p,fields:o,geometryType:i,featureType:n,objectIdField:u,customParameters:a}=e,{spatialReference:s,getFeatureSpatialReference:h}=k(r,n,e.spatialReference);this._featureType=n,this._customParameters=a,this._getFeatureUrl=r,this._getFeatureOutputFormat=p,this._getFeatureSpatialReference=h;try{await T(h,s)}catch{throw new m("unsupported-projection","Projection not supported",{inSpatialReference:h,outSpatialReference:s})}c(t);const l=g.fromLayerJSON({fields:o,dateFieldsTimeReference:o.some(f=>f.type==="esriFieldTypeDate")?{timeZoneIANA:_}:null}),y=await this._snapshotFeatures({fieldsIndex:l,geometryType:i,objectIdField:u,spatialReference:s},t.signal);return this._queryEngine=new I({fieldsIndex:l,geometryType:i,hasM:!1,hasZ:!1,objectIdField:u,spatialReference:s,timeInfo:null,featureStore:new x({geometryType:i,hasM:!1,hasZ:!1})}),this._queryEngine.featureStore.addMany(y),{extent:(await this._queryEngine.fetchRecomputedExtents()).fullExtent}}async applyEdits(){throw new m("wfs-source:editing-not-supported","applyEdits() is not supported on WFSLayer")}async queryFeatures(e={},t={}){return await this._waitSnapshotComplete(),this._queryEngine.executeQuery(e,t.signal)}async queryFeatureCount(e={},t={}){return await this._waitSnapshotComplete(),this._queryEngine.executeQueryForCount(e,t.signal)}async queryObjectIds(e={},t={}){return await this._waitSnapshotComplete(),this._queryEngine.executeQueryForIds(e,t.signal)}async queryExtent(e={},t={}){return await this._waitSnapshotComplete(),this._queryEngine.executeQueryForExtent(e,t.signal)}async querySnapping(e,t={}){return await this._waitSnapshotComplete(),this._queryEngine.executeQueryForSnapping(e,t.signal)}async refresh(e){var t;return this._customParameters=e,(t=this._snapshotTask)==null||t.abort(),this._snapshotTask=d(r=>this._snapshotFeatures(this._queryEngine,r)),this._snapshotTask.promise.then(r=>{this._queryEngine.featureStore.clear(),r&&this._queryEngine.featureStore.addMany(r)},r=>{this._queryEngine.featureStore.clear(),F(r)||w.getLogger("esri.layers.WFSLayer").error(new m("wfs-layer:getfeature-error","An error occurred during the GetFeature request",{error:r}))}),await this._waitSnapshotComplete(),{extent:(await this._queryEngine.fetchRecomputedExtents()).fullExtent}}async _waitSnapshotComplete(){if(this._snapshotTask&&!this._snapshotTask.finished){try{await this._snapshotTask.promise}catch{}return this._waitSnapshotComplete()}}async _snapshotFeatures({objectIdField:e,geometryType:t,spatialReference:r,fieldsIndex:p},o){const i=await P(this._getFeatureUrl??"",this._featureType.typeName,this._getFeatureSpatialReference,this._getFeatureOutputFormat,{customParameters:this._customParameters,signal:o});b(i,this._getFeatureSpatialReference.wkid),c(o);const n=j(i,{geometryType:t,hasZ:!1,objectIdField:e});if(!S(r,this._getFeatureSpatialReference))for(const a of n)a.geometry!=null&&(a.geometry=E(R(q(a.geometry,t,!1,!1),this._getFeatureSpatialReference,r)));let u=1;for(const a of n){const s={};C(p,s,a.attributes,!0),a.attributes=s,s[e]==null&&(a.objectId=s[e]=u++)}return n}}export{ae as default};