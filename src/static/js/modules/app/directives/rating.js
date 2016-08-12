module.directive('giveRating', ['$timeout', function ($timeout) {
    var ratings = ['ไม่ระบุ', 'แย่มาก', 'แย่', 'พอได้', 'ดี', 'ดีมาก']
    return {
        restrict: 'E',
        templateUrl: '/partials/rating.html',
        scope: {
            rating: '=rating',
            callback: '=callback'
        },
        link: function (scope, element, attrs) {
            scope.$watch('rating', function (newValue, oldValue) {
                var text_index = 0;
                if (newValue) {
                    text_index = newValue
                }
                scope.text = ratings[text_index];
            }, true);
        }
    };
}]);