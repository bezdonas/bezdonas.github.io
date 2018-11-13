var oldie = $('html').hasClass('lt-ie9');
var istouch = !$('html').hasClass('no-touch');

$(function() {
	$('.screennav').cheburashka(); // кнопки-навигации 
	$('.mainpage').mainpage({}); // морда, главный экран
	$('.mainspecial').mainspecial({}); // морда, экран справа 
	$('.mainportfolio').mainportfolio({}); // экран с портфолио
	$('.maincompany').maincompany({}); // экран с компанией
}); // DOM loaded

$(window).load(function(){ 
	// preload any backgrounds
        var bg = ['./i/main_specialization_bg_1500.png', './i/main_specialization_bg_2200.png', './i/main_specialization_bg_3000.png'];
        for (var i=0; i<bg.length; i++) {
        	var img = new Image();
        	img.src = bg[i];
        }
});


function arrayShuffle(a) {
	var d, c, b = a.length;
	while (b) { c = Math.floor(Math.random() * b); d = a[--b]; a[b] = a[c]; a[c] = d; }
	return a;
}


(function($) { //create closure
$.fn.flexiblecontent = function(options){
	this.each(function(){
		var defaults = {
			obj: {},
			w: 980, // ширина по умолчанию
			h: 830, // высота по умолчанию
			sX: 1, // scale X
			sY: 1, // scale Y
			autoresize: true, // отслеживать ресайз окна
			root: $(window)
		};
		var errors = 0; var msg='';
		var o = $.extend(defaults, options);
		var W = o.root, obj = $(o.obj);
		var asprateFlex = Math.max(o.h, o.w) / Math.min(o.h, o.w);
// console.log('src:'+obj.attr('src')+' o.w:'+o.w+' o.h:'+o.h);
		function mainscale() {
			var Ww = W.width(), Wh = W.height();
			asprateWindow = (Ww>Wh) ? Math.max(Wh, Ww) / Math.min(Wh, Ww) : Math.min(Wh, Ww) / Math.max(Wh, Ww),
			scale = (asprateWindow >= asprateFlex)? Wh/o.h : Ww/o.w;
			obj.css({width: ((asprateWindow>=asprateFlex)? Math.max(Ww,o.w):'auto'), height: ((asprateWindow>=asprateFlex)? 'auto':Math.max(Wh,o.h))});
			obj.css({'margin-top': -obj.height()/2, 'margin-left': -obj.width()/2});
		}
		mainscale();
		if (o.autoresize && !oldie) {
			W.bind('resize',function(){
				mainscale();
			});
		}
	});
}
//end of closure
})(jQuery);










/* =====  MAIN PAGE ====*/

(function($) { //create closure
$.fn.mainpage = function(options){
	this.each(function(){
		$('.mainlocalnav a', $(this)).mainlocalnav(); // кнопки навигации на морде
		if (BrowserDetect.browser == 'Safari' && BrowserDetect.version < 6) { // safari под win не масштабирует svg внутри object
			$('.logo, .logo_giant').each(function(){
				var logo = $(this), obj = logo.find('object');
				$('<img src="'+obj.attr('data')+'" />').appendTo(logo);
				obj.remove();
			});
		}
		$(this).bind('aftershow', function(){
			try {  // меняем лого
				var svgobject = ($('.logo object').get(0)).getSVGDocument();
				if (svgobject) {
					svgobject.rootElement.id = 'NOTAMEDIA_LOGO';
				}
			} catch(e) {}
		});
	});
}
//end of closure
})(jQuery);

(function($) { //create closure
$.fn.mainspecial = function(options){
	this.each(function(){
		$('.casecarousel', $(this)).casecarousel(); // карусель в кейсах специализации на морде
		$('.aboutspec > ul', $(this)).hoverexpand(); // меню в специализации на морде
		$(this).bind('aftershow', function(){
			try {  // меняем лого
				var svgobject = ($('.logo object').get(0)).getSVGDocument();
				if (svgobject) {
					svgobject.rootElement.id = 'NOTAMEDIA_LOGO2';
				}
			} catch(e) {}
		});
	});
}
//end of closure
})(jQuery);


