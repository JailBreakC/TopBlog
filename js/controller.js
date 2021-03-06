(function() {
  var indexCtrl, indexCtrlf, parseList, parsePost, parseTitle, postCtrl, postCtrlf, scrollStuff;

  window.myblogApp = angular.module('myblog', ["ngRoute", "ngAnimate"]);

  myblogApp.config(function($routeProvider, $locationProvider) {
    var list;
    list = "<div class=\"main-bar\">" + "<div apr-animate ng-repeat=\"post in blogList | blogListType : type\" class=\"md\">" + "<div class=\"date\">" + "<p class=\"month\">{{post.date.month}}月</p>" + "<p class=\"day\">{{post.date.day}}</p>" + "</div>" + "<div class=\"md-context\">" + "<h1>{{post.title}}</h1>" + "<div class=\"shot-text\">" + "<p>{{post.disc}}</p>" + "</div>" + "</div>" + "<div class=\"md-foot\">" + "<a ng-click=\"scroll2Top()\" ng-href=\"#/post/{{post.url}}\"><button class=\"pull-right btn btn-danger\">阅读全文</button></a>" + "</div>" + "</div>" + "</div>";
    return $routeProvider.when("/", {
      template: list
    }).when("/type/:type", {
      template: list
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

  myblogApp.directive('markdown', function() {
    return {
      restrict: 'EA',
      scope: {
        content: '=markdownContent'
      },
      link: function(scope, element, attrs) {
        console.log('xxx');
        return scope.$watch((function() {
          return scope.content;
        }), function(newValue) {
          element.html(marked(newValue ? newValue : "#loading..."));
          return element.find('pre>code').each(function(i, block) {
            return hljs.highlightBlock(block);
          });
        });
      }
    };
  });

  myblogApp.directive('markdownlist', function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        return element.html(marked(element.text()));
      }
    };
  });

  myblogApp.directive('aprAnimate', function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        return $(window).scroll(function() {
          var height, pos, top;
          height = $(window).height();
          top = $(window).scrollTop();
          pos = element.offset().top;
          if (pos - top <= height) {
            return element.addClass('upsidedown');
          }
        });
      }
    };
  });

  myblogApp.directive('lazyload', function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        var img;
        console.log(attrs);
        if ($(window).width() > 768) {
          img = new Image();
          img.src = 'images/bk.jpg';
          return img.onload = function() {
            $('.mylm').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
              return $(this).addClass('an-updown');
            });
            return element.attr('src', attrs.lazyload);
          };
        }
      }
    };
  });

  myblogApp.directive('cover', function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        var cover;
        cover = function() {
          var eh, ew, wh, ww;
          ew = element.width();
          ww = $(window).width();
          eh = element.height();
          wh = $(window).height();
          element.css('min-width', wh * ew / eh + 'px');
          if (wh === eh) {
            return element.css('left', '-' + (ew - ww) / 2 + 'px');
          } else {
            return element.css('left', 0);
          }
        };
        cover();
        return window.onresize = function() {
          return cover();
        };
      }
    };
  });

  myblogApp.directive('tracker', function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        element.mouseleave(function() {
          var activeEle, pos;
          activeEle = element.find('.active');
          if (activeEle.length > 0) {
            pos = activeEle.position().top;
          } else {
            pos = 0;
          }
          return $('.float-light').css({
            "top": pos
          });
        });
        return element.on('mouseenter', 'li', function() {
          var pos;
          pos = $(this).position().top;
          return $('.float-light').css({
            "top": pos
          });
        });
      }
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
        tail += '\n' + line;
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

  postCtrlf = function($scope, $http, $routeParams) {
    var toggleDuoshuoComments;
    $scope.name = $routeParams.name;
    $http.get('post/' + $scope.name).success(function(data) {
      $scope.post = parsePost(data);
      return toggleDuoshuoComments('.blog-container');
    });
    return toggleDuoshuoComments = function(container) {
      var el;
      el = document.createElement('div');
      el.setAttribute('id', $scope.name);
      el.setAttribute('data-thread-key', $scope.post.title);
      el.setAttribute('data-url', $scope.name);
      DUOSHUO.EmbedThread(el);
      return jQuery(container).append(el);
    };
  };

  postCtrl = ['$scope', '$http', '$routeParams', postCtrlf];

  indexCtrlf = function($scope, $http, $routeParams) {
    $scope.type = $routeParams;
    window.w = $scope;
    $http.get("post/list.md").success(function(data) {
      console.log('indexCtrl');
      $scope.blogList = _.filter(parseList(data), function(it) {
        return it.hide !== 'true';
      });
      return $scope.listType = _.uniq(_.pluck($scope.blogList, 'type'));
    });
    scrollStuff(angular.element);
    $scope.scroll2Top = function(ele) {
      $('.silder-list li').removeClass('active');
      $(ele).addClass('active');
      window.scrollTo(0, $(window).height() * 1.4);
      return setTimeout(function() {
        return $(window).trigger('scroll');
      }, 500);
    };
    $scope.showQQ = function(ele) {
      return $(ele).html('610164407').wrap('<a href="tencent://message/?uin=610164407&Menu=yes"></a>');
    };
    return $('#fix-height').css('min-height', $(window).height());
  };

  indexCtrl = ['$scope', '$http', '$routeParams', indexCtrlf];

  myblogApp.controller('postCtrl', postCtrl);

  myblogApp.controller('indexCtrl', indexCtrl);

  scrollStuff = function() {
    var BV, ScrollController, pageScroll, positionSetter;
    BV = $('#bk-video')[0];
    $.stellar();
    ScrollController = function() {
      var $footer, $silder, $window, b, fixSilder, getbigAvatar, getsmallAvatar, isFix, isPlay, isTop, playBV, silderOriginalH, stopBV, toMid, toTop, unfixSilder;
      $window = $(window);
      b = $('.head-container');
      silderOriginalH = $('.left-bar').offset().top;
      $footer = $('.foot-bar');
      $silder = $('.left-bar');
      isTop = 0;
      isFix = 0;
      isPlay = 1;
      toTop = function(ele) {
        ele.removeClass('mylm-in').addClass('mylm-top');
        return $('.mylm-arr').fadeIn(500);
      };
      toMid = function(ele) {
        ele.removeClass('mylm-top');
        return $('.mylm-arr').fadeOut(100);
      };
      fixSilder = function() {
        var silderWidth;
        silderWidth = $silder.width();
        $silder.addClass('fixTop');
        $silder.width(silderWidth);
        return isFix = !isFix;
      };
      unfixSilder = function() {
        $silder.removeClass('fixTop');
        return isFix = !isFix;
      };
      playBV = function() {
        isPlay = !isPlay;
        return BV.pause();
      };
      stopBV = function() {
        isPlay = !isPlay;
        return BV.play();
      };
      getbigAvatar = function() {
        isTop = !isTop;
        $('.f-nav').removeClass('f-nav-bg');
        toTop($('.mylm'));
        return b.css({
          "-webkit-transform": "scale(0)",
          "transform": "scale(0)"
        });
      };
      getsmallAvatar = function() {
        isTop = !isTop;
        $('.f-nav').addClass('f-nav-bg');
        b.css({
          "-webkit-transform": "scale(1)",
          "transform": "scale(1)"
        });
        return setTimeout((function() {
          return toMid($('.mylm'));
        }), 100);
      };
      return function() {
        var distance, footerH, silderH, silderHeight;
        distance = $(window).scrollTop();
        silderH = $silder.offset().top;
        silderHeight = $silder.height();
        footerH = $footer.offset().top;
        if ($(window).width() >= 768) {
          if ((silderH <= distance + 50) && (silderHeight <= footerH - distance) && !isFix) {
            fixSilder();
          }
          if (((silderOriginalH > distance + 50) || (silderHeight > footerH - distance - 50)) && isFix) {
            unfixSilder();
          }
        }
        if (BV) {
          if (distance >= $(window).height() && isPlay) {
            playBV();
          }
          if (distance < $(window).height() && !isPlay) {
            stopBV();
          }
        }
        if (80 <= distance && !isTop) {
          getbigAvatar();
        }
        if (80 > distance && isTop) {
          return getsmallAvatar();
        }
      };
    };
    positionSetter = new ScrollController();
    (function() {
      var timer;
      timer = 0;
      return $(window).scroll(function() {
        if (!timer) {
          return timer = setTimeout(function() {
            positionSetter();
            return timer = 0;
          }, 0);
        }
      }).scroll();
    })();
    pageScroll = function() {
      var scrolldelay;
      if ($(window).scrollTop() <= 0) {
        return clearTimeout(scrolldelay);
      } else {
        window.scrollBy(0, -100);
        return scrolldelay = setTimeout(pageScroll, 10);
      }
    };
    return $('.mylm').click(function() {
      return pageScroll();
    });
  };

}).call(this);
