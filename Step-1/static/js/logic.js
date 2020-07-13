
// Create the tile layer that will be the background of the map.
console.log("wootwoot");
//var apiKey = "pk.eyJ1IjoiYmthcHNhbGlzIiwiYSI6ImNrMzg2OTZnMzA0bTMzaW5yMWhyb2hxN3AifQ.LCoY1nACfyPGDfOOP7C5hg"; Bills Golden Key
var apiKey = "pk.eyJ1IjoibW9zdGRpZmZpY3VsdCIsImEiOiJja2JianFmM28wMXdvMnhyeWl4M2E3dGhnIn0.3xvnLC6gTvclLiJ2S260rg"; //Eli Private Key
//var apiKey = "pk.eyJ1IjoibW9zdGRpZmZpY3VsdCIsImEiOiJja2JiamxwbTQwMXhsMnNwaXVobGR5aGY0In0.2FfocTGJZ_YVIGGtUmmTYA"; // Eli Public Key
//var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", { // old version does not work per documentation.
var graymap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  //id: "mapbox.streets",// bad old version.
  id: "mapbox/light-v10",
    //id: "mapbox.streets",
  //id: "mapbox/streets-v11",
  //id: "mapbox/light-v10",
  //id: "mapbox/streets-v11",
  //id: "mapbox/outdoors-v11",
  //id: "mapbox/light-v10",
  //id: "mapbox/dark-v10",
  //id: "mapbox/satellite-v9",
  //id: "mapbox/satellite-streets-v11",
  
  accessToken: apiKey
});
// Create the map object with options.
var map = L.map("mapid", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});
// Add our 'graymap' tile layer to the map.
graymap.addTo(map);
// Make an AJAX call that retrieves our earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
  // This function returns the style data for each of the earthquakes we plot on
  // the map. We pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // This function determines the color of the marker based on the magnitude of the earthquake.
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }
  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }
  // Add a GeoJSON layer to the map once the file is loaded.
  console.log(data)
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);
  // Create a legend control object.
  var legend = L.control({
    position: "bottomright"
  });
  // Add all the details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];
    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  // Add legend to the map.
  legend.addTo(map);
});