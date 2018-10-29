const iterations = 3000;
const alpha = 1;
const divId = "#chart";
const histDivId = "#hist";
let margin = {
    'top': 50,
    'left': 40,
    'bottom': 20,
    'right': 30
};
const hist_height = (300 - margin.top - margin.bottom) * (0.3 / 0.4);
const height = 300 - margin.top - margin.bottom;
const width = 1000 - margin.right - margin.left;

// function for sampling from our proposal distribution
function f() {
    return jStat.uniform.sample(-alpha, alpha);
}

// run random walk mh
function metropolisHastings() {
    let vals = jStat.zeros(rows=1, cols=iterations);
    vals = vals[0];
    vals[0] = 0;
    let curr = vals[0];
    for (let i = 1; i < iterations; i++) {
        proposed = curr + f();
        prob = Math.min(1, jStat.normal.pdf(proposed, 0, 1) / jStat.normal.pdf(curr, 0, 1));
        unif = jStat.uniform.sample(0, 1);
        if (unif < prob) {
            curr = proposed;
        }
        vals[i] = curr;
    }
    return vals;
}

(function() {
    
    let vals = metropolisHastings()
    
    // init walk graph
    let div = d3.select(divId);
    let svg = div.append("svg")
                 .attr("width", "100%")
                 .attr("height", "100%")
                 .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.bottom + margin.top}`)
                 .attr("preserveAspectRatio", "xMinYMin meet");
    
    let g = svg.append("g")
               .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    const range = jStat.arange(iterations)
    
    let x = d3.scaleLinear()
              .range([0, width])
              .domain([0, iterations]);
    
    let y = d3.scaleLinear()
              .range([height, 0])
              .domain([d3.min(vals), d3.max(vals)]);
    
    let line = d3.line()
                 .x((d, i) => x(i))
                 .y((d) => y(d))
    
    let path = g.append("path")
                .attr("class", "line");
    
    g.append("g")
     .call(d3.axisLeft(y));
    
    g.append("g")
     .attr("transform", `translate(0, ${height})`)
     .call(d3.axisBottom(x));
    
    svg.append("text")
       .attr("x", (width + margin.left + margin.right) / 2)
       .attr("y", 10)
       .attr("class", "title")
       .text("Random Walk Path");
    
    // init histogram
    let hist_div = d3.select(histDivId);
    let hist_svg = hist_div.append("svg")
                 .attr("width", "100%")
                 .attr("height", "100%")
                 .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${hist_height + margin.bottom + margin.top}`)
                 .attr("preserveAspectRatio", "xMinYMin meet");
    
    let hist_g = hist_svg.append("g")
               .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    let hist_x = d3.scaleLinear()
                   .rangeRound([0, width])
                   .domain([d3.min(vals), d3.max(vals)]);
    
    let hist_y = d3.scaleLinear()
                   .range([hist_height, 0]);
    
    let histogram = d3.histogram()
                      .value((d) => d)
                      .domain(hist_x.domain())
                      .thresholds(hist_x.ticks(20));
    
    let bins = histogram(vals.slice(0, 1));
    hist_y.domain([0, d3.max(bins, (d) => d.length)]);
    
    let bars = hist_g.selectAll(".bar")
                .data(bins)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", 1)
                .attr("transform", (d) => `translate(${hist_x(d.x0)}, ${hist_y(d.length)})`)
                .attr("width", (d) => (hist_x(d.x1) - hist_x(d.x0) - 1))
                .attr("height", (d) => (hist_height - hist_y(d.length)));
               
    hist_g.append("g")
     .attr("transform", `translate(0, ${hist_height})`)
     .call(d3.axisBottom(hist_x));
    
    hist_svg.append("text")
     .attr("x", (width + margin.left + margin.right) / 2)
     .attr("y", 10)
     .attr("class", "title")
     .text("Simulated Distribution");
    
    // update graphs
    let counter = 1;
    let show = setInterval(() => {
        counter += 5;
        path.data([vals.slice(0, counter)])
            .transition()
            .duration(90)
            .attr("d", line);
    
        bins = histogram(vals.slice(0, counter));
        hist_y.domain([0, d3.max(bins, (d) => d.length)]);
    
        bars.data(bins)
            .transition()
            .duration(90)
            .attr("transform", (d) => `translate(${hist_x(d.x0)}, ${hist_y(d.length)})`)
            .attr("width", (d) => (hist_x(d.x1) - hist_x(d.x0) - 1))
            .attr("height", (d) => (hist_height - hist_y(d.length)));
    
        if (counter >= (iterations - 1)) {
            clearInterval(show);
        }
    }, 120);
    
})();