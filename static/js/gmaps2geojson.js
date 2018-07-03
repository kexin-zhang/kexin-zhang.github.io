var width = 860;
var height = 600;

var svg = d3.select("#map")
            .append("svg")
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("viewBox", "0 0 " + width + " " + height)
            .attr("preserveAspectRatio", "xMidYMid meet");

var g = svg.append("g");

// center this around NOLA bc its kind of in the middle lol
var projection = d3.geoAlbers()
                   .scale([2500])
                   .rotate([90.0715, 0])
                   .center([0, 29.9511])
                   .translate([width/2, height/2]);

var path = d3.geoPath()
             .projection(projection);

d3.json("/static/js/geojson/us-states.geojson", function(error, data) {
  if (error) throw error;

  var features = data.features;

  var map = g.selectAll(".base")
             .data(features)
             .enter()
             .append("path")
             .attr("class", "base")
             .attr("d", path);

  drawRoutes();
});

function drawRoutes() {
  d3.json("/static/js/geojson/roadtrip.geojson", function(error, data) {
    if (error) throw error;

    var features = data.features;

    var route = g.selectAll(".routes")
                 .data(features)
                 .enter()
                 .append("path")
                 .attr("class", "routes")
                 .attr("d", path);
  });
}
