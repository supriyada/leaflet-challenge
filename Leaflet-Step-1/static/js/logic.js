var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
d3.json(queryUrl).then(function(data){
    console.log(data)
    createMap(data.features);    
});

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        console.log(`inside create feature ${layer}`)
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

  function createMap(earthquakes) {
      console.log(earthquakes)

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
     // Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // coord_array = [[33.718,-115.997,2,5],[38.7949982,-122.8108368,3,8],[35.311,-118.5993333,7,3]]
    // coord_array.forEach(function(coord){
    //     lat = coord[0]
    //     lon = coord[1]
    //     console.log(coord)
    //     L.circleMarker([lat,lon],{
    //         color: "green",
    //         //fillColor: "#f03",
    //         fillOpacity: 0.5,
    //         radius: coord[2] 
    //     }).addTo(myMap);
    // })
    var eq_data = earthquakes;
    console.log(eq_data)
    coord = []
    mag = []
    depth = []
    for (var i = 0; i < earthquakes.length; i++) {
       // console.log("Inside for loop")
      // Set the data location property to a variable
      var location = earthquakes[i].geometry.coordinates;

      if (location){
      coord.push(`${location[1]},${location[0]}`);
      depth.push(location[2])
      
      }
      //console.log(location)
      var magnitude = earthquakes[i].properties.mag;
     // if (magnitude){
      mag.push(magnitude)
      //}

      L.circleMarker([location[1],location[0]],{
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: magnitude * 5
        }).addTo(myMap);

    }
    // mag.forEach(function(m){
    //     console.log("magnitude")
    //     console.log(m)
    // })
    // console.log(coord.length)
    // console.log(mag.length)
    // console.log(depth.length)
    
    // Set up the legend
//   var legend = L.control({ position: "bottomright" });
//   legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "info legend");
//     var limits = queryUrl.options.limits;
//     var colors = queryUrl.options.colors;
//     var labels = [];

//     // Add min & max
//     var legendInfo = "<h1>Median Income</h1>" +
//       "<div class=\"labels\">" +
//         "<div class=\"min\">" + limits[0] + "</div>" +
//         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//       "</div>";

//     div.innerHTML = legendInfo;

//     limits.forEach(function(limit, index) {
//       labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//   };

//   // Adding legend to the map
//   legend.addTo(myMap);
  }