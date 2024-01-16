import{aM as g,aR as d,q as t,t as r,v as f,cZ as b,D as h,C as c,w as p,P as y}from"./index-NTpjkr2x.js";import{h as T}from"./GraphicsLayer-IGG1M27j.js";import{m as _,u as v}from"./LayerView-q-DWhQSv.js";import{i as O}from"./GraphicContainer-Zf6vIT-n.js";import{r as C}from"./GraphicsView2D-5AT161sh.js";import"./Container-h9yr5WfL.js";import"./definitions-W9C_P9Oo.js";import"./enums-8pc8f5Ge.js";import"./Texture-rkt9N1E1.js";import"./color-2LtVwUGs.js";import"./enums--FbEXJ87.js";import"./VertexElementDescriptor-0hGjloLE.js";import"./number-sTjsTbdA.js";import"./BaseGraphicContainer-_-cLR5zB.js";import"./FeatureContainer-1BzuYnW-.js";import"./AttributeStoreView-sQ-PwFP-.js";import"./TiledDisplayObject-wq0GZP40.js";import"./WGLContainer-w4G_9y_7.js";import"./FramebufferObject-I1OPz3Lz.js";import"./ProgramTemplate-QskX9BYu.js";import"./GeometryUtils-3EwCa8DB.js";import"./alignmentUtils-XT3TYmYW.js";import"./StyleDefinition-ohiNeWtS.js";import"./config-z2KFXUcx.js";import"./earcut-EQhr15rW.js";import"./featureConversionUtils-fCaHEY-P.js";import"./OptimizedFeature-5RGb7-P9.js";import"./OptimizedFeatureSet-smVI1ez9.js";import"./OptimizedGeometry-CbNXANBG.js";import"./visualVariablesUtils-9WR9UpQU.js";import"./cimAnalyzer-H5DEMf3A.js";import"./fontUtils-wc3c5MaT.js";import"./BidiEngine-8z8MVveq.js";import"./labelPoint-_JWRKMkP.js";import"./GeometryUtils-CEMOhUyj.js";import"./Rect-pT1ASav_.js";import"./quantizationUtils-dsDBQTDK.js";import"./floatRGBA-wMjPWqHR.js";import"./ExpandedCIM--HoSRnnA.js";import"./util-tJHSmGI1.js";import"./TileContainer-Pny4fmz0.js";import"./vec3f32-6rWBPTzX.js";import"./normalizeUtilsSync-uxsMWUhW.js";import"./projectionSupport-wJ1SRjgc.js";import"./json-v6EOeNTY.js";import"./Matcher-crviAlzB.js";import"./tileUtils-pcBJnprf.js";import"./TurboLine-vnuyzA7V.js";import"./ComputedAttributeStorage-P7VodUxt.js";import"./TimeOnly-UsIZJpTd.js";let a=class extends g(d){constructor(e){super(e),this.frameCenter=null,this.frameOutline=null,this.lineOfSight=null,this.sensorLocation=null,this.sensorTrail=null}};t([r({type:Boolean})],a.prototype,"frameCenter",void 0),t([r({type:Boolean})],a.prototype,"frameOutline",void 0),t([r({type:Boolean})],a.prototype,"lineOfSight",void 0),t([r({type:Boolean})],a.prototype,"sensorLocation",void 0),t([r({type:Boolean})],a.prototype,"sensorTrail",void 0),a=t([f("esri.layers.support.TelemetryDisplay")],a);const u=a,n=new b([255,127,0]);let m=class extends _(v){constructor(){super(...arguments),this._graphicsLayer=new T,this._frameOutlineGraphic=new h({symbol:{type:"simple-fill",outline:{type:"simple-line",color:n}}}),this._sensorTrailGraphic=new h({symbol:{type:"simple-line",color:n}}),this._lineOfSightGraphic=new h({symbol:{type:"simple-line",color:n}}),this._sensorLocationGraphic=new h({symbol:{type:"simple-marker",color:n}}),this._frameCenterGraphic=new h({symbol:{type:"simple-marker",color:n}}),this.layer=null,this.symbolColor=n,this.visibleTelemetryElements=null}destroy(){this._graphicsLayer=c(this._graphicsLayer)}initialize(){var e,i,s,l,o;this.addHandles(p(()=>this.symbolColor,()=>{this._frameOutlineGraphic.symbol.outline.color=this.symbolColor,this._sensorTrailGraphic.symbol.color=this.symbolColor,this._lineOfSightGraphic.symbol.color=this.symbolColor,this._sensorLocationGraphic.symbol.color=this.symbolColor,this._frameCenterGraphic.symbol.color=this.symbolColor},y)),this._graphicsLayer.graphics.addMany([this._frameOutlineGraphic,this._sensorTrailGraphic,this._lineOfSightGraphic,this._sensorLocationGraphic,this._frameCenterGraphic]),this.visibleTelemetryElements=new u({frameCenter:((e=this.layer.telemetryDisplay)==null?void 0:e.frameCenter)??!0,frameOutline:((i=this.layer.telemetryDisplay)==null?void 0:i.frameOutline)??!0,lineOfSight:((s=this.layer.telemetryDisplay)==null?void 0:s.lineOfSight)??!0,sensorLocation:((l=this.layer.telemetryDisplay)==null?void 0:l.sensorLocation)??!0,sensorTrail:((o=this.layer.telemetryDisplay)==null?void 0:o.sensorTrail)??!0})}attach(){this.graphicsView=new C({requestUpdateCallback:()=>this.requestUpdate(),view:this.view,graphics:this._graphicsLayer.graphics,container:new O(this.view.featuresTilingScheme)}),this.container.addChild(this.graphicsView.container),this.addAttachHandles(this._graphicsLayer.on("graphic-update",this.graphicsView.graphicUpdateHandler)),this.addAttachHandles([p(()=>{var e,i,s,l,o;return[(e=this.layer.telemetryDisplay)==null?void 0:e.frameCenter,(i=this.layer.telemetryDisplay)==null?void 0:i.frameOutline,(s=this.layer.telemetryDisplay)==null?void 0:s.sensorLocation,(l=this.layer.telemetryDisplay)==null?void 0:l.sensorTrail,(o=this.layer.telemetryDisplay)==null?void 0:o.lineOfSight]},()=>this._updateVisibleTelemetryElements(),y),p(()=>{var e,i,s,l,o;return[this.layer.telemetry,(e=this.visibleTelemetryElements)==null?void 0:e.frameCenter,(i=this.visibleTelemetryElements)==null?void 0:i.frameOutline,(s=this.visibleTelemetryElements)==null?void 0:s.sensorLocation,(l=this.visibleTelemetryElements)==null?void 0:l.sensorTrail,(o=this.visibleTelemetryElements)==null?void 0:o.lineOfSight]},()=>this._updateGraphicGeometries(),y)])}detach(){this.container.removeAllChildren(),this.graphicsView=c(this.graphicsView)}supportsSpatialReference(e){return!0}moveStart(){}moveEnd(){}viewChange(){this.graphicsView.viewChange()}update(e){this.graphicsView.processUpdate(e)}isUpdating(){return!this.graphicsView||this.graphicsView.updating}_updateVisibleTelemetryElements(){this.visibleTelemetryElements&&this.layer.telemetryDisplay&&(this.visibleTelemetryElements.frameCenter=this.layer.telemetryDisplay.frameCenter,this.visibleTelemetryElements.frameOutline=this.layer.telemetryDisplay.frameOutline,this.visibleTelemetryElements.lineOfSight=this.layer.telemetryDisplay.lineOfSight,this.visibleTelemetryElements.sensorLocation=this.layer.telemetryDisplay.sensorLocation,this.visibleTelemetryElements.sensorTrail=this.layer.telemetryDisplay.sensorTrail)}_updateGraphicGeometries(){const{telemetry:e}=this.layer,{visibleTelemetryElements:i}=this;e&&i&&(i.frameOutline&&e.frameOutline?this._frameOutlineGraphic.geometry=this.layer.telemetry.frameOutline:this._frameOutlineGraphic.geometry=null,i.sensorTrail&&e.sensorTrail?this._sensorTrailGraphic.geometry=this.layer.telemetry.sensorTrail:this._sensorTrailGraphic.geometry=null,i.lineOfSight&&e.lineOfSight?this._lineOfSightGraphic.geometry=this.layer.telemetry.lineOfSight:this._lineOfSightGraphic.geometry=null,i.sensorLocation&&e.sensorLocation?this._sensorLocationGraphic.geometry=this.layer.telemetry.sensorLocation:this._sensorLocationGraphic.geometry=null,i.frameCenter&&e.frameCenter?this._frameCenterGraphic.geometry=this.layer.telemetry.frameCenter:this._frameCenterGraphic.geometry=null)}};t([r()],m.prototype,"graphicsView",void 0),t([r()],m.prototype,"layer",void 0),t([r()],m.prototype,"symbolColor",void 0),t([r({type:u})],m.prototype,"visibleTelemetryElements",void 0),m=t([f("esri.views.2d.layers.VideoLayerView2D")],m);const _e=m;export{_e as default};