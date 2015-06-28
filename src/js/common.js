/*
  -----------------------------------
    Map class
  -----------------------------------
*/
var Map = (function () {
    'use strict';

    // define map properties: config, map, icon_marker, icon_shadow
    var config = {
        center_radius: "40.7590615,-73.969231", // Manhattan
        radius: '50',
        style: [ { "stylers": [
                 { "saturation": -32 },
                 { "hue": "#0099ff" }
            ]}],
        options: { zoom: 15,
                   disableDefaultUI: true,
                   maxZoom: 18,
                   minZoom: 11,
                   center: {}
        },
        max_tips: 30
    };

    var map = {},
        service = {},
        infownd = {},
        marker = {},
        marker_shadow = {},
        center_radius_obj = {},
        venue_location = {},
        self = {};

    var icon_marker = {
        anchor: new google.maps.Point(16, 42),
        scaledSize: new google.maps.Size(32, 32),
        url: ""
    };

    var icon_shadow = {
        url: "/assets/images/map-shadow.png",
        scaledSize: new google.maps.Size(38, 45)
    };


    /*  Map initialization

        Creates the map, applies the styling defined above, and add click events
     */
    var initialize = function ( el ) {
        self = this;

        // create map centered on `center_radius`
        var loc = config.center_radius.split( "," ).map( Number );  // convert to array of numbers
        center_radius_obj = new google.maps.LatLng( loc[0], loc[1] );
        config.options.center = center_radius_obj;
        map = new google.maps.Map( document.getElementById( el ), config.options );
        map.setOptions( { styles: config.style } );

        // create shell objects - service, markers, shadow, infownd
        service = new google.maps.places.PlacesService( map );
        marker  = new google.maps.Marker({});
        marker_shadow  = new google.maps.Marker({});
        infownd = new google.maps.InfoWindow();

        // close infowindow when you click anywhere on the map, for better usability
        google.maps.event.addListener(map, "click", function() {
            infownd.close()
        });
    };


    /*  Map search

        Search for a specific location, on a radius of config.radius miles around
        Manhattan, in NY state only. This function returns a promise.
     */
    var search = function ( name, item ) {
        var request = {
            location: center_radius_obj,
            radius: config.radius,
            query: name + ", " + item.address + ", NY"
        };
        var deferred = new $.Deferred();

        service.textSearch( request, function ( results, status ) {
            if ( status == google.maps.places.PlacesServiceStatus.OK ) {
                deferred.resolve( results[0] );
            }
            else {
                console.warn( "ERROR searching Google Maps Service: " + status );
                deferred.reject();
            };
        });
        return deferred.promise();
    };


    /*
        Create Map Markers

        This function create twp map markers - one for the shadow, one for the icon.
        (bars, restaurants, party, etc).

        If the marker was found on Foursquare, point click event to marker_onClick().
     */
    var createMarker = function( loc_obj, name, fsq_obj ) {
        marker.setMap(null);  // remove previous markers
        marker_shadow.setMap(null);
        map.panTo( loc_obj.geometry.location ); // center map
        venue_location = loc_obj;
        self.fs = fsq_obj;

        // create shadow marker, but only if tips were found on foursquare
        if (typeof fsq_obj.tips != 'undefined') {

            // create location markers
            marker_shadow = new google.maps.Marker({
                position: loc_obj.geometry.location,
                map: map,
                icon: icon_shadow,
                zIndex: 0,
                clickable: false,
            });
            icon_marker.url = fsq_obj.venue.icon_url;

            marker = new google.maps.Marker({
                map: map,
                position: loc_obj.geometry.location,
                title: name,
                icon: icon_marker,
                zIndex: 1,
            });
            google.maps.event.addListener( marker, 'click', marker_onClick ); // add click event
        }
        else {
            console.warn("Using default marker; foursquare did not return any venue");
            marker = new google.maps.Marker({
                map: map,
                position: loc_obj.geometry.location,
                title: name
            });
        }
    };

    /*
        Private method - handles clicks on Markers

        When a click on a Marker is received, the information is extracted
        from Google Maps and passed to create the InfoWindow.
     */
    var marker_onClick = function() {
        service.getDetails( venue_location, function( result, status ) {
            if ( status != google.maps.places.PlacesServiceStatus.OK ) {
                alert( status );
                console.warn ( "Error on getDetails(). Reason: [" + status + "]" );
                return;
            };
            create_infownd( 0, result.name );   // 0 indicates 1st FSQ tip to show
        });
    };


    /*
        Private method - create infoWindow overlay

        Retrieves information about the tips available for this specific location
        (stored on properties of this object - self.fs, map), and populate the
        DOM accordingly.

        This also sets a recursive click event trigger to handle clicks on the
        the PREV/NEXT arrows.

        There is a limit of 30 tips per call on Foursquare's API. It is
        possible to expand this number, but not necessary for this proof-of-concept.
     */
    var create_infownd = function( i, window_name ) {
        var tip = self.fs.get_tip(i);
        var html = "";

        if (typeof tip == 'undefined') {
            var template_fn = _.template( $("#map-infowindow-template-error" ).html());
            html = template_fn();
        }
        else {
            var total_tips = self.fs.tips.response.tips.count;
            var data_bag = {
                index: i+1,
                name: window_name,
                tip: tip,
                total_tips: Math.min( total_tips, self.config.max_tips)
            }
            var template_fn = _.template( $("#map-infowindow-template" ).html());
            html = template_fn( data_bag );
        };
        infownd.setContent( html );
        infownd.open( map, marker );

        $(".arrow-left").click(function(){
            create_infownd( Math.max(i-1, 0), window_name );
        });
        $(".arrow-right").on('click', function(){
            create_infownd( Math.min(i+1, 29), window_name );    // hardcoded to 30 tips max
        });

    };

    // return the "public" methods, using the revealing module pattern
    return {
        config: config,
        initialize: initialize,
        search: search,
        createMarker: createMarker
    };
});





