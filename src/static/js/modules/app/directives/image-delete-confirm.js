module.directive('imageDeleteConfirm', ['$timeout', 'Event', function ($timeout, Event) {
    return {
        restrict: 'E',
        templateUrl: 'partials/image-delete-confirm.html',
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
                $('body,html').css('overflow', '');
            }

            scope.close = function () {
                close();

            };

            scope.$on(Event.ImageDeleteConfirm.Dismiss, function () {
                close();
            });

            scope.$on(Event.ImageDeleteConfirm.Display, function (event, images, callback) {
                scope.animation = 'fadeIn';
                scope.display = true;
                scope.callback = callback;
                scope.images = images;
                $('body,html').css('overflow', 'hidden');
                scope.setHeight();
            });

            scope.setHeight = function () {
                if ($(window).height() < $('.delete-image-popup').height() + 150) {
                    var height = $(window).height() - 150;
                    if (height > 600) {
                        height = 600;
                    }
                    var half_height = height / 2;
                    $('.delete-image-popup .images').height(height);
                    $('.delete-image-popup').css('margin-top', -(half_height + 20) + 'px');
                }
                else {
                    $('.delete-image-popup .images').height(430);
                }
            };

            $(window).resize(scope.setHeight);
        }
    };
}]);