import{q as s,t as o,v,bz as R,m as b,o as _,D as P,eY as F,b7 as D,w as f,fX as A,dG as I,W as C,ez as U,s as V,aL as M,aO as E,b as O,ev as $,V as S,e as q}from"./index-VKzKZO7f.js";import{d as j,f as L,h as H}from"./RasterVFDisplayObject-7_9JW9hf.js";import{m as N,u as G}from"./LayerView-Qp6_9W5J.js";import{r as J}from"./GraphicsView2D-0qP6KJNo.js";import{a as W}from"./HighlightGraphicContainer-LkojRYMI.js";import{M as X,m as Y,f as K}from"./dataUtils-0U7Sk30R.js";import{a as Q}from"./BitmapContainer-hM5hZC2P.js";import{h as Z}from"./Container-UpQg3xun.js";import{l as ee}from"./Bitmap-ggnakWxk.js";import{v as te}from"./ExportStrategy-vQ5rmsnn.js";import{J as ie}from"./rasterProjectionHelper-nALbwQSV.js";import{T}from"./color-pHhR-7ZF.js";import{n as re}from"./WGLContainer-4UnP5wOT.js";import{p as ae}from"./popupUtils-Nw4Un01o.js";import{a as se}from"./RefreshableLayerView-Hs2KB5PN.js";import"./FramebufferObject-IdEtih_x.js";import"./Texture-ttVQzCCP.js";import"./enums-8pc8f5Ge.js";import"./ProgramTemplate-7Tv2kNbT.js";import"./VertexElementDescriptor-0hGjloLE.js";import"./cimAnalyzer-iRFz9KIb.js";import"./fontUtils-hPwpNX2C.js";import"./BidiEngine-8z8MVveq.js";import"./labelPoint-yPuIZs9z.js";import"./OptimizedGeometry-CbNXANBG.js";import"./GeometryUtils-CEMOhUyj.js";import"./enums--FbEXJ87.js";import"./alignmentUtils-XT3TYmYW.js";import"./definitions-E24bk0CL.js";import"./number-sTjsTbdA.js";import"./Rect-pT1ASav_.js";import"./quantizationUtils-2fXOOP7N.js";import"./floatRGBA-BYgffytb.js";import"./normalizeUtilsSync-Dy1jsTGX.js";import"./projectionSupport-BWmnjjdZ.js";import"./json-v6EOeNTY.js";import"./AttributeStoreView-MRQ_O8ZQ.js";import"./TiledDisplayObject-xLRQgOBj.js";import"./visualVariablesUtils-ntJ2DLa-.js";import"./GeometryUtils-aCVx5shy.js";import"./ExpandedCIM-bDhfO5g0.js";import"./util-Lg-YQ9o4.js";import"./Matcher-RfZ96JVZ.js";import"./tileUtils-pcBJnprf.js";import"./TurboLine-G_G1OWoq.js";import"./earcut-oQoS0VMT.js";import"./ComputedAttributeStorage--QoWsBdC.js";import"./featureConversionUtils-BWQUVu-o.js";import"./OptimizedFeature-5RGb7-P9.js";import"./OptimizedFeatureSet-smVI1ez9.js";import"./TimeOnly-wEYL_T2J.js";import"./BaseGraphicContainer-jye_eWHU.js";import"./FeatureContainer-kt8Ai8Qm.js";import"./TileContainer-zYqZGa_B.js";import"./vec3f32-6rWBPTzX.js";import"./StyleDefinition-ohiNeWtS.js";import"./config-z2KFXUcx.js";let h=class extends R{constructor(){super(...arguments),this.attached=!1,this.container=new Z,this.updateRequested=!1,this.type="imagery",this._bitmapView=new Q}destroy(){this.attached&&(this.detach(),this.attached=!1),this.updateRequested=!1}get updating(){return!this.attached||this.isUpdating()}update(e){this.strategy.update(e).catch(t=>{b(t)||_.getLogger(this).error(t)})}hitTest(e){return new P({attributes:{},geometry:e.clone(),layer:this.layer})}attach(){this.container.addChild(this._bitmapView);const e=this.layer.version>=10,t=this.layer.version>=10.1?this.layer.imageMaxHeight:2048,i=this.layer.version>=10.1?this.layer.imageMaxWidth:2048;this.strategy=new te({container:this._bitmapView,imageNormalizationSupported:e,imageMaxHeight:t,imageMaxWidth:i,fetchSource:this._fetchImage.bind(this),requestUpdate:()=>this.requestUpdate()})}detach(){this.strategy.destroy(),this._bitmapView.removeAllChildren(),this.container.removeAllChildren(),this.updateRequested=!1}redraw(){this.strategy.updateExports(async e=>{const{source:t}=e;if(!t||t instanceof ImageBitmap)return;const i=await this.layer.applyRenderer({extent:t.extent,pixelBlock:t.originalPixelBlock??t.pixelBlock});t.filter=r=>this.layer.pixelFilter?this.layer.applyFilter(r):{...i,extent:t.extent}}).catch(e=>{b(e)||_.getLogger(this).error(e)})}requestUpdate(){this.updateRequested||(this.updateRequested=!0,this.view.requestUpdate())}isUpdating(){return this.strategy.updating||this.updateRequested}getPixelData(){if(this.updating)return null;const e=this.strategy.bitmaps;if(e.length===1&&e[0].source)return{extent:e[0].source.extent,pixelBlock:e[0].source.originalPixelBlock};if(e.length>1){const t=this.view.extent,i=e.map(a=>a.source).filter(a=>a.extent&&a.extent.intersects(t)).map(a=>({extent:a.extent,pixelBlock:a.originalPixelBlock})),r=X(i,t);return r!=null?{extent:r.extent,pixelBlock:r.pixelBlock}:null}return null}async _fetchImage(e,t,i,r){var m;(r=r||{}).timeExtent=this.timeExtent,r.requestAsImageElement=!0,r.returnImageBitmap=!0;const a=await this.layer.fetchImage(e,t,i,r);if(a.imageBitmap)return a.imageBitmap;const n=await this.layer.applyRenderer(a.pixelData,{signal:r.signal}),l=new ee(n.pixelBlock,(m=n.extent)==null?void 0:m.clone(),a.pixelData.pixelBlock);return l.filter=p=>this.layer.applyFilter(p),l}};s([o()],h.prototype,"attached",void 0),s([o()],h.prototype,"container",void 0),s([o()],h.prototype,"layer",void 0),s([o()],h.prototype,"strategy",void 0),s([o()],h.prototype,"timeExtent",void 0),s([o()],h.prototype,"view",void 0),s([o()],h.prototype,"updateRequested",void 0),s([o()],h.prototype,"updating",null),s([o()],h.prototype,"type",void 0),h=s([v("esri.views.2d.layers.imagery.ImageryView2D")],h);const oe=h;class ne extends re{constructor(){super(...arguments),this.symbolTypes=["triangle"]}prepareRenderPasses(t){const i=t.registerRenderPass({name:"imagery (vf)",brushes:[j],target:()=>this.children,drawPhase:T.MAP});return[...super.prepareRenderPasses(t),i]}doRender(t){this.visible&&t.drawPhase===T.MAP&&this.symbolTypes.forEach(i=>{t.renderPass=i,super.doRender(t)})}}let y=class extends R{constructor(e){super(e),this._loading=null,this.update=F((t,i)=>this._update(t,i).catch(r=>{b(r)||_.getLogger(this).error(r)}))}get updating(){return!!this._loading}redraw(e){if(!this.container.children.length)return;const t=this.container.children[0];t.symbolizerParameters=e,t.invalidateVAO(),this.container.symbolTypes=e.style==="wind_speed"?["scalar","triangle"]:e.style==="simple_scalar"?["scalar"]:["triangle"],this.container.requestRender()}async _update(e,t,i){if(!e.stationary)return;const{extent:r,spatialReference:a}=e.state,n=new D({xmin:r.xmin,ymin:r.ymin,xmax:r.xmax,ymax:r.ymax,spatialReference:a}),[l,m]=e.state.size;this._loading=this.fetchPixels(n,l,m,i);const p=await this._loading;this._addToDisplay(p,t,e.state),this._loading=null}_addToDisplay(e,t,i){if(e.pixelBlock==null)return this.container.children.forEach(l=>l.destroy()),void this.container.removeAllChildren();const{extent:r,pixelBlock:a}=e,n=new L(a);n.offset=[0,0],n.symbolizerParameters=t,n.rawPixelData=e,n.invalidateVAO(),n.x=r.xmin,n.y=r.ymax,n.pixelRatio=i.pixelRatio,n.rotation=i.rotation,n.resolution=i.resolution,n.width=a.width*t.symbolTileSize,n.height=a.height*t.symbolTileSize,this.container.children.forEach(l=>l.destroy()),this.container.removeAllChildren(),this.container.symbolTypes=t.style==="wind_speed"?["scalar","triangle"]:t.style==="simple_scalar"?["scalar"]:["triangle"],this.container.addChild(n)}};s([o()],y.prototype,"fetchPixels",void 0),s([o()],y.prototype,"container",void 0),s([o()],y.prototype,"_loading",void 0),s([o()],y.prototype,"updating",null),y=s([v("esri.views.2d.layers.imagery.ImageryVFStrategy")],y);const le=y;let c=class extends R{constructor(){super(...arguments),this.attached=!1,this.container=new ne,this.type="imageryVF",this._dataParameters={exportParametersVersion:0,bbox:"",symbolTileSize:0,time:""},this._fetchpixels=async(e,t,i,r)=>{const a=await this._projectFullExtentPromise,{symbolTileSize:n}=this.layer.renderer,{extent:l,width:m,height:p}=Y(e,t,i,n,a);if(a!=null&&!a.intersects(e))return{extent:l,pixelBlock:null};const d={bbox:`${l.xmin}, ${l.ymin}, ${l.xmax}, ${l.ymax}`,exportParametersVersion:this.layer.exportImageServiceParameters.version,symbolTileSize:n,time:JSON.stringify(this.timeExtent||"")};if(this._canReuseVectorFieldData(d)){const u=this.getPixelData();if(u!=null&&`${u.extent.xmin}, ${u.extent.ymin}, ${u.extent.xmax}, ${u.extent.ymax}`===d.bbox)return u}const{pixelData:g}=await this.layer.fetchImage(l,m,p,{timeExtent:this.timeExtent,requestAsImageElement:!1,signal:r});this._dataParameters=d;const x=g==null?void 0:g.pixelBlock;return x==null?{extent:l,pixelBlock:null}:{extent:l,pixelBlock:this.layer.rasterInfo.dataType==="vector-uv"?K(x,"vector-uv"):x}}}get updating(){return!this.attached||this._strategy.updating}attach(){this._projectFullExtentPromise=this._getProjectedFullExtent(this.view.spatialReference),this._strategy=new le({container:this.container,fetchPixels:this._fetchpixels}),this.addHandles(f(()=>this.layer.renderer,e=>this._updateSymbolizerParams(e),A),"attach")}detach(){this._strategy.destroy(),this.container.children.forEach(e=>e.destroy()),this.container.removeAllChildren(),this.removeHandles("attach"),this._strategy=this.container=this._projectFullExtentPromise=null}getPixelData(){var r;const e=(r=this.container.children[0])==null?void 0:r.rawPixelData;if(this.updating||!e)return null;const{extent:t,pixelBlock:i}=e;return{extent:t,pixelBlock:i}}hitTest(e){return new P({attributes:{},geometry:e.clone(),layer:this.layer})}update(e){this._strategy.update(e,this._symbolizerParams).catch(t=>{b(t)||_.getLogger(this).error(t)})}redraw(){const{renderer:e}=this.layer;e&&(this._updateSymbolizerParams(e),this._strategy.redraw(this._symbolizerParams))}_canReuseVectorFieldData(e){const t=this._dataParameters.exportParametersVersion===e.exportParametersVersion,i=this._dataParameters.time===e.time,r=this._dataParameters.symbolTileSize===e.symbolTileSize,a=this._dataParameters.bbox===e.bbox;return t&&i&&r&&a}async _getProjectedFullExtent(e){try{return ie(this.layer.fullExtent,e)}catch{try{const i=(await C(this.layer.url,{query:{option:"footprints",outSR:I(e),f:"json"}})).data.featureCollection.layers[0].layerDefinition.extent;return i?D.fromJSON(i):null}catch{return null}}}_updateSymbolizerParams(e){e.type==="vector-field"&&(this._symbolizerParams=this.layer.symbolizer.generateWebGLParameters({pixelBlock:null}))}};s([o()],c.prototype,"attached",void 0),s([o()],c.prototype,"container",void 0),s([o()],c.prototype,"layer",void 0),s([o()],c.prototype,"timeExtent",void 0),s([o()],c.prototype,"type",void 0),s([o()],c.prototype,"view",void 0),s([o()],c.prototype,"updating",null),c=s([v("esri.views.2d.layers.imagery.VectorFieldView2D")],c);const he=c,pe=e=>{let t=class extends e{constructor(){super(...arguments),this.view=null}async fetchPopupFeatures(i,r){const{layer:a}=this;if(!i)throw new V("imagerylayerview:fetchPopupFeatures","Nothing to fetch without area",{layer:a});const{popupEnabled:n}=a,l=ae(a,r);if(!n||l==null)throw new V("imagerylayerview:fetchPopupFeatures","Missing required popupTemplate or popupEnabled",{popupEnabled:n,popupTemplate:l});const m=await l.getRequiredFields(),p=new M;p.timeExtent=this.timeExtent,p.geometry=i,p.outFields=m,p.outSpatialReference=i.spatialReference;const{resolution:d,spatialReference:g}=this.view,x=this.view.type==="2d"?new E(d,d,g):new E(.5*d,.5*d,g),{returnTopmostRaster:u,showNoDataRecords:B}=l.layerOptions||{returnTopmostRaster:!0,showNoDataRecords:!1},k={returnDomainValues:!0,returnTopmostRaster:u,pixelSize:x,showNoDataRecords:B,signal:r!=null?r.signal:null};return a.queryVisibleRasters(p,k).then(z=>z)}canResume(){var i;return!!super.canResume()&&!((i=this.timeExtent)!=null&&i.isEmpty)}};return s([o()],t.prototype,"layer",void 0),s([o()],t.prototype,"suspended",void 0),s([o(U)],t.prototype,"timeExtent",void 0),s([o()],t.prototype,"view",void 0),t=s([v("esri.views.layers.ImageryLayerView")],t),t};let w=class extends pe(se(N(G))){constructor(){super(...arguments),this._exportImageVersion=-1,this._highlightGraphics=new O,this._highlightView=void 0,this.layer=null,this.subview=null}get pixelData(){const{subview:e}=this;return this.updating||!e?null:"getPixelData"in e?e.getPixelData():null}async hitTest(e,t){return this.subview?[{type:"graphic",graphic:this.subview.hitTest(e),layer:this.layer,mapPoint:e}]:null}update(e){var t;(t=this.subview)==null||t.update(e)}attach(){this.layer.increaseRasterJobHandlerUsage(),this._setSubView(),this.view&&(this._highlightView=new J({view:this.view,graphics:this._highlightGraphics,requestUpdateCallback:()=>this.requestUpdate(),container:new W(this.view.featuresTilingScheme)}),this.container.addChild(this._highlightView.container)),this.addAttachHandles([f(()=>this.layer.exportImageServiceParameters.version,e=>{e&&this._exportImageVersion!==e&&(this._exportImageVersion=e,this.requestUpdate())},$),f(()=>this.timeExtent,e=>{const{subview:t}=this;t&&(t.timeExtent=e,"redraw"in t?this.requestUpdate():t.redrawOrRefetch())},$),this.layer.on("redraw",()=>{const{subview:e}=this;e&&("redraw"in e?e.redraw():e.redrawOrRefetch())}),f(()=>this.layer.renderer,()=>this._setSubView())])}detach(){var e,t;this.layer.decreaseRasterJobHandlerUsage(),this.container.removeAllChildren(),this._detachSubview(this.subview),(e=this.subview)==null||e.destroy(),this.subview=null,(t=this._highlightView)==null||t.destroy(),this._exportImageVersion=-1}moveStart(){}viewChange(){}moveEnd(){this.requestUpdate()}highlight(e,t){if(!((Array.isArray(e)?e[0]:S.isCollection(e)?e.at(0):e)instanceof P))return q();let i=[];return Array.isArray(e)||S.isCollection(e)?i=e.map(r=>r.clone()):e instanceof P&&(i=[e.clone()]),this._highlightGraphics.addMany(i),q(()=>this._highlightGraphics.removeMany(i))}async doRefresh(){this.requestUpdate()}isUpdating(){return!this.subview||this.subview.updating}_setSubView(){var i,r;if(!this.view)return;const e=(i=this.layer.renderer)==null?void 0:i.type;let t="imagery";if(e==="vector-field"?t="imageryVF":e==="flow"&&(t="flow"),this.subview){const{type:a}=this.subview;if(a===t)return this._attachSubview(this.subview),void(a==="flow"?this.subview.redrawOrRefetch():a==="imagery"&&this.layer.format==="lerc"?this.subview.redraw():this.requestUpdate());this._detachSubview(this.subview),(r=this.subview)==null||r.destroy()}this.subview=t==="imagery"?new oe({layer:this.layer,view:this.view,timeExtent:this.timeExtent}):t==="imageryVF"?new he({layer:this.layer,view:this.view,timeExtent:this.timeExtent}):new H({layer:this.layer,layerView:this}),this._attachSubview(this.subview),this.requestUpdate()}_attachSubview(e){e&&!e.attached&&(e.attach(),e.attached=!0,this.container.addChildAt(e.container,0))}_detachSubview(e){e!=null&&e.attached&&(this.container.removeChild(e.container),e.detach(),e.attached=!1)}};s([o()],w.prototype,"pixelData",null),s([o()],w.prototype,"subview",void 0),w=s([v("esri.views.2d.layers.ImageryLayerView2D")],w);const ut=w;export{ut as default};
