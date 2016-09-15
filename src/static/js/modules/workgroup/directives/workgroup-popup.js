module.directive('workgroupPopup', ['$timeout', '$rootScope', 'Event', 'WorkgroupService', function ($timeout, $rootScope, Event, WorkgroupService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/workgroup-popup.html',
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
                    $('body').css('overflow-y', 'auto');
                }
            }

            scope.$on(Event.Workgroup.DisplayWorkgroupPopup, function (event, model, callback) {
                if (!scope.display) {
                    scope.display = true;
                    scope.error = false;
                    scope.animation = 'fadeIn';
                    scope.work = angular.copy(model);
                    scope.callback = callback;
                    $('body').css('overflow-y', 'hidden');
                }
            });

            scope.save = function (form) {
                angular.forEach(form.$error.required, function (field) {
                    field.$setDirty();
                });
                if (form.$valid) {
                    $rootScope.$broadcast(Event.Load.Display);
                    var action = scope.work.id? 'update' : 'create';
                    WorkgroupService[action](scope.work).then(function () {
                        scope.close();
                        scope.callback();
                    }).catch(function () {
                        $rootScope.$broadcast(Event.Load.Dismiss);
                        scope.error = true;
                    });
                }
            };
        }
    };
}]);