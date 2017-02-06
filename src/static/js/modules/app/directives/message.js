module.directive('message', ['$timeout', 'Event', function ($timeout, Event) {
    return {
        restrict: 'E',
        templateUrl: '/partials/message.html',
        scope: {

        },
        link: function (scope, element, attrs) {

            scope.display = false;

            function close() {
                $timeout(function () {
                    scope.animation = 'fadeOut';
                }, 150);
                $timeout(function () {
                    scope.display = false;
                }, 1000);
            }

            scope.$on(Event.Message.Dismiss, function () {
                close();
            });

            scope.$on(Event.Message.Display, function (event, message, callback) {
                scope.animation = 'fadeIn';
                scope.display = true;
                scope.callback = callback;
                if (!message) {
                    scope.message = '[NO MESSAGE]';
                }
                else {
                    scope.message = message;
                }
                scope.accept = function () {
                    if (scope.callback) {
                        scope.callback();
                    }
                    close();
                }
            });
        }
    };
}]);