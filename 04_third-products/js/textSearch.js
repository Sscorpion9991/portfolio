function  TextSearch(document){	
	this.document=document;
	this.context=null;
	this.contextForPart=null;
	this.type	=null;
	this.textSearchLock = false;
	this.selectTitle={
		phrase:'Поиск по фразе',
		context:'Контекстный поиск',
		strict:'Точно'
	}
	this.currentAnnot=new Array();
	this.active = -1;
	this.phraseActive = -1;
	this.match = null;
	this.request = null;
	this.lastSearch = {type:null, context:null, tab:null, nd:null};

	this.init = function () {
	    var self = this;
	    $('.textSearch .close').live("click", function () { self.close(); });

	    this.document.main.icons.reg('find', function () { self.toggle(this); });
	    //		$('#icons #ico_find').live("click", function() { self.toggle(this); });

	    $('.textSearch .btn .clear').live('click', function () { self.clear(this); });
	    $('.annotSearchTop .close').live('click', function () { self.annotSearchClose(this); });
	    $('.textSearch .send').live('click', function () {
	        if (self.textSearchLock == false) {
	            self.find();
	            self.textSearchLock = true;
	            setTimeout(function () {
	                self.textSearchLock = false;
	            }, 300);
	        }
	    });
	    $('.panelAnnotation .close').live('click', function () { self.hidePhraseResults() });
	    $('.textSearch .cross .next').live('click', function () { self.nextMatch(this) });
	    $('.textSearch .cross .prev').live('click', function () { self.prevMatch(this) });
	    //		$('.textSearch .value input').live('keypress', function(event) {self.pressEnter(event)})
	    $(window).resize(function () {
	        self.document.main.panel.textSearchResize();
	    });
	    //		this.document.main.resize.set('textSearch',function(){
	    //			self.resize();
	    //		});
	    $('.textSearch select, .textSearch input').live('click', function () { self.changeValueType(this); });

	    key("ctrl + right", function () {
	        var elem = $('.textSearch .cross .next');
	        if (elem.length > 0) {
	            self.nextMatch(true);
	        }
	    });
	    key("ctrl + left", function () {
	        var elem = $('.textSearch .cross .prev');
	        if (elem.length > 0) {
	            self.prevMatch(true);
	        }
	    });
	};
	this.initForm = function(tabIndex){
		var self = this;
		var context = null;
		if (tabIndex!=null){
			context = $('#tabBody_'+tabIndex);	
		}else{
			context = $('.tabBody:visible');	
		}
		$('.textSearch select').change(function() { self.changeType(this);});
		$('.textSearch input',context).focus(function() { self.focus(this) });
		$('.textSearch input',context).blur(function() { self.isEmpty() });
		$('.textSearch input',context).keyup(function() { self.keyup(this) });
		$('.textSearch input, .textSearch select',context).blur(function() {
			self.timeoutIdAfterBlur = setTimeout(function(){self.isEmpty()},500);
		});
	}

	this.find = function(context,scroll,callback, notleftpanel,type){
		this.hidePhraseResults();
		$('span.match').not('#panel.tContent span.match').removeClass('match').removeClass('match_current');
	
		if (!notleftpanel){
			notleftpanel = false;
		}
		if ($('.tabBody:visible').hasClass('list')){
			if (callback) callback();
			return;
		}
		if (context){
			this.setContext(context);
		}else{
			context = $('.activeDoc .textSearch input').val();
		}
		if (context==''){
			if (callback){
				callback()
			}
			this.showEmptyToolTip();
			return;
		}
//		if(this.context==context && this.type==this.type){
//			if (callback){
//				callback()
//			}
//			return;
//		}
		this.context=context;
		if (type==null){
			type=this.getType();
		}	
		if (type=='context'){
			this.findContext(false,scroll,callback);
			this.writeLastSearch();
			return;
		}	
		if (type=='strict'){
			this.findContext(true,scroll,callback);
			this.writeLastSearch();
			return;
		}
		if (type=='phrase'){
			this.findPhrase(callback, notleftpanel,null,scroll);
			this.writeLastSearch();
			return;
		}
		if (callback){
				callback()
			}
	}
	this.findContext = function(strict,scroll,callback,context){
		var self = this;
		var params = new Array;
		
		$('.activeDoc .textSearch .prev:visible').removeClass('prev').addClass('prevDisable')
		$('.activeDoc .textSearch .next:visible').removeClass('next').addClass('nextDisable')
	
		if (context==null){
			context = this.context
		}
		params.push({
			key:'context',
			value:context==null? self.context : context
		});
		params.push({
			key:'strict',
			value:strict
		});	
		this.document.longDocument.setStrict(strict);
		/*var tab = self.document.main.tabs.getActiveTab();
	    if (tab != null && tab.isPhaseSearchEnabled === false) {
	        return;
	    }*/
		if (self.document.longDocument.isLongDocuments() || self.document.djvu.isDjvu()){
			var url = this.document.main.path.URL_CONTEXT_SEARCH;
			this.startRequest();
			this.requestCtrl();
			this.request = $.ajax({
				type: "GET",
				url: url,
				dataType: "script",
				data: {
					nd:this.document.nd,
					nh:this.nh,
					context:context,
					strict:strict
				},
				complete : function (){},
				error : function (){
					self.stopRequest();
				},
				success: function(content){
					self.stopRequest();
					if (result && result.error){
						self.showToolTip(result.error);
						return;
					}
					if ( self.document.djvu.isDjvu()){
						self.document.djvu.search(search_res, context, strict);
						self.hidePhraseResults();
						if (callback){
							callback();
						}
					} else {
						var parts = new Array();
						for (i in search_res) {
							parts.push(i);
						}
						if (parts.length==0) {
							self.showToolTip();
							if (callback){
								callback();
							}
							return
						}
						self.document.longDocument.setContext(context);
						self.document.longDocument.setSearchPart(parts);
				//		self.document.longDocument.reset();
						self.document.reload(params, function(){
							self.document.longDocument.loadNextPart( function(){
								if (callback){
									callback();
								}
								self.stopRequest();
								self.tableContents()
								self.initCross(scroll,'context');
								self.document.rewriteHistory();
							});
						});
					}
				}
			});
		}else{
			self.document.reload(params,function(){
				self.document.rewriteHistory();
				self.initCross(null,'context');
				self.stopRequest();
				if (callback){
					console.log(callback);
					callback();
				}	
				self.tableContents()
					
			});
		}
	}

	this.findPhrase = function (callback, notleftpanel, context, cross) {
	    var self = this;
	    if (cross == null) {
	        cross = true;
	    }
		$('#tree .tContentTree').remove();
	    this.type = 'phrase';

	    //		var f = false;
	    //		if () {
	    //			
	    //		}
	    //		for (var i in this.typeList ){
	    //			if (this.typeList[i] == this.type){
	    //				f = true;
	    //			}
	    //		}


	    var tab = self.document.main.tabs.getActiveTab();
	    if (tab != null && tab.isPhaseSearchEnabled === false) {
	        return;
	    }
	    $('#tree .annotSearch').remove();


	    this.phraseActive = null;
	    if (context == null) {
	        context = this.context;
	    }
	    this.currentAnnot[this.document.main.tabs.active] = null;
	    if (!notleftpanel) {
	        notleftpanel = false;
	    }
	    var url = this.document.main.path.URL_PHRASE_SEARCH;
	    this.showPhraseResults();
	    this.document.djvu.setSearchResultButtonPaginator();




	    var success = function (content) {
	        self.type = 'phrase';
	        var newContext;
	        if (!notleftpanel) {
	            newContext = self.setPhraseResults(content);
	        } else {
	            var re = new RegExp('<input type="hidden" value="([^"]+)" id="searchContext" />');
	            var match = content.match(re);
	            if (match != null) {
	                content = content.replace(re, '');
	                newContext = match[1];
	            }
	        }
	        self.actualContext = newContext;
	        if (callback) {
	            callback();
	        }
	        self.stopRequest();
	        if (!content) {
	            self.hidePhraseResults();
	            self.showToolTip();
	            return;
	        }
	        self.document.rewriteHistory();
	        if (cross) {
	            self.nextMatch();
	        } else {
	            self.initCrossForPhraseSearch();
	        }
	    }
	    var width = $('#left').width();
	    if (!this.preloadCtrl(success, context, this.document.nd, this.nh)) {
	        this.startRequest();
	        this.requestCtrl();
	        this.request = $.ajax({
	            type: 'GET',
	            url: url,
	            complete: function () { },
	            data: {
	                nd: this.document.nd,
	                nh: this.nh,
	                str: context,
	                width: width
	            },
	            error: function (er) {
	                //alert(er);
	            },
	            success: function (content) {
	                success(content);
	                self.document.textSearchTab = self.document.main.tabs.getActiveTab().hidx;
	            }
	        })
	    }
	}
	this.preloadCtrl = function(success,str,nd,nh){
		if (this.cache && this.cache.content && success && this.cache.nd==nd && this.cache.nh==nh && this.cache.str==str){
			success(this.cache.content);
			this.cache = null;
			return true;	
		}	
		return false;
	}
	this.preload = function(str,nd,tab) {
		var self = this;
		this.cache = {
					nd:nd,
					nh:tab,
					str:str
				};
		$.ajax({
				type: 'GET',
				url: this.document.main.path.URL_PHRASE_SEARCH,
				data: this.cache,
				success: function(content){
					if (self.cache.success && self.cache.nd==nd && self.cache.tab==tab && self.cache.context==context){
						self.cache.success(content);	
						self.cache = null;
					}else{
						self.cache.content=content;	
					}
				}
			})		
	}


	this.showPhraseResults = function(content){
//		var panelAnnotation = $('.activeDoc .panelAnnotation');
//		dbg.msg('!!!'+panelAnnotation.length);
//		panelAnnotation.show().addClass('loading');
//		$('.annotList',panelAnnotation).empty().append(content)			
		
		this.document.main.panel.open();
		this.document.main.panel.initResize();
		this.document.main.panel.show();
		this.document.main.panel.startRequest();

	};
	
	this.setPhraseResults = function(content){
		var self = this;
		$('.tree.annotSearch').remove();
		$('#tree > div').hide();
		self.document.main.panel.stopRequest();
		var tab = this.document.main.tabs.active;
		var id = 'annotSearchTab_'+tab;
		$('#'+id).remove();
		if (content){
			$('#tree').append('<div id="'+id+'"class="tree annotSearch"> <div class="annotSearchTop"> <div title="Закрыть панель" class="close" ></div><div class="tt"></div> </div> <div class="annotSearchBody"> </div> </div>');
			self.document.main.panel.addClassName('annotSearchTop','annotSearch');
			var panelAnnotation = $('#'+id);
			$('.annotSearchBody', panelAnnotation).append(content);
		}else{
			this.document.main.panel.hide();
		}

		var context = $('#searchContext').val();
		$('#searchContext').remove();
		this.contentPhraseParse();			
		this.document.main.resize.run('document');
//		if(!$.browser.webkit) $('.document div.text:visible').css('margin-left', '260px');
		if (this.document.djvu.isDjvu()){
			this.document.djvu.setScaleDocument($('.scale select:visible option:selected').val());
		}
		this.ctrlPhraseResults(panelAnnotation);
		return context;
	}	
	
	this.hidePhraseResults = function(){
		this.annotSearchClose($('.annotSearchTop .close'));
//		$('.activeDoc .panelAnnotation').hide();
		this.document.main.resize.run('document');
//		$('.document div.text:visible').css('margin-left', '0px');
//		if (this.document.djvu.isDjvu()){
//				this.disableCross('next');
//				this.disableCross('prev');
//			this.document.djvu.setScaleDocument($('.scale select:visible option:selected').val());
//		}
	};
	this.ctrlPhraseResults = function(panelAnnotation){
//		var panelAnnotation = $('.activeDoc .panelAnnotation');
		var header1 = $('.annotSearchTop .tt',panelAnnotation);
		var header2 = $('.annotListHeader div',panelAnnotation);
		header2.show();
		var annotList = $('.annotSearchBody',panelAnnotation);
		if (header2.length>0){
			var text1 = $('.annotListContents',panelAnnotation);
			var text2 = $('.annotListText',panelAnnotation);
			text2.show();
			if ($('.annotListText .documentAnchors', panelAnnotation).length==0){
				text1.css('height','100%');
				text1.css('max-height','none');
				header2.hide();
				text2.hide();
			}
			header1.html('Найденное в оглавлении:');
			header2.html('Найденные фразы:');
			annotList.css('overflow-y','hidden');
			var des = text1.height()+header2.height();
			text2.css('padding-top',des+'px');
			text2.css('margin-top','-'+(des)+'px');
			annotList.css('padding-top','0px');
		}else{
			header1.html('Найденные фразы:');
			annotList.css('overflow-y','auto');
			annotList.css('padding-top','5px');
		}
	};
	
	this.annotSearchClose = function(el){
		var jEl = $(el);
		var tree = jEl.parents().filter('.tree.annotSearch:visible');
		if (tree.length == 1){
//			tree.remove()
//			$('#tree > div').hide();
			this.document.main.panel.hide();
		}
	};
	
	this.contentPhraseParse = function(callback) {
		var self = this;
		
		var cur = $('.panelAnnotation p.documentAnchors:visible');		
		if(cur.length > 1) {
			this.enableCross('next');
		}
		
		if(callback) {
			callback();
		}
	};
	
	this.create = function(typeList,nh){
		var tab = this.document.main.tabs.tabs[nh];
//		dbg.msg(this.document.main.tabs[nh] ? '+:' : '-:');
		if (tab && tab.contentType && (tab.contentType=='text' || tab.contentType=='djvu' || this.document.djvu.isDjvu())){			
			typeList = []
			if (tab.isPhaseSearchEnabled)				
				typeList.push('phrase');				
			typeList.push('context');
			typeList.push('strict');		
		}
		if (typeList==null || typeList.length==0){
			this.document.main.icons.disable('find');
			return null;
		}
		this.document.main.icons.active('find');
		this.initForm(tab.hidx);
		this.nh=nh;	
		var input = $('#tabBody_'+tab.hidx+' .textSearch input');
		if (input.val()==''){
			this.context=null;	
		}
		//console.log('this.typeList = typeList');
		//console.log(typeList);
		this.typeList = typeList;
		
		for(var i in typeList){
			var attr = "";
			if (typeList[i] == this.type){
				attr = 'selected="selected"';
			}
			$('#tabBody_'+tab.hidx+' .textSearch select').append('<option '+attr+' value="'+typeList[i]+'">'+this.selectTitle[typeList[i]]+'</option>')
		}
	}
	
	this.clear = function(element){
		$('input',$(element).parent().parent()).val('');
		this.isEmpty();
	}
	this.keyup = function(element){
		this.isEmpty(true);
	}	
	
	this.focus = function(element){
		var block = $(element).parent();
		if (!block.hasClass('active')){
			block.addClass('active');
		}
	}
	
	this.setFocus = function() {
		$('.activeDoc .textSearch input').focus();
	}
	
	this.isEmpty = function(btn){
		var submit = $('.activeDoc .textSearch .send');
		var input = $('.activeDoc .textSearch input');
		if(input.val() && input.val().length!=0){
			input.parent().addClass('active');
		}else{
			if (btn != true) {
				input.parent().removeClass('active');
			}
		}
	}
	this.open = function () {
	    var self = this;
	    $('.activeDoc ').css('padding-bottom', '32px');
	    $('.activeDoc .textSearch').show();
	    $('.activeDoc .textSearch .value input').focus();
	    this.resize();
	    //		if ($.browser.safari){
	    //			$('.activeDoc div.textSearch .type select').css('border-left-width','1px');
	    //		}
	    this.document.initHelpByOid(true, 'document_search', this.document.nd);
	
	    //	this.document.main.icons.disable('find');
	}
	this.close = function(){
		var self = this;

		if ($('#panel').is('.annotSearch')){
			$('#tree > div').hide();
			self.document.main.panel.hide();
		}

		this.contextForPart=null;
		this.document.longDocument.context=null;
		this.document.djvu.setUrlParam('context',null);
		this.document.djvu.setSrc();
		$('.activeDoc .textSearch').hide();	
		$('.activeDoc ').css('padding-bottom','0px');
		//self.document.open(self.document.nd, null, null, null);
		$('span.match').removeClass('match');
		$('span.match_current').removeClass('match_current');
		self.hidePhraseResults();
	//	this.document.main.icons.active('find');
		if (this.document.djvu.isDjvu()) {
			this.document.initHelpByOid(true,'document_graf',this.document.nd);
		} else {
			this.document.initHelpByOid(true,'document',this.document.nd);
		}
		this.document.longDocument.clearRequestList();
		this.document.activeText().scroll();
	}
	this.toggle = function(element){
		this.document.main.panel.textSearchResize();
		if ($(element).hasClass('disable')){
			return;
		}
		if ($('.activeDoc .textSearch:visible').length==0){
			this.open();
		}else{
			this.close();
		}
	}
	this.getType = function(element){
		var list = $('.activeDoc .textSearch option:selected');
		if (list.length > 0){
			this.type = list.filter(':selected').val();
		}
		return this.type;		
	}
	this.setType = function(type){
		var select = $('.activeDoc .textSearch option').removeAttr('selected'); 
		this.type = type;
		select.each(function (i) {
			if ($(this).val()==type){
//				dbg.msg(type+' selected')
				$(this).attr('selected','selected');	
			}	
		});
		//this.type = type;
		return this.type;		
	}
	this.getContext = function() {
		var el = $('.activeDoc .textSearch input');
		if (el.length>0){
			return el.val();
		}
		return this.context;
	}
	this.setContext = function(context,part,nd,tab) {
		if (part!=null){
			this.contextForPart = {part:part,context:context,nd:nd,tab:tab};	
			return;
		}
		this.contextForPart = null;
		if ((context != null) && (context.length > 0)) {
			var input = $('.activeDoc .textSearch input');
			input.val(context);
			//input.parent().addClass('active');
			this.isEmpty(true);
		}
	}
	this.initCross = function(scroll,type){
		
		if (type=='phrase' || (type==null && this.getType()=='phrase')){
			this.initCrossForPhraseSearch();
			return;
		}
		if (scroll==null){
			scroll=true;			
		}
		this.setMatch();
		this.disableCross('prev');
		if (this.match.length<=1 ) {
			this.disableCross('next');
		}
		if (this.match.length==0){
			if (!this.document.djvu.isDjvu()) {
				this.showToolTip();
			}
			return;
		}
		this.active = -1;
		this.match.eq(0).addClass('match_current');
		if (scroll){
			this.nextMatch(true);
			if (this.match.length!=1) {
				this.enableCross('next');
			}
		}
	}
	
	
	this.setMatch = function(){
		this.match = $('#workspace div.activeDoc.document > div.text span.match').filter(function(){return $(this).html()!=''});
	}
	this.nextMatch = function (element) {
	    var self = this;
	    if (this.type == 'phrase') {
	        if (self.document.djvu.isDjvu()) {
	            this.phraseMatchNextPrevDJVU('next');
	        } else {
	            this.phraseMatchNextPrev('next');
	        }
	        return;
	    }
		self.setMatch();
	    if (self.match == null) return;
	    if (self.active + 1 >= self.match.length) {
	        $('.activeDoc .text').scrollTo($('span.match_current'), 200);
	        return;
	    }
	    if (self.document.longDocument.isLongDocuments()) {
	        if ((self.match.length > 1) && (self.active < 2)) {
	            self.enableCross('next')
	        }
	        if (self.document.longDocument.searchPart && self.document.longDocument.searchPart.length != 0 && self.match && self.active <= self.match.length - 2 && element != null) {
	            var isLoad = self.document.longDocument.loadNextPart(function () {
	                self.setMatch();
	                self.nextMatch();
	            });
	            if (isLoad == false) {
	                self.setMatch();
	                self.nextMatch(true);
	            }

	            return;
	        }
	    }
	    
	    var next = self.match.eq(this.active + 1);
	    self.match.eq(self.active).removeClass('match_current');
	    next.addClass('match_current');
	    self.document.longDocument.lock = true;
	    $('.activeDoc .text').scrollTo(next, 200, function () { self.document.longDocument.lock = false; });
	    setTimeout(function () {
	        self.document.longDocument.lock = false;
	    }, 1000)

	    self.active++;
		self.setMatch();
	    if (self.active + 1 >= self.match.length) {
			console.log("Disable");
	        self.disableCross('next');
	    }
	    if (self.active == 1) {
	        self.enableCross('prev');
	    }
	}
	this.prevMatch = function(){
		if(this.type == 'phrase') {
			if (this.document.djvu.isDjvu()){
				this.phraseMatchNextPrevDJVU('prev');
			}else{
				this.phraseMatchNextPrev('prev');
			}
			return;
		}
		
		var prev = this.match.eq(this.active-1);
		this.match.eq(this.active).removeClass('match_current');
		prev.addClass('match_current');
		$('.activeDoc .text').scrollTo(prev, 200);
		this.active--;
		if (this.active<=0) {
			this.disableCross('prev')
		}
		if (this.active+1==this.match.length-1) {
			this.enableCross('next')
		}
	}
	this.disableCross = function(cls){
		$('.activeDoc .textSearch .cross .'+cls+':visible').addClass(cls+'Disable').removeClass(cls);
	}
	this.enableCross = function(cls){
		$('.activeDoc .textSearch .cross .'+cls+'Disable:visible').addClass(cls).removeClass(cls+'Disable');
	}
	this.showToolTip = function(text){
		var self = this;
		var top = '<div class="top"></div><div class="body"><p><b>Ничего не найдено</b></p>';
		var bottom = '</div><div class="bottom"></div>';
		if (text == null) {
			$.ajax({
				url: self.document.main.path.MSG_TEXT_SEARCH_EMPTY,
				dataType: "html",
				type: "get",
				success: function(res){
					var html = top + res + bottom;
					self.document.main.tooltip.create($('div.activeDoc div.value.active'), html, 300000, 'textSearchEmpty', null);
				}
			});
		}else{
			var html = top + text + bottom;
			self.document.main.tooltip.create($('div.activeDoc div.value.active'), html, 300000, 'textSearchEmpty', null);
		}
	}
	this.showEmptyToolTip = function(){
		document.main.tooltip.create($('div.activeDoc .textSearch div.value'), '<p>Пожалуйста, введите слово или фразу для поиска</p>', 3000, 'emptySearchResults',null);
	}
	
	this.phraseMatchNextPrev = function(to) {
		var match = $('#tree .annotSearchBody  .matchAnchors');
		var list = $('#tree .annotSearchBody .documentAnchors');
		if (list.length==0){
			return;
		}
		if (match.length==0){
			if (to=='next'){
				match = list.eq(0);
			}else{
				return
			}
		}else{
			
				var sel = null; 
				list.each(function(i){
					if ($(this).hasClass('matchAnchors')){
						if (to == 'next') {
							sel = i+1				
						}
						else {
							sel = i-1				
						}	
						return false;
					}
				});
				if (sel>=0 && sel<list.length){
					match = list.eq(sel);
				}
			
		}
		list.removeClass('matchAnchors');
		match.addClass('matchAnchors');
		//dbg.msg(match.length);
		match.parent().scrollTo(match.get(0));
		this.document.documentAnchorsSelect(match.get(0))
		this.initCrossForPhraseSearch();
		
	}
	this.initCrossForPhraseSearch = function(scroll){
		var self = this;
		self.enableCross('next');
		self.enableCross('prev');	
		var list = $('#tree .annotSearchBody  .documentAnchors');
		var match = $('#tree .annotSearchBody  .matchAnchors');
		
		if (list.length==0){
			self.disableCross('next');
			self.disableCross('prev');	
			return;
		}
		if (match.length==0){
			self.disableCross('prev');	
			return;
		}
		
		if (list.eq(0).hasClass('matchAnchors')){
			self.disableCross('prev');
		}
		if (list.eq(list.length-1).hasClass('matchAnchors')){
			self.disableCross('next');
		}
	}
	this.phraseMatchNextPrevDJVU = function(to) {
		var self = this;
		
		$('#tree .annotSearchBody p.documentAnchors').removeClass('match');
		
		if(to == 'next') {
			if (this.phraseActive==null){
				this.phraseActive=0;
			}else{
				this.phraseActive++;
			}
			this.phraseButtonPaginator(self.phraseActive);
			
			$($('#tree .annotSearchBody p.documentAnchors')[self.phraseActive]).addClass('match');
			var list = $('#tree .annotSearchBody p.match');  
			if (list.length == 1){
				var s = list.get(0);
				$('#tree .annotSearchBody').scrollTo(s, 100);
			}
						
		}

		if(to == 'prev') {
			if (this.phraseActive==null){
				this.phraseActive=0;
			}else{
				self.phraseActive--;
			}
			
			if(self.phraseActive <= 0) self.phraseActive = 0;
			this.phraseButtonPaginator(self.phraseActive);
			
			$($('#tree .annotSearchBody p.documentAnchors')[self.phraseActive]).addClass('match');			
			var s = $('#tree .annotSearchBody p.match').get(0);
			$('#tree .annotSearchBody').scrollTo(s, 100);

		}		

		var gId = utils.getId($(s).attr('id'),'str').replace(/p/i, '');
		gId = parseInt(gId,16);
		self.document.djvu.setPage(gId);
		self.document.djvu.setPageDocument((gId + 1),this.context==null ? null : this.context);	
	}

	this.phraseButtonPaginator = function(p) {
		
		var len = $('#tree .annotSearchBody p.documentAnchors').length;
			len -= 1;
			
		if(len < 1) return;
		
		if(p < 1) {
			this.disableCross('prev');			
		} else {
			this.enableCross('prev');
		}

		if (p >= len) {
			this.disableCross('next');	
		} else {
			this.enableCross('next');	
		}
		
		this.phraseActive = p;			
	}
	
	this.pressEnter = function(event){
		switch (event.keyCode) {
			case 13:
				var context = $('.textSearch .value input').val();
				if(this.getType()=='context' && this.match){ 
					this.nextMatch(true);
				} else {
					this.find();
				}
				break;
			default:
				break;
		}
	}
	this.startRequest = function() {
		$('.textSearch .submit .send').addClass('progress');
	}
	this.stopRequest = function() {
		$('.textSearch .submit .send').removeClass('progress');
	}
	this.changeType = function(el){
		$('.textSearch .value input').focus();
	}
	this.changeValueType = function(el){
		if (el && el.tagName=='SELECT'){
			$(el).parent().parent().addClass('active');
		}
		clearTimeout(this.timeoutIdAfterBlur);
	}
	this.requestCtrl = function(){
		if (this.request!=null && this.request.abort){
			this.request.abort();
			this.request = null;
		}
	}
	this.tableContents = function(){
		var body = $('.activeDoc .contents');
		if (body.length>0){
			$('.match',body).each(function(){
				$(this).parents().filter('ul').show();
				$(this).parents().filter('li').each(function(){
					$('.open',$(this)).removeClass("open").addClass("close");
				})
			}); 
		}
	}
	this.isLastSearch = function() {
		
		if (this.lastSearch.type != this.getType()){
			return false;
		}
		if (this.lastSearch.context != this.getContext()){
			return false;
		}
		if (this.lastSearch.tab != this.nh){
			return false;
		}
		if (this.lastSearch.nd != this.document.nd){
			return false;
		}
		return true;
	}
	this.writeLastSearch = function() {
		
		this.lastSearch.type = this.getType();
		this.lastSearch.context = this.getContext();
		this.lastSearch.tab = this.nh;
		this.lastSearch.nd = this.document.nd;
	}
	this.resize = function() {
		
	}
this.init();
}

