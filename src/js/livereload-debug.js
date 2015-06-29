// LiveReload hack refresh.
// Fixes the issue with Chrome, not refresh the page unless when mouse is over the viewport
//
// Under normal conditions, this would be deleted before moving the code to production.
setInterval(function(){
    document.getElementsByTagName('body')[0].focus();
}, 250);
