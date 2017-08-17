var margin= {
    top: 60,
    right: 35,
    bottom: 80,
    left: 35
}

var line_margins = {
  top: 60,
  right: 35,
  bottom: 30,
  left: 35
}

var width = 960 - margin.left - margin.right,
  height = 550 - margin.top - margin.bottom;

var line_width = 960 - line_margins.left - line_margins.right,
    line_height = 300 - line_margins.top - line_margins.bottom;

var x = d3.scaleBand()
          .rangeRound([0, width])
          .padding(0.1);

var x_without7 = d3.scaleBand()
          .rangeRound([0, width])
          .padding(0.1);

var x2 = d3.scaleLinear()
           .range([0, width]);

var y = d3.scaleLinear()
          .range([height, 0]);

var y2 = d3.scaleLinear()
           .range([height, 0]);

var y3 = d3.scaleLinear()
           .range([line_height, 0]);

var y4 = d3.scaleLinear()
           .range([height, 0]);

  // viewBox="0 0 960 500"
  // preserveAspectRatio="xMidYMid meet">

//viewership and ratings graph
var svg = d3.select("#got-ratings")
      .append("svg")
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
      .attr("preserveAspectRatio", "xMidYMid meet");

//detailed line graph with ratings
var linesvg = d3.select("#got-ratings-detailed")
                .append("svg")
                .attr("height", "100%")
                .attr("width", "100%")
                .attr("viewBox", "0 0 " + (line_width + line_margins.left + line_margins.right) + " " + (line_height + line_margins.top + line_margins.bottom))
                .attr("preserveAspectRatio", "xMidYMid meet");

//deaths bar graph
var deaths_svg = d3.select("#deaths-bar")
                   .append("svg")
                  .attr("height", "100%")
                  .attr("width", "100%")
                  .attr("viewBox", "0 0 " + (width + line_margins.left + line_margins.right) + " " + (height + line_margins.top + line_margins.bottom))
                  .attr("preserveAspectRatio", "xMidYMid meet");

var deaths_svg2 = d3.select("#deaths-ratings")
                    .append("svg")
                    .attr("height", "100%")
                    .attr("width", "100%")
                    .attr("viewBox", "0 0 " + (width + line_margins.left + line_margins.right) + " " + (height + line_margins.top + line_margins.bottom))
                    .attr("preserveAspectRatio", "xMidYMid meet");

var g = svg.append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var line_g = linesvg.append("g")
             .attr("transform", "translate(" + line_margins.left + "," + line_margins.top + ")");

var deaths_g = deaths_svg.append("g")
                         .attr("transform", "translate(" + line_margins.left + "," + line_margins.top + ")");

var deaths_g2 = deaths_svg2.append("g")
                           .attr("transform", "translate(" + line_margins.left + "," + line_margins.top + ")");

var valueline = d3.line()
                  .x(function(d) { return x(d.name) + x.bandwidth()/2; })
                  .y(function(d) { return y2(d.rating); });

var valueline_detailed = d3.line()
                           .x(function(d) { return x(d.name) + x.bandwidth()/2; })
                           .y(function(d) { return y3(d.rating); });

var color = function(d) {
  var season = d.season;
  var c = '#EBC844';
  switch(season) {
    case "6":
      c = '#A2B86C';
      break;
    case "5":
      c = "#5CA793";
      break;
    case "4":
      c = "#1395BA";
      break;
    case "3":
      c = "#117899";
      break;
    case "2":
      c = "#0F5B78";
      break;
    case "1":
      c = "#0D3C55";
      break;
  }
  return c;
}

