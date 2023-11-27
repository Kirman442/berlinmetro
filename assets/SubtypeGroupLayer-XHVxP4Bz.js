import{ga as Z,db as D,aM as k,d7 as W,aJ as S,dS as X,o as ee,fC as te,B as A,s as b,fE as re,gb as N,gc as L,dC as M,aL as Q,q as i,t as n,dK as ie,gd as se,fG as ne,fH as ae,fI as oe,dd as le,g9 as ue,g8 as de,fK as pe,z as ye,a_ as O,fO as U,v as H,ge as ce,gf as he,gg as be,fQ as B,gh as ge,gi as fe,gj as me,fx as ve,gk as we,gl as Se,bu as Fe,dy as Ie,bv as Oe,d8 as $e,dz as Ee,d9 as Te,da as je,dB as _e,dA as Ce,V as C,eY as Ae,w as Le,ev as xe,U as Pe,gm as qe,gn as Ge,az as Ve,b2 as Re,go as De,gp as ke,gq as Ne,gr as Me,eT as Qe,_ as x,gs as Ue,gt as He,dH as Be,gu as ze,gv as Je,gw as Ke,gx as Ye,gy as Ze,gz as We,fV as T,dI as Xe,fD as et,gA as tt,dc as rt,dq as P,gB as it,by as st}from"./index-VKzKZO7f.js";const nt=["charts","editingEnabled","formTemplate","labelsVisible","labelingInfo","legendEnabled","minScale","maxScale","opacity","popupEnabled","popupTemplate","renderer","subtypeCode","templates","title","visible"],z={key:"type",base:ce,errorContext:"renderer",typeMap:{simple:A,"unique-value":he,"class-breaks":be}},q=B(),G=Z({types:z});let at=0;function I(e){const t=e.json.write;return typeof t=="object"?t.ignoreOrigin=!0:e.json.write={ignoreOrigin:!0},e}function ot(e){return new A({symbol:lt(e)})}function lt(e){switch(e){case"point":case"multipoint":return me.clone();case"polyline":return fe.clone();case"polygon":case"multipatch":return ge.clone();default:return null}}function ut(e,t){return!!t&&(e==null?void 0:e.type)==="unique-value"&&typeof e.field=="string"&&e.field.toLowerCase()===t.toLowerCase()&&!e.field2&&!e.field3&&!e.valueExpression}function J(e,t){var r;return e==null?null:(r=t.subtypes)==null?void 0:r.find(s=>s.code===e)}function dt(e,t){let r=null;switch(t.geometryType){case"esriGeometryPoint":case"esriGeometryMultipoint":r="point";break;case"esriGeometryPolyline":r="line";break;case"esriGeometryPolygon":case"esriGeometryMultiPatch":r="polygon";break;default:t.type,r=null}const s={},a=J(e,t);if(a!=null){const{defaultValues:o}=a;for(const u in o)s[u]=o[u]}return s[t.subtypeField]=e,new U({name:"New Feature",drawingTool:r,prototype:{attributes:s}})}const K="esri.layers.support.SubtypeSublayer";let l=class extends D(k(W(ve))){constructor(e){super(e),this.charts=null,this.editingEnabled=!0,this.fieldOverrides=null,this.fieldsIndex=null,this.formTemplate=null,this.id=`${Date.now().toString(16)}-subtype-sublayer-${at++}`,this.type="subtype-sublayer",this.labelsVisible=!0,this.labelingInfo=null,this.layerType="ArcGISFeatureLayer",this.legendEnabled=!0,this.listMode="show",this.minScale=0,this.maxScale=0,this.opacity=1,this.parent=null,this.popupEnabled=!0,this.popupTemplate=null,this.subtypeCode=null,this.templates=null,this.title=null,this.visible=!0}get capabilities(){var e;return(e=this.parent)==null?void 0:e.capabilities}get effectiveCapabilities(){var e;return(e=this.parent)==null?void 0:e.effectiveCapabilities}get effectiveEditingEnabled(){const{parent:e}=this;return e?e.effectiveEditingEnabled&&this.editingEnabled:this.editingEnabled}get elevationInfo(){var e;return(e=this.parent)==null?void 0:e.elevationInfo}writeFieldOverrides(e,t,r){const{fields:s,parent:a}=this;let o;if(s){o=[];let u=0;s.forEach(({name:y,alias:c,editable:f,visible:m})=>{var $;if(!m)return;const p=($=a==null?void 0:a.fields)==null?void 0:$.find(F=>F.name===y);if(!p)return;const g={name:y};let w=!1;c!==p.alias&&(g.alias=c,w=!0),f!==p.editable&&(g.editable=f,w=!0),o.push(g),w&&u++}),u===0&&o.length===s.length&&(o=null)}else o=S(e);o!=null&&o.length&&X(r,o,t)}get fields(){const{parent:e,fieldOverrides:t,subtypeCode:r}=this,s=e==null?void 0:e.fields;if(!e||!(s!=null&&s.length))return null;const{subtypes:a,subtypeField:o}=e,u=a==null?void 0:a.find(m=>m.code===r),y=u==null?void 0:u.defaultValues,c=u==null?void 0:u.domains,f=[];for(const m of s){const p=m.clone(),{name:g}=p,w=t==null?void 0:t.find(E=>E.name===g);if(p.visible=!t||!!w,w){const{alias:E,editable:Y}=w;E&&(p.alias=E),Y===!1&&(p.editable=!1)}const $=(y==null?void 0:y[g])??null;p.defaultValue=g===o?r:$;const F=(c==null?void 0:c[g])??null;p.domain=g===o?null:F?F.type==="inherited"?p.domain:F.clone():null,f.push(p)}return f}get floorInfo(){var e;return(e=this.parent)==null?void 0:e.floorInfo}get geometryType(){var e;return(e=this.parent)==null?void 0:e.geometryType}get effectiveScaleRange(){const{minScale:e,maxScale:t}=this;return{minScale:e,maxScale:t}}get objectIdField(){var e;return this.parent||ee.getLogger(K).error(v("objectIdField")),(e=this.parent)==null?void 0:e.objectIdField}get defaultPopupTemplate(){return this.createPopupTemplate()}set renderer(e){te(e,this.fieldsIndex),this._override("renderer",e)}get renderer(){if(this._isOverridden("renderer"))return this._get("renderer");const{parent:e}=this;return e&&!e.isTable&&e.geometryType!=="mesh"?ot(e.geometryType):null}readRendererFromService(e,t,r){var y,c,f;if(t.type==="Table")return null;const s=(y=t.drawingInfo)==null?void 0:y.renderer,a=G(s,t,r);let o;const{subtypeCode:u}=this;if(u!=null&&ut(a,t.subtypeField)){const m=(c=a.uniqueValueInfos)==null?void 0:c.find(({value:p})=>(p=typeof p=="number"?String(p):p)===String(u));m&&(o=new A({symbol:m.symbol}))}else(a==null?void 0:a.type)!=="simple"||(f=a.visualVariables)!=null&&f.length||(o=a);return o}readRenderer(e,t,r){var o,u,y;const s=(u=(o=t==null?void 0:t.layerDefinition)==null?void 0:o.drawingInfo)==null?void 0:u.renderer;return s?((y=s.visualVariables)==null?void 0:y.some(c=>c.type!=="rotationInfo"))?void 0:G(s,t,r)||void 0:void 0}get spatialReference(){var e;return(e=this.parent)==null?void 0:e.spatialReference}readTemplatesFromService(e,t){return[dt(this.subtypeCode,t)]}readTitleFromService(e,t){const r=J(this.subtypeCode,t);return r!=null?r.name:null}get url(){var e;return(e=this.parent)==null?void 0:e.url}get userHasUpdateItemPrivileges(){var e;return!!((e=this.parent)!=null&&e.userHasUpdateItemPrivileges)}async addAttachment(e,t){const{parent:r}=this;if(!r)throw v("addAttachment");if(e.getAttribute(r.subtypeField)!==this.subtypeCode)throw new b("subtype-sublayer:addAttachment","The feature provided does not belong to this SubtypeSublayer");return r.addAttachment(e,t)}async updateAttachment(e,t,r){const{parent:s}=this;if(!s)throw v("updateAttachment");if(e.getAttribute(s.subtypeField)!==this.subtypeCode)throw new b("subtype-sublayer:updateAttachment","The feature provided does not belong to this SubtypeSublayer");return s.updateAttachment(e,t,r)}async deleteAttachments(e,t){const{parent:r}=this;if(!r)throw v("deleteAttachments");if(e.getAttribute(r.subtypeField)!==this.subtypeCode)throw new b("subtype-sublayer:deleteAttachments","The feature provided does not belong to this SubtypeSublayer");return r.deleteAttachments(e,t)}async applyEdits(e,t){if(!this.parent)throw v("applyEdits");return this.parent.applyEdits(e,t)}createPopupTemplate(e){let t=this;const{parent:r,fields:s,title:a}=this;if(r){const{displayField:o,editFieldsInfo:u,objectIdField:y}=r;t={displayField:o,editFieldsInfo:u,fields:s,objectIdField:y,title:a}}return re(t,e)}createQuery(){if(!this.parent)throw v("createQuery");const e=N(this.parent),t=`${this.parent.subtypeField}=${this.subtypeCode}`;return e.where=L(t,this.parent.definitionExpression),e}getField(e){return this.fieldsIndex.get(e)}getFieldDomain(e){return this._getLayerDomain(e)}hasUserOverrides(){return nt.some(e=>this.originIdOf(e)===M.USER)}async queryAttachments(e,t){const r=await this.load();if(!r.parent)throw v("queryAttachments");const s=e.clone();return s.where=V(s.where,r.parent.subtypeField,r.subtypeCode),r.parent.queryAttachments(e,t)}async queryFeatures(e,t){const r=await this.load();if(!r.parent)throw v("queryFeatures");const s=Q.from(e)??r.createQuery();return e!=null&&(s.where=V(s.where,r.parent.subtypeField,r.subtypeCode)),r.parent.queryFeatures(s,t)}_getLayerDomain(e){const t=this.fieldsIndex.get(e);return t?t.domain:null}};i([n({readOnly:!0,json:{read:!1}})],l.prototype,"capabilities",null),i([n({readOnly:!0,json:{read:!1}})],l.prototype,"effectiveCapabilities",null),i([n({json:{write:{ignoreOrigin:!0}}})],l.prototype,"charts",void 0),i([n({type:Boolean,nonNullable:!0,json:{name:"enableEditing",write:{ignoreOrigin:!0}}})],l.prototype,"editingEnabled",void 0),i([n({type:Boolean,readOnly:!0})],l.prototype,"effectiveEditingEnabled",null),i([n({readOnly:!0,json:{read:!1}})],l.prototype,"elevationInfo",null),i([n({json:{name:"layerDefinition.fieldOverrides",origins:{service:{read:!1}},write:{ignoreOrigin:!0,allowNull:!0}}})],l.prototype,"fieldOverrides",void 0),i([ie("fieldOverrides")],l.prototype,"writeFieldOverrides",null),i([n({...q.fields,readOnly:!0,json:{read:!1}})],l.prototype,"fields",null),i([n(q.fieldsIndex)],l.prototype,"fieldsIndex",void 0),i([n({readOnly:!0,json:{read:!1}})],l.prototype,"floorInfo",null),i([n({type:se,json:{name:"formInfo",write:{ignoreOrigin:!0}}})],l.prototype,"formTemplate",void 0),i([n({type:String,clonable:!1,readOnly:!0,json:{origins:{service:{read:!1}},write:{ignoreOrigin:!0}}})],l.prototype,"id",void 0),i([n({readOnly:!0,json:{read:!1}})],l.prototype,"geometryType",null),i([n({readOnly:!0,json:{read:!1}})],l.prototype,"type",void 0),i([n(I(S(ne)))],l.prototype,"labelsVisible",void 0),i([n({type:[ae],json:{name:"layerDefinition.drawingInfo.labelingInfo",origins:{service:{read:!1}},read:{reader:oe},write:{ignoreOrigin:!0}}})],l.prototype,"labelingInfo",void 0),i([n({type:["ArcGISFeatureLayer"],readOnly:!0,json:{read:!1,write:{ignoreOrigin:!0}}})],l.prototype,"layerType",void 0),i([n(I(S(le)))],l.prototype,"legendEnabled",void 0),i([n({type:["show","hide"]})],l.prototype,"listMode",void 0),i([n((()=>{const e=S(ue);return e.json.origins.service.read=!1,I(e)})())],l.prototype,"minScale",void 0),i([n((()=>{const e=S(de);return e.json.origins.service.read=!1,I(e)})())],l.prototype,"maxScale",void 0),i([n({readOnly:!0})],l.prototype,"effectiveScaleRange",null),i([n({readOnly:!0,json:{read:!1}})],l.prototype,"objectIdField",null),i([n({type:Number,range:{min:0,max:1},nonNullable:!0,json:{write:{ignoreOrigin:!0}}})],l.prototype,"opacity",void 0),i([n({clonable:!1})],l.prototype,"parent",void 0),i([n(I(S(pe)))],l.prototype,"popupEnabled",void 0),i([n({type:ye,json:{name:"popupInfo",write:{ignoreOrigin:!0}}})],l.prototype,"popupTemplate",void 0),i([n({readOnly:!0})],l.prototype,"defaultPopupTemplate",null),i([n({types:z,json:{write:{target:"layerDefinition.drawingInfo.renderer",ignoreOrigin:!0}}})],l.prototype,"renderer",null),i([O("service","renderer",["drawingInfo.renderer","subtypeField","type"])],l.prototype,"readRendererFromService",null),i([O("renderer",["layerDefinition.drawingInfo.renderer"])],l.prototype,"readRenderer",null),i([n({readOnly:!0,json:{read:!1}})],l.prototype,"spatialReference",null),i([n({type:Number,json:{origins:{service:{read:!1}},write:{ignoreOrigin:!0}}})],l.prototype,"subtypeCode",void 0),i([n({type:[U],json:{name:"layerDefinition.templates",write:{ignoreOrigin:!0}}})],l.prototype,"templates",void 0),i([O("service","templates",["geometryType","subtypeField","subtypes","type"])],l.prototype,"readTemplatesFromService",null),i([n({type:String,json:{write:{ignoreOrigin:!0}}})],l.prototype,"title",void 0),i([O("service","title",["subtypes"])],l.prototype,"readTitleFromService",null),i([n({readOnly:!0,json:{read:!1}})],l.prototype,"url",null),i([n({readOnly:!0})],l.prototype,"userHasUpdateItemPrivileges",null),i([n({type:Boolean,nonNullable:!0,json:{name:"visibility",write:{ignoreOrigin:!0}}})],l.prototype,"visible",void 0),l=i([H(K)],l);const V=(e,t,r)=>{const s=new RegExp(`${t}\\s*=\\s*\\d+`),a=`${t}=${r}`,o=e??"";return s.test(o)?o.replace(s,a):L(a,o)},v=e=>new b(`This sublayer must have a parent SubtypeGroupLayer in order to use ${e}`),j=l,h="SubtypeGroupLayer",pt="esri.layers.SubtypeGroupLayer";function R(e,t){return new b("layer:unsupported",`Layer (${e.title}, ${e.id}) of type '${e.declaredClass}' ${t}`,{layer:e})}const _=B();let d=class extends we(Se(Fe(Ie(Oe($e(Ee(Te(je(D(_e(Ce(k(st))))))))))))){constructor(...e){super(...e),this._sublayersCollectionChanged=!1,this._sublayerLookup=new Map,this.fields=null,this.fieldsIndex=null,this.outFields=null,this.sublayers=new(C.ofType(j)),this.timeInfo=null,this.title="Layer",this.type="subtype-group",this._debouncedSaveOperations=Ae(async(t,r,s)=>{const{save:a,saveAs:o}=await x(()=>import("./featureLayerUtils-O3QFCcKX.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9]));switch(t){case T.SAVE:return a(this,r);case T.SAVE_AS:return o(this,s,r)}}),this.addHandles(Le(()=>this.sublayers,(t,r)=>this._handleSublayersChange(t,r),xe))}destroy(){var e;(e=this.source)==null||e.destroy()}normalizeCtorArgs(e,t){return typeof e=="string"?{url:e,...t}:e}load(e){const t=e!=null?e.signal:null,r=this.loadFromPortal({supportedTypes:["Feature Service"]},e).catch(Pe).then(async()=>{if(!this.url)throw new b("subtype-grouplayer:missing-url-or-source","SubtypeGroupLayer must be created with either a url or a portal item");if(this.layerId==null)throw new b("subtype-grouplayer:missing-layerid","layerId is required for a SubtypeGroupLayer created with url");return this._initLayerProperties(await this.createGraphicsSource(t))}).then(()=>qe(this,"load",e));return this.addResolvingPromise(r),Promise.resolve(this)}get createQueryVersion(){return this.commitProperty("definitionExpression"),this.commitProperty("timeExtent"),this.commitProperty("timeOffset"),this.commitProperty("geometryType"),this.commitProperty("gdbVersion"),this.commitProperty("historicMoment"),this.commitProperty("returnZ"),this.commitProperty("capabilities"),this.commitProperty("returnM"),(this._get("createQueryVersion")??0)+1}get editingEnabled(){return this.loaded&&this.capabilities!=null&&this.capabilities.operations.supportsEditing&&this.userHasEditingPrivileges}get effectiveEditingEnabled(){return Ge(this)}get parsedUrl(){const e=Ve(this.url);return e!=null&&this.layerId!=null&&(e.path=Re(e.path,this.layerId.toString())),e}set source(e){this._get("source")!==e&&this._set("source",e)}readTitleFromService(e,{name:t}){return this.url?De(this.url,t):t}async addAttachment(e,t){return ke(this,e,t,h)}async updateAttachment(e,t,r){return Ne(this,e,t,r,h)}async applyEdits(e,t){return Me(this,e,t)}on(e,t){return super.on(e,t)}async createGraphicsSource(e){const{default:t}=await Qe(x(()=>import("./FeatureLayerSource-yOng1yIU.js"),__vite__mapDeps([10,1,2,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28])),e);return new t({layer:this}).load({signal:e})}createQuery(){const e=N(this),t=this.sublayers.map(r=>r.subtypeCode);return e.where=L(`${this.subtypeField} IN (${t.join(",")})`,this.definitionExpression),e}async deleteAttachments(e,t){return Ue(this,e,t,h)}async fetchRecomputedExtents(e){return He(this,e,h)}findSublayerForFeature(e){const t=this.fieldsIndex.get(this.subtypeField),r=e.attributes[t.name];return this.findSublayerForSubtypeCode(r)}findSublayerForSubtypeCode(e){return this._sublayerLookup.get(e)}getFieldDomain(e,t){return this._getLayerDomain(e)}getField(e){return this.fieldsIndex.get(e)}loadAll(){return Be(this,e=>{e(this.sublayers)})}async queryAttachments(e,t){return ze(this,e,t,h)}async queryFeatures(e,t){const r=await this.load(),s=Q.from(e)??r.createQuery(),a=s.outFields??[];a.includes(this.subtypeField)||(a.push(this.subtypeField),s.outFields=a);const o=await r.source.queryFeatures(s,t);if(o!=null&&o.features)for(const u of o.features)u.layer=u.sourceLayer=this.findSublayerForFeature(u);return o}async queryObjectIds(e,t){return Je(this,e,t,h)}async queryFeatureCount(e,t){return Ke(this,e,t,h)}async queryExtent(e,t){return Ye(this,e,t,h)}async queryRelatedFeatures(e,t){return Ze(this,e,t,h)}async queryRelatedFeaturesCount(e,t){return We(this,e,t,h)}async save(e){return this._debouncedSaveOperations(T.SAVE,e)}async saveAs(e,t){return this._debouncedSaveOperations(T.SAVE_AS,t,e)}write(e,t){var o;const{origin:r,layerContainerType:s,messages:a}=t;if(this.isTable){if(r==="web-scene"||r==="web-map"&&s!=="tables")return a==null||a.push(R(this,"using a table source cannot be written to web scenes and web maps")),null}else if(this.loaded&&r==="web-map"&&s==="tables")return a==null||a.push(R(this,"using a non-table source cannot be written to tables in web maps")),null;return(o=this.sublayers)!=null&&o.length?super.write(e,t):(a==null||a.push(new b("web-document-write:invalid-property",`Layer (${this.title}, ${this.id}) of type '${this.declaredClass}' has invalid value for 'sublayers' property. 'sublayers' collection should contain at least one sublayer`,{layer:this})),null)}serviceSupportsSpatialReference(e){return!!this.loaded&&Xe(this,e)}_getLayerDomain(e){const t=this.fieldsIndex.get(e);return t?t.domain:null}async _initLayerProperties(e){var r;this._set("source",e);const{sourceJSON:t}=e;if(t&&(this.sourceJSON=t,this.read(t,{origin:"service",url:this.parsedUrl})),this.isTable)throw new b("subtype-grouplayer:unsupported-source","SubtypeGroupLayer cannot be created using a layer with table source");if(!((r=this.subtypes)!=null&&r.length))throw new b("subtype-grouplayer:missing-subtypes","SubtypeGroupLayer must be created using a layer with subtypes");this._verifyFields(),et(this.timeInfo,this.fieldsIndex)}async hasDataChanged(){return tt(this)}_verifyFields(){var t,r;const e=((t=this.parsedUrl)==null?void 0:t.path)??"undefined";this.objectIdField||console.log("SubtypeGroupLayer: 'objectIdField' property is not defined (url: "+e+")"),this.isTable||e.search(/\/FeatureServer\//i)!==-1||(r=this.fields)!=null&&r.some(s=>s.type==="geometry")||console.log("SubtypeGroupLayer: unable to find field of type 'geometry' in the layer 'fields' list. If you are using a map service layer, features will not have geometry (url: "+e+")")}_handleSublayersChange(e,t){t&&(t.forEach(r=>{r.parent=null}),this.removeHandles("sublayers-owner"),this._sublayerLookup.clear()),e&&(e.forEach(r=>{r.parent=this,this._sublayerLookup.set(r.subtypeCode,r)}),this._sublayersCollectionChanged=!1,this.addHandles([e.on("after-add",({item:r})=>{r.parent=this,this._sublayerLookup.set(r.subtypeCode,r)}),e.on("after-remove",({item:r})=>{r.parent=null,this._sublayerLookup.delete(r.subtypeCode)}),e.on("after-changes",()=>{this._sublayersCollectionChanged=!0})],"sublayers-owner"))}};i([n({readOnly:!0})],d.prototype,"createQueryVersion",null),i([n({readOnly:!0})],d.prototype,"editingEnabled",null),i([n({readOnly:!0})],d.prototype,"effectiveEditingEnabled",null),i([n({..._.fields,readOnly:!0,json:{origins:{service:{read:!0}},read:!1}})],d.prototype,"fields",void 0),i([n(_.fieldsIndex)],d.prototype,"fieldsIndex",void 0),i([n(rt)],d.prototype,"id",void 0),i([n({type:["show","hide","hide-children"],json:{origins:{"portal-item":{read:!1,write:!1}}}})],d.prototype,"listMode",void 0),i([n({value:"SubtypeGroupLayer",type:["SubtypeGroupLayer"],json:{origins:{"portal-item":{name:"layerType",write:{enabled:!0,ignoreOrigin:!0}}}}})],d.prototype,"operationalLayerType",void 0),i([n(_.outFields)],d.prototype,"outFields",void 0),i([n({readOnly:!0})],d.prototype,"parsedUrl",null),i([n({clonable:!1})],d.prototype,"source",null),i([n({type:C.ofType(j),json:{origins:{service:{read:{source:"subtypes",reader:(e,t,r)=>{const s=e.map(({code:a})=>{const o=new j({subtypeCode:a});return o.read(t,r),o});return new(C.ofType(j))(s)}}}},name:"layers",write:{overridePolicy(e,t,r){const s=this.originOf("sublayers"),a=M.PORTAL_ITEM;let o=!0;if(P(s)===a&&P(r.origin)>a){const u=e.some(y=>y.hasUserOverrides());o=this._sublayersCollectionChanged||u}return{enabled:o,ignoreOrigin:!0}}}}})],d.prototype,"sublayers",void 0),i([n({type:it})],d.prototype,"timeInfo",void 0),i([n({json:{origins:{"portal-item":{write:{enabled:!0,ignoreOrigin:!0,writerEnsuresNonNull:!0}}}}})],d.prototype,"title",void 0),i([O("service","title",["name"])],d.prototype,"readTitleFromService",null),i([n({json:{read:!1}})],d.prototype,"type",void 0),d=i([H(pt)],d);const ct=d;export{ct as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/featureLayerUtils-O3QFCcKX.js","assets/index-VKzKZO7f.js","assets/index-WNcDpzZe.css","assets/originUtils-1w5HeAJR.js","assets/multiOriginJSONSupportUtils-R5XHSAtL.js","assets/utils-2c1vJxsn.js","assets/jsonContext-MQswQMVf.js","assets/saveAPIKeyUtils-yaUJgeuA.js","assets/fetchService-PeTBri6U.js","assets/lazyLayerLoader-JeGoN56x.js","assets/FeatureLayerSource-yOng1yIU.js","assets/mat4f64-aoQZ5j3f.js","assets/MeshGeoreferencedRelativeVertexSpace-AHCpvHHH.js","assets/vec32-1zbxPsaF.js","assets/External-63JwVhd-.js","assets/editingSupport-cjrSUdqf.js","assets/clientSideDefaults-MJcKBWyI.js","assets/QueryEngineCapabilities-PzVpW5yD.js","assets/QueryTask-ze-WVbx2.js","assets/executeForIds-akBruPsJ.js","assets/query-TAb1ue98.js","assets/pbfQueryUtils-abZUm-11.js","assets/pbf-lnf4wP9x.js","assets/OptimizedGeometry-CbNXANBG.js","assets/OptimizedFeature-5RGb7-P9.js","assets/OptimizedFeatureSet-smVI1ez9.js","assets/executeQueryJSON-CF2wuT8V.js","assets/executeQueryPBF-LU_H4aIR.js","assets/featureConversionUtils-BWQUVu-o.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}