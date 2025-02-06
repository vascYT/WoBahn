---
layout: ../layouts/MarkdownLayout.astro
title: About
---
# About

"WoBahn", derived from the German phrase "Wo ist meine Bahn?" ("Where is my train?"), is a small project meant to visualize the approximate locations of all metro lines in Vienna.

### How does it work?
As there is no dataset that provides any geolocations for trains in Vienna, we use the real-time monitor data instead. This dataset gives us a departure countdown (in minutes) for any station we want. When you look at all the stations for a line in order, it's fairly easy to see where a train should be. If the countdown suddenly drops from one station to another, you can be sure that a train has to be between those two stations; if the countdown is exactly 0, a train is in the station.

Here is an example for the U4 Heiligenstadt line:
![Console output](https://r2.vasc.dev/images/8GPON.png)

Since the dataset also provides us with geo-coordinates for all the stations, we can easily show the approximate location of each train by either exactly at the coordinates or between two stations.

This method isn't perfect and can sometimes give inaccurate results, especially when there are sudden changes in the intervals or when a stop doesn't return departure times (e.g. when the last train of the day departs from a station).

The data used in this project is sourced from [Stadt Wien](https://data.wien.gv.at/), specifically the [Wiener Linien Echtzeitdaten](https://www.data.gv.at/katalog/dataset/522d3045-0b37-48d0-b868-57c99726b1c4) dataset.

This project is completely open source. You can check it out on [GitHub](https://github.com/vascYT/WoBahn).

Made with 💖 by [vasc](https://vasc.dev)