//Map center coordinates

var myMap = L.map("mapid", {
    center: [
        37.09, -95.71
    ],
    zoom: 5,
});

//Create a tile layer - darkmap
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
}).addTo(myMap);

//URL to get the dataset
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Function to choose color for the depth of earthquake
function chooseColor(mag_depth) {

    switch (true) {
        case (mag_depth < 10):
            return "green";
        case (mag_depth < 30):
            return "#4287f5";
        case (mag_depth < 50):
            return "#fcf005";
        case (mag_depth < 70):
            return "#eb9234";
        case (mag_depth < 90):
            return "#fc6405";
        default:
            return "#f20202";
    }
}

//Retrieve json data
d3.json(queryUrl).then(function (data) {
    var earthquakes = data.features;
    console.log(earthquakes)

    for (var i = 0; i < earthquakes.length; i++) {

        // Set the data location property to a variable
        var location = earthquakes[i].geometry.coordinates;

        var mag_depth = location[2]

        var magnitude = earthquakes[i].properties.mag;
        //Circle markers
        L.circleMarker([location[1], location[0]], {
            color: "green",
            fillColor: chooseColor(mag_depth),
            fillOpacity: 0.5,
            radius: magnitude * 5
        }).bindPopup("<strong>Place: </strong>" + earthquakes[i].properties.place +
            "<br><p><strong>Date: </strong>" + new Date(earthquakes[i].properties.time) +
            "<br><strong>Magnitude: </strong>" + earthquakes[i].properties.mag +
            "<br><strong>Depth: </strong>" + earthquakes[i].geometry.coordinates[2] + "</p>")
            .addTo(myMap);

    }
    //Legend for the magnitude depth
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Earthquake depth</h4>";
        div.innerHTML += '<i style="background: green"></i><span>-10-10</span><br>';
        div.innerHTML += '<i style="background: #4287f5"></i><span>10-30</span><br>';
        div.innerHTML += '<i style="background: #fcf005"></i><span>30-50</span><br>';
        div.innerHTML += '<i style="background: #eb9234"></i><span>50-70</span><br>';
        div.innerHTML += '<i style="background: #fc6405"></i><span>70-90</span><br>';
        div.innerHTML += '<i style="background: #f20202"></i><span>90+</span><br>';

        return div;
    };

    legend.addTo(myMap);
});