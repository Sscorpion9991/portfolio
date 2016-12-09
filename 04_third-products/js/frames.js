function Frames(){
	var self = this;
	this.body = $('body');
	this.division = $('#division');
	this.frameLeft = $(".frameLeft");
	this.frameRight = null;
	this.width = null;
	this.initResize();
	this.leftPApp = null;
	$('a[nd]').live('click', function(event) { 
		return self.leftPApp.document.openLink(this,event); 
	});
	$('a.w2open, a.w2close').live('click', function(event) { 
		self.w2toggle();
	});
	$('.closeWindowLeft').live('click', function(event) { 
		self.rightPApp.contextMenu.remove(lex('closeTwoWindows'));
		self.closeLeftFrame();
	});
	$('.closeWindowRight').live('click', function(event) { 
		self.leftPApp.contextMenu.remove(lex('closeTwoWindows'));
		self.closeRightFrame();
	});
	this.openFirstFrame();
	$(window).resize(function(event) {
		self.ctrlDivision();
	});
	window.classFrames = this;
	return this.frameLeft.get(0).contentWindow;	
};
Frames.prototype.openDoc = function(element, event){
	var self = this;
	var callback=function(){
		self.rightPApp.document.openLink(element, event);
	}
	if (this.frameRight==null){
		this.addRightFrame(callback);
	}else{
		callback();
	}
};
Frames.prototype.resetMenu = function(){
	var self = this;
	self.leftPApp.document.openNewFrame = function (element, event) {
        self.openDoc(element, event);
    }
	if (this.leftPApp == null) return;
	if (this.rightPApp==null){
		this.leftPApp.menu.remove('closeFrame');
		self.leftPApp.contextMenu.remove(lex('closeTwoWindows'));
    	this.leftPApp.menu.add('addRightFrame',function(){
			self.addRightFrame();
		})
		$('body').removeClass('dbf');
	}else{
		$('body').addClass('dbf');
		this.leftPApp.menu.remove('addRightFrame');
		this.leftPApp.menu.add('closeFrame',function(){
			self.rightPApp.contextMenu.remove(lex('closeTwoWindows'));
			self.closeLeftFrame();
		})

		this.rightPApp.menu.remove('addRightFrame');
		this.rightPApp.menu.add('closeFrame',function(){
			self.leftPApp.contextMenu.remove(lex('closeTwoWindows'));
			self.closeRightFrame();
		})		
		this.leftPApp.contextMenu.reg('#workspace .tabBody .text', lex('closeTwoWindows'), function () {
			self.leftPApp.contextMenu.remove(lex('closeTwoWindows'));
			self.closeRightFrame();
        });
		this.rightPApp.contextMenu.reg('#workspace .tabBody .text', lex('closeTwoWindows'), function () {
			self.rightPApp.contextMenu.remove(lex('closeTwoWindows'));
    		self.closeLeftFrame();
	    });
	}
}
Frames.prototype.closeLeftFrame = function(){
	var self = this;
	if (this.rightPApp!=null){
		this.leftPApp = this.rightPApp;
		this.rightPApp = null;
		this.frameLeft.remove();
		this.frameLeft = this.frameRight;
		this.frameRight = null;
	
		this.leftPApp.contextMenu.remove(lex('openLeftWindow'));
		this.leftPApp.contextMenu.reg('.tabBody a[nd], .tabBody ul:not(.table) .docItem, .document .referent', lex('openRightWindow'), function(e,el){
			self.openLinkInRightFrame(el,e);
		});
			
		this.frameLeft.removeClass("frameRight");
		this.frameLeft.addClass("frameLeft");

		console.log('closeLeftFrame');
		this.documentWidthCtrl(this.frameLeft.get(0).contentWindow);
		
		try {
			this.frameLeft.get(0).contentWindow.location.hash = 'frameLeft';
		}catch(e){}		
		this.ctrlDivision();
		this.resetMenu();
		this.ctrlFooter();
	}
};
Frames.prototype.closeRightFrame = function(){
	this.frameRight.remove();
	this.rightPApp = null;
	this.frameRight = null;
	this.resize();
	this.resetMenu();
	this.ctrlFooter();
	this.leftPApp.iSearch.controlBlockInfo(true);
	console.log('closeRightFrame');
	this.documentWidthCtrl(this.frameLeft.get(0).contentWindow);
};
Frames.prototype.documentWidthCtrl = function(w){
	if (w && (w.isLocal || w.isClient)){
		var jEl = w.$('.scrollBlock'); 
		var width = parseInt(jEl.css('padding-left'))+parseInt(jEl.css('padding-right'))+jEl.width(); 
		w.$('.scrollBlock').width(width-1); 
		setTimeout(function(){
			w.$('.scrollBlock').width('auto')},
		100);
	}
};


