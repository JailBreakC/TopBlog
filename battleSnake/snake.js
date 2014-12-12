$(function(){
    var init, direction, parentWidth, parentHeight, eleWidth, handler, score;

    //初始化游戏
    window.snake = function(speed) {
        speed = speed || 500;
        var init = function() {
            var start = 0;
            var key;
            var AIHandle;
            score = 0;
            //删除已有蛇、食物和子弹
            $('.snake, #food, .bullet, .monster').remove();
            $(window).unbind('keydown');
            clearInterval(handler);
            clearInterval(AIHandle);
            //新建蛇
            var snake = document.createElement('div');
            $(snake).addClass('snake').attr('id', 'now').appendTo('.squre');

            var insertNode = addNode(snake);

            parentWidth = $('.squre').width();
            parentHeight = $('.squre').height();
            eleWidth = $('.snake').width();

            generateFood();
            generateMonster();
            AIHandle = monsterAI(speed);

            var move = function(){
                if(start)
                    insertNode(key);
            };

            $(window).keydown(function(event){
                key = event.keyCode;
                console.log(key);
                if(key === 32){
                    shoot(direction ,speed);
                }
                start = 1;
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

    //检查是否撞到自己或者怪物 [x][y]蛇头所在位置
    var isHit = function(x, y) {
        var state = false;
        $('.snake:not(#now), .monster').each(function(index, ele) {
            if($(ele).position().left === x && $(ele).position().top === y){
                state =  true;
            }
        });
        return state;
    };

    //移动位置 [dire]方向 [$this]蛇头元素
    var crawl = function(dire, $this) {
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
            generateFood();
        }else{
            $this.removeAttr('id');
            //删除蛇尾巴
            $('.snake').eq(0).remove();
        }
        //撞到自己就输了
        if(isHit(left, top)){
            $('.snake').css('background-color','red');
            alert('不服！我要再来！');
            init();
            return false;
        }
        //返回新蛇头元素
        return newEle;
    };

    //增加蛇身节点构造函数。 [snake]初始蛇头元素
    var addNode = function(ele) {
        var oldDire = 0;
        var $this = $(ele);
        //返回一个方法，增加蛇身节点。[dire]移动方向
        return function(dire){
            if((dire === 37 && oldDire === 39 || dire === 38 && oldDire === 40) ||
                (dire === 39 && oldDire === 37 || dire === 40 && oldDire === 38) ||
                (dire < 37 || dire > 40))
                dire = oldDire;
            else{
                oldDire = dire;
            }
            if($this){
                switch(dire){
                    case 37: $this = crawl('left', $this); break;
                    case 38: $this = crawl('up', $this); break;
                    case 39: $this = crawl('right', $this); break;
                    case 40: $this = crawl('down', $this); break;
                }
                direction = dire;
            }
        }
    };

    //发射子弹子弹
    var moveBullet = function(ele, dire, speed) {
        var $this = $(ele), bulletHandler, clean = 0;
        var left = $('#now').position().left,
            top = $('#now').position().top;
        //移动子弹
        var moving = function(){
            switch(dire){
                case 37:{if(left === 0) clean = 1; else left -= eleWidth;}; break;
                case 39:{if(left === parentWidth - 20) clean = 1; else left += eleWidth;}; break;
                case 38:{if(top === 0) clean = 1; else top -= eleWidth;}; break;
                case 40:{if(top === parentHeight - 20) clean = 1; else top += eleWidth;}; break;
            }
            if(!clean){
                $this.css({'left': left + 'px', 'top': top + 'px'});
                if(isShooted(left, top)){
                    //消灭怪物加分！
                    score++;
                    $('.score').text(score*50);
                    clean = 1;
                    $this.remove();
                }
            }
            else{
                clearInterval(bulletHandler);
                $this.remove();
            }
        }
        bulletHandler = setInterval(moving, speed * 0.3);
    };
    //射击模块
    var shoot = function(dire, speed) {
        if($('.snake').length>1){
            $('.snake').eq(0).remove();
            var bullet = document.createElement('div');
            $(bullet).addClass('bullet').appendTo('.squre');
            moveBullet(bullet, dire, speed);
        }
    }
    //生成怪物 
    var generateMonster = function() {
        var x = Math.floor(parentWidth/eleWidth * Math.random());
        var y = Math.floor(parentHeight/eleWidth * Math.random());
        var monster = document.createElement('div');
        $(monster).css({'left': x * eleWidth + 'px', 'top': y * eleWidth + 'px'});
        $(monster).attr('class', 'monster');
        $('.squre').append(monster);
    }

    //怪物AI
    var monsterAI = function(speed) {
        var moving = function(){
            $('.monster').each(function(index,ele){
                var dire,
                    $this = $(ele),
                    left = $('#now').position().left,
                    top = $('#now').position().top;
                var mX = $this.position().left,
                    mY = $this.position().top;
                var X = mX - left,
                    Y = mY - top,
                    abs = Math.abs;
                if(X >= 0 && Y >= 0){
                    if(abs(X) - abs(Y) > 0)
                        dire = 'left';
                    else
                        dire = 'up';
                } else if(X >= 0 && Y <= 0){
                    if(abs(X) - abs(Y) > 0)
                        dire = 'left';
                    else
                        dire = 'down';
                } else if(X <= 0 && Y >= 0){
                    if(abs(X) - abs(Y) > 0)
                        dire = 'right';
                    else
                        dire = 'up';
                } else if(X <= 0 && Y <= 0){
                    if(abs(X) - abs(Y) > 0)
                        dire = 'right';
                    else
                        dire = 'down';
                }
                switch(dire){
                    case 'left':{mX -= eleWidth;}; break;
                    case 'right':{mX += eleWidth;}; break;
                    case 'up':{mY -= eleWidth;}; break;
                    case 'down':{mY += eleWidth;}; break;
                }             
                $this.css({'left':mX + 'px', 'top': mY + 'px'});
            });
        }
        return monsterHander = setInterval(moving, speed * 1.5);
    }
    //子弹击中
    var isShooted = function(x, y) {
        var state = false;
        $('.monster').each(function(index, ele) {
            if($(ele).position().left === x && $(ele).position().top === y){
                $(ele).remove();
                generateMonster();
                generateMonster();
                state =  true;
            }
        });
        return state;
    };
    //初始化，难度选择
    init = snake(300).init;
    $('button').click(function(){
        var time;
        switch($(this).attr('id')){
            case 'simple': time = 500; break;
            case 'middle': time = 300; break;
            case 'hard': time = 150; break;
            case 'shit': time = 50; break;
            case 'asshole': time = 20; break;
        }
        //在点击后清除元素焦点，否则按空格会触发点击事件
        $(this).blur();
        init = snake(time).init;
        init();
    })
    init();
});