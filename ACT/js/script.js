/* Author:

*/
var ltie9 = false;
$(function() {
	ltie9 = ($('html').hasClass('lt-ie9')) ? true : false;

	$('.mainnav ul, .sitemenu ul, .mainserviceslist, .blogpreview, .toothylist, .blocklist, .history').cleanWS(); // убрать пробелы у inline-block
	$('#adtcarousel').topcarousel({navMarker: '/bitrix/templates/.default/markup/i/1.gif',navCurrent: '/bitrix/templates/.default/markup/i/1.gif'});
	$('img.circle').circleIMG(); // круглые картинки
	$('.pic').inTextIMG(); // картинки с тенью и подписью
	$('.tabs').tabsprepare({heightStyle:'auto'}); // табы
	$('.text2columns').columnize({ columns: 2 }); // 2 колонки
	$('.text3columns').columnize({ columns: 3 }); // 3 колонки
	$('.footmenu').columnize({ width: 230, doneFunc: function(){
			$('.footmenu p').each(function(){
				if (!$(this).text()) $(this).remove();
			})
		}
	}); // 3 колонки в меню футера
	$('.mainregion select').change(function(){ $(this).parents('form').submit(); }).selectReplace(); // замена селектов
	$('a[rel="popupopener"]').universalPopUp(); // открывание попапа 
	// custom form elements
	$(':checkbox:not(".custom")').replaceCheckBox();
	$(':radio:not(".custom")').replaceRadio();
	$('select:not(".custom")').selectReplace();
	$('input.date:not(".custom")').replaceDate();

	// кнопки открывания попапов
	$('.askaquestion_button').askAQuestion();
	$('.callback').callbackToMe();
	$('.opentest').openTest();


	$('.blocklist').evenly(); // выровнять высоту деток блока по максимальной

	$('.toothylist').toothy(); // 
	$('.inForm').formFunc();
	$('.vac, .faq').vacOpen();
	$('.credit').opener();
	$('#js-gallery').coverflowGallery();
	$("form.search").inputoverlabel();

}); // DOM loaded

$(window).load(function(){
});

(function($) { //create closure
$.fn.cleanWS = function(options){
	this.each(function(){
		var container = this, nodes = container.childNodes;
		var i = nodes.length-1;
		while (i>-1) { 
			if (nodes[i].nodeType == 3) container.removeChild(nodes[i]);
			i--;
		}
	});
}
//end of closure
})(jQuery);

(function($) { //create closure
$.fn.circleIMG = function(options){
// оборачивает выбранные картинки в span
// для modern browser будет использоваться border-radius, для old ie - маска-картинка
// маска описывается в style.css в классах cw_'+w+'x'+h+':
// исходный набор масок для размеров: 60x60 (для .cw_60x60 и т.п.), 95x95, 125x125, 150x150, 175x175 для белого и светлосерого background
	this.each(function(){
		var img = $(this);
		if (ltie9) {
/*				var h = img.height(), w = img.width();
				try {
					if (!h || h<10) {
						throw('Not all reqs was loaded..'); // не загрузились, кидаем исключение
					} else {
						var cls = img.attr('class').replace('circle','');
						img.attr('class', 'circle');
						return '<span class="circlewrapper cw_'+w+'x'+h+' '+cls+'"></span>';
					}
				} catch(e) {
*/
					$(window).load(function(){
			img.wrap(function() {
						var h = img.height(), w = img.width();
						var cls = img.attr('class').replace('circle','');
						img.css({'border-radius': h/2+'px'});
						img.attr('class', 'circle');
						return '<span class="circlewrapper cw_'+w+'x'+h+' '+cls+'"></span>';
			}).after('<span class="mask"></span>');
					});
//				}
		} else {
			var h = img.height();
			try {
				if (!h || h<10) {
					throw('Not all reqs was loaded..'); // не загрузились, кидаем исключение
				} else {
					img.css({'border-radius': h/2+'px'});
				}
			} catch(e) {
				$(window).load(function(){
					img.css({'border-radius': img.height()/2+'px'});
				});
			}
		}
	});
}
//end of closure
})(jQuery);