Frames.prototype.initResize = function(){
	var self = this;
	this.width = $.cookie('frameWidth');
	if (this.width==null){
		this.width = Math.round(this.body.width()/2);
	}
	this.division.css('left',this.width+"px");
	self.resize(this,this.width)

	this.division.draggable({ 
		axis: 'x' ,
		start:function() {
			self.startResize(this);
		},
		drag: function() {
			self.resize(this);
		},
		stop: function() { self.stopResize(this) }
	});
};
Frames.prototype.resize = function(){
	//console.log('resize');
//	if (this.frameRight==null) return; 
	if (this.frameRight==null){
		this.frameLeft.css('width','100%');
		this.division.hide();
		return;
	}
	this.division.show();
	var leftW = Math.round(100 * this.division.offset().left/this.body.width());
	if (leftW == 0 || leftW == 100){
		leftW = 50;
	}
	//console.log('leftW'+leftW);
	if (leftW > 90){
		leftW = 90;
	}
	if (leftW < 10){
		leftW = 10;
	}
	var rightW= 100 - leftW;
	$('.resizeFrameL').css('width',leftW+"%")
	$('.resizeFrameR').css('width',rightW+"%")
	$('.closeWindowLeft').css('right',rightW+"%")
	
}

Frames.prototype.startResize = function(){
	if (this.frameRight==null){
		return;
	}
	//console.log('START');
	$('.resizeFrameL, .resizeFrameR').show();
	this.frameLeft.hide();
	this.frameRight.hide();
}
Frames.prototype.stopResize = function(){
	if (this.frameRight==null){
		return;
	}

	this.frameLeft.css('width',$('.resizeFrameL').css('width'));
	this.frameRight.css('width',$('.resizeFrameR').css('width'));
	$.cookie('frameWidth', this.division.offset().left);
	
	$('.resizeFrameL, .resizeFrameR').hide();
	this.frameLeft.show();
	this.frameRight.show();
	this.ctrlDivision();
	//	this.division.css('left',this.frameLeft.width()+"px");
};

Frames.prototype.ctrlDivision = function(){
	if (this.frameRight==null){
		this.division.hide();
		this.frameLeft.width(this.body.width());
		this.division.css('left',this.frameLeft.width());
	}else{
		this.division.show();
		this.division.css('left',this.frameLeft.width());
	}
};

