module.directive('imageCaptionPopup', ['$timeout', '$rootScope', 'Event', 'RepairService', function ($timeout, $rootScope, Event, RepairService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/image-caption-popup.html',
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

            scope.$on(Event.Repair.DisplayCaptionPopup, function (event, model, callback) {
                if (!scope.display) {
                    scope.display = true;
                    scope.error = false;
                    scope.animation = 'fadeIn';
                    scope.model = angular.copy(model);
                    scope.callback = callback;
                }
            });

            scope.save = function (form) {
                $rootScope.$broadcast(Event.Load.Display);
                RepairService.saveImage(scope.model).then(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                    scope.callback(scope.model);
                    scope.close();
                }).catch(function () {
                    scope.error = true;
                    $rootScope.$broadcast(Event.Load.Dismiss);
                });
            };
        }
    };
}]);