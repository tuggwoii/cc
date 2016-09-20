module.directive('shopPopup', ['$timeout', '$rootScope', 'Event', 'ShopService', function ($timeout, $rootScope, Event, ShopService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/shop-popup.html',
        scope: {

        },
        link: function (scope, element, attrs) {
            scope.provinces = [];
            function createProvinces() {
                angular.forEach(areas, function (area) {
                    angular.forEach(area.areas, function (p) {
                        scope.provinces.push(p);
                    });
                });
            }

            function initShop(shops) {
                angular.forEach(shops, function (s) {
                    angular.forEach( scope.provinces, function (p) {
                        if (s.province == p.key) {
                            s.province_str = p.th;
                        }
                    })
                });
            }

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
                                initShop(scope.shops);
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

            scope.$on(Event.Shop.DisplayPopup, function (event, prev_shops, callback) {
                if (!scope.display) {
                    scope.animation = 'fadeIn';
                    $timeout.cancel(scope.shopSearchTask);
                    scope.shopSearchTask = {};
                    scope.trySearch = false;
                    scope.display = true;
                    scope.search = {};
                    scope.trySearch = false;
                    scope.onSearchShop = false;
                    scope.prev_shops = prev_shops;
                    scope.callback = callback;
                    scope.shop = {
                        selected: ''
                    }
                    $timeout(scope.setHeight, 200);
                }
            });

            scope.setHeight = function () {
                if ($(window).height() < $('.shoppopup').height() + 150) {
                    var height = $(window).height() - 150;
                    if (height > 600) {
                        height = 600;
                    }
                    var half_height = height / 2;
                    $('.shoppopup').height(height);
                    $('.shoppopup').css('margin-top', -(half_height + 20) + 'px');
                }
                else {
                    $('.shoppopup').height(600);
                }
            };

            scope.shopChange = function () {
                if (scope.shop.selected) {
                    var selected_shop = JSON.parse(scope.shop.selected);
                    if (selected_shop.id) {
                        scope.close();
                        scope.callback(selected_shop);
                    }
                }
            };

            createProvinces();
            $(window).resize(scope.setHeight);
        }
    };
}]);