/* mainportfolio */
(function($) { //create closure
$.fn.mainportfolio = function(options){
	this.each(function(n){
		var screen = $(this), itemset = screen.find('.imgset'), lock = false, scaleOut = 25, scaleIn = 1.1,
		nav = $('<div class="carnav" />').appendTo(screen.find('.portfoliomenu')), hoverstyle = $('.hoverstyle.toleft .aside');
											// hoverstyle - кусок фона для ховера на главном экране
											$('<img src="" /><div class="gridmask" />').appendTo(hoverstyle);
											hoverstyle = $('img',hoverstyle);

		$(this).bind('aftershow', function(){
			try {  // меняем лого
				var svgobject = ($('.logo object').get(0)).getSVGDocument();
				if (svgobject) {
					svgobject.rootElement.id = 'NOTAMEDIA_LOGO1';
				}
			} catch(e) {}
		});
		var TT, WND = $(window); // скролл колесом мыши
		screen.bind('mousewheel', function(e, delta, deltaX, deltaY){
//			e.preventDefault();
			window.clearTimeout(TT);
			TT = window.setTimeout(function(){
				if (deltaY < 0 && WND.scrollTop() + WND.height() != screen.height() ||
					 deltaY > 0 && WND.scrollTop()) return false;
					e.preventDefault();

				if (lock==true) { return false; }
				var acurr = nav.find('.current'), // найти current и направление скролла
				next = (deltaY > 0) ? acurr.prev() : acurr.next();
				if (next.length < 1) {
					next = (deltaY > 0 && acurr.index()==0) ? nav.find('a:last') : nav.find('a:first');
				}
				if (next.length > 0) {
					next.click(); // кликнуть по ссылке в меню
				}
			}, 100);
		});


		if (istouch) {
			var TTT;
			document.body.ontouchstart = function(e){
				_ipadY = e.targetTouches[0].pageY;
				_ipadX = e.targetTouches[0].pageX;
			}
			document.body.ontouchmove = function(e){
				if ($(e.target).parents('.mainportfolio.current').length > 0 && _ipadX < $(window).width()*.75) {
					e.preventDefault();
					if (lock==true || Math.abs(_ipadY - e.targetTouches[0].pageY) <= Math.abs(_ipadX - e.targetTouches[0].pageX)) return false;
					window.clearTimeout(TTT);
					TTT = window.setTimeout(function(){
						var acurr = $(nav.find('.current')), 
						next = (_ipadY - e.targetTouches[0].pageY < 0) ? acurr.prev() : acurr.next();
						if (next.length < 1) {
							next = (_ipadY - e.targetTouches[0].pageY < 0 && acurr.index()==0) ? nav.find('a:last') : nav.find('a:first');
						}
						if (next.length > 0) next.click(); // кликнуть по следующей ссылке в меню
					}, 100);
				}
			}
		}

		
		itemset.each(function(i) {
			var cont = $(this), item = cont.children('.item'), img = item.children('img.flexbg');
			var a = $('<a href=""></a>').appendTo(nav);
			if (i==0) { 
				cont.addClass('current'); a.addClass('current');
				hoverstyle.attr('src',img.attr('src'));
			}
		        var fleximg = new Image(), imgloaded = false;
		        fleximg.src = img.attr('src');
			$(fleximg).load(function(){
				imgloaded = true;
				img.flexiblecontent({obj:img, w:fleximg.width, h:fleximg.height, root:screen});
			});
			try {
				if (fleximg.complete && !imgloaded) {
					$(fleximg).trigger('load');
				}
			} catch (e) {
			}

			screen.bind('beforeshow', function(){
				img.flexiblecontent({obj:img, w:fleximg.width, h:fleximg.height, root:screen, autoresize: false});
			});
			img.after('<div class="itemshadow"><div class="gridmask"></div></div>');
                        a.click(function(e){
                        	e.preventDefault();
                        	if (a.hasClass('current') || lock==true) return;
                        	lock = true;
				var current = screen.find('.imgset.current'), currentEL = $('.flexbg, .aboutitem', current),
				contEL = $('.flexbg, .aboutitem', cont); 
				$.scrollTo(0, 300, {onAfter: function(){}});
				if (!oldie && !(BrowserDetect.browser=='Safari' && BrowserDetect.version < 6 && istouch)) {
					current.addClass('inaction');
					currentEL.css({'transform' : 'scale('+scaleOut+','+scaleOut+')'});
					current.css('opacity',0);
					contEL.css({'transform' : 'scale('+scaleIn+','+scaleIn+')'});
					cont.css({'z-index':2, opacity:.3})
					window.setTimeout(function(){
						cont.addClass('inaction');
	        	                	contEL.css({'transform' : 'scale(1,1)'});
	        	                	cont.css({opacity: 1});
						nav.find('.current').removeClass('current');
					},150);
					window.setTimeout(function(){
						current.removeClass('inaction').removeClass('current');
						cont.removeClass('inaction').addClass('current');
	        	                	itemset.css({opacity: '','z-index':''});
	        	                	$('.flexbg, .aboutitem', itemset).css({'transform' : ''});
						a.addClass('current');
						hoverstyle.attr('src',img.attr('src'));
		                        	lock = false;
					},900);
				} else {
					current.removeClass('current');
					cont.addClass('current');
					nav.find('.current').removeClass('current');
					a.addClass('current');
					hoverstyle.attr('src',img.attr('src'));
		                        lock = false;
				}
			});
		});
	});
}
//end of closure
})(jQuery);




