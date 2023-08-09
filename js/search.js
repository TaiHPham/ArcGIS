require(["esri/widgets/Search", "esri/rest/locator", "esri/Graphic", "esri/rest/route", "esri/rest/support/RouteParameters", "esri/rest/support/FeatureSet"],
    function (Search, locator, Graphic, route, RouteParameters, FeatureSet) {
        
        // Make sure the view object is globally available
        const view = window.view;

        // Search
        const search = new Search({ //Add Search widget
            view: view
        });
        view.ui.add(search, "top-right"); //Add to the map

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

        // Route
        const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
        view.on("click", function (event) {
            if (view.graphics.length === 0) {
                addGraphic("origin", event.mapPoint);
            } else if (view.graphics.length === 1) {
                addGraphic("destination", event.mapPoint);
                getRoute(); // Call the route service
            } else {
                view.graphics.removeAll();
                addGraphic("origin", event.mapPoint);
            }
        });

        function addGraphic(type, point) {
            const graphic = new Graphic({
                symbol: {
                    type: "simple-marker",
                    color: (type === "origin") ? "white" : "black",
                    size: "8px"
                },
                geometry: point
            });
            view.graphics.add(graphic);
        }

        function getRoute() {
            const routeParams = new RouteParameters({
                stops: new FeatureSet({
                    features: view.graphics.toArray()
                }),
                returnDirections: true
            });
            route.solve(routeUrl, routeParams)
                .then(function (data) {
                    data.routeResults.forEach(function (result) {
                        result.route.symbol = {
                            type: "simple-line",
                            color: [5, 150, 255],
                            width: 3
                        };
                        view.graphics.add(result.route);
                    });
                    // Display directions
                    if (data.routeResults.length > 0) {
                        const directions = document.createElement("ol");
                        directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
                        directions.style.marginTop = "0";
                        directions.style.padding = "15px 15px 15px 30px";
                        const features = data.routeResults[0].directions.features;
                        // Show each direction
                        features.forEach(function (result, i) {
                            const direction = document.createElement("li");
                            direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
                            directions.appendChild(direction);
                        });
                        view.ui.empty("top-right");
                        view.ui.add(directions, "top-right");
                    }
                })
                .catch(function(error){
                    console.log(error);
                })
        }
    });
