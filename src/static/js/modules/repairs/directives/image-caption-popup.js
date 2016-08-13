module.directive('imageCaptionPopup', ['$timeout', '$rootScope', 'Event', 'WorkService', function ($timeout, $rootScope, Event, WorkService) {
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
                    scope.animation = 'fadeIn';
                    scope.callback = callback;
                }
            });

            scope.save = function (form) {
                
            };
        }
    };
}]);