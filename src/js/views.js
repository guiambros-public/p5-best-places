var app = app || {};

(function ($) {
    'use strict';

    app.AppView = Backbone.View.extend({
        model: app.placesFiltered,
        el: "#destinations-container",
        events: {
            'click a': 'sidebar_click',
        },

        initialize: function () {
            // clone collection for filtering
            app.placesFiltered = new Backbone.Collection( app.places.toJSON() );
            $( '#search-box' ).on( 'input propertychange paste', this.filter_results );
            $( '#search-checkbox' ).change( this.filter_results );
            this.render();

            // set up events
            _.bindAll( this, 'filter_results' );
            _.bindAll( this, 'sidebar_click' );
            app.placesFiltered.on( 'reset', this.render, this );

            // initialize Google Map
            app.map = new Map();
            app.map.initialize ( "map-canvas" );
	    },

    	render: function () {
            var template_fn = _.template( $("#sidebar-item-template").html() );
            this.$el.html( template_fn() );

            template_fn = _.template( $("#sidebar-title-template").html() );
            $("#sidebar-title").html( template_fn() );
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
            $( "#image-box" ).attr("src", item.get( "image" ) );
            $( "#description-text" ).html( item.get( "description" ) );

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
                            console.warn("FSQ failed");
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
            console.log ( "entering filter_results" );
            var search_text = $("#search-box").val().toLowerCase();
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


/*

References:

- Using data-id to retrieved the clicked element, on situations where you have a single view, with multiple models
  https://lostechies.com/derickbailey/2011/10/11/backbone-js-getting-the-model-for-a-clicked-element/

- Using and combining Promises (or, "Avoiding callback-hell"):
  http://www.nurkiewicz.com/2013/03/promises-and-deferred-objects-in-jquery.html

- Inspiration for the shadow markers
  http://www.foodspotting.com/find/within/40.74368139882518,-73.99250956170653/40.769687713159634,-73.91182871453856

- Creating SVG images in pure CSS/HTML
  http://metafizzy.co/blog/making-svg-buttons/

- Filtered Collection Decorator pattern, by Derick Bailey
  http://spin.atomicobject.com/2013/08/08/filter-backbone-collection/

- Understanding delete
  http://perfectionkills.com/understanding-delete/

*/
