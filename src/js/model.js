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
            //console.log ("Initializing model Place with vals " + JSON.stringify(vals));
        }
    });

    var Places = Backbone.Collection.extend({
        model: Place,

        initialize: function () {
            console.log ("Initializing collection Places");
            //this.add(m1);
            //this.add([m2, m3]);
            Places.this = this;

            $.getJSON("db/data.json", function (data) {
                //console.log(JSON.stringify(data));
                $.each(data, function(key) {
                    //console.log ("key = " + key + "  |  val = " + data[key].name);
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
            });
        },

    });

    //var m1 = new Place( { name: "robert", image: "robert.png"} );
    //var m2 = new Place( { name: "william", image: "william.png"} );
    //var m3 = new Place( { name: "paul", image: "paul.png"} );

    app.places = new Places();
    console.log("Model instantiation finished. Number of items in collection: " + app.places.length);
    console.log("Models in collection: " + app.places.models);
})();


