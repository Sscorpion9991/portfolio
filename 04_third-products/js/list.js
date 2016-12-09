function  List(main){
	this.main=main;
	this.maxSelected = 500;
	this.cntSelected = null;
	this.ulSelected = null;
	this.UpDown = null;
	this.lastElement = null;
	this.dispatcher = null;
	this.defaultTitle = 'На раздел ссылаются документы...';
	this.KEYCODE_UP = 38;
	this.KEYCODE_DOWN = 40;
	this.KEYCODE_ENTER = 13;
	this.KEYCODE_PAGEUP = 33;
	this.KEYCODE_PAGEDOWN = 34;
	this.KEYCODE_HOME = 36;
	this.KEYCODE_END = 35;
	this.KEYCODE_DELETE = 46;
	this.lock = false;
 	this.params = null;
	this.title = null;
	this.header = null;
	this.listArea = null;
	this.docArea = null;
		
	this.init = function(nd){
		var self = this;
//		$('.list li.docItem').live('mouseover', function() {
//			$('ul.list:visible li.selected').removeClass('selected');
//			$(this).addClass('selected');
//		});
//		
//		$('.list li.docItem').live('mouseout', function() {
//			$('ul.list:visible li.selected').removeClass('selected');
//			$(this).removeClass('selected');
//		});		
	}	
	
	this.open = function(params,title,history,header,listId){
		var self = this;
		this.params = params;
		this.title = title;
		this.header = header;

		self.main.progress.start();
		this.main.icons.clear();
		this.main.tabs.empty();
		if (history==null){
			var link = new LinkHistory(
				title,
				'list',
				function (){
					self.open(params,title,true);
			});
			this.main.history.add(link);
		}
	//	params.type='doclist';
		var url = this.main.path.URL_DOCUMENT_LIST;	
		$.ajax({ 
			url: url,
			dataType : 'html',
			data: params,
			success: function (html) {
				self.main.tabs.empty();
				self.main.tabs.addBody(0,'list referentList',self.getHeader(header)+html);
				if ($('.tabBody > div:eq(1)').attr('class').length == 0){
					$('.tabBody > div:eq(1)').hide(); // скрывает div с телом документа (приходит в html), чтобы остался только список (на него ссылаются). может что-то поломать.
				}
				
				self.initList(listId);
		//		self.main.progress.stop();
			}
		});
	}	
	
	
	
	this.isReferentList = function(){
		return $('.tabBody:visible').hasClass('referentList');
	}

	this.rewriteHistory = function(){
		var self = this;
		var params = this.params;
		var title = this.title;
		var header = this.header;
		var listId = utils.getId($('.docList:visible').attr('id'))
		var link = new LinkHistory(
			title,
			'list',
			function (){
				self.open(params,title,true,header,listId);
		});
		this.main.history.rewrite(link);
	}

	this.initList = function(listId){
		var self = this;
		if (this.main.listDocument.isListDocuments()){
			var list = $('.docList');
			if (!list.attr('id')){
				list.attr('id','docList_'+listId)
			}
			$('.docList:visible').attr('id','')
			this.main.listDocument.init(null,function(){self.main.progress.stop();});
		}
	}

	this.getHeader = function(title){
		if (title==null){
			title=this.defaultTitle;
		}
		return '<div class="headerList" style="margin-bottom:8px;"><div class="Slip Rounded4 default"><div class="valign-center"><h1>'+title+'</h1></div><div class="crutch4ie"></div></div></div>';	
	}

	this.setCntSelected = function(cnt){
		var cType = this.main.tabs.getActiveTab().ContentType;
		//для скрытия кнопки в папке документы на контроле
		var controlDocFolder = false;
		if (cType == "docList"){
			if ($('.FoldersTree li.selected').length > 0) {
				if ($('.FoldersTree li.selected').attr("name") == 'Documents_on_control'){
					controlDocFolder = true;
				}
			}
		}
		/*************/
		if ((cnt == 0 && this.main.bookmarks.area != 'doc') || (cnt == 0 && cType == "docList") || (cType == "docList" && controlDocFolder == true) || cType == "historylist") {
		    this.main.icons.remove('folder_put');
		} else {
		    this.main.icons.add('folder_put', 'folder_put');
		}
		if (cnt>this.maxSelected){
			throw new Exception();
		}
		this.cntSelected = cnt;		
	}
	
	this.select = function(self,event,action,group,output){
		this.element=$(self);
		if (self==null){
			return;
		}
		if (group==null){
			group=true;
		}
		var self = $(self);
		var selfObj = this;
		 
		if (self.hasClass('partLoading')){
			return;
		} 
		if (self.hasClass('part')){
			var callback = function(firstItem){
				selfObj.select(firstItem,event,action,group);
			}
			this.main.listDocument.loadPart(null,self.get(0),callback)
			return;
		}
	//	dbg.msg(self.attr('class'));
		this.ulSelected = self.parent();
		try {
			var isSelect = self.hasClass('selected');
			if (event.type=='keydown' && event.shiftKey){
				isSelect=false;
			}
			if (event.ctrlKey && group ) {
				if (isSelect) {
					this.setCntSelected(this.cntSelected - 1);
					self.removeClass('selected');
					this.element = $('.selected', this.element.parent());
					if (this.element.length>0){
						this.lastElement = this.element;
					}else{
						this.lastElement = null;
					}
					this.checkDocControlIcon();
				}
				else {
					this.direction = null;	
					this.lastElement = self;
					this.setCntSelected(this.cntSelected + 1);
					self.addClass('selected')
					this.checkDocControlIcon();
				}
				return;
			}
			if (event.shiftKey && group && !isSelect){
			
				selected = $('.selected', self.parent());
				var firstItem = 0;
				var lastItem = 0;
				var attr = null;
				var dpp = null;
				var first = null;
				if (selected.length == 0) {
					first = $('li', self.parent()).eq(0);
				}else{
					first = selected.eq(0);
				}
				if (this.lastElement!=null){
					first = this.lastElement;
				}
				attr = utils.getId(self.get(0).id, 'array');
				var f = false;
				var list = new Array();
				if (attr.length<3){ // for others 
					var selfList = this;
					$('li', self.parent()).each(function(){
						if (self.get(0) == this || first.get(0) == this  ){
							if (f==true){
								list.push(this);
								return false;
							}
							if (self.get(0) != this || first.get(0) != this){
								f=true;
							}else{
								list.push(this);
							}
						}
						if (f){
							list.push(this);
						}
					});
					selfList.setCntSelected(list.length);
					$('.selected', self.parent()).removeClass('selected')
					for (var i in list){
						$(list[i]).addClass('selected');
					}
					selfList.checkDocControlIcon();
					return;
				}	// for aSearch
				dpp = this.main.listDocument.getActiveState().dpp;
				lastItem = parseInt(attr[1]) + (dpp * (attr[2]));
				attr = utils.getId(first.attr('id'), 'array');
			//	dpp = this.main.listDocument.getActiveState().dpp;
				firstItem = parseInt(attr[1]) + (dpp * (attr[2]));
				var li = null;
				this.setCntSelected(Math.abs(firstItem - lastItem) + 1);
				$('.selected', self.parent()).removeClass('selected')
				if (firstItem > lastItem) {
					this.direction = this.KEYCODE_UP;
					li = self.eq(0)
					while (li.length > 0 && li.attr('id') != first.attr('id')) {
						li.addClass('selected');
						li = li.next();
					}
					li.addClass('selected');
				}
				else {
					this.direction = this.KEYCODE_DOWN; 
					li = first.eq(0)
					li.addClass('selected');
					while (li.length > 0 && li.attr('id') != self.attr('id')) {
						li = li.next();
						li.addClass('selected');
					}
				}
					this.checkDocControlIcon();
				return;
			}
			if (self.hasClass('selected') || window.mobile){
				if (action){
					action(self.get(0),event,this.offsetTop(self.get(0)));
				}
				//	this.checkDocControlIcon();
				return;
			}
			$('.selected', self.parent()).removeClass('selected')
			this.setCntSelected(0);
			if (isSelect) {
				self.removeClass('selected');
				this.checkDocControlIcon();
			}
			else {
				this.lastElement = self;
				this.direction = null;	
				self.addClass('selected')
				this.setCntSelected(this.cntSelected + 1);
				this.checkDocControlIcon();

			}
		}catch (e){  
		 		var tooltip = this.main.tooltip.create($('body'), msg.get('noMore100',[this.maxSelected]), 1000, 'documentNotFound');
				this.main.tooltip.setCenter($('.documentNotFound'));
				setTimeout(function(){
					if (tooltip && tooltip.length){
						tooltip.remove();
					}
				},2000)
		} finally {
			if (output){
				output(this.cntSelected,this.element);
			}
		}
		
	}
	
	this.crossReg = function(crossController, output){
		var self = this;
		if (this.dispatcher!=null){
			$(document).unbind('keydown',this.dispatcher);
		}
		this.inc = 0;
		this.crossPause = false;
		this.pause = false;
		this.lock=false;
		this.dispatcher = function(event){
			if (self.lock){
				return;
			}
			if (event.keyCode<=36 && event.keyCode >= 33){
				$('li.selected').removeClass('selected');
			}
			if (event.target.nodeName == "INPUT" && !$(event.target).hasClass('quickFilter') && !$(event.target).hasClass('listFilter') && !$(event.target).hasClass('webkit_scroll_fixed')) {
				return;
			}
			self.inc++;
			if(self.pause) {return;}
			if(self.crossPause) {
				setTimeout(function(){self.pause = false}, 130);
				self.pause = true;
			}
			if (self.inc%5==0 && self.main.listDocument.isListDocuments()){
				self.main.listDocument.scroll($('.scroll:visible'), false);
			}
			crossController(event);
			if (output){
				output(self.cntSelected,self.element);	
			}
		//	return false;
		};
		$(document).bind('keydown',this.dispatcher);
	}
	
	this.visibleList = function(list){
		var corect = 0;
		var self = this;
		while (list.css('overflow')!='auto' && list.css('overflow')!='scroll' && list.css('overflow-y')!='scroll' && list.css('overflow-y')!='auto'  ){
			corect = list.get(0).offsetTop;
			list = list.parent();
			if (list.get(0).tagName=='BODY'){
				return null;
			}
		}
		if (list.length==0){
			return null;
		}
		var scrollTop = list.get(0).scrollTop+corect;
		var scrollBottom = list.get(0).scrollTop+list.height()+corect;
		var res = Array();
		$('li',list).not('.part').each(function(){
			if (this.offsetTop>=scrollTop){
				if ((this.offsetTop+$(this).height())<scrollBottom){
					res.push(this);			
				}else{
					return false
				}
			}
		})
		return res;
	}
	this.offsetTop = function(element, list){
		if (!list){
			var list = this.ulSelected;
		}
		while ( list.css('overflow-y')!='scroll' && list.css('overflow-y')!='auto'  ){
			list = list.parent();
			if (list.get(0).tagName=='BODY'){
				return null;
			}
		}
//		console.log('>> '+($(element).offset().top - list.offset().top));
			return $(element).offset().top - list.offset().top;
		//	return element.offsetTop-list.get(0).scrollTop-list.get(0).offsetTop;
	}
	this.controlVisibility = function(list,element,bottom,corect){
		
		if (corect == null) {
			corect = 0;
			while (list.css('overflow-y') != 'scroll' && list.css('overflow-y') != 'auto') {
				corect = list.get(0).offsetTop;
				list = list.parent();
				if (list.get(0).tagName == 'BODY') {
					return null;
				}
			}
		}
		if (list.length==0){
			return null;
		}
		var scrollTop = list.get(0).scrollTop+corect;
		var scrollBottom = list.get(0).scrollTop+list.height()+corect;
		if (element.offsetTop>scrollTop && (element.offsetTop+$(element).height())<scrollBottom){
			return;
		}
		if (bottom){			
			var elementHeight=$(element).height();
			elementHeight+=parseInt(/\d+/.exec($(element).css('padding-top'))[0]);
			elementHeight+=parseInt(/\d+/.exec($(element).css('padding-bottom'))[0]);
			list.scrollTo( {top: element.offsetTop-corect-list.height()+elementHeight, left:0} );
		}
		else{
			list.scrollTo( {top:(element.offsetTop-corect), left:0} );
		}
	}
	this.cross = function(event,list,action,group,classif){
		
		if (this.main.iSearch.focus){
			return;
		}
		if ((this.lock && !classif) || this.main.panel.treeProcessing){
			return;
		}
		//	this.main.tooltip.reset();
		if (event.which == this.KEYCODE_DELETE && $('ul.foldersList li').length > 0 && this.cntSelected!=null){
			this.main.bookmarks.removeSelectedItems();
			return false;
		}
		if((event.which == this.KEYCODE_PAGEUP || event.which == this.KEYCODE_PAGEDOWN) && list.length) {			
			var selel = '-';
			var scroll_px = list.parent().height();			
			if(event.which == this.KEYCODE_PAGEDOWN) selel = '+';			
			list.parent().scrollTo({top:(selel+'='+scroll_px), left:0});			
			return false;
		}
		
		if((event.which == this.KEYCODE_HOME || event.which == this.KEYCODE_END) && list.length) {
			var gogo = 0;
			if(event.which == this.KEYCODE_END) gogo = list.height();
			list.parent().scrollTo({top:gogo, left:0});
			return false;
		}

		if (event.which != this.KEYCODE_ENTER && event.which!=this.KEYCODE_UP && event.which!=this.KEYCODE_DOWN) {
			return;			
		}
		
		/* 
		* Необходимая заглушка для локальной версии и всех броузеров на движке WebKit.
		* По умолчанию блочный элемент с style="overflow: auto" можно листать на Page Up
		* и Page Down. В нашем случае это не надо. Мы листаем список с помощью дочерних
		* элементов. Поэтому получается, что срабатывает сразу 2 события. Стандартное и
		* добавленное нами. А нам надо, чтобы срабатывало только второе. Смотрим строчку
		* ниже.
		*/
		if(document.activeElement.tagName != 'INPUT' && $.browser.webkit) $('.webkit_scroll_fixed').focus();
		
		if (list.length>0){
			selected = $('li.selected',list);
			if (selected.length==0){
				list = this.visibleList(list);
				if (event.which == this.KEYCODE_DOWN) {
					this.select(list[0], event, action, group);
				}
				if (event.which == this.KEYCODE_UP) {
					this.select(list[list.length-1], event, action, group);
				}
				return;
			}else{
				if (event.which == this.KEYCODE_ENTER) {
					this.select(selected.get(0),event,action,group);
					return;
				}
//				dbg.msg({
//					'selected.length': selected.length,
//					'direction': this.direction
//				});
				if (event.shiftKey){
					if (this.direction == null){
						selected.removeClass('selected');
						this.lastElement.addClass('selected');
						selected = $('.selected',list);
					}
				}
				if (event.which==this.KEYCODE_DOWN){
					if (selected.length==1){
						this.direction = this.KEYCODE_DOWN; 
					}
					var next = null;
					if (this.direction == this.KEYCODE_UP){
						next = selected.eq(0).next()
						if (next.length==0){
							return;
						}
					}else{
						next = selected.eq(selected.length-1).next()
					}
					if (next.length==0 || next.get(0).tagName!='LI' || next.hasClass('more') ){
						return;
					}
					if (next.eq(0).attr('class')=="partLoading"){
						this.crossPause = true;
						setTimeout(function(){this.crossPause = false}, 100);
						return;
					}
					this.crossPause=false;
					if (!event.shiftKey) {
						selected.removeClass('selected');
					}
					this.select(next.get(0),event,action,group);
					this.controlVisibility(list,next.get(0),true)
					return;
				}
				if (event.which==this.KEYCODE_UP){
					if (selected.length==1){
						this.direction = this.KEYCODE_UP;
					}
					var prev = null;
					if (this.direction == this.KEYCODE_UP){
						var prev = selected.eq(0).prev()
						if (prev.length==0){
							return;
						}
					}else{
						prev = selected.eq(selected.length-1).prev()
					}
					if (prev.get(0).tagName!='LI'  ){
						return;
					}
					if (prev.eq(0).attr('class')=="partLoading"){
						this.crossPause = true;
						setTimeout(function(){this.crossPause = false}, 100);
						return;
					}
					this.crossPause=false;
					if (prev.hasClass('more')) return;
			
					if (!event.shiftKey){
						selected.removeClass('selected');
					}
					this.select(prev.get(0),event,action,group);
					this.controlVisibility(list,prev.get(0))
					return;
				}
			}
		}				
	}

//	this.changeTab = function(){
//		
//	}
	/*проверяем наличие кнопки "поставить документы на контороль"*/
	this.checkDocControlIcon = function () {
	    if (this.main.checkNoUserData() == false) {
	        if ($('ul > li.selected').filter(':visible').not('.FoldersTree li').length) {
	            var tab = this.main.tabs.getActiveTab();
	            if (this.main.bookmarks.area == 'doc' || tab.ContentType == "docList") {
	                if ((tab.listArea == 1 || tab.listArea == 21 ||tab.ContentType == "docList") && tab.ContentType != "historylist" && tab.title != "Закладки") {
	                    if ($('.FoldersTree li.selected').length > 0) {
	                        if ($('.FoldersTree li.selected').attr('name') == "Documents_on_control") {
	                            this.main.icons.disable('put_control');
	                        } else {
	                            this.main.icons.active('put_control');
	                        }
	                    } else {
	                        this.main.icons.active('put_control');
	                    }
	                } else {
	                    if ($('#ico_put_control').length > 0)
	                        this.main.icons.disable('put_control');
	                }
	            } else {
	                if (tab.controlled == true) {
	                    this.main.icons.active('put_control');
	                } else {
	                    if ($('#ico_put_control').length > 0)
	                        this.main.icons.disable('put_control');
	                }
	            }

	        }
	        else {
	            if ($('#ico_put_control').length > 0)
	                this.main.icons.disable('put_control');
	        }
	    }
	}
	this.controlPics = function(){
	    if ($('ul > li.selected').filter(':visible').not('.FoldersTree li').length) {
			this.main.icons.active('folder_put');
		} else {
			this.main.icons.disable('folder_put');
		}
		this.checkDocControlIcon();
	}
	this.init();
}
	
