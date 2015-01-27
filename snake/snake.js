$(function(){
    var init, parentWidth, parentHeight, eleWidth, handler, score;

    //初始化游戏
    window.snake = function(speed) {
        speed = speed || 500;
        var init = function() {
            var start = 0;
            var key;
            score = 0;
            //删除已有蛇和食物
            $('.snake, #food').remove();
            clearInterval(handler);
            //新建蛇
            var snake = document.createElement('div');
            $(snake).addClass('snake').attr('id', 'now').appendTo('.squre');

            var insertNode = addNode(snake);

            parentWidth = $('.squre').width();
            parentHeight = $('.squre').height();
            eleWidth = $('.snake').width();

            generateFood();

            var move = function(){
                if(start)
                    insertNode(key);
            };

            $(window).keydown(function(event){
                start = 1;
                key = event.keyCode;
                console.log(key);
            });

            handler = setInterval(move, speed);
        }
        return {init:init}
    };

    //生成食物
    var generateFood = function() {
        var x = Math.floor(parentWidth/eleWidth * Math.random());
        var y = Math.floor(parentHeight/eleWidth * Math.random());
        var food = document.createElement('div');
        $(food).css({'left': x * eleWidth + 'px', 'top': y * eleWidth + 'px'});
        $(food).attr('id', 'food');
        $('.squre').append(food);
    };

    //检查食物是否被吃掉 [$this]蛇头元素
    var checkFood = function($this) {
        if($this.position().left === $('#food').position().left && $this.position().top === $('#food').position().top)
            return true;
        return false;
    };

    //检查是否撞到自己 [x][y]蛇头所在位置
    var isHit = function(x, y) {
        var state = false;
        $('.snake:not(#now)').each(function(index, ele) {
            if($(ele).position().left === x && $(ele).position().top === y){                
                state =  true;
            }
        });
        return state;
    };

    //移动位置 [dire]方向 [$this]蛇头元素
    var changePosition = function(dire, $this) {
        var newEle = $this.clone(),
            left = $this.css('left'),
            top = $this.css('top');

        newEle.css('left', left);
        newEle.css('top', top);
        left = parseInt(left, 10);
        top = parseInt(top, 10);

        //设定蛇头前进方向,处理穿墙的情况
        switch(dire){
            case 'left':{if(left === 0) left = parentWidth - 20; else left -= eleWidth;}; break;
            case 'right':{if(left === parentWidth - 20) left = 0; else left += eleWidth;}; break;
            case 'up':{if(top === 0) top = parentHeight - 20; else top -= eleWidth;}; break;
            case 'down':{if(top === parentHeight - 20) top = 0; else top += eleWidth;}; break;
        }
            
        //蛇头按方向前进
        $('.squre').append(newEle);

        newEle.css({'left': left + 'px', 'top': top + 'px'});

        if(checkFood(newEle)){
            $('#food').remove();
            //蛇头变成蛇身，清除id
            $this.removeAttr('id');
            //迟到吃到东西加分！
            score++;
            $('.score').text(score*50);
            generateFood();
        }else{
            $this.removeAttr('id');
            //删除蛇尾巴
            $('.snake').eq(0).remove();
        }
        //撞到自己就输了
        if(isHit(left, top)){
            $('.snake').css('background-color','red');
            alert('菜B，就不行了！');
            init();
            return false;
        }
        //返回新蛇头元素
        return newEle;
    };

    //增加蛇身节点构造函数。 [snake]初始蛇头元素
    var addNode = function(snake) {
        var oldDire = 0;
        var $this = $(snake);
        //返回一个方法，增加蛇身节点。[dire]移动方向
        return function(dire){
            if((dire === 37 && oldDire === 39 || dire === 38 && oldDire === 40) ||
                (dire === 39 && oldDire === 37 || dire === 40 && oldDire === 38))
                dire = oldDire;
            else{
                oldDire = dire;
            }
            if($this){
                switch(dire){
                    case 37: $this = changePosition('left', $this); break;
                    case 38: $this = changePosition('up', $this); break;
                    case 39: $this = changePosition('right', $this); break;
                    case 40: $this = changePosition('down', $this); break;
                }
            }
        }
    };

    //初始化，难度选择
    init = snake(500).init;
    $('button').click(function(){
        var time;
        switch($(this).attr('id')){
            case 'simple': time = 500; break;
            case 'middle': time = 300; break;
            case 'hard': time = 150; break;
            case 'shit': time = 50; break;
            case 'asshole': time = 20; break;
        }
        init = snake(time).init;
        init();
    })
    init();
});