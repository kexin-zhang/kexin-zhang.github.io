function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//tooltip init
var tip = d3.tip().attr("class", "d3-tip").html(function(d){return "City only: " + numberWithCommas(d.data.subset) + "<br>Inside metro area, outside of city: " + numberWithCommas(d.data.remaining) + "<br>Total: " + numberWithCommas(d.data.total); });

// theme colors
var blue = "#03a9f4",
	gray = "#cfd8dc",
	teal = "#009688",
	red = "#b71c1c";

// population graphs
var population_data = [{
                "name": "New York City",
                "subset": 8550405,
                "total": 20182305,
        },
            {
                "name": "Atlanta",
                "subset": 463875,
                "total": 5709731,
        },
            {
                "name": "Boston",
                "subset": 669469,
                "total": 4774321,
        },
            {
                "name": "San Francisco",
                "subset": 864816,
                "total": 4656132,
        }];

// find the population in the metropolitan area, but outside of city boundaries
population_data.forEach(function(d) {
	d.remaining = d.total - d.subset;
});

var margin= {
    top: 50,
    right: 20,
    bottom: 20,
    left: 100
}

var width = 960 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

var x = d3.scaleLinear()
          .range([0, width]);

var y = d3.scaleBand()
          .rangeRound([height, 0])
          .padding(0.2);

var z = d3.scaleOrdinal()
    .range([blue, gray]);

var svg = d3.select("#population")
  			.append("svg")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
        .attr("preserveAspectRatio", "xMidYMid meet");

var g = svg.append("g")
		   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// init tooltip
g.call(tip);

//relevant fields for stacked bar chart
var keys = ["subset", "remaining"];

//axis domains
x.domain([0, d3.max(population_data, function(d) { return d.total; })]);
y.domain(population_data.map(function(d) { return d.name; }));
z.domain(keys);

var bars = g.append("g")
			.selectAll("g")
			.data(d3.stack().keys(keys)(population_data))
			.enter()
			.append("g")
			.attr("fill", function(d) { return z(d.key); })
			.selectAll("rect")
			.data(function(d) { return d; })
			.enter()
			.append("rect")
			.attr("y", function(d) {return y(d.data.name); })
			.attr("x", function(d) {return x(d[0]); })
			.attr("width", function(d) {return x(d[1]) - x(d[0]); })
			.attr("height", y.bandwidth())
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

//axes
g.append("g")
 .call(d3.axisBottom(x).ticks(null, "s"))
 .attr("transform", "translate(0," + height + ")");

g.append("g")
 .call(d3.axisLeft(y));

var population_title = svg.append("text")
						  .attr("x", (width + margin.left + margin.right)/2)
						  .attr("y", 40)
						  .attr("text-anchor", "middle")
						  .text("2015 Census Population Estimates");

//tooltip for area 
var tip = d3.tip().attr("class", "d3-tip").html(function(d){ return "Area: " + numberWithCommas(d.data.area) + " sq. miles"});

// area bubble chart
var area_data = { 
		"children" :[{
                "name": "NYC Metro",
                "area": 8292.9,
        },
            {
                "name": "ATL Metro",
                "area": 8681.8
        },
            {
                "name": "BOS Metro",
                "area": 3487.6
        },
            {
                "name": "SF Metro",
                "area": 2477.7
        }, {
        		"name": "NYC",
        		"area": 301.5
    	},  {
        		"name": "BOS",
        		"area": 48.4,
    	},  {
        		"name": "ATL",
        		"area": 133.1
    	}, {
        		"name": "SF",
        		"area": 46.9
    	}]
      };

var diameter = 400,
	format = d3.format(",d")
	margin_top = 50;

var bubble = d3.pack(area_data)
			   .size([diameter, diameter])
			   .padding(1.5);

var svg = d3.select('#area')
			.append("svg")
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("viewBox", "0 0 " + diameter + " " + (diameter + margin_top))
      .attr("preserveAspectRatio", "xMidYMid meet");

var g = svg.append("g")
			.attr("class", "bubble")
			.attr("transform", "translate(0, " + margin_top + ")" );

g.call(tip);

var nodes = d3.hierarchy(area_data)
			  .sum(function(d) { return d.area; });

