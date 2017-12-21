var map_margins = {
    top: 40,
    left: 20,
    bottom: 20,
    right: 20
};
var map_height = 320 - map_margins.top - map_margins.bottom; 
var map_width = 670 - map_margins.left - map_margins.right;
var rotate_x = 74.0059;
var center_y = 40.7128;
var scale = 45000;
var colors = ["#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"];

var airbnb_svg = d3.select("#airbnb-map")
                   .append("svg")
                   .attr("height", "100%")
                   .attr("width", "100%")
                   .attr("viewBox", "0 0 " + (map_width + map_margins.left + map_margins.right) + " " + (map_height + map_margins.top + map_margins.bottom))
                   .attr("preserveAspectRatio", "xMidYMid meet");


var airbnb_g = airbnb_svg.append("g")
                         .attr("transform", "translate(" + map_margins.left + "," + map_margins.top + ")");

var hotel_svg = d3.select("#hotel-map")
                   .append("svg")
                   .attr("height", "100%")
                   .attr("width", "100%")
                   .attr("viewBox", "0 0 " + (map_width + map_margins.left + map_margins.right) + " " + (map_height + map_margins.top + map_margins.bottom))
                   .attr("preserveAspectRatio", "xMidYMid meet");


var hotel_g = hotel_svg.append("g")
                       .attr("transform", "translate(" + map_margins.left + "," + map_margins.top + ")");

var projection = d3.geoAlbers()
                    .scale(scale)
                    .rotate([rotate_x, 0])
                    .center([0, center_y])
                    .translate([map_width/2, map_height/2]);

var path = d3.geoPath()
             .projection(projection);

var scale = d3.scaleQuantile()
              .range(colors);

var hotels_scale = d3.scaleQuantile()
                     .range(colors);

//map of the underlying city
d3.json('/static/js/geojson/nyc.geojson', function(error, data) {
    if (error) {
      console.log(error);
    }

    var features = data.features;

    var map = airbnb_g.selectAll(".map")
                    .data(features)
                    .enter()
                    .append("path")
                    .attr("class", "map")
                    .attr('d', path);

    var map = hotel_g.selectAll(".map")
                    .data(features)
                    .enter()
                    .append("path")
                    .attr("class", "map")
                    .attr('d', path);

    addHotels();
});

d3.csv('/static/js/data/listings_tagged.csv', function(error, data) {
    if (error) { console.log(error); throw error; }

    data.forEach(function(d) {
        d.price = +d.price;
        d.lat = +d.latitude;
        d.lon = +d.longitude;
    });

    scale.domain(data.map(function(d) { return d.price; }));

    addLegend(scale, airbnb_g);

    airbnb_g.selectAll(".airbnbs")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", "airbnbs")
          .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
          .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
          .attr("fill", function(d) { return scale(d.price); })
          .attr("stroke", "none")
          .attr("r", "1px")
          .style("opacity", .6);
});


function addHotels() {
    d3.csv('/static/js/data/hotels.csv', function(error, data) {
        if (error) { throw error; }

        data.forEach(function(d) {
            d.price = +d.rates;
            d.lat = +d.lat;
            d.lon = +d.lon;
        });

        hotels_scale.domain(data.map(function(d) { return d.price; }));

        hotel_g.selectAll(".airbnbs")
              .data(data)
              .enter()
              .append("circle")
              .attr("class", "airbnbs")
              .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
              .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
              .attr("fill", function(d) { return hotels_scale(d.price); })
              .attr("stroke", "none")
              .attr("r", "2px")
              .style("opacity", .6)
              .style("z-index", 100);

        addLegend(hotels_scale, hotel_g)
    });
}

hotel_g.append("text")
       .text("Hotels")
       .attr("x", (map_width + map_margins.left)/2)
       .attr("y", 0 - (map_margins.top / 2))
       .style("text-anchor", "middle");

airbnb_g.append("text")
        .text("Airbnbs")
        .attr("x", (map_width + map_margins.left)/2)
        .attr("y", 0 - (map_margins.top / 2))
        .style("text-anchor", "middle");


