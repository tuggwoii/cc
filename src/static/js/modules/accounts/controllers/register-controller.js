'use strict';
module.controller('RegisterController', ['$scope', 'AccountService', function ($scope, AccountService) {

    $scope.model = {};
    $scope.status = {};

    $scope.onLoad = function () {
       
    };

    $scope.submit = function (form) {
        $scope.status = {};
        angular.forEach(form.$error.required, function (field) {
            field.$setDirty();
        });
        if (form.$valid && $scope.model.password === $scope.model.confirm_password) {
           // NotificationService.loading();
            
            AccountService.register($scope.model)
                .success(function (res) {
                    AccountService.setAuthenticationToken(res);
                    window.location.href = '/';
                    //NotificationService.stopLoading();
                })
                .error(function (ressponse, status) {
                    if (status === 400 && ressponse.error.message.toLowerCase() === 'email exist') {
                        $scope.status.exist = true;
                    }
                    else {
                        $scope.status.error = true;
                    }
                    //NotificationService.stopLoading();
                });
        }
    };

    $scope.onLoad();

}]);
