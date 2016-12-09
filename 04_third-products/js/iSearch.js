function  ISearch(main){
	
	this.main=main;
	this.context=null;
	this.focus=true;
	this.title = 'Интеллектуальный поиск - ';
	this.newContext = null;
	this.noAttributes = null;
	this.searchHistory = new Array();
	this.blockInfo = null;
	this.lastSelectedIndex = 1;
	this.selectedElement = 0;
	this.loadedPrevPart = 0;
	this.needTop = true;
	this.currentPart = 0;
	this.timeoutId;
	this.timeout = 300;
	this.lock = false;
	this.request = null;
	this.currentDjvuPage = null;
	this.relativeOffset = null;
	this.filter = {};
	
	this.init = function(tabs){ 
		var self = this;
	

		$('.ico_prevDocISearch').live("click", function(){self.crossDoc(this,'prev')});
		$('.ico_listDocISearch').live("click", function(){self.crossDoc(this,'list')});
		$('.ico_nextDocISearch').live("click", function(){self.crossDoc(this,'next')});

		$('.showISearchInfoMsg').live('click',function() { self.controlBlockInfo(true)	});
		$('.hideISearchInfoMsg').live('click',function() { self.controlBlockInfo(false)	});
	
		$('.iSearch .showStat').live('click',function() { self.toggleStat(true, '.iSearch')	});
		$('.iSearch .hideStat').live('click',function() { self.toggleStat(false, '.iSearch')});
		$('#iSearchEmpty .showStat').live('click',function() { self.toggleStat(true, '#iSearchEmpty')});
		$('#iSearchEmpty .hideStat').live('click',function() { self.toggleStat(false, '#iSearchEmpty')});
	
		var suggest = function(event) { 
			self.main.tooltip.suggest(event,this,main.path.URL_I2SEARCH_QUICKRESULTS, null, true, false);
		}
	
		$('#context').bind('paste',suggest);
		$('#context').bind('keyup',suggest);
		$('.qFilter div').live('click',function(event) { 
			self.qFilter($(this));
		});
		
		$('#context').keydown(function(event) { 
			self.main.tooltip.ctrlSuggest(event,this,function () {
				self.clearPrednd();
				self.search();
			});
		});
		
		$('div#search_leftCorner').live('click', function(){ //при клике на левом полукруге встаем на 0-позицию инпута
			$('input#context').focus();
			self.focus = true;
			$('input#context').get(0).selectionStart = 0;
			$('input#context').get(0).selectionEnd = 0;
		});
		
	    $("#noMatter").live('click',function (e) {
			self.lockWarnnig = true;
			setTimeout(function(){self.lockWarnnig=null},300)
			self.clearPrednd();
			self.search(); 
		});

		// Код, который выделяет содержимое инпута при клике
	    $("#context").focus(function (e) {
			self.focus = true;
	     	self.ctrlContext(this);
			self.main.list.lock = true;			
			return e;
	    });
		
		$("#context").mouseup(function(e){
			if (!$(this).hasClass('preDef')){
				$(this).addClass('preDef')
				e.preventDefault();
	    	}
		});
//		$("#context").keyup(function() {
//			return true;
//		});
		$("#context").blur(function() {
	//		dbg.msg('++');
			$(this).removeClass('preDef')
			self.setMsgContext(this);
			self.main.list.lock = false;
			self.focus = false;
		});
		
		$('#iSearchBtn').live("click", function() { 
			self.clearPrednd();
			self.search(); 
		});
//		$('.iSearchList .docItem div.title').live("dblclick", function(event) {
//			self.select(this, event); 
//		});
//		
//		$('.iSearchList .docItem div.title').live('click', function(event) {
//			self.select($(this).parent().get(0),event);
//		});	
		
		$('.iSearchList .docItem div.title').live('click', function(event) {
			if (window.isEda) {
				if (event.isPropagationStopped())
					return;
			}
			if (window.isEda) {
				self.main.eda.beforeListSelect(this, event, self);
			}
			self.main.list.select(
				$(this).parent().get(0),
				event,
				function(element,event,offset){
					self.select(element, event,offset);
				},
				null,
				function(cnt,el){
					self.showCntInfo(cnt,el);				
				}
			);
		});		
		$('.iSearchPanelInner .actualQuery div.title').live('click', function(event) {
			self.select($(this).parent().get(0),event);
		});	
		
		$('.iSearchList .more:not(.prevdocs) a').live("click", function() { 
			self.loadNextPart(this); 
		});
		$('.prevdocs a').live('click', function(){ 
			self.loadPrevPart(this); 
		});

		$('a.real, a.checkadd').live('click', function(){ 
			$('input#context').val(self.realQuery);
			self.search(null, self.realQuery,true);
		});
		
		/*$('a.checkadd').live('click', function() {
			$('input#context').val(self.realQuery);
			self.search(null, self.realQuery, false, true,null,null,null,null,null,null,self.main.tabs.getActiveTab().id);
		});*/
		
		$('a.origsearch').live('click', function() {
			self.search(null, $('#searchOriginalContext').val(), true, true);
		});
		
		$('a.notArchs').live('click', function() {
			$('input#context').val(self.query);
//			self.search(null, self.query, true, false);
			self.initTabs(self.query,null,null,null,true, false, false,null,null,null,self.main.tabs.getActiveTab().id);
		});
		$('a.archs').live('click', function() {
			$('input#context').val(self.query);
//			self.search(null, self.query, true, false, true);
			self.initTabs(self.query,null,null,null,true, false, true,null,null,null,self.main.tabs.getActiveTab().id);


//	this.initTabs = function(context, tab, history, listindex, real, checkadd, archs, filter, offset, searchHistoryIndex){
//	this.search = function(history, context, real, checkadd, archs){


		});

		$('.iSearchList .linkAnnotation').live("click", function() { 
			self.openAnnotation(this); 
		});	
		var $links = $('#iSearchBtn, #indexPage .iSearch');
		$links.unbind('mouseenter mouseleave').live("mouseenter", function() {
			var elem = this;
			var $elem = $(elem);
			clearTimeout($elem.data("iSearchTooltipShow"));
			$elem.data("iSearchTooltipShow", setTimeout(function () {
				if($('#search .suggest:visible, #indexPage .input .suggest:visible').length > 0) {
					return;
				}
				self.main.tooltip.start = true;	
				self.setMouseOverEvent(elem);
			}, 100));
		}).live("mouseleave", function(e) {
			var $elem = $(this);
			clearTimeout($elem.data("iSearchTooltipShow"));
			$elem.data("iSearchTooltipShow", null);
			self.main.tooltip.start = false;
		});
		
		$('a.annotLink').live("click", function() {
			self.openLinkInAnnotation(this);
		});
		
		$('div.seeAlso').live('click', function(event){
			var nd = $('a',$(this)).attr('nd');
			self.select(nd, event, this.offsetTop, null, true);
			return false;
		});
		
		$('span.withoutQuotes a').live('click', function(){
			self.initTabs(self.newContext);
		});
		
		$('span.variant').live('click', function(e){
			var context = $(this).prev('input').val();
			$('#context').val(context);
			self.initTabs(context);
		});

		$('#iSearch .iSearchInfo .clearFilter').live('click', function(e){
			self.clearFilter();
		});
		
		self.setMsgContext();
	//	$("#context").focus();
		this.focus = false;
		
		this.main.resize.set('isearch',function() { self.controlToScroll() });
	}
	
	this.setEvent = function(){
		var self = this;
		this.main.list.crossReg(
			function(event){
				self.cross(event);
			},
			function(cnt,el){
				self.showCntInfo(cnt,el);				
			}
		)
	}	


//	this.initTabs = function(context, tab, history, listindex, real, checkadd, archs, filter, offset, searchHistoryIndex,tabId){

	this.search = function (history, context, real, checkadd, archs) {
	    var self = this;
	    
	    if (this.isLock()) {
	        return;
	    }
	    this.setTimeout();
	    this.main.document.lastDocNd = null;
		this.blockInfo = null;
	    this.currentDjvuPage = null;
	    this.loadedPrevPart = 0;
	    var input = $('input#context');
	    if (context) {
	        this.context = context;
	        input.val(this.context);
	    } else {
	        this.context = input.val();
	    }
	    var tooltip = self.main.tooltip;
	    var defval = input.attr('default');
	    if ((this.context == '') || (this.context == defval)) {
	        $.ajax({
	            url: this.main.path.MSG_CONTEXT_EMPTY,
	            dataType: "html",
	            type: "get",
	            success: function (html) {
					tooltip.create($('#iSearchBtn').parent(), html, 55000, 'contextEmpty', null, null, null, function () {
						if (window.isEda && (self.main.eda.onHideIsearchHint != null))
							self.main.eda.onHideIsearchHint();
					}, function (hint) {
						if (window.isEda && (self.main.eda.onShowIsearchHint != null))
							self.main.eda.onShowIsearchHint(hint);
					});
	            }
	        });
	        return;
	    }
	    if (this.ctrlContextStr()) return;
	    
	    this.spellWords(input,function(res){
			if (real == null && archs == null && $('#noMatter').length == 0 && res) return;
			tooltip.reset();
			self.needTop = true;
			self.lastSelectedIndex = 1;
			self.main.document.initHelpByOid(true, 'search_smart', self.main.document.nd);
			if (self.checkIqueryRequest != null) {
				self.checkIqueryRequest.abort();
				self.checkIqueryRequest = null;
			}

			var after = function(){
				self.main.progress.start();
				$('#tree .tree').remove();//удаляем построенные деревья
				self.initTabs(self.context, null, history, null, real, checkadd, archs)
				input.focus();
				self.focus = true;
			};
			
			if (!input.attr('check')){
				self.main.progress.start(self.main.history.active);
				self.checkIqueryRequest = $.ajax({
					url: 'check_iquery',
					data: { query: self.context },
					dataType: 'json',
					type: 'get',
					success: function (data) {
						if (data && data.good) {
							after()
							return;
							//self.main.document.resetInfo();
						} else {
							self.main.progress.stop();
							if (data && data.error != null) {
								alert(data.error);
							} else if (data && data.good === false) {
								alert('В запросе нет значащих слов');
							}
						}
					}
				});
			}else{
				after();
			}
		});
		

	}
	this.loadNextPart = function(element){
		var self = this;
		$('#isearchMoreSpiner').show();
		var url=this.loadNextPartGetUrl(main.tabs.tabs[main.tabs.active].urlParams);
		main.tabs.tabs[main.tabs.active].urlParams=url;
		if (main.tabs.tabs[main.tabs.active].filter){
			url+='&'+main.tabs.tabs[main.tabs.active].filter;	
		}
		
		var loc = utils.URLAttrParse(url);
		
		$.ajax({
			url: loc.location,
			dataType : "html",
			type : "get",
			data: loc.attr,
			success: function (html) {
				$('#isearchMoreSpiner').hide();
				$(element).parent().after(html);
				$(element).parent().remove();
				self.ctrlAnnotation();
				self.mobileScroll();
				self.annotationEvents();
			}
		});		
	};
	this.loadPrevPart = function(element){
		var self = this;
		$('#isearchMoreSpiner').show();
		var url=this.loadPrevPartGetUrl(main.tabs.tabs[main.tabs.active].urlParams);
		main.tabs.tabs[main.tabs.active].urlParams=url;

		if (main.tabs.tabs[main.tabs.active].filter){
			url+='&'+main.tabs.tabs[main.tabs.active].filter;	
		}
		
		var loc = utils.URLAttrParse(url);		

		$.ajax({
			url: loc.location,
			data: loc.attr,
			dataType : "html",
			type : "get",
			success: function (html) {
				$('#isearchMoreSpiner').hide();
				$(element).parent().after(html);
				if (self.loadedPrevPart > 0) {
					$('.iSearchList > li:eq(0)').before($('.more.prevdocs').clone().addClass('prevdocs'));
				};
				$('.iSearchList > li.nextdocs').each(function(){
					var el = $(this);
					if (el.next().length>0){
						el.remove();
					}
				});
				$(element).parent().remove();
				$('.iSearchList').scrollTo($('.iSearchList li.docItem:eq(20)'), 0);
				$('.iSearchList').scrollTo('-=30px', 0); //чтобы был виден кусок предыдущего элемента
				self.mobileScroll();
			},
			error: function(err){
				alert(err);
			}
		});		
	};
	this.loadPrevPartGetUrl = function(url){
		var index = 1;
		var prevPage = this.main.tabs.getActiveTab().prevPage;
		var nextPage = this.main.tabs.getActiveTab().nextPage;
		if (prevPage == null) {
			var part = /part=(\d*)/.exec(url)
			if (part==null){
				part = 0;
			}
			if (part.length == 2) {
				part = part[1];
				index = parseInt(part);
				prevPage = index;
				if (nextPage == null) {
					nextPage = index;
				}
			}
		}
		index = --prevPage;
		url = utils.setUrlParam(url, 'part', index),
		this.main.tabs.getActiveTab().prevPage = prevPage;
		this.main.tabs.getActiveTab().nextPage = nextPage;
	
		this.loadedPrevPart = index;
		url=url.replace('&onlylist=true', '');
		url+='&onlylist=true';
		return url;
	};
	this.loadNextPartGetUrl = function(url){
		var index = 1;
		var prevPage = this.main.tabs.getActiveTab().prevPage;
		var nextPage = this.main.tabs.getActiveTab().nextPage;
		if (nextPage == null) {
			var part = /part=(\d*)/.exec(url)
			if (part==null){
				part = 0;
			}else{
				part = part[1];
			}
			var index = 1;
			index = parseInt(part);
			if (prevPage == null) {
				prevPage = index;
			}
			nextPage = index;
		}
		index = ++nextPage;
		url = utils.setUrlParam(url, 'part', index),
		this.main.tabs.getActiveTab().prevPage = prevPage;
		this.main.tabs.getActiveTab().nextPage = nextPage;

		//this.loadedPrevPart = index-1;
		url=url.replace('&onlylist=true', '');
		url+='&onlylist=true';
		return url;
	};	
	this.openInNewWindow = function(nd){
		var url = '?nd='+nd;
		url+='&searchType=phrase&query='+encodeURIComponent(this.context);
		window.open(url);
	};
	this.ctrlHistoryList = function(el,offset,reqIndex){
		var self = this;
		this.selectedElement = $(el).get(0);
		this.relativeOffset = offset;
		this.currentDjvuPage = 1;
		el = this.selectedElement;
		this.lastSelectedIndex = 0;
		if (this.main.tabs.getActiveTab().prevPage){
			this.lastSelectedIndex = this.main.tabs.getActiveTab().prevPage*20;
		}
		if ($(this.selectedElement).hasClass('actualQuery') == true){
			this.lastSelectedIndex == 0;
		} else {
			this.lastSelectedIndex+=$(this.selectedElement).prevAll('li.docItem').length+1;
		}
		if (this.main.tabs.getActiveTab().cnt) {
			this.searchHistory.push({
				url: utils.setUrlParam(self.main.tabs.getActiveTab().urlParams, 'json', '1'),
				cnt: self.main.tabs.getActiveTab().cnt,
				history: this.main.history.active,
				current: this.lastSelectedIndex,
				real: this.isReal(),
				checkadd: this.isCheckadd(),
				filter: self.main.tabs.getActiveTab().filter
			});
		}
		if (el.nodeName != 'LI'){
			this.searchHistory[this.searchHistory.length-1].current = null;
			this.lastSelectedIndex = null;
		}
		this.searchHistoryIndex = reqIndex;
		el=parseInt(el.id.split('_')[1]);
		this.rewriteHistory();
		return el;
	};	
	this.isRectification = function(){
		return $('a.real').length>0;
	};	
	this.select = function(nd, event,offset, reqIndex, isRealSearch){
		var self = this;
		var el = nd;
		var tab = self.main.tabs.getActiveTab();
		var tabId = self.main.tabs.active;

//		if (offset!=null){
//			var cf = $('#tabBody_'+tabId+' .curvedFrame')
//			if (cf.length == 1){
//				offset+=cf.height();			
//			}
//		}
		
		if (nd.id) {
			nd = this.ctrlHistoryList(nd,offset, reqIndex);
			reqIndex = this.searchHistory.length - 1;
		}
//		if (this.isRectification() && el.id){
//			var context = $('span.title',$(el)).text();
//			this.search(null,context);
//			return;	
//		}
		if (isRealSearch==null){
			isRealSearch = self.isReal();
		}
		var context = self.queryForMarking;
		var searchType = 'phrase'
		if (context[context.length-1]=='"' && context[0]=='"'){
			var tmpArr = context.match(new RegExp('\"[а-яА-Я1-9A-Za-z -]+\"',"g"));
			if (tmpArr != null && tmpArr.length > 1){
				searchType = 'context';
			} else {
				searchType='strict';
			}
			context = context.replace(/"/g,'');
		}	
			
		if (tab && tab.attr){
			for (var i in tab.attr){
				if (tab.attr[i].title == 'Наименование' || tab.attr[i].title == 'По тексту' ){
					context = tab.attr[i].value;
				}
			}
		}

        this.main.document.textSearch.type = null;
		
		var stopFind = self.stopfind;
		self.main.document.textSearch.nh = null;
		var callback = function(){
			self.main.tabs.openTab(self.main.tabs.getActive(), function () {
				var after = function(){
					$('.activeDoc .textSearch input').focus();
					self.main.document.textSearch.setType(searchType);
					if (searchType=='strict'){
						self.main.document.textSearch.initCross();
					}
				}
				self.main.document.ready();
				self.main.document.textSearch.setContext(context);
				self.main.document.textSearch.setType(searchType);
				if (self.goodForMarking && !stopFind && !self.main.document.djvu.isDjvu()){
					self.main.document.textSearch.open();	
					if (searchType=='strict') {
						self.main.document.textSearch.findContext(true, null, after, context);
					} else if (searchType=='context') {
						self.main.document.textSearch.findContext(false, null, after, context);
					} else {
						self.main.document.textSearch.context = context;
						self.main.document.textSearch.findPhrase(after, null, context);
					}
				}else{
					if (context==null || context==''){
						context =  self.queryForMarking;
					}
					self.main.document.textSearch.setContext(context);
					self.main.document.textSearch.open();	
					after();
				}
			},function(){;});
		}
		if (event != null && event.shiftKey && utils.allowNewWindow(nd)) {
			this.openInNewWindow(nd);
		}
		else {
			var params = new Array();
			params.push('find='+!stopFind);
			params.push('context='+context);
			params.push('searchType='+searchType);
			var list = null;
			if (reqIndex!=null){
				list = {reqIndex:reqIndex, num:this.searchHistory[reqIndex].current};
			}
			this.main.document.open(nd, null, params, callback,list);
		}		
	};
	this.initTabs = function (context, tab, history, listindex, real, checkadd, archs, filter, offset, searchHistoryIndex, tabId, prednd) {
	    this.main.document.annotInfo = null;
	    this.archs = archs;
	    this.main.document.showForm();
	    this.filter = {};
	    if (searchHistoryIndex != null) {
	        listindex = this.searchHistory[searchHistoryIndex].current;
	    }
	    this.searchHistoryIndex = null;
	    this.main.resize.unset('document');
	    this.main.list.cntSelected = null;
	    var self = this;
	    self.main.icons.reg('print', function () { self.main.document.print(); });
	    self.main.icons.reg('save', function () { self.main.document.save(); });
	    var url = this.main.path.URL_ISEARCH_RESULTS_TABS;
	    var lid = listindex;
	    if (lid == null || lid == 0) {
	        lid = 1;
	        this.needTop = true;
	    }
	    //console.log('listindex:'+ lid);
	    if (null == self.context) {
	        self.context = context;
	    }
	    var data = {};
	    if (this.thesitem) data.thesitem = this.thesitem;
	    this.thesitem = null;
	    data.query = $.trim(context);
	    data.archs = archs;
	    //		if (real){
	    data.real = real;
	    data.prednd = $('input#prednd').val();
	    //		}
	    if (checkadd) {
	        data.checkadd = true;
	        data.prednd = $('input#prednd').val();
	    }
	    if (prednd != null) {
	        data.prednd = prednd;
	    }
	    if (!data.prednd && searchHistoryIndex != null) {
	        data.prednd = utils.getUrlParam(this.searchHistory[searchHistoryIndex].url, 'prednd')
	    }
	    this.prednd = data.prednd;

	    if (this.request != null) {
	        this.request.abort();
	        this.request = null;
	    }
	    //		dbg.msg(data);
	    if (!$('body').hasClass('progress')) this.main.progress.start(this.main.history.active);

	    if (history == null) {
	        self.main.restore.nextPage();
	    }

	    if (this.main.req!=null){
			this.main.req.abort();
		}
		
		if (typeof customizedISearchInitTabs != 'undefined')
	        customizedISearchInitTabs(this);

		this.main.req = this.request = $.ajax({
	        url: url,
	        data: data,
	        dataType: "json",
	        type: "get",
	        complete: function () { },
	        success: function (json) {
	    		self.main.req = null;
	    		self.main.tabs.empty();
	            if (json.tabs && !(json.code && (json.code == 10003 || json.code == 10004))) {
	                for (var i in json.tabs) {
	                    json.tabs[i].urlParams = self.main.path.URL_ISEARCH_LIST + '?'
							+ json.tabs[i].urlParams + '&query=' + json.query + '&part=' + (Math.ceil(lid / 20) - 1);
	                    json.tabs[i].urlParams = json.tabs[i].urlParams.replace('&onlylist=true', '');
	                    json.tabs[i].callback = function () {
	                        self.rewriteHistory();
	                    };
	                    if (tabId != null && json.tabs[i].id == tabId) {
	                        tab = i;
	                    }
	                }
	                self.goodForMarking = json.goodForMarking;
	                self.attrsOnly = json.attrsOnly;
	                self.currentPart = Math.ceil(lid / 20) - 1;
	                //		if (data.real){
	                self.loadedPrevPart = Math.ceil(lid / 20) - 1;
	                //		}
	                
	        		self.queryForMarking=self.context;
					if (json.queryForMarking){
						self.queryForMarking=json.queryForMarking;
					}
	                if (json.query) {
	                    self.query = json.query;
	                } else {
	                    self.query = self.context;
	                }
	                if (json.realQuery)
	                    self.realQuery = json.realQuery;
	                else
	                    self.realQuery = self.query;
	                if (json.stopfind) {
	                    self.stopfind = true;
	                    for (var i in json.tabs) {
	                        json.tabs[i].urlParams = utils.setUrlParam(json.tabs[i].urlParams, 'stopfind', 1);
	                    }
	                } else {
	                    self.stopfind = false;
	                }
	                if (json.hideannot) {
	                    self.hideannot = true;
	                    for (var i in json.tabs) {
	                        json.tabs[i].urlParams = utils.setUrlParam(json.tabs[i].urlParams, 'hideannot', 1);
	                    }
	                } else {
	                    self.hideannot = false;
	                }
	                if (history == null) {
	                    self.context = context;
	                    var link = new LinkHistory(
							self.title + self.context,
							'iSearch',
							function () {
							    self.initTabs(context, true, true);
							    $('input#context').val(context);
							});
	                    self.main.history.add(link);
	                }
	                self.main.panel.close();
	                self.main.icons.clear();
	                self.noAttributes = new Array();
	                var j = 0;
	                self.stats = json.stats;
	                self.noAttributes = self.query;
	                if (json.message) {
	                    self.context = context;
	                    self.main.tabs.active = 0;
	                    self.showEmptyPage(json, json.canAlsoSearch);
	                    $('input#context').val(context);
	                } else {
	                    var pics = json.pics;
	                    for (i in pics) {
	                        var className = 'document_' + pics[i].type;
	                        if ('' + pics[i].className != '')
	                            pics[i].className = className + ' ' + pics[i].className;
	                        else
	                            pics[i].className = className;
	                    }
	                    self.main.icons.addList(pics);
	                    for (i in json.tabs) {
	                        json.tabs[i].callback = function (i) {
								self.recallIPanel();
	                            self.ctrlFirstPart();
	                            self.ctrlAnnotation();
	                            self.terms(json.canAlsoSearch);
	                            self.controlBlockInfo();
	                            self.main.list.controlPics();
	                            self.rewriteHistory();
	                            self.misspelled(json.misspelled, json.query);
	                            self.ctrlEmptyTabs();
	                            self.qFilterState();
	                            self.qfCtrl(i);
	                            self.useful();
	                        }
	                    }

	                    if (filter != null) {
	                        for (var i in json.tabs) {
	                            if (filter[i] == null) {
	                                continue;
	                            }
	                            json.tabs[i].filter = filter[i].params;
	                            json.tabs[i].urlParams = utils.setUrlParam(filter[i].urlParams, 'onlylist', null);
	                            var part = self.main.utils.getUrlParam(json.tabs[tab].urlParams, 'part');
	                            if (part) {
	                                json.tabs[i].urlParams = utils.setUrlParam(json.tabs[i].urlParams, 'part', Math.ceil(lid / 20) - 1);
	                            }
	                            json.tabs[i].attr = filter[i].attr;
	                            json.tabs[i].listid = filter[i].listid;
	                            json.tabs[i].filterState = filter[i].filterState;
	                        }
	                    }
	                    if (json.tabs.length == 1 && json.tabs[0].urlParams) {

	                        //							json.tabs[0].urlParams=json.tabs[0].urlParams.replace(/tab=\d+/,'tab=-1');
	                        if (real) {
	                            json.tabs[0].urlParams += '&real=true';
	                            if (data.prednd != null)
	                                json.tabs[0].urlParams += '&prednd=' + data.prednd;
	                        }
	                        if (archs)
	                            json.tabs[0].urlParams += '&archs=true';
	                        if (checkadd) {
	                            if (data.prednd != null)
	                                json.tabs[0].urlParams += '&prednd=' + data.prednd;
	                            json.tabs[0].urlParams += '&checkadd=true';
	                        }
	                    }

	                    self.main.tabs.setTabs(json.tabs, null, 'isearch');
	                    var callback = function () {


	                        self.main.progress.stop('isearch');
	                        if (Math.ceil(lid / 20) - 1 > 0) {
	                            $('.iSearchList > li:eq(0)').before('<li class="more prevdocs"><a href="#">еще документы</a><div id="isearchMoreSpiner"></div></li>');
	                            //$('.iSearchList > li:eq(0)').before($('.more:not(.prevdocs)').clone().addClass('prevdocs'));
	                        }
							var ActualQueryContent = $('.iSearchPanelInner').children();
							if (ActualQueryContent.length == 0){
								self.controlBlockInfo(false);
							} else {
								self.controlBlockInfo();
	                        }
							if (listindex != null) {
								
	                        	var nPage = Math.ceil((listindex) / 20) - 1;
	                            self.main.tabs.getActiveTab().nextPage = (nPage >= 0)? nPage : 0;
	                        }

	                        if (!self.needTop) {

	                            //		if (data.real){
	                            //console.log('!!!!'+lid);
	                            self.currentPart != 0 ? lid += self.currentPart - 1 : lid -= 1; // корректировка выделения элемента. лучше не трогать пока работает
	                            $('.iSearchList li.docItem:eq(' + (lid % 21) + ') div.title').click();
	                            //			}else{
	                            //				lid -= 1;
	                            //				$('.iSearchList li.docItem:eq(' + lid + ')').addClass('selected');
	                            //			}
	                            if (offset) {
	                                var scrollEl = $('#iSearch .scroll');
	                                var el = $('.iSearchList li.selected');

	                               // console.log('offset1: ' + offset);
	                                offset = el.offset().top - scrollEl.offset().top - offset;
	                                //console.log('offset2: ' + offset);

	                                //										(el.get(0).offsetTop-scrollEl.get(0).offsetTop)-offset;
	                                //									offset-=40;
	                                scrollEl.scrollTo(
										{ top: '+=' + offset + 'px', left: '0px' }
									)
	                            }
	                        } else {
	                            $('.iSearchList').scrollTo(0, 0);
	                            self.needTop = false;
	                        }
	                    }
	                    if (tab == null) {
	                        for (var i = 0, j = json.tabs.length; i < j; i++) {
	                            if (json.tabs[i].state == 'active') {
	                                tab = i;
	                                break;
	                            }
	                        }
	                    }
	                    if (null != tab && tab !== true) {
	                        self.main.tabs.openTab(tab, callback);
	                    } else {
	                        self.main.tabs.openTab(0, callback);
	                    }
	                    self.main.bookmarks.area = 'iSearch';
	                    //	self.main.icons.init();
	                    self.main.filter.store = self.main.tabs.getActiveTab();
	                    self.context = context;
	                    self.setEvent();

	                }
	            } else {
	                alert(json.message);
	                self.main.progress.stop('isearch');
	            }
	        }
	    });
	};

	this.isReal = function(){
		var real = this.main.utils.getUrlParam(this.main.tabs.getActiveTab().urlParams,'real');
		if (!real && $('span.showStat').length > 0){
			real = true;
		}
		return real ? true : false;
	};
	
	this.isCheckadd = function() {
		return this.main.utils.getUrlParam(this.main.tabs.getActiveTab().urlParams,'checkadd');
	};
	
	this.rewriteHistory = function(add){
//		dbg.msg('rewriteHistory');
		var self=this;
//		this.filter = null;
		var prednd = this.prednd;
		var idTab = self.main.tabs.active;
		var offset = this.relativeOffset;
		var real = this.isReal();
		var checkadd = this.isCheckadd();
//		dbg.msg(offset);
		
		if (typeof( this.main.tabs.getActiveTab().attr)=='object'){
			var url = utils.setUrlParam(this.main.tabs.getActiveTab().urlParams,'onlylist',null);
			this.filter[idTab] = {
				params : this.main.tabs.getActiveTab().filter,
				urlParams : url,
				attr : this.main.tabs.getActiveTab().attr,
				listid : this.main.tabs.getActiveTab().listid,
				filterState : this.main.tabs.getActiveTab().filterState
			};
		}
		var filter = this.filter
		if (add){
			filter = utils.clone(this.filter);		
		}
		var context = self.context;
		var sid = this.lastSelectedIndex;
		var searchHistoryIndex = this.searchHistoryIndex
		var archs = this.archs;
		var tab = this.main.tabs.getActive();
		var link = new LinkHistory(
			context,
			'iSearch',
			function(params){
				if (params && params.sid){
					sid = params.sid;
				}
				self.initTabs(context, idTab, true, sid, real, checkadd, archs, filter, offset, searchHistoryIndex,null,prednd);
				$('input#context').val(context);
			}
		);
		if( $(".iSearchPanel","#tabBody_"+tab).length > 0 ) {
			link.storedIPanel = $(".iSearchPanel","#tabBody_"+tab).clone(true);
			link.storedIPanelState = ($("#iSearch.withPanel").length == 1);
		} else {
			//console.log($(".iSearchPanel"));
		}
//		context, tab, history, listindex, real, checkadd, archs, filter, offset, searchHistoryIndex
		self.main.restore.setISearch(context,idTab,real, checkadd, archs);
		if (add) {
			self.main.history.add(link);
		} else {
			self.main.history.rewrite(link);
		}
	};
	this.getContext = function(){
		return $('input#searchContext').val();
	};
	this.getStat = function(query){
		var res = [];
		if (this.stats && this.stats.length > 0) {
			for (var i in this.stats){
				res.push(this.stats[i].Word+'='+this.stats[i].Weight);
			}
		}else{
			var words = query.split(/\s+/);
			for (var i in words)
				res.push(words[i] + '=1');
		}
		return res.join(';');
		/*var stats = $('input#searchStats').val();
		if (stats == '') {
			var words = query.split(/\s+/);
			var res = [];
			for (var i in words)
				res.push(words[i] + '=1');
			stats = res.join(';');
		}
		return stats;*/
	};
	this.ctrlAnnotation = function(){
		if (!this.noAttributes){
			$('.docItem div.annot').hide();
			$('.docItem div.title').css('margin-right','16px');
		}
	}
	this.openAnnotation = function(element){
//		dbg.msg('OPEN');
		var self = this;

		var tooltip = $('.tooltip',$(element).parent());
		if (tooltip.length>0){
			self.closeAnnotation(element);
			return;
		}
		

		var nd=utils.getId($(element).parent().parent().attr('id'));
		var url = this.main.path.URL_ANNOTATION;
		if(nd){
			$('.iSearchList .linkAnnotation').not($(element)).each(function(){
				self.hideAnnotationBlock($(this));
			});
			$(element).addClass('loading');
			$.ajax({
				url: url,
				dataType : "html",
				data : {
					nd:nd,
					stat:this.getStat(this.noAttributes),
					query: (this.realQuery != null && this.realQuery != '') ? this.realQuery : this.query,
					width:590
				},
				type : "get",
				success: function (html) {
					if ($.trim(html)!='') {
						//$(element).addClass('remove');
						self.closeAnnotation();
						var currentAnnotation = self.main.tooltip.create($(element).parent(), html, 96000, null, true, null, $(element), function(){
							self.closeAnnotation(element);
						});
			            if (utils.isLocal() || utils.isKBrowser()) {
							currentAnnotation.css('opacity','1');
						}
					}
					
					$(element).removeClass('loading');
				}
			});
		}
	}
	this.closeAnnotation = function(element){
		if ($('#search .suggest').length>0){
			return;
		}
		if(element == null) {
			this.main.tooltip.reset();
			$('div.linkAnnotation.remove:visible').removeClass('remove');
		} else {
			this.main.tooltip.reset();	
			$(element).removeClass('remove');
		}
		return;
	}
	
	this.setMouseOutEvent = function() {
		var self = this;
		var tooltip = self.main.tooltip;
		var searchButton = $('#iSearchBtn');
		
	}
	
	this.setMouseOverEvent = function(el) {
		var self = this;
		var tooltip = self.main.tooltip;
		var searchButton = $(el);
		var timeout	= (new Date()).getTime()+300;
		$.ajax({
			url: self.main.path.MSG_CONTEXT_EMPTY,
			dataType: "html",
			type: "get",
			success: function(html){
				var des = timeout - (new Date()).getTime();
				if (timeout < 100){
					timeout = 100;
				} else {
					timeout = des;	
				}
				tooltip.createSearchTooltip(searchButton.parent(), html, 1, 'contextEmpty', false, timeout, searchButton, function () {
					if (window.isEda && (self.main.eda.onHideIsearchHint != null))
						self.main.eda.onHideIsearchHint();
				}, function (hint) {
					if (window.isEda && (self.main.eda.onShowIsearchHint != null))
						self.main.eda.onShowIsearchHint(hint);
				});
//				dbg.msg('iSearch tooltip');
			}
		});
		return;
	};
	
	this.openLinkInAnnotation = function(elem) {
		var id = utils.getId($(elem).attr('id'), 'array');
		var nd = id[0];
		var part = id[1];
		var tab = id[2];
		var self = this;

		var searchType = 'phrase';
		var context = self.queryForMarking;
		if (context[context.length-1]=='"' && context[0]=='"'){
			searchType='strict';
			context = context.replace(/"/g,'');
		}	

		
		var callback = function() {
			self.main.document.goTo(part, tab, function() {
				$('.document:visible').addClass('activeDoc');
				self.main.document.ready();
				if (self.goodForMarking){

		
					
					self.main.document.textSearch.preload(context,nd,tab);
					self.main.document.textSearch.setContext(context);
				

					
					self.main.document.textSearch.setType(searchType);
					var after = function(){
						var list = $('.activeDoc .annotList');
						var item = $('#documentAnchors_'+part);
						item.addClass('matchAnchors');
						if (item.length>0 && list.length>0){
							item.parent().scrollTo(item.get(0));
						}
					}

					if (tab) self.main.document.textSearch.nh=parseInt(tab);
					if (!self.main.document.djvu.isDjvu() && searchType == 'phrase'){
						self.main.document.textSearch.findPhrase(after,null,context,false);
						self.main.document.textSearch.open();
					} else{
						self.main.document.textSearch.open();	
						self.main.document.textSearch.setType(searchType);	
					}
				}
				var page = /[^P]+/.exec(part);
				if (page!=null){
					page=page[0];
				}
				page = parseInt(page, 16)+1;
				self.currentDjvuPage = page;
				self.main.document.djvu.setPageDocument(page);
				
			});			
		}
		if (self.goodForMarking){
			self.main.document.textSearch.setContext(context,part,nd,tab);
			self.main.document.longDocument.ctxt = context;
		}
		this.ctrlHistoryList($(elem).parents().filter('.docItem'));
		var reqIndex = this.searchHistory.length - 1;
		var params = new Array();
		params.push('isAnnotationOpen');
		var activeTab = this.main.tabs.getActiveTab();
		if (activeTab != null &&  activeTab.title == "Справки") {
		    params = null;
		}
		
		this.main.document.open(nd, null, params, callback,{reqIndex:reqIndex, num:this.searchHistory[reqIndex].current},null,null,tab);
	}
	
	this.terms = function(data) {
		function decode(str) {
			str = str.replace(/&quot;/g, '"');
			return str;
		}
		var canAlsoSearch = utils.clone(data.arr);
		var canAlsoSearchParams = utils.clone(data.params);
		var self = this;
		var tabId = this.main.tabs.active;
		if (tabId == null ){
			tabId = 0;
		}
		var elem = $('#tabBody_'+tabId+' #termsAsAttributes');
		if (canAlsoSearch == null || canAlsoSearch.length == 0) {
			elem.hide();
		} else {
			for (var i in canAlsoSearch) {
				var subst = canAlsoSearch[i];
				if (subst.query == '') {
					if (window.isEda && (this.main.eda.getISearchTip != null)) {
						var tip = this.main.eda.getISearchTip(subst, null, canAlsoSearchParams);
						if (tip != null) {
							elem.append(tip);
							continue;
						}
					}
					var wasInterpreted;
					switch (subst.canInterpret) {
						case 'дата':
							wasInterpreted = 'датой';
							break;
						case 'вид документа':
							wasInterpreted = 'видом документа';
							break;
						case 'номер':
							wasInterpreted = 'номером';
							break;
						case 'регион':
							wasInterpreted = 'регионом';
							break;
						default:
							wasInterpreted = subst.canInterpret;
					}
					elem.append('«<span class="number">'+subst.term+'</span>» '+lex('wasInterpretAs')+ ' <span class="as"><b><i>'+subst.interpretAs+'</b></i></span>. '+ lex('With')+' <b><i>'+wasInterpreted+'</i></b> «<span class="number">'+subst.newTerm+'</span>»' +
						(self.attrsOnly ? '' : ' '+lex('andThePhrase')) +
						' ' + lex('suitableMaterialsNot')+'.<br/>');
				} else {
					var id = 'term'+Math.floor( Math.random( ) * (100 - 1000 + 1) ) + 1000;
					var text = null;
					if (window.isEda && (this.main.eda.getISearchTip != null))
						text = this.main.eda.getISearchTip(subst, id, canAlsoSearchParams);
					if (text == null) {
						if (subst.term == null) {
							text = '<a id="'+id+'" href="javascript:;" class="word" search=""><b><i>'+subst.canInterpret+'</i></b></a>.<br/>';
						} else {
							text = '«<span class="number">'+subst.term+'</span>» '+lex('wasInterpretAs')+ ' <span class="as"><b><i>'+subst.interpretAs+'</b></i></span>. <a id="'+id+'" href="javascript:;" class="word" search="">'+lex('SearchAs')+' <b><i>'+subst.canInterpret+'</i></b></a>.<br/>';
						}
					}
					elem.append(text);
					subst.id = id;
					$('#termsAsAttributes a#'+id).click(function() {
						for (var j in canAlsoSearch){
							if (this.id == canAlsoSearch[j].id){
								$('input#context').val(decode(canAlsoSearch[j].query));
								self.search(null,null,true,true);
							}
						}
					});
				}
			}
			elem.show();
		}
	}

	this.misspelled = function(misspelled, query, empty) {
		if (misspelled && misspelled.length && misspelled.length>0) {    
			var html = new Array();
			for (var i in misspelled) {
				var m = misspelled[i];
				var word = m.substitute.toUpperCase();
				var str = word.substring(0, m.positions.position);
				str += '<span class="mismatch">' +
					word.substring(m.positions.position, m.positions.position + m.positions.added) +
					'</span>';
				str += word.substring(m.positions.position + m.positions.added);
				var fragment = '<input type=hidden value="' +
					query.replace(m.original, m.substitute) +
					'">' +
					'<span class="variant">' +
					str +
					'</span>';
				html.push(fragment);
			}
			html = html.join(', ')
			$('.default:visible').css('color','black');
			var missp = 'Возможно, Вы искали: &laquo;<b><i>' + html + '</i></b>&raquo;';
			if(empty) {
				$('.message span.default').html(missp);
			} else {
				var tab = this.main.tabs.getActive();
				$('#tabBody_'+tab+' .misspelled').html(missp).show();
			}
		}
	}

	this.showEmptyPage = function(json,canAlsoSearch) {
		var self = this;
		$.ajax({
			url: this.main.path.MSG_ISEARCH_EMPTY,
			dataType: "html",
			type: "get",
			success: function(html){
				$('#tabs').hide();
				$('#workspace').html(html);
				if (json.code == '10002') {
					$('table.message span.default').hide();
					//$(state).show();
					self.newContext = json.newquery;
				}
				if (canAlsoSearch && canAlsoSearch.length) {
					$('.message span.default').html('')
				}
				self.misspelled(json.misspelled, json.query, true);
				$('div.reqContext').text('«'+self.context+'»').attr('title',self.context);
				self.main.icons.clear();
				if (window.isEda) {
					self.main.eda.initIconsForISearch();
				}
				self.terms(canAlsoSearch);
				self.main.progress.stop('isearch');
				if (json.stats){
					self.showStatistics(json.stats);	
				}
				if (self.archs){
					$('.message .archs').show();
				}
			}
		});		
	};
	
	this.showStatistics = function(stats){
		var html = '';
		for(var i in stats){
			html+=stats[i].Original+':'+stats[i].Number+'; ';
		}
		html='<div class="iSearchInfoMsg">Ниже представлены наиболее важные справки и документы, относящиеся к запросу.'+	
				'<span class="showStat">статистика запроса</span>'+
			'<span class="hideStat">скрыть статистику</span>'+
			'<div class="statInfo">'+html+'</div></div>';
		$('.iSearchHeader').append(html)
	};
	
	this.controlToScroll = function(test){
		var self = this;
		var block = $('[id=iSearch]:visible');// padding-top:168px;
		if (block.length!=1){
			return;
		}

		var header = $('.iSearchHeader',block); // margin-top:-168px;
		var body = $('.tabBody:visible:visible'); 
		var pt = block.css('padding-top');
		header.css('margin-top','0px');
//		block.css('padding-top','0px');
//		block.css('margin-top','0px');
		var height=header.height();
		block.css('padding-top',(height+1)+'px');
		block.css('margin-top','-'+(height+1)+'px');
		
		setTimeout(function(){
			if (!test && header.height!=height){
				self.controlToScroll(true);
			}
		},300);
	
	};	
	
	this.filterInfo = function(action){
		var attr = this.main.tabs.getActiveTab().attr;
		var block = $('.iSearch .iSearchInfo:visible .filterInfo');
		var icoFilter = $('.iSearch .iSearchInfo:visible .doFilter');
		icoFilter.removeClass('on')
		block.empty();
		
		if (attr && attr.length){
			var k = 0;
			for (var i = 0; i < attr.length; i++) {
				if (attr[i].hide) k++;
			}
			if (k == attr.length){
				return;
			}
			icoFilter.addClass('on')
			var title;
			var html = '<div>Условия фильтра:</div><div class="clearFilter">[x] сбросить фильтр</div><table>';
			for(var i=0; i < attr.length; i++){
				if (attr[i].type=='number') {
					switch (attr[i].findType) {
						case '1':
							title = "точно ";
							break;
						case '2':
							title = "cодержит ";
							break;
						default:
							title = "начинается с  ";
							break;
					}
					html += '<tr><td class="col1">' + attr[i].title + ':</td><td class="col2">' + title + attr[i].value + '</td></tr>';
				}else{
					if(attr[i].findType == '3' ||  attr[i].findType == '4'){
						if(attr[i].findType == '3')
							title = 'период с ';
						else
							title = 'вне периода с ';
						html += '<tr><td class="col1">' + attr[i].title + ':</td><td class="col2">' + title + attr[i].value + ' по '+ attr[i+1].value +'</td></tr>';
						i++;
					} else {
						switch(attr[i].findType) {
							case '0':
								title = "точно ";
								break;
							case '1':
								title = "по ";
								break;
							case '2':
								title = "c ";
								break;
							default:
								title = "";
								break;
						}
						if (!/date_to/.test(attr[i].type)){
							html += '<tr><td class="col1">' + attr[i].title + ':</td><td class="col2">' + title + attr[i].value + '</td></tr>';
						}
					}
				}
			}
			html+= '</table>';
			block.append(html);	
			block.show();
			return;
		}
		block.hide();
		
	};
	this.controlBlockInfo = function(action){
		var self = this;
		this.filterInfo();
		var cnt = $('.iSearchInfo .count').attr('cnt');
		this.main.tabs.getActiveTab().cnt = cnt;
		//var blockInfo = $('.iSearch .iSearchInfoMsg, .iSearchPanel');
		var blockInfo = $('.iSearchPanel');
		if (action==null){
			if ( !this.twoWindows() && (this.blockInfo == null || this.blockInfo == true)){
				blockInfo.show();
				this.iSearchTransform(true);
				this.controlIPanel(true);
			} else {
				blockInfo.hide();
				this.iSearchTransform(false);
				this.controlIPanel(false);
			}
		}
		if (action==true){
			blockInfo.show();
			this.iSearchTransform(true);
			this.blockInfo=true;
			this.controlIPanel(true);
		}
		if (action==false){
			blockInfo.hide();
			$('.showISearchInfoMsg').show();
			this.iSearchTransform(false);
			this.blockInfo=false;
			this.controlIPanel(false);
		}
		if (this.blockInfo==false){
			$('.iSearch .scroll').css('border-top','1px solid #DDDDDD');	
		}else{
			$('.iSearch .scroll').css('border-top','0px');	
		}
		this.controlInfoMsg(action);
		this.controlToScroll();
		$('#iSearch .scroll').scroll(function (){
			self.closeAnnotation();
			self.hideAnnotationBlock($('.iSearchList .linkAnnotation'));
		});
	};
	this.controlIPanel = function(action) {
		if(parent != null){
			if(parent.frames != null){
				if(parent.frames.length > 1 && action) {
					$(".iSearch").addClass("withBigPanel");
					$(".iSearchPanel").addClass("bigPanel");
				} else if((parent.frames.length > 1 && !action) || action) {
					$(".iSearch").removeClass("withBigPanel");
					$(".iSearchPanel").removeClass("bigPanel");
				}
			}
		}
	}
	this.twoWindows = function() {
		if(parent != null && parent.frames != null && parent.frames.length > 1) {
			return true;
		}
		return false;
	}
	this.recallIPanel = function() {
		var tab = this.main.tabs.getActive();
		if($(".iSearchPanel","#tabBody_"+tab).length == 0) {
			if( this.main.history.list[this.main.history.active].storedIPanel != null && this.main.history.list[this.main.history.active].storedIPanel.length != 0) {
				$("#tabBody_"+tab).prepend(this.main.history.list[this.main.history.active].storedIPanel);
				if(this.main.history.list[this.main.history.active].storedIPanelState) {
					$(".iSearchPanel").show();
					this.iSearchTransform(true);
					this.blockInfo = true;
				} else {
					$(".iSearchPanel").hide();
					this.iSearchTransform(false);
					this.blockInfo = false;
				}
			} else {
				this.iSearchTransform(false);
			}
		}
	}

	this.isPanelLink = function(element) {
		if($(element).parent().hasClass("iSearchPanelPost")) {
			return true;
		}
		return false;
	}
	this.iSearchTransform = function (mod) {
		if($(".iSearchPanel").length > 0) {
			if(mod) {
				$(".iSearch").addClass("withPanel");
				$(".showISearchInfoMsg").hide();
			} else {
				$(".iSearch").removeClass("withPanel");
				$(".showISearchInfoMsg").show();
			}
		} else {
			$(".iSearch").removeClass("withPanel");
			$(".showISearchInfoMsg").hide();
		}
	}
		
	this.controlInfoMsg = function(action){
		var self = this;
		this.mobileScroll();
		var iSearchInfoMsg = $('.iSearchInfoMsg:visible');
		var term = $('[id=termsAsAttributes]:visible',iSearchInfoMsg);
		var checkAdd = $('a.real:visible',iSearchInfoMsg);
		
		var body = $('#tabBody_'+this.main.tabs.active);
		
		var openTabLink = $('.openTabById',body);
		
		var openTabLength = openTabLink.length;
		
		openTabLink.each(function(){
			var id = utils.getId(this.id);
			var jEl = $(this);
			var isset = false;
			var target = jEl.attr('tab');
			var currentTitle = self.main.tabs.getActiveTab().title;
			for(var i in self.main.tabs.tabs){
				if (id!=undefined){
					if (self.main.tabs.tabs[i].id == id && target!=currentTitle){
						isset = true;	
					}	
				}else{
					if ( target == self.main.tabs.tabs[i].title && target!=currentTitle){
						isset = true;	
					}	
				}	
			}
			if (!isset){
				var jEl = $(this);
				jEl.hide().addClass('lock');	
				var parent = jEl.parent().parent();
				parent.css("margin-bottom","0px");
/*				
				if (openTabLength == 1 && self.main.tabs.tabs.length == 1){
					parent.hide();
					$('.iSearchPanel').hide();
					$('.showISearchInfoMsg').remove();
					self.iSearchTransform(false);
					self.blockInfo=false;
				}
*/
			}

		});
		if (this.stopfind){
			$('.checkadd').remove();
			$('.real').remove();
		}
//		if (term.length==0 && checkAdd.length==0){
//			iSearchInfoMsg.css('padding-left','16px')	
//			iSearchInfoMsg.css('min-height','16px')	
//			iSearchInfoMsg.css('background-image','none')	
//		}		
	};
	
	this.toggleStat = function(action, selector){
		var statBlock = $(selector + ' .statInfo');
		var self = this;
		if (action==true){
			statBlock.show();
			$(selector + ' .showStat').hide();
			$(selector + ' .hideStat').show();
			var iSearchPanel = $('.iSearchPanel:visible');
			if (iSearchPanel.length > 0){
				statBlock.css('margin-top','-15px');
			}
			$('body').bind('click.mm',function(){self.toggleStat(false, selector)});
			$('#iSearch .statInfo').click(function(){return false;})

		}
		if (action==false){
			statBlock.css('margin-top','20px');
			statBlock.hide();
			$(selector + ' .showStat').show();
			$(selector + ' .hideStat').hide();
			$('body').unbind('click.mm');
		}
		this.controlToScroll();
	};
	
	this.ctrlContext = function(self){
		var input = $(self);
		if (input.val() == input.attr('default')) {
			input.val('');
		} else {
			input.select();
		}				
	};
	
	this.setMsgContext = function(self){
		var input
		if (self==null){
			input = $('#context');	
		}else{
			input = $(self);
		}
		if (input.val() == ''){
		input.val(input.attr('default'));
		} 
		this.focus = false;		
	};
		
	this.cross = function(event){
		var self = this;
		self.closeAnnotation();				
		this.main.list.cross(
			event,
			$('.iSearchList:visible').eq(0),
			function(element,event,offset){
				self.select(element, event,offset);
				return true;
			},
			true
		);
	};
	
	this.setIcons = function(index){
		var state = this.searchHistory[index];
		if (state.current == null) return;
		this.main.icons.add('prevDocISearch-'+index,'ico_prevDocISearch');
		this.main.icons.add('listDocISearch-'+index,'ico_listDocISearch');
		this.main.icons.add('nextDocISearch-'+index,'ico_nextDocISearch');
		if (state.current==1){
			this.main.icons.disable('prevDocISearch-'+index);
		}
		if (state.current==state.cnt){
			this.main.icons.disable('nextDocISearch-'+index);
		}
		return;
	};
	
	this.crossDoc = function(element, cross){
		//dbg.msg(cross);
		var self = this;
		var id = utils.getId(element.id,null,'-');
		var state = this.searchHistory[id];
		var num = state.current;
		if (cross == 'list') {
			this.main.history.go(state.history,{sid:num});
			return;
		}
		if (cross == 'next') {
			num++;	
		}
		if (cross == 'prev') {
			num--;	
		}
		if (state.real){
			part=Math.ceil(num/20)-1;
		}else{
			part=0;
		}
		var url = utils.setUrlParam(state.url,'part',part);
		var filter = state.filter;
		if (filter){
			url+='&'+filter;
		}
		var loc = utils.URLAttrParse(url);
		
		
		$.ajax({
			url: loc.location,
			type: 'GET',
			dataType : 'json',
			data:loc.attr,
			success: function (json){					
				var n = num-1
				if (state.real){
					n = n%20;	
				}
				if (!json.list[n]) {
					return;
				}
				state.current = num;
				self.select(json.list[n].nd,null,null,id,state.real);
			}
		});
	}
	this.showCntInfo = function(cnt,el){
		var sel = $('.iSearchInfo:visible .info')
		var total = $('.total',sel)
		var val = $('.total .value',sel)
		if (cnt){
			sel.show();
			val.html(cnt);
		}else{
			total.hide()
		}
		var current = $('.current_num',sel)
		var val = $('.current_num .value',sel)
		if (el && el.length){
			current.show();	
			val.html(el.attr('cnt'));
		}else{
			current.hide();	
		}
		
	}
	this.annotationEvents = function(){
		var self = this;
		$('.iSearchList .docItem').unbind('hover').hover(
			function () {
				var elem = $(this).find('.linkAnnotation');
				self.showAnnotationBlock(elem);
			},
			function () {
				var elem = $(this).find('.linkAnnotation');
				if(elem.parent().find('.tooltip').length == 0 && !(elem.hasClass('loading')))
					self.hideAnnotationBlock(elem);
			}
		);
	}
	this.hideAnnotationBlock = function(elem){
		if(elem.hasClass('loading')) elem.removeClass('loading');
		if(elem.hasClass('hover')) elem.removeClass('hover');
		elem.html('');
	}
	this.showAnnotationBlock = function(elem){
		elem.addClass('hover');
		elem.html('<div>' + lex('annotation') + '</div>');
	}
	this.clearFilter = function(){
		var store = this.main.tabs.getActiveTab();
		if (store && store.urlParams){
			store.urlParams = utils.setUrlParam(store.urlParams,'part',0);
			store.prevPage = null;
			store.nextPage = null;
		}

		this.main.filter.clearFields();
	}
	this.ctrlEmptyTabs = function(){
		list = $('.tabBody:visible [id=emptyTabs]');
		var tabs = this.main.tabs.tabs;
		if (list.length==1){
			list=list.val().split(';')
			for(var i in tabs){
				$('#tab_'+i).addClass('empty');
				for(var j in list){
					if (tabs[i].id==parseInt(list[j])){
						$('#tab_'+i).removeClass('empty');
					}
				}
			}
		}
	};
	this.isLock = function(){
		if (this.lock==null){
			return false;
		}
		var date = new Date();
		if (this.lock > date.getTime()){			
			return true
		}
		return false;

	};
	this.setTimeout = function(){
		var date = new Date();
		this.lock = date.getTime()+this.timeout;
	};
	this.clearPrednd = function(){
		self.prednd = null;
		$('input#prednd').remove();
	};		

	this.qFilterState = function(){
		this.main.filter.store = this.main.tabs.getActiveTab();
		var id0 = false;
		var block = $('#tabBody_'+this.main.tabs.active);
		
		for (var i in this.main.tabs.tabs){
			if (this.main.tabs.tabs[i].id == 0 || this.main.tabs.tabs[i].id == 4){
				id0 = true;
			}
		}
		if (!id0){
			$('#iSearch .qFilter',block).hide();
		}
		var date = new Date();
		if (!(this.main.filter.store && this.main.filter.store.filter)) return;
		var filter = this.main.filter.store.filter;
		var list = $('.qFilter .np, .qFilter .other, .qFilter .week, .qFilter .month',block);

		var el = $('.qFilter .month',block);
		date.setTime(date.getTime() - 91 * 24 * 60 * 60 * 1000);

		var day = date.getUTCDate()+'';
		var month = date.getUTCMonth()+1+'';
		if (day.length==1) day='0'+day;
		if (month.length==1) month='0'+month;
		date = day+'.'+month+'.'+date.getUTCFullYear();

		var str = 'find4from='+date+'&find4type=2';
		if (filter.indexOf(str) != -1){
			el.addClass('on');
		}else{
			el.removeClass('on');
		}

		el = $('.qFilter .week',block);
		date = new Date();
		date.setTime(date.getTime() - 7 * 24 * 60 * 60 * 1000);
	
		day = date.getUTCDate()+'';
		month = date.getUTCMonth()+1+'';
		if (day.length==1) day='0'+day;
		if (month.length==1) month='0'+month;
		date = day+'.'+month+'.'+date.getUTCFullYear();
	
		str = 'find4from='+date+'&find4type=2';
		if (filter.indexOf(str) != -1){
			el.addClass('on');
		}else{
			el.removeClass('on');
		}

		el = $('.qFilter .np',block);
		str = 'find7=8000003&find7lop=or';
		if (filter.indexOf(str) != -1){
			el.addClass('on');
		}else{
			el.removeClass('on');
		}

		el = $('.qFilter .other',block);
		str = 'find7=8000003&find7lop=not';
		if (filter.indexOf(str) != -1){
			el.addClass('on');
		}else{
			el.removeClass('on');
		}
	};
	
	this.qfCtrl = function(i){
		this.main.filter.store = this.main.tabs.getActiveTab();
		var self = this;
		var store = this.main.filter.store;
		var list = $('#tabBody_'+i+' .qf'); 
		//console.log(list);
		list.each(function(){
			var title = $(this).attr('title');
			for (var i in store.attr) {
				if (store.attr[i].title == title) {
					var value = store.attr[i].value;
					$('option',$(this)).each(function(){
						var el = $(this)
						if (el.val() == value ){
							el.attr('selected','selected');
						}
					});
				
				}
			}
		});
		list.change(function(event){
			var el = this;
			setTimeout(function(){self.qf(el);},100);
		});
	};
	
	this.qf = function(el){
		var self = this;
		var jEl = $(el);
		this.main.filter.store = this.main.tabs.getActiveTab();
		var store = this.main.filter.store;
		//console.log(store.filterState);

		if (!store.listid){
			store.listid=$('.iSearch:visible [name=listid]').val();
		}
		
		self.main.progress.start(); 
		self.main.filter.type = 'isearch';
		
		var listParams = /\?([^?]*)/.exec(store.urlParams);
		store.urlParams = this.main.path.URL_ISEARCH_FILTER_LIST+'?'+listParams[1];
		
		store.urlParams = utils.setUrlParam(store.urlParams,'onlylist',null);
		store.urlParams = utils.setUrlParam(store.urlParams,'part',0);

		
		var ik = utils.getId(jEl.attr('id'),'array');
		var type = ik[0];
		ik = ik[1];
		var title = jEl.attr('title')
		var option =  $('option:selected',el);
		var id;
		var value;
		if (type == 'date'){
			value = id = option.attr('value');
		}else if (type = 'classificator'){
			id = utils.getId(option.attr('id'));
			value = option.text();
		}
			
		for (var i in store.attr) {
			if (store.attr[i].title == title) {
				store.attr.splice(i,1);
			}
		}
		
		if (store.filterState && store.filterState.length){
			store.filterState.ik=null;
		}
		
		if (!(store.attr && store.attr.length)){
			store.attr = new Array();
		}

		store.filter = this.main.filter.removeParamById(store.filter,ik);

		if (type == 'date'){
			store.filter += '&find'+ik+'from='+id+'&find'+ik+'type=2';
		}else if (type = 'classificator'){
			store.filter += '&find'+ik+'='+id+'&find'+ik+'lop=or';
		}
		if (store.filterState == null){
			store.filterState = new Array(20);
		}
		
	
		var data = {
			value: value,
			hidden: id+'?or?'+value
		};
		var arr = new Array();
		
		for (var i in arr){
			
		}

		if (option.attr('value') != ''){
			store.filterState[ik] = data;
			var obj = {
				title: title,
				value: value,
				hide: true
			}

			if (type == 'date'){
				obj.type = 'date hasDatepicker';
			}else if (type = 'classificator'){
				obj.type = 'classificator classificatorsInputBlur_middle';
			}
			
			store.attr.push(obj);
		}		
		
		if (store.attr!=null && store.attr.length==0){
			listParams = /\?([^?]*)/.exec(store.urlParams);
			store.urlParams = this.main.path.URL_ISEARCH_LIST+'?'+listParams[1];
		}		
		
		var callback = function(){
			self.main.list.lock = false;
			self.main.progress.stop(); 
			self.main.document.rewriteHistoryLinkedTo(true);
			self.qfCtrl(self.main.tabs.active);
		}
		
		this.main.tabs.reload(callback);
	}

	this.qFilter = function(el){
		var self = this;
		var date = new Date();
		this.main.filter.store = this.main.tabs.getActiveTab();
		var store = this.main.filter.store;
		var callback = function(){
			self.main.list.lock = false;
			self.main.progress.stop(); 
			self.main.document.rewriteHistoryLinkedTo(true);
		}
		if (!store.listid){
			store.listid=$('.iSearch:visible [name=listid]').val();
		}
		self.main.progress.start(); 
		self.main.filter.type = 'isearch';
		
		var listParams = /\?([^?]*)/.exec(store.urlParams);
		store.urlParams = this.main.path.URL_ISEARCH_FILTER_LIST+'?'+listParams[1];
		
		store.urlParams = utils.setUrlParam(store.urlParams,'onlylist',null);
		
		
		store.urlParams = utils.setUrlParam(store.urlParams,'part',0);
		
		store.prevPage = null;
		store.nextPage = null;
		
		
		if (el.hasClass('month')) {
			date.setTime(date.getTime() - 91 * 24 * 60 * 60 * 1000);
		}
		if (el.hasClass('week')) {
			date.setTime(date.getTime() - 7 * 24 * 60 * 60 * 1000);
		}
		var day = date.getUTCDate()+'';
		var month = date.getUTCMonth()+1+'';
		if (day.length==1) day='0'+day;
		if (month.length==1) month='0'+month;
		date = day+'.'+month+'.'+date.getUTCFullYear();
		if (!(store.attr && store.attr.length)){
			store.attr = new Array();
		}
		if (el.hasClass('week') || el.hasClass('month')) {
			store.filter = this.main.filter.removeParamById(store.filter,4);
			for (var i in store.attr){
				if (store.attr[i].title == 'Дата принятия'){
					store.attr.splice(i,1);;
				}
			}
			if (!el.hasClass('on')) {
				store.filter += '&find4from=' + date + '&find4type=2';
				store.filterState = [];
				store.attr.push({
					findType: '2',
					title: 'Дата принятия',
					value: date,
					type: 'date hasDatepicker',
					hide: true
				});
			}
		}
	
		if (el.hasClass('other') || el.hasClass('np')) {
			for (var i in store.attr) {
				if (store.attr[i].title == 'Тип документа') {
					store.attr.splice(i,1);
				}
			}
			if (store.filterState && store.filterState.length){
				store.filterState.splice(7,1);;
			}
		};
		
		if (el.hasClass('other')){
			store.filter = this.main.filter.removeParamById(store.filter,7);
			if (!el.hasClass('on')) {
				store.filter += '&find7=8000003&find7lop=not';
				store.filterState = [];
				store.filterState[7] = {
					value: 'КРОМЕ Нормативный правовой акт ',
					hidden: '8000003?not?Нормативный правовой акт '
				};
				store.attr.push({
					title: 'Тип документа',
					value: 'КРОМЕ Нормативный правовой акт ',
					type: 'classificator classificatorsInputBlur_middle',
					hide: true
				});
			}
		};
		
		if (el.hasClass('np')){
			store.filter = this.main.filter.removeParamById(store.filter,7);
			if (!el.hasClass('on')) {
				store.filter += '&find7=8000003&find7lop=or';
				store.filterState = [];
				store.filterState[7] = {
					value: 'Нормативный правовой акт ',
					hidden: '8000003?or?Нормативный правовой акт '
				};
				store.attr.push({
					title: 'Тип документа',
					value: 'Нормативный правовой акт ',
					type: 'classificator classificatorsInputBlur_middle',
					hide: true
				});
			}
			
		};
		if (store.attr!=null && store.attr.length==0){
			listParams = /\?([^?]*)/.exec(store.urlParams);
			store.urlParams = this.main.path.URL_ISEARCH_LIST+'?'+listParams[1];
		}
		this.main.tabs.reload(callback);	
	};
	
	this.ctrlFirstPart = function(){
		var tab = this.main.tabs.getActiveTab();
		var part = utils.getUrlParam(tab.urlParams,'part');
		tab.prevPage=part;
	};

	this.mobileScroll = function(){
		if (!window.mobile) return;
		if (this.iScroll && this.iScroll.destroy){
			this.iScroll.destroy();
		}
		this.iScroll = new iScroll($('.tabBody:visible .iSearchList').get(0));
	}		
	
	this.spellWords = function(input,callback){
		var f = false;
		var self = this;
		if (this.lockWarnnig == true){
			if(callback)
				return callback(f);			
		} 
		var el = $('#iSearchBtn');
		if ($('#hideForm:visible').length){
			el = $('.context .iSearch')
		}
	
	
		if (!input.attr('check')){
			$.ajax({
				url: this.main.path.MSG_ISEARCH_SPELLWORDS,
				dataType: "html",
				type: "get",
				data: {
					str: this.context
				},
				success: function(html){
					if (html.indexOf('empty') == -1){
						f = true;
						callback(true)
						self.showWarning(el.parent(), html);
						setTimeout(function(){
							$('.tooltip ').mouseout();
						},600)
					}else{
						callback(false)
					}
				}
			});
		}else{
			callback(false);
		}
	};
	this.useful = function(){
		var body = $('#tabBody_'+this.main.tabs.active);
		var useful = $('.useful',body);
		var list = $('.importantLink .openTabById',body);
		if (!this.noAttributes || this.stopFind){
			list.addClass('lock');
		}
		
		list.filter('.lock').each(function(){
			$(this).parent().hide();
		})
		list = list.not('.lock');
		var marginRight = 0;
		var rInfo = $('#iSearch .rInfo',body);
		var lInfo = $('#iSearch .lInfo',body);
		if (useful.length==1 && list.length > 0){
			useful.show();
			marginRight+=useful.width();
			marginRight+=utils.intVal(useful.css('padding-left'));
			marginRight+=utils.intVal(useful.css('padding-right'));
		}else{
			useful.hide();
		}
		
		if (lInfo.length==1){
			if (rInfo.length==1){
				marginRight+=rInfo.width();
				marginRight+=utils.intVal(rInfo.css('padding-left'));
				marginRight+=utils.intVal(rInfo.css('padding-right'));
			}
			lInfo.css('margin-right',marginRight+'px')
		}else{
			rInfo.css('float','none')
			rInfo.css('margin-right',marginRight+'px')
		}
		var idTab = this.main.tabs.getActiveTab().id;
		if (lInfo.length==0 && rInfo.length==0){
			if (useful.length==0 || !useful.is(':visible')  ){
				$('.curvedFrame',body).remove();
			}
		}
	}
	
	this.ctrlContextStr = function(){
		var f = false;
		var self = this;
		if (this.lockWarnnig == true) return f;
		if (this.context){
			var re = /\*/g;
			var arr = this.context.split(' ');
			for (var i in arr){
				var str = arr[i];
				if (arr[i] && re.test(arr[i])){
					var str =  arr[i].replace(re, '')
					if (str.length > 0 && str.length < 4){
						arr[i] = str;
						f = true;
					}
				}
			}
//			if (f) this.context = arr.join(' ')
		}
		if (f){
			var el = $('#iSearchBtn');
			if ($('#hideForm:visible').length){
				el = $('.context .iSearch')
			}
			$.ajax({
				url: this.main.path.MSG_ISEARCH_WARNING,
				dataType: "html",
				type: "get",
				success: function(html){
					self.showWarning(el.parent(), html);
					setTimeout(function(){
						$('.tooltip ').mouseout();
					},600)
				}
			});
		}
		return f;
	};
	
	this.selSuggest = function(el,input){
		this.thesitem = $(el).attr('thesitem');
		var doclink = $(el).attr('doclink');
		var chapter = $(el).attr('chapter');
		var instsrch = $(el).attr('search');
		var txt = $(el).text()
		if (this.thesitem || instsrch) {
			this.search(null, txt);
		}
		if (doclink) {
			var params = [];
			if (chapter)
				params.push('point=mark=' + chapter);
			this.main.document.open(parseInt(doclink), null, params);
		}else{
			if (input){ 
				input.val(txt);
				input.attr('check','1');
			}
		}
	};
	
	this.showWarning = function (el, html) {
		var self = this;
		self.main.tooltip.create(el, html, 18000, 'iSearchWarning', null, null, null, function () {
			if (window.isEda && (self.main.eda.onHideIsearchWarning != null))
				self.main.eda.onHideIsearchWarning();
		}, function (warning) {
			if (window.isEda && (self.main.eda.onShowIsearchWarning != null))
				self.main.eda.onShowIsearchWarning(warning);
		});
	};
	
	this.init();
}
