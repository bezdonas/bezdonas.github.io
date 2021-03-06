$(function() {

	$('.anons-list, .author').syncLinks();

	$('.blogs-news').blogsNews();

	$('body').mediaHelper();

	$('.searchpage').searchPage();

	$('#search_date-from, #search_date-to').data('prepareDatepicker', {
		maxDate: new Date()
	});

	$('.datepicker').prepareDatepicker();

	$('.news-gallery').newsGallery();
	$('.comlink').comlinks();
	$('.ui-custom-radio').radioReplace();

	$('.custom-select').selectForward();


	$('.blog_page #tab-bloggers .js-loadmore').data('loadMore', {
		par: 2
	});
	$('.js-loadmore').loadMore();
	$('.material').loadMore({obj: '.anons-list._simple', par: false});
	$('.best').loadMore({obj: '.col._w49', par: 'pn'});
	$('.commentBlock').loadMore({obj: '.comment', par: false});
	$('.commentBlock').loadMore({obj: '.comment', par: false});

	$('.textblock > p').hover(function() {		
		var h = $(this).css("height", "auto").height();
		$(this)
			.css({
				'height': '260px',
				'position': 'static'
			})
			.animate({
				height: h
			}, 200 );
	}, function() {
		$(this)
			.css({
				'position': 'relative'	
			})
			.animate({
				'height': '260px',
				'overflow': 'hidden'	
			}, 200 );
	});
		
	$('.js-autocomplete').prepareAutocomplete();
	$('.blog_page')._tabs({
					links: '.tablink',
					boxes: '.box',
					boxesCnt: '.tabwrap'
	});
	$('.profile_page')._tabs({
					links: '.tablink',
					boxes: '.box',
					boxesCnt: '.tabwrap'
	});

	$('.sign-in.js-ajaxPopup').data('ajaxPopup', {
		smallPopup: true
	});
	$('.sign-up.js-ajaxPopup').data('ajaxPopup', {
		'popupClass': '_sign-up'
	});
	$('.js-ajaxPopup').ajaxPopup();

});



(function($) {

	$.fn.cleanWS = function(options){
		this.each(function(){
			var container = this, nodes = container.childNodes;
			var i = nodes.length-1;
			while (i>-1) { if (nodes[i].nodeType == 3) container.removeChild(nodes[i]); 
				i--;
			}
		});
	};

})(jQuery);


(function($) {

	// Syncs links hover with equal href attribute inside calling container
	// It's done via 'hover' class, which must duplicate :hover effect in css
	$.fn.syncLinks = function(hoverClass) {

		var cont = $(this),
			hoverClass = hoverClass ? hoverClass : 'hover';

		if (cont.length === 0) {
			return false;
		}

		cont.find('a').each(function() {

			var elem = $(this),
				href = elem.attr('href'),
				brothers = cont.find('a[href="' + href + '"]');

			if (brothers.length > 0) {
				elem
					.off('mouseover.syncLinks')
					.off('mouseleave.syncLinks')
					.on('mouseover.syncLinks', cont, function() {
						brothers.addClass(hoverClass);
					})
					.on('mouseleave.syncLinks', cont, function() {
						brothers.removeClass(hoverClass);
					});
			}

		});

	}

})(jQuery);

