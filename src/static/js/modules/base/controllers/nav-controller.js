'use strict';
module.controller('NavController', ['$scope', '$cookies', 'AccountService', 'NotificationService', 'UIService', function ($scope, $cookies, AccountService, NotificationService, UIService) {

    $scope.onLoad = function () {
        $scope.loadNavigations();
    };

    $scope.loadNavigations = function () {
        UIService.getNavigations().success(function (response) {
            $scope.navs = response.data;
            $scope.setMenuActive();
        });
    };

    $scope.logout = function () {
        NotificationService.loading();
        AccountService.logout().success(function () {
            $cookies.remove('Authorization');
            window.location.href = '/login';
        }).error(function () {
            $cookies.remove('Authorization');
            window.location.href = '/login';
        }).finally(function () {
            NotificationService.stopLoading();
        });
    };

    $scope.setMenuActive = function () {
        angular.forEach($scope.navs, function (item) {
            var url = item.url.replace('dashboard#/','').slice(0, -1);
            if (window.location.hash.indexOf(url) > -1 && (window.location.hash != '' && window.location.hash != '#/')) {
                item.active = true;
            }
            else {
                item.active = false;
            }
        });
        if ($scope.navs) {
            if (window.location.hash == '' || window.location.hash == '#/') {
                $scope.navs[0].active = true;
            }
            else {
                $scope.navs[0].active = false;
            }
        }
    };

    $scope.$watch(function () {
        return location.hash;
    }, function () {
        $scope.setMenuActive();
    });

    $scope.onLoad();

}]);
