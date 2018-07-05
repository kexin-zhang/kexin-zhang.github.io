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

function transformPoint(x, y) {
  var point = map.latLngToLayerPoint(new L.LatLng(y, x));
  return {x: point.x, y: point.y};
}

var transform = d3.geoTransform({point: projectPoint}),
    path = d3.geoPath().projection(transform);

var line = d3.line()
             .curve(d3.curveLinear)
             .x(function(d) { return transformPoint(d[0], d[1]).x; })
             .y(function(d) { return transformPoint(d[0], d[1]).y; });

var radius = 7;

// i feel like its kinda dumb that everything is in here but idk how to get around it
d3.json("/static/js/geojson/onp.geojson", function(error, data) {
  if (error) throw error; 

  var driveCoordinates = data.features.filter(function(d) { return d.properties.name === "drive"; });
  var hikeCoordinates = data.features.filter(function(d) { return d.properties.name === "hike"; });
  var driveToLakeCoordinates = data.features.filter(function(d) { return d.properties.name === "lake-drive"; });
  var raftCoordinates = data.features.filter(function(d) { return d.properties.name === "raft"; });

  var drive = g.selectAll(".drive")
                .data(driveCoordinates)
                .enter()
                .append("path")
                .attr("class", "drive");
  
  var hike = g.selectAll(".hike")
              .data(hikeCoordinates)
              .enter()
              .append("path")
              .attr("class", "hike");

  var driveToLake = g.selectAll(".lake-drive")
                      .data(driveToLakeCoordinates)
                      .enter()
                      .append("path")
                      .attr("class", "lake-drive");

  var raft = g.selectAll(".raft")
            .data(raftCoordinates)
            .enter()
            .append("path")
            .attr("class", "raft");
  
  // plot circle at starting point
  var circle = g.selectAll("circle")
                .data([driveCoordinates[0].geometry["coordinates"][0][0]]) // starting coordinate
                .enter()
                .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("transform", function(d) {
                  var p = transformPoint(d[0], d[1]);
                  return "translate(" + p.x + "," + p.y + ")";
                })
                .attr("r", radius)
                .attr("class", "drive-circle")
                .attr("id", "current-pos"); 

  
  // init first path
  drive.attr("d", path);
  transition(drive, 10000, zoomStaircase);

  // hit that reset function on zoom
  map.on("viewreset moveend", reset);

  // ---------- all of the nested functions start here ----------
  function plotHike() {
    hike.attr("d", path);
    circle.attr("class", "hike-circle")
    transition(hike, 7000,  plotLakeDrive);
  }

  function plotLakeDrive() {
    driveToLake.attr("d", path);
    circle.attr("class", "drive-circle")
    transition(driveToLake, 5000, plotRaft);
  }

  function plotRaft() {
    raft.attr("d", path);
    circle.attr("class", "raft-circle");
    transition(raft, 8000, null);
  }

  function transition(path, duration,  callback) {
    path.transition()
        .duration(duration)
        .attrTween("stroke-dasharray", function() {
          return function(t) { 
            // for stroke dash array interpolation
            // https://bl.ocks.org/mbostock/5649592
            var l = path.node().getTotalLength(),
                i = d3.interpolateString("0," + l, l + "," + l);
      
            var p = path.node().getPointAtLength(t * l);
            circle.attr("transform", "translate(" + p.x + "," + p.y + ")");
      
            return i(t); 
          }
        })
        .on("end", callback); // just gonna chain all the transitions together lol
  }

  function zoomStaircase() {
    d3.selectAll(".drive").remove();
    circle.classed("hide", true);
    map.flyTo([47.512171, -123.323818], 14);
  }

  function reset() {
    // i feel like there's a better way to do this but setting drive.attr("d", path) isnt working??
    if (map.getZoom() == 14) {
      g.selectAll(".drive")
                  .data(driveCoordinates)
                  .enter()
                  .append("path")
                  .attr("class", "drive")
                  .attr("d", path);
      
      // make the circle radius bigger so it seems like it's zooming in lmao
      // also add transform so it's in the correct spot
      circle.classed("hide", false)
            .attr("r", radius + 3)
            .attr("transform", function() {
              var p = transformPoint(-123.32757, 47.51479); // hardcoding the stopping point b/c this is easiest
              return "translate(" + p.x + "," + p.y + ")";
            });

      plotHike();
    } else {
      plotDrive();
    }
  }

});
