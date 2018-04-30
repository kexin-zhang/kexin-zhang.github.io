---
title: Site Redesign
layout: post
author: Kexin Zhang
---

This week is Georgia Tech's finals week, and I had an urge to redesign my personal website. I'm a fan of procrastinating by putting off important, urgent tasks to do mildly productive, not important things. Which is why I'm simultaneously rewriting my site's CSS and this blog post while (barely) skimming lecture notes for my final tomorrow. *This is fine.*

I've been wanting to move this site into a more minamalist, black/white kind of direction. Before, I had this purple gradient background on the first page, and I was starting to not like it. (Side note: if you like artsy gradients, I really like looking at this [website](https://uigradients.com){:target="blank"}). Unfortunately, I also know basically nothing about design, so this website's "redesign" is very very basic. 

This site is built with [Jekyll](https://jekyllrb.com/){:target="blank"}, a static site generator. It's a pretty straightforward and cool way to blog/generate content without building your own CRM. With Jekyll, you write your blog posts or any other custom content in markdown files, and Jekyll generates HTML from 1) your markdown content and 2) Liquid templates. This has worked pretty well for this blog, since liquid syntax is pretty extensive and supports all of my use cases for templated pages. In addition, you can write HTML in markdown, which has been very useful for my data vis blog posts, since I can include any custom divs necessary in the blog post markdown file itself.

Jekyll has some built-in themes that you can choose from, or you can create your own custom pages -- which is what I've opted to do. For this new version of the site, I'm basically redoing all of the page layouts with [SkeletonCSS](http://getskeleton.com/){:target="blank"}, a lightweight CSS framework as well as some custom styling written by yours truly. Here are some super simple design choices I made:
* Font: [Open Sans](https://fonts.google.com/specimen/Open+Sans){:target="blank"}
* Font color: #2d3436
* Link color: <span style="color:#16A085">#16A085</span>
* Link hover color: <span style="color: #2ABB9B">#2ABB9B</span>