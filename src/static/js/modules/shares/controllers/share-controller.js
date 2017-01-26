'use strict';
module.controller('ShareController', ['$scope', '$q', '$timeout', '$cookies', 'CarService', 'ShareService',
    function ($scope, $q, $timeout, $cookies, CarService, ShareService) {

        var lightbox = lity();
        var SHARES_KEY = 'SHRSID';

        $scope.provinces = _provinces;

        $scope.loadShare = function () {
            if ($scope.user_ready) {
                if ($scope.user && $scope.user.id) {
                    $q.all([
                       CarService.get().then(function (res) {
                           $scope.cars = angular.copy(res.data);
                       })
                    ]).then(function () {
                        $scope.displayView();
                        initScroll();
                    });
                }
                else {
                    $scope.displayView();
                    initScroll();
                }
                countView();
            }
            else {
                $timeout(function () {
                    $scope.loadShare();
                }, 200);
            }
        };

        function countView() {
            var id = $('#Id').attr('data-id');
            if (id) {
                var shares;
                if (typeof (Storage) !== "undefined") {
                    if (localStorage.getItem(SHARES_KEY)) {
                        try {
                            shares = JSON.parse(localStorage.getItem(SHARES_KEY));
                        }
                        catch(e) { }
                    }
                }
                else {
                    if ($cookies.get(SHARES_KEY)) {
                        shares = JSON.parse($cookies.get(SHARES_KEY));
                    }
                }
                if (shares) {
                    if (shares.ids && shares.ids.length) {
                        if (!shares.exp_date || shares.exp_date < new Date()) {
                            saveShareId(shares, id);
                            ShareService.countView(id)
                        }
                        else {
                            var exist = false;
                            angular.forEach(shares.ids, function (_id) {
                                if (_id == id) {
                                    exist = true;
                                }
                            });
                            if (!exist) {
                                saveShareId(shares, id);
                                ShareService.countView(id)
                            }
                        }
                    }
                    else {
                        saveShareId(shares, id);
                        ShareService.countView(id)
                    }
                }
                else {
                    saveShareId(shares, id);
                    ShareService.countView(id)
                }
            }
        }

        function saveShareId(shares, id) {
            if (!shares || shares == null || !shares.ids || !shares.exp_date || shares.exp_date < new Date()) {
                var date = new Date();
                shares = {
                    ids: [],
                    exp_date: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
                };
            }
            shares.ids.push(id);
            if (typeof (Storage) !== "undefined") {
                localStorage.setItem(SHARES_KEY, JSON.stringify(shares));
            }
            else {
                var expire_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
                $cookies.put(SHARES_KEY, JSON.stringify(shares), { path: '/', expires: expire_date });
            }
        }

        function initScroll() {
            $timeout(function () {
                if ($('#iscroll').length) {
                    var myScroll = new IScroll('#iscroll', {
                        scrollX: true,
                        scrollY: false,
                        mouseWheel: false,
                        scrollbars: true,
                        click: true
                    });
                }
            }, 300);
        }

        $scope.lightbox = function (url, caption, index) {
            lightbox(url);
            $timeout(function () {
                if (caption) {
                    $('.lity-container').append('<p class="lb-caption animated fadeIn">' + caption + '</p>');
                }
                var items = $('.repair-image');
                if (items.length > 1) {
                    $('.lity-container').append('<span class="lb-next animated fadeIn"><i class="fa fa-angle-right"></i></span>');
                    $('.lity-container').append('<span class="lb-prev animated fadeIn"><i class="fa fa-angle-left"></i></span>');

                    $('.lb-next').click(function () {
                        index++;
                        if (index >= items.length) {
                            index = 0;
                        }
                        var image_src = $($(items[index]).find('img')[0]).attr('src');
                        var image_caption = $($(items[index]).find('.caption')[0]).text();
                        $('.lity-container').find('img').attr('src', image_src);
                        $('.lity-container').find('.lb-caption').text(image_caption);
                    })
                    $('.lb-prev').click(function () {
                        index--;
                        if (index < 0) {
                            index = items.length - 1;
                        }
                        var image_src = $($(items[index]).find('img')[0]).attr('src');
                        var image_caption = $($(items[index]).find('.caption')[0]).text();
                        $('.lity-container').find('img').attr('src', image_src);
                        $('.lity-container').find('.lb-caption').text(image_caption);
                    })
                }
            }, 200);
        };

        $scope.money = function (num) {
            return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#/car?id=' + car.id);
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#/car?id=' + car.id);
        };

        $scope.getProvinceByKey = function (key) {
            var province = '';
            angular.forEach($scope.provinces, function (p) {
                if (p.key == key) {
                    province = p.th;
                }
            });
            return province;
        }

        $scope.loadShare();
        
    }]);
