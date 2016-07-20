module.directive('load', ['$timeout', 'Event', function ($timeout, Event) {
    return {
        restrict: 'E',
        templateUrl: '/partials/load.html',
        scope: {
            
        },
        link: function (scope, element, attrs) {
            scope.display = true;
            scope.task = [];

            scope.$on(Event.Load.Dismiss, function (event, task) {
                var index = scope.task.indexOf(task);
                scope.task.splice(index, 1);
                if (scope.task == 0) {
                    $timeout(function () {
                        scope.animation = 'fadeOut';
                    }, 500);
                    $timeout(function () {
                        scope.display = false;
                    }, 1500);
                }
            });

            scope.$on(Event.Load.Display, function (event, task) {
                scope.animation = 'fadeIn';
                scope.display = true;
                var index = scope.task.indexOf(task);
                if (task && index == -1) {
                    scope.task.push(task);
                }
                else {
                    console.error('NO TASK NAME');
                }
            });
        }
    };
}]);