(function($) {

	// Blogs-news block specific logic.
	// Provides tabs/media logic
	// Requires $.fn._tabs
	$.fn.blogsNews = function(options) {

		return this.each(function() {
			var cont = $(this),
				o = $.extend({}, $.fn.blogsNews.defaults, options, cont.data('blogsNews')),
				preTabs = $('.create-blog', cont),
				titles = $('.section-title', cont),
				links = $('a', titles),
				blocks = $('.anons-list', cont),
				tabLinks = $('<div/>', {
					'class': 'tab-links'
				}),
				tabBox = $('<div/>', {
					'class': 'tab-box'
				});
			
			init();
			function init() {
				prepareMarkup();
				activateTabs();
			};

			// prepares markup for tabs
			function prepareMarkup() {
				blocks.prependTo(cont).wrapAll(tabBox);
				titles.prependTo(cont).wrapAll(tabLinks);
				preTabs.prependTo(cont);
			};

			function activateTabs() {
				cont._tabs({
					links: links,
					boxes: blocks,
					boxesCnt: tabBox,
					callback: function(el) {
						el = $(el);
						if (el.parent().parent().hasClass('_optional')) {
							preTabs.addClass('hidden');
						} else {
							preTabs.removeClass('hidden');
						}
					}
				});
			};

		});

	};

	$.fn.blogsNews.defaults = {

	};

})(jQuery);


(function($) {

	$.fn._tabs = function(options) {

		return this.each(function() {
			var cont = $(this),
				o = $.extend({}, $.fn._tabs.defaults, options, cont.data('_tabs')),
				links = $(o.links, cont),
				boxes = $(o.boxes, cont),
				boxesCnt = $(o.boxesCnt, cont),
				fBoxes = $('[data-tabs-id]', cont),
				hash;
			
			init();
			function init() {
				prepare();
				bindHandler();
				resizeChecker();
			};

			function prepare() {
				boxes.not(':first-child').addClass('hidden');
				links.first().addClass('active');
			};

			function bindHandler() {
				links
					.off('click.tabs')
					.on('click.tabs', cont, function(e) {
						var el = $(this);
						if(!el.parent().hasClass('b-filterlist')){
							var hash = el.attr('href');
						}
						else {
							var hash = el.find('a').attr('href');
						}
						var box = boxes.filter(hash);

						if (el.hasClass('active')) {
							return false;
						}

						boxes.addClass('hidden');
						box.removeClass('hidden');
						fBoxes.addClass('hidden');
						fBoxes
							.filter('[data-tabs-id="' + hash.split('#')[1] + '"]')
							.removeClass('hidden');

						// boxesCnt.height(box.height());

						links.removeClass('active');
						el.add(el.parents('.tablink')).addClass('active');

						if (o.callback) {
							o.callback(this);
						}

						return false;
					});
			};

			function resizeChecker() {
				$(window)
					.off('resize.tabsCheck')
					.on('resize.tabsCheck', function() {
						if (!links.filter('.active').is(':visible')) {
							links.first().click();
						}
					});
			};

		});

	};

	$.fn._tabs.defaults = {
		links: '.tablink',
		boxes: '.box'
	};

})(jQuery);


(function($) {

	// Some helpers for media query stuff, which can not be done via css.
	$.fn.mediaHelper = function(options) {

		return this.each(function() {
			var cont = $(this),
				o = $.extend({}, $.fn.mediaHelper.defaults, options, cont.data('mediaHelper')),
				sidebar = $('.content_sidebar', cont);
			

			if (sidebar.css('position') === 'absolute') {
				sidebar.css('opacity', '0');
			
				$(window)
					.off('resize.mediaHelper')
					.on('resize.mediaHelper', function() {
						sidebar.removeAttr('style');
					});
			}

		});

	};

	$.fn.mediaHelper.defaults = {

	};

})(jQuery);


(function($) {

	// Page specific
	$.fn.searchPage = function(options) {

		return this.each(function() {
			var cont = $(this),
				filterLnk = $('.filter-link', cont),
				filters = $('.filters', cont)
				o = $.extend({}, $.fn.searchPage.defaults, options, cont.data('searchPage'));
			
			filterLnk
				.off('click.searchpage')
				.on('click.searchpage', cont, function() {
					cont.toggleClass('hidefilters');
				});

		});

	};

	$.fn.searchPage.defaults = {

	};

})(jQuery);


