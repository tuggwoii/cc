'use strict';
var module = angular.module('app', ['ngAnimate', 'ngCookies', 'ui.router']);
module.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
    window.carcare = {};
});
var app = {
    init: function () {
        if (typeof FB === "undefined") {
            setTimeout(function () {
                app.init();
            }, 1000);
        }
        else {
            FB.init({
                appId: '1722927571299619',
                xfbml: true,
                version: 'v2.6'
            });
            angular.bootstrap(document, ['app']);
        }
    },
    debug: true
};
$(document).ready(function () {
    app.init();
});
$(window).resize(function () {
    footer();
});
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function footer() {
    var window_height = $(window).height();
    var body_height = $('body').height() + 150;
    if (window_height > body_height) {
        $('footer').css('position', 'fixed');
    }
    else {
        $('footer').css('position', 'relative');
    }
    $('footer').css('display', 'block');
}
Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};