(function($) { //create closure
$.fn.topcarousel = function(options){
	var defaults = {
		scroll: 1,
		easing: 'linear',
		animation: 400,
		visible: 1,
		wrap: 'circular',
		asT: 0, // таймаут автоскролла integer: 0 - нет автоскролла, либо в ms: 3500 = 3.5 секунды
		buttonNextHTML: '<a href="javascript:void(0);"><span></span></a>',
		buttonPrevHTML: '<a href="javascript:void(0);"><span></span></a>'
	};
	var errors = 0; var msg='';
	this.each(function(){ // 
		var o = $.extend(defaults, options);
		o.me = $(this);
		var ul = o.me.children('ul'), id = ul.attr('id'), li = ul.children('li');
		o.L = li.length;
		var W = 0; li.each(function(){ W = Math.max(W, li.width())});
		ul.jcarousel({
			buttonNextHTML: o.buttonNextHTML,
			buttonPrevHTML: o.buttonPrevHTML,
			navMarker: null, // кружок для навигации
			navCurrent: null, // кружок выбранного слайда в навигации
			wrap: o.wrap,
			start: 1,
			scroll: o.scroll,
			easing: o.easing,
			animation: o.animation,
			itemFallbackDimension: 1280,
			visible: o.visible,
			initCallback: carouselNav,
			animationStepCallback: carouselNextStep,
			itemVisibleInCallback: {
				onBeforeAnimation: onBeforeAnimationStep,
				onAfterAnimation: onAfterAnimationStep
			}
		});
		$(window).load(function(){
			var H = 0;
			li.each(function(){
				H = Math.max(H, $(this).height());
			});
			li.height(H);
		});

		var tmr;
		function carouselNav(carousel, status) {
			if (status == 'init') {
				var id = carousel.container.context.id, txt = '';
				$(carousel.container.context).children('li').each(function(i){
					if (!(i%o.scroll)) {
						if (o.navMarker) {
							txt += '<td class="carouselcontrol_'+(i+1)+' dot"><a href="#" rel="'+(i+1)+'"><img src="'+((i==0)? o.navCurrent : o.navMarker)+'" alt="" /></a></td>';
						} else {
							txt += '<td class="carouselcontrol_'+(i+1)+' dot"><a href="#" rel="'+(i+1)+'">'+(i+1)+'<br /><span>&#8226;</span></a></td>';
						}
					}
				});
				carousel.container.append('<table id="'+id+'control" class="carouselcontrol"><tbody><tr>'+txt+
					((o.asT > 0) ? '<td class="playtrigger"><a href="#" rel="slidestop" class="slidestop"></a></td>' : '')+
					'</tr></tbody></table>');
				carousel.container.children('.jcarousel-prev').prependTo('.carouselcontrol tbody tr').wrap('<td />');
				carousel.container.children('.jcarousel-next').appendTo('.carouselcontrol tbody tr').wrap('<td />');

				carousel.container.children('.carouselcontrol').wrapAll('<div class="carouselnav" />');

	
				$('#'+id+'control td.dot a, #'+id+'control td.playtrigger a').unbind('click').bind('click', function() {
						var a = $(this), td = a.parent('td.dot');
					if (a.hasClass('slidestop')) {
						if (td.hasClass('stopped')) td.removeClass('stopped'); else td.addClass('stopped');
					} else {
						$('#'+id+'control td.playtrigger').addClass('stopped');
						$('#'+id+'control .current').removeClass('current');
						carousel.scroll(a.attr('rel')*1);
		        	        	td.addClass('current');
		                		if (a.children('img').length > 0 && o.navCurrent) {
			                		$('#'+id+'control td.dot a > img').attr('src', o.navMarker);
							a.children('img').attr('src', o.navCurrent);
			                	}
		        	        }
					return false;
				});
		                if (o.asT > 0) o.tm = window.setTimeout(function(){autoClicker(carousel);}, o.asT);
			}

		}

		function autoClicker(carousel) {
			window.clearTimeout(o.tm);
			var id = carousel.container.context.id, currtd = $('#'+id+'control td.dot.current');
			if (!$('#'+id+'control td.playtrigger').hasClass('stopped')) {
				nexttd = (currtd.next('td.dot').length > 0) ? currtd.next('td.dot') : $('#'+id+'control td.dot:eq(0)');
				currtd.removeClass('current');
				carousel.scroll(nexttd.find('a').attr('rel')*1);
	                	nexttd.addClass('current');
			}
	                o.tm = window.setTimeout(function(){autoClicker(carousel);}, o.asT);
		}

		function carouselNextStep() {
		
		}

		function onBeforeAnimationStep(){

		}
		function onAfterAnimationStep(carousel){
			var newNum = carousel.first, id = carousel.container.context.id, l = $('#'+id+'control').find('td.dot').length;
			var n = carousel.first % (o.scroll * l);
			n = (n < 1)? n+o.scroll * l : n;
			$('#'+id+'control').find('.current').removeClass('current');
			$('#'+id+'control').find('td.carouselcontrol_'+n).addClass('current');
		}

	
		});
	}
//end of closure
})(jQuery); // notacarousel

(function($) { //create closure
$.fn.tabsprepare = function(options){
	this.each(function(){
		var cont = $(this), ul = $('<ul></ul>').prependTo(cont);
                cont.find('div[id]').each(function(i){
                	var div = $(this), h4 = div.prev('h4'), li = $('<li></li>').appendTo(ul);
			if (h4.length < 1) {
				li.append('<a href="#'+div.attr('id')+'">Tab'+i+'</a>');
			} else {
				li.append('<a href="#'+div.attr('id')+'" class="'+h4.attr('class')+'">'+h4.text()+'</a>');
				li.addClass(h4.attr('class'));
				h4.remove();
			}
                });
                ul.wrap('<div class="clearfix" />');
                cont.tabs(options);
	});
}
//end of closure
})(jQuery);


