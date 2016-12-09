
function Preview(main){
	this.main = main;
	this.init();
};

Preview.prototype.init = function(){
	var self = this;
	this.url = null;
	this.sliderVal = null;
	this.isFocus = null;
	this.main.icons.reg('show_preview',function(){  self.open(); });
	this.SizeType = ['min', 'midMin', 'mid', 'midMax', 'max'];
	this.setEvent();
}

Preview.prototype.setEvent = function(){
	var self = this;

	$('.previewTree .close').live('click',function(){
		self.close();
		return false;
	});
	$('.previewBody ul li img').live('click', function(){self.goToPage(this)});
	$('#panel.preview').live('mouseleave', function () {self.isFocus = null;});
	$('#panel.preview').live('mouseenter', function () {self.isFocus = true;});

	if (key != null && typeof (key) == 'function') {
		key('left', function (event, handler) {
			if (self.pressKey('up') == false) return false;
		});
		key('up', function (event, handler) {
			if (self.pressKey('up') == false) return false;
		});
		key('right', function (event, handler) {
			if (self.pressKey('down') == false) return false;
		});
		key('down', function (event, handler) {
			if (self.pressKey('down') == false) return false;
		});

	}
	
}
Preview.prototype.pressKey = function (key) {
	if (this.isFocus == true && $('#panel.preview:visible').length > 0 && this.main.document.djvu.isDjvu()) {
		if (key == 'up') {
			this.main.document.djvu.setPageDocument('prev');
		} else if (key == 'down') {
			this.main.document.djvu.setPageDocument('next');
		}
		return false;
	}

}
Preview.prototype.setSlider = function () {
	var self = this;
	$('.previewBody ul').scroll(function () {self.showPreviews();});
	$("#PreviewSlider").eq(0).slider({
		from: 1,
		to: 5,
		heterogeneity: false,
		step: 1,
		dimension: '',
		limits: false,
		skin: "round",
		onstatechange: function (value) {
			if (self.sliderVal != value) {
				self.sliderVal = value;
				self.changeType(value);
			}
		}
	});
	if (self.sliderVal == null) {
		$("#PreviewSlider").eq(0).slider("value", "1");
	} else {
		$("#PreviewSlider").eq(0).slider("value", self.sliderVal);
	}

	this.resizePreviewUl();
}
Preview.prototype.changeType = function(type){
	var typeImg = parseInt(type) - 1;
	if (typeImg < 0 || typeImg > 5) return;
	var imgs = $('#panel.preview .previewBody li');
	if(imgs.length > 0){
		for (var i = 0 ; i < this.SizeType.length; i++ ){
			if (i == typeImg){
				imgs.addClass(this.SizeType[i]);
			} else if (imgs.hasClass(this.SizeType[i])){
				imgs.removeClass(this.SizeType[i]);
			}
		}
		this.resizePreviewUl();
	}
}
Preview.prototype.resizePreviewUl = function(){
	var imgs = $('#panel.preview .previewBody li');
	if(imgs.length > 0){
		if (imgs.eq(0).offset().top == imgs.eq(1).offset().top){
			if(	imgs.length != $('#panel.preview .previewBody li.landscape').length){
				imgs.addClass('severalRows');
			} else {
				imgs.addClass('severalRowsLand');
			}
		} else {
			if(	imgs.length != $('#panel.preview .previewBody li.landscape').length){
				imgs.removeClass('severalRows');
			} else {
				imgs.removeClass('severalRowsLand');
			}
		}
		this.showPreviews();
	}
}

