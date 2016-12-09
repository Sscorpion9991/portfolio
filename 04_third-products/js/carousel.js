function Carousel(tabs){
	this.tabs = tabs;
	this.widthMax = 400;
	this.max = null;
	this.position = 0;
	this.items = null;


	this.events = function(){
		var self = this; 
		$('#nextTabs').live('click', function() { self.scroll(self.position+1) });		
		$('#prevTabs').live('click', function () { self.scroll(self.position - 1) });
		$('#tabs .selector').live('click', function () { return self.openSelector(this) });
		$('#tabs .selectorList li').live('click', function () {
			self.clickSelectorList(this);
		});
		this.tabs.main.resize.set('carousel', function() { 
			self.init(); 
		});
	}

	this.getVisibleItems = function () {
		return this.items.filter(':not(.invisible)');
	}
	this.countMax = function () {
		var items = this.getVisibleItems();
		var width = 0;
		items.each(function (i) {
			width+=$(this).width();
		});
		for (var cnt=1; cnt<=items.length; cnt++) {
			var width = 0;
			var mx = 0;
			var w = 0;
			for (var j=0; j<cnt; j++) {
				width += items.eq(j).width();
			}

			for(var j=cnt; j<items.length; j++) {
				w = items.eq(j).width();
				if (mx < w){
					mx = w;
				}
			}
			width += mx;

			if (width > this.widthMax) {
				return cnt - 1;
			}
		}
		return items.length;
	}

	this.init = function () {
		var tabs = $('#tabs');
		this.widthMax = tabs.width() - 40;
		this.items = $('#carousel li');
		$('#nextTabs').removeClass('active');
		$('#prevTabs').removeClass('active');
		if (this.items.length == 0) {
			return;
		}
		if (this.items.length==1){
			this.ctrlSelector();
			$('#tabs').hide();
			return;
		}
		this.max = this.countMax();

		//$('#carousel').animate({'width':this.getMaxWidth(this.max)},600).css('float','right');
		//$('#carousel').width(this.getMaxWidth(this.max));
		$('#carousel').css('float','right');
		this.scroll();
	};


	this.scroll = function(n){
		if (this.items.length==1){
			$('#tabs').hide();
			return;	
		}

		var self = this;
		this.tabs.main.tooltip.reset();
		if (n==null)
			n = $('#carousel li.active').get(0);

		this.max = this.countMax();
		this.items.hide();

		var tab = this.max-1;
		var visibleItems = this.getVisibleItems();
		visibleItems.each(function(i){
			if (n && n.id){
				if ((this.id == n.id) && (i >= self.max)) {
					tab = i;
					if (n < 0) 
						n = self.max-1;
				}
			}
			if (i < self.max-1)
				$(this).show();
		});
		visibleItems.eq(tab).show();

		this.ctrlSelector();
	}
	
	this.ctrlSelector = function (){
		var carousel = $('#carousel');
		var button = $('#tabs .selector');
		if ((this.max != null) && (this.max < this.getVisibleItems().length)) {
			carousel.css('margin-right','35px');
			button.show();
			button.css('margin-top', '3px').css('height', '30px');
			$('div,p', button).css('height', '30px');
		} else {
			carousel.css('margin-right','0px');	
			button.hide();
		}
	}
	this.openSelector = function (el) {
		var self = this;
		this.tabs.main.tooltip.reset();
		var html = '<ul>'
		var indent = 0;
		var marginLeft = Math.abs(utils.intVal($('#carousel > ul').css('margin-left')));
		this.getVisibleItems().each(function (i) {
			var el = $(this);
			var w = el.width();
			var className = '';
			if (el.hasClass('empty')) {
				className = ' empty';
			}
			if (!el.is(':visible')) {
				html += '<li class="' + this.id + className + '">' + $('p', el).html() + '</li>';
			}	
			indent += w;	
		});	
		html += '</ul>'
		this.tabs.main.tooltip.create($(el).parent(), html, 1500000, 'selectorList', true, null, null, function () {
			if (window.isEda && (self.tabs.main.eda.onCloseTabSelector != null))
				self.tabs.main.eda.onCloseTabSelector();
		}, function (sel) {
			if (window.isEda && (self.tabs.main.eda.onOpenTabSelector != null))
				self.tabs.main.eda.onOpenTabSelector(sel);
		});
		return false;
	}
/*
	this.getMaxWidth = function (n) {
		var items = $('#carousel li');
		var maxWidth = 0;
		var bufferWidth = 0;		

		for (var i = 0; i <= items.length - n; i++) {
			bufferWidth = 0;
			for (var j = i; j <= i + n - 1; j++) {
				bufferWidth += items.eq(j).width();
			}
			if (bufferWidth > maxWidth) {
				maxWidth = bufferWidth;
			}
		}
		return bufferWidth;
	}
*/
	this.clickSelectorList = function(el){
		var el = $(el);
		var className = el.attr('class');
		className = className.split(' ')[0];
		el = $('#'+className);
		this.scroll(el.get(0));
		return el.click() 
	
	}
	
	this.events();
}
