module.directive('workPopup', ['$timeout', '$rootScope', 'Event', 'WorkService', function ($timeout, $rootScope, Event, WorkService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/work-popup.html',
        scope: {

        },
        link: function (scope, element, attrs) {

            function getWorkGroupById(works, id) {
                var group;
                angular.forEach(works, function (w) {
                    if (w.id == id) {
                        group = w;
                    }
                });
                return group.name;
            }

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

            scope.$on(Event.Work.DisplayPopup, function (event, model, works, shop, callback) {
                if (!scope.display) {
                    scope.display = true;
                    scope.error = false;
                    scope.animation = 'fadeIn';
                    scope.work = angular.copy(model);
                    scope.work.shop = shop;
                    scope.works = works;
                    scope.callback = callback;
                    $timeout(scope.setHeight, 200);
                }
            });

            scope.setHeight = function () {
                if ($(window).height() < $('.workpopup').height() + 150) {
                    var height = $(window).height() - 150;
                    if (height > 600) {
                        height = 600;
                    }
                    var half_height = height / 2;
                    $('.workpopup').height(height);
                    $('.workpopup').css('margin-top', -(half_height + 20) + 'px');
                }
                else {
                    $('.workpopup').height(600);
                }
            };

            scope.save = function (form) {
                angular.forEach(form.$error.required, function (field) {
                    field.$setDirty();
                });
                if (form.$valid) {
                    $rootScope.$broadcast(Event.Load.Display);
                    scope.work.group = getWorkGroupById(scope.works, scope.work.work);
                    if (!scope.work.id) {
                        WorkService.create(scope.work).then(function () {
                            scope.close();
                            scope.callback();
                        }).catch(function () {
                            $rootScope.$broadcast(Event.Load.Dismiss);
                            scope.error = true;
                        });
                    }
                    else {
                        WorkService.update(scope.work).then(function () {
                            $rootScope.$broadcast(Event.Load.Dismiss);
                            scope.close();
                            scope.callback();
                        }).catch(function () {
                            $rootScope.$broadcast(Event.Load.Dismiss);
                            scope.error = true;
                        });
                    }
                }
            };

            $(window).resize(scope.setHeight);
        }
    };
}]);