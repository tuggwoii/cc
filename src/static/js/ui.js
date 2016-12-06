function bindCarSection() {
    $('.car-head-row .see-more').unbind('click');
    $('.car-head-row .close-more').unbind('click');

    $('.car-head-row .see-more').click(function () {
        $('.car-head-row').addClass('more');
        $('.car-head-row').removeClass('less');
        $('.car-body-row').addClass('more');
        $('.car-body-row').removeClass('less');
    });

    $('.car-head-row .close-more').click(function () {
        $('.car-head-row').addClass('less');
        $('.car-head-row').removeClass('more');
        $('.car-body-row').addClass('less');
        $('.car-body-row').removeClass('more');
    });
}

function bindUserSection() {
    $('.profile .see-more').unbind('click');
    $('.profile .close-more').unbind('click');

    $('.profile .see-more').click(function () {
        $('.profile').addClass('more');
        $('.profile').removeClass('less');
        $('.user-info-section').addClass('more');
        $('.user-info-section').removeClass('less');
    });

    $('.profile .close-more').click(function () {
        $('.profile').addClass('less');
        $('.profile').removeClass('more');
        $('.user-info-section').addClass('less');
        $('.user-info-section').removeClass('more');
    });
}

function setDDD() {
    var selector = ".share-item .user-name, " +
        ".share-item .car-model," +
        ".share-item .shop";

    $(selector).dotdotdot({
        ellipsis: '...',
        wrap: 'letter',
        watch: true
    });
}