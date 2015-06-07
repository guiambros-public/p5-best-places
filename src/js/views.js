var app = app || {};

(function ($) {
    'use strict';

    app.AppView = Backbone.View.extend({

        model: app.Places,

        el: "#sidebar-container",

        events: {
            'click a': 'clicked',
        },

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

        clicked: function(e) {
            app.e = e;
            e.preventDefault();
            var id = $(e.currentTarget).data("id");
            var item = app.places.get(id);
            var name = item.get("name");
            $("a").toggleClass("active", false);
            $(e.currentTarget).toggleClass("active", true);
            $("#image-box").attr("src", item.get("image"));
            $("#description-text").html(item.get("description"));
            console.log("Click detected - id:[ " + id + "], name: [" + name + "]");

        },

    });

})(jQuery);

