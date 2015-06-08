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
        app.places.status
            .done(function(){
                console.log( "App loader - model finished loading successfully" );
                app.view = new app.AppView();
                console.log( "App loader - finished creating view" );
            })
            .fail(function(){
                console.log("App loader - ERROR loading model JSON file" );
            })
            .always(function(){
                console.log("App loader - finished efforts to load model JSON file");
            });
    });

})();
