function Carousel2(tabs) {
	this.heightItem = 220;
	this.current = 0;
	this.size = 0;
	this.rightIndent = null;
	this.leftIndent = null;
	this.max = 200;
	this.events = function () {
		return true;
	};
	this.init = function (carousel) {
		this.carousel = carousel;
		this.bNext = $('.next', carousel);
		this.bPrev = $('.prev', carousel);
		this.list = $('li', carousel);
		this.body = $('.scrollList', carousel);
		this.ul = $('ul', carousel).show();
		this.leftIndent = $('.leftIndent', carousel);
		this.rightIndent = $('.rightIndent', carousel);
		this.current = 0;
		if (!!navigator.userAgent.match(/mobile/i)) {
			$('#indexPage .top .picList .scrollList').css('max-width', window.innerWidth - 381 + 'px');
			$('#indexPage .top .picList .scrollList').css('overflow-x', 'auto');
			this.ul.parent().width(this.list.length * this.heightItem + this.list.length * 50);
			this.bNext.remove();
			this.bPrev.remove();

		}
		this.ul.width(this.list.length * this.heightItem * 2);
		this.resize();
		var left = $('li.floatRight', carousel);
		if (left.length > 0) {
			var width = this.carousel.parent().width() - 40;
			var cnt = Math.floor(width / this.heightItem);
			if (!(left.is(':last') && this.size == this.list.length)) {
				var item = left.remove();
				var elementNotInserted = true;
				this.list = $('li', carousel);
				this.list.each(function (i) {
					if (cnt == i + 1) {
						$(this).before(item);
						elementNotInserted = false;
					}
				});
				if(elementNotInserted) {
					this.list.last().after(item);
				}
				this.list = $('li', carousel);
			}
		}
	};
	this.open = function (el) {
		el = $(el);
		var nd = el.attr('nd');
		var href = el.attr('href');
		if (nd) {
			kApp.document.open(nd);
			return;
		}
		if (href) {
			document.location = href;
			return;
		}
	};
	this.resize = function () {
		if (!!navigator.userAgent.match(/mobile/i)) {
			$('#indexPage .top .picList .scrollList').css('max-width', window.innerWidth - 381 + 'px');
			$('#indexPage .top .picList .scrollList').css('overflow-x', 'auto');
			this.ul.parent().width(this.list.length * this.heightItem + this.list.length * 70);
			this.bNext.remove();
			this.bPrev.remove();
		}
		var width = this.carousel.parent().width() - 40;
		var cnt = Math.floor(width / this.heightItem);
		if (cnt < 1) {
			this.carousel.hide();
			return;
		}
		this.carousel.show();
		this.carousel.css('visibility', 'visible');
		this.rightIndent.hide();
		this.leftIndent.hide();
		if (cnt == 1) {
			var w = this.list.eq(this.current).width();
			this.carousel.width(w + 40);
			this.body.css('padding', '0px');
		}
		if (cnt > 1) {
			this.carousel.width('auto');
			var indent = width - this.heightItem * cnt - (cnt - 1) * 5;
			var indent1 = Math.ceil(indent / cnt);
			var indent2 = (indent - indent1 * (cnt)) / 2 - 1;

			this.list.width(indent1 + this.heightItem);
			var left = Math.ceil(indent2);
			try {
				this.body.css('padding-left', left + 'px');
			} catch (e) {}
		}
		this.size = cnt;
		this.scroll(0, false);
	};
	this.next = function (n) {
		this.scroll(this.current + 1);
	};
	this.prev = function (n) {
		this.scroll(this.current - 1);
	};
	this.scroll = function (n, animate) {
		if (this.list.length - this.size < n) {
			n = this.list.length - this.size;
		}
		this.current = n;
		var first = this.list.eq(0);
		var indent = first.width() + utils.intVal(first.css('margin-right'));
		if (animate == false) {
			this.ul.parent().css('margin-left', indent * n * -1);
		} else {
			this.ul.parent().animate({
				'margin-left' : indent * n * -1
			}, 300);
		}
		if (n <= 0) {
			this.bPrev.css('visibility', 'hidden');
		} else {
			this.bPrev.css('visibility', 'visible');
		}
		if (this.list.length - this.size == n) {
			this.bNext.css('visibility', 'hidden');
		} else {
			this.bNext.css('visibility', 'visible');
		}
	};
}