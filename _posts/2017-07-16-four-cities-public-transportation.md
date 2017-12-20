---
title: Visualizing Public Transportation in Four Cities I Visited
layout: d3post
author: Kexin Zhang
script: /static/js/publictransport.js
css: /static/css/publictransportation.css
---
*All graphs and maps in this post were created with D3.js!*

This year, I visited and took public transportation in four cities: Atlanta, Boston, New York City, and San Francisco. I've spent most of my life living in or around Atlanta, where most people consider a car necessary for getting around the city. I love the idea of being able to rely on subway and bus systems instead, so my first blog post is dedicated to visualizing the public transportation systems I've experienced as well as the cities and people those systems support.

To give this post some context, let's first take a look at the cities themselves. **What areas are served by these four public transportation systems?** How large are those areas, in terms of both geography and population? All four areas are major cities that are contained within a surrounding metropolitan area, but they range in size, population, and density.

| City          | Surrounding Metropolitan Area       | Subway system     |
|---------------|:-----------------------------------:|:-----------------:| 
|Atlanta        |Atlanta-Sandy Springs-Roswell        |MARTA              |
|Boston         |Boston-Cambridge-Newton              |MTA (the T)        |
|New York City  |New York-Newark-Jersey City          |NYC Subway (MTA)   |
|San Francisco  |San Francisco-Oakland-Hayward        |BART               |

Although public transit systems are generally concentrated within the city's center, most also extend outside of city boundaries. Boston's subway system has stops in Cambridge, Somerville, Brookline, and Medford, while the BART provides transportation throughout the Bay Area, not just within San Francisco's boundaries. We can consider public transportation systems in the context of the city as well as the metropolitan area.

{% include population.html %}

*Source: US Census 2015 American Community Survey. I used [Census Reporter](https://censusreporter.org/){:target="_blank"} to obtain these figures.*

From here, we can group the cities into a few categories.
1. New York city has a large population and land area. Population density is extremely high.
2. Atlanta has a much smaller population sprawled across a large area. Metro Atlanta encompasses 29 counties and is almost as large (in terms of land area) as the New York-Newark-Jersey City metropolitan area. It's also worth noting that while Metro Atlanta has the second largest population here, the City of Atlanta has the smallest population of all four cities. 
3. Boston and San Francisco have populations slightly smaller than Atlanta's, but those populations reside in a much smaller city -- which means higher population density. 

Planning public transporation in a large, sprawling city such as Atlanta inevitably comes with more challenges than tranportation in a smaller, denser city, such as Boston. 

**What do the subway systems in these cities actually look like?** I've plotted subway lines and stations in each city. In Boston, I also included the silver line, which is technically a bus, but the MBTA includes the silver line in its rail maps. Also, note that each map is at a different scale, so that we can more clearly see the details of the subway systems. 

{% include maps.html %}

The obvious takeaway here is how extensive the New York City subway system is. Boston's MBTA is also comparatively expansive within the city of Boston and its surrounding neighborhoods. This is likely facillitated by Boston's small land area and New York's high population density. It should also be noted that public transportation systems were established much earlier in these cities. The first subway lines opened in 1897 in Boston and in 1904 in New York, compared to 1972 for San Francisco and 1979 for Atlanta. Both the BART and MARTA have much fewer stops, and there are lines in only a few directions. However, while the BART goes through much of the Bay Area, MARTA barely covers three counties and isn't in most metropolitan Atlanta counties.

What about the people in these cities? **How do the residents in each city travel?** How many drive cars? How many of them rely on public transportation? A couple of notes here: data for annual ridership is for heavy rail systems. This does not include buses or light rail systems, such as Boston's green line. Additionally, the means of transportation data is for the city, not the metropolitan area, and it only takes into account how workers, ages 16 and over, commute to work. Thus, the graph does not reflect how people travel for leisure. For example, I usually take the T during the week to work, but I typically walk to places on weekends. Nonetheless, the methods that people use to commute to work provides a good overall look into what systems of transportation residents depend on.

{% include people.html %}

*Source (top): The [American Public Transportation Association](http://www.apta.com/resources/statistics/Pages/ridershipreport.aspx){:target="_blank"}'s annual ridership report .Source (bottom): 2015 US Census American Community Survey, obtained with [Census Reporter](https://censusreporter.org/){:target="_blank"}.*

It's clear that the annual ridership of the New York City subway is huge, but there are a few points to keep in mind here. New York's population is larger than Boston, San Francisco, and Atlanta's combined. New York is also an extremely popular tourist destination, and tourists likely account for a portion of the subway traffic. Despite these caveats, the New York City subway is clearly a high traffic system that the majority of residents depend on, which is not the case for the other major cities shown. MARTA ridership is the lowest of all four cities, which makes sense given how spread out the Atlanta population is and how limited in geographic scope the MARTA rail lines are. 

When looking at how the residents of each city commute to work, the percentage of New York residents that use public transit is significantly higher than the other cities. Atlanta, on the other hand, has an extremely high percentage of workers that drive, while fairly equal portions of the populations in San Fransico and Boston drive and take public transit. It's interesting that both Boston and San Francisco have around 35% of workers taking public transportation, even though the BART has fewer stops and lines than Boston's T.

It's hard to pinpoint what contributes to expansive public transportation infrastructure or high ridership, but looking at New York City would be a good place to start. It's fairly clear that population density and city size play roles in facillitating successful public transport systems. There are many additional aspects, such as city budget, public perceptions of the subway, and socioeconomic status of the area, that were not covered in this post, but likely affect both public transportation expansion and ridership. There are a lot of nuances to consider here, but hopefully this post gives a good look into the basics behind these four cities and their transportation systems.

Interested in how the graphs in this post were built? I used [D3 v4](https://d3js.org/){:target="_blank"} for maps and graphs, as well as [D3-tip](http://labratrevenge.com/d3-tip/){:target="_blank"} for the tooltips. Here are some helpful code snippets: 
- [Horizontal stacked bar chart](https://bl.ocks.org/caravinden/32a3d192e0e5f6af81f4bcc12adda8f7){:target="_blank"}
- [Grouped bar chart](https://bl.ocks.org/mbostock/3887051){:target="_blank"}
- [Bubble chart](https://bl.ocks.org/mbostock/4063269){:target="_blank"}
- [Donut chart](https://bl.ocks.org/mbhall88/b2504f8f3e384de4ff2b9dfa60f325e2){:target="_blank"}