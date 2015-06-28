var app = app || {};

$(function() {
    'use strict';

    var viewModel = (function () {
        var self = this,
            search_box = ko.observable(""),
            search_desc_checkbox = ko.observable( false );


        // filtered model view
        var filteredPlaces = ko.computed( function() {
                if ( search_box().length == 0 ) {
                    return app.model();
                }
                return ko.utils.arrayFilter( app.model(), filter_fn );
            }).extend({ notify: 'always' });

        // message with number of records found is automatically updated
        var msg_filter_result = ko.computed(function() {
            var len = filteredPlaces().length;
            return (len == 0) ? "No places found" : ("Showing " + len + " great place" + (len > 1 ? "s" : ""));
        });


        // This function manages the search functionality, filtering the
        // model according to the content of the search-field.
        function filter_fn(i) {
            var str = search_box();
            var checkbox = search_desc_checkbox();
            if ( str.length == 0 ) {
                return true;
            }
            return i.name.toLowerCase().indexOf( str ) > -1 ||
                   i.address.toLowerCase().indexOf( str ) > -1 ||
                   ( checkbox && (i.description.toLowerCase().indexOf( str ) > -1));
        };

        // Initialize model, filters, google maps, scroll bars
        //
        var initialize = function() {
            ko.applyBindings( filteredPlaces() );

            app.map = new Map();
            app.map.initialize ( "map-canvas" );

            if (!('ontouchstart' in document.documentElement)){ // touch devices already have a nice scroll
                $(function(){
                    $('#listview-items').slimScroll({
                        height: '2000px'
                    });
                });
            };
	    };


        /* This function manages click events on the sidebar with the destinations

           Obtain the id of the clicked element, then populate description box and
           search for this destination's address on Google Maps. If the destination
           is found, search on Foursquare, and store results on `fsq` property.
        */
        var sidebar_click = function(data, e) {
            e.preventDefault();
            var clicked_el = $( e.currentTarget );
            var id = clicked_el.data( "id" );
            var item = filteredPlaces()[id];
            var name = item.name;

            // reset to default state, and mark clicked item as active
            $( "a" ).toggleClass( "active", false );
            clicked_el.toggleClass( "active", true );

            // populate description and image
            $( "#description-image" ).attr("src", item.image );
            $( "#description-text" ).html( "<p>" + item.description + "...</p>");

            // search Google Maps for address and location
            app.map.search( name, item )
                .done( function (place) {
                    var fsq = new Foursquare();
                    fsq.get_reviews( name, place )
                        .done(function( venue, tips ){
                            fsq.venue = venue;
                            fsq.tips = tips;
                        })
                        .fail(function(){
                            // no explicit treatment needed. It will degrade gracefully
                        })
                        .always(function( venue, tips ){
                            app.map.createMarker( place, name, fsq );
                        });
                })
                .fail( function () {
                    console.warn("Call to Google Maps failed");
                });
        };

        return {
            initialize: initialize,
            search_box: search_box,
            search_desc_checkbox: search_desc_checkbox,
            msg_filter_result: msg_filter_result,
            filteredPlaces: filteredPlaces,
            sidebar_click: sidebar_click,
        };

    });

    // wait for data json to load before initializing view
    app.status
        .done(function(){
            app.model = ko.observableArray( app.data );
            app.view = viewModel();
            app.view.initialize();
        })
        .fail(function(){
            console.log("App loader - ERROR loading model JSON file" );
        });

});
