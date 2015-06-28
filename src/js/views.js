var app = app || {};

$(function() {
    'use strict';

    var viewModel = function() {

        var self = this;

        self.search_box = ko.observable();
        self.search_desc_checkbox = ko.observable(true);
        self.filteredPlaces = ko.computed(function(){
            var dummy = self.search_desc_checkbox();  // force reload when toggling checkbox
            //console.info("entering ko.computed(). activeFilter = [" + self.activeFilter() +
            //             "], checkbox [" + self.search_desc_checkbox() + "]");
            if ( self.search_box() ){
                return ko.utils.arrayFilter( app.model(), self.filter_fn );
            } else {
                return app.model();
            }
            return app.model();
        }).extend({ notify: 'always' });;

        // update the filtered model & recompose the message with # of results found
        self.msg_filter_result = ko.computed(function() {
            var len = self.filteredPlaces().length;
            return (len == 0) ? "No places found" : ("Showing " + len + " great place" + (len > 1 ? "s" : ""));
        });

        self.setActiveFilter = function( event ){
            var content = $( "#search-field" ).val().toLowerCase();
            var len = 0;
            var msg = "";
            self.activeFilter( content );
        };

        // Initialize model, filters, google maps, scroll bars
        self.initialize = function () {
            //var msg = "",
            //    len = 0;

            // set event callbacks
            //self.filter.subscribe( self.filter_places );
            // set event triggers on change for the search field (both keyboard & mouse/paste)
            //$( '#search-field' ).on( 'input propertychange paste', self.setActiveFilter );
            //$( '#search-checkbox' ).change( self.setActiveFilter );

            //self.setActiveFilter();

            // app.modelFiltered = ko.computed(function() {
            //     return ko.utils.arrayFilter( app.model(), self.filter_fn);
            // }, app.model);

            //self.filter("bi");
            //console.warn("Original model: " + app.model().length);
            //console.warn("Filtered model: " + app.modelFiltered().length);

            // initialize Google Map
            app.map = new Map();
            app.map.initialize ( "map-canvas" );

            // initialize slimscroll on sidebar
            if (!('ontouchstart' in document.documentElement)){ // touch devices already have a nice scroll
                $(function(){
                    $('#listview-items').slimScroll({
                        height: '2000px'
                    });
                });
            };

            ko.applyBindings( self.filteredPlaces() );
	    };

        // This function manages the search functionality, filtering the
        // model according to the content of the search-field.
        self.filter_fn = function(i) {
            var found = false;
            var searchDescription = $( "#search-checkbox" ).is( ":checked" );
            var str = self.search_box();
            console.info("searchDescription = " + searchDescription);
            console.info("search_str = " + str);
            if ( str.length == 0 ) {
                found = true;
            }
            else {
                found = i.name.toLowerCase().indexOf( str ) > -1 ||
                        i.address.toLowerCase().indexOf( str ) > -1;
                if ( searchDescription ) {
                    found = found || i.description.toLowerCase().indexOf( str ) > -1;
                }
            };
            console.info("found = " + found);
            return found;
        };

        /* This function manages click events on the sidebar with the destinations

           Obtain the id of the clicked element, then populate description box and
           search for this destination's address on Google Maps. If the destination
           is found, search on Foursquare, and store results on `fsq` property.
        */
        self.sidebar_click = function(data, e) {
            e.preventDefault();
            var clicked_el = $( e.currentTarget );
            var id = clicked_el.data( "id" );

            // reset to default state, and mark clicked item as active
            $( "a" ).toggleClass( "active", false );
            clicked_el.toggleClass( "active", true );

            //console.warn(id);
            //debugger;
            return;
            var item = app.placesFiltered.models[id];

            // populate description and image
            $( "#description-image" ).attr("src", item.get( "image" ) );
            $( "#description-text" ).html( "<p>" + item.get( "description" ) + "...</p>");

            // search Google Maps for address and location
            var name = item.get( "name" );
            var place = app.map.search( name, item );                  // search for address
            place
                .done( function (place) {
                    var fsq = new Foursquare();                         // Search Foursquare for the same venue
                    var fsq_reviews_p = fsq.get_reviews( name, place ); // returns a promise()
                    fsq_reviews_p
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
                    console.warn("Google failed");
                });
        };

    };

    // wait for data json to load before initializing view
    app.status
        .done(function(){
            app.model = ko.observableArray( app.data );
            app.view  = new viewModel();
            app.view.initialize();
        })
        .fail(function(){
            console.log("App loader - ERROR loading model JSON file" );
        });

});
