window.myblogApp = angular.module('myblog',[
    "ngRoute"
    "ngAnimate"
])

myblogApp.config ($routeProvider, $locationProvider) ->
    list = "<div class=\"main-bar\">" + "<div apr-animate ng-repeat=\"post in blogList | blogListType : type\" class=\"md\">" + "<div class=\"date\">" + "<p class=\"month\">{{post.date.month}}月</p>" + "<p class=\"day\">{{post.date.day}}</p>" + "</div>" + "<div class=\"md-context\">" + "<h1>{{post.title}}</h1>" + "<div class=\"shot-text\">" + "<p>{{post.disc}}</p>" + "</div>" + "</div>" + "<div class=\"md-foot\">" + "<a ng-click=\"Scroll2Top()\" ng-href=\"#/post/{{post.url}}\"><button class=\"pull-right btn btn-danger\">阅读全文</button></a>" + "</div>" + "</div>" + "</div>"
    $routeProvider.when("/",
        template: list
    ).when("/type/:type",
        template: list
    ).when("/post/:name",
        templateUrl: "partials/page.html"
    ).otherwise redirectTo: "/"

myblogApp.filter 'blogListType', ->
    blogListType = (date,array) ->
        type = array.type
        ##console.log type
        if type
            output = {}
            for i in date
                if i.type is type
                    output[_i] = i
            ##console.log output
            return output
        return date

myblogApp.directive 'markdown', ->
    restrict:'EA'
    scope: {content: '=markdownContent'}
    link: (scope, element, attrs) ->
        console.log 'xxx'
        scope.$watch (->scope.content), (newValue) ->
            element.html marked(if newValue then newValue else "#loading...")
            element.find('pre>code').each( (i, block)->
                hljs.highlightBlock(block)
            )

myblogApp.directive 'markdownlist', ->
    restrict: 'EA'
    link: (scope,element,attrs)->
        #console.log 'xxx'
        element.html marked element.text()

#注意指令的命名方式，代码中使用驼峰法 HTML中必须使用横杠法(-) angular会自动识别
myblogApp.directive 'aprAnimate', ->
    restrict: 'EA'
    link: (scope,element,attrs)->
        $(window).scroll ->
            height = $(window).height()
            top = $(window).scrollTop()
            pos = element.offset().top
            if pos - top <= height
                element.addClass('upsidedown')

myblogApp.directive 'lazyload', ->
    restrict: 'EA'
    link: (scope, element, attrs) ->
        console.log attrs
        debugger
        if $(window).width() > 768
            img=new Image();
            img.src='images/bk.jpg'
            img.onload = ->
                $('.mylm').one 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', (e) ->
                    $(this).addClass('an-updown')
                element.attr('src', attrs.lazyload)

myblogApp.directive 'tracker', ->
    restrict: 'EA'
    link: (scope, element, attrs) ->
        element.mouseleave ->
            activeEle = element.find('.active')
            if( activeEle.length > 0 )
                pos = activeEle.position().top;
            else
                pos = 0
            $('.float-light').css(
                "top":pos
            )

        element.on 'mouseenter','li', ->
            pos = $(this).position().top;
            $('.float-light').css(
                "top": pos
            )


parseTitle = (data) ->
    r =
        title:""
        type:""
        tag:""
        disc:""
        url:""
        hide:""
    for line in data.split('\n')
        [key,value] = line.split(':')
        key = _.str.trim key
        value = _.str.trim value
        if r.hasOwnProperty(key) then r[key]=value
    r.date = r.url.split('-')
    r.date.month = parseInt(r.date[1],10)
    r.date.day =  parseInt(r.date[2],10)
    return r

parseList = (data) ->
    #console.log data.split(/\n[\-=]+/)
    _.map data.split(/\n[\-=]+/),parseTitle


parsePost = (text) ->
    flag = false
    head = ""
    tail = ""
    for line in text.split('\n')
        if /[\-=]+/.test(line)
            flag=true
        if flag
            tail+= '\n'+line
        else
            head+= '\n'+line+'\n'
    post = parseTitle head
    post.text = tail
    if post.hide == 'true' then return
    return post

postCtrl = ($scope,$http,$routeParams) ->
    $scope.name = $routeParams.name
    $http.get('post/'+$scope.name).success (data)->
        $scope.post = parsePost(data)
        toggleDuoshuoComments('.blog-container')
    #多说
    toggleDuoshuoComments = (container) ->
        el = document.createElement('div') #该div不需要设置class="ds-thread"
        el.setAttribute('id', $scope.name) #必选参数
        el.setAttribute('data-thread-key', $scope.post.title) #必选参数
        el.setAttribute('data-url', $scope.name) #必选参数
        #el.setAttribute('data-author-key', '作者的本地用户ID');//可选参数
        #console.log(el)
        DUOSHUO.EmbedThread(el)
        #console.log(el)
        jQuery(container).append(el)


postCtrl.$inject = ['$scope','$http','$routeParams']


indexCtrl = ($scope,$http,$routeParams) ->

    $scope.type = $routeParams
    window.w = $scope

    $http.get("post/list.md").success (data) ->
        console.log('indexCtrl')
        $scope.blogList = _.filter(parseList(data),(it)-> it.hide!='true')
        $scope.listType = _.uniq(_.pluck($scope.blogList,'type'))

    scrollStuff(angular.element)

    $scope.scroll2Top = (ele)->
        $('.silder-list li').removeClass('active')
        $(ele).addClass('active')
        window.scrollTo(0,$(window).height()*1.4)
        setTimeout(->
            debugger
            $(window).trigger('scroll');
        ,500)

    $scope.showQQ = (ele) ->
        $(ele).html('610164407').wrap('<a href="tencent://message/?uin=610164407&Menu=yes"></a>')
    $('#fix-height').css('min-height',$(window).height())


indexCtrl.$inject = ['$scope','$http','$routeParams']

myblogApp.controller 'postCtrl',postCtrl
myblogApp.controller 'indexCtrl',indexCtrl

###################################################################
scrollStuff = ($)->

    BV = $('#bk-video')[0]


    #stellar.js 视差滚动插件
    $.stellar();

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
            BV.pause();

        stopBV = ->
            isPlay = !isPlay
            BV.play();

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