---
title: A Year in Running
layout: d3post
author: Kexin Zhang
css: /static/css/year-in-running.css
script: /static/js/year-in-running.js
---
*Much of this blog post was inspired by [Marcus Volz's Strava data visualizations in R](https://marcusvolz.com/strava/){:target="_blank"}. I had fun recreating many of the same ideas using JavaScript and D3.js.*

In the midst of a long, weird year, I was lucky to find a few things to look forward to - including running outside. Although I've been running on and off for years now, I don't think I ever fully appreciated it until this year. These days, I'm spending a lot of my time indoors and looking at various screens, so any opportunity to run and to feel the wind or the sun or the rain is exhilarating. So.. I made a few visualizations to look back on this year's runs.

In 2020, I ran outside 157 times, all of which were recorded in Strava. I think I also ran on the treadmill a few times, but I left those out of these visualizations. Below, I've plotted every single route I ran this year. I have quite a few favorite spots that I revisit over and over in my runs, and that's reflected here. 

<div id="paths"></div>

Here, all of my runs in Seattle are plotted to form a heatmap of places I've run by this year.

<div id="heatmap"><img src="/static/img/paths.svg" alt="Heatmap of running routes" /></div>

It's also pretty new for me to be consistent with my running schedule. At the beginning of the year, I had some issues with my IT band, which flared up every time I tried to run. Thankfully, my IT band calmed down in March, when the first lockdowns happened in Washington. I started running again just to have an excuse to go outside. Since then, I have continued running four times a week during most weeks.

<div id="calendar" class="max-width-1200"></div>

During this time, my weekly milage has plateaued at around 20 miles a week. Most of the time, I also get some decent elevation gain, which is bound to happen when you live at the bottom of a giant hill. The weeks with low elevation gain are mostly from different cities that are less hilly than Seattle. I'm hoping to work up to more milage and elevation gain next year.

<div id="weekly-distance" class="max-width-1200"></div>
<div id="weekly-elevation" class="max-width-1200"></div>

Here's to better times and many more miles in 2021.

##### A Few Technical Notes
- All visualizations in this blog post are built with D3 v6 + SVG.
- Visualizations were inspired by [Marcus Wolz's Strava package for R](https://marcusvolz.com/strava/).
- I used [stravalib](https://github.com/hozn/stravalib) to get my Strava data in Python. It was super easy to use.
- I used D3's geo projections to generate SVG paths from the Strava route data and [SVGO](https://github.com/svg/svgo) to optimize the paths.
- [This example](https://observablehq.com/@d3/calendar-view) was a great reference for how to achieve the Github-esque calendar view with D3.