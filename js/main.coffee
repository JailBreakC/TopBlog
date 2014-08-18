$ ->
    BV = new $.BigVideo({
        doLoop:true
        container:$('.head')
        })
    BV.init()
    BV.show('videos/exponent.mp4')

    $.stellar();


    $('.mylm').hover (->
        $(this).addClass("mylm-active") 
    ), ->
        $(this).removeClass("mylm-active")


    $('.mylm').one 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', (e) ->
        $(this).addClass('an-updown')

    $('.silder-list>li').each ->
        
        $(this).hover (->
            index = $(this).position().top;
            $('.float-light').css(
                "top":index
                )
        ), ->
            

    $('.silder-list').hover (->
        
    ),->
        index = $('.silder-list').find('.active').position().top;
        $('.float-light').css(
            "top":index
            )

    do ->
        $window = $(window)
        isTop = 0;
        isFix = 0;
        isPlay = 1;
        toTop = (ele) ->
            ele.removeClass('mylm-in').addClass('mylm-top')
            $('.mylm-arr').fadeIn(500)
        toMid = (ele) ->
            ele.removeClass('mylm-top')
            $('.mylm-arr').fadeOut(100)
            BV.getPlayer().play();


        b = $('.head-container')
        $silder = $('.left-bar')
        silderOriginalH = $silder.offset().top

        checkScrollPostioin = ->
            distance = $window.scrollTop()
            silderH = $silder.offset().top

            if silderH <= distance + 50 && !isFix
                $silder.addClass('fixTop')
                isFix = !isFix

            if silderOriginalH > distance + 50 && isFix
                $silder.removeClass('fixTop')
                isFix = !isFix

            if distance >= $(window).height() && isPlay
                isPlay = !isPlay
                BV.getPlayer().pause();

            if distance < $(window).height() && !isPlay
                isPlay = !isPlay
                BV.getPlayer().play();

            if 80 <= distance && !isTop
                isTop = !isTop
                $('.f-nav').removeClass('f-nav-bg')
                toTop $('.mylm')
                b.css(
                    "-webkit-transform":"scale(0)"
                    "transform":"scale(0)"
                )

            if 80 > distance && isTop
                isTop = !isTop
                $('.f-nav').addClass('f-nav-bg')
                b.css(
                        "-webkit-transform":"scale(1)"
                        "transform":"scale(1)"
                    )
                
                setTimeout (->
                    toMid $('.mylm')
                ),100
                
        timer = 0
        $window.scroll(->
            unless timer
                timer = setTimeout(->
                    checkScrollPostioin()
                    timer = 0
                , 0)
        ).scroll()


    pageScroll = ->
        if $(window).scrollTop() <= 0
            clearTimeout(scrolldelay);
        else
            window.scrollBy(0,-100); 
            scrolldelay = setTimeout(pageScroll,10)

    $('.mylm').click ->
        pageScroll()