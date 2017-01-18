module.directive('createShopPopup', ['$timeout', '$rootScope', 'Event', 'ShopService', function ($timeout, $rootScope, Event, ShopService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/shop-create-popup.html',
        scope: {

        },
        link: function (scope, element, attrs) {
            
            var form;

            function initShop(shops) {
                angular.forEach(shops, function (s) {
                    angular.forEach(scope.provinces, function (p) {
                        if (s.province == p.key) {
                            s.province_str = p.th;
                        }
                    })
                });
            }

            function setHeight() {
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

            scope.provinces = _provinces;

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
            };

            scope.provinceChange = function () {
                if (scope.search.key) {
                    scope.searchShop();
                }
            };

            scope.createShop = function () {
                scope.form_submit = true;
                if (form.$valid) {
                    $rootScope.$broadcast(Event.Load.Display);
                    ShopService.create(scope.model).then(function (res) {
                        $rootScope.$broadcast(Event.Load.Dismiss);
                        scope.close();
                        window.location.href = '/#/edit-shop?id=' + res.data.id + '&cd=true&fs=true';
                    }).catch(function () {
                        scope.close();
                        $rootScope.$broadcast(Event.Message.Display, 'สร้างร้านไม่ได้กรุณาลองใหม่อีกครั้ง');
                        $rootScope.$broadcast(Event.Load.Dismiss);
                    });
                }
            };

            scope.setFrom = function (_form) {
                form = _form;
            };

            scope.$on(Event.Shop.DisplayCreatePopup, function () {
                if (!scope.display) {
                    scope.animation = 'fadeIn';
                    scope.display = true;
                    scope.model = {
                        name: '',
                        province: 'krung_thep_maha_nakhon'
                    };
                    $timeout(setHeight, 200);
                }
            });

            $(window).resize(setHeight);
        }
    };
}]);