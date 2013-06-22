$(function() {
	$('.js-navExpander').navExpander();
	$('.js-cleanWS').cleanWS();
	// Базовая инициализация
	$('.js-expander').expander();
	$('.js-tabs')._tabs();
	$('.js-contentGallery').contentGallery();
	$('#js-planGallery').planGallery();
	$('#js-photoGallery').photoGallery();
	$('.js-map').prepareMap();
});

$(window).load(function(){
	// Вторая инициализация -- когда загрузятся шрифты и картинки
	// (высота точнее определится)
	$('.js-expander').expander();
});

(function($) {

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

})(jQuery);



(function($) {

	$.fn.expander = function(options) {

		if ($(this).length === 0) {
			return false;
		}

		var cont = $(this),
			expanded = $('.js-expanded');

		expanded.attr('style', '');

		cont.each(function() {

			var el = $(this),
				options = $.extend({}, options, el.data('expander')),
				text, initial, _expanded;

			if (options['id']) {
				_expanded = expanded.filter('[data-expanded-id="' + options['id'] + '"]');
			} else {
				_expanded = el.next(expanded);
			}

			if (options['initial']) {
				_expanded.css('height', _expanded.removeClass('__hidden').innerHeight());
				if (options['initial'] === 'showed') {
					_expanded.removeClass('__hidden');
					if (options['text']) {
						el.text(options['text']['showed'])
					}
				} else {
					_expanded.addClass('__hidden');
					if (options['text']) {
						el.text(options['text']['hidden'])
					}
				}
				if (options['animation'] !== false) {
					setTimeout(function() {
						_expanded.css('transition', 'height ' + options['animation']);
					}, 0);
				}
			}

			el.off('click.expander');
			el.on('click.expander', function() {
				expanderHandler(el, options);
				return false;
			});

		});

		function expanderHandler(el, options) {

			var _expanded;

			if (options['id']) {
				_expanded = expanded.filter('[data-expanded-id="' + options['id'] + '"]');
			} else {
				_expanded = expanded;
			}
			
			_expanded.toggleClass('__hidden');

			if (options['animation'] !== false) {
				setTimeout(function() {
					$.scrollTo(el.offset().top, 400);
				}, 200);
			}

			if (options['text']) {
				text = el.text() === options['text']['hidden'] ? options['text']['showed'] : options['text']['hidden'];
				el.text(text);
			}

		};

	};

})(jQuery);



(function($) {

	$.fn.navExpander = function(options) {

		var cont = $(this),
			li = $('> ul > li', cont),
			active = $('.__active', cont),
			el, inner;

		li.on('mouseover', cont,  function() {
			el = $(this);
			inner = $('._inner', el);
			if (inner.length === 0) {
				return false;
			}
			$('._inner', li).removeClass('__expanded');
			inner.addClass('__expanded');
		});

		cont.on('mouseleave', cont, function() {
			el = $(this);
			$('._inner', li).removeClass('__expanded');
			showActive();
		});

		showActive();
		function showActive() {
			active.find('._inner').addClass('__expanded');
		};

	};

})(jQuery);



(function($) {

	// Название изменено на случай загрузки jQuery UI
	$.fn._tabs = function(options) {

		var cont = $(this);

		if (cont.length === 0) {
			return false;
		}

		cont.each(function() {

			var tabNav = $(this),
				_id = tabNav.data('tabs'),
				tabLi = tabNav.find('li'),
				tabLink = tabNav.find('a'),
				tabConts = $('.js-tab-containers').filter('[data-tab-containers=' + _id + ']'),
				tabCont = $('.js-tab-container', tabConts);

			// tabLink.off('click.tabs');
			tabLink.on('click.tabs', function() {
				var el = $(this),
					_id = el.data('tab');

				if (el.hasClass('__active')) {
					return false;
				}

				tabLi.removeClass('__active');
				el.parent().addClass('__active');

				tabCont.addClass('__hidden');
				tabCont.filter('[data-tab-container=' + _id + ']').removeClass('__hidden');

				// for ie7
				tabCont.css('opacity', '.99');
				setTimeout(function() {
					tabCont.css('opacity', '1');
				}, 0);

				return false;
			});

		});

	};

})(jQuery);



