﻿'use strict';
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
    }
};
$(document).ready(function () {
    app.init();
});
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
