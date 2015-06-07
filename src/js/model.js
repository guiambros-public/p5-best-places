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

    var Places = Backbone.Collection.extend({
        model: Place,

        initialize: function () {
            console.log ("Initializing collection Places");
            Places.this = this;

            $.getJSON("db/data.json", function (data) {
                $.each(data, function(key) {
                    var m = new Place ( {
                            "id": key,
                            "name": data[key].name,
                            "address": data[key].address,
                            "site": data[key].website,
                            "image": data[key].image,
                            "description": data[key].description
                        } );
                    Places.this.add(m);
                });
            })
                .done(function(){
                    console.log("SUCCESS loading JSON file");
                })
                .fail(function(){
                    console.log("ERROR loading JSON file");
                })
                .always(function(){
                    console.log("Finished trying to load JSON file...");
                });
        },

    });

    app.places = new Places();
})();


