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
      }).state('works', {
          url: "/works",
          templateUrl: "backend/works.html"
      }).state('cars', {
          url: "/cars",
          templateUrl: "backend/cars.html"
      });
});