(function() {
  $(function() {
    var BV, pageScroll;
    BV = new $.BigVideo({
      doLoop: true,
      container: $('.head')
    });
    BV.init();
    BV.show('videos/exponent.mp4');
    $.stellar();
    $('.mylm').hover((function() {
      return $(this).addClass("mylm-active");
    }), function() {
      return $(this).removeClass("mylm-active");
    });
    $('.mylm').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
      return $(this).addClass('an-updown');
    });
    $('.silder-list>li').each(function() {
      return $(this).hover((function() {
        var index;
        index = $(this).position().top;
        return $('.float-light').css({
          "top": index
        });
      }), function() {});
    });
    $('.silder-list').hover((function() {}), function() {
      var index;
      index = $('.silder-list').find('.active').position().top;
      return $('.float-light').css({
        "top": index
      });
    });
    (function() {
      var $silder, $window, b, checkScrollPostioin, isFix, isPlay, isTop, silderOriginalH, timer, toMid, toTop;
      $window = $(window);
      isTop = 0;
      isFix = 0;
      isPlay = 1;
      toTop = function(ele) {
        ele.removeClass('mylm-in').addClass('mylm-top');
        return $('.mylm-arr').fadeIn(500);
      };
      toMid = function(ele) {
        ele.removeClass('mylm-top');
        $('.mylm-arr').fadeOut(100);
        return BV.getPlayer().play();
      };
      b = $('.head-container');
      $silder = $('.left-bar');
      silderOriginalH = $silder.offset().top;
      checkScrollPostioin = function() {
        var distance, silderH;
        distance = $window.scrollTop();
        silderH = $silder.offset().top;
        if (silderH <= distance + 50 && !isFix) {
          $silder.addClass('fixTop');
          isFix = !isFix;
        }
        if (silderOriginalH > distance + 50 && isFix) {
          $silder.removeClass('fixTop');
          isFix = !isFix;
        }
        if (distance >= $(window).height() && isPlay) {
          isPlay = !isPlay;
          BV.getPlayer().pause();
        }
        if (distance < $(window).height() && !isPlay) {
          isPlay = !isPlay;
          BV.getPlayer().play();
        }
        if (80 <= distance && !isTop) {
          isTop = !isTop;
          $('.f-nav').removeClass('f-nav-bg');
          toTop($('.mylm'));
          b.css({
            "-webkit-transform": "scale(0)",
            "transform": "scale(0)"
          });
        }
        if (80 > distance && isTop) {
          isTop = !isTop;
          $('.f-nav').addClass('f-nav-bg');
          b.css({
            "-webkit-transform": "scale(1)",
            "transform": "scale(1)"
          });
          return setTimeout((function() {
            return toMid($('.mylm'));
          }), 100);
        }
      };
      timer = 0;
      return $window.scroll(function() {
        if (!timer) {
          return timer = setTimeout(function() {
            checkScrollPostioin();
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
