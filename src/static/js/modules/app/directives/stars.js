module.directive('ratingStar', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: '/partials/stars.html',
        scope: {
            rating:'=rating'
        },
        link: function (scope, element, attrs) {
           
        }
    };
}]);