module.directive('notificationPopup', ['$timeout', '$rootScope', 'Event', 'NotificationService', 'WorkService', 'Helper', function ($timeout, $rootScope, Event, NotificationService, WorkService, Helper) {
    return {
        restrict: 'E',
        templateUrl: '/partials/notification-popup.html',
        scope: {

        },
        link: function (scope, element, attrs) {

            scope.dates = Helper.dateArray();
            scope.months = Helper.monthArray();

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
                $('body,html').css('overflow-y', 'auto');
            }

            scope.$on(Event.Notification.DisplayPopup, function (event, model, strings, works, callback) {
                if (!scope.display) {
                    $('body,html').css('overflow-y', 'hidden');
                    scope.display = true;
                    scope.error = false;
                    scope.model = angular.copy(model);
                    scope.strings = strings;
                    scope.animation = 'fadeIn';
                    scope.works = angular.copy(works);
                    scope.callback = callback;
                    $timeout(scope.setHeight, 200);
                }
            });

            scope.setHeight = function () {
                if ($(window).height() < $('.notification').height() + 150) {
                    var height = $(window).height() - 150;
                    if (height > 580) {
                        height = 580;
                    }
                    var half_height = height / 2;
                    $('.notification').height(height);
                    $('.notification').css('margin-top', -(half_height + 20) + 'px');
                }
                else {
                    $('.notification').height(580);
                }
            };

            scope.add = function (form) {
                scope.status = {};
                angular.forEach(form.$error.required, function (field) {
                    field.$setDirty();
                });
                if (form.$valid) {
                    if ((scope.model.day && scope.model.month && scope.model.year && !isNaN(parseInt(scope.model.year)) || scope.model.type == 2) && scope.model.car) {
                        $rootScope.$broadcast(Event.Load.Display);
                        if (scope.model.type != 2) {
                            scope.model.date = new Date(parseInt(scope.model.year - 543), parseInt(scope.model.month) - 1, scope.model.day);
                        }
                        NotificationService.create(scope.model).then(function (res) {
                            scope.callback();
                            scope.close();
                        }).catch(function (res) {
                            if (res.error.message == 'CAR EXPIRE') {
                                scope.status.car_expire = true;
                            }
                            else {
                                scope.status.error = true;
                            }
                            $rootScope.$broadcast(Event.Load.Dismiss);
                        });
                    }
                    else {
                        if (!scope.model.car) {
                            scope.status.car = true;
                        }
                        if (isNaN(parseInt(scope.model.year)) && scope.model.type != 2) {
                            scope.status.invalid_year = true;
                        }
                        scope.status.invalid = true;
                    }
                }
                else {
                    scope.status.invalid = true;
                }
            };

            $(window).resize(scope.setHeight);
        }
    };
}]);