(function($) { //create closure
$.fn.selectReplace = function(options){
	this.each(function(){
        var field = $(this), selblock = $("<span class=\"inpselblock\"></span>"), seltxt = $("<span class=\"inpseltxt\"></span>"), w = field.width();
	if (field.hasClass('custom')) return false;
	if (!field.hasClass('floatwidth')) { selblock.width(w); }
	field.wrap(selblock);
	seltxt.insertBefore(field);
	seltxt.text($("option:selected",field).text());
	var selopener = $("<a class=\"selopener\" href=\"#\"></a>").insertBefore(seltxt);
	var optcontainer = $("<div class=\"optcontainer"+((field.hasClass('round'))? ' round':'')+"\" id=\""+field.attr("name")+"opts\"></div>").appendTo("body");
	optcontainer.css('min-width',w).hide(function(){
		$(this).addClass("hide");
	});
	$("option",field).each(function(k){
		var opt = $(this);
		var aopt = $("<a href=\"#\" title=\""+opt.text()+"\">"+opt.text()+"</a>").appendTo(optcontainer);
		aopt.click(function(){
			field.get(0).selectedIndex = k;
			seltxt.text($("option:eq("+k+")",field).text());
			optcontainer.find('.selected').removeClass('selected');
			$(this).addClass('selected');
			optcontainer.slideUp("fast",function() {
				$(this).addClass("hide");
				selopener.removeClass('open');
			});
			field.change();
			return false;
		});
		if (opt.prop('selected')) aopt.addClass('selected');
	});
	selopener.click(function(){
		$('.inpselblock').removeClass('open');
		$("div.optcontainer").slideUp("fast",function() {
			$(this).addClass("hide");
		});
		if (optcontainer.hasClass("hide")) {
			var pos = $(seltxt).offset(), zi = 0;
			optcontainer.removeClass("hide");
			optcontainer.css({left: pos.left-16+"px", top: pos.top-1 + "px", 'min-width': field.outerWidth()+15});
			optcontainer.slideDown("fast", function(){
				$(document).on("click",function(e) {
					if (e.pageX < pos.left 
						|| e.pageX > (pos.left + optcontainer.width()) 
						|| e.pageY < (pos.top) 
						|| e.pageY > (pos.top + optcontainer.height())) {
						optcontainer.slideUp("fast",function() {
							$(this).addClass("hide");
							selopener.removeClass('open');
						});
					} 
				});
				selopener.addClass('open');
			});

			optcontainer.siblings().each(function(){
				var nzi = parseInt($(this).css('z-index'));
				zi = Math.max(zi, (!isNaN(nzi)) ? nzi: 0);
			});
			optcontainer.css({'z-index':zi+1});


		} else {
			optcontainer.slideUp("fast",function() {
				$(this).addClass("hide");
				selopener.removeClass('open');
			});
		}
		return false;
	});
	field.addClass('custom');
	});
}
//end of closure
})(jQuery);


// REPLACE CHECKBOXES
(function($) { //create closure
$.fn.replaceCheckBox = function(options){
	this.each(function(){
		var inp = $(this), label = $('label[for='+inp.attr('id')+']');
		if (inp.hasClass('custom')) return false;
		inp.wrap('<span class="field checkbox" />').wrap('<span />').before('<img alt="" src="/bitrix/templates/.default/markup/i/1.gif" />');
		var par = inp.parents('span.checkbox:eq(0)');
		if (inp.attr('checked')) {
			par.addClass('checked');
		}
		$.each([par,label], function(){
			$(this).click(function(){
				if (inp.attr('disabled')) return false;
				if (inp.attr('checked')) {
					par.removeClass('checked');
					inp.removeAttr('checked');
				} else {
					par.addClass('checked');
					inp.attr('checked','checked');
				}
				inp.change();
				return false;
			});
		});
		inp.change(function(){
			if (inp.attr('disabled')) return false;
			if (inp.attr('checked')) {
				par.addClass('checked');
				inp.attr('checked','checked');
			} else {
				par.removeClass('checked');
				inp.removeAttr('checked');
			}
		});
	});
}
//end of closure
})(jQuery);

// REPLACE RADIO
(function($) { //create closure
$.fn.replaceRadio = function(options){
	this.each(function(){
		var inp = $(this), label = $('label[for='+inp.attr('id')+']'), form = inp.parents('form');
		if (inp.hasClass('custom')) return false;
		inp.wrap('<span class="radio" />').wrap('<span />').before('<img alt="" src="/bitrix/templates/.default/markup/i/1.gif" />');
		var par = inp.parents('span.radio:eq(0)');
		if (inp.attr('checked')) {
			par.addClass('checked');
		}
		$.each([par,label], function(){
			$(this).click(function(e){
			        e.preventDefault();
				if (inp.attr('disabled') || inp.prop('checked')) return false;
				form.find(':radio[name='+inp.attr('name')+']').prop('checked',false).change();
				par.addClass('checked');
				inp.prop('checked',true).change();
			});
		});
		inp.change(function(){
			if (inp.attr('disabled')) return false;
			if (inp.prop('checked')) {
				par.addClass('checked');
				inp.prop('checked',true);
			} else {
				par.removeClass('checked');
				inp.prop('checked', false);
			}
		});
		inp.addClass('custom');
	});
}
//end of closure
})(jQuery);


(function($) { //create closure
$.fn.universalPopUp = function(options) {
	this.each(function(){
		var A = $(this), T;
		var D = createDialog(A.attr('href'), A.data('popwidth'));
		A.unbind('click').bind('click', function(event){
			event.preventDefault();
			A.blur();
			D.dialog('open');
		});
	});
}
//end of closure
})(jQuery);


