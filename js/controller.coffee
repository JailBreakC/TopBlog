window.myblogApp = angular.module('myblog',[
    "ngRoute"
    "ngAnimate"
])

myblogApp.directive 'markdown', ->
    restrict:'EA'
    require: '?ngModel'
    link: (scope,element,attrs,ngModel) ->
        scope.$watch (->ngModel.$modelValue),(newValue) ->
            element.html markdown.toHTML(if newValue then newValue else "#loading..." )

myblogApp.directive 'markdownlist', ->
    restrict:'EA'
    link: (scope,element,attrs)->
        element.html markdown.toHTML element.text()

myblogApp.config ($routeProvider, $locationProvider) ->
  $routeProvider.when("/",
    templateUrl: "partials/list.html"
  ).when("/type/:type", 
    templateUrl: "partials/list.html"
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

listCtrl = ($scope,$http) ->
listCtrl.$inject = ['$scope', '$http']


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
    #console.log $scope

    #多说
    `
    function toggleDuoshuoComments(container){
        var el = document.createElement('div');//该div不需要设置class="ds-thread"
        el.setAttribute('id', $scope.name);//必选参数
        el.setAttribute('data-thread-key', $scope.post.title);//必选参数
        el.setAttribute('data-url', $scope.name);//必选参数
        //el.setAttribute('data-author-key', '作者的本地用户ID');//可选参数
        //console.log(el)
        DUOSHUO.EmbedThread(el);
        //console.log(el)
        jQuery(container).append(el); 
        
    }`

postCtrl.$inject = ['$scope','$http','$routeParams']


indexCtrl = ($scope,$http,$routeParams) ->
    $scope.type = $routeParams
    window.w = $scope
    $http.get("post/list.md").success (data) ->
        #console.log data
        $scope.blogList = _.filter(parseList(data),(it)-> it.hide!='true')
        $scope.listType = _.uniq(_.pluck($scope.blogList,'type'))
        console.log $scope.listType
    Scroll2Top = ->
        window.scrollTo(0,$(window).height()*1.4)
    $('#fix-height').css('min-height',$(window).height())




indexCtrl.$inject = ['$scope','$http','$routeParams']

myblogApp.controller 'listCtrl',listCtrl
myblogApp.controller 'postCtrl',postCtrl
myblogApp.controller 'indexCtrl',indexCtrl