var node = g.selectAll(".node")
			  .data(bubble(nodes).descendants())
			  .enter()
			  .filter(function(d) {
			  	return !d.children;
			}).append("g")
			  .attr("class", "node")
			  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y +")";})
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

node.append("title")
	.text(function(d) { return d.name; });

node.append("circle")
	.attr("r", function(d) { return d.r })
	.style("fill", teal );

node.append("text")
	.attr("dy", ".3em")
	.style("text-anchor", "middle")
	.text(function(d) { return d.data.name });

d3.select(self.frameElement)
  .style("height", diameter + "px");

var population_title = svg.append("text")
						  .attr("x", diameter/2)
						  .attr("y", 40)
						  .attr("text-anchor", "middle")
						  .text("Geographic Area of Cities and Their Metropolitan Areas");

//tooltip for population density
var tip = d3.tip().attr("class", "d3-tip").html(function(d){ return d.key + " population density: " + numberWithCommas(d.value); });

// population density grouped bar chart
var pop_density = [
	{
		"name": "San Francisco",
		"City": 18441.8,
		"Metro area": 1879.2
	},
	{
		"name": "Boston",
		"City": 13841.8,
		"Metro area": 1368.9
	},
	{
		"name": "Atlanta",
		"City": 3485.2,
		"Metro area": 657.7
	},
	{
		"name": "New York City",
		"City": 28362.8,
		"Metro area": 2433.7
	}
];

var width = 400,
	height = 450,
	margin = {
		top: 50,
		right: 20,
		bottom: 30,
		left: 80
	};

var svg = d3.select("#density")
			.append("svg")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMidYMid meet");

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var g = svg.append("g")
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

g.call(tip);

var x0 = d3.scaleBand()
		   .rangeRound([0, width])
		   .paddingInner(0.1);

var x1 = d3.scaleBand()
		   .padding(0.05);

var y = d3.scaleLinear()
		  .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
		  .range([red, gray]);

var keys = ["City", "Metro area"];

