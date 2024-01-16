import{C as o,D as a,V as g,k as m,e as s,q as p,t as c,v as l}from"./index-NTpjkr2x.js";import{m as n,u as d}from"./LayerView-q-DWhQSv.js";import{i as u}from"./GraphicContainer-Zf6vIT-n.js";import{r as w}from"./GraphicsView2D-5AT161sh.js";import"./Container-h9yr5WfL.js";import"./definitions-W9C_P9Oo.js";import"./enums-8pc8f5Ge.js";import"./Texture-rkt9N1E1.js";import"./color-2LtVwUGs.js";import"./enums--FbEXJ87.js";import"./VertexElementDescriptor-0hGjloLE.js";import"./number-sTjsTbdA.js";import"./BaseGraphicContainer-_-cLR5zB.js";import"./FeatureContainer-1BzuYnW-.js";import"./AttributeStoreView-sQ-PwFP-.js";import"./TiledDisplayObject-wq0GZP40.js";import"./WGLContainer-w4G_9y_7.js";import"./FramebufferObject-I1OPz3Lz.js";import"./ProgramTemplate-QskX9BYu.js";import"./GeometryUtils-3EwCa8DB.js";import"./alignmentUtils-XT3TYmYW.js";import"./StyleDefinition-ohiNeWtS.js";import"./config-z2KFXUcx.js";import"./earcut-EQhr15rW.js";import"./featureConversionUtils-fCaHEY-P.js";import"./OptimizedFeature-5RGb7-P9.js";import"./OptimizedFeatureSet-smVI1ez9.js";import"./OptimizedGeometry-CbNXANBG.js";import"./visualVariablesUtils-9WR9UpQU.js";import"./cimAnalyzer-H5DEMf3A.js";import"./fontUtils-wc3c5MaT.js";import"./BidiEngine-8z8MVveq.js";import"./labelPoint-_JWRKMkP.js";import"./GeometryUtils-CEMOhUyj.js";import"./Rect-pT1ASav_.js";import"./quantizationUtils-dsDBQTDK.js";import"./floatRGBA-wMjPWqHR.js";import"./ExpandedCIM--HoSRnnA.js";import"./util-tJHSmGI1.js";import"./TileContainer-Pny4fmz0.js";import"./vec3f32-6rWBPTzX.js";import"./normalizeUtilsSync-uxsMWUhW.js";import"./projectionSupport-wJ1SRjgc.js";import"./json-v6EOeNTY.js";import"./Matcher-crviAlzB.js";import"./tileUtils-pcBJnprf.js";import"./TurboLine-vnuyzA7V.js";import"./ComputedAttributeStorage-P7VodUxt.js";import"./TimeOnly-UsIZJpTd.js";let e=class extends n(d){constructor(){super(...arguments),this._highlightIds=new Map}attach(){this.graphicsView=new w({requestUpdateCallback:()=>this.requestUpdate(),view:this.view,graphics:this.layer.graphics,container:new u(this.view.featuresTilingScheme)}),this._updateHighlight(),this.container.addChild(this.graphicsView.container),this.addAttachHandles(this.layer.on("graphic-update",this.graphicsView.graphicUpdateHandler))}detach(){this.container.removeAllChildren(),this.graphicsView=o(this.graphicsView)}async hitTest(i){return this.graphicsView?this.graphicsView.hitTest(i).map(t=>({type:"graphic",graphic:t,mapPoint:i,layer:this.layer})):null}async fetchPopupFeatures(i){return this.graphicsView?this.graphicsView.hitTest(i).filter(t=>!!t.popupTemplate):[]}queryGraphics(){return Promise.resolve(this.graphicsView.graphics)}update(i){this.graphicsView.processUpdate(i)}moveStart(){}viewChange(){this.graphicsView.viewChange()}moveEnd(){}isUpdating(){return!this.graphicsView||this.graphicsView.updating}highlight(i){let t;typeof i=="number"?t=[i]:i instanceof a?t=[i.uid]:Array.isArray(i)&&i.length>0?t=typeof i[0]=="number"?i:i.map(h=>h&&h.uid):g.isCollection(i)&&i.length>0&&(t=i.map(h=>h&&h.uid).toArray());const r=t==null?void 0:t.filter(m);return r!=null&&r.length?(this._addHighlight(r),s(()=>this._removeHighlight(r))):s()}_addHighlight(i){for(const t of i)if(this._highlightIds.has(t)){const r=this._highlightIds.get(t);this._highlightIds.set(t,r+1)}else this._highlightIds.set(t,1);this._updateHighlight()}_removeHighlight(i){for(const t of i)if(this._highlightIds.has(t)){const r=this._highlightIds.get(t)-1;r===0?this._highlightIds.delete(t):this._highlightIds.set(t,r)}this._updateHighlight()}_updateHighlight(){var i;(i=this.graphicsView)==null||i.setHighlight(Array.from(this._highlightIds.keys()))}};p([c()],e.prototype,"graphicsView",void 0),e=p([l("esri.views.2d.layers.GraphicsLayerView2D")],e);const li=e;export{li as default};