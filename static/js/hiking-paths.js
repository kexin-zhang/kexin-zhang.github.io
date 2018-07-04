var map = L.map('map', { zoomControl:false });
map.setView([47.2995, -122.6207], 9);

// disable panning + zooming
map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.boxZoom.disable();
map.keyboard.disable();

var tiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 18
});
tiles.addTo(map);

// add d3 overlay
var svg = d3.select(map.getPanes().overlayPane).append("svg")
            .attr("id", "overlay")
            .attr("class", "leaflet-zoom-hide")
            .style("width", map.getSize().x + "px")
            .style("height", map.getSize().y + "px");

var g = svg.append("g");

function projectPoint(x, y) {
  var point = map.latLngToLayerPoint(new L.LatLng(y, x));
  this.stream.point(point.x, point.y);
}

var transform = d3.geoTransform({point: projectPoint}),
    path = d3.geoPath().projection(transform);

// plotting the drive to onp
// i feel like its kinda dumb that everything is in here but idk how to get around it
d3.json("/static/js/geojson/onp.geojson", function(error, data) {
  if (error) throw error;

  function plotDrive() {
    var drive = g.selectAll(".drive")
                 .data(data.features)
                 .enter()
                 .append("path")
                 .attr("class", "drive")
                 .attr("d", path)
                 .call(transition);
  }

  function transition(path) {
     path.transition()
         .duration(5500)
         .attrTween("stroke-dasharray", tweenDash)
         .on("end", function() { zoomStaircase(); }); // just gonna chain all the transitions together lol
   }

   // coordinates for staircase
   // 47.50212,-123.31785
   function zoomStaircase() {
       d3.selectAll(".drive").remove();
       map.flyTo([47.50212,-123.31785], 11);
   }

   map.on("viewreset moveend", reset);

   // redraws stuff, used for zooming in/out
   function reset() {
     console.log("resetting");
     // i feel like there's a better way to do this but setting drive.attr("d", path) isnt working??
     if (map.getZoom() == 11) {
       g.selectAll(".drive")
                    .data(data.features)
                    .enter()
                    .append("path")
                    .attr("class", "drive")
                    .attr("d", path);
     } else {
       plotDrive();
     }
   }

   plotDrive();

});

// for stroke dash array interpolation
// https://bl.ocks.org/mbostock/5649592
function tweenDash() {
  var l = this.getTotalLength(),
      i = d3.interpolateString("0," + l, l + "," + l);
  return function(t) { return i(t); }
}
