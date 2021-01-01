---
title: Converting Google Maps Routes to GeoJSON with Python (and plotting the result with D3)
layout: legacyd3post
author: Kexin Zhang
script: /static/js/gmaps2geojson.js
css: /static/css/gmaps2geojson.css
---

*TLDR: I wrote 40 lines of code for getting GeoJSON from Google Maps directions and wrote this blog post to hype myself up. See the [Github repo](https://github.com/kexin-zhang/gmaps2geojson) for setup/usage instructions.*

I was recently inspired by this [blog post](https://chriswhong.com/data-visualization/taxitechblog1/) on the technical details behind [NYC Taxis: A Day in the Life](http://chriswhong.github.io/nyctaxi/). Part of the post details how Chris Whong used Google Maps to fetch route coordinates, so I wrote this super simple Python utility for converting routes to GeoJSON. Since GeoJSON is often used for mapping with JavaScript, I thought it'd be helpful to have some code for generating GeoJSON files -- which I've called **gmaps2geojson**.

#### Usage Example
Over spring break, I did a road trip: Atlanta -> New Orleans -> Baton Rouge -> Houston -> College Station -> Austin. New Orleans, Houston, and Austin were the main destinations, and Baton Route and College Station were pit stops along the way.

Our route looked something like this:

<div id="map"></div>

The Python code I wrote is a class called `Writer` with two methods: `query` (for searching for a route given a source and destination) and `save` (for writing the queried routes to GeoJSON format). So, I was able to easily create a GeoJSON file with the driving route coordinates from the spring break roadtrip:
```
import gmaps2geojson

writer = gmaps2geojson.Writer()
writer.query("33.7490, -84.3880", "29.9511, -90.0715") # Atlanta to New Orleans
writer.query("29.9511, -90.0715", "30.4515, -91.1871") # New Orleans to Baton Rouge
writer.query("30.4515, -91.1871", "29.7604, -95.3698") # Baton Rouge to Houston
writer.query("29.7604, -95.3698", "30.6280, -96.3344") # Houston to College Station
writer.query("30.6280, -96.3344", "30.2672, -97.7431") # College Station to Austin
writer.save("roadtrip.geojson")
```

This outputs a file `roadtrip.geojson`, which I can load and plot with D3! The code snippet for plotting the route looks something like this, provided that the base US map has already been plotted:

```
d3.json("roadtrip.geojson", function(error, data) {
  if (error) throw error;

  var features = data.features;

  var route = g.selectAll(".routes")
               .data(features)
               .enter()
               .append("path")
               .attr("class", "routes")
               .attr("d", path);
});
```

See the [full source code](https://github.com/kexin-zhang/kexin-zhang.github.io/blob/master/static/js/gmaps2geojson.js) for defining the map projection and path as well as plotting the base US map.

#### How it works
*EDIT (Aug. 10, 2018) - Google Maps updated their usage and billing policy on July 11, 2018. This section has been edited to reflect those updates.*

[gmaps2geojson](https://github.com/kexin-zhang/gmaps2geojson/blob/master/gmaps2geojson/writer.py) starts by making a call to the Google Directions API. For this, you'll need a Google Directions API key, which you can get [here](https://developers.google.com/maps/documentation/directions/start). The API can be queried with this URL:
```
https://maps.googleapis.com/maps/api/directions/json?origin="<source>"&destination="<dest>"&key=<API KEY>
```

For example, a GET request to
```
https://maps.googleapis.com/maps/api/directions/json?origin="2131 7th Ave, Seattle, WA 98121"&destination="900 Poplar Pl S, Seattle, WA 98144&key=<API KEY>"
```
returns the following response JSON:

```
{  
   'geocoded_waypoints':[  
      {  
         'geocoder_status':'OK',
         'place_id':'ChIJlU410EsVkFQR5S8R77FnTcM',
         'types':[  
            'street_address'
         ]
      },
      {  
         'geocoder_status':'OK',
         'place_id':'ChIJd_ETfJRqkFQRoh0sLJwIs8k',
         'types':[  
            'premise'
         ]
      }
   ],
   'routes':[  
      {  
         'bounds':{  
            'northeast':{  
               'lat':47.6185383,
               'lng':-122.3111082
            },
            'southwest':{  
               'lat':47.5932551,
               'lng':-122.340057
            }
         },
         'copyrights':'Map data ©2018 Google',
         'legs':[  
            {  
               'distance':{  
                  'text':'2.9 mi',
                  'value':4612
               },
               'duration':{  
                  'text':'11 mins',
                  'value':669
               },
               'end_address':'900 Poplar Pl S, Seattle, WA 98144, USA',
               'end_location':{  
                  'lat':47.5932551,
                  'lng':-122.3111082
               },
               'start_address':'2131 7th Ave, Seattle, WA 98121, USA',
               'start_location':{  
                  'lat':47.6165042,
                  'lng':-122.3399036
               },
               'steps':[  
                  {  
                     'distance':{  
                        'text':'49 ft',
                        'value':15
                     },
                     'duration':{  
                        'text':'1 min',
                        'value':5
                     },
                     'end_location':{  
                        'lat':47.6165929,
                        'lng':-122.340057
                     },
                     'html_instructions':'Head <b>northwest</b> on <b>7th Ave</b> toward <b>Blanchard St</b>',
                     'polyline':{  
                        'points':'cbsaHjouiVQ^'
                     },
                     'start_location':{  
                        'lat':47.6165042,
                        'lng':-122.3399036
                     },
                     'travel_mode':'DRIVING'
                  },
                  // ... more steps here
               ],
               'traffic_speed_entry':[  

               ],
               'via_waypoint':[  

               ]
            }
         ],
         'overview_polyline':{  
            'points':'cbsaHjouiVQ^eAoA_B_Ca@u@W]Mq@_BPw@D@eL?eG?eGBgG?gEl@wA|BsEd@iALUPO\\Qf@KP@`BTbARt@JLGTDhD`A~@Zl@RtF`BfCr@dFzAd@JvARvA@lACnAGhAOfAa@`CmA`BcA|FiExEkDfCqBnDqC|@{@pAuAbAqAxB{C~FeI~B{CjBsBb@]`BiAdAi@f@Of@SNDd@?jDBtDBH??m@@}J?OAwP@iO@cEHGxE_Dj@[z@]l@QZU`Ao@d@['
         },
         'summary':'I-5 S',
         'warnings':[  

         ],
         'waypoint_order':[  

         ]
      }
   ],
   'status':'OK'
}
```

The important part of the response is the **overview_polyline** field, which is Google's compressed representation of the route. This polyline can be decoded into lat-lon coordinates using Python's [polyline package](https://pypi.org/project/polyline/). For specifics behind decoding polyline, check out the [Mapbox implementation](https://github.com/mapbox/polyline).

With the decoded lat-lon coordinates, we can format the paths as MultiLineString features to comply with the [GeoJSON specs](https://tools.ietf.org/html/rfc7946). The biggest thing here is that the decoded coordinates are in the form of (lat, lon), but for GeoJSON, the coordinates need to be formatted as (lon, lat), so we have to switch the ordering of the points.

Finally, the formatted GeoJSON looks like this:
```
"type":"FeatureCollection",
"features":[  
   {  
      "type":"Feature",
      "properties":{  
         "name":"2131 7th Ave, Seattle, WA 98121 to 900 Poplar Pl S, Seattle, WA 98144"
      },
      "geometry":{  
         "type":"MultiLineString",
         "coordinates":[  
            [  
               [  
                  -122.3399,
                  47.6165
               ],
               [  
                  -122.34006,
                  47.61659
               ],
               // ... more coordinates here
            ]
         ]
      }
   }
]
}
```

#### Other:
* If you want lots of details about GeoJSON, there's a really good [blog post](https://macwright.org/2015/03/23/geojson-second-bite.html).
* The example map in this post was created with D3 v4. This [page](http://duspviz.mit.edu/d3-workshop/mapping-data-with-d3/) has a good overview of mapping with D3.