(function($) { //create closure
$.fn.askAQuestion = function(options) {
	this.each(function(){
		var A = $(this), T;
		var D = createDialog(A.attr('href'), A.data('popwidth'));
		D.find(':checkbox:not(".custom")').replaceCheckBox();
		D.find(':radio:not(".custom")').replaceRadio();
		 //создаём функцию
		 var funcSubmit = function (ev) {
		 var $btn = $(this); 
		 var $form = $btn.closest('form');
		 
		 $form.submit( function(e){
		  e.preventDefault();
		 
		  var form = $(this);
		 
		  form.formValidator();
		 
		  if (form.data('valid')=='true') {
		   $.ajax({
			url: form.attr('action'),
			data: form.serialize(), // передаем значения чекбоксов
			method: 'post',
			dataType: 'html',
			//contentType:'multipart/form-data',
			complete: function(data){ // ответ от сервера    
			  D.html(data.responseText); 
			  D.find('.button_blue').on('click', funcSubmit);
			}
		   });
		  }
		  return false;
			});
		 
		 $form.submit();
		 }
 
		 //вызываем обработчик
		 
		 D.find('.button_blue').on('click', funcSubmit);
		
		A.unbind('click').bind('click', function(event){
			event.preventDefault();
			A.blur();
			D.dialog('open');
            return false;
		});
	});
}
//end of closure
})(jQuery);

(function($) { //create closure
$.fn.callbackToMe = function(options) {
	this.each(function(){
		var A = $(this), T;
		var D = createDialog(A.attr('href'), A.data('popwidth'));
		D.find(':checkbox:not(".custom")').replaceCheckBox();
		D.find(':radio:not(".custom")').replaceRadio();
		D.find('select:not(".custom")').selectReplace();
		var datefield = D.find('input.date')
		datefield.datepicker("option", "minDate", new Date())
			.datepicker("option", "firstDay", 1)
			.datepicker("option", "showOtherMonths", true )
			.datepicker("option", "selectOtherMonths", true )
			.datepicker("option", "beforeShow", function(){
				var pos = datefield.offset();
				$.datepicker._pos = [pos.left-20, pos.top-205];
			});

		//создаём функцию
		 var funcSubmit = function (ev) {
		 var $btn = $(this); 
		 var $form = $btn.closest('form');
		 
		 $form.submit( function(e){
		  e.preventDefault();
		 
		  var form = $(this);
		 
		  form.formValidator();
		 
		  if (form.data('valid')=='true') {
		   $.ajax({
			url: form.attr('action'),
			data: form.serialize(), // передаем значения чекбоксов
			method: 'post',
			dataType: 'html',
//			contentType:'multipart/form-data',
			complete: function(data){ // ответ от сервера    
			  D.html(data.responseText); 
			  D.find('.button_blue').on('click', funcSubmit);
			}
		   });
		  }
		  return false;
			});
		 
		 $form.submit();
		 }
 
		 //вызываем обработчик
		 
		 D.find('.button_blue').on('click', funcSubmit);
	
		A.unbind('click').bind('click', function(event){
			event.preventDefault();
			A.blur();
			D.dialog('open');
		});
		D.on( "dialogopen", function( event, ui ) {
			$(window).unbind('resize.dialog').bind('resize.dialog',function(){
				datefield.datepicker("hide");datefield.blur();
			});
		});
		D.on( "dialogclose", function( event, ui ) {
			$(window).unbind('resize.dialog');
		});
	});
}
//end of closure
})(jQuery);


(function($) { //create closure
    $.fn.sendResume = function(options) {
        this.each(function(){
            var A = $(this), T;
            var D = createDialog(A.attr('href'), A.data('popwidth'));
            D.find(':checkbox:not(".custom")').replaceCheckBox();
            D.find(':radio:not(".custom")').replaceRadio();
            D.find('form').submit(function(e){
                e.preventDefault();
                var form = $(this);
                form.formValidator();
                if (form.data('valid')=='true') {
                    $.ajax({
                        url: form.attr('action'),
                        data: form.serialize(), // передаем значения чекбоксов
                        method: 'post',
                        dataType: 'html',
                        complete: function(data){ // ответ от сервера
                            D.html(data.responseText); // обновим окошко
                            //       form.submit();
                        }
                    });
                }

                return false;
            });
            A.unbind('click').bind('click', function(event){
                event.preventDefault();
                A.blur();
                D.dialog('open');
                return false;
            });
        });
    }
//end of closure
})(jQuery);


(function($) { //create closure
$.fn.replaceDate = function(options) {
	this.each(function(){
		var inp = $(this);
		if (inp.hasClass('custom')) return false;
		inp.datepicker().addClass('custom');
	});
}
//end of closure
})(jQuery);