x0.domain(pop_density.map(function(d) { return d.name; }));
x1.domain(keys).rangeRound([0, x0.bandwidth()]);
y.domain([0, d3.max(pop_density, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

g.append("g")
 .selectAll("g")
 .data(pop_density)
 .enter()
 .append("g")
 .attr("transform", function(d) { return "translate(" + x0(d.name) + ",0)"; })
 .selectAll("rect")
 .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
 .enter()
 .append("rect")
 .attr("x", function(d) { return x1(d.key); })
 .attr("y", function(d) { return y(d.value); })
 .attr("width", x1.bandwidth())
 .attr("height", function(d) { return height - y(d.value); })
 .attr("fill", function(d) { return z(d.key); })
 .on("mouseover", tip.show)
 .on("mouseout", tip.hide);

 g.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x0));

g.append("g")
 .call(d3.axisLeft(y).ticks(null, "s"))
 .append("text")
 .attr("x", 2)
 .attr("y", y(y.ticks().pop()) + 0.5)
 .attr("dy", ".3em")
 .attr("fill", "#000")
 .attr("font-weight", "bold")
 .attr("text-anchor", "start")
 .text("per sq. mile");

 var density_title = svg.append("text")
						 .attr("x", (width + margin.left + margin.right)/2)
						 .attr("y", 40)
						 .attr("text-anchor", "middle")
						 .text("2015 Population Density");


//function for drawing maps
function drawMap(div_id, rotate_x, center_y, scale, cityjson, routesjson, stopsjson, title) {
	var height = 350;
	var width = 400;
    
    var div = d3.select(div_id)
                .style("height", height + "px")
                .style("width", "45%");

    var projection = d3.geoAlbers()
                        .scale(scale)
                         .rotate([rotate_x, 0])
                         .center([0, center_y])
                         .translate([width/2, height/2]);

    var path = d3.geoPath()
                 .projection(projection);

    //map of the underlying city
    d3.json(cityjson, function(error, data) {
        if (error) {
          console.log(error);
        }

        var features = data.features;

        var boston = div.append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("class", "mapLayer")
                        .selectAll(".neighborhoods")
                        .data(features)
                        .enter()
                        .append("path")
                        .attr("class", "neighborhoods")
                        .attr('d', path);
    });

    //paths to map the routes
    d3.json(routesjson, function(error, data) {
      if (error) {
        console.log(error);
      }

      div.append("svg")
         .attr("width", width)
         .attr("height", height)
         .attr("class", "routesLayer")
         .selectAll(".routes")
         .data(data.features)
         .enter()
         .append("path")
         .attr("class", "routes")
         .attr("stroke", "#000")
         .attr("d", path);
    });

    //circles for each station
    d3.json(stopsjson, function(error, data) {
      if (error) {
        console.log(error);
      }

      div.append("svg")
         .attr("width", width)
         .attr("height", height)
         .attr("class", "stationLayer")
         .selectAll(".stations")
         .data(data.features)
         .enter()
         .append("circle")
         .attr("cx", function(d) { return projection(d.geometry.coordinates)[0]; })
         .attr("cy", function(d) { return projection(d.geometry.coordinates)[1]; })
         .attr("fill", "#000")
         .attr("stroke", "#000")
         .attr("r", "1px");
    });

    div.append("svg")
       .style("z-index", "100000")
       .style("position", "absolute")
       .attr("width", width)
       .attr("height", 50)
       .append("text")
       .attr("x", 15)
       .attr("y", 15)
       .text(title);
}

boston = drawMap('#boston', 71.057, 42.313, 55000, "/static/js/geojson/greater_boston.json", "/static/js/geojson/subwaylines_p_odp.json", "/static/js/geojson/boston_stations.json", "Greater Boston Area");

sf = drawMap('#sf', 122.2711, 37.8044, 39000, '/static/js/geojson/bay_area.geojson', '/static/js/geojson/bart_routes.json', '/static/js/geojson/bart_stations.json', "Bay Area");

atlanta = drawMap('#atl', 84.3880, 33.7750, 48000, "/static/js/geojson/atl_counties.json", "/static/js/geojson/marta_routes.json", "/static/js/geojson/marta_stations.json", "Metro Atlanta (Fulton, Clayton, Dekalb Counties)");

nyc = drawMap('#nyc', 74.0059, 40.7128, 45000, '/static/js/geojson/nyc.geojson', '/static/js/geojson/nyc_subway_line.geojson', '/static/js/geojson/nyc_stops.geojson', "New York City");

// annual ridership bar graph tooltips
var tip = d3.tip().attr("class", "d3-tip").html(function(d){return "Annual ridership: " + numberWithCommas(d.value); });

var ridership = [
	 {
		"name": "NYC Subway",
		"value": 2750527400
	},	{
		"name": "MARTA (ATL)",
		"value": 68678700
	},	{
		"name": "MBTA (BOS)",
		"value": 172105800
	},{
		"name": "BART (SF)",
		"value": 135310700
	}
];

var margin= {
    top: 50,
    right: 20,
    bottom: 20,
    left: 75
}

var width = 960 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;

var x = d3.scaleLinear()
		  .range([0, width]);

var y = d3.scaleBand()
		  .rangeRound([height, 0])
		  .padding(0.2);

var svg = d3.select("#ridership")
			.append("svg")
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
      .attr("preserveAspectRatio", "xMidYMid meet");

var g = svg.append("g")
		   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

g.call(tip);

x.domain([0, d3.max(ridership, function(d) { return d.value })]);
y.domain(ridership.map(function(d) { return d.name; }));

g.selectAll("rect")
 .data(ridership)
 .enter()
 .append("rect")
 .attr("width", function(d) { return x(d.value); })
 .attr("height", y.bandwidth())
 .attr("x", 0)
 .attr("y", function(d) { return y(d.name) })
 .style("fill", teal)
 .on("mouseover", tip.show)
 .on("mouseout", tip.hide);

g.append("g")
 .attr("transform", "translate(0," + height + ")")
 .call(d3.axisBottom(x).ticks(null, "s"));

g.append("g")
 .call(d3.axisLeft(y));

svg.append("text")
   .attr("x", (width + margin.left + margin.right)/2.4)
   .attr("y", 40)
   .text("2016 Subway Ridership");


var options = ["Drove alone", "Carpooled", "Public transit", "Bicycle", "Walked", "Other", "Worked at home"]
var tip = d3.tip().attr("class", "d3-tip").html(function(d){ return options[d.index] + " " + d.value + "%"; });

var percent_public = [
  {
    "name": "SF",
    "percentages": [
      {"name": "Drove alone", "value": 35.3},
      {"name": "Carpooled", "value": 6.5},
      {"name": "Public transit", "value": 34.7},
      {"name": "Bicycle", "value": 4.3},
      {"name": "Walked", "value": 10.4},
      {"name": "Other", "value": 2.7},
      {"name": "Worked at home", "value": 6.2}
    ]
  }, {
    "name": "BOS", 
    "percentages": [
      {"name": "Drove alone", "value": 37.4},
      {"name": "Carpooled", "value": 5.7},
      {"name": "Public transit", "value": 34.5},
      {"name": "Bicycle", "value": 1.6},
      {"name": "Walked", "value": 16.7},
      {"name": "Other", "value": 1.1},
      {"name": "Worked at home", "value": 3.1}
    ]
  }, {
    "name": "ATL",
    "percentages": [
      {"name": "Drove alone", "value": 69},
      {"name": "Carpooled", "value": 7.3},
      {"name": "Public transit", "value": 10.1},
      {"name": "Bicycle", "value": .7},
      {"name": "Walked", "value": 4.4},
      {"name": "Other", "value": .7},
      {"name": "Worked at home", "value": 7.8}
    ]
  }, {
    "name": "NYC",
    "percentages": [
      {"name": "Drove alone", "value": 21.8},
      {"name": "Carpooled", "value": 4.4},
      {"name": "Public transit", "value": 57},
      {"name": "Bicycle", "value": 1.2},
      {"name": "Walked", "value": 10.1},
      {"name": "Other", "value": 1.5},
      {"name": "Worked at home", "value": 4}
    ]
  }
];

var radius = 65;
var donutWidth = 25;
var padding = 10;
var margin_top = 50;

var color = d3.scaleOrdinal(d3.schemeCategory20c);

d3.select("#percent-subway-title")
  .append("svg")
  .attr("height", "100%")
  .attr("width", "100%")
  .attr("viewBox", "0 0 " + ((radius + padding)*8) + " " + margin_top)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("text")
  .attr("x", 300)
  .attr("y", 40)
  .text("2015 Means of Transportation to Work")
  .style("font-size", "10px")
  .style("text-anchor", "middle");

var svg = d3.select("#percent-subway")
            .selectAll(".pie")
            .data(percent_public)
            .enter()
            .append("div")
            .attr("class", "pie")
            .append("svg")
            .attr("width", (radius + padding) * 2)
            .attr("height", (radius * 2))
            .append("g")
            .attr("transform", "translate(" + radius + "," + radius + ")");

svg.call(tip);

var arc = d3.arc()
            .innerRadius(radius - donutWidth)
            .outerRadius(radius);

var pie = d3.pie()
            .value(function(d) { return d.value; })
            .sort(null);

var path = svg.selectAll('path')
              .data(function(d) { return pie(d.percentages); })
              .enter()
              .append('path')
              .attr('d', arc)
              .attr('fill', function(d) {return color(d.data.name);})
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);

var titles = svg.append("text")
                .attr("dy", ".35em")
                .style("text-anchor", "middle")
                .text(function(d) { return d.name });

var modes = [
      {"name": "Drove alone", "value": "#3182BD"},
      {"name": "Carpooled", "value": "#6BAED6"},
      {"name": "Public transit", "value": "#9ECAE1"},
      {"name": "Bicycle", "value": "#C6DBEF"},
      {"name": "Walked", "value": "#E6550D"},
      {"name": "Other", "value": "#FD8D3C"},
      {"name": "Worked at home", "value": "#FDAE6B"}
]

var legend = d3.select("#percent-subway-legend")
            .append("svg")
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("viewBox", "0 0 " + ((radius + padding)*8) + " " + margin_top)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "middle")
            .selectAll("g")
            .data(modes)
            .enter()
            .append("g")
            .attr("transform", function(d, i) { return "translate(" + (20 + i*80) + ",0)"; });

legend.append("rect")
      .attr("width", 70)
      .attr("height", 10)
      .style("fill", function(d) { return d.value; });

legend.append("text")
      .attr("x", 35)
      .attr("y", 18)
      .attr("dy", ".32em")
      .style('text-anchor', "middle")
      .text(function(d) { return d.name; });