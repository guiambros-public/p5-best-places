var app = app || {};

(function ($) {
    'use strict';

    app.AppView = Backbone.View.extend({

        model: app.Places,

        el: "#sidebar-container",

        events: {
            'click a': 'button_click',
        },

        view: this,

        initialize: function () {
            this.listenTo(app.places, "change", this.render);
            this.render();
            app.nyc_latlng = new google.maps.LatLng(40.7504877,-73.9839238);
            var map_style = [{ "stylers": [
                                    { "saturation": -32 },
                                    { "hue": "#0099ff" }
                                ]
                            }];
            var map_options = { zoom: 15,
                                center: app.nyc_latlng,
                                disableDefaultUI: true,
                                maxZoom: 16,
                                minZoom: 11
                              };
            app.map = new google.maps.Map(document.getElementById('map-canvas'), map_options );
            app.map.setOptions({styles: map_style});
            app.map_svc = new google.maps.places.PlacesService(app.map);
            app.map_infownd = new google.maps.InfoWindow();
            app.marker = new google.maps.Marker({});
    	},

    	render: function () {
            console.log("Rendering view. Collection len: " + app.places.length);
            console.assert(app.places.length === 50, "JSON data file must have exact 50 elements");
            var template = _.template( $("#sidebar-item-template").html() );
            this.$el.append( template( ) );
            return this;
        },


        // Manage click events on sidebar buttons
        //
        // The id is obtained from the data-id element used in the template,
        // and adjust the description box and google maps. #active class is
        // toggled, to simulate the on/off effect
        //
        button_click: function(e) {
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

            this.search_place(name, item);
        },

        // Search for the specific location using Google Places API
        //
        // To avoid false positives, search on a radius of 100 miles around
        // Manhattan, and limited to NY state. If the address is "various", plt
        // the top 4 results. Otherwise, use only the top result.
        //
        search_place: function(name, item) {
            var request = {
                location: app.nyc_latlng,
                radius: '100',
                query: name + ", " + item.get("address") + ", NY"
            };
            app.map_svc.textSearch(request, function(results, status){
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    var place = results[0];
                    app.view.createMarker(place, name);
                    console.log("Google says this location is at: " + place.geometry.location.lat() + "," + place.geometry.location.lng());
                    console.log("Categories: " + place.types);
                }
                else {
                    console.log("ERROR: " + status);
                }
            });
        },

        // Create map markers
        //
        // When clicked, show information from Google Places (reviews) and + FourSquare's API
        //
        createMarker: function(map_location, name) {
            app.marker.setMap(null); // remove previous markers
            app.marker = new google.maps.Marker({ // sets current marker
                map: app.map,
                position: map_location.geometry.location,
                title: name,
            });

            app.map.panTo(map_location.geometry.location); // centers map

            var foursquare_reviews = this.pull_foursquare(name, map_location);

            google.maps.event.addListener(app.marker, 'click', function() {
                app.map_svc.getDetails(map_location, function(result, status) {
                    if (status != google.maps.places.PlacesServiceStatus.OK) {
                        alert(status);
                        return;
                    }
                    app.map_infownd.setContent(foursquare_reviews + " - " + result.name);
                    app.map_infownd.open(app.map, app.marker);
                });
            });
        },

        pull_foursquare: function(name, map_location) {
            // Client id NV4ZGMW3U444RSQPTBPNCFDYBTYTQ1WKRRKBYLB4YSQ1BH2T
            // Client secret UHJHNVV2TMIHZUNP2J13ZPWP5F1XI0IRX3B3SAX2B4QMCVJX
            return "Hello from 4sq";
        },


        //


    });
})(jQuery);

