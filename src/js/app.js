/*global $ */
/*jshint unused:false */
var app = app || {};

(function () {
    'use strict';

    // kick things off by creating the `App`
    console.log("Appview created");

    // Create the view in jQuery's DOMReady, meaning it just executes when the DOM finishes rendering
    // For more information about DOMReady mode, see
    // http://stackoverflow.com/questions/10371539/why-define-anonymous-function-and-pass-jquery-as-the-argument/10372429#10372429
    $(function(){
        app.view = new app.AppView();
    });

})();