(function($) { //create closure
$.fn.formValidator = function(options) {
	var defaults = {
	};
	var errors = 0; var msg='';
	this.each(function() {
		var o = $.extend(defaults, options), form = $(this), inputs = $(':input', form), il = inputs.length;
		//form.find('.but .field').after('<div class="required"><span>Осталось заполнить поля</span></div>');
		form.find('required').css('display', 'none');
		inputs.each(function(){
			var inp = $(this), par = inp.parents('.fieldrow'), val = inp.val();
			inp.removeClass('error');
			inp.removeClass('ok');
			par.find('.error').css('display', 'none');
			if (inp.data('validate') || inp.data('required') || inp.data('errrequired')) {
				if (inp.data('required') && inp.val() == '') { 
					//inp.addClass('error'); 
					par.find('.error.required').css('display', 'block');
					//par.closest('.inForm').find('.required span').after('<a href="#">' + par.find('label').text()+'</a>');
					par.closest('.inForm').find('.required').css('display', 'inline-block');
				} else {
					//inp.addClass('ok'); 
					switch(inp.data('validate')) {
						case 'number':
							if (val != '') {
								var validchars="-+0123456789. ";
								for (var i=val.length-1; i>=0; i--) {
									var x = new String(val.charAt(i));
									var checker = validchars.lastIndexOf(x) > -1;
									if (!checker) {
										inp.removeClass('ok'); 
										inp.addClass('error'); 
										par.find('.error.validate').css('display', 'block');
										break;
									}
									else {
										inp.addClass('ok'); 
									};
								}
							}
						break;
						case 'email':
							if (val != '') {
								if (!(/^([a-z0-9_\-]+\.)*[a-z0-9_\-]+@([a-z0-9][a-z0-9\-]*[a-z0-9]\.)+[a-z]{2,4}$/i).test(val)) {
									inp.removeClass('ok'); 
									inp.addClass('error'); 
									par.find('.error.validate').css('display', 'block');
								}
									else {
										inp.addClass('ok'); 
									}
							}
						break;
						default:
						break;
					}
				}
			} else {
			}
		});

                form.data('valid', ($(':input.error', form).length > 0)?'false':'true');
	});
}
//end of closure
})(jQuery);




function createDialog(ID, W) {
	var T, el = $(ID);
	W = (!W) ? el.width() : W;
	el.css({float: 'none'}); // float должен быть в css, чтобы вычислить ширину блока по контенту
	return el.dialog({
		modal: true,
		resizable: false,
		draggable: false,
		closeText: 'закрыть',
		dialogClass: 'unipopup',
		minWidth: 480,
		minHeight: 260,
		create: function(event, ui) {
			var d = $(event.target);
			d.wrap('<div class="wrap_main"><div class="wrap_l"><div class="wrap_r"></div></div></div>');
			d.before('<div class="wrap_top"><div class="wrap_l"></div><div class="wrap_r"></div></div>');
			d.after('<div class="wrap_bottom"><div class="wrap_l"></div><div class="wrap_r"></div></div>');
			var R = parseInt(d.parent('.wrap_r').css('padding-right')), 
			L = parseInt(d.parent().parent('.wrap_l').css('padding-left'));
			if (W) {
				d.dialog({width: W+((!isNaN(R)) ? R: 0)+((!isNaN(L)) ? L: 0)});
			}

		},
		open: function(event, ui) {
			var zi = 0, d = $(event.target), uid = d.parents('.ui-dialog');
			uid.siblings().each(function(){
				if (!$(this).hasClass('ui-dialog')) {
					var nzi = parseInt($(this).css('z-index'));
					zi = Math.max(zi, (!isNaN(nzi)) ? nzi: 0);
				}
			});
			$('.ui-widget-overlay').css({'height':$(document).outerHeight(true), 'width':'100%', 'z-index':zi+1});
			uid.css({'z-index':zi+2, 'position':'absolute'});

			$('.wrap_top, .wrap_bottom', uid).width(uid.find('.popup').width()+30);
			
		        $(window).unbind('.pop'+d.attr('id')).bind('resize.pop'+d.attr('id'), function(){
		        	window.clearTimeout(T);
		        	T = window.setTimeout(function(){
		        		d.dialog({position: ['center','center']});
		        	}, 100);
		        });
		},
		close: function(event, ui){
			var d = $(event.target);
			$(window).unbind('.pop'+d.attr('id'));
		}
	}).dialog('close');
}


(function($) { //create closure
$.fn.evenly = function(options){
	this.each(function(){
		var nodes = $(this).children(), H=0;
		nodes.each(function(){
			H = Math.max(H, $(this).height());
		});
		nodes.height(H);
	});
}
//end of closure
})(jQuery);



(function($) { //create closure
$.fn.toothy = function(options){
	this.each(function(){
		var cont = $(this), nodes = cont.children(), T = 600, A = 'easeOutCubic';
		nodes.each(function(){
			var node = $(this), tooth = node.children('.tooth'), needle = tooth.children('.needle'), opener = $('<a href="#" class="opener"></a>').appendTo(tooth);
			needle.data('openedH', needle.height());
			tooth.addClass('prepared closed');
			needle.data('closedH', needle.height());
			needle.height(needle.data('closedH'));
			tooth.height('auto');
			opener.click(function(e){
				e.preventDefault();
				$(this).blur();
				var H = (tooth.hasClass('closed'))? needle.data('openedH') : needle.data('closedH');
				needle.stop().animate({height: H}, T, A, function(){
					if (tooth.hasClass('closed')) {
						tooth.removeClass('closed').addClass('opened');
					} else {
						tooth.removeClass('opened').addClass('closed');
					}
				});
			});
		});

	});
}
//end of closure
})(jQuery);


(function($) { //create closure
$.fn.inTextIMG = function(options){
	this.each(function(){
		$(this).each(function(){
			var img = $(this), alt = img.attr('alt');
			img.wrap('<span class="pic" />');
			img.after('<em class="pictitle">'+alt+'</em>');
		});
	});
}
//end of closure
})(jQuery);

