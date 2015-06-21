# Udacity Project P5 - Best Places in NYC

This is a single-page application, featuring a map of the 50 best places in NYC. This page allows you to quickly browse through the list of best places, see where it is located, and check tips from Foursquare.

This is a simple proof-of-concept application,  built as part of Project 5 for [Udacity Nanodegrees](https://www.udacity.com/nanodegree) course.


## Site Structure

The site was built using Backbone.js and Twitter's Bootstrap. The structure followed the classic MVVC pattern, with good isolation between the view and the model.

The map is provided by [Google Maps API v3](https://developers.google.com/maps/documentation/javascript), and tips are provided by [Foursquare API](https://developer.foursquare.com/). API keys are needed to run the application.


## Main Functionality

* List of the 50 best places in NY, according to the site complex.com
* Google Maps conveniently shows the location
* You can narrow down the list by searching for a specific place or address
* You can also optionally search on the extended descriptions

![p5-best-places-nyc =800x](https://cloud.githubusercontent.com/assets/11373126/8270345/6a4b59fc-17aa-11e5-8c94-8264846f6540.png)


## UX and Technical details:

* Search happens instantly, by filtering the collection and re-rendering the view with the filtered locations
* The number of locations found is displayed on top of the locations
* When the map InfoWindow is open and you click elsewhere on the map, the infowindow is closed automatically
* The marker is customized with Foursquare's icon (e.g., Park, Bar, Restaurant, Hotel, etc)
* If the location is found on Foursquare, the Google Maps InfoWindow shows the first tip. You can click on next/previous arrows to see more tips (limited to 30)
* If the location is not found on Foursquare, the default Google Maps red marker is used (e.g., try "*Sara Roosevelt Park*")
* The site degrades gracefully. If Foursquare's API is not available, it won't throw an error. If Google Maps is not available, it won't show, but the browse and search functionality can still be used
* When you click on the search input field, there's a subtle shadown effect to show the field is not selected
* Fully responsive. On smaller screens (phone, tablet), the site resizes automatically and eliminates some non-essential parts
* The description is truncated to 12 lines (some places have really long descriptions). The method used truncates the description at the end of a word, and shows an ellipsis. It works, but somewhat buggy and can be improved.


## Source Data

The data abou the 50 places came from [complex.com](http://www.complex.com/pop-culture/2014/07/the-50-coolest-places-in-nyc-right-now/). I created a parser in node.js, to convert from html to a json file. The parser runs automatically through Gulp (see below).


## Build System

I used [Gulp](http://gulpjs.com/) as the build system. Files are minified, images are compressed, debug logs are removed, and final files are moved from the `/src` to the `/dist` directory.

[Bower](http://bower.io/) was also used to install components required by the application, like Bootstrap, Backbone.js and Underscore.js.


## References:

Many sources were used as inspiration or for troubleshooting. The list below has the most relevant references:

### Javascript Design Patterns

- [Mastering the Module Pattern](http://toddmotto.com/mastering-the-module-pattern/)

- [Understanding delete](http://perfectionkills.com/understanding-delete/)

- [We have a problem with promises](http://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html)

- [Using and combining Promises (or, "Avoiding callback-hell")](http://www.nurkiewicz.com/2013/03/promises-and-deferred-objects-in-jquery.html)

- [Create the view in jQuery's DOMReady](http://stackoverflow.com/questions/10371539/why-define-anonymous-function-and-pass-jquery-as-the-argument/10372429#10372429)


### Backbone.js

- [Using data-id to retrieved the clicked element, on situations where you have a single view, with multiple models](https://lostechies.com/derickbailey/2011/10/11/backbone-js-getting-the-model-for-a-clicked-element/)

- [Filtered Collection Decorator pattern, by Derick Bailey](http://spin.atomicobject.com/2013/08/08/filter-backbone-collection/)


### Maps & Markers

- [Inspiration for the shadow markers](http://www.foodspotting.com/find/within/40.74368139882518,-73.99250956170653/40.769687713159634,-73.91182871453856)

- [Creating SVG images in pure CSS/HTML](http://metafizzy.co/blog/making-svg-buttons/)


### CSS Tricks

- Ellipse My Text… - [source 1](https://css-tricks.com/line-clampin/), [source 2](http://html5hub.com/ellipse-my-text/), [source 3](http://jsfiddle.net/nLf0Ltf6/2/)

- [Smooth scrolling on touch devices](https://css-tricks.com/snippets/css/momentum-scrolling-on-ios-overflow-elements/)

- [Search box - adding effects](http://callmenick.com/post/various-css-input-text-styles)

- [A Couple of Use Cases for Calc()](https://css-tricks.com/a-couple-of-use-cases-for-calc/)

- [How to display which media query is being used](http://stackoverflow.com/questions/13730405/how-to-display-which-media-query-is-being-used)

- [Detecting touch screen devices with Javascript](http://stackoverflow.com/questions/3974827/detecting-touch-screen-devices-with-javascript)



