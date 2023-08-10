import esriConfig from "@arcgis/core/config.js"
import Search from "@arcgis/core/widgets/Search.js";

export function search(apiKey) {
    esriConfig.apiKey = apiKey;
    const search = new Search({ //Add Search widget
        view: view
    });
    view.ui.add(search, "top-right"); //Add to the map
}