(function($) {

	$.fn.planGallery = function(options) {

		if ($(this).length === 0) {
			return false;
		}

		var cont = $(this),
			tabs = $('.tabs', cont),
			floor = $('._floor', cont),
			tabsLinks = $('a', tabs),
			floorLinks = $('a', floor);

			// Прелоадим картинки
			$(window).load(function() {

				var arr = [],
					i, arrL, img;
				floorLinks.each(function() {
					arr.push($(this).attr('href'));
				});

				arrL = arr.length;
				for (i = 0; i < arrL; i += 1) {
					img = new Image();
					img.src = arr[i];
				}

			});

			// Ставим на все ссылки сразу клик, ставящий класс __active
			$('a', cont).on('click.active', cont, function() {

				var el = $(this),
					img = el.attr('href');

				$(this)
					.closest('ul')
						.find('.__active')
						.removeClass('__active')
						.end()
					.end()
					.closest('li')
						.addClass('__active');

				return false;

			});

			// Клик по табу
			tabsLinks.on('click.tabs', tabs, function() {

				var el = $(this),
					dl = el.attr('data-list'),
					activeIndex = $('ul.__active .__active', floor).index() + 1;

				if (el.hasClass('.__active')) {
					return false;
				}

				$('ul', floor)
					.removeClass('__active')
					.filter('[data-list="' + dl + '"]')
						.addClass('__active')
						.find('li:nth-child(' + activeIndex + ')')
							.find('a')
								.click();


				return false;

			});

			// Клик по этажу
			floorLinks.on('click.tabs', tabs, function() {

				cont.css({
					'background-image': 'url(' + $(this).attr('href') + ')'
				});

				return false;

			});

			// На случай, если классы __active не проставлены
			if ($('.__active', tabs).length === 0) {
				$('li', tabs)
					.first()
					.addClass('__active');
			}
			if ($('ul.__active', floor).length === 0) {
				$('ul', floor)
					.first()
					.addClass('__active');
			}
			if ($('li.__active', floor).length === 0) {
				$('li', $('._floor ul.__active'))
					.first()
					.addClass('__active');
			}
			if (!cont.attr('style')) {
				$('li.__active', floor)
					.find('a')
					.click();
			}
	};

})(jQuery);



(function($) {

	$.fn.photoGallery = function(options) {

		if ($(this).length === 0) {
			return false;
		}

		var cont = $(this),
			next = $('._next', cont),
			prev = $('._prev', cont),
			frame = $('._frame', cont),
			figures = $('figure', frame),
			fl = figures.length,
			active = figures.filter('.__active'),
			w = $(window),
			ww = w.width(),
			aw = active.width(),
			ml, h;

		prepare();

		// Функция...
		function prepare() {

			// ...ставит первый активным, если активный не проставлен
			// и в хэше нет цифр
			h = parseInt(window.location.hash.split('#')[1]);
			if (!isNaN(h)) {
				active = figures.filter(':nth-child(' + h + ')');
			}

			if (active.length === 0) {
				active = figures.first();
			}

			// активирует его
			activate(active);

			// привязывает хэндлеры
			bindHandlers();

			// следим за ресайзом
			w.resize(function() {
				ww = w.width();
				activate(active);
			});
		};

		function bindHandlers() {
			// Сами фотки
			figures.on('click', cont, function() {
				var el = $(this);

				if (el.hasClass('__active') && el.next().length > 0) {
					activate(el.next());	
				} else if (el.not(':last-child')) {
					activate(el);
				}
				return false;
			});

			// Пойнтеры
			next.on('click', cont, function() {
				if (next.hasClass('__disabled')) {
					return false;
				}
				activate(active.next());
			});
			prev.on('click', cont, function() {
				if (prev.hasClass('__disabled')) {
					return false;
				}
				activate(active.prev());
			});

			// Стрелки клавиатуры
			$(document).on('keydown', function(e){
				if (e.keyCode == 37) {
					if (prev.hasClass('__disabled')) {
						return false;
					}
					activate(active.prev());
					return false;
				}
				if (e.keyCode == 39) {
					if (next.hasClass('__disabled')) {
						return false;
					}
					activate(active.next());
					return false;
				}
			});
		};

		// Проверяет, не нужно ли задизить поинтеры
		function checkPointers() {
			if (active.next().length === 0) {
				next.addClass('__disabled');
			} else {
				next.removeClass('__disabled');
			}
			if (active.prev().length === 0) {
				prev.addClass('__disabled');
			} else {
				prev.removeClass('__disabled');
			}
		};

		// Движет поинтеры на фиксированное расстояние от картинки
		function movePointers() {
			next.css('left', ml*-1 + ww/2 + aw/2 + 20 + 'px');
			prev.css('left', ml*-1 + ww/2 - aw/2 - 60 + 'px');
		};

		// Ставит левый маргин контейнеру
		function leftMargin() {
			aw = active.width()
			ml = (ww/2 - aw/2) - (active.offset().left - figures.first().offset().left)
			cont.css('margin-left', ml + 'px');
		};

		// Активатор картинки. Кормим ему jQuery-объект, он сам все сделает.
		function activate(el) {
			figures.removeClass('__active');
			active = el.addClass('__active');
			window.location.hash = active.index() + 1;
			leftMargin();
			movePointers();
			checkPointers();
		};

	};

})(jQuery);