(function($) { //create closure
$.fn.cheburashka = function(options){
	this.each(function(){
		var cont = $(this), div = cont.find('div > div'), t, BODY = $('body');
                div.each(function(){
                	$(this).mouseenter(function(){ 
                		window.clearTimeout(t);
                		cont.addClass('hover'); 
                	}).mouseleave(function(){ 
                		t = window.setTimeout(function(){
                			cont.removeClass('hover'); 
               			}, 700);
                	});
                	$('A',$(this)).click(function(e){
				e.preventDefault();
				if (!$(this).parent().hasClass('current')) BODY.trigger({type:'changescreen', step:1, href: $(this).attr('href')});
                	});
                });
                var current = $('#mainpage');
                current.addClass('current').css('display','block');
                BODY.addClass('manyscreen').addClass(current.data('bodyclass'));
                //
                BODY.bind('changescreen', function(e){
                	if (BODY.data('inaction')=='true') return false;
			$('.overinitiator').trigger('cancelhover'); // отменить все всплывашки 
                	BODY.data('inaction','true').addClass('inaction'); // заблокировать клики на время анимации
			switch (e.step) {
				case 1: 
			               	var newscreen = $('section'+e.href), // новый экран
		                	oldscreen = $('section.current'), // старый экран
		                	main = $('.main'),
		                	H = main.height(), W = main.width(),
		                	T = 1500;
					if (newscreen.length > 0 && oldscreen.length > 0) {
						cont.find('.current').removeClass('current'); // убрать current из навигации

						var hbg = $('.header_bg'), osmargin = {'margin': '0 0 0 0'};
						var dir = { }; // направление перемещения конструкции 'новый + старый' экраны
						dir.X = (newscreen.data('dirx') == '0') ? 'n' : (
							(newscreen.data('dirx')*1 > 0)? 'l' : 'r'); // 'l' - влево, 'r' - вправо, 'n' - не меняется
						dir.Y = (newscreen.data('diry') == '0') ? 'n' : (
							(newscreen.data('diry')*1 > 0)? 't' : 'b'); // 't' - вверх, 'b' - вниз, 'n' - не меняется

						if (dir.X == dir.Y) {
							dir.X = (oldscreen.data('dirx') == '0') ? 'n' : (
								(oldscreen.data('dirx')*1 > 0)? 'r' : 'l'); // 'l' - влево, 'r' - вправо, 'n' - не меняется
							dir.Y = (oldscreen.data('diry') == '0') ? 'n' : (
								(oldscreen.data('diry')*1 > 0)? 'b' : 't'); // 't' - вверх, 'b' - вниз, 'n' - не меняется
						}
						newscreen.css({'display':'block', 'z-index': 3,
								'margin-top': ((dir.Y=='n'&&dir.X!='n')? 0 : ((dir.Y=='t')?H:-H)),
								'margin-right':0,
								'margin-bottom':0,
								'margin-left':((dir.X=='n'&&dir.Y!='n')? 0 : ((dir.X=='r')?-W:W))});


						var olscrmove = {}; // целевая анимация для старого экрана
						olscrmove.marginTop = (dir.Y=='n'&&dir.X!='n')? 0 : ((dir.Y=='t')?-H:H);
						olscrmove.marginRight = 0;
						olscrmove.marginBottom = 0;
						olscrmove.marginLeft = (dir.X=='n'&&dir.Y!='n')? 0 : ((dir.X=='r')?W:-W);

						newscreen.trigger('beforeshow'); // сообщаем новому и
						oldscreen.trigger('beforehide'); // старому экранам о предстоящем изменении

						window.setTimeout(function(){
							if (oldscreen.hasClass('mainpage')) {
								hbg.css({left:(dir.X=='l')? 0:'auto', right:(dir.X=='r')? 0:'auto', width: (dir.X=='n')? '100%' : 0, height: (dir.Y=='n')? '100%' : 0});
								BODY.addClass('prevmain'); // предыдущий экран - основной белый
								var logo = $('.logo'), logogo = $('.logo_giant'); 
								logo.css({'opacity':0,display:'block'});
								var lpos = logo.position(), lgpos = logogo.position(),
								lw = logo.width(), lh = logo.height(), lml = logo.css('margin-left'), lmt = logo.css('margin-top'),
								lgw = logogo.width(), lgh = logogo.height(), lgml = logogo.css('margin-left'), lgmt = logogo.css('margin-top');
								logo.css({opacity: 1,left:lgpos.left, top: lgpos.top, width: lgw, height: lgh, 'margin-left': lgml, 'margin-top': lgmt})
									.stop()
									.animate({left:lpos.left, top: lpos.top, width: lw, height: lh, 'margin-left': lml, 'margin-top': lmt}, T/4, function(){
										logo.css({opacity:1,left:'',top:'',width:'',height:'','margin-left':'','margin-top':''});
									});
								logogo.css('opacity',0);
								hbg.animate({width:'100%',height:'100%'}, (dir.Y=='n')?T/1.5:T/4, function(){
									BODY.addClass(newscreen.data('bodyclass')); // добавить класс для body
									BODY.removeClass('prevmain');
								});
								BODY.removeClass(oldscreen.data('bodyclass'));
							}
							window.setTimeout(function(){
								newscreen.animate({'margin': '0 0 0 0'}, T/2.5, function(){ 
									$.scrollTo(0, 300, {onAfter: function(){
										newscreen.trigger('aftershow'); 
									}});
								});

								oldscreen.animate(olscrmove, T/2.5, function(){
									oldscreen.removeClass('current');
									newscreen.addClass('current');
									newscreen.css('z-index',''); // вернуть z-index
									oldscreen.css('display','none');
									if (!oldscreen.hasClass('mainpage') && !newscreen.hasClass('mainpage')) {
										BODY.addClass(newscreen.data('bodyclass')); // добавить класс для body
									}
									if (newscreen.hasClass('mainpage')) {
										hbg.css({left:(dir.X=='r')? 0:'auto', right:(dir.X=='l')? 0:'auto', width: '100%', height: '100%'});
										BODY.addClass('nextmain'); // следующий экран - основной белый
										var logo = $('.logo'), logogo = $('.logo_giant'); 
										logogo.css({'opacity':0,display:'block'});
										var lpos = logo.position(), lgpos = logogo.position(),
										lw = logo.width(), lh = logo.height(), lml = logo.css('margin-left'), lmt = logo.css('margin-top'),
										lgw = logogo.width(), lgh = logogo.height(), lgml = logogo.css('margin-left'), lgmt = logogo.css('margin-top');
										logo.css({opacity: 1,left:lpos.left, top: lpos.top, width: lw, height: lh, 'margin-left': lml, 'margin-top': lmt})
											.stop()
											.animate({left:lgpos.left, top: lgpos.top, width: lgw, height: lgh, 'margin-left': lgml, 'margin-top': lgmt}, T/4, function(){
												logo.css({opacity:0,left:'',top:'',width:'',height:'','margin-left':'','margin-top':''})
												logogo.css('opacity',1);
											});
										hbg.animate({width:(dir.X=='n')? '100%' : 0,height:(dir.Y=='n')? '100%' : 0}, (dir.Y=='n')?T/2:T/5, function(){
											BODY.removeClass(oldscreen.data('bodyclass'));
											BODY.removeClass('nextmain');
											BODY.addClass(newscreen.data('bodyclass')); // добавить класс для body
											oldscreen.trigger('afterhide');
								                	BODY.data('inaction','false').removeClass('inaction'); // конец анимации, разблокировать
										});
									} else {
										BODY.removeClass(oldscreen.data('bodyclass'));
										oldscreen.trigger('afterhide');
							                	BODY.data('inaction','false').removeClass('inaction'); // конец анимации, разблокировать
									}
							                div.each(function(){
						                		var d = $(this);
					        		        	if (d.hasClass('current')) d.removeClass('current');
							                	if (d.data('bodyclass')==newscreen.data('bodyclass')) d.addClass('current');
							                });

								});
							},((oldscreen.hasClass('mainpage'))?((dir.Y=='n')?T/2:T/5):1));
						}, T/15);
					}
				break;
			}
                });
	});
}
//end of closure
})(jQuery);

