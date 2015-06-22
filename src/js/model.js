/*global Backbone */
var app = app || {};

(function () {
    'use strict';

    /*  This is the model & collection.

        Note that the Collection uses $.getJSON to load the data. The return
        is a Promise, which is then placed on PlacesCollection.status, and is
        then used by the app bootloader to discover when the collection
        finished loading (so the view can be initialized).
     */
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
            //
        }
    });

    var PlacesCollection = Backbone.Collection.extend({
        model: Place,

        status: {},

        initialize: function () {
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
