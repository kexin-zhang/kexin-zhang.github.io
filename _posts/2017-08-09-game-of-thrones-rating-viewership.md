---
title: Game of Thrones Visualized - Viewership, Ratings, and Deaths
layout: d3post
author: Kexin Zhang
script: /static/js/got.js
css: /static/css/got.css
---

_**This post contains Game of Thrones spoilers up to and including Season 7 Episode 4.** All graphs included were created with D3.js!_

I'm a huge Game of Thrones fan. I've read all the books and watched all episodes of the TV show. The episode that aired last Sunday, "The Spoils of War", was the most watched episode of Game of Thrones ever, even though the episode was leaked a few days before it aired. It's also one of the highest rated episodes of the series, with a user IMDB rating of 9.9. That sparked my interest in the ratings and number of viewers of the seven seasons of Game of Thrones.

{% include got-ratings.html %}

*Viewership is the number of US viewers in millions from [Nielsen Media (as displayed on Wikipedia)](https://en.wikipedia.org/wiki/List_of_Game_of_Thrones_episodes){:target="_blank"}. Ratings are average user ratings on [IMDB](http://www.imdb.com/title/tt0944947/eprate){:target="_blank"}* 

We can see here that viewership increases steadily during seasons one through four. Seasons five and six do show a general increase in the number of viewers, but they also show quite a bit of inconsistency, in terms of both viewership and ratings. This makes a lot of sense, as these seasons surpassed the books' storylines and the episodes are the first ones where the creators really have to craft parts of the story on their own. Season 5 in particular really suffered from the Dorne storyline, which many viewers found unappealing and boring. It also has probably the most highly criticized episode, S5E6 - Unbowed, Unbent, Unbroken. It seems like criticism of the episode was shared by many viewers, as we can see the episode right after Unbowed, Unbent, Unbroken takes a hit in terms of viewership.

Additionally, I initially expected for season premieres and finales to be the most viewed episodes. While that is the case for the more inconsistent seasons (seasons five and six), that doesn't hold true for the first four seasons, where there are some peaks in viewership in the middle of each season, such as episodes five and six in season three as well as episodes seven and eight in season four.

There are also a few interesting takeaways from the more detailed ratings graph. First, season four clearly outperforms the other seasons, with all but three episodes rated above average. As a reminder, season four included Joffrey's death, Tywin's death, an amazing trial involving Oberyn Martell and the Mountain, and Littlefinger's plot in the Vale. There was some fantastic storytelling here, and the ratings reflect that. Another cool element here is how episode nine is often the most highly rated of the season, especially in the first couple seasons. Game of Thrones often has really dramatic, suspenseful penultimate episodes (Ned Stark's death, Battle of the Blackwater, the Red Wedding, Battle of the Bastards), while the season finales have less shock value, but do a good job of wrapping up certain storylines and introducing others.

One of the distinctive qualities of the show is how ruthless it can be - important characters get killed, often in brutal ways. How often do characters die and do those deaths correlate to higher ratings?

{% include got-deaths.html %}

*Deaths were counted from this [Game of Thrones Deaths Timeline](https://deathtimeline.com/){:target="_blank"}.*

First, there are some considerations to keep in mind here. I had a hard time finding data for season seven, which is not done airing yet, so I've excluded season seven from any graphs with death counts. Also, it's actually quite difficult to quantify these deaths. For examples, in major battle episodes, such as Battle of the Bastards, Blackwater, and especially The Spoils of War, obviously tons of people die. But most of them are soldiers who aren't central to the plot, and their deaths aren't really explicitly shown. The source I used counts deaths that are clearly mentioned or shown. Even though the major battles have the most overall implied deaths, it's hard to keep track of that with so much happening onscreen, and that is evident in the death count.

From the bar graph of deaths per episode, we can see that each season has a few episodes that are particularly bloody - such as the Red Wedding in season three, Dany burning all the khals alive in season six, and the battle between the Night's Watch and the wildlings in season four. Additionally, season six episodes signficantly increased the amount of deaths, with three episodes surpassing ten deaths.

To me, the episodes with the most deaths aren't necessarily the most brutal episodes of the series. The death counts don't properly account for the implied deaths in battles, and the counts don't convey the importance of certain characters. For example, The Pointy End has the most deaths of all season one episodes, since this episode included all of Ned's guards being killed. However, most people would say that the episode right after, with Ned's execution, is the most impactful, horrifying episode of the season. 

Furthermore, maybe the deaths of minor characters don't mean as much to me because of the sheer number of deaths in Game of Thrones. There are only four episodes in the entire series where no one died. It's expected that there will be casualties of some sort during a Game of Thrones episode, which reduces the impact of deaths of minor characters. This is especially true when plotting episodes based on ratings and deaths. Sure, there's some very loose correlation between ratings and deaths, but there are also outlier episodes that have a rather high death count but not a high rating. Many of these are from season six, which we've already identified as an inconsistent season. Deaths set against below average storytelling clearly do not lead to high user ratings. 

Let's wrap this all up by looking at average episode viewership, user rating, and death count on an aggregate level.

{% include got-combined.html %}

This chart confirms some of the earlier observations. Notably, viewership grows steadily from seasons one to four and then is more stagnant for seasons five and six. Season five's relatively low average rating and inconsistency between episodes likely contributed to this. It should also be noted that the potential audience for the show is finite and it's impossible for the number of Game of Thrones viewers to continuously grow at the same rate. That being said, it's impressive that the show's audience has yet to peak.

It's also very clear here that there was a fairly significant increase in the average deaths per episode in season 6. This increase was not obvious to me when watching the show, though -- deaths in the show always seemed like Game of Thrones being Game of Thrones.

Finally, let's look at how consistent the average season ratings are here. Even though I've criticized Season 5 quite a bit, its average rating, the lowest of all seasons, is 8.85 -- 8.85 out of 10 is not bad at all. Even at its worst, Game of Thrones is great television.
