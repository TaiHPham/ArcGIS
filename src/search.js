require(["esri/widgets/Search"],
    function (Search) {
        // Search
        const search = new Search({ //Add Search widget
            view: view
        });
        view.ui.add(search, "top-right"); //Add to the map
    });
