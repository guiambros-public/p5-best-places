You will develop a single-page application featuring a map of your neighborhood or a neighborhood you would like to visit. You will then add additional functionality to this application, including: map markers to identify popular locations or places you’d like to visit, a search function to easily discover these locations, and a listview to support simple browsing of all locations. You will then research and implement third-party APIs that provide additional information about each of these locations (such as StreetView images, Wikipedia articles, Yelp reviews, etc).


## Requirements

Write code required to add a full-screen map to your page using the Google Maps API.

Write code required to add map markers identifying a number of locations your are interested in within this neighborhood.

Implement the search bar functionality to search and filter your map markers. There should be a filtering function on markers that already show up. Simply providing a search function through a third-party API is not enough.

Implement a list view of the identified locations.

Add additional functionality using third-party APIs when a map marker, search result, or list view entry is clicked (ex. Yelp reviews, Wikipedia, Flickr images, etc). If you need a refresher on making AJAX requests to third-party servers, check out our Intro to AJAX course.


## Searching and Filtering

We expect your application to provide a search/filter option on the existing map markers that are already displayed. If a list of locations already shows up on a map, we expect your application to offer a search function that filters this existing list. The list view and the markers should update accordingly in real-time. Simply providing a search function through a third-party API is not enough to meet specifications.


## What does "errors are handled gracefully" mean?

In case of error (e.g. in a situation where a third party api does not return the expected result) we expect your webpage to do one of the following:

A message shows up to notify the user that the data can't be loaded, OR There are no negative repercussions to the UI.
