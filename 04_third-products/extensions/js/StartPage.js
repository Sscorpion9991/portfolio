function IndexPage(){
	this.carousel = new Carousel2();
	this.lock = false;
	this.timeoutId = false;
	this.init = function(){
		var self = this;
		setTimeout(function(){
			$('#indexPage .context input').focus(self.focus);
			self.carousel.init($('#indexPage .top .picList .carousel2'));
			self.setEvent();
			self.initPagenator();
			self.crossMsg();
			self.resize();
			self.resizeImportantly();
			self.regResize();
			self.show();
		},100);
	}
	this.open = function(){
		var self = this;
		$('#indexPage .context input').val($('#context').val())
		setTimeout(function(){
			self.carousel.init($('#indexPage .top .picList .carousel2'));
			self.initPagenator();
			self.crossMsg();
			self.resize();
			self.resizeImportantly();
			self.show();
			self.ctrForm();
			kApp.notification.init($('#tabBody_0'), {
				className:"startPageNotification",
				demoMode:true
			});
		},100);
		$('#tabBody_0.activeDoc').scroll(function(){self.ctrForm()});
		$('#indexPage .context input')
			.unbind('mouseup',this.mouseup)
			.bind('mouseup',this.mouseup)
			.unbind('focus',this.focus)
			.bind('focus',this.focus)
			.unbind('blur',this.blur)
			.bind('blur',this.blur)
			.unbind('keydown',this.keydown)
			.bind('keydown',this.keydown)
			.unbind('keyup',this.keyup)
			.bind('keyup',this.keyup)
			.unbind('paste',this.keyup)
			.bind('paste',this.keyup);
	}
	this.setEvent = function(){
		var self = this;
		$('#indexPage .news .hotNews a').live('click',function(){self.openNews(this)});
		$('#indexPage .top .importantly .bNext').live('click',function(){self.crossMsg('next')});
		$('#indexPage .top .importantly .bPrev').live('click',function(){self.crossMsg('prev')});
		$('#indexPage .top .picList li').live('click',function(){self.carousel.open(this)});
		$('#indexPage .top .picList .next').live('click',function(){self.carousel.next()});
		$('#indexPage .top .picList .prev').live('click',function(){self.carousel.prev()});
		$('div.controlDocButton').live('click',function() { 
			var id = Number($('.controlDocButton').attr('id'));
			kApp.bookmarks.loadContent(id, null, true);
		});
		$('#indexPage .left div.news ul li .newDocuments').live('click', function() {
			kApp.document.loadNewDocuments();
		});
		$('#indexPage .context .iSearch').live('click',function() { 
			var context = $('#indexPage .context input');
			if (context.val().length==0 || context.val()==context.attr('default')) return;
			kApp.list.lock = false;		
			$('#context').val(context.val());
			kApp.iSearch.search(null,context.val()); 
		});
		$('#indexPage .context .aSearch').live('click',function() { 
			kApp.list.lock = false;			
			kApp.search.search(null, null, 'asearch');
		});
		$('.goToMobileVersion a').live('click', function () {
		    $.cookie("noMobile", null);
		    if (window.parent) {
		        if (window.parent.window) {
		            window.parent.window.location.reload();
		        }
		    } else {
		        window.location.reload();
		    }
		});
	}
	this.ctrForm = function(){
		var self = this;
		clearTimeout(self.timeoutId);
		if ($('#indexPage .context .iconJuris').length>0){
			$('#indexPage').addClass('juris');
		}
		if (this.lock){
			dbg.msg('lock');
			self.timeoutId = setTimeout(function(){self.ctrForm()},300);
			return;
		}
		var body = $('#tabBody_0.activeDoc');
		var input = $('#indexPage .context .input');
		this.lock = true;
		var isVisibleForm = !$('#hideForm').is(':visible');
		var callback = function(){
			self.lock=false;	
		}
		if (body.length==0 || input.length==0 || isVisibleForm.length==0){
			return;
		}
		if (body.get(0).scrollTop+body.get(0).offsetTop>input.get(0).offsetTop+280){
			if (!isVisibleForm){
				dbg.msg(context);
				var context = $('#indexPage .context input').val();
				$('#context').val(context);
				callback = function(){
					$('#context').val(context);
					self.lock=false;	
				}
				kApp.document.showForm(callback);
			}else{
				callback();
			}
		}else{
			if (isVisibleForm){
				var context = $('#context').val();
				dbg.msg(context);
				$('#indexPage .context input').val(context);
				callback = function(){
					$('#indexPage .context input').val(context);
					self.lock=false;	
				}
				kApp.document.hideForm(callback);
			}else{
				callback();	
			}
		}		
	}
	
	this.crossMsg = function(cross){
		dbg.msg('crossMsg');
		var list = $('#indexPage .importantly li');
		dbg.msg(list.length);
		var active = list.filter('.active');
		dbg.msg(active.length);
		if (active.length==0 && list.length>0){
			active = list.eq(0).addClass('active');
		}else{
			var old = active;
			if (cross=='next'){
				active = active.next();	
			}		
			if (cross=='prev'){
				active = active.prev();	
			}	
			if (active.length>0){
				old.removeClass('active');
				active.addClass('active');
			}	
		}
		var bNext = $('#indexPage .top .importantly .bNext');
		var bPrev = $('#indexPage .top .importantly .bPrev');
		bNext.removeClass('inactive');
		bPrev.removeClass('inactive');
		if (active.next().length==0){
			bNext.addClass('inactive');	
		}
		if (active.prev().length==0){
			bPrev.addClass('inactive');	
		}
		var i = 0;
		list.each(function(){
			if ($(this).hasClass('active')){
				if(utils.isLocal()) {
					PAGINATOR = i; 
				} else {
					$.cookie('paginator',i);
				}
				return false;
			}	
			i++;
		});	
	}

	this.resize = function () {
	    var self = this;
	    self.carousel.resize();
	    var body = $('#indexPage .content');
	    if (body.length == 0) {
	        //		kApp.resize.unset('indexPage');
	        return;
	    }
	    var item = $('#indexPage .product');
	    var width = body.width();
	    if (width > 550 && item.not('.odd').length != 0) {
	        item.css('float', 'left');
	        item.filter('.odd').width(Math.round((width - 62) * (3 / 5)));
	        item.not('.odd').width(Math.round((width - 62) * (2 / 5)));
	        $('#indexPage .DBs').addClass('twoColumns');
	    } else {
	        item.css('float', 'none');
	        item.width(width);
	        $('#indexPage .DBs').removeClass('twoColumns');
	    }
	    if ($('#indexPage').width() < 720) {
	        $('#indexPage .context').addClass('tight');
	    } else {
	        $('#indexPage .context').removeClass('tight');
	    }
        //изменяем высоту биллингового сообщения
	    if ($('#indexPage .billingMode').length > 0) {
	        $('#indexPage .billingMode').css('height', $('#indexPage .billingMode div.billingText').height());
	    }
	}
	this.regResize = function(){
		var self = this;
		var z = kApp.resize.set('indexPage',function() { 
			self.resize(); 
			self.resizeImportantly();			
		});
	}
	this.openNews = function(el){
		var nd = $(el).attr('nd');
		var url = kApp.path.URL_READ_NEWS+'&param1='+nd
		$.ajax({
			url: url,
			type: "GET",
			dataType: "html",
			success: function(){
				return;
			}
		});
	}

	this.focus = function (e) {
		self.isFocus = true;
		kApp.iSearch.focus = true;
     	kApp.iSearch.ctrlContext(this);
		kApp.list.lock = true;
		$('#indexPage .main').addClass('focus');
		return e;
    }
	this.blur = function (e) {
		kApp.list.lock = false;
		$('#indexPage .main').removeClass('focus');
		var el = $(e.target);			
		el.removeClass('preDef');
		self.isFocus = false;
		if (el.val()==''){
			el.val(el.attr('default'));
		}
		return e;
    }
	
	this.mouseup = function(e){
		if (!$(this).hasClass('preDef')){
			$(this).addClass('preDef')
			e.preventDefault();
    	}
	};
	this.keydown =function(event) { 
		kApp.tooltip.ctrlSuggest(event,this,function () {
			var context = $('#indexPage .context input');
			if (context.val().length==0 || context.val()==context.attr('default')) return;
			kApp.list.lock = false;			
			kApp.iSearch.search(null,context.val());
			$('#context').val(context.val());
		});
	}
	this.keyup = function(event){
		kApp.tooltip.suggest(event,this,kApp.path.URL_I2SEARCH_QUICKRESULTS, null, true, false);
	}
	this.initPagenator = function(){
		if( (utils.isLocal()) && ("undefined" != typeof(PAGINATOR)) ) {
			var page = PAGINATOR;
		} else {
			var page = $.cookie('paginator');
		}
		$('#indexPage .importantly li').removeClass('active');
		$('#indexPage .importantly li').eq(parseInt(page)).addClass('active');		
	}	
	this.show = function(){
		var self=this;
		var page = $('#indexPage');
		page.css('visibility', 'visible');
	}	
	this.resizeImportantly = function(){
		var indexPage = $('#indexPage');
		var el = $('.importantly',indexPage);
		if ($('li',el).length==0){
			el.hide();
			$('.topLink',indexPage).width(500);
			$('.topLink .kodeks',indexPage).css('float','left').width(160);
			$('.topLink .catalog',indexPage).css('float','left').width(220);
			return;
		}
			var width = indexPage.width()-615;

		if (width < 300){
			el.width(300);
		}else{
			el.width(width);
		}
	}
	
}
if(typeof iPage == 'undefined'){

	if (window.mobile){
		window.kApp.iSearch.initTabsOriginal = window.kApp.iSearch.initTabs;
		window.kApp.iSearch.initTabs = function (context, tab, history, listindex, real, checkadd, archs, filter, offset, searchHistoryIndex, tabId, prednd) {
			listindex = null;
			this.initTabsOriginal(context, tab, history, listindex, real, checkadd, archs, filter, offset, searchHistoryIndex, tabId, prednd);
		}
		window.kApp.list.selectOriginal = window.kApp.list.select;
		window.kApp.list.select = function(self,event,action,group,output){
			$(self).addClass('selected');
			this.selectOriginal(self,event,action,group,output);
		};

		setInterval(function(){
			if (kApp.listDocument && kApp.listDocument.stateList) 
			for(var i in kApp.listDocument.stateList){
				kApp.listDocument.stateList[i].currentItem = null; 
			}
		},1200);
	};

	var iPage = new IndexPage();
	iPage.init();

}else{
	setTimeout(function(){iPage.open()},150);
}