(function($) { //create closure
$.fn.hoverexpand = function(options){ // раскрывашка содержимого пункта меню (в контейнере .hover у LI)
// у UL в cont.data('hoverlayerclass') - класс для стилизации и выбора контейнеров
	this.each(function(){
		var defaults = {
			beforexpand: false,
			afterexpand: false
		};
		var errors = 0; var msg='';
		var o = $.extend(defaults, options);
		var cont = $(this), li = cont.children('li'), T=400, A = 'easeOutQuad', I, tout, WND = $(window);
		li.each(function(){
			var li = $(this), hov = li.find('.hover');
			if (hov.length > 0) {
				var exp = $('<div class="hoverlayer '+cont.data('hoverlayerclass')+'" />').appendTo('body');
				exp.html(hov.html()); hov.remove(); li.data('exp',exp);
				var txt = exp.find('.txt');
				li.addClass('overinitiator').mouseenter(function(){
					if (li.parents('.inaction').length > 0) {
						return false;
					}
					li.addClass('over');
						var pos = li.offset(), w = exp.width(), W = WND.width();
						exp.css({left: '-1000em',height:'100%'});
						txt.css({top:'',bottom:''});
						var postxt = txt.position();
						txt.css({top:postxt.top,bottom:'auto'});
						
						exp.css({left: ((pos.left+w < W)?pos.left:W-w),height:'', opacity: '', 'margin-left': ((pos.left+w < W)?'':0)});

						if (o.beforexpand && typeof o.beforexpand === 'function') {
							(o.beforexpand).call(this, li);
						}
						exp.stop().animate({height:'100%',opacity:1}, T, A, function(){
							closeEXP();
							exp.addClass('hover');
							if (o.afterexpand && typeof o.afterexpand === 'function') {
								(o.afterexpand).call(this, li);
							}
						});
				}).bind('cancelhover', function(){
					closeEXP();
				}).mouseleave(function(){
					li.removeClass('over')
				});
				exp.mouseleave(function(){
					closeEXP();
				});
			}
		});
		$(document).unbind('mouseover.expover');
		$(document).bind('mouseover.expover',function(e){
			var tar = $(e.target), cl = cont.data('hoverlayerclass');
			if ( !tar.parents('.hoverlayer').hasClass(cl) && 
			 	!tar.filter('.hoverlayer').hasClass(cl) ) {
				closeEXP();
			}
		});
                $(window).resize(function(){
			closeEXP();
		});
		function closeEXP(){
			window.clearTimeout(tout);
			$('.'+cont.data('hoverlayerclass')+'.hover').stop().animate({opacity:0.5}, T/3, function(){
				$(this).css({'height':0, opacity:''}).removeClass('hover');
			});
		}
	});
}
//end of closure
})(jQuery);


(function($) { //create closure
$.fn.casecarousel = function(options){
	this.each(function(){
		var cont = $(this), LI = cont.children('li'), T = 500, A = 'easeOutQuad', Ai = 'easeOutBack', lock = false;
		cont.wrap("<div class='ccwrapper'><div class='ccframe'></div></div>");
		var frame = cont.parent('.ccframe'), wrapper = frame.parent('.ccwrapper'), 
		imgcont = $('<div class="ccimgcont" />').appendTo(wrapper), img = $('<img src="" alt="" />').appendTo(imgcont);
		var current = cont.find('.current'), currimg = current.find('img').attr('src');
		img.attr('src',currimg);
		var nav = $('<div class="ccnav" />').appendTo(wrapper), next = $('<div class="ccnext" />').appendTo(nav), prev = $('<div class="ccprev" />').appendTo(nav);

		LI.click(function(){
			var li = $(this);
			if (li.hasClass('current') || lock==true) return false;
			lock = true;
			var curr = cont.find('.current'), i = li.index(), curri = curr.index(), oldimg = imgcont.children('img'), way = 1, ih = imgcont.height();
			if (i > curri) {
				var nxtimg = $('<img src="'+li.find('img').attr('src')+'" alt="" />').prependTo(imgcont);
				way = -1;
			} else {
				var nxtimg = $('<img src="'+li.find('img').attr('src')+'" alt="" />').appendTo(imgcont);
				way = 1;
			}
			nxtimg.css({'margin-top':ih*way, position: 'absolute', top: 0, left: 0, 'z-index': 2});
			nxtimg.animate({'margin-top':0},T,Ai,function(){ oldimg.remove(); nxtimg.css({'margin-top':'', position: '', top: '', left: '', 'z-index': ''}); lock = false; });
			if (i>0) {
				var H = 0;
				for (var k=0; k<i; k++) {
					H+=cont.children('li:eq('+k+')').outerHeight(true);
				}
				var move = cont.children('li').slice(0,i);
				cont.animate({'margin-top':'-'+H+'px'}, T, A, function(){
					curr.removeClass('current');
					move.appendTo(cont);
					cont.css('margin-top',0);
					lock = false;
				});
			}
			li.addClass('current');
		});
		next.click(function(e){
			if (lock == true) return false;
			lock = true;
			var curr = cont.find('.current'), h = curr.outerHeight(true), nxt = curr.next(), ih = imgcont.height(),
			oldimg = imgcont.children('img'), nxtimg = $('<img src="'+nxt.find('img').attr('src')+'" alt="" />').prependTo(imgcont);
			nxtimg.css({'margin-top':-ih, position: 'absolute', top: 0, left: 0, 'z-index': 2});
			nxt.addClass('current');curr.removeClass('current');
			nxtimg.animate({'margin-top':0},T,Ai,function(){ nxtimg.css({'margin-top':'', position: '', top: '', left: '', 'z-index': ''}); oldimg.remove(); });
			cont.animate({'margin-top':'-'+h+'px'}, T, A, function(){
				curr.appendTo(cont);
				cont.css('margin-top',0);
				lock = false;
			});
		});
		prev.click(function(e){
			if (lock == true) return false;
			lock = true;
			var curr = cont.find('.current'), nxt = $('li:last',cont), h = nxt.outerHeight(true), ih = imgcont.height(), 
			oldimg = imgcont.children('img'), nxtimg = $('<img src="'+nxt.find('img').attr('src')+'" alt="" />').appendTo(imgcont);
			nxtimg.css({'margin-top':ih, position: 'absolute', top: 0, left: 0, 'z-index': 2});
			nxt.addClass('current');curr.removeClass('current');
			nxtimg.animate({'margin-top':0},T,Ai,function(){ nxtimg.css({'margin-top':'', position: '', top: '', left: '', 'z-index': ''}); oldimg.remove(); });
			nxt.prependTo(cont);
			cont.css('margin-top','-'+h+'px');
			cont.animate({'margin-top':0}, T, A, function(){
				lock = false;
			});
		});
	});
}
//end of closure
})(jQuery);

