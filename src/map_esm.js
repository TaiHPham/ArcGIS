import WebMap from "@arcgis/core/WebMap.js";
import MapView from "@arcgis/core/views/MapView.js";

export function map() {
    const webMap = new WebMap({
        portalItem: {
            id: "41281c51f9de45edaf1c8ed44bb10e30"
        }
    });

    const view = new MapView({
        container: "viewDiv",
        map: webMap,
    });

    window.view = view; // expose the view object globally
}


