'use strict';
module.controller('NavController', ['$scope', 'PageService',
    function ($scope, PageService) {

        $scope.nav = function () {
            $scope.menu = [];
            PageService.getAll().then(function (res) {
                $scope.items = res.data;
                angular.forEach($scope.items, function (m) {
                    if (m.isMenu && !m.isSys) {
                        $scope.menu.push(m);
                    }
                    if (location.href.indexOf(m.url) > -1) {
                        m.isActive = true;
                    }
                });
            });
        };
        
        $scope.nav();
    }]);
