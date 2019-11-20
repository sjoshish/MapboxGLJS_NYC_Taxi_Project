mapboxgl.accessToken = 'pk.eyJ1Ijoia2FsaW1hciIsImEiOiJjajdhdmNtMjkwbGZlMzJyc2RvNmhjZXd3In0.tBIY2rRDHYt1VYeGTOH98g';

var map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [-74.0059, 40.7128], // initial map center in [lon, lat]
  zoom: 9
 
});

map.on('load', function() {
  
  /*
  map.addSource("taxi", {
type: "geojson",
// Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
// from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
data: 'https://sjoshish.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM taxi_2',
cluster: true,
clusterMaxZoom: 14, // Max zoom to cluster points on
clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
});
  
  //
 map.addLayer({
        id: "taxi",
        type: "circle",
        source: "taxi",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          // * Blue, 20px circles when point count is less than 100
          // * Yellow, 30px circles when point count is between 100 and 750
          // * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#33FF6B",
            1000,
            "#2049FF",
            15000,
            "#FFA52B",
            
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            250,
            30,
            1000,
            40
          ]
        }
      });
  
  //
  map.addLayer({
id: "cluster-count",
type: "symbol",
source: "taxi",
filter: ["has", "point_count"],
layout: {
"text-field": "{point_count_abbreviated}",
"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
"text-size": 12
}
});*/
  
  map.addLayer({
    id: 'poi',
    type: 'circle',
    source: {
      type: 'geojson',
      data: 'https://sjoshish.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM taxi_2' // replace this with the url of your own geojson
    },
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['number', ['get', 'money']],
        0, 3,
        10, 15
      ],
      'circle-color': [
        'interpolate',
        ['linear'],
        ['number', ['get', 'money']],
        1, '#2DC4B2',
        2, '#3BB3C3',
        3, '#669EC4',
        4, '#8B88B6',
        5, '#A2719B',
        6, '#AA5E79'
      ],
      'circle-opacity': 0.7
    }
  });
 
  
  
  
  
  map.on('click', 'poi', function (e) {
        
        var coordinates = e.features[0].geometry.coordinates.slice();
        var passenger = e.features[0].properties.passenger_count;
        var fare = e.features[0].properties.fare_amount;
        var date_time_pickup = e.features[0].properties.pickup_datetime;
        var trip_distance = e.features[0].properties.trip_distance;
        var tip = e.features[0].properties.tip_amount;
 
// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 
new mapboxgl.Popup()
.setLngLat(coordinates)
.setHTML("<center><b><i>Trip Details</i></b><center>"+
                    "<b>Pick up time: </b>"+ date_time_pickup + 
                    '<br>' +"<b>Passenger Count:</b>" +passenger + 
                    '<br>' +"<b>Trip Distance: </b>"+ trip_distance +" mi" +
                    '<br>' +"<b>Tip Amount: </b>$" + tip + 
                    '<br>' +"<b>Total Fare: </b>$"+ fare)
.addTo(map);
});
 
// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'places', function () {
map.getCanvas().style.cursor = 'pointer';
});
 
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'places', function () {
map.getCanvas().style.cursor = '';
});
  
  
});

document.getElementById('slider').addEventListener('input', function(e) {
  var hour = parseInt(e.target.value);
  // update the map
  map.setFilter('poi', ['==', ['number', ['get', 'pickup_hour']], hour]);

  // converting 0-23 hour to AMPM format
  var ampm = hour >= 12 ? 'PM' : 'AM';
  var hour12 = hour % 12 ? hour % 12 : 12;

  // update text in the UI
  document.getElementById('active-hour').innerText = hour12 + ampm;
});





//geocoder 
var geocoder = new MapboxGeocoder({ // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: 'Search by Neighborhood', // Placeholder text for the search bar
  bbox: [-74.252163, 40.524705, -73.692526, 40.884775], // Boundary for New York City
// 
  proximity: {
    longitude: -74.0060,
    latitude: 40.7128
  } // Coordinates of New York City
});

   
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

 

