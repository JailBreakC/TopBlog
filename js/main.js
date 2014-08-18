(function() {
  $(function() {
    var $window, BV, b, checkScrollPostioin, isTop, pageScroll, scrolldelay, timer, toMid, toTop;
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
    $window = $(window);
    isTop = 0;
    toTop = function(ele) {
      ele.removeClass('mylm-in').addClass('mylm-top');
      return $('.mylm-arr').fadeIn(500);
    };
    toMid = function(ele) {
      ele.removeClass('mylm-top');
      return $('.mylm-arr').fadeOut(100);
    };
    b = $('.head-container');
    checkScrollPostioin = function() {
      var distance;
      distance = $window.scrollTop();
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
    $window.scroll(function() {
      if (!timer) {
        return timer = setTimeout(function() {
          checkScrollPostioin();
          return timer = 0;
        }, 250);
      }
    }).scroll();
    scrolldelay = 0;
    pageScroll = function() {
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