(function($) { //create closure
$.fn.mainlocalnav = function(options){
	this.each(function(){
		var a = $(this), hoverlayer = $('.hoverstyle.'+a.data('rel')), bg = hoverlayer.find('.bg'), 
		T = 350, A='easeOutQuad', descr = a.find('.adescr'), span = descr.find('span'), t, body = $('BODY'),
		svgobject = false;
		
	        a.addClass('overinitiator').mouseenter(function() {
	        	if (a.hasClass('hover') || istouch) return false;
			hoverlayer.addClass('hover');
			window.clearTimeout(t);
			t = window.setTimeout(function(){
				a.addClass('hover');
				span.css({position: 'static'});
				descr.css({width:'', height: '', display:'block', opacity: 0});
				var w = descr.width(), h = descr.height();
				span.css({position: 'absolute'});
				if (a.hasClass('tobottom')) {
					descr.css({width:0, height: h, overflow:'hidden'});
					descr.stop().animate({width: w, opacity: 1}, T, function(){});
				} else {
					descr.css({width: w, height:0, overflow:'hidden'});
					descr.stop().animate({height: h, opacity: 1}, T, function(){});
				}

				try {  // меняем лого
					svgobject = ($('.logo_giant object').get(0)).getSVGDocument();
				} catch(e) {}
				if (a.hasClass('toleft') && svgobject) {
					svgobject.rootElement.id = 'NOTAMEDIA_LOGO4';
				}
				if (a.hasClass('toright') && svgobject) {
					svgobject.rootElement.id = 'NOTAMEDIA_LOGO3';
				}
			},T);
		}).mouseleave(function(){
			if (istouch) return false;
			hideHover();
		}).click(function(e){
                	e.preventDefault();
			body.trigger({type:'changescreen', step:1, href: $(this).attr('href')});
                }).bind('cancelhover', function(){
	                hideHover();
                });

                function hideHover(){
			if (istouch) return false;
			window.clearTimeout(t);
			hoverlayer.removeClass('hover');
	        	if (!a.hasClass('hover')) return false;
			var o = (a.hasClass('tobottom'))? {width:0,opacity: 0} : {height:0,opacity: 0};
			descr.stop().animate(o, 1, function(){
				descr.css({display: 'none',width:'', height: ''});
				span.css({position: 'static'});
				a.removeClass('hover');
			});
			if (!oldie) {
				svgobject = ($('.logo_giant object').get(0)).getSVGDocument();
				if (svgobject) svgobject.rootElement.id = 'NOTAMEDIA_LOGO';
			}
                }
	});
}
//end of closure
})(jQuery);






(function($) { //create closure
$.fn.litecarousel = function(options){
	this.each(function(){
		var cont = $(this);
		if (cont.hasClass('litecarouselready')) return false;
		var UL = cont.children('UL'), LI = UL.children('li'), T = 750, A = 'easeInOutCubic', TT;
                var nav = $('<ul class="nav"></ul>').appendTo(cont);
                LI.each(function(i){
                	var li = $('<li class="sn_'+(((i+1)<10)?'0'+(i+1):(i+1))+((i==0)?' current':'')+'"><i></i></li>').appendTo(nav);
                	li.click(function(){
                		$('.overinitiator').trigger('cancelhover'); 
                		UL.addClass('inaction');
                		var cli = $(this), k = cli.index(), CLI = LI.eq(k);
				(UL.add(nav)).find('.current').removeClass('current');
				(CLI.add(cli)).addClass('current');
				var pli = CLI.prevAll(), w = 0;
				pli.each(function(){
					w -= $(this).outerWidth(true);
				});
				UL.stop().animate({'margin-left': w}, T, A, function(){
					UL.removeClass('inaction');
				});
                	});
                });
                $('li:eq(0)', nav).trigger('click');
                $(window).resize(function(){
                	if (cont.parents('section').hasClass('current')) {
	                	window.clearTimeout(TT);
        	        	TT = window.setTimeout(function(){
	        	       		var CLI = LI.eq(UL.find('.current').index());
					var pli = CLI.prevAll(), w = 0;
					pli.each(function(){
						w -= $(this).outerWidth(true);
					});
					UL.stop().css({'margin-left': w});
				},300);
			}
                });
                cont.addClass('litecarouselready');
	});
}
//end of closure
})(jQuery);

(function($) { //create closure
$.fn.scatterimages = function(options){
	this.each(function(){
		var cont = $(this);
		if (cont.hasClass('scatterimagesready')) return false;
		var IMG = cont.children('img'), val = 'em', d = 3, 
		minleft = -45, maxleft = -20, minright = 20, maxright = 45, mintop = - 25, maxtop = -15, minbottom = 10, maxbottom = 30;
		IMG.each(function(i){
			var img = $(this)
			img.wrap('<span class="img"/>');
			var span = img.parent(), x = 0, y = 0;
			if (typeof img.data('x') != 'undefined' && typeof img.data('y') != 'undefined') {
				x = getRandomArbitrary(img.data('x')-d, img.data('x')+d);
				y = getRandomArbitrary(img.data('y')-d, img.data('y')+d);
			} else {
				var k = i%4;
				switch (k) {
					case 0: // top
						x = getRandomArbitrary(minleft, maxright); y = getRandomArbitrary(mintop, maxtop);
					break; 
					case 1: // right
						x = getRandomArbitrary(minright, maxright); y = getRandomArbitrary(mintop, maxbottom);
					break; 
					case 2: // bottom
						x = getRandomArbitrary(minleft, maxright); y = getRandomArbitrary(minbottom, maxbottom);
					break; 
					case 3: // left
						x = getRandomArbitrary(minleft, maxleft); y = getRandomArbitrary(mintop, maxbottom);
					break; 
				}
			}
			span.css('margin', y+val+' 0 0 '+x+val);
		});
		cont.addClass('scatterimagesready');
	});
	function getRandomArbitrary(min, max) { return Math.random() * (max - min) + min; }
}
//end of closure
})(jQuery);


