var app = app || {};

(function ($) {
    'use strict';

    app.AppView = Backbone.View.extend({
        model: app.Places,
        el: "#sidebar-container",
        events: {
            'click a': 'button_click',
        },
        map: {},

        initialize: function () {
            console.log( "View / initialize() - starting" );
            this.listenTo(app.places, "change", this.render);
            this.render();
            this.map = new Map();
            this.map.config.el_id = "map-canvas";
            this.map.initialize( "40.7504877,-73.9839238" );
            console.log( "View / initialize() - finished" );
    	},

    	render: function () {
            console.log( "View / render() - starting. Collection len: " + app.places.length );
            console.assert( app.places.length === 50, "JSON data file must have exact 50 elements" );
            var template = _.template( $( "#sidebar-item-template" ).html() );
            this.$el.append( template() );
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
            app.e = e; // FIXME - for debugging only
            e.preventDefault();
            var id = $( e.currentTarget ).data( "id" );
            var item = app.places.get( id );
            var name = item.get( "name" );
            $( "a" ).toggleClass( "active", false );
            $( e.currentTarget ).toggleClass( "active", true );
            $( "#image-box" ).attr("src", item.get( "image" ) );
            $( "#description-text" ).html( item.get( "description" ) );
            console.log( "View - click detected - id:[ " + id + "], name: [" + name + "]");

            this.map.search( name, item );
        },
    });
})(jQuery);
