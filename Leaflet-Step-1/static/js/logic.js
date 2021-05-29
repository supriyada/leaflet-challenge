// Creating map object

  // Adding tile layer to the map
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  })
  
  var layers = {
    circle: new L.circle()}

  var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [layers.circle]
  });
  
  streetmap.addTo(map);

  var info = L.control({
    position: "bottomright"
  });

  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };

  info.addTo(map);

  // Store API query variables
  var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Grab the data with d3
  d3.json(queryUrl).then(function(response) {
    
    // Create a new marker cluster group
    //var markers = L.markerClusterGroup();
    console.log(response)
    var eq_data = response.features
    console.log(eq_data.length)
    // Loop through data
    coord = []
    mag = []
    depth = []
    for (var i = 0; i < eq_data.length; i++) {
        console.log("Inside for loop")
      // Set the data location property to a variable
      var location = eq_data[i].geometry.coordinates;
      if (location[0] & location[1] &location[2]){
      coord.push(`${location[1]},${location[0]}`);
      depth.push(location[2])
      }
      //console.log(location)
      var magnitude = eq_data[i].geometry.mag;
      mag.push(magnitude)
      
      //coord.push(location)
      // Check for location property
      //if (location) {
  
        // Add a new marker to the cluster group and bind a pop-up
        //markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
          //.bindPopup(response[i].descriptor));
      //}
      var newMarker = L.circle([location[1],location[0]],{
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 100000.0
   } );
   newMarker.addTo(layers[circle]);
      
    }
    //console.log(coord)
    //console.log(mag.length)
    // L.circle([37.09, -95.71], {
    //      color: "red",
    //      fillColor: "#f03",
    //      fillOpacity: 0.5,
    //      radius: 1000000.0
    // }).addTo(myMap);
    
  
    // // Add our marker cluster layer to the map
    //myMap.addLayer(geoJSON);
  
  });
  