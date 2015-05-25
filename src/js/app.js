/*global $ */
/*jshint unused:false */
var app = app || {};

(function () {
    'use strict';

    // kick things off by creating the `App`
    console.log("Appview created");

    // Create the view in jQuery's DOMReady
    $(function(){
        new app.AppView();
    });

})();