(function($) {

	$.fn.prepareDatepicker = function(options) {

		return this.each(function() {
			var cont = $(this),
				o = $.extend({}, $.fn.prepareDatepicker.defaults, options, cont.data('prepareDatepicker'));
			
			cont.datepicker(o);

		});

	};

	$.fn.prepareDatepicker.defaults = {
		showOn: 'both',
		buttonImage: 'i/datepicker.png',
		buttonImageOnly: true
	};

})(jQuery);


(function($) {

	$.fn.newsGallery = function(options) {

		return this.each(function() {
			var cont = $(this),
				o = $.extend({}, $.fn.newsGallery.defaults, options, cont.data('newsGallery')),
				frame = $('.frame', cont),
				pc = $('.photo-container', cont),
				pics = $('.pic', cont),
				active = $('.pic:nth-child(1)', cont), // by default the active pic is the first one
				prev = $('.prev', cont),
				next = $('.next', cont),
				w = o.frameWidth;
			
			init()
			function init() {
				// We don't need this if there's only one pic
				if (pics.length <= 1) {
					return false;
				}
				prepare();
				bindHandlers();
			};

			// Preparations
			function prepare() {
				pics.cleanWS();
				pc.css({
					'width': '99999px',
					'padding-left': w + 'px'
				});
				changePic();
			};

			// Bind prev/next/pic click handlers
			function bindHandlers() {
				next.add(prev).on('click', cont, function() {
					if ($(this).hasClass('disabled')) {
						return false;
					}
					active = $(this).hasClass('next') ? active.next() : $(this).hasClass('prev') ? active.prev() : active;
					changePic();
				});
			};

			// Changes pic for the one, which is contained in active variable
			function changePic() {
				if (active[0].complete) {
					go();
				} else {
					active.load(go);
				}

				function go() {
					var l = active.offset().left - pc.offset().left - (w - active.width())/2;

					pics.removeClass('active');
					active.addClass('active');
					checkDisabled();
					frame
						.height(active.height())
						.scrollTo({top: 0, left: l}, 500);
				};
			};

			// Checks if prev/next are needed
			function checkDisabled() {
				if (active.is(':last-child')) {
					next.addClass('disabled');
				} else {
					next.removeClass('disabled');
				}

				if (active.is(':first-child')) {
					prev.addClass('disabled');
				} else {
					prev.removeClass('disabled');
				}
			};

		});

	};

	$.fn.newsGallery.defaults = {
		frameWidth: 620
	};

})(jQuery);

(function($) {
	$.fn.comlinks = function(options) {

		return this.each(function() {
			var link = $(this),
				b = $('body'),
				form = $('.comForm'),
				popup = $('.popup'),
				popupCnt = $('.popup_cnt'),
				popupCloser = $('.popup_closer', popup),
				overlay = $('.overlay'),
				popupMarkup = '<div class="overlay"></div>' +
				'<div class="popup">' +
					'<div class="popup_cnt">' +
						'<div class="popup_closer"></div>' +
					'</div>' +
				'</div>';
			
			init();
			function init() {
				prepare();
			};

			function prepare() {
				preparePopup();
				bindClicks();
			};

			function preparePopup() {
				if (popup.length === 0) {
					b.append($(popupMarkup));

					popup = $('.popup');
					popupCnt = $('.popup_cnt');
					popupCloser = $('.popup_closer', popup);
					overlay = $('.overlay');

					hidePopup();
				}
			};

			
			function bindClicks() {
				link
					.off('click.comlink')
					.on('click.comlink', function(e) {
						e.preventDefault();
						popupCnt.append(form);
						showPopup();

                        return false;
					});
			};

			function showPopup() {

				popup.removeClass('hidden');
				overlay.show();
				popup.css({
					'margin-top': $(document).scrollTop() + $(window).height() / 2 - (popup.height() / 2),
					'margin-left': -(popup.width() / 2)
				});
				popup.find('form').submit(function(){
					var f =$(this);
					$.ajax({
						url: form.attr('action'),
						type: form.attr('method'),
						data: form.serialize(),
						cache: false
					}).done(function(text) {
								if (text == 'ok') {
									window.location = window.location.hash;
								} else {
									hidePopup();
								}
					});
					return false;
				});

				popupCloser.add(overlay)
					.off('click.close')
					.on('click.close', popup, function(){
						hidePopup();
					});
					
				// Escape press
				$(document).keyup(function(e) {
					if (e.keyCode == 27) {
						hidePopup();
					}
				});
			};

			function hidePopup() {
				popup.addClass('hidden');
				overlay.hide();
			};

		});

	};


})(jQuery);


