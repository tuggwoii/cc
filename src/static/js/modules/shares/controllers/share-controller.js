'use strict';
module.controller('ShareController', ['$scope', '$q', '$timeout', 'CarService',
    function ($scope, $q, $timeout, CarService) {

        var lightbox = lity();
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
            }
            else {
                $timeout(function () {
                    $scope.loadShare();
                }, 200);
            }
        };

        function initScroll() {
            $timeout(function () {
                var myScroll = new IScroll('#iscroll', {
                    scrollX: true,
                    scrollY: false,
                    mouseWheel: false,
                    scrollbars: true,
                    click: true
                });
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
