// IIFE - Immediately Invoked Function Expression.
(function ($, window, document) {


$(document).ready(function(){

    $('#btnSubmit').click(function(){
        $.openNewOverlay('Signing you in... Please wait');
    });


}); // end document ready

/**** No JQuery actions ***/

}(window.jQuery, window, document));
// The global jQuery object is passed as a parameter.