(function($) { //create closure
$.fn.formFunc = function(options) {
	this.each(function(){
		var form = $(this), driveblock = form.find('.driver'), phoneblock = form.find('.onephone');
		form.find('.button_blue').attr('disabled','disabled' );
		form.find('.button_blue').addClass('noact');
		form.find('.noact').after('<em class="ermess">не заполнены все обязательные поля</em>');
		var labl = form.find('label');
		// водители 
		driveblock.each(function(){
			var drb = $(this);
			drb.delegate('.fieldrow .delet', 'click', function(){
					$(this).blur();
				var par = $(this).parent(), sel = par.children('select option:selected');
			//	sel.removeAttr('selected');
					par.remove();
				return false;
			});
			drb.find('#adddriver').click(function(){
					$(this).blur();
				var srcblock = drb.find('.fieldrow:last()');
				var trgblock = srcblock.clone();
				srcblock.after(trgblock);
				trgblock.find('.delet').remove();
				trgblock.append('<a href="#" class="delet">Удалить</a>');
				trgblock.show(function(){
					$('.footer').css('display','none').css('display','block');
				});
				var par = trgblock.find('select').parent();
				trgblock.find('select').removeClass('custom');
				par.find('.selopener').remove();
				par.find('.inpseltxt').remove();
				par.removeAttr('style').removeAttr('class');
				trgblock.find('select:not(".custom")').selectReplace();
				var mask = /\d+/;
				var hdrIncrement = function (_str, _i, _src) { return parseInt(_str, 10) + 1; };
				trgblock.find('span:first()').text(trgblock.find('span:first()').text().replace(mask, hdrIncrement));
				var sel = trgblock.find('span:first()').next().next().find('select');
				sel.attr('name', sel.attr('name').replace(mask, hdrIncrement));
				var sel1 = trgblock.find('span:first()').next().next().next().next().find('select');
				sel1.attr('name', sel1.attr('name').replace(mask, hdrIncrement));

				return false;
			});
		});
		// телефоны 
		phoneblock.each(function(){
			var phb = $(this);
            $('.additional_phone').hide();
			phb.parent().find('#addphone').click(function(){
                $(this).hide();
                $(this).parent().find('input').attr('class','w270px');
                $('.additional_phone').show(function(){
					$('.footer').css('display','none').css('display','block');
				});
				return false;
			});
		});
	
		form.find('input[data-required="true"], textarea[data-required="true"]').change(function(){

			if(form.find('input[data-required="true"], textarea[data-required="true"]').val()!='')
			{
				form.find('.button_blue').removeAttr('disabled');
				form.find('.button_blue').removeClass('noact');
			}
		});
		form.find('input[data-required="true"], textarea[data-required="true"]').focusin(function(){
			form.find('.ermess').remove();
		});
		form.submit(function(e){

				var bl = $('<div class="hidden"/>');
				form.find('.driver textarea.hidden').after(bl);

			form.find('.driver .fieldrow').each(function(){
				var field = $(this);
				var	spn = field.find('span:first()').text();
				var lbl1 = field.find('.opt1').prev('label').text();
				var sel1 = field.find('.opt1 .inpseltxt').text();
				var lbl2 = field.find('.opt2').prev('label').text();
				var sel2 = field.find('.opt2 .inpseltxt').text();

				bl.append(spn + '   ' + lbl1 + ' '+sel1+' '+lbl2+' '+ sel2 + ' &#167;');	
			});
				form.find('.driver textarea.hidden').val(form.find('.driver div.hidden').text());
				form.find('.driver div.hidden').remove();
				
				//console.log(form.find('.driver textarea.hidden').val());
	

			//e.preventDefault();
		//	form.formValidator();
			//if (form.data('valid')=='true') {
/* раскомментировать
				$.ajax({
					url: form.attr('action'),
					data: form.serialize(), // передаем значения чекбоксов
					complete: function(data){ // ответ от сервера 
*/

// следующую строку убить - имитация ответа сервера
	//	var data = '<h1><span>Спасибо<br>за заявку!</span></h1><p class="thanks">Мы обязательно свяжемся<br />с Вами сегодня с 16:00 до 18:00</p>'; // пример ожидаемого html
				//	form.html(data); // обновим окошко
			
                //form.submit(); 
/* раскомментировать
					}
				});
*/
			//}
			labl.each(function(){
				var par = $(this).parent().find('input, textarea');
				if($(this).find('.form-error-fld').length > 0)
				{
					par.addClass('error');

				}
				else {
					par.removeClass('error');
					par.addClass('ok');
				}
			});

		});
	});
}
//end of closure
})(jQuery);

