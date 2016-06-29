'use strict';
module.controller('RegisterController', ['$scope', '$rootScope', 'AccountService', 'Event', function ($scope, $rootScope, AccountService, Event) {

    $scope.model = {};
    $scope.status = {};

    $scope.onLoad = function () {
       
    };

    $scope.submit = function (form) {
        $scope.status = {};
        angular.forEach(form.$error.required, function (field) {
            field.$setDirty();
        });
        $scope.is_submit = true;
        if (form.$valid && $scope.model.password === $scope.model.confirm_password) {
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

    $scope.onLoad();

}]);
