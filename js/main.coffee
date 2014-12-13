$ ->

    BV = false
    if $(window).width() > 768
        #BV插件
        img=new Image();
        img.src='images/bk.jpg'
        img.onload = ->
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

    $('.QQ').click ->
        $(this).html('610164407').wrap('<a href="tencent://message/?uin=610164407&Menu=yes"></a>')

    ScrollController = ->
        $window = $(window)
        b = $('.head-container')
        silderOriginalH = $('.left-bar').offset().top
        $footer = $('.foot-bar')
        $silder = $('.left-bar')
        isTop = 0;
        isFix = 0;
        isPlay = 1;

        toTop = (ele) ->
            ele.removeClass('mylm-in').addClass('mylm-top')
            $('.mylm-arr').fadeIn(500)
        toMid = (ele) ->
            ele.removeClass('mylm-top')
            $('.mylm-arr').fadeOut(100)

        

        fixSilder = ->
            silderWidth = $silder.width()
            $silder.addClass('fixTop')
            $silder.width(silderWidth)
            isFix = !isFix

        unfixSilder = ->
            $silder.removeClass('fixTop')
            isFix = !isFix

        playBV = ->
            isPlay = !isPlay
            BV.getPlayer().pause();

        stopBV = ->
            isPlay = !isPlay
            BV.getPlayer().play();

        getbigAvatar = ->
            isTop = !isTop
            $('.f-nav').removeClass('f-nav-bg')
            toTop $('.mylm')
            b.css(
                "-webkit-transform":"scale(0)"
                "transform":"scale(0)"
            )

        #if 80 > distance && isTop
        getsmallAvatar = ->
            isTop = !isTop
            $('.f-nav').addClass('f-nav-bg')
            b.css(
                    "-webkit-transform":"scale(1)"
                    "transform":"scale(1)"
                )
            setTimeout (->
                toMid $('.mylm')
            ),100
        return ->
            distance = $(window).scrollTop()
            silderH = $silder.offset().top
            silderHeight = $silder.height()
            footerH = $footer.offset().top
            if $(window).width() >= 768
                if (silderH <= distance + 50) && (silderHeight <= footerH - distance) && !isFix
                    fixSilder()
                if ((silderOriginalH > distance + 50) || (silderHeight > footerH - distance - 50)) && isFix
                    unfixSilder()

            if BV
                if distance >= $(window).height() && isPlay
                    playBV()
                if distance < $(window).height() && !isPlay
                    stopBV()

            if 80 <= distance && !isTop
                getbigAvatar()

            if 80 > distance && isTop
                getsmallAvatar()


    positionSetter = new ScrollController()

    #QQ登录

    (->        
        timer = 0 
        $(window).scroll(->
            unless timer
                timer = setTimeout(->
                    positionSetter()
                    timer = 0
                , 0)
        ).scroll()
    )()

    pageScroll = ->
        if $(window).scrollTop() <= 0
            clearTimeout(scrolldelay);
        else
            window.scrollBy(0,-100); 
            scrolldelay = setTimeout(pageScroll,10)

    $('.mylm').click ->
        pageScroll()