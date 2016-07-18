'use strict';
module.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('index', {
          url: "/",
          templateUrl: "partials/index.html"
      })
      .state('login', {
          url: "/login",
          templateUrl: "partials/login.html"
      }).state('register', {
          url: "/register",
          templateUrl: "partials/register.html"
      }).state('account', {
          url: "/account",
          templateUrl: "partials/account.html"
      }).state('car', {
          url: "/car",
          templateUrl: "partials/car.html"
      }).state('notifications', {
          url: "/notifications",
          templateUrl: "partials/notifications.html"
      }).state('notification', {
          url: "/notification",
          templateUrl: "partials/notification.html"
      }).state('repairs', {
          url: "/repairs",
          templateUrl: "partials/repairs.html"
      }).state('repair', {
          url: "/repair",
          templateUrl: "partials/repair.html"
      }).state('shares', {
          url: "/shares",
          templateUrl: "partials/shares.html"
      });
});