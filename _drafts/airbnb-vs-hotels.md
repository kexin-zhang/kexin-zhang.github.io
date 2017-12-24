---
title: Visualizing Airbnb vs. Hotels in New York City (or a blog post about my class project)
layout: d3post
author: Kexin Zhang
script: /static/js/airbnb-vs-hotels.js
css: /static/css/airbnb-vs-hotels.css
additional: /static/js/distance-limited-voronoi.js
---

I just finished my fifth (!) semester at Georgia Tech. This semester, I took [CX 4242/CSE 6242 - Data and Visual Analytics](http://poloclub.gatech.edu/cse6242/2017fall/){:target="_blank"}, which is a essentially a survey of techniques for exploring, analyzing, and visualizing data. Our homeworks covered topics like SQL, D3, Hadoop, Spark, and some machine learning basics. The class also included an open-ended group project, where we were expected to propose a topic and use a "large" dataset, nontrivial analysis, and interactive visualization to address that topic. My group decided to compare the difference in "value" between Airbnbs and hotels, and we focused on New York City. 

**What exactly do I mean by value?** Airbnb is often depicted as an "industry disrupter", by facilitating transactions between people who have a empty bed, room, or apartment, and people who are looking for somewhere to stay. For many travelers, this is an attractive alternative to traditional hotel options. There's an impression that Airbnbs are cheaper than hotels (spoiler alert: in New York City, this is pretty true), but there's a difference between sleeping in someone's spare twin bed compared to staying in a luxury hotel suite. That brings us back to this idea of value. You can get "value" out of your hotel or Airbnb if you're able to save some money by staying there, if the location is ideal, if the service is amazing, or more -- this is pretty subjective and depends on what you're looking for. We chose to focus on a few aspects of short term stays that we felt were particularly important:
1. Price
2. Location
3. Reviews/satisfaction
4. Amenities 

Those four categories served as our basis for somewhat holistically comparing Airbnb listings and hotels. We used the October 2017 Airbnb data for New York City from [Inside Airbnb](http://insideairbnb.com/get-the-data.html){:target="_blank"}, a third party that releases data scraped from Airbnb's site. For hotel data, we crawled [TripAdvisor](https://www.tripadvisor.com/){:target="_blank"} for hotels in New York, and merged this with pricing data collected from [Amadeus](https://sandbox.amadeus.com/api-catalog){:target="_blank"}, a travel IT company with a booking/pricing API. These datasets consisted of about 44,000 Airbnb listings and 265 hotels. The Amadeus API provided prices for each type of room offered within a hotel, so after collecting data on prices across multiple dates (11/16, 11/26, 12/06, 12/16, and 12/26), we ended up with roughly 20,000 points of data on hotel room prices.

#### Location and Price

Average price across the Airbnb listings is **$147.67** per night, compared to an average of **$443.17** per night for hotel rooms. Note that some of the dates we used for collecting hotel prices are around Thanksgiving and Christmas, which are likely correlated with higher hotel prices. Nonetheless, ~$300 is a pretty sizable difference.

Location and price by location varies for Airbnbs and hotels. For Airbnbs, I used a latitude longitude grid to reduce the number of points to plot. The Airbnb plot below shows mean price in each Airbnb grid, while the hotel plot displays average room price per hotel. It should be noted that the color scales are different for both plots.

{% include airbnb-hotel-maps.html %}

It's obvious that hotels are much more sparse (and expensive) than Airbnbs. Because Airbnb listings are usually just homes that aren't subject to the same zoning laws as hotels, it makes a lot of sense that Airbnbs cover a larger geographic area than hotels. Additionally, it's a little difficult to compare the geography of Airbnbs to that of hotels since Airbnbs are usually rooms, while hotels are buildings with lots of rooms. Despite that, even though Airbnb listings cover a large portion of the city, past work suggests that [demand is only routinely high for Airbnb listings in touristic areas near the city center](https://arxiv.org/pdf/1602.02238.pdf){:target="_blank"}. This is also where hotels are typically located. In this case, for New York, Manhattan (1) is a popular tourist destination, (2) has a high cost of living, (3) has the highest density of Airbnbs and hotels, and (4) is home to the most expensive Airbnbs and hotels. In general, expensive hotels are located around the same areas as expensive Airbnbs (around Central Park and in lower Manhattan), but there are also some less expensive hotels in these areas with expensive Airbnbs. 

#### Amenities and Reviews
Airbnbs, on average, are cheaper than hotels in New York City. While both provide people with a place to stay overnight, they are very different experiences.

{% include airbnb-hotel-bargraph.html %}

Hotels definitely offer more luxurious services and facilities, such as laundry service, gyms, and free breakfast, while many popular Airbnb amenities are simply standard items in hotel rooms, like smoke detectors, shampoo, TV, and hangers. One notable exception is a kitchen, which is a common amenity for Airbnbs, but something that almost all hotel rooms lack. It could have been interesting here to experiment with factoring in the amenties when comparing price -- when accounting for the cost of breakfast, dry cleaning, gym access, etc., which are free at hotels but not at Airbnbs, what is the difference in price between staying at an Airbnb and staying at a hotel?

I also want to acknowledge some things that amenities *don't* convey. Airbnbs facilitate social interactions with the host, which isn't an amenity. But, this is an important feature of staying in an Airbnb -- [Airbnb is more attractive to foreign travelers because of this "cultural experience"](https://www.researchgate.net/profile/David_Neeser/publication/282151529_Does_Airbnb_Hurt_Hotel_Business_Evidence_from_the_Nordic_Countries/links/5605310e08aea25fce322679.pdf){:target="_blank"}, and [Airbnb hosts are often motivated by social, as well as financial, reasons to post listings](https://www.researchgate.net/profile/Airi_Lampinen/publication/275522360_Monetizing_Network_Hospitality_Hospitality_and_Sociability_in_the_Context_of_Airbnb/links/553e959b0cf210c0bdaaa951/Monetizing-Network-Hospitality-Hospitality-and-Sociability-in-the-Context-of-Airbnb.pdf){:target="_blank"}. On the other hand, hotel staff usually provide more structured, formal service, like concierge and maid service. To account for some of these more subjective qualities and differences, a group member of mine did some cool NLP work with the reviews. At a high level, we extracted sentiment about some core topics -- location, hospitality, and room quality. For example, if a user wrote a review complaining about his Airbnb host but raving about the Airbnb's proximity to tourist attractions, then this review would be assigned a positive score for location and a negative one for hospitality. This allowed us to quantify some of the subjective qualities of staying in an Airbnb or hotel and make up for details not conveyed by the amenities. It should be noted here that [reviews for Airbnbs are overwhelmingly positive](http://www-bcf.usc.edu/~proserpi/papers/airbnbreputation.pdf){:target="_blank"} (over 95% of properties have over 4.5 stars), and Airbnbs are much more positively rated than hotels or even cross-listed properties. We hoped that by focusing on the actual text of the review, not the star rating, we'd be able to extract some of the nuances left out by the overall rating.

#### Location ... Revisited

Looking at *all* of the Airbnbs or hotels New York City isn't particularly helpful for people actually looking for somewhere to stay. We wanted more detailed comparisons, but **which Airbnbs do we compare to which hotels?**

After experimenting with several ideas, we settled on an approach using K-Means. We ran K-Means to cluster hotel locations and then assigned each Airbnb to its nearest neighbor cluster centroid. We chose to find clusters of hotels since hotels are much more geographically sparse than Airbnbs. After some trial and error in an attempt to find both meaningful and visually appealing clusters, we ended up with 130 clusters. Overall, this approach makes sense, as we're effectively grouping Airbnb listings with their closest hotel competitors.

We displayed these clusters through a voronoi diagram; the clusters and their centers are shown below. We limited the size of the cells to a radius of 1km, so Airbnbs further than 1km away from a cluster center (36% of our listings) were not included. 

{% include airbnb-hotel-voronoi.html %}

We put all of this together into [an interactive web application](http://airbnb-vs-hotels.mgejdapexj.us-east-1.elasticbeanstalk.com/){:target="_blank"} built with a very simple Flask backend, and a Leaflet and D3 frontend. The voronoi diagram became a choropleth voronoi map, with price difference between hotels and Airbnbs as the scale. If you click on a cell, additional visualizations pop up on the side panel! *See screenshot below.*

![alt text](https://raw.githubusercontent.com/kexin-zhang/kexin-zhang.github.io/master/static/img/screenshot7.PNG "Screenshot of Project")

We can see from this snippet of the choropleth map that price differences are not at all uniform. In the earlier pricing maps, the area around Central Park had a lot of expensive Airbnbs and hotels, but the price difference in these areas is also huge. Alternatively, there are also a few areas within New York where hotels are actually cheaper on average than Airbnbs. If price is important, there are definitely areas where price differences are very large, and booking an Airbnb is more of a "deal". 

**What can we take away from this?** We can't definitively say that either hotels or Airbnb is the better option, since value is subjective and entirely dependent on personal preferences. However, in general, Airbnb listings are almost always cheaper and more highly rated in all three categories that we examined for reviews (location, hospitality, and room quality). That's at the expense of giving up services popular among hotels, like room service, laundry, free breakfast, and gym access.

I went into this project wanting to do some really cool analysis and produce really cool results. I learned that that's *hard*. We spent a ton of time doing exploratory analysis to come up with interesting ideas for what to do, and ultimately, the results we got out of it weren't revolutionary. But, I did learn a lot and had a lot of fun writing our TripAdvisor scraper and building our visualizations. That counts for something, right?

Want to know more about our project and this post?
* We tried to organize/document our code on [Github](https://github.com/kexin-zhang/airbnb-vs-hotels){:target="_blank"}.
* [We had to do poster presentations.](https://github.com/kexin-zhang/airbnb-vs-hotels/blob/master/presentation_materials/Poster.pdf){:target="_blank"}
* Our project was *very briefly* [mentioned by the Georgia Tech College of Computing](https://www.cc.gatech.edu/news/599582/airbnb-cryptocurrency-data-and-visual-analytics-course-probes-apps-and-utilities-we-love){:target="_blank"}!
* Our interactive web application features an SVG overlay (thanks to D3) on top of a Leaflet map. I found [this tutorial](https://bost.ocks.org/mike/leaflet/){:target="_blank"} really helpful for getting started.
* Additional figures that I made for this blog post were created with [D3 v4](https://d3js.org/){:target="_blank"} and [d3-distanceLimitedVoronoi](https://github.com/Kcnarf/d3-distanceLimitedVoronoi){:target="_blank"}.