require(["esri/rest/locator", "esri/Graphic"],
    function (locator, Graphic) {
        const places = ["Parks and Outdoors", "Coffee shop", "Gas station", "Food", "Hotel"];
        const select = document.createElement("select");
        select.setAttribute("class", "esri-widget esri-select");
        select.setAttribute("style", "width: 175px; font-family: 'Avenir Next W00'; font-size: 1em");

        places.forEach(function (p) {
            const option = document.createElement("option");
            option.value = p;
            option.innerHTML = p;
            select.appendChild(option);
        });
        view.ui.add(select, "top-right");
        const locatorUrl = "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

        // Find places and add them to the map
        function findPlaces(category, pt) {
            locator
                .addressToLocations(locatorUrl, {
                    location: pt,
                    categories: [category],
                    maxLocations: 25,
                    outFields: ["Place_addr", "PlaceName"]
                })
                .then(function (results) {
                    view.closePopup();
                    view.graphics.removeAll();

                    results.forEach(function (result) {
                        view.graphics.add(
                            new Graphic({
                                attributes: result.attributes,
                                geometry: result.location,
                                symbol: {
                                    type: "simple-marker",
                                    color: "#000000",
                                    size: "12px",
                                    outline: {
                                        color: "#ffffff",
                                        width: "2px"
                                    }
                                },
                                popupTemplate: {
                                    title: "{PlaceName}",
                                    content: "{Place_addr}"
                                }
                            })
                        );
                    });
                });
        }

        // Search for places in center of map
        view.watch("stationary", function (val) {
            if (val) {
                findPlaces(select.value, view.center);
            }
        });

        // Listen for category changes and find places
        select.addEventListener("change", function (event) {
            findPlaces(event.target.value, view.center);
        });

    });