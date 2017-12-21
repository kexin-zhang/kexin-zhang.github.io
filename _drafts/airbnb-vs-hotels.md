---
title: Visualizing Airbnb vs. Hotels in New York City (or a blog post about my class project)
layout: d3post
author: Kexin Zhang
script: /static/js/airbnb-vs-hotels.js
css: /static/css/airbnb-vs-hotels.css
---

I just finished my fifth (!) semester at Georgia Tech. This semester, I took [CX 4242/CSE 6242 - Data and Visual Analytics](http://poloclub.gatech.edu/cse6242/2017fall/){:target="_blank"}, which is a essentially a survey of techniques for exploring, analyzing, and visualizing data. Our homeworks covered topics like SQL, D3, Hadoop, Spark, and some machine learning basics. The class also included an open-ended group project, where we were expected to propose a topic and use a "large" dataset, nontrivial analysis, and interactive visualization to address that topic. My group picked comparing the difference in "value" between Airbnbs and hotels, and we focused on New York City. 

**What exactly do I mean by value?** Airbnb is often depicted as an "industry disrupter", by facilitating transactions between people who have a empty bed, room, or apartment, and people who are looking for somewhere to stay. For many travelers, this is an attractive alternative to traditional hotel options. There's also an impression that Airbnbs are cheaper than hotels (spoiler alert: in New York City, this is pretty true), but there's a difference between sleeping in someone's spare twin bed compared to staying in a luxury hotel suite. That brings us back to this idea of value. You can get "value" out of your hotel or Airbnb if you're able to save some money by staying there, if the location is ideal, if the service is amazing, or more -- this is pretty subjective and depends on what you're looking for. We chose to focus on a few aspects of short term stays that we felt were particularly important:
1. Price
2. Location
3. Reviews/satisfaction
4. Amenities 

Those four categories served as our basis for somewhat holistically comparing Airbnb listings and hotels. We used the October 2017 Airbnb data for New York City from [Inside Airbnb](http://insideairbnb.com/get-the-data.html){:target="_blank"}, a third party that releases data scraped from Airbnb's site. For hotel data, we crawled [TripAdvisor](https://www.tripadvisor.com/){:target="_blank"} for hotels in New York, and merged this with pricing data collected from [Amadeus](https://sandbox.amadeus.com/api-catalog){:target="_blank"}, a travel IT company with a pricing API. These datasets consisted of roughly 44,000 Airbnb listings and 265 hotels. The Amadeus API provided prices for each type of room offered within a hotel, so after collecting data on prices across multiple dates (11/16, 11/26, 12/06, 12/16, and 12/26), we ended up with roughly 20,000 points of data on hotel room prices.

Average price across the Airbnb listings is **$147.67** per night, compared to an average of **$443.17** per night for hotel rooms. Note that some of the dates we used for collecting hotel prices are around Thanksgiving and Christmas, which may be correlated with higher hotel prices. Regardless, ~$300 is a pretty sizable difference.

Location and price by location varies for Airbnbs and hotels. For Airbnbs, I am literally plotting all 440,000 points just to illustrate the sheer number and density of Airbnbs available. In an ideal scenario, I'd do some more preprocessing to cut down the number of points plotted, since this is pretty slow.

{% include airbnb-hotel-maps.html %}

{% include airbnb-hotel-bargraph.html %}

Looking at the city as a whole isn't particularly helpful for people actually looking for somewhere to stay when visiting New York City. We wanted more detailed comparisons, but **which Airbnbs do we compare to which hotels?**

We put all of this together into [an interactive web application](http://airbnb-vs-hotels.mgejdapexj.us-east-1.elasticbeanstalk.com/){:target="_blank"} built with a very simple Flask backend, and a Leaflet and D3 frontend. If you click on a cell, visualizations pop up on the side panel!

Want to know more about our project?
* We tried to organize/document our code on [Github](https://github.com/kexin-zhang/airbnb-vs-hotels){:target="_blank"}.
* [We had to do poster presentations.](https://github.com/kexin-zhang/airbnb-vs-hotels/blob/master/presentation_materials/Poster.pdf){:target="_blank"}
* Our project was *very briefly* [mentioned by the Georgia Tech College of Computing](https://www.cc.gatech.edu/news/599582/airbnb-cryptocurrency-data-and-visual-analytics-course-probes-apps-and-utilities-we-love){:target="_blank"}!