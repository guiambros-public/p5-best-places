/**
 * @fileoverview This file contains the Model, reading from the json data file. The original
 * array is stored in <b>app.data</b>. The status of the asynchronous getJSON operation is
 * stored in app.model_status, and a Promise is returned.
 *
 * @author Gui Ambros gui@wrgms.com
 */

var app = app || {};

(function () {
    'use strict';

    /**
     * Stores a copy of the data array as read by the getJSON() function, containing all the locations
     *
     * @memberof! app#
     * @type {Array}
     */
    app.data = [];

    /**
     * Status of the asynchronous getJSON operation to populate Model object (app.model)
     *
     * @memberof! app#
     * @type {Deferred}
     */
    app.model_status = $.getJSON("db/data.json", function (data) {
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
