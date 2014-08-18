$ ->
    BV = new $.BigVideo({
        doLoop:true
        container:$('.head')
        })
    BV.init()
    BV.show('videos/exponent.mp4')
    $('.mylm').hover (->
        $(this).addClass("mylm-active") 
    ), ->
        $(this).removeClass("mylm-active")


    $('.mylm').one 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', (e) ->
        $(this).addClass('an-updown')

    $window = $(window)
    isTop = 0;

    toTop = (ele) ->
        ele.removeClass('mylm-in').addClass('mylm-top')
        $('.mylm-arr').fadeIn(500)
        #BV.getPlayer().pause();
    toMid = (ele) ->
        ele.removeClass('mylm-top')
        $('.mylm-arr').fadeOut(100)
        #BV.getPlayer().play();


    b = $('.head-container')
    checkScrollPostioin = ->
        distance = $window.scrollTop()
        if 80 <= distance && !isTop
            isTop = !isTop
            $('.f-nav').removeClass('f-nav-bg')
            toTop $('.mylm')
            setTimeout (->
                b.css(
                    "-webkit-transform":"scale(0)"
                    "transform":"scale(0)"
                )
            ),200

        if 80 > distance && isTop
            isTop = !isTop
            $('.f-nav').addClass('f-nav-bg')
            toMid $('.mylm')
            setTimeout (->
                b.css(
                    "-webkit-transform":"scale(1)"
                    "transform":"scale(1)"
                )
            ),200
            
                
    timer = 0
    $window.scroll(->
        unless timer
            timer = setTimeout(->
                checkScrollPostioin()
                timer = 0
            , 250)
    ).scroll()