$ ->
    #BV插件
    BV = new $.BigVideo({
        doLoop:true
        container:$('.head')
    })
    BV.init()
    videos = "http://topblog.qiniudn.com/exponent.mp4"
    #videos = "videos/exponent.mp4"
    BV.show(videos)
    #stellar.js 视差滚动插件
    $.stellar();
    #头像悬浮模糊效果
    $('.mylm').hover (->
        $(this).addClass("mylm-active") 
    ), ->
        $(this).removeClass("mylm-active")

    #当头像进入动画结束时进行上下抖动。。。但是现在这段代码只能在鼠标悬浮之后起作用
    $('.mylm').one 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', (e) ->
        $(this).addClass('an-updown')

    $('.silder-list').on 'click','a', ->
        $thisA = $(this);
        $('.silder-list li').removeClass('active')
        $thisA.children().addClass('active');
        window.scrollTo(0,$(window).height()*1.4)
    #鼠标进入侧边栏时的高亮跟随效果
    $('.silder-list').on 'mouseenter','li', ->
        index = $(this).position().top;
        $('.float-light').css(
            "top":index
            )
            

    #当鼠标离开侧边栏时，高亮复位。
    $('.silder-list').hover (->
        #do nothing
    ),->
        activeEle = $('.silder-list').find('.active')
        if( activeEle.length > 0 )
            index = activeEle.position().top;
        else
            index = 0
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


        b = $('.head-container')
        $silder = $('.left-bar')
        silderOriginalH = $silder.offset().top
        $footer = $('.foot-bar')
        #检查滚轮位置
        checkScrollPostioin = ->
            distance = $window.scrollTop()
            silderH = $silder.offset().top
            silderHeight = $silder.height()
            footerH = $footer.offset().top
            #console.log("footH "+footerH+" silderH "+silderH+" silderHeight "+silderHeight)
            #侧边栏
            if $(window).width() >= 768
                if (silderH <= distance + 50) && (silderHeight <= footerH - distance) && !isFix
                    silderWidth = $silder.width()
                    $silder.addClass('fixTop')
                    $silder.width(silderWidth)
                    isFix = !isFix

                if ((silderOriginalH > distance + 50) || (silderHeight > footerH - distance - 50)) && isFix
                    $silder.removeClass('fixTop')
                    isFix = !isFix

            #视频播放
            if distance >= $(window).height() && isPlay
                isPlay = !isPlay
                BV.getPlayer().pause();

            if distance < $(window).height() && !isPlay
                isPlay = !isPlay
                BV.getPlayer().play();

            #头像
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