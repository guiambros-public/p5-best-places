var app = app || {};

(function ($) {
    'use strict';

    app.AppView = Backbone.View.extend({
        model: app.placesFiltered,

        el: "#sidebar-container",

        events: {
            'click a': 'button_click',
        },

        map: {},

        initialize: function () {
            console.log( "View / initialize() - starting" );

            // clone collection for filtering
            app.placesFiltered = new Backbone.Collection( app.places.toJSON() );
            $( '#search-box' ).on( 'input propertychange paste', this.filter_results );
            this.render();

            // set up events
            _.bindAll( this, 'filter_results' );
            this.listenTo( app.placesFiltered, "change", this.render );

            // initialize maps
            this.map = new Map();
            this.map.config.el_id = "map-canvas";
            this.map.initialize( "40.7504877,-73.9839238" );

            console.log( "View / initialize() - finished" );
    	},

    	render: function () {
            console.log( "View / render() - starting. Collection len: " + app.placesFiltered.length );
            //console.assert( app.placesFiltered.length === 50, "JSON data file must have exact 50 elements. Found: " + app.placesFiltered.length );
            var template = _.template( $("#sidebar-item-template").html() );
            this.$el.html( template() );

            console.log( "View / render() - finished" );
            return this;
        },

        // Manage click events on sidebar buttons
        //
        // The id is obtained from the data-id element used in the template,
        // and adjust the description box and google maps. #active class is
        // toggled, to simulate the on/off effect
        //
        button_click: function(e) {
            e.preventDefault();
            var id = $( e.currentTarget ).data( "id" );
            var item = app.placesFiltered.get( id );
            var name = item.get( "name" );
            $( "a" ).toggleClass( "active", false );
            $( e.currentTarget ).toggleClass( "active", true );
            $( "#image-box" ).attr("src", item.get( "image" ) );
            $( "#description-text" ).html( item.get( "description" ) );
            console.log( "View - click detected - id:[ " + id + "], name: [" + name + "]");

            this.map.search( name, item );
        },

        filter_results: function(e) {
            console.log ( "key pressed - " + e.which );
            //debugger;
            var search_text = $("#search-box").val().toLowerCase();

            var filterFn = function(collection) {
                return collection.get( 'name'  ).toLowerCase().indexOf( search_text ) > -1;
            };

            app.placesFiltered.reset ( filteredCollection( app.places, filterFn ) );
            app.view.render();
            //if (e.which === ENTER_KEY && this.$input.val().trim()) {
                //app.todos.create(this.newAttributes());
                //this.$input.val('');
            //    console.log ( "ENTER pressed" );
            //};
        },

    });
})(jQuery);
