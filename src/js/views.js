var app = app || {};

(function ($) {
    'use strict';

    app.AppView = Backbone.View.extend({

        model: app.Places,

        el: "#sidebar-container",

        initialize: function () {
            this.listenTo(app.places, "change", this.render);
            this.render();
    	},

    	render: function () {
            console.log("Rendering view. Collection len: " + app.places.length);
            console.assert(app.places.length === 50, "JSON data file must have exact 50 elements");
            var template = _.template( $("#sidebar-item-template").html() );
            this.$el.append( template( ) );
            return this;
        },

    });

})(jQuery);

