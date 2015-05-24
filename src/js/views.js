/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
    'use strict';

    app.AppView = Backbone.View.extend({
    	el: $("#sidebar-item-template"),
    	initialize: function () {
    		this.render();
    	},

    	render: function () {
    		var template = _.template( $('#sidebar-item-template').html(), {} );
    		this.$el.html ( template );
    	}
    });

})(jQuery);