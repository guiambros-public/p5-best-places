/*global $ */
/*jshint unused:false */
var app = app || {};


/*  Checklist:

Required:
- test for error handling
- mobile friendly
- comment code
- readme

For extra credit:
- autocomplete
- use of a third API, besides Foursquare and Google Maps
-

*/
(function () {
    'use strict';

    // Create the view in jQuery's DOMReady
    // http://stackoverflow.com/questions/10371539/why-define-anonymous-function-and-pass-jquery-as-the-argument/10372429#10372429
    //
    $(function(){

        app.places.status
            .done(function(){
                app.view = new app.AppView();
            })
            .fail(function(){
                console.log("App loader - ERROR loading model JSON file" );
            })
            .always(function(){
                //
            });
    });

})();
