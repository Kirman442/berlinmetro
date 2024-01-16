import React, { useRef, useEffect } from "react";
import esriConfig from '@arcgis/core/config'
import Map from '@arcgis/core/Map'
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery'
import Basemap from "@arcgis/core/Basemap";
import MapView from '@arcgis/core/views/MapView'
import Expand from "@arcgis/core/widgets/Expand";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";
import Zoom from "@arcgis/core/widgets/Zoom.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import { stationPopup, liniePopup } from '../components/popup/metroPopup'
import { metroLineRenderer, stationRenderer } from '../components/visualization/renderer/MetroLine'
// import FeatureEffect from "@arcgis/core/layers/support/FeatureEffect.js";

import "../App.css";
import "../custom.css";


const Metro = () => {

    const viewDiv = useRef(null);
    const mapDiv = useRef(null);
    // const mapViewHook = useRef(null);
    // const sceneViewHook = useRef(null);
    // const activeViewHook = useRef(null);

    useEffect(() => {
        if (mapDiv.current) {
            /**
             * Initialize application
             */
            esriConfig.apiKey = "AAPK7ddadabe119a4981b3395ae8620a28b4W9UhogxqRmw8Tx199e1N5jahB-Q6D4vMfG_w644qOkEr9Qyt-jWS8qzwLzQRMnU8";

            let layerView;

            const map = new Map({
                basemap: "arcgis-modern-antique"
            });

            const view = new MapView({
                container: mapDiv.current,
                map: map,
                center: [13.401376296055723, 52.52093728655091], // Longitude, latitude
                zoom: 12, // Zoom level
                navigation: {
                    mouseWheelZoomEnabled: false,
                    browserTouchPanEnabled: true
                },
                ui: {
                    components: ["attribution"]
                },
            });

            // Linen
            const All_Lines = new FeatureLayer({
                portalItem: {
                    id: '68d8f4fb2aae4e088898d9b70a031d8f'
                },
                outFields: ["colour"],
                popupTemplate: liniePopup,
                renderer: metroLineRenderer
            });
            map.add(All_Lines);

            // Stations
            const All_Stations = new FeatureLayer({
                portalItem: {
                    id: '724d101833d34a6f8094a73daf200e8b' // new layer 724d101833d34a6f8094a73daf200e8b, old 35d8eb00884448079d2784650b9c995c
                },
                popupTemplate: stationPopup,
                renderer: stationRenderer
            });
            map.add(All_Stations);





            const timeSlider = new TimeSlider({
                container: "timeSliderDiv",
                viewModel: {
                    view: view,
                    mode: "cumulative-from-start",
                    fullTimeExtent: {
                        start: new Date(1900, 0, 1),
                        end: new Date(2023, 0, 1)
                    },
                    timeExtent: {
                        start: null,
                        end: new Date(1900, 0, 1)
                    },
                    stops: {
                        interval: {
                            value: 10,
                            unit: "years"
                        },
                        // dates:[
                        //   new Date(1936, 0, 1),
                        //   new Date(1954, 0, 1)
                        // ]
                    }
                }
            });
            view.ui.add(timeSlider, "bottom-right");

            // timeSlider.watch("timeExtent", (timeExtent) => {
            //   console.log("Time extent now starts at", timeExtent.start, "and finishes at:", timeExtent.end);
            // });

            //   view.whenLayerView(U1_Stations).then((lv) => {
            //     timeSlider.fullTimeExtent =
            //     U1_Stations.timeInfo.fullTimeExtent;
            //     timeSlider.stops = {
            //       interval: {
            //         unit: "months",
            //         value: 3
            //       }
            //     };
            //   });



            // const timeSlider = new TimeSlider({
            //     container: "timeSlider",
            //     // fullTimeExtent: {
            //     //     start: new Date(1902, 1, 1),
            //     //     end: new Date(2023, 1, 1)
            //     //   },
            //     view: view,
            //     timeVisible: true, // show the time stamps on the timeslider
            //     loop: true,
            //     mode: "cumulative-from-start"
            //   });


            const zoom = new Zoom({
                view: view,
                layout: "vertical"
            });


            let basemapGallery = new BasemapGallery({
                view: view,
                source: [Basemap.fromId("topo-vector"), Basemap.fromId("dark-gray"), Basemap.fromId("arcgis-light-gray")], //osm-streets, streets-vector
                // container: document.createElement("basemapGalleryDiv"),
                disabled: false
            });

            let legend = new Legend({
                view: view,
                style: [
                    {
                        layout: "auto",
                        type: 'classic',
                    },
                ],
                layerInfos: [
                    {
                        title: 'U-Bahn Linien',
                        layer: All_Lines,
                    },
                ]
            });

            const bgExpand = new Expand({
                view: view,
                content: basemapGallery,
                autoCollapse: true
            });

            view.ui.add([zoom, bgExpand], "top-left");
            view.ui.add(legend, "bottom-left");

        }

    }, []);
    return (
        <>
            <div className="mapDiv" ref={mapDiv}></div>
            {/* <div id="timeSlider"></div> */}
        </>
    )
}

export { Metro }