//tooltip configs
var tip = d3.tip().attr("class", "d3-tip").html(function(d) { return d.name; }); 
var ratings_tip = d3.tip().attr("class", "d3-tip").html(function(d){return "Episode: " + d.name + " " + d.title + "<br>Rating: " + d.rating; });
var deaths_tip = d3.tip().attr("class", "d3-tip").html(function(d){return "Episode: " + d.name + " " + d.title + "<br>Death Count: " + d.deaths; });
var deaths_tip2 = d3.tip().attr("class", "d3-tip").html(function(d){return "Episode: " + d.name + " " + d.title + "<br>Death Count: " + d.deaths + "<br>Rating: " + d.rating; });


d3.csv('/static/js/data/episode_data.csv', function(error, eps) {
    if (error) throw error;

    eps.forEach(function(d) {
      d.viewers = +d.viewers;
      d.rating = +d.rating;
      d.deaths = +d.deaths;
    });

    //mean for average line in detailed ratings graph
    var mean = d3.mean(eps, function(d) { return d.rating; });

    x.domain(eps.map(function(d) { return d.name; }));
    x_without7.domain(eps.filter(function(d) { return d.season != "7"; }).map(function(d) { return d.name; }));
    x2.domain([7, d3.max(eps, function(d) { return d.rating; })]);

    y.domain([0, d3.max(eps, function(d) { return d.viewers; })]);
    y2.domain([0, d3.max(eps, function(d) { return d.rating; })]);
    y3.domain([7, d3.max(eps, function(d) { return d.rating; })]);
    y4.domain([0, d3.max(eps, function(d) { return d.deaths; })]);

    g.append("rect")
     .attr("width", width)
     .attr("height", height)
     .attr("x", 0)
     .attr("y", 0)
     .style("fill", "#fff");

    g.selectAll(".bar")
     .data(eps)
     .enter()
     .append("rect")
     .attr("width", x.bandwidth())
     .attr("height", function(d) { return height - y(d.viewers); })
     .attr("x", function(d) { return x(d.name); })
     .attr("y", function(d) { return y(d.viewers); })
     .style('fill', function(d) { return color(d); });

    g.append("path")
     .data([eps])
     .attr("class", "line")
     .attr("d", valueline);

    g.selectAll("circle")
     .data(eps)
     .enter()
     .append("circle")
     .attr("cx", function(d) { return x(d.name) + x.bandwidth()/2; })
     .attr("cy", function(d) { return y2(d.rating); })
     .attr("r", "3")
     .style("fill", function(d) { return color(d); })
     .style("stroke", "black");

    var focus = g.append("g")
             .attr("class", "focus")
             .style("display", "none");

    focus.append("line")
         .attr("class", "x-hover-line")
         .attr("y1", 0)
         .attr("y2", height)
         .attr("x1", 5)
         .attr("x2", 5)
         .style("stroke", "#000")
         .style("stroke-width", "2px");

    var tooltip = d3.select("#got-ratings").append("div")
         .style("position", "absolute")
         .style("z-index", "100")
         .style("pointer-events", "none")
         .attr("class", "d3-tip")
         .style("display", "none");

    g.on("mouseover", function() { 
        focus.style("display", null);
        tooltip.style("display", null);
     })
     .on("mouseout", function() { 
        focus.style('display', "none"); 
        tooltip.style("display", "none")
      })
     .on('mousemove', mousemove);
 
    x.invert = (function(){
        var domain = x.domain();
        var range = x.range();
        var scale = d3.scaleQuantize().domain(range).range(domain)

        return function(x_point){
            return scale(x_point)
        }
    })()

    function mousemove() {
      var point = d3.mouse(this);
      var x_point = x.invert(point[0]);
      var d = eps.filter(function(x) {
        return x.name == x_point;
      });
      d = d[0];
      var axis  = x(d.name) + x.bandwidth()/2
      focus.select(".x-hover-line").attr("y1", y2(d.rating));
      focus.select(".x-hover-line").attr("x1", axis);
      focus.select(".x-hover-line").attr("x2", axis);

      tooltip.style("top", d3.event.pageY + "px");
      tooltip.style("left", (d3.event.pageX + 25) + "px");
      tooltip.html("Episode: " + d.name + " " + d.title + "<br>Rating: " + d.rating + "<br>Viewers: " + d.viewers + "M" );
    }

    line_g.call(ratings_tip);

    line_g.append("path")
      .data([eps])
      .attr("class", "line")
      .attr("d", valueline_detailed);

    line_g.selectAll("circle")
          .data(eps)
          .enter()
          .append("circle")
          .attr("cx", function(d) { return x(d.name) + x.bandwidth()/2; })
          .attr("cy", function(d) { return y3(d.rating); })
          .attr("r", "3")
          .style("fill", function(d) { return color(d); })
          .style("stroke", "black")
          .on('mouseover', ratings_tip.show)
          .on('mouseout', ratings_tip.hide);

    line_g.append("line")
          .attr("class", "mean-line")
          .style("stroke-dasharray", ("3, 3"))
          .attr("x1", x("S1E1"))
          .attr("x2", x("S7E4"))
          .attr("y1", y3(mean))
          .attr("y2", y3(mean));

    deaths_g.call(deaths_tip);

    deaths_g.selectAll("rect")
        .data(eps.filter(function(d) { return d.season != "7"; }))
        .enter()
        .append("rect")
        .attr("width", x_without7.bandwidth())
        .attr("height", function(d) { return height - y4(d.deaths) })
        .attr("x", function(d) { return x_without7(d.name); })
        .attr("y", function(d) { return y4(d.deaths) })
        .attr("fill", function(d) { return color(d); })
        .on('mouseover', deaths_tip.show)
        .on('mouseout', deaths_tip.hide);

    deaths_g2.call(deaths_tip2);

    deaths_g2.selectAll("circle")
             .data(eps.filter(function(d) { return d.season != "7"; }))
             .enter()
             .append("circle")
             .attr("cx", function(d) { return x2(d.rating); })
             .attr("cy", function(d) { return y4(d.deaths); })
             .attr("r", "5")
             .style("fill", function(d) { return color(d); })
             .on('mouseover', deaths_tip2.show)
             .on('mouseout', deaths_tip2.hide);;

    var ticks = x.domain().filter(function(d,i){ return !(i%10); } );
    var ticks2 = x_without7.domain().filter(function(d,i){ return !(i%10); } );

    g.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x).tickValues(ticks));

    line_g.append("g")
          .attr("transform", "translate(0," + line_height + ")")
          .call(d3.axisBottom(x).tickValues(ticks));

    g.append("g")
     .call(d3.axisLeft(y).tickFormat(function(d) { return d + 'M'; }));

    g.append("g")
      .attr("transform", "translate(" + width + ",0)")
      .call(d3.axisRight(y2));

    line_g.append("g")
          .call(d3.axisLeft(y3));

    deaths_g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x_without7).tickValues(ticks2));

    deaths_g.append("g")
            .call(d3.axisLeft(y4));

    deaths_g2.append("g")
             .attr("transform", "translate(0," + height + ")")
             .call(d3.axisBottom(x2));

    deaths_g2.append("g")
             .call(d3.axisLeft(y4));
});

