'use strict';
module.controller('ShareController', ['$scope', '$rootScope', '$q', '$timeout', '$cookies', 'CarService', 'ShareService', 'Event',
    function ($scope, $rootScope, $q, $timeout, $cookies, CarService, ShareService, Event) {

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
                }, 500);
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
                        var currDate = new Date();
                        var shareDate = new Date(shares.exp_date);
                        if (!shares.exp_date || shareDate < new Date()) {
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
            var currDate = new Date();
            
            if (!shares || shares == null || !shares.ids || !shares.exp_date) {
                var date = new Date();
                shares = {
                    ids: [],
                    exp_date: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
                };
            }
            else {
                var shareDate = new Date(shares.exp_date);
                if (shareDate < currDate) {
                    var date = new Date();
                    shares = {
                        ids: [],
                        exp_date: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
                    };
                }
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

        $scope.image_id = 0;
        $scope.image_src = '';

        function setLightboxHeight() {
            if ($('.lity-content img').height() > $(window).height() - 130) {
                $('.lity-content img').css('max-height', $(window).height() - 130);
            }
        }

        $scope.lightbox = function (url, caption, index) {
            lightbox(url);
            $timeout(function () {
                if (caption) {
                    $('.lity-container').append('<p class="lb-caption animated fadeIn">' + caption + '</p>');
                }
                var items = $('.repair-image');
                if (items.length > 1) {
                    $scope.image_id = $(items[index]).attr('data-id');
                    $scope.image_src = url;
                    $('.lity-container').append('<span class="lb-next animated fadeIn"><i class="fa fa-angle-right"></i></span>');
                    $('.lity-container').append('<span class="lb-prev animated fadeIn"><i class="fa fa-angle-left"></i></span>');
                    $('.lity-container').append('<button class="btn btn-danger report-image-button animated fadeIn"><i class="fa fa-photo"></i> Report รูป</button>');
                    $('.lb-next').click(function () {
                        index++;
                        if (index >= items.length) {
                            index = 0;
                        }
                        $scope.image_id = $(items[index]).attr('data-id');
                        $scope.image_src = $($(items[index]).find('img')[0]).attr('src');
                        var image_caption = $($(items[index]).find('.caption')[0]).text();
                        $('.lity-container').find('img').attr('src', $scope.image_src);
                        $('.lity-container').find('.lb-caption').text(image_caption);
                        setLightboxHeight();
                    });
                    $('.lb-prev').click(function () {
                        index--;
                        if (index < 0) {
                            index = items.length - 1;
                        }
                        $scope.image_id = $(items[index]).attr('data-id');
                        $scope.image_src = $($(items[index]).find('img')[0]).attr('src');
                        var image_caption = $($(items[index]).find('.caption')[0]).text();
                        $('.lity-container').find('img').attr('src', $scope.image_src);
                        $('.lity-container').find('.lb-caption').text(image_caption);
                    });
                    $('.report-image-button').click(function () {
                        $('.lity-close').trigger('click');
                        $timeout(function () {
                            $rootScope.$broadcast(Event.Report.Display, $scope.image_id, $scope.image_src);
                        }, 300);
                        setLightboxHeight();
                    });
                }
                setLightboxHeight();
            }, 200);
        };

        $scope.simpleLightbox = function (url) {
            lightbox(url);
        };

        $scope.money = function (num) {
            return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#!/car?id=' + car.id);
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#!/car?id=' + car.id);
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

        $('.see-more').click(function () {
            $(this).parent('h2').addClass('more');
            $(this).parent('h2').next().addClass('more');
        });

        $('.close-more').click(function () {
            $(this).parent('h2').removeClass('more');
            $(this).parent('h2').next().removeClass('more');
        });
        
    }]);
