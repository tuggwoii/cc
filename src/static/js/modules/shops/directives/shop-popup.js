module.directive('shopPopup', ['$timeout', '$rootScope', 'Event', 'ShopService', function ($timeout, $rootScope, Event, ShopService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/shop-popup.html',
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

            scope.shopSearchTask = {};
            scope.search = {};
            scope.searchShop = function () {
                $timeout.cancel(scope.shopSearchTask);
                scope.trySearch = false;
                if (scope.search.key) {
                    if (!scope.onSearchShop) {
                        scope.shopSearchTask = $timeout(function () {
                            scope.onSearchShop = true;
                            ShopService.getAll(scope.search.key).then(function (res) {
                                scope.shops = res.data;
                                $timeout(function () {
                                    scope.onSearchShop = false;
                                    scope.trySearch = true;
                                    $timeout(function () {
                                        $('#searchShop').focus();
                                    }, 200);
                                }, 500);
                            });
                        }, 1500);
                    }
                }
                else {
                    scope.shops = [];
                }
            };

            scope.createShop = function () {
                $rootScope.$broadcast(Event.Confirm.Display, function () {
                    $rootScope.$broadcast(Event.Load.Display, 'SAVE_SHOP');
                    ShopService.create({ name: scope.search.key }).then(function (res) {
                        console.log(res.data);
                        $rootScope.$broadcast(Event.Load.Dismiss);
                        scope.close();
                        scope.callback(res.data);
                    }).catch(function () {
                        $rootScope.$broadcast(Event.Load.Dismiss);
                        alert('CREATE SHOP ERROR');
                    });
                }, 'คุณแน่ใจที่จะสร้างร้าน "' + scope.search.key + '" หรือไม่?');
            };

            scope.selectShop = function (shop) {
                scope.close();
                scope.callback(shop);
            };

            scope.$on(Event.Shop.DisplayPopup, function (event, callback) {
                if (!scope.display) {
                    scope.animation = 'fadeIn';
                    $timeout.cancel(scope.shopSearchTask);
                    scope.shopSearchTask = {};
                    scope.trySearch = false;
                    scope.display = true;
                    scope.search = {};
                    scope.trySearch = false;
                    scope.onSearchShop = false;
                    scope.callback = callback;
                }
            });


        }
    };
}]);