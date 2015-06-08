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
        console.log("Library / search() - starting");
        var request = {
            location: center_radius_obj,
            radius: config.radius,
            query: name + ", " + item.get("address") + ", NY"
        };
        service.textSearch( request, function ( results, status ) {
            console.log("Library / search() - callback received with response from Google");
            if ( status == google.maps.places.PlacesServiceStatus.OK ) {
                var place = results[0];
                console.log( "Library / search() - location received: " + place.geometry.location.lat() + "," + place.geometry.location.lng() );
                console.log( "Library / search() - categories: " + place.types );
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

        var foursquare_reviews = pull_foursquare( name, loc_obj );

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


    var pull_foursquare = function( name, loc_obj ) {
            // Client id NV4ZGMW3U444RSQPTBPNCFDYBTYTQ1WKRRKBYLB4YSQ1BH2T
            // Client secret UHJHNVV2TMIHZUNP2J13ZPWP5F1XI0IRX3B3SAX2B4QMCVJX
            console.log ( "Library / pull_foursquare() - received information from foursquare: ["
                        + name + "  " + loc_obj.formatted_address + "]" );
            return "Hello from 4sq - " + name + "  " + loc_obj.formatted_address;
    };


    return {
        config: config,
        initialize: initialize,
        search: search
    };
});