(function($) {

	$.fn.ajaxPopup = function(options) {

		return this.each(function() {
			var cont = $(this),
				o = $.extend({}, $.fn.ajaxPopup.defaults, options, cont.data('ajaxPopup')),
				b = $('body'),
				url = cont.attr('href'),
				popupMarkup = '<div class="overlay"></div>' +
					'<div class="popup">' +
						'<div class="popup_cnt">' +
							'<div class="popup_closer"></div>' +
							'<div class="popup_ajaxData"></div>' +
						'</div>' +
					'</div>',
				popupMarkupSm = '<div class="overlay small-overlay"></div>' +
					'<div class="popup small-popup">' +
						'<div class="popup_cnt">' +
							'<div class="popup_closer"></div>' +
							'<div class="popup_ajaxData"></div>' +
						'</div>' +
					'</div>',
				overlay,
				popup,
				popupCnt,
				popupCloser,
				popupAjax;

			init();
			function init() {
				bindHandlers();
			};

			function preparePopup() {

				$('.popup').remove();
				$('.overlay').remove();

				if (o.smallPopup) {
					b.append($(popupMarkupSm));
					overlay = $('.overlay.small-overlay');
					popup = $('.popup.small-popup');
					popupCnt = $('.popup_cnt', popup);
					popupCloser = $('.popup_closer', popup);
					popupAjax = $('.popup_ajaxData', popup);
					popup.addClass('small-popup', popup);
				} else {
					b.append($(popupMarkup));
					overlay = $('.overlay');
					popup = $('.popup');
					popupCnt = $('.popup_cnt', popup);
					popupCloser = $('.popup_closer', popup);
					popupAjax = $('.popup_ajaxData', popup);
					if (o.popupClass) {
						popup.addClass(o.popupClass);
					}
				}
				hidePopup();
			};

			function bindHandlers() {
				cont
					.off('click.ajaxPopup')
					.on('click.ajaxPopup', function(e) {
						e.preventDefault();
						preparePopup();
						b.addClass('wait');
						$.ajax(url)
							.always(function(data) {
								b.removeClass('wait');
							})
							.success(function(data) {
								popupAjax.html(data);
								formCheck();
								showPopup();
							})
							.fail(function(data) {
								alert('Что-то пошло не так.')
							});
                        return false;
					});
			};

			function showPopup() {

				popup.removeClass('hidden');
				overlay.show();

				if (!o.smallPopup) {
					popup.css({
						'margin-top': $(document).scrollTop() + $(window).height() / 2 - (popup.height() / 2),
						'margin-left': -(popup.width() / 2)
					});
				}

				popupCloser.add(overlay)
					.off('click.close')
					.on('click.close', popup, function(){
						hidePopup();
					});

				// Escape press
				$(document).keyup(function(e) {
					if (e.keyCode == 27) {
						hidePopup();
					}
				});
			};

			function hidePopup() {
				popup.addClass('hidden');
				overlay.hide();
			};

			function formCheck() {
				var form = popup.find('form');

				if (form.length > 0) {
					var swPass = $('.switchpass', form);

					swPass
						.off('click')
						.on('click', function() {
							var fld = swPass.prev();
							if (fld.attr('type') === 'password') {
								swPass.text('Скрыть пароль');
								fld.attr('type', 'text');
							} else {
								swPass.text('Показать пароль');
								fld.attr('type', 'password');
							}
						});

					form
						.off('submit')
						.on('submit', function(e) {
							e.preventDefault();
							$.post(url, form.serialize(), function(data) {
								popupAjax.html(data);
								formCheck();
							});
						});
				}

			};
			
		});

	};

	$.fn.ajaxPopup.defaults = {

	};

})(jQuery);

