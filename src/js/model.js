/*global Backbone */
var app = app || {};

(function () {
    'use strict';
    console.log ("Running model.js");

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
        },
        initialize: function(vals){
            void 0;
        }
    });

    var PlacesCollection = Backbone.Collection.extend({
        model: Place,

        status: {},

        initialize: function () {
            console.log ("Initializing collection Places");
            var _thisObject = this;  // retains the context of the parent collection object

            this.status = $.getJSON("db/data.json", function (data) {
                $.each(data, function(key) {
                    var m = new Place ( {
                            "id": key,
                            "name": data[key].name,
                            "address": data[key].address,
                            "site": data[key].website,
                            "image": data[key].image,
                            "description": data[key].description
                        } );
                    _thisObject.add(m);
                });
            });
        },

    });

    app.places = new PlacesCollection();
})();