(function($) { //create closure
$.fn.vacOpen = function(options) {
	var obj = $(this), all = $(this).find('.all');
	obj.each(function(){
		var vac = $(this), a = vac.find('.name');
		if(!a.parent().hasClass('open')) {
				vac.find('.descr').hide();
				a.parent().addClass('close');
				}
		a.click(function(){
			$(this).blur();
			var par = $(this).parent();
			if(!par.hasClass('open') && !par.find('.all').hasClass('open'))
			{
				par.find('.descr').slideDown(300, function(){
				$('.footer').css('display','none').css('display','block');
				});
				par.addClass('open');
				par.removeClass('close');
				op();
			}
			else if (par.hasClass('open') && !par.find('.all').hasClass('open'))
			{
				par.find('.descr').slideUp(300, function(){
				$('.footer').css('display','none').css('display','block');
				});
				par.removeClass('open');
				par.addClass('close');
				op();

			}
			else if (par.hasClass('open') && par.find('.all').hasClass('open'))
			{
				par.find('.descr').slideUp(300, function(){
				$('.footer').css('display','none').css('display','block');
				});
				par.removeClass('open');
				par.addClass('close');
				par.find('.all').hide();
			}
			else {
				par.find('.descr').slideDown(300, function(){
				$('.footer').css('display','none').css('display','block');
				});
				par.addClass('open');
				par.removeClass('close');
				par.find('.all').show();
			}

			return false;
		});

	});
	op();
	function op() {
		if(obj.length > 1){
		all.removeClass('open').hide();
		obj.filter('.close').first().find('.all').show();
		}
	}
	all.click(function (){
		$(this).blur();
		if(!all.hasClass('open'))
			{
				obj.removeClass('close');
				obj.addClass('open');
				obj.find('.descr').slideDown(300, function(){
				$('.footer').css('display','none').css('display','block');
				});
				all.find('span:not(".before")').text('Скрыть все');
				all.show().addClass('open');

			}
			else {
				obj.removeClass('open');
				obj.addClass('close');
				obj.find('.descr').slideUp(300, function(){
				$('.footer').css('display','none').css('display','block');
				});
				all.find('span:not(".before")').text('Развернуть все');
					
				op();
			}
		return false;
	});


}
//end of closure
})(jQuery);


