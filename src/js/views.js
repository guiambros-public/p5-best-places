/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
    'use strict';

    app.AppView = Backbone.View.extend({
    	template: $("#sidebar-item-template").html(),
        //template: _.template($("#sidebar-item-template").html()),

        initialize: function () {
    		_.bindAll(this, 'render');
            app.Places.bind ( "change", this.render );
            this.render();
    	},

    	render: function () {
    		console.log("Rendering data...");
            var compiled = _.template(this.template);
            $("#list-group").append(compiled);
            //var compiled_template = _.template( $("#sidebar-item-template").html() );
    		//this.$el.html ( template );
    	}
    });

})(jQuery);

