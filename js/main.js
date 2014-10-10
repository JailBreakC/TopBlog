(function() {
  $(function() {
    var BV, ScrollController, pageScroll, positionSetter;
    BV = false;
    if ($(window).width() > 768) {
      setTimeout((function() {
        var videos;
        BV = new $.BigVideo({
          doLoop: true,
          container: $('.head')
        });
        BV.init();
        videos = "http://topblog.qiniudn.com/exponent.mp4";
        return BV.show(videos);
      }), 1000);
      $.stellar();
    }
    $('.mylm').hover((function() {
      return $(this).addClass("mylm-active");
    }), function() {
      return $(this).removeClass("mylm-active");
    });
    $('.mylm').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
      return $(this).addClass('an-updown');
    });
    $('.silder-list').on('click', 'a', function() {
      var $thisA;
      $thisA = $(this);
      $('.silder-list li').removeClass('active');
      $thisA.children().addClass('active');
      return window.scrollTo(0, $(window).height() * 1.4);
    });
    $('.silder-list').on('mouseenter', 'li', function() {
      var index;
      index = $(this).position().top;
      return $('.float-light').css({
        "top": index
      });
    });
    $('.silder-list').hover((function() {}), function() {
      var activeEle, index;
      activeEle = $('.silder-list').find('.active');
      if (activeEle.length > 0) {
        index = activeEle.position().top;
      } else {
        index = 0;
      }
      return $('.float-light').css({
        "top": index
      });
    });
    $('.QQ').click(function() {
      return $(this).html('610164407').wrap('<a href="tencent://message/?uin=610164407&Menu=yes"></a>');
    });
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
        return BV.getPlayer().pause();
      };
      stopBV = function() {
        isPlay = !isPlay;
        return BV.getPlayer().play();
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
  });

}).call(this);
