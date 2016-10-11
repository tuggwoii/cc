'use strict';
module.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('index', {
          url: "/",
          templateUrl: "backend/dashboard.html"
      }).state('users', {
          url: "/users",
          templateUrl: "backend/users.html"
      }).state('user', {
          url: "/user",
          templateUrl: "backend/user.html"
      }).state('works', {
          url: "/works",
          templateUrl: "backend/works.html"
      }).state('cars', {
          url: "/cars",
          templateUrl: "backend/cars.html"
      }).state('pages', {
          url: "/pages",
          templateUrl: "backend/pages.html"
      }).state('page', {
          url: "/page",
          templateUrl: "backend/page.html"
      }).state('editpage', {
          url: "/edit-page",
          templateUrl: "backend/page-edit.html"
      }).state('editcar', {
          url: "/edit-car",
          templateUrl: "backend/car-edit.html"
      }).state('payment', {
          url: "/payment",
          templateUrl: "backend/payment.html"
      }).state('editpayment', {
          url: "/edit-payment",
          templateUrl: "backend/payment-edit.html"
      });
});