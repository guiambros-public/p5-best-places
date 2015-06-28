/*global Backbone */
var app = app || {};

(function () {
    'use strict';
    app.data = [];
    app.status = $.getJSON("db/data.json", function (data) {
        $.each(data, function(key) {
            app.data.push({
                "id": key,
                "name": data[key].name,
                "address": data[key].address,
                "site": data[key].website,
                "image": data[key].image,
                "description": data[key].description
            });
        });
    });
})();
