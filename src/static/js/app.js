'use strict';
var max_try = 20;
var tries = 0;
var module = angular.module('app', ['ngAnimate', 'ngCookies', 'ui.router']);
module.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
    window.carcare = {};
});
var app = {
    init: function () {
        if (typeof FB === "undefined") {
            if (tries < max_try) {
                tries++;
                setTimeout(app.init, 500);
            }
            else {
                angular.bootstrap(document, ['app']);
            }
        }
        else {
            FB.init({
                appId: '1722927571299619',
                xfbml: true,
                version: 'v2.7'
            });
            angular.bootstrap(document, ['app']);
        }
        recursiveFooter();
    }
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
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
function recursiveFooter () {
    var count = 0;
    var max = 20;
    countFooter(count, max);
}
function countFooter(count, max) {
    setTimeout(function () {
        if (count < max) {
            count++
            footer();
            countFooter(count, max);
        }
    }, 250);
}
function footer() {
    var window_height = $(window).height();
    var body_height = $('body').height() + 150;
    if (window_height > body_height) {
        $('footer').css('position', 'fixed');
    }
    else {
        $('footer').css('position', 'relative');
    }
}