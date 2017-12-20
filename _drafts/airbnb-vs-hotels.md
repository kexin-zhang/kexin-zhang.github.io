---
title: Visualizing Airbnb vs. Hotels in New York City (or a blog post about my class project)
layout: d3post
author: Kexin Zhang
script: /static/js/airbnb-vs-hotels.js
css: /static/css/airbnb-vs-hotels.css
---

I just finished my fifth (!) semester at Georgia Tech. This past semester, I took [CX 4242/CSE 6242 - Data and Visual Analytics](http://poloclub.gatech.edu/cse6242/2017fall/){:target="_blank"}, which is a essentially a survey of techniques for exploring, analyzing, and visualizing data. Our homeworks covered topics like SQL, D3.js, Hadoop, Spark, and some machine learning basics. The class also included an open-ended group project, where we were expected to propose a topic and use a "large" dataset, nontrivial analysis, and interactive visualization to address that topic. My group picked comparing the difference in "value" between Airbnbs and hotels, and we focused on New York City. 

**What exactly do I mean by value?** Airbnb is often depicted as an "industry disrupter", by facilitating peer to peer transactions between people who have a empty bed, room, or apartment, and people who are looking for somewhere to stay. For many travelers, this is an attractive alternative to traditional hotel options. There's also an impression that Airbnbs are cheaper than hotels (spoiler alert: in New York City, this is pretty true), but there's a difference between sleeping in someone's spare twin bed compared to staying in a luxury hotel suite. That brings us back to this idea of value. You can get "value" out of your hotel or Airbnb if you're able to save some money by staying there, if the location is ideal, if the service is amazing, or more -- this is pretty subjective and depends on what you're looking for. We chose to focus on a few aspects of short term stays that we felt were particularly important:
1. Price
2. Location
3. Reviews/satisfaction
4. Amenities 

Those four categories served as our basis for somewhat holistically comparing Airbnb listings and hotels. We used Airbnb data from [Inside Airbnb](http://insideairbnb.com/get-the-data.html){:target="_blank"}, a third party that releases data scraped from Airbnb's site. For hotel data, we crawled [TripAdvisor](https://www.tripadvisor.com/){:target="_blank"} for hotels in New York, and merged this with hotel pricing data collected from [Amadeus](https://sandbox.amadeus.com/api-catalog){:target="_blank"}, a travel IT company with a pricing API.