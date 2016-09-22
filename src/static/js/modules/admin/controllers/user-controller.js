'use strict';
module.controller('UserController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'Helper', 'AccountService', 'Event',
function ($scope, $rootScope, $timeout, $q, $location, Helper, AccountService, Event) {

    $scope.params = $location.search();

    $scope.status = {
        loading: false
    };

    function loadResources() {
        $q.all([
            AccountService.getById($scope.params.id).then(function (res) {
                if (app.debug) {
                    console.log('GET USER', res);
                }
                $scope.model = res.data;
                initModel();
            }).catch(function () {
                alert('CAN NOT LOAD USER');
            })
        ]).then(function () {
            $scope.displayView();
        });
    }

    function initModel() {
        $scope.model.register_date = Helper.readableDateTime($scope.model.createdAt);
        $scope.model.user_role = $scope.model.user_role + '';
    }

    function isValid() {
        return $scope.user && $scope.user.id && $scope.user.role.id == 1 && $scope.params.id;
    }

    $scope.userPage = function () {
        if ($scope.user_ready) {
            if (isValid()) {
                loadResources();
            }
            else {
                window.location.href = '/';
            }
        }
        else {
            $timeout(function () {
                $scope.userPage();
            }, 1000);
        }
    };

    $scope.save = function (form) {
        angular.forEach(form.$error.required, function (field) {
            field.$setDirty();
        });
        $scope.status = {};
        if (form.$valid && !isNaN(parseInt($scope.model.max_car))) {
           
            $rootScope.$broadcast(Event.Load.Display);
            AccountService.save($scope.model).then(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
                $scope.status.success = true;
                $timeout(function () {
                    $scope.status.success = false;
                }, 5000);
            }).catch(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
                alert('SAVE USER ERROR');
            });
        }
        else {
            $scope.status.invalid = true;
            if(isNaN(parseInt($scope.model.max_car))){
                $scope.status.invalid_car_number = true;
            }
        }
        
    };

    $scope.userPage();
}]);
