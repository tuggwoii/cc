'use strict';
module.controller('RegisterController', ['$scope', '$rootScope', 'AccountService', 'Event', function ($scope, $rootScope, AccountService, Event) {

    $scope.model = {};
    $scope.status = {};
    $scope.captcha = {};
    $scope.registerPage = function () {
        AccountService.captcha().success(function (res) {
            $scope.captcha = res.data;
            $scope.model.key = $scope.captcha.key;
        }).error(function () {

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
                .success(function (res) {
                    AccountService.setAuthenticationToken(res);
                    window.location.href = '/';
                    $rootScope.$broadcast(Event.Load.Dismiss);
                })
                .error(function (ressponse, status) {
                    if (status === 400 && ressponse.error.message.toLowerCase() === 'email exist') {
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
