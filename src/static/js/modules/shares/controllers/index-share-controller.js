'use strict';
module.controller('IndexShareController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'ShareService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, ShareService, Event, Helper) {

        $scope.init = function () {
            ShareService.get(1, 12).then(function (res) {
                $scope.shares = res.data;
            }).catch(function () {
                alert('ERROR');
                console.log('ERROR');
            });
        };

        $scope.init();
}]);
