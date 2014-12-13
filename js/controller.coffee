window.myblogApp = angular.module('myblog',[
    "ngRoute"
    "ngAnimate"
])

myblogApp.config ($routeProvider, $locationProvider) ->
    list = "<div class=\"main-bar\">" + "<div  ng-repeat=\"post in blogList | blogListType : type\" class=\"md\">" + "<div class=\"date\">" + "<p class=\"month\">{{post.date.month}}月</p>" + "<p class=\"day\">{{post.date.day}}</p>" + "</div>" + "<div class=\"md-context\">" + "<h1>{{post.title}}</h1>" + "<div class=\"shot-text\">" + "<p>{{post.disc}}</p>" + "</div>" + "</div>" + "<div class=\"md-foot\">" + "<a ng-click=\"Scroll2Top()\" ng-href=\"#/post/{{post.url}}\"><button class=\"pull-right btn btn-danger\">阅读全文</button></a>" + "</div>" + "</div>" + "</div>"
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
        scope.$watch (->scope.content), (newValue) ->
            element.html marked(if newValue then newValue else "#loading...")
            element.find('pre>code').each( (i, block)->
                hljs.highlightBlock(block)
            )

myblogApp.directive 'markdownlist', ->
    restrict: 'EA'
    link: (scope,element,attrs)->
        element.html marked element.text()

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
    $scope.Scroll2Top = ->
        window.scrollTo(0,$(window).height()*1.4)
    $('#fix-height').css('min-height',$(window).height())




indexCtrl.$inject = ['$scope','$http','$routeParams']

myblogApp.controller 'postCtrl',postCtrl
myblogApp.controller 'indexCtrl',indexCtrl