(function($) { //create closure

// Фотогалерея
$.fn.coverflowGallery = function(options) {

	if ($(this).length < 1) {
		return false;
	}

	// jquery.mousewheel. Нужен только тут, так что тут и подключаю
	(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else if(typeof exports==="object"){module.exports=e}else{e(jQuery)}})(function(e){function o(t){var n=t||window.event,s=[].slice.call(arguments,1),o=0,u=0,a=0,f=0,l=0,c;t=e.event.fix(n);t.type="mousewheel";if(n.wheelDelta){o=n.wheelDelta}if(n.detail){o=n.detail*-1}if(n.deltaY){a=n.deltaY*-1;o=a}if(n.deltaX){u=n.deltaX;o=u*-1}if(n.wheelDeltaY!==undefined){a=n.wheelDeltaY}if(n.wheelDeltaX!==undefined){u=n.wheelDeltaX*-1}f=Math.abs(o);if(!r||f<r){r=f}l=Math.max(Math.abs(a),Math.abs(u));if(!i||l<i){i=l}c=o>0?"floor":"ceil";o=Math[c](o/r);u=Math[c](u/i);a=Math[c](a/i);s.unshift(t,o,u,a);return(e.event.dispatch||e.event.handle).apply(this,s)}var t=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"];var n="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"];var r,i;if(e.event.fixHooks){for(var s=t.length;s;){e.event.fixHooks[t[--s]]=e.event.mouseHooks}}e.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var e=n.length;e;){this.addEventListener(n[--e],o,false)}}else{this.onmousewheel=o}},teardown:function(){if(this.removeEventListener){for(var e=n.length;e;){this.removeEventListener(n[--e],o,false)}}else{this.onmousewheel=null}}};e.fn.extend({mousewheel:function(e){return e?this.bind("mousewheel",e):this.trigger("mousewheel")},unmousewheel:function(e){return this.unbind("mousewheel",e)}})})

	var container = $(this),
		photos = $('.gallery_photo-list', container),
		photo = $('.gallery_photo-item', photos),
		management = $('.gallery_management', container),
		slider = $('.gallery_slider', management),
		folders = $('.gallery_folder-list', management),
		folder = $('.gallery_folder-item', folders),
		pl = photo.length,
		fl = folder.length,
		w = management.width(),
		sliderWidth = slider.width(),
		halfSlider = sliderWidth / 2,
		sliderAmplitude = w - sliderWidth,
		max = w - sliderWidth;

	// Ставим стартовые значения
	setActivePhoto(photo.first());

	// Установка ширины разделов в слайдере
	folders.cleanWS();
	folder.each(function() {
		var el = $(this),
			quantity;
		quantity = photo.filter('[data-folder="' + el.data('folder') + '"]').length;
		el.width(quantity / pl * w);
	});

	// Поведение слайдера
	slider
		.draggable({
			axis: 'x',
			containment: 'parent',
			drag: function(e, ui) {
				handleDrag(ui.position.left);
			}
		});

	folders.on('click', function(e) {
		var left = e.pageX - folders.offset().left - halfSlider;
		left = left < 0 ? 0 : left > max ? max : left;
		slider.css('left', left + 'px');
		handleDrag(left);
	});

	// Клик по фотке
	photo.on('click', function() {
		setActivePhoto($(this));
		setActiveSlider();
	});

	// Стрелки влево/вправо
	$(document).on('keydown', function(e){
		if (e.keyCode == 37) {
			setActivePhoto($('.active', photos).prev());
			setActiveSlider();
			return false;
		}
		if (e.keyCode == 39) {
			setActivePhoto($('.active', photos).next());
			setActiveSlider();
			return false;
		}
	});

	// Скролл
	photos.mousewheel(function(event, delta, deltaX, deltaY) {
	    if (deltaY > 0) {
			setActivePhoto($('.active', photos).prev());
			setActiveSlider();
	    }
	    if (deltaY < 0) {
			setActivePhoto($('.active', photos).next());
			setActiveSlider();
	    }
	    return false;
	});

	// Получая центр координаты слайдера, возвращает вызов функции показа фотки
	function handleDrag(x) {
		var activePhoto = Math.round(x / max * pl);
		activePhoto = activePhoto === 0 ? 1 : activePhoto;
		activePhoto = photo.filter(':nth-child(' + activePhoto + ')');
		setActivePhoto(activePhoto);
	};

	// Ставит на место слайдер, исходя из текущей активной фотки
	function setActiveSlider() {
		var i = photo.filter('.active').index(),
			left = (i / pl * max) + halfSlider;
			left = left < 0 ? 0 : left > max ? max : left;
		slider.css('left', left + 'px');
	};

	// Ставит изначальные стили для всех фоток, и .active на активное фото
	// Ставит .active нужному .gallery_folder-item
	// Перед этим все эти стили и классы очищает
	// Транзишны прописаны в цсс
	function setActivePhoto(curPhoto) {

		if(curPhoto.hasClass('active') || curPhoto.length === 0) {
			return false;
		}

		photo
			.removeClass('active')
			.attr('style', '');

		curPhoto
			.addClass('active')
			.next()
				.css({
					'left': '238px',
					'z-index': '98',
					'transform': 'scale(0.82)' + ' rotateY(-15deg)'
				})
				.next()
					.css({
						'left': '295px',
						'z-index': '97',
						'transform': 'scale(0.7)' + ' rotateY(-30deg)'
					})
					.next()
						.css({
							'left': '341px',
							'z-index': '96',
							'transform': 'scale(0.61)' + ' rotateY(-44deg)'
						})
						.nextAll()
							.each(function(i) {
								i += 1;
								$(this).css({
									'left': 340 + 57 * i + 'px',
									'z-index': 96 - i + '',
									'transform': 'scale(0.61)' + ' rotateY(-44deg)'
								});
							})
							.end()
						.end()
					.end()
				.end()
			.prev()
				.css({
					'left': '74px',
					'z-index': '98',
					'transform': 'scale(0.82)' + ' rotateY(15deg)'
				})
				.prev()
					.css({
						'left': '14px',
						'z-index': '97',
						'transform': 'scale(0.7)' + ' rotateY(30deg)'
					})
					.prev()
						.css({
							'left': '-31px',
							'z-index': '96',
							'transform': 'scale(0.61)' + ' rotateY(44deg)'
						})
						.prevAll()
							.each(function(i) {
								i += 1;
								$(this).css({
									'left': -31 - 57 * i + 'px',
									'z-index': 96 - i + '',
									'transform': 'scale(0.61)' + ' rotateY(44deg)'
								});
							});

		folder
			.removeClass('active')
			.filter('[data-folder="' + curPhoto.data('folder') + '"]')
				.addClass('active');
	};


}

//end of closure
})(jQuery);

(function($) { //create closure
$.fn.opener = function(options){
	this.each(function(){
		var door = $(this).find('.name');
		if(!$(this).parent().hasClass('open'))$(this).parent().find('.descr').hide();
		door.click(function() {
			$(this).parent().find('.descr').slideToggle(300, function(){
				$('.footer').css('display','none').css('display','block');
			});
			$(this).parent().toggleClass('open');
			return false;				
		});
	});
}
//end of closure
})(jQuery);


(function($) { //create closure
$.fn.inputoverlabel = function(options){
	this.each(function(){
	var form = $(this);
	$('input[type=text],input[type=search],input[type=password],textarea', form).each(function(){
		var input = $(this);
		var label = $('label[for='+input.attr('id')+']', form);
		if (input.val()!='') label.addClass('hidden');
		input.unbind('focus.hidelabel').bind('focus.hidelabel', function(){
			label.addClass('hidden');
			input.parent().removeClass('error');
		});
		input.unbind('blur.showlabel').bind('blur.showlabel', function(){
			input.val($.trim(input.val()));
			if (input.val()=='') label.removeClass('hidden');
		});
	});
	});
}
//end of closure
})(jQuery);

(function($) { //create closure
$.fn.openTest = function(options) {
	this.each(function(){
		var A = $(this), T;
		var D = createDialog(A.attr('href'), A.data('popwidth'));
		D.find(':radio:not(".custom")').replaceRadio();
		 //создаём функцию
		 var funcSubmit = function (ev) {
		 var $btn = $(this); 
		 var $form = $btn.closest('form');
		 
		 $form.submit( function(e){
		  e.preventDefault();
		 
		  var form = $(this);
		 
		  form.formValidator();
		 
		  if (form.data('valid')=='true') {
		   $.ajax({
			url: form.attr('action'),
			data: form.serialize(), // передаем значения чекбоксов
			method: 'post',
			dataType: 'html',
//			contentType:'multipart/form-data',
			complete: function(data){ // ответ от сервера    
			  D.html(data.responseText); 
			  D.find('.button_blue').on('click', funcSubmit);
			}
		   });
		  }
		  return false;
			});
		 
		 $form.submit();
		 }
 
		 //вызываем обработчик
		 
		 D.find('.button_blue').on('click', funcSubmit);
		
		A.unbind('click').bind('click', function(event){
			event.preventDefault();
			A.blur();
			D.dialog('open');
            return false;
		});
	});
}
//end of closure
})(jQuery);