/*
  -----------------------------------
    Foursquare class
  -----------------------------------
 */
var Foursquare = (function () {
    'use strict';

    // fsq configuration - API endpoints and access keys
    var config = {
        client_id: "NV4ZGMW3U444RSQPTBPNCFDYBTYTQ1WKRRKBYLB4YSQ1BH2T",
        secret: "UHJHNVV2TMIHZUNP2J13ZPWP5F1XI0IRX3B3SAX2B4QMCVJX",
        search_venue_url: "https://api.foursquare.com/v2/venues/search?ll={%GEOCODE%}&query={%NAME%}&limit=1&intent=checkin&radius=5&client_id={%CLIENT_ID%}&client_secret={%SECRET%}&v={%DATE_YYYYMMDD%}",
        tips_url: "https://api.foursquare.com/v2/venues/{%VENUE_ID%}/tips?client_id={%CLIENT_ID%}&client_secret={%SECRET%}&v={%DATE_YYYYMMDD%}"
    };

    var venue = {},
        tips = {},
        self = {};


    /*
        get_reviews - return the tips for one specific location.
        It receives the venue name and a GoogleMaps LatLng object, returns
        a Foursquare object

        First we search Foursquare for the specific venue and lat/long coords.
        Upon successful return of a venue, we then query Foursquare again to
        retrieve the tips.

        This function returns a Promise. If there's an error, degrade gracefully.
     */
    var get_reviews = function( name, loc_obj ) {
        var deferred = new $.Deferred();

        // Try to find the venue on Fourquare
        api_search_venue( name, loc_obj )
            .done( function( v ){
                venue = v.response.venues[0];

                // Location not found on 4SQ; abort
                if (typeof venue == 'undefined') {
                    console.warn("Venue was not found on Foursquare; ignoring");
                    deferred.reject();
                }

                else {
                    // set marker to 4SQ category icon
                    venue.icon_url = venue.categories[0].icon.prefix + "bg_88" + venue.categories[0].icon.suffix;

                    //  Try to retrieve tips for this particular venue
                    api_get_venue_tips ( venue.id )
                        .done( function ( venue_tips ) {
                            deferred.resolve( venue, venue_tips );
                        })
                        .fail( function(){
                            console.warn( "Error retrieving tips from Foursquare. Degrading gracefully." );
                            deferred.reject();
                        });
                }
            })
            .fail(function(){
                console.warn( "Error searching venue on foursquare; ignoring" );
                deferred.reject ();
            });
        return deferred.promise();
    }


    /*
        Query the Foursquare API for a specific venue.
        Auxiliary private function; returns a promise (from getJSON)
     */
    var api_search_venue = function( name, loc_obj ) {
        var url = populate_url(
                        config.search_venue_url,
                        { name: name,
                          lat: loc_obj.geometry.location.lat(),
                          lng: loc_obj.geometry.location.lng()
                        } );
        return $.getJSON( url );
    };


    /*
        Query the Foursquare API to retrieve tips for a specific venue
        Auxiliary private function; returns a promise (from getJSON)
     */
    var api_get_venue_tips = function ( venue_id ) {
        var url = populate_url(
                        config.tips_url,
                        { venue: venue_id
                        } );
        return $.getJSON( url );
    };


    /*
        Auxiliary public function to return a specific tip, from the
        collection of tips.

        Used by create_infownd(), to deal with empty tips array or undefined
        object (if failed to retrieve tips).
     */
    var get_tip = function( i ) {
        var tips = this.tips;
        if ( typeof tips && !jQuery.isEmptyObject(tips) && i > -1 && i < (tips.response.tips.count-1) ) {
            return tips.response.tips.items[i];
        }
        else return (undefined);
    };


    /*
        Populates Fourquare API URL, given a set of parameters (lat/long, venue, today's date)
        Auxiliary private function. Returns the formatted URL.
     */
    var populate_url = function( base_url, params ) {
        var now = new Date();
        var date_yyyymmdd = now.toISOString().slice(0,10).replace(/-/g,"");
        var url = base_url
                .replace("{%GEOCODE%}",   params.lat + "," + params.lng)
                .replace("{%NAME%}",      escape(params.name))
                .replace("{%CLIENT_ID%}", config.client_id)
                .replace("{%SECRET%}",    config.secret)
                .replace("{%VENUE_ID%}",  params.venue)
                .replace("{%DATE_YYYYMMDD%}", date_yyyymmdd);
        return url;
    };

    // return the "public" methods, using the revealing module pattern
    return {
        get_reviews: get_reviews,
        get_tip: get_tip
    };
});



// Filtered Collection Decorator pattern, by Derick Bailey
//
// Given an original collection, returns a copy using the filter function
// passed as a parameter
//
// Source:
// http://spin.atomicobject.com/2013/08/08/filter-backbone-collection/
//
var filteredCollection = function(original, filterFn) {

    var filtered;
    filtered = new original.constructor();
    filtered._callbacks = {};   // Remove events associated with original

    filtered.filterItems = function(filter) {
        var items;
        items = original.filter(filter);
        filtered._currentFilter = filterFn;
        return filtered.reset(items);
    };

    original.on('reset change destroy', function() {     // Refilter when original collection is modified
        return filtered.filterItems(filtered._currentFilter);
    });
    return filtered.filterItems(filterFn);
};