function addLegend(scale, g) {
    var legend = g.append("g")
                   .attr("transform", "translate(30, 10)");

    var markers = [0].concat(scale.quantiles());

    var texts = scale.quantiles().map(function(d, i) {
        return `\$${ markers[i].toFixed(2) } - \$${ d.toFixed(2) }`;
    });
    texts.push(`>\$${ markers[5].toFixed(2) }`);
    
    var groups = legend.selectAll("g")
                        .data(texts)
                        .enter()
                        .append("g")
                        .attr("transform", function(d, i) { return "translate(0," + i * 15 + ")"; });

    groups.append("rect")
          .attr("fill", function(d, i) { return colors[i]; })
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", 10)
          .attr("height", 10);

    groups.append("text")
          .text(function(d) { return d; })
          .attr("x", 12)
          .attr("y", 8)
          .attr("text-anchor", "start")
          .style("font-size", "9px");
}

var airbnb_data = [{'count': 42850, 'name': 'Wireless Internet'},
 {'count': 41107, 'name': 'Kitchen'},
 {'count': 40454, 'name': 'Heating'},
 {'count': 37721, 'name': 'Essentials'},
 {'count': 37145, 'name': 'Air conditioning'},
 {'count': 35259, 'name': 'Smoke detector'},
 {'count': 28369, 'name': 'TV'},
 {'count': 27652, 'name': 'Hangers'},
 {'count': 26648, 'name': 'Carbon monoxide detector'},
 {'count': 26060, 'name': 'Shampoo'},
 {'count': 23969, 'name': 'Laptop friendly workspace'},
 {'count': 23928, 'name': 'Internet'},
 {'count': 23825, 'name': 'Hair dryer'},
 {'count': 22700, 'name': 'Iron'},
 {'count': 18522, 'name': 'Family/kid friendly'}];

 var hotel_data = [{'count': 217, 'name': 'Air Conditioning'},
 {'count': 217, 'name': 'Free High Speed Internet ( WiFi )'},
 {'count': 201, 'name': 'Multilingual Staff'},
 {'count': 194, 'name': 'Laundry Service'},
 {'count': 178, 'name': 'Fitness Center with Gym / Workout Room'},
 {'count': 175, 'name': 'Dry Cleaning'},
 {'count': 160, 'name': 'Business Center with Internet Access'},
 {'count': 150, 'name': 'Concierge'},
 {'count': 146, 'name': 'Bar/Lounge'},
 {'count': 133, 'name': 'Meeting Rooms'},
 {'count': 130, 'name': 'Restaurant'},
 {'count': 111, 'name': 'Room Service'},
 {'count': 100, 'name': 'Breakfast included'},
 {'count': 70, 'name': 'Refrigerator in room'},
 {'count': 68, 'name': 'Conference Facilities'}]


function barChart(div, data, title) {
     var margin = {
        top: 40,
        left: 200, 
        bottom: 30,
        right: 20
     };

     var width = 960 - margin.left - margin.right;
     var height = 350 - margin.bottom - margin.top;

    var svg = d3.select(div)
                .append("svg")
                .attr("height", "100%")
                .attr("width", "100%")
                .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
                .attr("preserveAspectRatio", "xMidYMid meet");


    var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
              .range([0, width])
              .domain([0, d3.max(data, function(d) { return d.count; })]);

    var y = d3.scaleBand()
              .rangeRound([0, height])
              .domain(data.map(function(d) { return d.name; }))
              .padding(0.1);

    var bars = g.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", function(d) { return y(d.name); })
                .attr("width", function(d) { return x(d.count); })
                .attr("height", y.bandwidth())
                .style("fill", "#225ea8");

    g.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x));

    g.append("g")
     .call(d3.axisLeft(y));

    g.append("text")
     .text(title)
     .attr("x", (width)/2)
     .attr("y", 0 - (margin.top / 2))
     .style("text-anchor", "middle");
}

barChart("#airbnb-bar", airbnb_data, "Most Common Airbnb Amenities");
barChart("#hotel-bar", hotel_data, "Most Common Hotel Amenities");