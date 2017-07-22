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
        y: 0,
        bm: 0,
        by: 0,
        bmb: 0
    };

    $scope.space = {
        size: 0
    };

    $scope.emails = [];

    function splitEmails(emails) {
        if (emails) {
            var _emails = emails.split(',');
            for (var i = 0; i < _emails.length; i++) {
                if (_emails[i]) {
                    $scope.emails.push({ key: i, val: _emails[i] });
                }
            }
        }
        if ($scope.emails.length == 0) {
            $scope.emails.push({ key: i, val: '' });
        }
    }

    function collectEmail() {
        var _emails = '';
        for (var i = 0; i < $scope.emails.length; i++) {
            if ($scope.emails[i].val) {
                _emails += $scope.emails[i].val + ',';
            }
        }
        return _emails;
    }

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
            y: data.exp_year,
            admin_emails: data.admin_emails,
            by: data.begin_exp_year,
            bm: data.begin_exp_month,
            bmb: data.begin_space
        };
    }

    function loadSettings () {
        return $q(function (r, j) {
            SettingsService.get().then(function (res) {
                if (app.debug) {
                    console.log('GET SETTINGS', res);
                }
                $scope.model = serialize(res);
                splitEmails($scope.model.admin_emails);
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

    $scope.addEmail = function () {
        $scope.emails.push({ key: $scope.emails.length, val: '' });
    };

    $scope.removeEmail = function (index) {
        $scope.emails.splice(index, 1);
    };

    $scope.update = function () {
        $rootScope.$broadcast(Event.Load.Display);
        $scope.model.admin_emails = collectEmail();
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

    $scope.setSize = function () {
        $rootScope.$broadcast(Event.Confirm.Display, function () {
            $rootScope.$broadcast(Event.Load.Display);
            SettingsService.setAllCarSpace($scope.space).then(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
            });
        }, 'ยืนยันการเพิ่มพื้นที่เก็บไฟล์ให้รถทุกคันหรือไม่?');
    };

    settingsPage();
}]);