(function($) {

	$.fn.loadMore = function(options) {

		return this.each(function() {
			var cont = $(this),
				o = $.extend({}, $.fn.loadMore.defaults, options, cont.data('loadMore')),
				obj = o.obj,
				par = o.par,
				link = $('.loadmore', cont);
			
			link
				.off('click.loadMore')
				.on('click.loadMore', cont, function(e) {
					e.preventDefault();
					var el = $(this),
						url = el.attr('href');
					el.addClass('wait');
					$.ajax(url).always(function() {
						el.removeClass('wait')
					}).success(function(data) {
						if( o.par === true){
							el.parent().before(data);
						} else if (o.par === 2) {
							el.parent().parent().before(data);
						} else if (o.par === 'pn') {
							el.parent().next().append(data);
						} else {
							cont.find(o.obj).last().after(data);
						}
					}).fail(function() {

					});
				});

		});

	};

	$.fn.loadMore.defaults = {
		par: true,
		obj: '.js-loadmore'
	};

})(jQuery);


(function($) {

	$.fn.prepareAutocomplete = function(options) {

		return this.each(function() {
			var cont = $(this),
				o = $.extend( {}, $.fn.prepareAutocomplete.defaults, options, JSON.parse(cont.attr('data-prepareAutocomplete')) ),
				cache = {};

			$.widget( "custom.catcomplete", $.ui.autocomplete, {
				_renderMenu: function( ul, items ) {
					var that = this;
					$.each( items, function( index, item ) {
						that._renderItemData( ul, item );
					});
					$.each( items, function( index, item ) {
						ul.find('li:nth-child(' + (index + 1) + ') a').append( "<div class='ui-autocomplete-category'>" + item.category + "</div>" );
					});
					ul.width(cont.width());
				},
				_resizeMenu: function() {
					this.menu.element.outerWidth( cont.outerWidth() );
				}
			});

			cont.catcomplete({
				source: function(request, response) {
					var term = request.term;
					if ( term in cache ) {
						response( cache[ term ] );
						return;
					}
					$.getJSON( o.url, request, function( data, status, xhr ) {
						cache[ term ] = data;
						response( data );
					});
				}
			})			

		});

	};

	$.fn.prepareAutocomplete.defaults = {

	};

})(jQuery);

(function($) {
	$.fn.radioReplace = function(options){
		var cont = $(this),
			input = cont.find('input[type="radio"]'),
			label = cont.find('label');

		input.each(function() {
			var name = $(this).attr('name'),
				id = $(this).attr('id'),
				replacer = $('<div class="radio-replacer"></div>');

			$(this).css({
				'position': 'absolute',
				'left': '-9999px'
			});

			replacer
				.attr({
					'data-name': name,
					'data-id': id
				})
				.insertAfter($(this))
				.on('click', cont, function() {

					label.filter('[for="' + id + '"]').click();

				});

			if ($(this).prop('checked')) {
				replacer.addClass('selected');
			}

		});

		label.each(function() {
			var for_attr = $(this).attr('for');

			$(this).on('click', cont, function() {

				var replacer = $('.radio-replacer[data-id="' + for_attr + '"]'),
					name = replacer.attr('data-name');

				$('.radio-replacer[data-name="' + name + '"]')
					.removeClass('selected');

				replacer.addClass('selected');

			});

		});
	};
})(jQuery);

(function($) {
	// For those, who don't support pointer-events
	$.fn.selectForward = function(options){
		function isIE() {
			var myNav = navigator.userAgent.toLowerCase();
			return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
		}
		if (isIE()) {
			$(this).addClass('ie');
		}
	};
})(jQuery);