(function($) { //create closure
$.fn.ownprojcarousel = function(options){
	this.each(function(){
		var cont = $(this), lock = false, A = 'easeOutCubic';
		if (cont.hasClass('ownprojready')) return false;
		cont.find('.m_own a').each(function(i){
			var a = $(this), id = a.attr('href');
			if (i==0) {
				a.addClass('current');
				$(id).addClass('current');
			}
                        a.click(function(e){
                        	e.preventDefault();
                        	if (lock == true || a.hasClass('current')) return false;
                        	lock = true;
                        	var curslide = cont.find('.s_own.current'), newslide = $(id), W = $(window).width(),
                        	newdescr = newslide.find('.sdescr'), curdescr = curslide.find('.sdescr'), 
                        	curimg = curslide.find('.img img'), newimg = newslide.find('.img img');
                        	cont.find('.m_own a.current').removeClass('current');
                        	a.addClass('current');

				newslide.css('z-index', 1);
				curslide.find('.bg').css('opacity',0);
				newdescr.css('opacity',0); 
				
				function moveOldImages(i, img) {
					var pos = img.offset();
					img.animate({'margin-left': -W*1.3}, 650);
				}

				curimg.each(function(i){
					var img = $(this);
					window.setTimeout(function(){
						moveOldImages(i, img);
					}, i*20);
				});
				curdescr.css('overflow','hidden').animate({'width':0}, 550, function(){
					window.setTimeout(function(){
						// сумма времени анимации должно быть не меньше, чем для картинок
						newdescr.animate({opacity:1}, 750, function(){
							curslide.removeClass('current');
							newslide.css('z-index', '').addClass('current');
							curslide.find('.bg').css('opacity','');
							curimg.css('margin-left','');
							curdescr.css({'overflow':'', 'width':''});
			                        	lock = false;
						});
					}, 150);
				});
				function moveNewImages(i, img) {
						img.animate({'margin-left': '-6.5625em'}, 750, A, function(){
							$(this).css('margin-left','');
						});
				}

				newimg.each(function(){
					var img = $(this), pos = img.offset();
					img.css('margin-left',W);
					window.setTimeout(function(){
						moveNewImages(i, img)
					}, i*40);
				});
                        });
		});
		cont.addClass('ownprojready');
	});
}
//end of closure
})(jQuery);


(function($) { //create closure
$.fn.staffcontainer = function(options){
	this.each(function(){
		var cont = $(this);
		if (cont.hasClass('staffcontainerready')) return false;

		$('.staffslide > ul > li', cont).each(function(){
			var li = $(this), hover = li.find('.hover'), fig = li.find('figure').clone(true).appendTo(hover);
		});

		cont.find('.staffslide > ul').hoverexpand({beforexpand: function(li){
			var exp = li.data('exp'), lifig = li.find('figure'), liimg = lifig.find('img'), lfpos = lifig.offset(), expfig = exp.find('figure'), expimg = expfig.find('img'); 
			expimg.attr('src',liimg.attr('src'));
			expfig.css('top','');
			var expftop = expfig.css('top');
			expfig.css('top',lfpos.top).data('newtop',expftop);
			var iclone = expimg.clone(true).prependTo(expfig); expimg.attr('src', iclone.data('hover'));
			iclone.addClass('fake');
			expfig.animate({top:expfig.data('newtop')}, 250, 'easeOutQuad', function(){
				expfig.find('.fake').remove();
			});
		}, afterexpand: function(li) {
				
		}});
		cont.find('.staffwrapper').litecarousel();

		cont.addClass('staffcontainerready');
	});
}
//end of closure
})(jQuery);


