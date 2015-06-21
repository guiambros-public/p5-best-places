/*global $ */
/*jshint unused:false */
var app = app || {};

(function () {
    'use strict';

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