(function($) {

	$.fn.contentGallery = function(options) {

		if ($(this).length === 0) {
			return false;
		}

		var cont = $(this),
			img = $('img', cont),
			ul = $('ul', cont)
			lnk = $('a', ul);

		// Прелоадим картинки
		$(window).load(function() {

			var arr = [],
				i, arrL, img;

			lnk.each(function() {
				arr.push($(this).attr('href'));
			});

			arrL = arr.length;
			for (i = 0; i < arrL; i += 1) {
				img = new Image();
				img.src = arr[i];
			}

		});

		// Клик по ссылке
		lnk.on('click', cont, function() {
			var el = $(this);

			lnk.removeClass('__active');
			el.addClass('__active');
			img.attr('src', el.attr('href'));

			return false;
		});

		// Клик по фотке
		img.on('click', cont, function() {
			var next = $('.__active', ul).parent().next();

			if (next.length > 0) {
				next.find('a').click()
			} else {
				lnk.first().click();
			}

		});

		// По умолчанию ставим первую активной
		if ($('.__active', ul).length === 0) {
			lnk.first().click();
		};

	};

})(jQuery);



(function($) {

	var cont,
		ymapsScriptUrl = 'http://api-maps.yandex.ru/2.0-stable/?load=package.standard,package.route&lang=ru-RU',
		placemarkOptions = {
			iconImageHref: './i/placemark.png',
			iconImageSize: [39, 37],
			iconImageOffset: [-10, -35]
		},
		volhonkaOverlay, mapOptions, contId, places, check, map, str, pm, pmj, iv, o, i;

	$.fn.prepareMap = function(options) {

		return this.each(function() {

			cont = $(this);
			o = $.extend({}, options, cont.data('map-options'));

			if (!window.ymaps) {
				$.getScript(ymapsScriptUrl, function() {
					ymaps.ready(init);
				});
			} else {
				ymaps.ready(init);
			}

			function init() {

				generateContId();

				mapOptions = o.disableZoom ? {maxZoom: o.zoom, minZoom: o.zoom} : {};
				drawMap(contId, {
					center: o.center,
					zoom: o.zoom
				}, mapOptions);

				if (o.placemarks) {
					for (i = 0; i < o.placemarks.length; i += 1) {
						addPlacemark(o.placemarks[i].place, o.placemarks[i]['options']);
					}
				}

				if (o.includeVolhonkaOverlay) {
					addVolhonkaOverlay();
				}

				places = $('.js-mapPlaces');
				if (places.length > 0 && o.placemarks) {
					generatePlaces();
				}

				if (o.placemarkAnimation && Modernizr.cssanimations) {
					setTimeout(function() {
						animatePlacemarks();
					}, 100);
				}

				if (o.route) {
					addRoot();
				}

			};

			function generateContId() {
				contId = 'id-' + Math.floor(Math.random()*99999);
				cont.attr('id', contId);
			};

			function drawMap(contId, behaviors, options) {
				map = new ymaps.Map(contId, behaviors, options);
				map.geoObjects.options.set(placemarkOptions);
			};

			function addPlacemark(place, options) {
				pm = new ymaps.Placemark(place, options);
				map.geoObjects.add(pm);
			};

			function addVolhonkaOverlay() {
				volhonkaOverlay = new ymaps.Placemark([55.866282, 38.418373], {}, {
					iconImageHref: './i/volhonka-overlay.png',
					iconImageSize: [229,178],
					cursor: 'default'
				});
				map.geoObjects.add(volhonkaOverlay);
			};

			function generatePlaces() {
				str = '';
				for (i = 0; i < o.placemarks.length; i += 1) {
					str += '<li>' + o.placemarks[i]['options'].balloonContent + '</li> '
				}
				places.append(str);
			};

			function animatePlacemarks() {
				pmj = $('.ymaps-image-with-content');
				pmj.addClass('__hidden');

				iv = setInterval(function() {

					// Которая часть контейнера сейчас видна
					check = (window.scrollY - cont.offset().top + $(window).height()) / cont.height();
					
					// Больше 75% -- анимируем
					if (check > 0.75) {

						pmj
							.removeClass('__hidden')
							.addClass('__animated');

						clearInterval(iv);
					}

				}, 500)

			};

			function addRoot() {
				ymaps
					.route(o.route, {
						mapStateAutoApply: true
					})
					.then(function (route) {
						map.geoObjects.add(route);
					}, function (error) {
						log(error);
					});
			};

		});

	};

})(jQuery);