svg.append("text")
   .attr("x", (width + margin.left + margin.right)/2)
   .attr("y", 40)
   .style("text-anchor", "middle")
   .text("Viewership and IMDB User Ratings");

linesvg.append("text")
   .attr("x", (line_width + line_margins.left + line_margins.right)/2)
   .attr("y", 40)
   .style("text-anchor", "middle")
   .text("A More Detailed Look into Ratings");

deaths_svg.append("text")
          .attr("x", (width + margin.left + margin.right)/2)
          .attr("y", 40)
          .style("text-anchor", "middle")
          .text("Deaths per Episode");

deaths_svg2.append("text")
          .attr("x", (width + margin.left + margin.right)/2)
          .attr("y", 40)
          .style("text-anchor", "middle")
          .text("Ratings vs. Deaths");


var seasons = [
  {"season": "1"},
  {"season": "2"},
  {"season": "3"},
  {"season": "4"},
  {"season": "5"},
  {"season": "6"},
  {"season": "7"}
];

var legend = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "middle")
            .selectAll("g")
            .data(seasons)
            .enter()
            .append("g")
            .attr("transform", function(d, i) { return "translate(" + (200 + i*80) + "," + (height + margin.top + margin.bottom/2) + ")"});

legend.append("rect")
      .attr("width", 70)
      .attr("height", 10)
      .style("fill", function(d) { return color(d); });