(function($) { //create closure
$.fn.maincompany = function(options){
	this.each(function(){
		var WND = $(window), mainabout = $(this), // section.maincompany
			ssmain = mainabout.find('.ssmain'), // subscreen 1
			mclocalnav = ssmain.find('.mclocalnav'),
			ssinner = mainabout.find('.ssinner'), // subscreen 2
			sidemenu = ssinner.find('.sidemenu'),
			service = ssinner.find('.about-service'),
			process = ssinner.find('.about-process'),
			ownproj = ssinner.find('.about-ownproj'),
			staff = ssinner.find('.about-staff'),
			awards = ssinner.find('.about-awards'),
			expert = ssinner.find('.about-expert');

//////////////////////////
		var TT,  // скролл колесом мыши
		lock = false; // блокировка анимации
		mainabout.bind('mousewheel', function(e, delta, deltaX, deltaY){
			//if (deltaY < 0)  // scroll down
			window.clearTimeout(TT);
			TT = window.setTimeout(function(e){
			if (deltaY < 0 && WND.scrollTop() + WND.height() != mainabout.height() ||
				 deltaY > 0 && WND.scrollTop() != 0 ||
				 deltaY > 0 && ssmain.hasClass('current')) return false;
				try {
					e.preventDefault();
				} catch(e){}
				if (lock==true) { return false; }
				var currmenu = (ssmain.hasClass('current'))? mclocalnav : sidemenu;
				var acurr =  currmenu.find('.current'), // найти current и направление скролла
				next = false;
				if (acurr.length < 1) {
					next = $('div:first a', currmenu);
				} else { 
					next = (deltaY > 0) ? acurr.prev() : acurr.next();
					if (next.length < 1) {
						next = (deltaY > 0 && acurr.index()==0) ? $('div:last a', currmenu) : $('div:first a', currmenu);
					} else {
						next = $('a',next);
					}
				}	
				if (next.length > 0) {
					next.click(); // кликнуть по ссылке в меню
				}
			}, 100, e);
		});
//////////////////////////
		$('.maincompany .nextscreen').click(function(e){
			e.preventDefault();
			$('a:eq(0)', mclocalnav).trigger('click');
		});
		$('.maincompany .mclocalnav a, .maincompany .sidemenu a').bind('click', function(e){ // клик по пункту в меню
			e.preventDefault();
			if (lock==true) { return false; }
			lock = true;
			var a = $(this), id = a.attr('href'), slide = $(id), T = 1500, A = 'easeOutQuad', ind = a.parent().index();
			slide.trigger('beforecurrent');
			$('.overinitiator').trigger('cancelhover'); // отменить все всплывашки 
			if (a.parents('.mclocalnav').length > 0) { // ссылка в меню в первом экране
				if (oldie && 1==2) {
					var H = ssmain.height();
					ssinner.find('.sslide.current').removeClass('current');
					slide.addClass('current');
					$('div:eq('+ind+')',sidemenu).addClass('current');
					ssmain.find('.slidecont').animate({'margin-top':H/2}, T/1.5, A, function(){
						$(this).css({'margin-top':''});
					});
					ssinner.addClass('current').css({'margin-top': H, 'z-index':5}).animate({'margin-top': 0}, T/2, A, function() {
						ssinner.css('z-index',''); // прибираемся
						ssmain.removeClass('current');
						ssinner.addClass('current');
						// прибираемся:
						sidemenu.css('opacity',1);
						mclocalnav.children('div').css('opacity',1);
						lock = false;
						$.scrollTo(0, 300, {onAfter: function(){
							slide.trigger('aftercurrent'); // закончилась анимация
						}});
					});
					return false;
				}
				if ($('.mclocalnav.fake').length < 1) {
					var fakenav = (mclocalnav.clone(true).addClass('fake')).appendTo(mainabout);
					var fakeside = (sidemenu.clone(true).addClass('fake')).appendTo(mainabout);
					sidemenu.css('opacity',0);
					var l = mclocalnav.children('div').length - 1;

					function animateMenu(i,l) {
							var tdiv = fakeside.children('div:eq('+i+')'), tpos = tdiv.offset();
							mclocalnav.children('div:eq('+i+')').css('opacity',0);
							fakenav.children('div:eq('+i+')').addClass('go').animate({left: tpos.left, top: tpos.top}, T/6, function(){
								$(this).css('opacity',0);
								tdiv.css('opacity',1);
								if (i==l) { // все выстроились, меняем экраны
									window.setTimeout(function(){ // TODO: похоже что-то не успевает доработать, выяснить
										var H = ssmain.height();
										ssinner.find('.sslide.current').removeClass('current');
										slide.addClass('current');
										$('div:eq('+ind+')',sidemenu).addClass('current');
										ssmain.find('.slidecont').animate({'margin-top':H/2}, T/1.5, A, function(){
											$(this).css({'margin-top':''});
										});
										ssmain.find('.bg').css({'background-size':'100%'}).animate({'background-size':'65%'}, T/1.5, A, function(){
											$(this).css({'background-size':''});
										});
										ssinner.addClass('current').css({'margin-top': H, 'z-index':5}).animate({'margin-top': 0}, T/2, A, function() {
											ssinner.css('z-index',''); // прибираемся
											ssmain.removeClass('current');
											ssinner.addClass('current');
											// прибираемся:
											sidemenu.css('opacity',1);
											mclocalnav.children('div').css('opacity',1);
											fakenav.remove(); fakeside.remove();
											lock = false;
											$.scrollTo(0, 300, {onAfter: function(){
												slide.trigger('aftercurrent'); // закончилась анимация
											}});
										});
									},300);
								}
							});
					
					}

					fakenav.children('div').each(function(i){
						var fdiv = $(this), odiv = mclocalnav.children('div:eq('+i+')');
						var opos = odiv.offset();
						fdiv.css({left: opos.left, top: opos.top});
						window.setTimeout(function(){
							animateMenu(i,l);

/*
							var tdiv = fakeside.children('div:eq('+i+')'), tpos = tdiv.offset();
							mclocalnav.children('div:eq('+i+')').css('opacity',0);
							fakenav.children('div:eq('+i+')').addClass('go').animate({left: tpos.left, top: tpos.top}, T/6, function(){
								$(this).css('opacity',0);
								tdiv.css('opacity',1);
								if (i==l) { // все выстроились, меняем экраны
									window.setTimeout(function(){ // TODO: похоже что-то не успевает доработать, выяснить
										var H = ssmain.height();
										ssinner.find('.sslide.current').removeClass('current');
										slide.addClass('current');
										$('div:eq('+ind+')',sidemenu).addClass('current');
										ssmain.find('.slidecont').animate({'margin-top':H/2}, T/1.5, A, function(){
											$(this).css({'margin-top':''});
										});
										ssmain.find('.bg').css({'background-size':'100%'}).animate({'background-size':'65%'}, T/1.5, A, function(){
											$(this).css({'background-size':''});
										});
										ssinner.addClass('current').css({'margin-top': H, 'z-index':5}).animate({'margin-top': 0}, T/2, A, function() {
											ssinner.css('z-index',''); // прибираемся
											ssmain.removeClass('current');
											ssinner.addClass('current');
											// прибираемся:
											sidemenu.css('opacity',1);
											mclocalnav.children('div').css('opacity',1);
											fakenav.remove(); fakeside.remove();
											lock = false;
											$.scrollTo(0, 300, {onAfter: function(){
												slide.trigger('aftercurrent'); // закончилась анимация
											}});
										});
									},300);
								}
							});
*/
						}, 120+(i)*100);
					});
				}
			} else { // ссылка в слайдах боковое меню
				var curind = sidemenu.find('.current').index(), newind = a.parent().index(), 
				currslide = ssinner.find('.sslide.current'), H = currslide.height(), L = sidemenu.find('div').length;
				sidemenu.find('.current').removeClass('current');
				a.parent().addClass('current');
				var down = (newind > curind && !(newind == L-1 && curind == 0) || newind == 0 && curind == L-1)?true:false;
                                if (down) {
					currslide.find('.slidecont').animate({'margin-top':H/2}, T/1.5, A, function(){
						$(this).css({'margin-top':''});
					});
					if (!oldie)
						currslide.find('.bg').css({'background-size':'100%'}).animate({'background-size':'65%'}, T/1.5, A, function(){
							$(this).css({'background-size':''});
						});
				}
				slide.css({'margin-top': ((down)? H:-H)*2, 'z-index':3}).animate({'margin-top':0}, T/2, A, function(){
					currslide.removeClass('current');
					slide.addClass('current').css({'margin-top':'','z-index':''});
					lock = false;
					$.scrollTo(0, 300, {onAfter: function(){
						slide.trigger('aftercurrent'); // закончилась анимация
					}});
				});
			}
		});

		ssinner.bind('aftercurrent beforecurrent', function(){
			$('.overinitiator').trigger('cancelhover'); // отменить все всплывашки 
		});


		mainabout.bind('beforeshow afterhide', function(){ // подготовиться к перемещению в нижний блок и обратно
			mainabout.find('.sslide.current').removeClass('current'); // reset all slides
			ssmain.addClass('current'); // set first screen as current
			ssinner.removeClass('current');
			sidemenu.find('.current').removeClass('current');
			$('.sslide:eq(0)',ssinner).addClass('current');
		});

		
		mainabout.bind('aftershow', function(){ // переместились в нижний экран
			ssmain.trigger('ssactive');
			try {  // меняем лого
				var svgobject = ($('.logo object').get(0)).getSVGDocument();
				if (svgobject) {
					svgobject.rootElement.id = 'NOTAMEDIA_LOGO5';
				}
			} catch(e) {}
		});

		ssmain.bind('ssactive',function(){ // попали в главный экран нижнего блока
			if (service.find('.litecarouselready').length < 1) service.find('.servlist').litecarousel();
			if (ownproj.find('.scatterimagesready').length < 1) ownproj.find('.sfoto').scatterimages();
			if (staff.find('.staffcontainerready').length < 1) staff.find('.staffcontainer').staffcontainer();
			if (ownproj.find('.ownprojready').length < 1) ownproj.find('.slidecont').ownprojcarousel();
		});

	// AWARDS
		var awardsT;
		awards.bind('beforecurrent', function(){
			var ss1 = awards.find('.ss1'),  ss2 = awards.find('.ss2');
			ss2.removeClass('current').removeClass('showcircle');
			ss1.addClass('current');
			ss1.find('li').removeClass('normal');
			try { window.clearTimeout(awardsT); } catch(e) {}
		});
		awards.bind('aftercurrent', function(){
			var ss1 = awards.find('.ss1'),  ss2 = awards.find('.ss2'), LI = ss1.find('li'), t = 5000;
			function runFirstSlide(){
				if(!awards.hasClass('current')) return false;
				try { window.clearTimeout(awardsT); } catch(e) {}

				function liAnimate(i, li){
					li.animate({'margin-left':0}, 500, 'easeOutBounce', function(){
						$(this).css('margin-left','').addClass('normal');
						if (i==LI.length-1) {
							awardsT = window.setTimeout(changeawardslide,t);
						}
					});
				}
				LI.each(function(i){
					var li = $(this);
					window.setTimeout(function(){
						liAnimate(i, li);
					}, 350*(i));
				});
			}
			function changeawardslide(){
				var curslide = awards.find('.current'), slide1 = (curslide.hasClass('ss1'))? true : false, newslide = (slide1) ? ss2 : ss1;
				try { window.clearTimeout(awardsT); } catch(e) {}
				if (slide1) {
					prepareSecondSlide();
				} else {
					ss1.find('li').removeClass('normal');
				}
				curslide.animate({'margin-left':'-100em'}, 450, function(){
					$(this).removeClass('current').css({'margin-left':''});
				});
				newslide.animate({'margin-left':0}, 450, function(){
					$(this).addClass('current').css({'margin-left':''});
					if (slide1) {
						runSecondSlide();
					} else {
						runFirstSlide();
					}
				});
			}
			var counter = ss2.find('.awcount');
			function prepareSecondSlide(){
				if (!counter.data('target')) counter.data('target',counter.text());
				if (!counter.hasClass('ready')) {
					counter.html('');
					for (var k=0; k<counter.data('target').length; k++) {
						$('<span class="col"></span>').appendTo(counter);
					}
					var col = counter.find('.col');
					for (var i=10; i>-2; i--) {
						$('<span class="n'+i+'">'+((i>9)? 0 : Math.abs(i))+'</span>').appendTo(col);
						if (i==0) counter.add('ready');
					}
				} else {
					var col = counter.find('.col');
					col.find('.hid').removeClass('hid');
				}

				ss2.removeClass('showcircle');
				$('li',ss2).css('left','100em');
			}
			function runSecondSlide(){
				if(!awards.hasClass('current')) return false;
				$('li',ss2).each(function(i){
					var li = $(this);
					function liAnimate(i, li) {
						li.animate({'left':0}, 500, 'easeOutBounce', function(){
							$(this).css('left','').addClass('normal');
						});
					}
					window.setTimeout(function(){
						liAnimate(i, li);
					}, 75*(i));
				});
				runCounter(0);
			}

			function runCounter(n){
				if (typeof n != 'number') {
					var col = counter.find('.col');
					col.find('.hid').removeClass('hid');
				} else {
					if (counter.data('target') && n-1 < parseInt(counter.data('target'))) {
						var str = new String(n);
						if (str.length < counter.data('target').length) {
							for (var i=0; i<counter.data('target').length-str.length; i++){
								str = '0'+str;
							}
						}
						for (var i=0; i<str.length; i++) {
							var digit = $('.col:eq('+(i)+')', counter);
							digit.find('.n'+(str[i]-1)).animate({height:0}, 50, 'linear', function(){
								$(this).siblings().removeClass('hid');
								$(this).nextAll().addClass('hid').height('');
								$(this).addClass('hid').height('');
								if ($(this).parent('.col').index() == 0) runCounter(n+1);
							});
						}
					} else {
						ss2.addClass('showcircle');
						awardsT = window.setTimeout(changeawardslide,t);
					}
				}
			}
			
			runFirstSlide();
		});


	// PROCESS
		process.bind('beforecurrent', function(){
			process.find('.normal').removeClass('normal');
		});
		process.bind('aftercurrent', function(){
			function animateProcess(i){
				process.find('.proclist li:eq('+i+')').animate({'margin-left':0}, 850, 'easeOutBounce', function(){
					$(this).css('margin-left','').addClass('normal');
				});
			}
			process.find('.proclist li').each(function(i){
				window.setTimeout(function(){
					animateProcess(i);
				}, 220*(i));
			});
		});


	// EXPERT 
		expert.bind('beforecurrent', function(){
			$('.expertlist li', expert).css('opacity',0);
		});

		expert.bind('aftercurrent', function(){
			$('.expertlist', expert).each(function(){ // блоки в "комиссии и ассоциации"
				if (oldie) return false;
				var cont = $(this), li = cont.children('li'), a = [];
				li.each(function(i){ 
					var LI = $(this).find('.rel');
					LI.data('h',LI.height()).css({height:0, position: 'absolute', bottom: 0, left: 0, overflow: 'hidden'}); a.push(i); 
				});
				a = arrayShuffle(a); // перемешать
				for(var i=0; i<a.length; i++) {
					window.setTimeout(function(i){
						var LI = (li.eq(a[i])).find('.rel');
						LI.animate({height:LI.data('h')},450, 'easeOutCubic', function(){
							$(this).height('');
						});
					}, 220*(i+1), i);
				}
				$('.expertlist li', expert).css('opacity',1);
			});
		});

	});
}
//end of closure
})(jQuery);