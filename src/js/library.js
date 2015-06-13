var Map = (function () {
    'use strict';

    var config = {
        el_id: "map-canvas-box",
        location: "",
        center_radius: "40.7590615,-73.969231", // Manhattan
        radius: '100',
        style: [ { "stylers": [
                  { "saturation": -32 },
                  { "hue": "#0099ff" }
            ]}],
        options: {  zoom: 15,
                    disableDefaultUI: true,
                    maxZoom: 16,
                    minZoom: 11,
                    center: {}
        }
    };

    var map = {},
        service = {},
        infownd = {},
        marker = {},
        center_radius_obj = {};

    var initialize = function ( init_loc, el ) {
        console.log( "Library / initialize() - starting..." );

        // create location object for the center of the radius
        // (used later for search service)
        var loc_array = config.center_radius.split( "," ).map( Number );
        center_radius_obj = new google.maps.LatLng( loc_array[0], loc_array[1] );

        // create location object
        config.location = init_loc || config.location || center_radius || "64.1748683,-51.7382954"; // North Pole, as last case scenario
        var loc_array = config.location.split( "," ).map( Number );
        config.options.center = new google.maps.LatLng( loc_array[0], loc_array[1] );

        // create map object
        console.log( "Library / initialize() - creating map" );
        config.el = el || config.el;
        map = new google.maps.Map( document.getElementById( config.el_id ), config.options );
        map.setOptions( { styles: config.style } );
        console.log( "Library / initialize() - map created" );

        // create marker, service and infowindow
        service = new google.maps.places.PlacesService( map );
        marker  = new google.maps.Marker({});
        infownd = new google.maps.InfoWindow();
        console.log( "Library / initialize() - finished" );
    };


    // Search for the specific location using Google Places API
    //
    // To avoid false positives, search on a radius of 100 miles around
    // Manhattan, and limited to NY state. If the address is "various", plt
    // the top 4 results. Otherwise, use only the top result.
    //
    var search = function ( name, item ) {
        console.log("Library / search() - starting. Querying [" + name + ", " + item.get("address") + ", NY" + "]" );
        var request = {
            location: center_radius_obj,
            radius: config.radius,
            query: name + ", " + item.get("address") + ", NY"
        };
        service.textSearch( request, function ( results, status ) {
            console.log("Library / search() - callback received with response from Google");
            if ( status == google.maps.places.PlacesServiceStatus.OK ) {
                var place = results[0];
                console.log( "Library / search() - received: " + place.name + " - " + place.formatted_address +
                            " [" + place.geometry.location.lat() + "," + place.geometry.location.lng() + "]");
                //console.log( "Library / search() - categories: " + place.types );
                createMarker( place, name );
            }
            else {
                console.log( "Library / search() - ERROR searching Google Maps Service: " + status );
            };
        });
        console.log("Library / search() - finished");
    };


    // Create map markers
    //
    // When clicked, show information from Google Places (reviews) and + FourSquare's API
    //
    var createMarker = function( loc_obj, name ) {
        console.log ( "Library / createMarker() - starting" );
        marker.setMap(null); // remove previous markers and releases object
        marker = new google.maps.Marker({ // sets new marker
            map: map,
            position: loc_obj.geometry.location,
            title: name,
        });
        map.panTo( loc_obj.geometry.location ); // centers map

        var foursquare = new Foursquare();
        var reviews = foursquare.get_reviews( name, loc_obj );

        google.maps.event.addListener( marker, 'click', function() {
            service.getDetails( loc_obj, function( result, status ) {
                console.log( "Library / createMarker() - click on marker. Callback received with getDetails() information" );
                if ( status != google.maps.places.PlacesServiceStatus.OK ) {
                    alert( status );
                    console.log ( "Library / createMarker() - error on getDetails(). Reason: [" + status + "]" );
                    return;
                }
                console.log( "Library / createMarker() - setting & opening infoWindow" );
                infownd.setContent( foursquare_reviews + " - " + result.name );
                infownd.open( map, marker );
            });
        });
        console.log( "Library / createMarker() - finished" );
    };

    return {
        config: config,
        initialize: initialize,
        search: search
    };
});



var Foursquare = (function () {
    'use strict';

    var config = {
        client_id: "NV4ZGMW3U444RSQPTBPNCFDYBTYTQ1WKRRKBYLB4YSQ1BH2T",
        secret: "UHJHNVV2TMIHZUNP2J13ZPWP5F1XI0IRX3B3SAX2B4QMCVJX",
        search_venue_url: "https://api.foursquare.com/v2/venues/search?ll={%GEOCODE%}&query={%NAME%}&limit=1&intent=checkin&radius=5&client_id={%CLIENT_ID%}&client_secret={%SECRET%}&v={%DATE_YYYYMMDD%}",
        venue_detail_url: "https://api.foursquare.com/v2/venues/{%VENUE_ID%}/tips?client_id={%CLIENT_ID%}&client_secret={%SECRET%}&v={%DATE_YYYYMMDD%}"
    };

    var data = {};

    var get_reviews = function( name, loc_obj ) {
        var url = populate_url( config.search_venue_url, { name: name, lat: loc_obj.geometry.location.lat(), lng: loc_obj.geometry.location.lng() } );
        $.getJSON( url, function ( ret_value ) {
            data = ret_value;
        } )
            .done(function(){
                var venue_id = data.response.venues[0].id;
                console.log( "Library / Foursquare / search_venue() - successfully returned venue, id = [" + venue_id + "]" );
                return get_venue_detail( venue_id );
            })
            .fail(function(){
                console.log( "Library / Foursquare / search_venue() - error finding venue" );
            })
            .always(function(){
                console.log( "Library / Foursquare / search_venue() - finished loading venues" );
            });

            console.log( "Library / Foursquare / search_venue() - finished" );
    };

    var get_venue_detail = function ( venue_id ) {
        var url = populate_url( config.venue_detail_url, { venue: venue_id } );
        $.getJSON( url, function ( ret_value ) {
            data = ret_value;
        } )
            .done(function(){
                console.log( "Library / Foursquare / get_venue_detail() - successfully returned venue. Tips: [" + data.response.tips.count + "]" );
                return data;
            })
            .fail(function(){
                console.log( "Library / Foursquare / get_venue_detail() - error retrieving venue info" );
            })
            .always(function(){
                console.log( "Library / Foursquare / get_venue_detail() - finished retrieving venue info" );
            });
    };

    var populate_url = function( base_url, params ) {
        var now = new Date();
        var date_yyyymmdd = now.toISOString().slice(0,10).replace(/-/g,"");
        console.log (params);
        var url = base_url
                .replace("{%GEOCODE%}",   params.lat + "," + params.lng)
                .replace("{%NAME%}",      escape(params.name))
                .replace("{%CLIENT_ID%}", config.client_id)
                .replace("{%SECRET%}",    config.secret)
                .replace("{%VENUE_ID%}",  params.venue)
                .replace("{%DATE_YYYYMMDD%}", date_yyyymmdd);

        console.log( "Library / populate_url() / finished processing" );
        console.log(url);
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
