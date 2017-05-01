'use strict';
module.controller('RepairController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'RepairService', 'CarService', 'AccountService', 'WorkgroupService', 'WorkService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, RepairService, CarService,AccountService, WorkgroupService, WorkService, Event, Helper) {

        $scope.provinces = _provinces;
        $scope.ratings = ['ไม่ระบุ', 'แย่มาก', 'แย่', 'พอได้', 'ดี', 'ดีมาก']
        $scope.params = $location.search();
        $scope.from_car = $scope.params.car ? true : false;
        if ($scope.from_car) {
            $scope.carId = $scope.params.car;
        }
        var lightbox = lity();

        function getWorkGroupById(id) {
            var group;
            angular.forEach($scope.workgroup, function (w) {
                if (w.id === id) {
                    group = w;
                }
            });
            return group;
        }

        function getById() {
            $q.all([
                RepairService.getById($scope.params.id).then(function (data) {
                    $scope.model = data;
                }).catch(function () {
                    alert('ERROR LOAD REPAIR');
                }),
                CarService.get().then(function (res) {
                    $scope.cars = angular.copy(res.data);
                }),
                WorkgroupService.get().then(function (res) {
                    $scope.workgroup = angular.copy(res.data);
                }),
                RepairService.getPreviousShop($scope.params.car?$scope.params.car:0).then(function (res) {
                    $scope.previous_shops = res.data;
                })
            ]).then(function () {
                initModel($scope.model);
                watch();
                $scope.displayView();
                angular.forEach($scope.cars, function (_car) {
                    if (_car.id == $scope.model.for_car) {
                        _car.active = true;
                    }
                });
                $rootScope.$broadcast(Event.Car.IDForUpload, $scope.model.for_car);

                initScroll();
                $timeout(function () {
                    shopExpandCollapse();
                }, 500);
            });
        }

        function initModel(model) {
            if (model.date) {
                var date = new Date(model.date);
                model.date_str = Helper.readableDate(date);
            }
            angular.forEach(model.notifications, function (n) {
                n.date_str = Helper.readableDate(n.date);
                angular.forEach($scope.workgroup, function (w) {
                    if (n.work == w.id) {
                        n.work_str = w.name;
                    }
                });
            });
            $scope.calPrice();
        }

        function isValid() {
            return $scope.params.id && $scope.user && $scope.user.id;
        }

        var watchScore;
        var watchShare;
        var isFirst = true;
        function watch() {
            if (watchShare) {
                watchShare();
            }
            if (watchScore) {
                watchScore();
            }
            watchScore = $scope.$watch('model.score', function (newValue, oldValue) {
                if (!isFirst) {
                    $scope.save();
                }
            });
            watchShare = $scope.$watch('model.share', function (newValue, oldValue) {
                if (!isFirst) {
                    $scope.save();
                }
            });
            $timeout(function () {
                isFirst = false;
            }, 1000);
        }

        function initScroll() {
            $timeout(function () {
                var myScroll = new IScroll('#iscroll', {
                    scrollX: true,
                    scrollY: true,
                    mouseWheel: false,
                    scrollbars: true,
                    click: true
                });
            }, 200);
        }

        function shopExpandCollapse() {

            $('.shop-detail-on-repair .see-more').unbind('click');
            $('.shop-detail-on-repair .close-more').unbind('click');

            $('.shop-detail-on-repair .see-more').click(function () {
                $(this).parents('.shop-detail-on-repair').addClass('active');
            });
            $('.shop-detail-on-repair .close-more').click(function () {
                $(this).parents('.shop-detail-on-repair').removeClass('active');
            });
        }

        $scope.repairPage = function () {
            if ($scope.user_ready) {
                if (isValid()) {
                    getById();
                }
                else {
                    window.location.hash = '#!/';
                }
            }
            else {
                $timeout(function () {
                    $scope.repairPage();
                }, 200);
            }
        };

        $scope.reload = function () {
            RepairService.getById($scope.params.id).then(function (data) {
                $scope.model = data;
                initModel($scope.model);
                $rootScope.$broadcast(Event.Load.Dismiss);
            }).catch(function () {
                $timeout(function () {
                    $rootScope.$broadcast(Event.Message.Display, 'โหลดบันทึกการซ่อมไม่ได้กรุณาลองใหม่');
                });
            })
        }

        $scope.save = function () {
            $rootScope.$broadcast(Event.Load.Display);
            var group = getWorkGroupById($scope.model.work);
            if (group) {
                $scope.model.group = group.name;
            }

            RepairService.update($scope.model).then(function (res) {
                $rootScope.$broadcast(Event.Load.Dismiss);
            }).catch(function (res) {
                $timeout(function () {
                    $rootScope.$broadcast(Event.Message.Display, 'บันทึกการซ่อมไม่ได้กรุณาลองใหม่');
                });
                $rootScope.$broadcast(Event.Load.Dismiss);
            });
        }

        $scope.openShop = function () {
            $rootScope.$broadcast(Event.Shop.DisplayPopup, $scope.previous_shops, function (shop) {
                $scope.model.shop = shop;
                $timeout(function () {
                    $scope.save();
                }, 500);
            });
        };

        $scope.openWork = function () {
            $rootScope.$broadcast(Event.Work.DisplayPopup,
                { repair: $scope.model.id, work: $scope.model.work + '' },
                $scope.workgroup,
                $scope.model.shop?$scope.model.shop.id: '',
                function () {
                    $timeout(function () {
                        $scope.reload();
                    }, 500);
                });
        };

        $scope.editWork = function (work) {
            $rootScope.$broadcast(Event.Work.DisplayPopup,
                work,
                $scope.workgroup,
                 $scope.model.shop?$scope.model.shop.id: '',
                function () {
                    $timeout(function () {
                        $scope.reload();
                    }, 500);
                });
        };

        $scope.deleteWork = function (work) {
            $rootScope.$broadcast(Event.Confirm.Display, function () {
                $rootScope.$broadcast(Event.Load.Display);
                WorkService.delete(work.id).then(function (res) {
                    $scope.reload();
                }).catch(function () {
                    $timeout(function () {
                        $rootScope.$broadcast(Event.Message.Display, 'ลบรายการซ่อมไม่ได้กรุณาลองใหม่');
                    });
                });
            });
        };

        $scope.openNotification = function () {
            $rootScope.$broadcast(Event.Notification.DisplayPopup,
                { car: $scope.model.car.id, repair: $scope.model.id, work: $scope.model.work + '', enable: true },
                $scope.strings,
                $scope.workgroup,
                function () {
                    $scope.reload();
                });
        };

        $scope.calPrice = function () {
            var price = 0.0;
            angular.forEach($scope.model.repair_works, function (i) {
                price += i.price;
            });
            if ($scope.model.price != price) {
                $scope.model.price = price;
                $scope.save();
            }
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#!/car?id=' + car.id);
        };

        $scope.rated = function (score) {
            $scope.model.score = score;
        };

        $scope.saveImage = function (event, file) {
            var fileData = {
                repair_id: $scope.model.id,
                image_id: file.id
            };
            RepairService.uploadImage(fileData).then(function () {
                $scope.reload();
            }).catch(function () {
                $timeout(function () {
                    $rootScope.$broadcast(Event.Message.Display, 'Upload ไม่ได้กรุณาลองใหม่');
                }, 500);
            });
        };

        $scope.removeImage = function (image) {
            $rootScope.$broadcast(Event.Confirm.Display, function () {
                $rootScope.$broadcast(Event.Load.Display);
                RepairService.deleteImage(image).then(function () {
                    $scope.reload()
                }).catch(function () {
                    $rootScope.$broadcast(Event.Message.Display, 'ลบรูปไม่ได้กรุณาลองใหม่');
                });
            });
        };

        $scope.imageCaption = function (image, index) {
            $rootScope.$broadcast(Event.Repair.DisplayCaptionPopup, image, function (model) {
                $scope.model.repair_images[index] = model;
            });
        };

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

        $scope.getProvinceByKey = function (key) {
            var province = '';
            angular.forEach($scope.provinces, function (p) {
                if (p.key == key) {
                    province = p.th;
                }
            });
            return province;
        };

        $scope.delete = function () {
            $rootScope.$broadcast(Event.Confirm.Display, function () {
                RepairService.delete($scope.model.id).then(function (res) {
                    if ($scope.from_car) {
                        window.location.hash = '#!/car?id=' + $scope.carId;
                    }
                    else if(window.location.href.toLowerCase().indexOf('admin') > -1) {
                        window.location.href = '/admin#!/repairs';
                    }
                    else {
                        window.location.href = '/';
                    }
                }).catch(function (res) {
                    $timeout(function () {
                        $rootScope.$broadcast(Event.Message.Display, 'ลบการซ่อมนี้ไม่ได้ กรุณาลองใหม่หรือตรวจสอบให้แน่ใจว่าได้ลบรูปและรายการซ่อมทั้งหมดแล้ว');
                    }, 500);
                    $rootScope.$broadcast(Event.Load.Dismiss);
                });
            });
        };

        $scope.impersonate = function () {
            AccountService.AccountService({ id: $scope.model.user.id }).then(function (res) {
                AccountService.setAuthenticationToken(res).then(function () {
                    window.location.href = '/#!/repair?id=' + $scope.model.id;
                });
            }).catch(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
                $timeout(function () {
                    $rootScope.$broadcast(Event.Message.Display, 'พบปัญหาในการเข้าใช้ User นี้');
                }, 500);
            })
        };

        $scope.back = function () {
            $scope.navigateTo('#!/car?id=' + $scope.model.for_car);
        };

        $scope.$on(Event.File.Success, $scope.saveImage);
        $scope.repairPage();
    }]);
