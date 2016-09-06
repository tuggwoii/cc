'use strict';
module.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('index', {
          url: "/",
          templateUrl: "partials/index.html"
      }).state('register', {
          url: "/register",
          templateUrl: "partials/register.html"
      }).state('account', {
          url: "/account",
          templateUrl: "partials/account.html"
      }).state('update-account', {
          url: "/update-account",
          templateUrl: "partials/update-account.html"
      }).state('car', {
          url: "/car",
          templateUrl: "partials/car.html"
      }).state('editcar', {
          url: "/edit-car",
          templateUrl: "partials/edit-car.html"
      }).state('newcar', {
          url: "/new-car",
          templateUrl: "partials/new-car.html"
      }).state('notifications', {
          url: "/notifications",
          templateUrl: "partials/notifications.html"
      }).state('notification', {
          url: "/notification",
          templateUrl: "partials/notification.html"
      }).state('editnotification', {
          url: "/edit-notification",
          templateUrl: "partials/edit-notification.html"
      }).state('newnotification', {
          url: "/new-notification",
          templateUrl: "partials/new-notification.html"
      }).state('repairs', {
          url: "/repairs",
          templateUrl: "partials/repairs.html"
      }).state('repair', {
          url: "/repair",
          templateUrl: "partials/repair.html"
      }).state('shares', {
          url: "/shares",
          templateUrl: "partials/shares.html"
      }).state('new-repair', {
          url: "/new-repair",
          templateUrl: "partials/new-repair.html"
      }).state('edit-repair', {
          url: "/edit-repair",
          templateUrl: "partials/edit-repair.html"
      }).state('edit-shop', {
          url: "/edit-shop",
          templateUrl: "partials/edit-shop.html"
      });
});