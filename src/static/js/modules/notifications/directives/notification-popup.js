module.directive('notificationPopup', ['$timeout', '$rootScope', 'Event', 'WorkService', function ($timeout, $rootScope, Event, WorkService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/notification-popup.html',
        scope: {

        },
        link: function (scope, element, attrs) {

            scope.close = function () {
                if (scope.display) {
                    $timeout(function () {
                        scope.animation = 'fadeOut';
                    }, 10);
                    $timeout(function () {
                        scope.display = false;
                        $('body').focus();
                    }, 500);
                }
            }

            scope.$on(Event.Notification.DisplayPopup, function (event, strings, works, callback) {
                if (!scope.display) {
                    scope.display = true;
                    scope.error = false;
                    scope.animation = 'fadeIn';
                    scope.work = angular.copy(model);
                    scope.works = works;
                    scope.callback = callback;
                }
            });

            scope.save = function (form) {
                angular.forEach(form.$error.required, function (field) {
                    field.$setDirty();
                });
                if (form.$valid) {
                    if (($scope.model.day && $scope.model.month && $scope.model.year && !isNaN(parseInt($scope.model.year)) || $scope.model.type == 2) && $scope.model.car) {
                        $rootScope.$broadcast(Event.Load.Display);
                        if ($scope.model.type != 2) {
                            $scope.model.date = new Date(parseInt($scope.model.year - 543), parseInt($scope.model.month) - 1, $scope.model.day);
                        }
                        $scope.status = {};
                        NotificationService.create($scope.model).then(function (res) {
                            if ($scope.from_car) {
                                $scope.navigateTo('#/car?id=' + $scope.carId);
                            }
                            else {
                                $scope.navigateTo('#/notifications');
                            }
                        }).catch(function (res) {
                            if (res.error.message == 'CAR EXPIRE') {
                                $scope.status.car_expire = true;
                            }
                            else {
                                $scope.status.error = true;
                            }
                            $rootScope.$broadcast(Event.Load.Dismiss);
                        });
                    }
                    else {
                        if (!$scope.model.car) {
                            $scope.status.car = true;
                        }
                        if (isNaN(parseInt($scope.model.year)) && $scope.model.type != 2) {
                            $scope.status.invalid_year = true;
                        }
                        $scope.status.invalid = true;
                    }
                }
                else {
                    $scope.status.invalid = true;
                }
            };
        }
    };
}]);