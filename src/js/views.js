var app = app || {};

(function ($) {
    'use strict';

    app.AppView = Backbone.View.extend({
        model: app.placesFiltered,
        el: "#listview-items-container",
        events: {
            'click a': 'sidebar_click',
        },

        /*  This function takes care of the view initialization.

            - The Backbone collection is duplicated, so we can do filtering
              without impacting the original collection.
            - Events are bound to the initial object context, and the `reset`
              event triggers a new render(). Google Maps is initialized and shown.
            - jQuery slimScroll is inserted, for non-touch devices
         */
        initialize: function () {
            // clone collection for filtering
            app.placesFiltered = new Backbone.Collection( app.places.toJSON() );

            // set event triggers on change for the search field (both keyboard & mouse/paste)
            $( '#search-field' ).on( 'input propertychange paste', this.filter_results );
            $( '#search-checkbox' ).change( this.filter_results );

            this.render();

            // set up events
            _.bindAll( this, 'filter_results' );
            _.bindAll( this, 'sidebar_click' );
            app.placesFiltered.on( 'reset', this.render, this );

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
            }
	    },

        /*  This function renders the collection, using Underscore's templating system
         */
    	render: function () {
            var template_fn = _.template( $("#sidebar-item-template").html() );
            this.$el.html( template_fn() );

            template_fn = _.template( $("#num-places-template").html() );
            $("#num-places").html( template_fn() );
            return this;
        },


        /* This function manages click events on the sidebar with the destinations

           First we obtain the id of the clicked element via DOM's data-id element.
           We then populate the description box (image and text), and start a
           search for this destination's address on Google Maps.

           If the destination is found, we use the geocoordinates and name to
           search on Foursquare, and store the values on the object property fsq.
        */
        sidebar_click: function(e) {
            e.preventDefault();
            $( "a" ).toggleClass( "active", false );                    // reset everything to default state
            var clicked_el = $( e.currentTarget );
            clicked_el.toggleClass( "active", true );                   // mark clicked element as active

            // find the item clicked
            var id = clicked_el.data( "id" );
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
        },


        /* This function manages the search functionality, filtering the
           collection according to the content of the search-field.

           This is triggered by any change to the search-field, either via
           keyboard or paste via mouse.

           Some basic string manipulation is done to make sure that the search
           is case-insensitive. It also controls the serch inside
           descriptions, if selected.
        */
        filter_results: function(e) {
            var search_text = $("#search-field").val().toLowerCase();
            var filterFn = function(collection) {
                var ret = collection.get('name').toLowerCase().indexOf(search_text) > -1 ||
                          collection.get('address').toLowerCase().indexOf(search_text) > -1;
                if ( $("#search-checkbox").is(":checked") ) {
                    ret = ret || collection.get('description').toLowerCase().indexOf( search_text ) > -1;
                }
                return ret;
            };

            app.placesFiltered.reset ( filteredCollection( app.places, filterFn ) );    // see common.js for filteredCollection()
        },
    });
})(jQuery);
