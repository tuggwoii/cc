var WorkSlide = function () {
    var context;
    var areaWidth;
    var items = $('.filter-box .filter-item');
    var container = $('.work-filter-container');
    var leftArrow = $('.filter-box .fa-angle-left');
    var rightArrow = $('.filter-box .fa-angle-right');
    var left = 0;
    var index = 0;
    var resize = {};

    this.init = function () {
        this.viewPort();
        this.calculate();
        this.events();
        this.sizeChange();
    };

    this.calculate = function () {
        areaWidth = $(window).width() - 70;
        if (this.isMobile) {
            container.css('position', 'relative');
            container.width(areaWidth * items.length);
            items.width(areaWidth - 20);
        }
        else {
            container.css('width', '100%');
            container.css('left', '0');
            items.css('width', 'auto');
        }
    };

    this.events = function () {
        leftArrow.click(function () {
            if (index > 0 ) {
                left = left + areaWidth;
                index--;
                container.animate({
                    left: left
                }, 500);
            }
        });
        rightArrow.click(function () {
            if (index < (items.length - 1)) {
                left = left - areaWidth;
                index++;
                container.animate({
                    left: left
                }, 500);
            }
        });
    };

    this.viewPort = function () {
        if (window.matchMedia("(max-width: 767px)").matches) {
            this.isMobile = true;
            console.log('mobile');
        }
        else {
            this.isMobile = false;
            console.log('not mobile');
        }
    };

    this.sizeChange = function () {
        $(window).resize(function () {
            context.viewPort();
            context.calculate();
        });
    };

    context = this;
    this.init();
};

var ShareWorkSlide = function () {
    var context;
    var areaWidth, padding, slideMore;
    var items = $('.works .work-item');
    var container = $('.works .work-list');
    var leftArrow = $('.works .fa-angle-left');
    var rightArrow = $('.works .fa-angle-right');
    var left = 0;
    var index = 0;

    this.init = function () {
        this.viewPort();
        this.calculate();
        this.events();
        this.sizeChange();
    };

    this.calculate = function () {
        padding = window.matchMedia("(max-width: 500px)").matches ? 50 : 80;
        areaWidth = $(window).width() - padding;
        console.log(areaWidth);
        if (this.isMobile) {
            container.css('position', 'relative');
            container.width((areaWidth + 20) * items.length);
            items.width(areaWidth);
        }
        else {
            container.css('width', '100%');
            container.css('left', '0');
            items.css('width', 'auto');
        }
    };

    this.events = function () {
        leftArrow.click(function () {
            if (index > 0) {
                left = left + (areaWidth + 20);
                index--;
                container.animate({
                    left: left
                }, 500);
            }
        });
        rightArrow.click(function () {
            if (index < (items.length - 1)) {
                left = left - (areaWidth + 20);
                index++;
                container.animate({
                    left: left
                }, 500);
            }
        });
    };

    this.viewPort = function () {
        if (window.matchMedia("(max-width: 767px)").matches) {
            this.isMobile = true;
            console.log('mobile');
        }
        else {
            this.isMobile = false;
            console.log('not mobile');
        }
    };

    this.sizeChange = function () {
        $(window).resize(function () {
            clearTimeout(resize);
            var resize = setTimeout(function () {
                left = (-index * (areaWidth + 20));
                container.animate({
                    left: left
                }, 0);
                context.viewPort();
                context.calculate();
            }, 200);
        });
    };

    context = this;
    this.init();
};