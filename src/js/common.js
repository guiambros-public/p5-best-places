var Map = (function () {
    'use strict';

    var config = {
        el_id: "map-canvas-box",
        location: "",
        center_radius: "40.7590615,-73.969231", // Manhattan
        radius: '50',
        style: [ { "stylers": [
                  { "saturation": -32 },
                  { "hue": "#0099ff" }
            ]}],
        options: {  zoom: 15,
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
        tips = {};

    var icon_marker = {
        anchor: new google.maps.Point(16, 42),
        scaledSize: new google.maps.Size(32, 32),
        url: ""
    };

    var icon_shadow = {
        url: "/assets/images/map-shadow.png",
        scaledSize: new google.maps.Size(38, 45)
    };


    var initialize = function ( init_loc, el ) {
        // create location object for the center of the radius
        // (used later for search service)
        var loc_array = config.center_radius.split( "," ).map( Number );
        center_radius_obj = new google.maps.LatLng( loc_array[0], loc_array[1] );

        // create location object
        config.location = init_loc || config.location || center_radius || "64.1748683,-51.7382954"; // North Pole, as last case scenario
        var loc_array = config.location.split( "," ).map( Number );
        config.options.center = new google.maps.LatLng( loc_array[0], loc_array[1] );

        // create map object
        config.el = el || config.el;
        map = new google.maps.Map( document.getElementById( config.el_id ), config.options );
        map.setOptions( { styles: config.style } );

        // create shell objects
        service = new google.maps.places.PlacesService( map );
        marker  = new google.maps.Marker({});
        marker_shadow  = new google.maps.Marker({});
        infownd = new google.maps.InfoWindow();

        // add event to close infowindow when you click anywhere on the map. Improves usability.
        google.maps.event.addListener(map, "click", function() {
            infownd.close()
        });
    };


    // Search for the specific location using Google Places API
    //
    // To avoid false positives, search on a radius of 50 miles around
    // Manhattan, and limited to NY state.
    //
    var search = function ( name, item ) {
        var request = {
            location: center_radius_obj,
            radius: config.radius,
            query: name + ", " + item.get("address") + ", NY"
        };
        var deferred = new $.Deferred();
        console.log( "Query: " + request.query );

        service.textSearch( request, function ( results, status ) {
            if ( status == google.maps.places.PlacesServiceStatus.OK ) {
                console.info( "Result found" );
                deferred.resolve( results[0] );
            }
            else {
                console.warn( "ERROR searching Google Maps Service: " + status );
                deferred.reject();
            };
        });
        return deferred.promise();
    };


    // Create map markers
    var createMarker = function( loc_obj, name, fsq_venue ) {
        marker.setMap(null);                        // remove previous markers
        marker_shadow.setMap(null);
        map.panTo( loc_obj.geometry.location );     // center map

        // create shadow marker, but only if displaying
        if (typeof fsq_venue != 'undefined') {
            // create location markers
            marker_shadow = new google.maps.Marker({
                position: loc_obj.geometry.location,
                map: map,
                icon: icon_shadow,
                zIndex: 0,
                clickable: false,
            });
            icon_marker.url = fsq_venue.icon_url;

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
            console.warn("Plotting marker, but skipping marker_shadow; foursquare did not return any venue");
            marker = new google.maps.Marker({
                map: map,
                position: loc_obj.geometry.location,
                title: name
            });
        }
    };

    // handle clicks on markers
    var marker_onClick = function() {
        console.info("Marker_onClick");
//        service.getDetails( loc_obj, function( result, status ) {
//            if ( status != google.maps.places.PlacesServiceStatus.OK ) {
//                alert( status );
//                console.warn ( "Error on getDetails(). Reason: [" + status + "]" );
//                return;
//            }
//
//            var content_string = "";
//            if (fsq_success) {
//                var i = 4;
//                var total_tips = Math.min( config.max_tips, tips.response.tips.count);
//                var tip = tips.response.tips.items[i];
//                var data_bag = {
//                    name: result.name,
//                    tip: tip,
//                    total_tips: total_tips
//                }
//                var template_fn = _.template( $("#map-infowindow-template").html());
//                content_string = template_fn(data_bag);
//            }
//            else {
//                var template_fn = _.template( $("#map-infowindow-template-error").html());
//                content_string = template_fn();
//            };
//
//            infownd.setContent( content_string );
//            infownd.open( map, marker );
//            $(".arrow-left").click(function(){
//                alert("left click");
//            });
//            $(".arrow-right").on('click', function(){
//                alert("right click");
//            });
    };

    return {
        config: config,
        initialize: initialize,
        search: search,
        createMarker: createMarker
    };
});



var Foursquare = (function () {
    'use strict';

    var config = {
        client_id: "NV4ZGMW3U444RSQPTBPNCFDYBTYTQ1WKRRKBYLB4YSQ1BH2T",
        secret: "UHJHNVV2TMIHZUNP2J13ZPWP5F1XI0IRX3B3SAX2B4QMCVJX",
        search_venue_url: "https://api.foursquare.com/v2/venues/search?ll={%GEOCODE%}&query={%NAME%}&limit=1&intent=checkin&radius=5&client_id={%CLIENT_ID%}&client_secret={%SECRET%}&v={%DATE_YYYYMMDD%}",
        tips_url: "https://api.foursquare.com/v2/venues/{%VENUE_ID%}/tips?client_id={%CLIENT_ID%}&client_secret={%SECRET%}&v={%DATE_YYYYMMDD%}"
        // &client_id=NV4ZGMW3U444RSQPTBPNCFDYBTYTQ1WKRRKBYLB4YSQ1BH2T&secret=UHJHNVV2TMIHZUNP2J13ZPWP5F1XI0IRX3B3SAX2B4QMCVJX&v=20150614
    };

    var venue = {},
        tips = {};

    var get_reviews = function( name, loc_obj ) {
        var deferred = new $.Deferred();

        // search for venue using Foursquare API
        api_search_venue( name, loc_obj )
            .done( function( v ){
                venue = v.response.venues[0];
                if (typeof venue == 'undefined') {
                    console.warn("Location not found on Foursquare");
                    deferred.reject();
                }
                else {
                    // retrieve venue details
                    venue.icon_url = venue.categories[0].icon.prefix + "bg_88" + venue.categories[0].icon.suffix;
                    api_get_venue_tips ( venue.id )
                        .done( function ( venue_tips ) {
                            tips = venue_tips.response.tips.items;
                            deferred.resolve( venue, tips );
                        })
                        .fail( function(){
                            console.warn( "Venue was not found on Foursquare" );
                            deferred.reject();
                        });
                }
            })
            .fail(function(){
                console.warn( "Error searching venue on foursquare" );
                deferred.reject ();
            });
        return deferred.promise();
    }

    var api_search_venue = function( name, loc_obj ) {
        var url = populate_url(
                        config.search_venue_url,
                        { name: name,
                          lat: loc_obj.geometry.location.lat(),
                          lng: loc_obj.geometry.location.lng()
                        } );
        return $.getJSON( url );
    };

    var api_get_venue_tips = function ( venue_id ) {
        var url = populate_url(
                        config.tips_url,
                        { venue: venue_id
                        } );
        return $.getJSON( url );
    };

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

    return {
        get_reviews: get_reviews
    };
});



// Filtered Collection Decorator pattern, by Derick Bailey
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