Frames.prototype.openFirstFrame = function () {
    var self = this;

    this.body.append('<iframe src="' + this.getSrc() + '" class="frameLeft frame" >	</iframe>');
    this.frameLeft = $('.frameLeft');

    this.frameLeft.load(function () {
        var callback = function (kApp) {
            self.leftPApp = kApp;
            self.leftPApp.document.openNewFrame = function (element, event) {
                self.openDoc(element, event);
            }
            self.resetMenu();
            kApp.contextMenu.reg('.tabBody a[nd], .tabBody ul:not(.table) .docItem, .document .referent', lex('openRightWindow'), function (e, el) {
             	self.openLinkInRightFrame(el, e);
            });
			try {
				self.frameLeft.get(0).contentWindow.location.hash = 'frameLeft';
			}catch(e){}			
            self.ctrlFooter();
            self.resetMenu();
        };

        if (this.contentWindow.kApp == null) {
            this.contentWindow.loadKApp = callback;
            self.ctrlFooter();
        } else {
            callback(this.contentWindow.kApp);
        }

    })
	this.ctrlFooter();

    //	this.frameLeft.attr('src',this.getSrc());
}
Frames.prototype.openLinkInRightFrame = function(el,e){
	var self = this;
	var jEl = $(el)
	var callback = function(){
		self.rightPApp.document.openLink(el,e);
	};
	var nd = null;
	var docList = $(el).parents().find('.docList');
	if (docList.length > 0 && docList.find('ul.list.table').length == 0){
		callback = function(){
			self.rightPApp.listDocument.openDoc(el, e, null, nd);
		};
	}
	if (jEl.hasClass('referent')) {
	    callback = function () {
	        self.rightPApp.document.openWinReferent(el, e);
	    };
	}
	
	if(jEl.parent().hasClass('foldersList') || jEl.parent().hasClass('forHistory')){ //значит это документ из папок пользователя
		 var state = eval('(' + jEl.attr('state') + ')');
		 if(state && state.nd){
			jEl.attr('nd',state.nd);
			nd = state.nd;
		 }
	} else if (jEl.hasClass('docItem')){
		var id = jEl.attr('id');
		id = id.replace('docItem_','');
		jEl.attr('nd',id);
	}
	if (self.rightPApp == null){
		this.addRightFrame(callback, true);
	}else{
		callback();
	}
	this.leftPApp.document.main.panel.close();;
	if(this.leftPApp.iSearch.isPanelLink(el)) {
		this.leftPApp.iSearch.controlBlockInfo(true);
	} else {
		this.leftPApp.iSearch.controlBlockInfo(false);
	}
};
Frames.prototype.getSrc = function(){
	var src = window.location.search;
	if (src!=null && src.indexOf('?')!=-1){
		src=src+'&frame=left';
	}else{
		src=src+'?frame=left';
	}
	return src;
}
Frames.prototype.addRightFrame = function(after, isOpenLinkInRightFrame, iScr){
	var self = this;
	if (this.frameRight!=null){
		this.frameRight.remove();
	}
	var iScr = (iScr != null ? iScr : this.getSrc());	
	this.body.append('<iframe src="'+ iScr +'" class="frameRight frame"></iframe>')
	this.frameRight = $('.frameRight');
	this.frameRight.load(function(){
		var callback = function(kApp){
			self.rightPApp = kApp;
			self.rightPApp;
			self.resetMenu();
			if (after!=null && typeof(after) == 'function'){
				after(this);
			};
			
			try {
				self.frameRight.get(0).contentWindow.location.hash = 'frameRight';
			}catch(e){}
			
			kApp.contextMenu.reg('.docList ul:not(.table) .docItem',lex('openLeftWindow'),function(e,el){
				self.leftPApp.listDocument.openDoc(el,e);
			});
			kApp.contextMenu.reg('a[nd], .tabBody ul:not(.table) .docItem',lex('openLeftWindow'),function(e,el){
				var jEl = $(el);
				if (jEl.hasClass('docItem')){
					var id = jEl.attr('id');
					id = id.replace('docItem_','');
					jEl.attr('nd',id);
				}
				var docList = $(el).parents().find('.docList');
				if (docList.length == 1 && docList.find('ul.list.table').length == 0){
					self.leftPApp.listDocument.openDoc(el,e);
					return;
				}
				self.leftPApp.document.openLink(el,e);
			});
			kApp.contextMenu.reg('.document .referent', lex('openLeftWindow'), function (e, el) {
			    self.leftPApp.document.openWinReferent(el, e);
			});
		};
		if (this.contentWindow.kApp == null){
			this.contentWindow.loadKApp = callback;
		}else{
			callback(this.contentWindow.kApp);
		}
	});
	this.frameRight.attr('src', iScr);
	if (isOpenLinkInRightFrame == true){
		window.parent.dontLoadStartPage = true; 
	}
	self.resize();
	this.ctrlFooter();
	self.stopResize();
	this.resetMenu();
	
};
Frames.prototype.ctrlFooter = function(){
	if ($('.frameRight').length == 1){
		$('.w2open').hide();
		$('.w2close').show();
	}else{
		$('.w2open').show();
		$('.w2close').hide();
	}
	if (this.leftPApp == null){
		$('.footerleft').hide();
	}else{
		$('.footerleft').show();
	}
}
Frames.prototype.w2toggle = function(){
	if ($('.frameRight').length == 0){
		$('.w2open').hide();
		$('.w2close').show();
		this.addRightFrame();
		this.leftPApp.document.main.panel.close();
		this.leftPApp.iSearch.controlBlockInfo(false);
	}else{
		$('.w2open').show();
		$('.w2close').hide();
		this.closeRightFrame();
		this.leftPApp.contextMenu.remove(lex('closeTwoWindows'));
	}
}


if (typeof console === 'undefined') {
	var console = {
		log:function(){
		
		}
	};
}
//console.log('- -  -  - -');
var w =null;
$(document).ready(function(){
	window.lex = function(key){
		if (window.lexMap && window.lexMap[key]) return window.lexMap[key];
		return '';
	}
	
	$.ajax({
		url: 'variables',
		dataType : "json",
		type : "get",			
		success: function (json) {
			if (json) window.lexMap = json.lexMap;
			window.w = window.f = new Frames();
		}
	});
});

