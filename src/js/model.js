/*global Backbone */
var app = app || {};

(function () {
    'use strict';

    var Place = Backbone.Model.extend({
        defaults: {
            id: '',
            name: '',
            address: '',
            site: '',
            image: '',
            description: '',
            latitude: '',
            longitude: '',
            favorite: false
        }
    });

    app.Places = Backbone.Collection.extend({
        model: Place,
        // localStorage: new Backbone.LocalStorage("udacity-p5-places"),
        favs: function () {
            return this.where({favorite: true});
        },
        all: function () {
            return this;
        },
        comparator: 'order',
        initialize: function () {
            var data = JSON.parse($.getJSON("db/data.json"));
            console.log (data.length);
        }
    });
})();