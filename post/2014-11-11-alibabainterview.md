title:[转][面经]
disc:已拿到阿里前端offer，发个面经。
type:HTML&CSS
------------------

--------------------------------------
######这篇文章是我去年11月转的，转眼间四个月过去我现在真的拿到了阿里的offer，想想应该是幸运总是眷顾努力的人吧╮(╯▽╰)╭

--------------------------------------

下午收到了阿里短信，说是这两天沟通offer细节，提示电话保持畅通之类的。晚上空闲下来，来发个前端面经，看官轻拍。 

楼主面试经验浅薄，只面过百度、创新工场两个地方，连带实习面试，不超过10次，经验有限，干货不多，有用的您打包带走，没用的您当看篇闲文。 

楼主本科，实习过百度，成绩平平（中下等之流），热爱前端开发，项目做过不少，实战经验比较足。 

大概8月中旬的时候，淘宝UED出了个Web版的智勇大冲关，当时技术群里的人都在玩，试着去看了下，是一个Web版的密室大逃脱，通过各种查看源码，分析，拿到下一关的入口地址。试着玩了下，闯了四关，卡壳了，便放那不管了。过了几天想起这么档子事儿，点进那个URL，发现内容变了，成了阿里校招的在线笔试。遂花了一个小时做了十道在线笔试题。题目不是很难，主观题大概占五分之二，不过时间有些紧，做完看看够用的样子。当然，做题期间也是各种百度谷歌。。。 

做完就没在理会了。9月15号收到了HR的面试邀约，恰好上午有事儿，实在抹不开，推说时间冲突，不能去。挂了电话，另一个HR又打了回来，协调到了下午。下午两点到的，当时大概有二十人在“侠客岛”等着面试，一问，大部分都是在等二面，看来是大部分一面都安排在了上午。中午居然管饭，没蹭上多少有些遗憾。。。 

在外面等着的时候，HR妹妹殷勤滴切来水果，各种友好让人心快神怡。期间，面试官出“岛”领人，居然发现了面试官有前端大神“寒冬”--人称计子（计算机之子，阿里P8高级工程师）。搞前端的应该都晓得这位大神，就前不久还在微博上吐槽面试，提了一大堆当时还不是很熟悉的名词：normal flow、containing block、bfc、margin collapse，base line，writing mode，bidi之类的。还与玉伯大神（淘宝KISSY框架创始人、SeaJs作者、犀牛书的翻译之一）关于前端招聘是否需要抛出一堆工业标准来为难面试者做了一番争执，起因仅仅是因为计子的一句“面试的时候问个css的position属性能刷掉一半的人这是啥情况…”吐槽。当时一一谷歌了下这些名词，和以往所学稍加印证，当真是受益匪浅。 

当时我邮的一位师兄对计子大神满是崇拜，HR姐姐还劝他俩合影来着，不晓得这位师兄后来面试结果如何。一面面试官是一位很帅的哥哥，面试持续40分钟+，大致问了以下一些问题。 

CSS大概就是围绕position、float、display三个属性展开，问了一些基础的东西。position依旧是relative、absolute和fixed简单描述，谈到了fixed的兼容性。期间我补充了下对于利用position实现垂直居中的另一种解决方案，是之前在网上看到的，我估摸着这是亮点之一。float永恒不变的话题就是清除浮动，谈了下bootstrap的clearfix、overflow:hidden、<div class="clear"></div>等清除浮动方式各自的优劣。display谈到了行内块之间空白间隙的问题，提出了用压缩HTML代码的方式消除，另一种方法是YUI框架首先用的，代码如下：letter-spacing:-0.31em;word-spacing:-0.43em;font-size:0;*letter-spacing:normal；最后补充了一点我在实际项目中遇到的问题，就是HTML5标准下解析行内块，行内块会出现4像素的间隙的问题，提出通过vertical-align:top;来解决。 

JS问了跨域，回答说html具有src属性的标签都能实现跨域，如iframe，img，script,iframe的跨域我直接忽略了，因为我也没用过。。。img的跨域提到了用img来实现跨域计数`<img src="后台请求地址" style="width:0px;height:0px;" />`，重点谈了script的跨域，也就是JSONP。原理神马的网上一大堆，也是之前被技术群里一位大神科普的，自己也没真正去实现过。 

之后展示了一些做过的在线项目，面试官就实际项目提出了一些额外的需求，有的答的还好，有的比较糟糕。 

然后问了对nodejs是否有了解。正好前段时间在钻研nodejs，刚配好环境，研究了下基础的理论。于是巴拉巴拉，把nodejs最大的特点：单线程、非阻塞IO、回调式编程模式等描述了一遍。 

最后问了设计模式，这个楼主完全没接触过，0分。 

一面后直接让出去等二面。出去一看，大部分参加一面的都留了下来。一问才知道，原来昨天一面刷人太多，今天一面几乎都留了下来。。。 

出来四点多了，楼主是最后一波一面的，一面过后，在外面等的全是二面了，还有十个左右。HR开始催面试进度，一面面试官有的都撤了（听HR讲是一面面试官不能帮面二面。。。二面面官可以帮面一面）。二面是计子与另一位不认识的大神主持的。到楼主被派给了计子。。 

计子面了大概15分钟（之前的都是30分钟+，估计是HR催进度的缘故），面完说先到这儿，你走吧。楼主当时心里打鼓，迟疑了下，这是不是跪的节奏，心一狠，赖着不走，说，大神，你看，我还做过这些这些，这些哪儿用了神马神马，又墨迹了五分钟，才在催促下离开了“侠客岛”。。。 

计子面试比较有特色，直接问，你觉得你哪些前端技术比较熟悉，下面的面试将围绕这些话题。楼主小心翼翼滴说了CSS和JS都比较熟悉。CSS前端基本功，不消说，计子举了几种常用的布局让实现。问了一些前面提到的之前不懂的名词（顿时觉得关注大神微博动态是多么的明智！）。JS让现场实现DOM元素的反转。楼主用最笨的方法遍历、压数组、反弹出、生成的队列方式。问完这些，看了下做过的项目，问了一些实际问题，就让我撤了。当时心慌的，面试这么短是跪的节奏啊，赖着墨迹了几分钟，讲了下自己做过的一些觉得比较不错的东西。 

出来就觉得没戏了。果然，节前也没收到通知。索性搁置了这事儿。没想到10号HR打电话过来让11号去参加HR面试，当时心中一喜。 

HR面就比较轻松了。谈心式的讲了学习经历，心路历程，间接窥探楼主滴团队协作能力，是不是容易与人发生冲突，职业发展方向等，一些不利的因素当然都被楼主一一装傻式的规避了。 

最后，就在HR面试后的第二天，10月12号，收到阿里发来的offer短信。 

阿里三面面试经历分享给大家，找工作的加油。