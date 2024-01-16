import{w as l,P as h,x as g,V as w,z as f,A as d,B as n,q as u,v as V}from"./index-NTpjkr2x.js";import{m as b,u as S}from"./LayerView-q-DWhQSv.js";import{i as _}from"./GraphicContainer-Zf6vIT-n.js";import{r as T}from"./GraphicsView2D-5AT161sh.js";import"./Container-h9yr5WfL.js";import"./definitions-W9C_P9Oo.js";import"./enums-8pc8f5Ge.js";import"./Texture-rkt9N1E1.js";import"./color-2LtVwUGs.js";import"./enums--FbEXJ87.js";import"./VertexElementDescriptor-0hGjloLE.js";import"./number-sTjsTbdA.js";import"./BaseGraphicContainer-_-cLR5zB.js";import"./FeatureContainer-1BzuYnW-.js";import"./AttributeStoreView-sQ-PwFP-.js";import"./TiledDisplayObject-wq0GZP40.js";import"./WGLContainer-w4G_9y_7.js";import"./FramebufferObject-I1OPz3Lz.js";import"./ProgramTemplate-QskX9BYu.js";import"./GeometryUtils-3EwCa8DB.js";import"./alignmentUtils-XT3TYmYW.js";import"./StyleDefinition-ohiNeWtS.js";import"./config-z2KFXUcx.js";import"./earcut-EQhr15rW.js";import"./featureConversionUtils-fCaHEY-P.js";import"./OptimizedFeature-5RGb7-P9.js";import"./OptimizedFeatureSet-smVI1ez9.js";import"./OptimizedGeometry-CbNXANBG.js";import"./visualVariablesUtils-9WR9UpQU.js";import"./cimAnalyzer-H5DEMf3A.js";import"./fontUtils-wc3c5MaT.js";import"./BidiEngine-8z8MVveq.js";import"./labelPoint-_JWRKMkP.js";import"./GeometryUtils-CEMOhUyj.js";import"./Rect-pT1ASav_.js";import"./quantizationUtils-dsDBQTDK.js";import"./floatRGBA-wMjPWqHR.js";import"./ExpandedCIM--HoSRnnA.js";import"./util-tJHSmGI1.js";import"./TileContainer-Pny4fmz0.js";import"./vec3f32-6rWBPTzX.js";import"./normalizeUtilsSync-uxsMWUhW.js";import"./projectionSupport-wJ1SRjgc.js";import"./json-v6EOeNTY.js";import"./Matcher-crviAlzB.js";import"./tileUtils-pcBJnprf.js";import"./TurboLine-vnuyzA7V.js";import"./ComputedAttributeStorage-P7VodUxt.js";import"./TimeOnly-UsIZJpTd.js";let y=class extends b(S){constructor(){super(...arguments),this._graphicsViewMap={},this._popupTemplates=new Map,this.graphicsViews=[]}async hitTest(i,r){if(!this.graphicsViews.length)return null;const o=this.layer;return this.graphicsViews.reverse().flatMap(e=>{const t=this._popupTemplates.get(e),s=e.hitTest(i);for(const p of s)p.layer=o,p.sourceLayer=o,p.popupTemplate=t;return s}).map(e=>({type:"graphic",graphic:e,layer:o,mapPoint:i}))}update(i){if(this.graphicsViews)for(const r of this.graphicsViews)r.processUpdate(i)}attach(){this.addAttachHandles([l(()=>{var i;return(i=this.layer)==null?void 0:i.featureCollections},i=>{this._clear();for(const{popupInfo:r,featureSet:o,layerDefinition:e}of i){const t=g.fromJSON(o),s=new w(t.features),p=e.drawingInfo,c=r?f.fromJSON(r):null,a=d(p.renderer),m=new T({requestUpdateCallback:()=>this.requestUpdate(),view:this.view,graphics:s,renderer:a,container:new _(this.view.featuresTilingScheme)});this._graphicsViewMap[t.geometryType]=m,this._popupTemplates.set(m,c),t.geometryType!=="polygon"||this.layer.polygonSymbol?t.geometryType!=="polyline"||this.layer.lineSymbol?t.geometryType!=="point"||this.layer.pointSymbol||(this.layer.pointSymbol=a.symbol):this.layer.lineSymbol=a.symbol:this.layer.polygonSymbol=a.symbol,this.graphicsViews.push(m),this.container.addChild(m.container)}},h),l(()=>{var i;return(i=this.layer)==null?void 0:i.polygonSymbol},i=>{this._graphicsViewMap.polygon.renderer=new n({symbol:i})},h),l(()=>{var i;return(i=this.layer)==null?void 0:i.lineSymbol},i=>{this._graphicsViewMap.polyline.renderer=new n({symbol:i})},h),l(()=>{var i;return(i=this.layer)==null?void 0:i.pointSymbol},i=>{this._graphicsViewMap.point.renderer=new n({symbol:i})},h)])}detach(){this._clear()}moveStart(){}moveEnd(){}viewChange(){for(const i of this.graphicsViews)i.viewChange()}_clear(){this.container.removeAllChildren();for(const i of this.graphicsViews)i.destroy();this._graphicsViewMap={},this._popupTemplates.clear(),this.graphicsViews.length=0}};y=u([V("esri.views.2d.layers.GeoRSSLayerView2D")],y);const Vi=y;export{Vi as default};