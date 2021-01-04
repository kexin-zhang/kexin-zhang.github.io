const drawPaths = async () => {
  const size = 40;
  const data = await d3.csv("/static/js/data/paths.csv");

  const div = d3.select("#paths");
  const pathContainers = div
    .selectAll(".single-path")
    .data(data)
    .enter()
    .append("div")
    .attr("class", "single-path");

  const svgs = pathContainers
    .append("svg")
    .attr("height", size)
    .attr("width", size);

  svgs
    .append("path")
    .attr("d", (d) => d.path)
    .attr("stroke", "#2c3e50")
    .attr("fill", "transparent");
};

const drawCalendar = (data) => {
  const width = 545;
  const height = 105;
  const box_size = 10;
  const padding = 1;

  const svg = d3
    .select("#calendar")
    .append("svg")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMidYMid meet");
  const g = svg.append("g").attr("transform", "translate(15, 20)");

  const distances = data.reduce((result, row) => {
    result[row.start_date] = +row.distance;
    return result;
  }, {});

  const color = d3
    .scaleSequential(d3.interpolateGreens)
    .domain([0, d3.max(data.map((d) => +d.distance))]);

  const dateFormat = d3.timeFormat("%Y-%m-%d");

  const start = new Date(Date.UTC(2020, 0, 1));
  const end = new Date(Date.UTC(2021, 0, 1));
  const days = d3.timeDay.range(start, end);
  g.selectAll("circle")
    .data(days)
    .enter()
    .append("rect")
    .attr("width", box_size - 2 * padding)
    .attr("height", box_size - 2 * padding)
    .attr("x", (d) => d3.timeWeek.count(start, d) * box_size)
    .attr("y", (d) => d.getUTCDay() * box_size)
    .attr("fill", (d) => {
      const distance = distances[dateFormat(d)];
      return distance ? color(distance) : "#dcdde1";
    })
    .attr("rx", 1);

  g.append("g")
    .selectAll("g")
    .data(d3.utcMonths(start, end))
    .enter()
    .append("g")
    .append("text")
    .attr("x", (d) => d3.timeWeek.count(start, d3.timeWeek.ceil(d)) * box_size)
    .attr("y", -5)
    .text(d3.utcFormat("%b"));

  g.append("g")
    .selectAll("g")
    .data([0, 1, 2, 3, 4, 5, 6])
    .enter()
    .append("g")
    .append("text")
    .attr("x", -10)
    .attr("y", (d) => d * box_size + 8)
    .text((d) => {
      return (
        {
          1: "M",
          3: "W",
          5: "F",
        }[d] || ""
      );
    })
    .attr("text-anchor", "center");
};

const drawWeeklyGraph = ({ data, divId, field, title}) => {
  const width = 560;
  const height = 120;
  const margin = { top: 10, bottom: 30, left: 30, right: 5 };
  const barWidth = width / 52 - 2;

  const svg = d3
    .select(divId)
    .append("svg")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const parseTime = d3.utcParse("%Y-%m-%d");
  const values = data.map((d) => ({
    date: parseTime(d.start_date),
    val: +d[field],
  }));

  const weeklyData = d3.rollup(
    values,
    (v) => d3.sum(v, (d) => d.val),
    (d) => d3.timeWeek.count(d3.utcYear(d.date), d.date)
  );

  const start = new Date(Date.UTC(2020, 0, 1));
  const x = d3
    .scaleTime()
    .domain([start, new Date(Date.UTC(2021, 0, 1))])
    .range([margin.left, width - margin.right]);

  const maxDistance = Array.from(weeklyData.keys()).reduce(
    (max, key) => (weeklyData.get(key) > max ? weeklyData.get(key) : max),
    0
  );
  const y = d3
    .scaleLinear()
    .domain([0, maxDistance])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const formatMonth = d3.timeFormat("%b");
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat((d) => formatMonth(d)));

  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).ticks(height / 40))
    .append("text")
    .attr("x", 3)
    .attr("y", 6)
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .text(title);

  svg
    .append("g")
    .attr("fill", "#2980b9")
    .selectAll("rect")
    .data(Array.from(weeklyData.keys()))
    .join("rect")
    .attr("x", (d) => x(d3.timeWeek.offset(start, d)) - barWidth / 2)
    .attr("y", (d) =>  y(weeklyData.get(d)))
    .attr("width", barWidth)
    .attr("height", (d) => y(0) - y(weeklyData.get(d)));
};

(async () => {
  drawPaths();

  const data = await d3.csv("/static/js/data/activities.csv");
  drawCalendar(data);
  drawWeeklyGraph({
    data,
    divId: '#weekly-distance',
    field: 'distance',
    title: 'Weekly distance (miles)'
  });
  drawWeeklyGraph({
    data,
    divId: '#weekly-elevation',
    field: 'elevation_gain',
    title: 'Weekly elevation gain (feet)' 
  });
})();