legend.append("text")
      .attr("x", 35)
      .attr("y", 18)
      .attr("dy", ".32em")
      .style('text-anchor', "middle")
      .text(function(d) { return "Season " + d.season; });


// grouped bar chart
var season_stats = [
  {
    "name": "Season 1",
    "Viewers": 2.515,
    "Rating": 9.09,
    "Deaths": 2.8
  },
  {
    "name": "Season 2",
    "Viewers": 3.795,
    "Rating": 8.98,
    "Deaths": 3.3
  },
  {
    "name": "Season 3",
    "Viewers": 4.966,
    "Rating": 9.03,
    "Deaths": 2.
  },
  {
    "name": "Season 4",
    "Viewers": 6.846,
    "Rating": 9.32,
    "Deaths": 3.5
  }, {
    "name": "Season 5",
    "Viewers": 6.88,
    "Rating": 8.85,
    "Deaths": 2.4
  }, {
    "name": "Season 6",
    "Viewers": 7.688,
    "Rating": 9.09,
    "Deaths": 6.5
  }
];

var formatViewers = function(d) {
  if (d.key == "Viewers") {
    return d.value + "M";
  }
  return d.value;
}

var combined_tip = d3.tip().attr("class", "d3-tip").html(function(d){return d.key + ": " + formatViewers(d); });

var svg_combined = d3.select("#got-combined")
      .append("svg")
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
      .attr("preserveAspectRatio", "xMidYMid meet");

var g_combined = svg_combined.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
       .rangeRound([0, width])
       .paddingInner(0.1);

var x1 = d3.scaleBand()
       .padding(0.05);

var y = d3.scaleLinear()
      .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
      .range(["#5CA793", "#0F5B78", "#C02E1D"]);

var keys = ["Viewers", "Rating", "Deaths"];

x0.domain(season_stats.map(function(d) { return d.name; }));
x1.domain(keys).rangeRound([0, x0.bandwidth()]);
y.domain([0, d3.max(season_stats, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

g_combined.call(combined_tip);

g_combined.append("g")
 .selectAll("g")
 .data(season_stats)
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
 .on('mouseover', combined_tip.show)
 .on('mouseout', combined_tip.hide);;

 g_combined.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x0));

g_combined.append("g")
 .call(d3.axisLeft(y).ticks(null, "s"));

 var density_title = svg_combined.append("text")
             .attr("x", (width + margin.left + margin.right)/2)
             .attr("y", 40)
             .attr("text-anchor", "middle")
             .text("Viewers, Ratings, and Deaths");

var avgs = [
  {"title": "Average Episode Viewers", "color": "#5CA793"},
  {"title": "Average Episode Rating", "color": "#0F5B78"},
  {"title": "Average Episode Deaths", "color": "#C02E1D"}
];

var legend = svg_combined.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "middle")
            .selectAll("g")
            .data(avgs)
            .enter()
            .append("g")
            .attr("transform", function(d, i) { return "translate(" + (255 + i*150) + "," + (height + margin.top + margin.bottom/2) + ")"});

legend.append("rect")
      .attr("width", 140)
      .attr("height", 10)
      .style("fill", function(d) { return d.color; });

legend.append("text")
      .attr("x", 70)
      .attr("y", 18)
      .attr("dy", ".32em")
      .style('text-anchor', "middle")
      .text(function(d) { return d.title; });
