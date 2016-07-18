'use strict';
module.controller('SharesController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'ShareService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, ShareService, Event, Helper) {

        $scope.init = function () {

            $scope.currentPage = 1;
            $rootScope.$broadcast(Event.Load.Display, 'LOAD_SHARES');
            ShareService.get($scope.currentPage, 20).then(function (res) {
                $scope.shares = res.data;
                $scope.meta(res.meta);
                $rootScope.$broadcast(Event.Load.Dismiss, 'LOAD_SHARES');
            }).catch(function () {
                alert('ERROR');
                console.log('ERROR');
            });
        };

        $scope.meta = function (meta) {
            if (meta.limits * $scope.currentPage < meta.count) {
                $scope.hasMore = true;
            }
            else {
                $scope.hasMore = false;
            }
        };

        $scope.loadMore = function () {
            $scope.currentPage++;
            $rootScope.$broadcast(Event.Load.Display, 'LOAD_SHARES');
            ShareService.get($scope.currentPage, 20).then(function (res) {
                $scope.shares = $scope.shares.concat(res.data);
                $scope.meta(res.meta);
                $rootScope.$broadcast(Event.Load.Dismiss, 'LOAD_SHARES');
            }).catch(function () {
                alert('ERROR');
                console.log('ERROR');
                $rootScope.$broadcast(Event.Load.Display, 'LOAD_SHARES');
            });
        }

        $scope.init();
    }]);
