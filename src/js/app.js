/*global $ */
/*jshint unused:false */
var app = app || {};

(function () {
    'use strict';

    // kick things off by creating the `App`
    console.log("Appview created");

    // Create the view in jQuery's DOMReady, meaning it just executes when the DOM finishes rendering
    $(function(){
        new app.AppView();
    });

})();
