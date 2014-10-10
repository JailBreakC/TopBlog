(function() {
  var indexCtrl, listCtrl, parseList, parsePost, parseTitle, postCtrl;

  window.myblogApp = angular.module('myblog', ["ngRoute", "ngAnimate"]);

  myblogApp.directive('markdown', function() {
    return {
      restrict: 'EA',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        return scope.$watch((function() {
          return ngModel.$modelValue;
        }), function(newValue) {
          return element.html(markdown.toHTML(newValue ? newValue : "#loading..."));
        });
      }
    };
  });

  myblogApp.directive('markdownlist', function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        return element.html(markdown.toHTML(element.text()));
      }
    };
  });

  myblogApp.config(function($routeProvider, $locationProvider) {
    return $routeProvider.when("/", {
      templateUrl: "partials/list.html"
    }).when("/type/:type", {
      templateUrl: "partials/list.html"
    }).when("/post/:name", {
      templateUrl: "partials/page.html"
    }).otherwise({
      redirectTo: "/"
    });
  });

  myblogApp.filter('blogListType', function() {
    var blogListType;
    return blogListType = function(date, array) {
      var i, output, type, _i, _len;
      type = array.type;
      if (type) {
        output = {};
        for (_i = 0, _len = date.length; _i < _len; _i++) {
          i = date[_i];
          if (i.type === type) {
            output[_i] = i;
          }
        }
        return output;
      }
      return date;
    };
  });

  parseTitle = function(data) {
    var key, line, r, value, _i, _len, _ref, _ref1;
    r = {
      title: "",
      type: "",
      tag: "",
      disc: "",
      url: "",
      hide: ""
    };
    _ref = data.split('\n');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      _ref1 = line.split(':'), key = _ref1[0], value = _ref1[1];
      key = _.str.trim(key);
      value = _.str.trim(value);
      if (r.hasOwnProperty(key)) {
        r[key] = value;
      }
    }
    r.date = r.url.split('-');
    r.date.month = parseInt(r.date[1], 10);
    r.date.day = parseInt(r.date[2], 10);
    return r;
  };

  parseList = function(data) {
    return _.map(data.split(/\n[\-=]+/), parseTitle);
  };

  listCtrl = function($scope, $http) {};

  listCtrl.$inject = ['$scope', '$http'];

  parsePost = function(text) {
    var flag, head, line, post, tail, _i, _len, _ref;
    flag = false;
    head = "";
    tail = "";
    _ref = text.split('\n');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      if (/[\-=]+/.test(line)) {
        flag = true;
      }
      if (flag) {
        tail += '\n' + line + '\n';
      } else {
        head += '\n' + line + '\n';
      }
    }
    post = parseTitle(head);
    post.text = tail;
    if (post.hide === 'true') {
      return;
    }
    return post;
  };

  postCtrl = function($scope, $http, $routeParams) {
    $scope.name = $routeParams.name;
    $http.get('post/' + $scope.name).success(function(data) {
      $scope.post = parsePost(data);
      return toggleDuoshuoComments('.blog-container');
    });
    return 
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
        
    };
  };

  postCtrl.$inject = ['$scope', '$http', '$routeParams'];

  indexCtrl = function($scope, $http, $routeParams) {
    var Scroll2Top;
    $scope.type = $routeParams;
    window.w = $scope;
    $http.get("post/list.md").success(function(data) {
      $scope.blogList = _.filter(parseList(data), function(it) {
        return it.hide !== 'true';
      });
      $scope.listType = _.uniq(_.pluck($scope.blogList, 'type'));
      return console.log($scope.listType);
    });
    Scroll2Top = function() {
      return window.scrollTo(0, $(window).height() * 1.4);
    };
    return $('#fix-height').css('min-height', $(window).height());
  };

  indexCtrl.$inject = ['$scope', '$http', '$routeParams'];

  myblogApp.controller('listCtrl', listCtrl);

  myblogApp.controller('postCtrl', postCtrl);

  myblogApp.controller('indexCtrl', indexCtrl);

}).call(this);
