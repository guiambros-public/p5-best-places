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
        center_radius_obj = {};

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

        // create marker, service and infowindow
        service = new google.maps.places.PlacesService( map );
        marker  = new google.maps.Marker({});
        marker_shadow  = new google.maps.Marker({});
        infownd = new google.maps.InfoWindow();

        // close infowindow when you click anywhere else on the map. Improves usability
        google.maps.event.addListener(map, "click", function() {
            infownd.close()
        });
    };


    // Search for the specific location using Google Places API
    //
    // To avoid false positives, search on a radius of 100 miles around
    // Manhattan, and limited to NY state. If the address is "various", plt
    // the top 4 results. Otherwise, use only the top result.
    //
    var search = function ( name, item ) {
        var request = {
            location: center_radius_obj,
            radius: config.radius,
            query: name + ", " + item.get("address") + ", NY"
        };
        console.log( "Query: " + request.query );

        service.textSearch( request, function ( results, status ) {
            if ( status == google.maps.places.PlacesServiceStatus.OK ) {
                var place = results[0];
                createMarker( place, name );
            }
            else {
                console.log( "ERROR searching Google Maps Service: " + status );
            };
        });
    };


    // Create map markers
    //
    // When clicked, show information from Google Places (reviews) and + FourSquare's API
    //
    var createMarker = function( loc_obj, name ) {

        marker.setMap(null);                        // remove previous markers
        marker_shadow.setMap(null);
        map.panTo( loc_obj.geometry.location );     // center map
        $("#4sq-icon").attr("src", "");             // FIXME

        var icon = {
            url: "",
            anchor: new google.maps.Point(16, 42),
            scaledSize: new google.maps.Size(32, 32)
        };

        var shadow = {
            url: "/assets/images/map-shadow.png",
            scaledSize: new google.maps.Size(38, 45)
        };

        // retrieve information from foursquare for this specific location
        var fsq = new Foursquare();
        var fsq_reviews_p = fsq.get_reviews( name, loc_obj );    // returns a promise()
        var fsq_icon_url = "";
        var fsq_success = false;

        fsq_reviews_p
            .done(function( venue, tips ){
                fsq_icon_url = venue.categories[0].icon.prefix + "bg_88" + venue.categories[0].icon.suffix;
                fsq_success = true;
                icon.url = fsq_icon_url;
                $("#4sq-icon").attr("src", fsq_icon_url );        // populate image/description

                // create shadow marker
                marker_shadow = new google.maps.Marker({
                    position: loc_obj.geometry.location,
                    map: map,
                    icon: shadow,
                    zIndex: 0,
                    clickable: false,
                });
            })
            .fail(function(){
                icon = "";  // use default icon marker, instead of foursquare's personalized icon
            })
            .always(function( venue, tips ){
                marker = new google.maps.Marker({
                    map: map,
                    position: loc_obj.geometry.location,
                    title: name,
                    icon: icon,
                    zIndex: 1,
                });

                // add click event to marker, but only if we have foursquare information to show
                if (fsq_success) {
                    google.maps.event.addListener( marker, 'click', function() {
                        service.getDetails( loc_obj, function( result, status ) {
                            if ( status != google.maps.places.PlacesServiceStatus.OK ) {
                                alert( status );
                                console.warn ( "Error on getDetails(). Reason: [" + status + "]" );
                                return;
                            }
                            app.e = tips;
                            var i = 4;
                            var tot_tips = Math.min( config.max_tips, tips.response.tips.count);
                            var tip = tips.response.tips.items[i];
                            var contentString =
                                '<div id="content"><div id="siteNotice"></div>' +
                                '<h1 id="firstHeading" class="firstHeading">' + result.name + '</h1>'+
                                '<div id="bodyContent">'+
                                '<p><b>[ TIP x/' + tot_tips +', by ' + (tip.user.firstName ? tip.user.firstName : "") + ' ' + ( tip.user.lastName ? tip.user.lastName :
                                "" ) + ']</b> ' +
                                tip.text +
                                '</p>'+
                                '<p>Attribution: Foursquare, <a href="' + tip.canonicalUrl + '">' +
                                tip.canonicalUrl + '</a>'+
                                ' (posted ' + tip.createdAt + ').</p>'+
                                '</div>'+
                                '</div>';
                            //infownd.setContent( result.name + " - " + tips.response.tips.count );
                            infownd.setContent( contentString );
                            infownd.open( map, marker );
                        });
                    });
                };
            });
    };

//        google.maps.event.addListener(b, "click", function() {
//            b.map.infowindow.setContent(
//                '<div style="width: 300px"><a href="' + e.url + '" target="_new"><img src="' +
//                 e.thumb_90 +
//                 '" style="float:left;margin-right:10px"></a> <p style="line-height: 15px"><strong style="font-size:110%">' +
//                 e.item +
//                 '</strong><br /><small style="color: #777;font-weight:bold;">@ ' +
//                 e.place + "</small></p> <address>" +
//                 e.full_address + "</address></div>");
//            b.map.infowindow.open(b.map, b)
//        }, this);




    return {
        config: config,
        initialize: initialize,
        search_and_display: search
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

    var data = {};

    var get_reviews = function( name, loc_obj ) {
            var deferred = new $.Deferred();

            // search for venue using Foursquare API
            api_search_venue( name, loc_obj )
                .done( function( venues ){
                    var venue = venues.response.venues[0];
                    if (typeof venue == 'undefined') {
                        console.warn("Location not found on Foursquare");
                        deferred.reject();
                    }
                    else {
                        // retrieve venue details
                        api_get_venue_tips ( venue.id )
                            .done( function ( venue_tips ) {
                                deferred.resolve( venue, venue_tips );
                            })
                            .fail( function(){
                                console.log( "Venue was not found on Foursquare" );
                                deferred.reject ();
                            });
                    }

                })
                .fail(function(){
                    console.log( "Error searching venue on foursquare" );
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
