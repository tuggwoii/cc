'use strict';
module.controller('SettingsController', ['$scope', '$rootScope', '$timeout', '$q', 'SettingsService', 'Event',
    function ($scope, $rootScope, $timeout, $q, SettingsService, Event) {

    $scope.status = {
        loading: false
    };

    $scope.exp_car = {
        m: 0,
        y: 0
    }

    $scope.model = {
        m: 0,
        y: 0
    };

    function loadResources() {
        $q.all([
            loadSettings()
        ]).then(function () {
            $scope.displayView();
        });
    }

    function serialize(data) {
        return {
            id: data.id,
            m: data.exp_month,
            y: data.exp_year
        };
    }

    function loadSettings () {
        return $q(function (r, j) {
            SettingsService.get().then(function (res) {
                if (app.debug) {
                    console.log('GET SETTINGS', res);
                }
                $scope.model = serialize(res);
                r();
            }).catch(function () {
                alert('CAN NOT LOAD SETTINGS');
                j();
            });
        });
    }


    function isValid() {
        return $scope.user && $scope.user.id && $scope.user.role.id == 1;
    }

    function settingsPage() {
        if ($scope.user_ready) {
            if (isValid()) {
                loadResources();
            }
            else {
                window.location.hash = '/admin#!/';
            }
        }
        else {
            $timeout(function () {
                settingsPage();
            }, 1000);
        }
    };

    $scope.update = function () {
        $rootScope.$broadcast(Event.Load.Display);
        SettingsService.update($scope.model).then(function () {
            $rootScope.$broadcast(Event.Load.Dismiss);
        });
    };

    $scope.set = function () {
        $rootScope.$broadcast(Event.Confirm.Display, function () {
            $rootScope.$broadcast(Event.Load.Display);
            SettingsService.setAllCar($scope.exp_car).then(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
            });
        }, 'ยืนยันการเพิ่มวันหมดอายุให้รถทุกคันหรือไม่?');
    };

    settingsPage();
}]);
