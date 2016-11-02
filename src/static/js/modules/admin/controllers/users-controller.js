'use strict';
module.controller('UsersController', ['$scope', '$timeout', '$q', 'AccountService', 'Helper',
function ($scope, $timeout, $q, AccountService, Helper) {

    $scope.query = {
        p: 1,
        q: '',
        e: '',
        r: ''
    };

    $scope.status = {
        loading: false
    };

    function loadResources() {
        $q.all([
            AccountService.getAll($scope.query).then(function (res) {
                if (app.debug) {
                    console.log('GET USERS', res);
                }
                $scope.users = res.data;
                initModel($scope.users);
            }).catch(function () {
                alert('CAN NOT LOAD USERS');
            })
        ]).then(function () {
            $scope.displayView();
        });
    }

    function isValid() {
        return $scope.user && $scope.user.id && $scope.user.role.id == 1;
    }

    function initModel(users) {
        angular.forEach(users, function (u) {
            u.register_date = Helper.readableDate(u.createdAt);
        });
    }

    $scope.search = function () {
        $scope.status.loading = true;
        AccountService.getAll($scope.query).then(function (res) {
            if (app.debug) {
                console.log('GET USERS', res);
            }
            $scope.users = res.data;
            $timeout(function () {
                $scope.status.loading = false;
            }, 500);
        }).catch(function () {
            alert('CAN NOT LOAD USERS');
            $timeout(function () {
                $scope.status.loading = false;
            }, 500);
        })
    };

    $scope.usersPage = function () {
        if ($scope.user_ready) {
            if (isValid()) {
                loadResources();
            }
            else {
                window.location.hash = '/admin#/';
            }
        }
        else {
            $timeout(function () {
                $scope.usersPage();
            }, 1000);
        }
    };

    $scope.usersPage();
}]);
