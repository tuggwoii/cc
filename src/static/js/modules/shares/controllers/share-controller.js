'use strict';
module.controller('ShareController', ['$scope',
    function ($scope) {

        var lightbox = lity();

        $scope.loadShare = function () {
            $scope.displayView();
        };

        $scope.lightbox = function (url) {
            lightbox(url);
        };

        $scope.loadShare();
        
    }]);
