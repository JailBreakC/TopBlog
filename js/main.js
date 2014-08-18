(function() {
  $(function() {
    var $window, BV, b, checkScrollPostioin, isTop, timer, toMid, toTop;
    BV = new $.BigVideo({
      doLoop: true,
      container: $('.head')
    });
    BV.init();
    BV.show('videos/exponent.mp4');
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
        setTimeout((function() {
          return b.css({
            "-webkit-transform": "scale(0)",
            "transform": "scale(0)"
          });
        }), 200);
      }
      if (80 > distance && isTop) {
        isTop = !isTop;
        $('.f-nav').addClass('f-nav-bg');
        toMid($('.mylm'));
        return setTimeout((function() {
          return b.css({
            "-webkit-transform": "scale(1)",
            "transform": "scale(1)"
          });
        }), 200);
      }
    };
    timer = 0;
    return $window.scroll(function() {
      if (!timer) {
        return timer = setTimeout(function() {
          checkScrollPostioin();
          return timer = 0;
        }, 250);
      }
    }).scroll();
  });

}).call(this);
