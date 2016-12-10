//script.js
$(function () {
    $(window).on('load', function () {
        var $preloader = $('#page-preloader')
            , $spinner = $preloader.find('.spinner');
        $spinner.fadeOut();
        $preloader.delay(350).fadeOut('slow');
    });
    $('#collapse-1').fadeOut('fast');
    $('#collapse-2').fadeOut('fast');
    $('#collapse-3').fadeOut('fast');
    //    Carousel information
    $('.carousel').hover(function () {
        $('div.carousel-caption').slideDown('slow');
    }, function () {
        $('div.carousel-caption').fadeOut('slow');
    });
    //     $('span:contains("Read more...")').css('border', 'solid 1px red');
    $('#span-collapse-1').click(function () {
        $(this).fadeOut('fast');
        $('#collapse-1').delay(400).fadeIn('fast');
    });
    $('#span-collapse-2').click(function () {
        $(this).fadeOut(2000);
        $('#collapse-2').delay(1000).fadeIn(5000);
    });
    $('#span-collapse-3').click(function () {
        $(this).fadeOut(1000);
        $('#collapse-3').delay(500).fadeIn(2000);
    });
});