module.directive('workPopup', ['$timeout', '$rootScope', 'Event', 'WorkService', function ($timeout, $rootScope, Event, WorkService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/work-popup.html',
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

            scope.$on(Event.Work.DisplayPopup, function (event, model, works, callback) {
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
                    $rootScope.$broadcast(Event.Load.Display);
                    if (!scope.work.id) {
                        WorkService.create(scope.work).then(function () {
                            //$rootScope.$broadcast(Event.Load.Dismiss);
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
        }
    };
}]);