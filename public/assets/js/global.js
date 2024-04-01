

(function ($, window, document) {

    $.extend({
        openNewOverlay: function (message) {
            $('.loader').html(`<i class="fa fa-circle-o-notch fa-3x fa-spin" aria-hidden="true"></i> <br/><br/> ${message}`);
            $('#overlay').css('display', 'block').addClass('animate__animated  animate__slideInLeft animate__delay-0s');
        },
        closeNewOverlay: function () {
            $('#overlay').removeClass('animate__animated  animate__slideInLeft animate__delay-0s').hide();
            $('.loader').html('');
        },
        getItemStore: function (key) {
            return $.cookie(key);
        },
        setItemStore: function (key, value) {
            $.cookie(key, value, {expires: 7, path: '/'});
        },
        deleteItemStore: function (key) {
            $.removeCookie(key);
        },

        geoIPLookUp: function () {
            return new Promise((reject, resolve) => {
                $.get("http://ipinfo.io", function () {
                }, "jsonp").always(function (resp) {
                    var countryCode = (resp && resp.country) ? resp.country : "";
                    console.log('Country Code - ', countryCode);
                    resolve(countryCode);
                });
            });
        }
    });

}(window.jQuery, window, document));