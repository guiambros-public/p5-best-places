var app = app || {};

(function ($) {
    'use strict';

    app.AppView = Backbone.View.extend({
        model: app.placesFiltered,
        el: "#listview-items-container",
        events: {
            'click a': 'sidebar_click',
        },

        initialize: function () {
            // clone collection for filtering
            app.placesFiltered = new Backbone.Collection( app.places.toJSON() );
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

    	render: function () {
            var template_fn = _.template( $("#sidebar-item-template").html() );
            this.$el.html( template_fn() );

            template_fn = _.template( $("#num-places-template").html() );
            $("#num-places").html( template_fn() );
            return this;
        },


        // Manage click events on sidebar buttons
        //
        // The id is obtained from the data-id element used in the template,
        // and adjust the description box and google maps. #active class is
        // toggled, to simulate the on/off effect
        //
        sidebar_click: function(e) {
            // adjust UI to reflect the click
            e.preventDefault();
            $( "a" ).toggleClass( "active", false );                    // reset everyone
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
                            //
                        })
                        .always(function( venue, tips ){
                            app.map.createMarker( place, name, fsq );
                        });
                })
                .fail( function () {
                    console.warn("Google failed");
                });
        },

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

            app.placesFiltered.reset ( filteredCollection( app.places, filterFn ) );
        },
    });
})(jQuery);
