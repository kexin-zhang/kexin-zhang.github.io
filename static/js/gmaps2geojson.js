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

    var coords = [
                   [-84.3880, 33.7490],
                   [-90.0715, 29.9511],
                   [-91.1871, 30.4515],
                   [-95.3698, 29.7604],
                   [-96.3344, 30.6280],
                   [-97.7431, 30.2672]
                 ]

    // plot a circle for each city
    g.selectAll(".city")
      .data(coords)
      .enter()
      .append("circle")
      .attr("class", "city")
      // projection takes in lon, lat pairs
      .attr("cx", function(d) { return projection(d)[0]; })
      .attr("cy", function(d) { return projection(d)[1]; })
      .attr("r", "8px");

    var labels = [
      {text: "ATLANTA", x: 0, y: -10, align: "middle"},
      {text: "NEW ORLEANS", x: 0, y: 16, align: "start"},
      {text: "BATON ROUGE", x: 15, y: -10, align: "end"},
      {text: "HOUSTON", x: 0, y: 17, align: "middle"},
      {text: "COLLEGE STATION", x: -10, y: -10, align: "start"},
      {text: "AUSTIN", x: -10, y: 2, align: "end"},
    ]

    // add text labels
    g.selectAll("text")
     .data(labels)
     .enter()
     .append("text")
     .attr("x", function(d, i) { return projection(coords[i])[0] + d.x; })
     .attr("y", function(d, i) { return projection(coords[i])[1] + d.y; })
     .attr("text-anchor", function(d) { return d.align; })
     .text(function(d) { return d.text; });
  });
}