Preview.prototype.open = function(){
	var tab = this.main.tabs.getActiveTab();
	if(tab.previewNd == null)
		return;
	var url = 'preview?nd=' + tab.previewNd;
	var pClass = $('#panel').attr('class');
	var self = this;
	var prevTree = $('#tree > div:visible');
	this.main.panel.open(true);
	this.main.panel.initResize();
	self.main.panel.show();
	$('#tree > div').hide();
	if ($('#tree .previewTree').length != 0) {
		this.close();
		return;
	}
	if (prevTree.length == 1){
		this.prevClass = pClass;
		prevTree.addClass('prevTree');
	}
	self.main.panel.startRequest();
	this.request = $.ajax({
		url: url,
		type: "GET",
		dataType : "html",
		complete : function (){},
		success: function (html){
			$('#tree > div').hide();
			self.main.panel.stopRequest();
			var tmpHtml = '<div class="top"><div title="Закрыть панель" class="close notIco" ></div>'
						+'<div class="title">Предпросмотр</div></div><div class="previewBody">'+html+'</div>';
			$('#tree').append('<div class="tree  yellow previewTree">'+tmpHtml+'</div>');			
			self.main.panel.addClassName(null,'preview');
			self.main.document.djvu.setScaleDocument($('.scale select:visible option:selected').val());
			self.setSlider();
			//self.showPreviews();
			if (self.main.document.djvu.page != null){
				self.selectImage(self.main.document.djvu.page);
			} else {
				self.selectImage(1);
			}
			return;
		}
	});
	
};
Preview.prototype.showPreviews = function(){
	var sliderVal = self.sliderVal ? parseInt(this.sliderVal) : 1;
	var imgs = $('#panel.preview .previewBody ul li').not('.downloaded');
	var topUl = $('#panel.preview .previewBody ul').offset().top
	var heightUl = $('#panel.preview .previewBody ul').height() + topUl;
	for (var i = 0; i < imgs.length; i++) {
		var imgTop = imgs.eq(i).offset().top;
		var imgHeight = imgs.eq(i).height();
		if ((imgTop < heightUl + imgHeight + 4) && (imgTop + imgHeight) > topUl - imgHeight - 4) {
			var img = imgs.eq(i).children();
			if (img.attr('src') == 'javascript:;' && img.attr('url') != null){
				img.attr('src',img.attr('url'));
				imgs.eq(i).addClass('downloaded');
				img.addClass('downloaded');
			}
		}
	}
}
Preview.prototype.goToPage = function(el){
	var elem = $(el);
	var tab = this.main.tabs.getActiveTab();
	if(tab.contentType != 'djvu')
		return;
	var num = parseInt(elem.attr('num')) - 1;
	if (num < (this.main.document.djvu.numPage)){
		var imgs = $('#panel.preview .previewBody ul li');
		imgs.removeClass('selected');
		imgs.eq(num).addClass('selected');
		this.main.document.djvu.setPage(num);
		this.main.document.djvu.loadPage(num);
	}else{
		alert("error")
	} 
}
Preview.prototype.selectImage = function(num){
	var imgs = $('#panel.preview .previewBody ul li');
	if(imgs.length > 0){
		imgs.removeClass('selected');
		imgs.eq(num).addClass('selected');
		var nums = (num + 1 <= this.main.document.djvu.numPage) ? num + 1 : num;
		var topUl = $('#panel.preview .previewBody ul').offset().top
		var heightUl = $('#panel.preview .previewBody ul').height() + topUl;
		var imgTop = imgs.eq(num).offset().top;
		var imgHeight = imgs.eq(num).height();
		if (imgTop < topUl) {
			$('#panel.preview .previewBody ul').eq(0).scrollTo(imgs.eq(num), 100);
		} else if (imgTop + imgHeight > heightUl) {
			$('#panel.preview .previewBody ul').eq(0).scrollTo(imgs.eq(num), 100);
		}
		this.showPreviews();
	}
}
Preview.prototype.close = function(){
	$('#tree > div').hide();
	this.main.panel.hide();
	var prevTree = $('#tree .prevTree');

	if (prevTree.length == 1){
		$('#tree > div').hide();
		$('#panel').attr('class',this.prevClass);
		prevTree.show();
		prevTree.removeClass('prevTree');
		this.main.panel.open();
		this.main.panel.initResize();
		this.main.panel.show();
	}
};
