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
                    var url = decodeURIComponent(location.href).replace('http://127.0.0.1:8000', '');
                    url = url.replace('http://localhost:8000', '');
                    url = url.replace('http://www.carcarenote.com','');
                    url = url.replace('http://carcarenote.com', '');
                    url = url.split('?')[0];
                    url = url.replace('#!', '');
                    if (url == m.url) {
                        m.isActive = true;
                    }
                });
            });
        };
        
        $scope.nav();
    }]);
