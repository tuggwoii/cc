'use strict';
var module = angular.module('app', ['ngAnimate', 'ngCookies', 'ui.router']);
module.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
    window.cheepow = {};
});
var app = {
    init: function () {
        window.fbAsyncInit = function () {
            FB.init({
                appId: '1755533787992799',
                xfbml: true,
                version: 'v2.6'
            });
            angular.bootstrap(document, ['app']);
        };
    }
};
$(document).ready(function () {
    app.init();
});
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
