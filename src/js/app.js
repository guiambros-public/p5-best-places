/*global $ */
/*jshint unused:false */
var app = app || {};

(function () {
    'use strict';

    $(function(){

        /*  Main app bootstrap.

            This function protects from the view of being initialized *before*
            the collection finishes loading (which could cause random errors).

            Note that making this DOM Ready (i.e., `$(function(){})()`) is NOT
            enough, as the DOM may be ready, but the Collection may be still
            loading asynchronously. Hence the use of Promises.
         */
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
