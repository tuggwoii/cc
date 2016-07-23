'use strict';
module.controller('ShareController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'ShareService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, ShareService, Event, Helper) {

        $scope.dateTime = function (date) {
            console.log(date);
            return Helper.readableDateTime(date);
        }
        
    }]);
