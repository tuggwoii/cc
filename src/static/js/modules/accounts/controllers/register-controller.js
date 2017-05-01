'use strict';
module.controller('RegisterController', ['$scope', '$rootScope', 'AccountService', 'Event', function ($scope, $rootScope, AccountService, Event) {

    $scope.model = {};
    $scope.status = {};
    $scope.captcha = {};
    $scope.registerPage = function () {
        AccountService.captcha().then(function (res) {
            $scope.captcha = res.data.data;
            $scope.model.key = $scope.captcha.key;
        }).catch(function () {

        }).finally(function () {
            $scope.displayView();
        });
        
    };

    $scope.submit = function (form) {
        $scope.status = {};
        angular.forEach(form.$error.required, function (field) {
            field.$setDirty();
        });
        $scope.is_submit = true;
        if (form.$valid && $scope.model.password === $scope.model.confirm_password && $scope.model.captcha === $scope.captcha.captcha) {
            $rootScope.$broadcast(Event.Load.Display);
            AccountService.register($scope.model)
                .then(function (res) {
                    AccountService.setAuthenticationToken(res.data);
                    window.location.href = '/';
                    $rootScope.$broadcast(Event.Load.Dismiss);
                })
                .catch(function (res) {
                    if (res.status === 400 && res.data && res.data.error && res.data.error.message && res.data.error.message.toLowerCase() === 'email exist') {
                        $scope.status.exist = true;
                    }
                    else {
                        $scope.status.error = true;
                    }
                    $rootScope.$broadcast(Event.Load.Dismiss);
                });
        }
    };

    $scope.keyPress = function (event, form) {
        if (event.keyCode === 13) {
            $scope.submit(form);
        }
    };

    $scope.registerPage();

}]);
