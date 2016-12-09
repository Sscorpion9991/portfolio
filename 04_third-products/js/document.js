function  Document(main){
	this.main=main;
	this.defaultND = window.firstPage; //'777712445';
	this.mainND = window.kodeksFirstPage;
	var prevNd=null; // private
	var nd=null; // private
	var nh=null; // private
	this.linkHistory=null;
	this.textSearch=new TextSearch(this);
	this.longDocument=new LongDocument(this);
	this.djvu=new Djvu(this);
	this.state=null;
	this.list=null;
	this.warning=null;
	this.infoStyle=null;
	this.infoTitle=null;
	this.controlDocChanged;
	this.controlDocChangedList;
	this.doc_info=null;
	this.selection = null;
	this.selectedText = null;
	this.reloadTreeCheck=true;
	this.lastDocNd = null;
	this.isTestDB=false;
	this.sysInfoNd = null;
	this.docArea = null;
	this.controlDoc = null;
	this.linkForOperInf = null;
	this.systemStandartLinks = null;
	this.textSearchTab = null;
	this.isDemoOrBill = null;
	this.ClearTextOn = false;
	this.tContentOn = false;
	this.tContentNum = null;
	this.LinkForAct = null;
	this.unPrint = null;
	this.sameDoc = false;
	this.similarTexts = null;
	this.needOnClearText = false;
	this.TestToolsUrl = { Url : null, Name : null };
	this.RegInfo = { RegNumber : null, Protect  : null, Network : null, Intranet : null };
	
	this.URL_SAVE = 'save';
	this.URL_WORD = 'copytoword';

	
	this.getLink = function() {
		sourceName = '';
		if(window.isKodeks)
			sourceName += 'КОДЕКС';
		if(window.isTechexpert)
			sourceName += 'ТЕХЭКСПЕРТ';

		return 	'<a href="kodeks://link/d?nd=' + this.nd + '" title="' + this.doc_info.hint + '">' + 
					'"' + this.doc_info.title + '"' + ' (источник: ИСС "' + sourceName + '")' +
				'</a>';
	};
	
	this.init = function() {
		var self = this;
		var initDjvu = self.djvu.isDjvu();
		this.ctrlTestDB();
		this.getSysInfoNd();
		this.getRegInfo();
		this.checkTestTools();
		$('.openTabById').live('click', function() {
			self.main.tabs.openTabById(this);
		});

		$('#workspace .openTab, #tree .openTab').live('click', function() { self.main.tabs.openTab(utils.getId($(this).attr('id'))) });
		$('div#home, .navHome').live('click', function(event) {
			self.open(self.defaultND);
		});

		//self.initHelp(null,null,null,function(){self.clickHelpLink() });
		//self.initHelpByOid(true,'818100006');

		$('.textSearch .value input').live('keyup', function(event) {
			self.main.tooltip.suggest(event, this, main.path.URL_ISEARCH_QUICKRESULTS, true)
		});
		$('.textSearch .value input').live('keydown', function(event) {
			self.main.tooltip.ctrlSuggest(event, this, function() {
				//				self.textSearch.pressEnter(event);
				self.textSearch.find();
			}, 'textSearch');
		});


		$('a.license').live('click', function() {
			var id = $(this).attr('id');
			var arr = id.split('_');
			var id2 = arr[0] + '_lic';
			$('#' + id2).toggle();
		});

		$('#dialog .closeBookmarkDialog, #dialog .cancel, div#dialog .confirmDelete .no').live('click', function() { self.closeDialog(); });

		$('a[nd]').live('click', function(event) { return self.openLink(this, event); });
		$('a[sf]').live('click', function() {
			self.main.search.search(null, null, $(this).attr('sf'));
		});

		$('.doc').live('click', function(event) { return self.openLink(this, event); });

		$('.document .referentList li').live('click', function() {
			self.open(utils.getId(this.id));
		});
		$('.document .referent').live('click', function() {
			//			self.openReferent(this);
			self.openWinReferent(this);
		});
		$('.document .referentClose').live('click', function() {
			//			self.hideReferent(this);
		});

		$('#tree .documentAnchors').live('click', function() {
			self.documentAnchorsSelect(this);
		});
		$('ul.redactionsUl li input.cbRedactions').live('click', function() { self.redactionsCbFilter(); });
		$('div.redactionsFooter div.readctionsButtons').live('click', function() { self.redactionsBtClick(); });

		//$('.activeDoc .contents span.close').live("click", function () { self.closeNode(this); });
		//$('.activeDoc .contents span.open').live("click", function () { self.openNode(this); });
		$('.tContentTree a.goTo, .activeDoc .contents a.goTo').live("click", function() { self.goTo(this); });

		$('.activeDoc .contents a.goTo').live('mouseover', function() { $('.activeDoc .contents a.goTo').removeClass('selected') });

		$('.activeDoc .contents a#expand').live("click", function() { $('.activeDoc .contents .closed').removeClass('closed').addClass('opened'); });
		$('.activeDoc .contents a#collapse').live("click", function() { $('.activeDoc .contents .opened').removeClass('opened').addClass('closed'); });

		/* var print = function () {
		var el = this;
		if (utils.isKBrowser()) {
		self.getAnnotPrint(self.nd);  // this *must*	be synchronous query (in KBrowser PrintDoc
		// do not work if called from asynchronous ajax callback)
		self.print(null, el);
		} else {
		self.getAnnotPrint(self.nd, function () { self.print(null, el); });
		}
		};*/
		
		$('a.service_link_bottomer').live("click", function() {
			self.openTestTolls(this);
		});

		this.main.contextMenu.reg('.tabBody a[nd], .tabBody ul:not(.table) .docItem', lex('openNewWindow'), function(e, el) {
			el = $(el);
			if(el[0].nodeName.toLowerCase() == 'a'){
				self.openLink(el, e, true);	
			} else {
				if(el.parent().hasClass('foldersList') || el.parent().hasClass('forHistory')){ //значит это документ из папок пользователя или истории
					 var state = eval('(' + el.attr('state') + ')');
					if(state && state.nd){
						el.attr('id', "item_" + state.nd);
					 }
				}
				self.openListItemInNewWindow(e,el);
			}
		});
		this.main.icons.reg('show_notes', function() { self.clearTextToogle(false) });
		this.main.icons.reg('hide_notes', function() { self.clearTextToogle(true) });

		this.main.icons.reg('print', this.print);
		//	    this.main.contextMenu.reg('.document .text', 'Печать', this.print);
		this.main.icons.reg('copy', print);
		this.main.contextMenu.reg('.document .text', lex('findSimilarTexts'), function() {
			self.getSimilarText();
		});
		this.main.contextMenu.reg('.document .text', lex('copy'), function() {
			if (window.isLocal || window.isClient)
			{
				copyToClipboard();
			}
		});

		var theDocument = this;
		var copyLink = function () {
			if (window.isLocal || window.isClient)
			{
				copyToClipboard('Text', theDocument.getLink( ) );
			}
		};
		
		this.main.icons.reg('copyLink', copyLink);
		this.main.contextMenu.reg('.document .text', lex('copyDocLink'), copyLink);

		var save = function() { self.save(); };
		this.main.icons.reg('save', save);
		// this.main.contextMenu.reg('.document .text', 'Сохранить в файл', save);

		if (utils.isLocal() || utils.isKBrowser())
		{
			//			$('#ico_word').live('click', function(){ self.copyToWord(); });
			this.main.icons.reg('word', function() { self.copyToWord(); });
		}
		$('a.file').live('click', function() { self.saveFile(this, false); return false; });


		$('div.activeDoc div.text p').live('mouseup', function() {
			self.selection = utils.getSelection();
			self.selectedText = utils.getSelectedText();
		});

		$('div.activeDoc div.text p').live('mouseout', function() {
			self.selection = utils.getSelection();
			self.selectedText = utils.getSelectedText();
		});

		$('a#link_showDbCont').live('click', function() {
			self.openDBDialog();
		});

		$('external').live('click', function() {
			self.noDoc(this);
		});
		$('a.noBase').live('click', function() {
			return false;
		})
		$('.printDjvuDlg .saveDoc').live('click', function() {
			$('#ico_save').click();
			self.main.tooltip.killSuggest();
			return false;
		})
		$('.printDjvuDlg .printPage').live('click', function() {
			self.getAnnotPrint(self.nd, function() { self.printReady(); });
			self.main.tooltip.killSuggest();
			return false;
		})
		$('.printDjvuDlg .canselPrint').live('click', function() {
			self.main.tooltip.killSuggest();
			return false;
		})
		this.main.resize.set('ctrlSwfObject', function() { self.ctrlSwfObject() });
		/*назначим событие на нажатие кнопки "Поставить документ на контрорль"*/

		this.main.icons.reg('put_control', function() {
			self.addToControlled();
			return false;
		});

		this.main.icons.reg('remove_control', function() {
			self.removeFromControlled();
			return false;
		});

		if (typeof customizedDocumentInit != 'undefined')
			customizedDocumentInit(this);
	}
	
	this.getSimilarText = function(){
		var mark = utils.getSelectedTextMarker();
		if(mark == null) return;
		var self = this;
		//задержка для того, чтоб пользователь мог увидеть выделенным весь параграф
		var lastStart = setTimeout(function() {
			self.main.progress.start();
			var nd = (typeof(self.nd) == 'string') ? self.nd.split('&')[0] : self.nd;
			var data = {'similar_texts': true,
						'nd': nd,
						'mark': mark};
			var title = lex('similarTexts');
			self.openReferentList(data, title);	
		}, 500);
	}
	
	this.initLinkTitles = function () {
		var self = this;
		var links = $('.document.activeDoc:visible a').not('.goTo');
		if (links.length != 0 && !window.mobile) {
			links.unbind('mouseenter mouseleave');
			links.hover(function (e) {
				var $elem = $(this);
				clearTimeout($elem.data("docTitlesShow"));
				$elem.data("docTitlesShow", null);
				$elem.data("docTitlesShow", setTimeout(function () {
					if ($elem.attr('title') == '') {
						if ($elem.find(".docAnnotation").length == 0) {
							kApp.document.getLinkTitle($elem, function (html) {
								$elem.data('simpletip', null);
								$elem.simpletip(
									{
										baseClass : "tooltip docAnnotation",
										content : html,
										hideElements : ".docAnnotation",
										boundryCheck : false,
										offsets : {
											x : 5,
											y : -64
										},
										invertedOffsets : {
											x : -7,
											y : -7
										},
										offsetElement : $('.document.activeDoc:visible .text')
									},
									function () {
										$elem.data("simpletip").updatePos(e);
										kApp.document.showLinkTitle($elem, e);
										setTimeout(function () {
											$elem.data("simpletip").updatePos(e);
										}, 30);
										$elem.find(".docAnnotation").attr("unselectable", "on");
										$elem.find(".docAnnotation")[0].onselectstart = function () {
											return (false);
										};
									}
								);
							});
							return;
						}
						kApp.document.showLinkTitle($elem, e);
					}
				}, 200));
			}, function (e) {
				var $elem = $(this);
				clearTimeout($elem.data("docTitlesShow"));
				$elem.data("docTitlesShow", null).data("simpletip").hide();
			});
		}
	}
	this.getLinkTitle = function (element, callback) {
		var self = this;
		var url = "getLinkTitle";
		var nd = element.attr('nd');
		var data = {
			nd:nd,
			inactive : element.hasClass('consLink'),
			context : element.text()
		};
		
		if (nd && nd.indexOf('&prevdoc=') > 0){
			var arr =  nd.split('&prevdoc=');
			data.nd = arr[0];
			data.prevdoc = arr[1]
		}
		$.ajax({
			url : url,
			dataType : "json",
			type : "post",
			data : data,
			success : function (html) {
				if (html != null && html != "") {
					callback(html);
				}
			}
		});
	}
	this.showLinkTitle = function($elem, e) {
		$elem.data("simpletip").show(e);
	}
	this.setNd = function(nd){
		this.prevNd = this.nd;
		this.nd     = nd;
		this.main.panel.docSelected(this.nd);	
	}
	this.usePrevNd = function(){
		this.nd     = this.prevNd;
		this.prevNd = null;
		this.main.panel.docSelected(this.nd);
	}
	this.getNd = function(){
		return this.nd;	
	}
	this.openLink = function(element, event, newWindow){
		element=$(element);
		if (window.isEda) {
			if (!this.main.eda.allowLink(element, event, newWindow))
				return false;
		}
		if(event.target.tagName == 'SPAN' && event.target.className.indexOf("ACTIVE") != -1) {
			event.target = event.target.parentNode;
		}
		if (event.which==3 || this.diffLink(event.target)){
			return;
		}
		if (element.parent().hasClass('seeAlso') && event.ctrlKey == false && $(event.target).is('a') ){
			return;
		}
		var self = this;
		if(!window.mobile && element.hasClass('newFrame') && this.openNewFrame!=null) {
			this.openNewFrame(element.get(0), event);
			return;
		}
	
		var listItem = element.eq(0).parents().filter('.docItem');
		if (listItem.length==1 && listItem.parent().hasClass('table') == false){
			if(newWindow == true && !window.mobile){
				this.main.listDocument.openInNewWindow(element.attr('nd'));
			} else {
				this.main.listDocument.openDoc(listItem.get(0),null,null,element.attr('nd'));
			}
			
			return;
		}
	
		if(element.attr('class') == 'doc') this.reloadTreeCheck = false;
		
		var nd=null;
		var params = new Array();
	
		var p = element.attr('params');
//		var data = new Array();
		p = utils.getUrlAllParam('?'+p, true);
		for(var i in p){
			params.push(i+'='+p[i]);
		}

		
		
		if (element.attr('prevdoc')){
			params.push(
				'prevdoc=' + element.attr('prevdoc')
			);	
		}
		
		var mark = element.attr('mark');
		if (mark!=null){
			params.push(
				'point=mark=' + mark
			);	
		}
		if (element.hasClass('doc')){
			nd=utils.getId(element.attr('id'));
		}else{
			nd=element.attr('nd');
		}
		var nf = element.attr(nf); 
		if (nf){
			params.push(
				'nf=' + nf
			);	
		}
		if (window.isEda)
			nd = this.main.eda.substitute(nd);
		
		var tmpNd = (typeof(this.nd) == 'string') ? this.nd.split('&')[0] : this.nd+'';
		var tmpParamNd = (typeof(nd) == 'string') ? nd.split('&')[0] : nd+'';
		
		if(tmpParamNd == "602699229"){
			var url = element.eq(0).html();
			if (url != '' && url != null){
				url = url.replace(new RegExp("<(\"[^\"]*\"|'[^']*'|[^'\">])*>", "g"),"");
				url = url.replace(" ","");
				url = url.replace(new RegExp("[,.;':_+=%]$"),"");
				url = url.replace(new RegExp("\n"),"");
				if (url.substring(0,7) != 'http://'){
					url = 'http://' + url;
				}
				window.open(url);
			}
			return;
		}
		
		if (tmpNd == tmpParamNd && this.ClearTextOn == true){
			params.push('clearText=true');
			this.sameDoc = true;
		} else {
			this.sameDoc = false;
		}
		if ((event.shiftKey || newWindow!=null) && utils.allowNewWindow(nd, newWindow)) {
			var url = '?nd='+nd;
			if (params && params.length){
				url+='&'+params.join('&');
			}
			window.open(url);
			return false;
		}else{
			this.open(nd,null,params,null,null,null,true);
			return true;
		}
		
	}
	this.firstOpen = function(){
		var self = this;
		var context = null;
		try {
			context = utils.getUrlParam(window.location.href, 'query');
			if (context){
				context = decodeURIComponent(context);
			}
		}catch(e){	
		}
		var type = utils.getUrlParam(window.location.href, 'type');
		var callback = function() {
			self.main.tabs.openTab(self.main.tabs.getActive(), function () {
				var after = function(){
					self.main.document.ready();
					$('.activeDoc .textSearch input').focus();
				}
				if (context){
					self.main.document.textSearch.setContext(context);
					self.main.document.textSearch.setType(type);
					self.main.document.textSearch.open();				
					self.main.document.textSearch.find(null,null,after);
				}else{
					after();
				}
			});
		}
		var isearch = utils.getUrlParam(document.location.href, 'isearch');
		if (isearch){
			isearch = decodeURIComponent(isearch);
			this.main.iSearch.initTabs(isearch);
			return;
		}
		var nd = utils.getUrlParam(document.location.href, 'nd');
		var point = utils.getUrlParam(document.location.href, 'point');
		var params = new Array();
		var obj = utils.getUrlAllParam(window.location.href, true);
		for (var i in obj){
			params.push(i+'='+obj[i])
		}
		if (point != null){
			params.push('point='+point);
		}
		if (nd == null)
			nd = this.defaultND;
		this.open(nd,null,params,context ? callback : null,params);
	}
		
	this.open = function(nd,history,params,callback,list, event, noScroll, tabId){
		//console.log(this);
		this.rhLock = true;
		//if (params!=null){
		//	params.r=null;
		//}
		this.params = params;
		this.main.resize.unset('document');
		this.main.listDocument.active = null;
		this.main.list.cntSelected = null;
		this.list = null;
		if (list!=null){
			this.list = {};
			this.list.listIndex = list.listIndex;
			this.list.reqIndex = list.reqIndex;
			this.list.num = list.num;
		}
		var self = this;
		this.setNd((nd==null? this.defaultND : nd));
		this.main.progress.start();
		this.initTabs(nd,params,history,callback,noScroll,tabId);			
		this.linkHistory = null;
		
		if (utils.getUrlParam(document.location.href, 'help') == 'true') {
			this.hidePanels();
		}
		this.main.bookmarks.area = 'doc';
		if (this.nd != null){
			//console.log(typeof(this.nd));
			var tmpNd = (typeof(this.nd) == 'string') ? this.nd.split('&')[0] : this.nd+'';
			if (this.lastDocNd != tmpNd){
				this.lastDocNd = null;
			}
		}
		if (nd == null) {
			if (!(nd = utils.getUrlParam(document.location.href, 'nd'))) {
				this.initHelpByOid(true,'document', nd);
				//this.initHelp('root',null,nd);
			}
		} else {
			if (nd == this.defaultND) {
				this.initHelpByOid(true,'mainpage', nd);
			} else {
				this.initHelpByOid(true,'document', nd);
			}
		}
	}
	this.reload = function(params,callback){
		if (this.djvu.isDjvu()){
			return;	
		}
		var tab = this.main.tabs.getActiveTab();
		var data = {};
		var self = this;
		if (tab){
			var url = tab['urlParams'];
			data.reload='text';
			if (!params.length){
				data[params.key] = params.value;
			}else{
				for (var i in params){
					data[params[i].key] = params[i].value;
				}
		//		url = this.main.utils.setUrlParams(url,params);
			}
			$.ajax({
				url: url,
				dataType : 'html',
				type : "get",
				data : data,
				success: function (html) {
//					alert(this.data);
//					alert(this.url);
//					alert(html);
					$('#tabBody_'+tab.hidx+' .text').html(html);
					self.ctrlHeaderList();
					
					var body = self.activeText();
					var scrollBlock = $('.scrollBlock', body);
		
					self.setHeight(body,scrollBlock);
	
					if (callback) {
						callback();
					}
				}
			});
		}
	}
	this.initTabs = function (nd, params, history, callback, noScroll, tabId) {
		this.annotInfo = null;
		this.annotStatus = null;
		this.ClearTextOn = false;
		this.tContentOn = false;
		this.needOnClearText = false;
		if (params == null){
			this.longDocument.context = null;
			this.textSearch.contextForPart = null;
		} else if (params[0] != 'isAnnotationOpen'){
			this.longDocument.context = null;
			this.textSearch.contextForPart = null;
		}
		var self = this;
		this.textSearchTab = null;
		this.params = params;
		//		if (nd==null){
		//			var url = this.main.path.URL_START_PAGE;		
		//		}else{
		if (/^\d+/.test(nd) || nd == null) {
				var url = this.main.path.URL_DOCUMENT_TABS;
				url += '?alltabs=1&nd=' + (nd == null ? this.defaultND : nd);
		} else {
				var url = nd;
		}
		//		}
		var data = '';
		if (params != null && params.length > 0) {
				data = params.join('&');
		}
	
		var loc = utils.URLAttrParse(url + (url.indexOf('?') == -1 ? '?' : '&') + data);
		loc.attr = this.getParams(loc.attr);
		this.clearParams();
		
		if (this.main.req!=null){
			this.main.req.abort();
		}
		
		this.main.req = $.ajax({
			url: loc.location,
			dataType: "json",
			data: loc.attr,
			type: "get",
			success: function (json) {
				var toHide = (json.nd == self.mainND || (self.params && self.params.nd==null && json.nd==null));
				if (!toHide && window.isEda) {
					toHide = self.main.eda.needHideForm(json.nd, self.params);
				}
				if (toHide) {
					self.hideForm();
				} else {
					self.showForm();
				}
			
				self.main.req = null;

				if (json && json.a_attrs) {
					if(self.isOriginalForm && json.a_attrs.CLASS == 'file') {
						self.isOriginalForm = 'file';
					}
					var a_href       = document.createElement("A");
					a_href.className = json.a_attrs.CLASS;
					a_href.href      = json.a_attrs.HREF;
					
					if(json.a_attrs.TARGET)
						a_href.target = json.a_attrs.TARGET;
					else
						a_href.target = "_self";

					if(json.a_attrs.CLASS == 'file' )
						self.saveFile(a_href, false);
					else
						window.open(a_href.href, a_href.target);
					self.usePrevNd();
					self.main.progress.stop();
					return;
				} else {
					self.isOriginalForm = json.isOriginalForm;
				}
				
				self.textSearch.type = null;
				
				if (json && json.canPutInUserData) {
						self.canPutInUserData = json.canPutInUserData;
				} else {
						self.canPutInUserData = false;
				}

				if (json && json.docloc) {
					window.location = json.docloc;
					self.usePrevNd();
					self.main.progress.stop();
					return;
				}
				if (json){
					self.main.tabs.excludFromRev = json.excludFromRev;
				}
				var noDocument = (!json || -1 == json.type);
				var noTabs = (json == null || json.tabs == null || json.tabs.length == 0);
				if (noDocument || noTabs) {				    
				    var titleMessage = self.getNoDocMessage(json);				    
					self.error404(json, noDocument);
					if (history == null) {
						var histName = titleMessage;						
						var list = null;
						if (list != null) {
							list = {};
							list.listIndex = list.listIndex;
							list.reqIndex = list.reqIndex;
							list.num = list.num;
						}
						var link = new LinkHistory(histName, null,
						function () {
							self.list = list;
							self.initTabs(nd, params, true);
							});
						self.linkHistory = self.main.history.add(link);
					}
					return;
				}

						//		if (json.tabs && self.main.tabs.active && json.tabs[self.main.tabs.active] && json.tabs[self.main.tabs.active].state=="active" && self.markTransition(nd,params) ){
						//			self.main.progress.stop('document');
						//			return;	
						//		}

				self.saveInfo(json);
				if (json.mark && params.point == null) {
						params.push({ key: 'point', value: 'mark=' + json.mark })
				}

				if (json.type == -1) {
						self.documentNotFound();
						self.doc_info = null;
						return;
				}

				if (json.title) {
					self.doc_info = {
						title: json.title,
						hint: json.hint
					};
				}

				self.warning = null;
				if (json.info) {
					self.warning = json.info;
				}
				self.infoStyle = null;
				if (json.infoStyle) {
					self.infoStyle = json.infoStyle;
				}
				self.infoTitle = null;
				if (json.infoTitle) {
					self.infoTitle = json.infoTitle;
				}
				self.controlDocChanged = null;
				if (json.changed != null) {
					self.controlDocChanged = json.changed;
				}
				self.controlDocChangedList = null;
				if (json.listChanged != null) {
					self.controlDocChangedList = json.listChanged;
				}
				self.unPrint = json.unPrint;
				self.docArea = null;
				if (json.docArea != null) {
					self.docArea = json.docArea;
				}
				self.controlDoc = null;
				if (json.controlDoc != null) {
					self.controlDoc = json.controlDoc;
				}
				self.isDemoOrBill = json.isDemoOrBill;
				self.tContentNum = json.tContentNum;
				self.similarTexts = json.similarTexts;
				self.LinkForAct = json.LinkForAct
				self.linkForOperInf = json.linkForOperInf;
				self.systemStandartLinks = json.systemStandartLinks;
				if (history == null) {
					// self.main.listDocument.scrToItem=null;
					if (nd != null) {
						self.main.restore.nextPage();
					} else {
						nd = self.defaultND;
					}
					var list = self.list;
					var link = new LinkHistory(self.doc_info, 'document', null);
					self.linkHistory = self.main.history.add(link);
					// console.log('ADDDDDDDDDDDDD');
					// this.main.history.add(link);
				}
				self.rhLock = null;
				if (self.linkHistory != null) {
					//var title=json.tabs[0].title;
					self.main.history.list[self.linkHistory].title = json.title;
					self.main.history.setTitle(json.title);
				}
				self.main.icons.clear();
				if (json.isHelp) {
					$("#getRegInfo, #getRegInfoFull").hide();
				}
				var pics = json.pics;
				for (i in pics) {
					var className = 'document_' + pics[i].type;
					if (pics[i].className != null)
						pics[i].className = className + ' ' + pics[i].className;
					else
						pics[i].className = className;
				}
				self.main.icons.addList(pics);
				self.ctrlPicsTabs(json.pics, json.tabs);
				
				if (window.ARZ['init']) {
					legAnalysis.addIconDoc(self.nd);
				}

				if (json.tabs) { // если отчет о системе, деактивируем ненужные кнопки				
					if (self.isReport(json.tabs[0].urlParams)) {
						self.main.icons.disable('folder_put');
						self.main.icons.disable('bookmark_set');
						self.main.icons.disable('find');
					}
				}

				if (!json.panels) {
					self.main.panel.hide();
					self.main.panel.Panels = null;
				} else if (json.panels.length < 2) {
					self.main.panel.load(json.panels[0], noScroll, json.nd);
					//self.main.icons.add('tree', 'tree');
					//$('#ico_tree').hide();
					//self.main.icons.disable('tree');
				} else if (json.panels.length >= 2) {
					self.main.panel.loadSeveral(json.panels);
				} else if (json.panels.length == 1) {
					self.main.icons.add('tree', 'tree');
					var showHiddenTree = true;
					var id = null;
					for (var bv in json.panels) {
						id = utils.getUrlParam(json.panels[bv].urlParams, 'tree_id');
						if (self.main.panel.id == id) {
							showHiddenTree = false;
							break;
						}
					}
					if (showHiddenTree) {
						self.main.panel.hide();
					} else {
						self.main.panel.open();
					}
				}

				if (json.tabs && json.tabs.length > 0) {
					for (var i in json.tabs) {
						//	if (json.point){
						//		json.tabs[i].urlParams+='&point='+json.point;
						//	}
						/*
						if (/^tabs/.test(json.tabs[i].urlParams)){
						if (json.tabs[i].contentType){
						json.tabs[i].action=function(){
						self.initTabs(json.tabs[i].urlParams)
						}
						}
						}
						 */
						json.tabs[i].callback = function (tabIndex) {
							self.initContent(tabIndex);
						}
					}

					var tabs = null;
					if (window.isEda) {
						tabs = self.main.eda.fillTabs(json.tabs);
					}
					if (tabs == null) {
						tabs = new Array();
						for (var i in json.tabs) {
							tabs[json.tabs[i].hidx] = json.tabs[i];
						}
					}
					var needTabsPartsLoad = self.main.tabs.needTabsPartsLoad(self.getNd());
					if(needTabsPartsLoad == true && tabId != null && tabs[tabId] != null){
						//если наличие табов проверяется уже после загрузки 1-го как в новых/измененных документах
						//то делаем 'active' вкладку с id = tabId
						for (var i in json.tabs) {
							tabs[json.tabs[i].hidx].state = 'inactive';
						}
						tabs[tabId].state = 'active';
					}
					self.main.tabs.setTabs(tabs,
						function (tabId) {
							self.changeTab(tabId)
						});
					if (callback == null) {
						self.ready();
					}
					
					if(window.ARZ['init']) {
						ARM_ARZ_OBJ.preOpenTab(json);
					}
					
					if (tabId != null) {
						self.main.tabs.openTab(tabId, callback);
					} else {
						self.main.tabs.openTab(self.main.tabs.getActive(), callback);
					}
					
					if (self.list != null) {
						if (self.list.reqIndex >= 0) {
							self.main.iSearch.setIcons(self.list.reqIndex);
							if (self.list.num >= 0) {
								self.main.iSearch.searchHistory[self.list.reqIndex].current = self.list.num;
							}
						} else {
							if (self.list.listIndex || self.list.listIndex === 0) {
								self.main.listDocument.setIcons(self.list.listIndex);
								if (self.list.num >= 0) {
									self.main.listDocument.stateList[self.list.listIndex].currentItem = self.list.num;
								}
							}
						}
					}
				}
				if (self.params && self.params.length){
					for (var j = 0 ; j < self.params.length ; j++){
						if (self.params[j] == 'clearText=true'){
							var activeTab = self.main.tabs.getActiveTab();
								if (activeTab.clearText != null){
									self.clearTextToogle(true);
								} else {
									self.needOnClearText = true;
								}
							break;
						}
					}
				}

				if(window.ARZ['init']) {
					foreAnalyst.openTab(nd, history);
					ARM_ARZ_OBJ.showMode(json);
				}
				//self.initDocAnnotation();
			},
			error: function(e){ 
 				if (e != null){
					if (e.status == 503){
						if (window.parent != null){
							if (window.parent.window != null){
								window.parent.window.location.reload();
							}
						} else {
							window.location.reload();
						}
					}
				}
			} 
		});
	};
	
	this.isOveruse = function(json) {
		return (json != null) && (10004 == json.code);
	}
	
	this.getNoDocMessage = function(json) {
		if (this.isOveruse(json)) {
			return msg.get('docNotFoundMessOveruse');
		}
		return msg.get('docNotFoundMessNoDocInBase');
	}
	
	this.error404 = function(json, noDocument, titleMessage){
		var self = this;
		self.main.progress.stop('document');
		$('#workspace').empty();
		$('#icons').empty();
		$('#tabs').hide();
		this.main.tabs.hidePanel();
				
		if (noDocument) {
			if (null == titleMessage) {
				if (json != null && json.message != null) {
					titleMessage = json.message;
				} else {
					titleMessage = self.getNoDocMessage(json);
				}
			}
				
			if (self.isOveruse(json)) {
				$('#workspace').append('<div style="overflow-y: auto;" class="tabBody">' +
					'<div align="center" class="message toomanyusers">' +
					'<p>' + titleMessage + '</p>' +
					'<span class="default">Превышено максимальное число подключений, допустимое используемым регистрационным файлом.</span>' + 
					'<br><span>Для решения проблемы, пожалуйста, обратитесь к вашему сервисному специалисту.</span></p></div></div>');
				} else {
					$('#workspace').append('<div style="overflow-y: auto;" class="tabBody">' +
					'<div align="center" class="message notinbase">' +
					'<p>'+ titleMessage +'</p>' +
					'<span class="default">Для решения проблемы, пожалуйста, обратитесь к вашему сервисному специалисту.</span></div></div>');
			}
		} else {
			var noTabsMsg = json.title;
			if (null==noTabsMsg || ''==noTabsMsg)
				noTabsMsg = 'Материалы отсутствуют';
			$('#workspace').append('<div style="overflow-y: auto;" class="tabBody">' + '<p><b>' + noTabsMsg + '</b></p></div>');
		}
	}
	
	this.ready = function(isFocus){
		this.main.progress.stop('document');
		this.textSearch.setFocus();
	}
	
	this.changeTab = function (index) {
		var self = this;
		if ($('#panel').is('.annotSearch')) {
				$('#tree > div').hide();
				self.main.panel.hide();
		}
		if (index == self.textSearchTab) {
			if ($('#panel').is('.annotSearch') && $('#tree > div.annotSearch').length > 0) {
				$('#tree > div.annotSearch').show();
				self.main.panel.show();
			}
		}
		self.longDocument.clearRequestList();
		$('.activeDoc').removeClass('activeDoc');
		//	this.textSearch.create(this.main.tabs.getActiveTab().textSearch,this.main.tabs.getActiveTab().hidx);
		$('#workspace .document:visible').addClass('activeDoc');
		if (this.djvu.isDjvu()) {
			this.djvu.changeTab();
		}

		if (this.longDocument.isLongDocuments(index)) {
			var body = this.activeText();
			self.longDocument.init(body.get(0));
			body.scroll(function () {
				self.longDocument.init(this)
			});
		}
		
		var activeTab = this.main.tabs.getActiveTab();
		var isFirstTab = this.main.tabs.isFirstTab();

		if (window.isEda) {
			this.main.eda.startChangeTab(activeTab);
		}

		if(isFirstTab == true){
			if(this.systemStandartLinks != null) {
				this.main.tabs.showSystemStandartLinks(this.systemStandartLinks);
			}
		} else {
			if (this.systemStandartLinks != null) {
				this.main.tabs.closeSystemStandartLinks(false);
			}
		}

		if (activeTab.title == 'Текст' || activeTab.title == 'Текст справки' || activeTab.title == 'Текст редакции') {
			if (this.LinkForAct != null) {
				this.main.tabs.showLinkForActMessage(this.LinkForAct);
			}
			if(this.main.document.tContentOn == true){
				this.main.icons.add('table_content','tContent');
				this.main.icons.active('table_content');
			} 
			if (this.main.panel.Panels != null) {
				this.main.tabs.showSeveralTree(this.main.panel.Panels);
			}
		} else {
			if (this.main.panel.Panels != null) {
				this.main.tabs.closeSeveralTree(true);
			}
			if (this.LinkForAct != null){
				this.main.tabs.closeLinkForOperInf(false);
			}
			this.main.icons.remove('table_content');
			this.main.icons.disable('table_content');
			if ($('#tree .tContentTree').length != 0) {
				this.main.tContent.close();
				if (window.isEda) {
					this.main.eda.changeTab(activeTab);
				}
				return;
			}
		}

		if(utils.isKBrowser() || utils.isLocal()){
			if(activeTab.allDjvu != null){
				this.main.icons.offIcon('word');
			} else {
				this.main.icons.onIcon('word');
			}
		}

		if(activeTab.previewNd != null){
			this.main.icons.add('show_preview','document_show_preview');
			this.main.icons.active('show_preview');
		} else {
			this.main.icons.remove('show_preview');
			this.main.icons.disable('show_preview');
			if ($('#tree .previewTree').length != 0) {
				this.main.preview.close();
				if (window.isEda) {
					this.main.eda.changeTab(activeTab);
				}
				return;
			}
		}
		if(activeTab.clearText != null){
			if (this.needOnClearText == true){
				this.needOnClearText = false;
				this.clearTextToogle(true);	
			} else if(this.ClearTextOn == false){
				this.main.icons.add('hide_notes','hide_notes');
				this.main.icons.active('hide_notes');
			} else {
				this.main.icons.add('show_notes','show_notes');
				this.main.icons.active('show_notes');
			}
		} else {
			if(this.ClearTextOn == false){
				this.main.icons.disable('hide_notes');
			} else {
				this.main.icons.disable('show_notes');
			}
		}
		
		if (this.main.checkNoUserData() == false) {
			if (this.main.bookmarks.area == 'doc' && this.main.listDocument.isListDocuments()) {
				this.main.list.checkDocControlIcon();
				if ($('#ico_remove_control').length != 0) {
					this.main.icons.disable('remove_control');
				}
			}
			
			if (this.docArea == 1 && !this.main.listDocument.isListDocuments()) {
				if (this.controlDoc == false) {
					if ($('#ico_put_control').length == 0)
						this.main.icons.active('put_control');
				} else if ($('#ico_put_control').length != 0) {
					this.main.icons.disable('put_control');
				}
				
				if (this.controlDoc == true) {
					if ($('#ico_remove_control').length == 0)
						this.main.icons.active('remove_control');
				} else if ($('#ico_remove_control').length != 0) {
					this.main.icons.disable('remove_control');
				}
			}
		}
		
		if (this.main.listDocument.isListDocuments()) {
			var lst = $('#workspace .tabBody:visible .docList');
			if (!lst.attr('id')) {
				this.main.listDocument.init(null, function () {
					self.main.progress.stop();
						self.rewriteHistory();
				});
			}
		}

		if (this.main.listDocument.isListDocuments()) {
			var list = this.main.listDocument.getList();
			if (list.attr('id')) {
				this.main.listDocument.active = /\d+/.exec(list.attr('id'))[0];
				this.main.listDocument.list = list;
			}
			this.main.icons.disable('find');
		} else {
			this.main.icons.active('find');
		}

		var tab = this.main.tabs.getActiveTab();
		var noTextSearch = utils.getUrlParam(tab.urlParams, 'notextsearch');
		if ('' + noTextSearch == '1')
			this.main.icons.disable('find');

		if(activeTab.allDjvu != null)
			this.main.icons.disable('find');

		if (window.isEda) {
			this.main.eda.changeTab(tab);
		}

		if(window.ARZ['init']) {
			ARM_ARZ_OBJ.changeTabsKodeks6(tab);
		}

		this.rewriteHistory()
	}
	
	this.activeText = function (additional) {
		if (additional == null)
			additional = '';
		var inDialog = $('#dialog .text' + additional);
		if (inDialog.get(0) != null)
			return inDialog;
		
		var el = $('#workspace .activeDoc .text' + additional);
		if (el.length==1) return el;
		
		el = $('#workspace .tabBody.url:visible'); 
		return el;
	}
	
	this.checkUnPrint = function () {
		if (this.unPrint != null) {
			//alert(this.unPrint);
			this.showAlert(this.unPrint, null, "left");
			return true;
		}
		return false;
	}
	
	this.initContent = function (tabIndex) {
		var self = this;
		$('.activeDoc').removeClass('activeDoc');
		var body;
		this.ctrlSwfObject();
		if (tabIndex != null) {
			var el = $('#tabBody_' + tabIndex + ' .document')
			if (el.length != 1) {
				el = $('#tabBody_' + tabIndex)
			}

			el.addClass('activeDoc');
			var currentTab = this.main.tabs.tabs[tabIndex];
			if(currentTab.allDjvu == null)
				this.textSearch.create(currentTab.textSearch, currentTab.hidx);
			if (window.isEda) {
				this.main.eda.initIcons(currentTab);
			}
		} else {
			$('#workspace .document:visible').addClass('activeDoc');
			var activeTab = this.main.tabs.getActiveTab();
			tabIndex = activeTab.hidx;
			this.textSearch.create(activeTab.textSearch, tabIndex);
			if (window.isEda) {
					this.main.eda.initIcons(activeTab);
			}
		}

		
		var print = function () {
			if (self.checkUnPrint() == true) {
				return;
			}
			
			self.saveNotice('printNotice', function() {
				var el = this;
				if (utils.isKBrowser()) {
					self.getAnnotPrint(self.nd);  // this *must*	be synchronous query (in KBrowser PrintDoc
					// do not work if called from asynchronous ajax callback)
					self.printReady(null, el);
				} else {
					self.getAnnotPrint(self.nd, function () { self.printReady(null, el); });
				}
			});
		};

//		this.main.contextMenu.reg('a[nd]', 'Открыть в новом окне', function (e, el) {
//			self.openLink(el, e, true);
//		});

		this.main.icons.reg('print', print);
		//  this.main.contextMenu.reg('.document .text', 'Печать', print);

		var save = function () {
			if (self.checkUnPrint() == true) {
				return;
			}
			self.save();
		};
	
		this.main.icons.reg('save', save);
		//this.main.contextMenu.reg('.document .text', 'Сохранить в файл ', save);

		var body = this.activeText();
		//this.findMarker()
		this.rewriteHistory();
		this.ctrlHeaderList();
		this.main.tabs.showWarning(this.warning, this.infoStyle, this.infoTitle);
		$('.datepicker').datepicker();


		
		
		if (this.controlDocChangedList != null && this.controlDocChanged != null) {
			this.main.tabs.showChangedDoc(this.controlDocChanged);
			this.main.tabs.createChangedDocList(this.controlDocChangedList);
		}

		if(window.ARZ['init']) {
			ARM_ARZ_OBJ.initContentKodeks6(currentTab);
		}

		if (this.linkForOperInf != null) {
			this.main.tabs.showLinkForOperInf(this.linkForOperInf);
		}
		
		var scrollBlock = $('.scrollBlock', body);
		
		this.setHeight(body,scrollBlock);
		
		$(window).unbind('resize.mh').bind('resize.mh',function(){
			self.setHeight(body,scrollBlock);
		});

		
		var bind = function(){
			$('.contents .opened .opener',body).unbind('click').bind('click',function () {
				var jEl = $(this);
				var parent = jEl.parent().parent();
				parent.removeClass('opened');
				parent.addClass('closed');
				bind();
			});
			$('.contents .closed .opener',body).unbind('click').bind('click',function () {
				var jEl = $(this);
				var parent = jEl.parent().parent();
				parent.removeClass('closed');
				parent.addClass('opened');
				bind();
			});
		};
		bind();
		
		if (scrollBlock.length == 1 && window.mobile) {
			//iScrollDispetcher.reg(scrollBlock, new iScroll(scrollBlock.get(0)))
		}
		
		if (scrollBlock.length == 0) {
			setTimeout(function () { self.mobileScroll() }, 600);
		}
		
		if (this.main.checkNoUserData() == false) {
			if (this.main.bookmarks.area == 'doc') {
				if ((this.main.listDocument.isListDocuments() && $('ul > li.selected').filter(':visible').length == 0) || this.main.tabs.tabs[tabIndex].title == 'О разделе') {
					if ($('#ico_put_control').length != 0)
						this.main.icons.disable('put_control');
				}
				else {
					if ($('#ico_put_control').length == 0 && this.main.listDocument.isListDocuments() == true)
						this.main.icons.active('put_control');
				}
			}
			
			if (this.docArea == 1) {
				if (this.controlDoc == false && this.main.listDocument.isListDocuments() != true) {
					if ($('#ico_put_control').length == 0)
						this.main.icons.active('put_control');
				} else if ($('#ico_put_control').length != 0) {
					this.main.icons.disable('put_control');
				}
				if (this.controlDoc == true && this.main.listDocument.isListDocuments() != true) {
					if ($('#ico_remove_control').length == 0)
						this.main.icons.active('remove_control');
				} else if ($('#ico_remove_control').length != 0) {
					this.main.icons.disable('remove_control');
				}
			}
		}
	
		if (this.longDocument.isLongDocuments(tabIndex)) {
			this.longDocument.setNd(this.nd);
			this.longDocument.lock = false;
			var after = function () {
				self.findMarker();
			};
			this.longDocument.init(body.get(0), false, false, after);
			body.scroll(function () {
				self.longDocument.init(this, true, false);
			});
			if (window.mobile){
				self.intervalIdLD = setInterval(function(){
					var el = body.get(0);
					console.log('el',el);
					nd = null;
					if (el.id) {
						var arr = el.id.split('_');
						if (arr && arr.length == 2) nd = arr[1];
					}
					if (self.nd == nd) self.longDocument.init(el, true, false);
					else clearInterval(self.intervalIdLD);
				},1000);
			}

			if (window.mobile) {
				body.bind('touchend', function (e) {
					self.longDocument.init(this)
				});
			}

			this.main.resize.set('document', function () {
//			console.log('resize doc');
				if ($('.document.activeDoc .longDoc').length > 0) {
					self.longDocument.ctrlOffset(body.get(0));
					self.longDocument.init(body.get(0));
				}
			});
			return;
		} else {
			body.scroll(function () {
				self.saveOffset(body);
			});
			
			this.main.resize.set('document', function () {
				self.restoreOffset(body);
			});
		}
	
		this.main.resize.set('document', null);
		if (this.djvu.isDjvu()) {
			this.main.tabs.getActiveTab().contentType = 'djvu';
			this.djvu.init();
			this.djvu.showPanel();
			this.initHelpByOid(true, 'document_graf', this.nd);
			//this.djvu.loadDjvuMarking();
			return;
		}
		
		if (this.main.listDocument.isListDocuments()) {
			//this.main.listDocument.scrToItem=null;
			this.main.listDocument.init(null, function () {
				self.main.progress.stop();
				self.rewriteHistory();
			});
			return;
		}

		if (window.isEda) {
			this.main.eda.startEdit();
		}
	
		var mark = $('[id=mark]');
		if (mark.length > 0) {
				body.scrollTo(mark, 0, { offset: { top: -50, left: 0} });
				this.restyleMark(mark);
		}

		self.tms = true;
		body.scroll(function () {
			if (self.tms) {
				//console.log('self.tms = false;');
				self.tms = false;
				self.rewriteHistory();
				setTimeout(function () {
					self.tms = true;
					//console.log('self.tms = true;');
				}, 200);
			}
		});
		
		this.main.listDocument.scrToItem = null;
	}

	this.setHeight = function(body,scrollBlock){scrollBlock
		if (body && scrollBlock && scrollBlock.length && body.hasClass('narrowPage') && scrollBlock.find(".productPage").length == 0){
			if ($.browser.msie && $.browser.version < 9){ 
				scrollBlock.css('max-width','843px');
			}
			scrollBlock.css('height','auto');
			var h1 = scrollBlock.height();
			var h2 = body.height();
			if (h1 < h2) scrollBlock.height(h2);
		}
	}

	this.rewriteHistory = function (add) {
		var self = this;
		if (this.rhLock != null)
			return;
		if (typeof kApp != 'undefined' && $('.linkedto', $('#tabBody_' + kApp.tabs.active)).length > 0) {
			return;
		}
	
		var st = this.saveState();
		var link = null;
		var nd = this.nd;
		link = new LinkHistory();
		link.rnd = Math.random();
		this.main.restore.setDoc(nd,st,link);
		if ((st != null) && self.doc_info){
			var list = self.list;
			var tabId = st.tab;
			var params = utils.clone(this.params);
			st.tab=false;
			link.title = self.doc_info.title; 
			//console.log('ND:'+nd);
			link.action = function(){
				self.open(nd, true, params, function(){
					self.restore(st);
				},list,null,null,tabId);
			};
			if (!add){
				this.linkHistory = this.main.history.rewrite(link);
			}else{
				this.linkHistory = this.main.history.add(link);
			}
		}
	}
	
	this.saveState = function(){
		var state= {
			scroll:null,
			search:null,
			tab:null,
			page: null,
			params: this.params,
			listId:this.main.listDocument.active
		};
		
		state.tab = this.main.tabs.active;
		var textBody = this.activeText();
		if (textBody.length==0) {
			this.state=state;
			return state;
		}
		
		var parts=this.longDocument.findPart(textBody.get(0),true);
		
		var part = parts[0];
		var disp = null;
		if (parts.length>0 && part != null && part.id){
			
			for (var i in parts){
				var parent = $(parts[i]).parent();
				if (parent.hasClass('scrollBlock')){
					parent=parent.parent();
				}
				var d = parent.get(0).scrollTop - parts[i].offsetTop + 75;
				if (Math.abs(d)<Math.abs(disp) || disp==null){
					disp = d;
					part = parts[i];
				}
			}
			
			var p = $(part).parent();
			if (p.hasClass('scrollBlock')){
				p=p.parent();
			}
			
			var disp =p.get(0).scrollTop - part.offsetTop + 75;
			state.scroll={'part':part.id ,disp:{offset: {top:disp, left:0} }}
			
		}else{
			state.scroll={'top':textBody.get(0).scrollTop}
		}
		
		if (this.textSearch.context!=null){
			state.search = {
				type:this.textSearch.getType(),		
				context:this.textSearch.context		
			}
		}
		
		if (this.djvu.isDjvu()) {
			state.page = this.djvu.page;
		}
		
		this.state=state;
		return state;
	}
	
	this.getTopElementId = function() {
		var self = this;
		var parentElem = $(".longDoc");
		var partsArr = null;
	
		if (parentElem.length == 0) {
			parentElem = $('.activeDoc > .text');
			partsArr = [parentElem];
		}
		else {
			var longDoc = this.main.document.longDocument;
			partsArr = longDoc.findPart($('.longDoc').get(0),true);
		}
		if (parentElem.length == 0) return "";
		
		var topP = $('p:eq(0)', partsArr[0]);
		if (topP.length <= 0) return "";
		var minTop = this.main.list.offsetTop( topP.get(0), parentElem);
		var minId = $('p:eq(0)', partsArr[0]).attr('id');
		for (curPart in partsArr) {
			$('p', partsArr[curPart]).each(function() {
				var curTop  = self.main.list.offsetTop( $(this).get(0), parentElem)
				var curId = $(this).attr('id');
	
				if ( (minTop < 0 && curTop >=0) ||
				     (curTop >= 0 && curTop < minTop) ) {
					minTop = curTop;
					minId = curId;
				}
			});
		}

		return minId;
	}
	
	
	this.restore = function(state){
		var self=this;
		var callback = function(tabIndex){
			var after = function(){
				//self.main.progress.start('document');
				if (tabIndex){
					$('.tabBody .document').removeClass('activeDoc');
					$('#tabBody_' + tabIndex + ' .document').addClass('activeDoc');
				}
				
				if (state.page) {
					//self.djvu.loadPage(state.page);
					//self.djvu.setPage(state.page);
					self.main.iSearch.currentDjvuPage = state.page+1;
					self.main.document.djvu.setPageDocument(state.page+1);
				}
				
				if (state.selection) {
					if (state.selection.node) {
						var node = $('#'+state.selection.partId + ' > ' + state.selection.node.name).eq(state.selection.node.idx);
						node.before('<a id="mark" name="mark" title="Закладка" />');
					} else {
						var node = $('#'+state.selection.partId);
						if (state.selection.offset) {
							var html = node.html();
							html = html.substr(0, state.selection.offset)+
								'<a id="mark" name="mark" title="Закладка" />'+
								html.substr(state.selection.offset, html.length-1)
							node.html(html);
						}
					}
					$('.text').scrollTo('#mark');
					//return;
				}
				
				if (state.scroll){
					var textBody= self.activeText(); //$('#workspace .tabBody:visible .text');
					if (state.scroll.part){
						self.scrollToPart(state.scroll.part, function(){
							if (self.longDocument.isLongDocuments()) {
								self.longDocument.init(textBody.get(0));
							}
						},state.scroll.disp
						);
						
					}
					if (state.scroll.top){
						//console.log('SCROLLLL');
						//console.log(textBody);
						//console.log('- - - - - -');
						
						textBody.scrollTo(state.scroll.top, null, {
							onAfter:function(){
								if (self.longDocument.isLongDocuments()) {
									self.longDocument.init(textBody.get(0));	
								}
							}
						});
					}
				}
				
				self.ready();
		
			}
			if (state.search){
//				self.textSearch.setType();
				self.textSearch.open();
				self.textSearch.find(state.search.context,false,after,null,state.search.type);
			}else{
				after();
			}
			
		}
		
		if (state.listId!=null) {
			self.main.listDocument.scrToItem = state.listId;
		}
		
		if (state.tab !=false) {
			$('.tabBody').remove();
			var tab = state.tab ? state.tab : '0';
			this.main.tabs.openTab(tab,callback);		
		}else{
			callback();
		}
	}
	
	this.markTransition = function(nd,params){
		var self=this;
		var re = new RegExp("(\\d+)&prevdoc=(\\d+)");
		if (params) {
			var value = params[0].split('point=');
			if (re.test(nd)) {
				var match = re.exec(nd);
				if (match != null && match[1] == match[2]) {
					var callback = function(){
						self.initContent();
					}
					this.reload({
						key: 'point',
						value: value[1]
					}, callback);
					return true;
				}
			}
		}
		return false;
	}

	this.getVisiblePart = function(){
		var list = this.activeText(' > p');
		if (list.length==0){
			list = this.activeText(' > div');
		}
		list.each(function (i) {
			if (this.id && /P[\n]+/.exec(this.id)){
				return this.id;	
			}
		});
		return null;
	}
	
//	this.scrollToPart = function(element){
//		if (this.longDocument.isLongDocuments()) {
//			this.longDocument.scrollToPart(element)
//		}else{
//			$('#workspace .tabBody:visible').scrollTo(element);
//		}
//	}

	this.hideReferent = function(element){
		element=$(element);
		var list = element.next();
		if (list.hasClass('referentList')){
			list.slideUp(600);
			element.removeClass('referentClose');
			element.addClass('referent');
			return true;
		}
		return false;
	}
	
	this.showReferent = function(element){
		element=$(element);
		var list = element.next();
		if (list.hasClass('referentList')){
			element.removeClass('referent');
			element.addClass('referentClose');
			list.slideDown(600);
			return true;
		}
		return false;
	}
	
	this.openReferent = function(element) {
		var self=this;
		if (this.showReferent(element)==false) {
			element=$(element);
			var title=element.attr('title');
			var nd=element.attr('nd');
			var mark=element.attr('mark');
			$.ajax({ // 
				url: this.main.path.URL_DOCUMENT_REFERENT,
				dataType : 'html',
				data : 'id=id&mark='+mark+'&nd='+nd,
				success: function (html_content) {
					element.after(html_content);
					self.showReferent(element.get(0))
				}
			});
		}
	}
	
	this.referentListRewriteHistory = function(){
	}
	
	this.isReferentList = function(){
		if ($('.linkedto').length>0){
			return true;
		}
		return false;
	}
	
	this.openReferentList = function(params,title,history,tabId,listId,stateList) {
		var self = this;
		if (tabId==null){
			tabId=0;
		}
	
		$('#icons .document_find').hide();
		$('#icons .tContent').hide();
		$('#icons .hide_notes').hide();
		$('#icons .show_notes').hide();

		var link;
		if (history == null) {
			link = new LinkHistory(title, 'list', function(){
				self.openReferentList(params, title, true);
			});
			if(params.similar_texts == null){
				this.main.history.add(link);
			}
		};
		$.ajax({
			url:		'linkedto_result',
			data:		params,
			dataType:	'json',
			type:		'get',
			success: function (json) {
				if (json) {
					if (json.err) {
						self.main.progress.stop();
						alert(json.err);
						return;
					}
					if(json.tabs.length == 0 && params.similar_texts){
						self.main.progress.stop();
						self.showAlert("<br><span style='font-size:0.9em;'>Не удалось найти документов с текстом, подобным выделенному фрагменту. Попробуйте выбрать для поиска другой фрагмент.</span><br><br>", "Подобные документы не найдены");
						return;
					}
					if(params.similar_texts){
						self.main.history.add(link);
					}
					for (var i in json.tabs) {
						var tab = json.tabs[i];
						tab.urlParams = 'linkedto_list?tab=' + tab.id + '&nd=' + params.nd + '&mark=' + params.mark;
						if(params.similar_texts){
							tab.urlParams += '&similar_texts=true';	
						}
					}
					self.openReferentListSuccess(json, tabId, params.similar_texts)
				}
			}
		});
	}

	this.openReferentListSuccess = function(json, tabId, similar_texts) {
		var self = this;
		$('#icons > span').not('#ico_print').not('#ico_save').remove();		 
		this.stateLinkedTo = json;
		for (var i in json.tabs) {
			var tab = json.tabs[i];
			tab.callback = function(){
				var tabId = self.main.tabs.active;
				var list = $('.docList',$('#tabBody_'+tabId));
				if (json.tabs[tabId].listId!=null){
					if (list.length==1){
						list.attr('id','docList_'+json.tabs[tabId].listId);		
					}
				}
				list.addClass();
				
				self.main.listDocument.init(null,function(){
					self.main.progress.stop();
					json.tabs[tabId].listId = self.main.listDocument.active;
					self.rewriteHistoryLinkedTo(null, similar_texts);
				});
			};
		}
		
		self.main.tabs.setTabs(json.tabs,function(){
			var list = $('.linkedto',$('#tabBody_'+self.main.tabs.active));
			if (list.length>0){
				self.main.listDocument.init();
			}
			self.rewriteHistoryLinkedTo(null, similar_texts)
		});
		self.main.tabs.openTab(tabId);
	}

	this.rewriteHistoryLinkedTo = function(add, similar_texts){
		if ($('.linkedto',$('#tabBody_'+kApp.tabs.active)).length==0){
			return;
		}	
		var title = (similar_texts == true) ? 'Подобные документы' : 'На раздел ссылаются документы...';
		var self = this;
		var tabId = this.main.tabs.active;
		var json = null;
		json = this.stateLinkedTo;
	
		if(add){
			var tabId = self.main.tabs.active;
		
			var list = $('.docList',$('#tabBody_'+tabId));
			json.tabs[tabId].listId = utils.getId(list.attr('id'));
		
		}
		
		var link = new LinkHistory(title, 'list', function(){
			self.openReferentListSuccess(json,tabId);
		});
		this.main.history.rewrite(link);	
	}
	this.openWinReferent = function(element){
		var self=this;
		self.main.progress.start();
		element=$(element);
		var title=element.attr('title');
		var nd=element.attr('nd');
		var mark=element.attr('mark');
		this.openReferentList({nd: nd, mark: mark},title);
	}

	this.findMarker = function(){
		var mark = $('.activeDoc a#mark');
		if (mark.length) {
			$('.activeDoc .text').scrollTo(mark,0,{offset: {top:-50, left:0}});
			this.restyleMark(mark);
		}
	}
	this.initHelp = function(part, element, nd, unsuccessfull){
		if (part == null){
			part = 'root';
		}
		var self = this;
		var result;

		gethelp_url = this.main.path.URL_HELP+'?getoid&id='+part;
		$.ajax({ 
			url : gethelp_url,
			type : 'get',
			dataType : "json",
			success : function(json) {
				result = self.initHelpByOid(json.success,json.oid, nd,element,unsuccessfull);
			}
		});	
		return result;
	}
	this.initHelpByOid = function(success, name, nd, element, unsuccessfull) {
		var oid = this.main.help.getHelpIdByName(name,nd);
		if(oid) {
			var helplink = $('#helpLink,#helpLink2');
			if (success == true) {
				var url = utils.setUrlParam(document.location.href,'nd',oid);
				url = utils.setUrlParam(url,'help','true');
				url = url.replace('#', '');
				if (null == element) {
					helplink.attr('href', url).attr('target', '_blank');
					helplink.unbind('click');
					helplink.bind('click', function(){
						window.open(url, 'help');
						return false;
					});
				} else {
					$(element).attr('href', url).attr('target', '_blank');
				}
				result = true;
			} else {
				if (unsuccessfull != null) {
					helplink.bind('click', function(){
						unsuccessfull();
						return false;
					});
				}
				result = false;
			}
		}
	}
	this.ctrlTestDB = function() {
		var self = this;
		$.ajax({ 
			url : self.main.path.URL_CHECK_TEST_DB,
			type : 'get',
			dataType : "json",
			success: function(json){
				if (json.success){
					self.isTestDB=true;
					self.main.help.getHelpIdByName(self.main.help.volume,self.nd);
				}else{
					self.isTestDB=false;
				}			
			}, error: function(e){
				//console.error(e);
			}
		});
	}
	
	this.getSysInfoNd = function() {
		var self = this;
		$.ajax({ 
			url : self.main.path.URL_GET_SYSINFO_ND,
			type : 'get', dataType : "json", success: function(json) {
				self.sysInfoNd = json.nd;
			},
			error: function(json) {
			}
		});
	}

	this.getRegInfo = function() {
		var self = this;		
		$.ajax({ 
			url : self.main.path.URL_GET_REGINFO,
			type : 'get', dataType : "json", success: function(json) {
				 self.RegInfo.RegNumber = json.RegNumber,
				 self.RegInfo.Protect   = json.Protect,
				 self.RegInfo.Network   = json.Network,
				 self.RegInfo.Intranet  = json.Intranet
			},
			error: function(json) {
			}
		});
	}
	
	this.hidePanels = function(){
		$('.webkit_scroll_fixed').css('visibility','hidden');
		$('#header').hide();
		$('#tabs').hide();
		$('#hideForm').hide();
		$('#container').css('padding-top', '21px');
		$('#icons').css('top', '0')
	}
	
	this.clickHelpLink = function() {
		var self = this;
		//$('#helpLink').live('click', function() {
			tooltip = self.main.tooltip;
			$.ajax({
				url: self.main.path.MSG_HELP_NOTFOUND__TOOLTIP,
				dataType: "html",
				type: "get",
				success: function(html){
					tooltip.create($('#iSearchBtn').parent(), html, 1500, 'helpNotFound');
				}
			});
			return;
		//})
	}
	
	this.documentNotFound = function() {
		var self = this;	
		var tooltip = self.main.tooltip;
		
		$.ajax({
			url: self.main.path.MSG_DOCUMENT_NOT_FOUND,
			dataType: "html",
			type: "get",
			success: function(html){
				tooltip.create($('body'), html, 3000, 'documentNotFound');
				tooltip.setCenter($('.documentNotFound'));
			}
		});
		return;
	}
	
	
	
	this.goTo = function(element, tab, callback){
		var self = this;
		var part;
		var jEl = $(element)
		jEl.addClass('selected');
		$('.gthlight').removeClass('gthlight');
		jEl.parent().addClass('gthlight');
		
		if (element.id) {
			var arr = utils.getId(element.id,'array');
			if (arr.length==2){
				part = arr[1];
				tab = arr[0];
			} else {
				return;
			}
		} else {
			part=element;
		}
		
		if (this.main.tabs.active == tab ){
			self.scrollToPart(part,callback, null, null, tab)
		} else {
			this.main.tabs.openTab(tab,function(){
				self.scrollToPart(part,callback, null, null, tab)
			});
		}
	}
	
	this.scrollToPart = function(element,callback, offset,forcibly, tabId){
		var self = this;
		var part = null;
		if (element.id) {
			part = utils.getId(element.id,'str');
		}else{
			part=element;
		}
		if (part){
			if (this.longDocument.isLongDocuments()) {
				this.longDocument.scrollToPart(part,offset,forcibly, tabId);
			}else{
				/P0*\w*/.part
				try {
					var scrollAfter = function(){
						if (offset){
							$('.activeDoc .text').scrollTo($('.activeDoc #' + part), 0, offset);
						}else{
							$('.activeDoc .text').scrollTo($('.activeDoc #' + part), 0,{offset: {top: -60,left: 0}});
						}
					}
					if (this.textSearch.contextForPart) {
						if (this.textSearch.contextForPart.nd && this.textSearch.contextForPart.nd!=this.nd){
							contextForPart = false;	
						}
						if (this.textSearch.contextForPart.tab && this.textSearch.contextForPart.tab!=this.main.tabs.active){
							contextForPart = false;	
						}
						var onAfter = function(){
							scrollAfter()
							if (self.textSearch.contextForPart){
								$('.activeDoc .text .match').not("[id^='"+self.textSearch.contextForPart.part+"'] .match").removeClass('match');
							}
						}
						this.reload({key:'context',value:this.textSearch.contextForPart.context},onAfter);
						
					}else{
						scrollAfter();
					}
				}
				catch (e){
					//dbg.msg('Scroll error: '+e.toString());
				}
			}
			this.initLinkTitles();
		}	
		if (callback) {
			callback();
		}

		return;
	}
	this.documentAnchorsSelect = function(element){
		var self = this
		var tab = utils.getId($(element).parents().filter('.tree.annotSearch').attr('id'));
		var query = self.textSearch.actualContext;
		if (query == null)
			query = self.textSearch.context;
		if(self.djvu.isDjvu()) {
			var gId = utils.getId($(element).attr('id'),'str');
			var rEg = gId.replace(/P/i, '');
			rEg = parseInt(rEg,16) + 1;
			
			$('p.documentAnchors', $(element).parent()).removeClass('match')
			$(element).addClass('match');
			self.djvu.getSrc();
			self.djvu.setUrlParam('context', encodeURIComponent(query));
			self.djvu.setUrlParam('strict', null);
			self.djvu.setSrc();
			self.main.document.textSearch.phraseButtonPaginator((rEg - 1));
	
			self.djvu.setPage((rEg - 1));
			self.djvu.setPageDocument(rEg);
		
		
		} else {
			var list = $('#tree .annotSearchBody .documentAnchors');
			list.removeClass('matchAnchors');
			$(element).addClass('matchAnchors');
			this.textSearch.initCrossForPhraseSearch();
	
	
			$('.match').removeClass('match');
			part = /^documentAnchors_(P\w{4,4})/.exec(element.id);
		
			var params = new Array();
			params.push({
				key: 'context',
				value: query
			});
			params.push({
				key: 'strict',
				value: 'false'
			});
			
			if (self.longDocument.isLongDocuments()) {
				self.longDocument.setStrict(false);
				self.main.document.textSearch.setContext(query, part[1], self.nd, self.main.tabs.active);
				self.main.document.longDocument.setContext(query);
				if (self.main.tabs.active == tab ){
			//		console.log(new Date());
					self.main.document.longDocument.reload($('#tabBody_'+tab+' .scrollBlock'));
				//	console.log(new Date());
					self.scrollToPart(element,null,null,true);
					setTimeout(function(){
						self.longDocument.init(self.activeText().get(0))
					},600);
				}else{
					self.main.tabs.openTab(tab,function(){
						self.main.document.longDocument.reload($('#tabBody_'+tab+' .scrollBlock'));
						self.scrollToPart(element,null,null,true);
						setTimeout(function(){
							self.longDocument.init(self.activeText().get(0))
						},600);
					});
				}
			}else{
				
				self.reload(params,function(){
					if (self.main.tabs.active == tab ){
						self.scrollToPart(element,null,null,true);
					}else{
						self.main.tabs.openTab(tab,function(){
							self.scrollToPart(element,null,null,true);
						});
					}
					
				});
			}
		}
	}

	this.closeNode = function(element){
		$(element).removeClass('close').addClass('open');
		$(element).parent().removeClass('opened').addClass('closed');
		$('ul',$(element).parent()).hide();
	}

	this.openNode = function(element){
		$(element).removeClass('open').addClass('close');
		$(element).parent().removeClass('closed').addClass('opened');
		var subTree=$('> ul',$(element).parent());
		subTree.show();
	}

	this.openDBDialog = function(element){
		var wereChanges = showModalDialog('dbcont', null, window.dbContentsDlgFeatures);	
		if (wereChanges) {
			external.Application.RefreshWindows();
		}
	}

	this.getUrlToPrint = function() {  // used for save also
		var url = null;
		var self = this;
		if (this.main.list.cntSelected && this.main.list.cntSelected>0 && this.main.list.ulSelected.filter(':visible').length){
			var list = new Array();
			var arr = null;
			$('.selected',this.main.list.ulSelected).each(function(){
				arr = utils.getId(this.id,'array')
				if (arr.length>0){
					list.push(arr[0]);
				}
			});	
			return url = this.main.path.URL_PRINT_SELECTED+'?list='+list.join(';');
		}
		var isList = this.main.listDocument.isListDocuments();
		if (isList) {
			var listSelection = this.getListSelection();
			if (listSelection && listSelection.length > 0 && $('.iSearchItem:visible').size() == 0 /*урл для истории запросов генерируется по другому*/){
				url = this.main.path.URL_PRINT_SELECTED+'?list=' + listSelection.join(';');
				return url;
			}
			var stateList = this.main.listDocument.stateList;
			var activeList = this.main.listDocument.active;
			if (activeList!=null) {
				url = stateList[activeList].url+'&part=0';
				if (stateList[activeList].filter) {
					url += '&'+stateList[activeList].filter;
				}
			}
		} else {
			url = this.main.tabs.getActiveTab().urlParams;
			if (this.main.tabs.getActiveTab().filter)
				url += '&' + this.main.tabs.getActiveTab().filter;
			
			if (this.main.document.djvu.isDjvu()) {
				url += '&page='+this.main.document.djvu.page;
			}
			else if (this.ClearTextOn) {
				url = utils.setUrlParam(url, 'clearText', '1');
		
			}
		}
		url = utils.setUrlParam(url, 'print', '1');
		
		if($('.contents').length) {
			var openItems = $('.contents span.close');
			var openItemsIds = '';
			for (var i = 0; i < openItems.length; i++) {
				var itemId = openItems[i].parentNode.id;
				openItemsIds += itemId.split('_')[1];
				if(i < openItems.length-1)
					openItemsIds +=';';
			}
			url +='&openNode='+openItemsIds;
		}
		if (this.isReport(url)) {
			url += '&isreport=1';
			if(typeof addPrintSysInfoParams != 'undefined')
				url += addPrintSysInfoParams; // Добавление параметров из информации о системе
		}
		return url;
	}

	this.getListSelection = function () {
		if (this.main.list.cntSelected && this.main.list.ulSelected.filter(':visible').length) {
			var list = new Array();
			var arr = new Array();
			$('.selected', this.main.list.ulSelected).each(function(){
				if ($('ul.foldersList:visible').length > 0 || $('ul.forHistory:visible').length > 0){
					var state = $(this).attr('state')
					arr[0] = eval('('+state+')').nd;
				} else {
					arr = utils.getId(this.id, 'array')
				}
				if (arr && arr.length > 0) {
					list.push(arr[0]);
				}
			});
			return list;
		}else {
			var selected = $('ul li.selected:visible');
			var list = new Array();
			if (selected.length > 0) {
				var arr;
				$(selected).each(function(){
					arr = utils.getId(this.id, 'array');
				});
				if (arr && arr.length > 0) {
					list.push(arr[0]);
				}
				return list;
			}
		}
	}

	this.destroyPrintIFrame = function()
	{
		// Если есть - стереть прошлый фрейм
		var oldFrame = document.getElementById("printIFrame");
		if (oldFrame) {
			var oldFrameBody = oldFrame.contentDocument.body;			
			while(oldFrameBody != null && oldFrameBody.children.length != 0)
				oldFrameBody.removeChild(oldFrameBody.children[0]);

			document.body.removeChild(oldFrame);
		}
	}

	// Возвращает true, если в текущее выделение попал input
	this.inputInSelection = function() {
		if(typeof(window.getSelectionHTML) == "undefined") return false;
		var sel = getSelection();
		var result = false;
		$('input').each(function(i, item) {
			if (sel.containsNode(item, true)) {
				result = true;
				return false;
			}
		});

		return result;
	}

	this.printThrowIFrame = function(url,headerData,headerInfo, isDjvu) {
		var self = this;
		var nd = utils.getUrlParam(url, "nd");
		var nh = utils.getUrlParam(url, "nh");
		if(isDjvu) {
			url = "djvu_out?" + (nd == null ? '' :  'nd='+nd) + 
								(nh == null ? '' : '&nh='+nh) ;
		}

		var selectionHTML = null;
		if(typeof(window.getSelectionHTML) != "undefined"){			
			var sel = getSelection();
			if (sel.type === "Range" &&  !this.inputInSelection()) {
				selectionHTML = window.getSelectionHTML(false);
			}
		}

		this.destroyPrintIFrame();
		
		var mainProgress = this.main.progress;
		mainProgress.start(null, this.destroyPrintIFrame);

		var printMainFrame = document.createElement("IFRAME");
		printMainFrame.id = "printIFrame";
		printMainFrame.style.border = "0px solid black";
		printMainFrame.style.position = "absolute";
		printMainFrame.style.top = "0px";
		printMainFrame.style.left = "0px";
		printMainFrame.style.width = "100%";
		printMainFrame.style.height = "0px";
		printMainFrame.style.display = "block";
		printMainFrame.onload = function(){ 
			
			var escSym = function(c) {
				var result = '\\u';
				var hexVal = c.charCodeAt(0).toString(16);
				for (var i = 0; i < 4 - hexVal.length; ++i) {
					result += '0';
				}
				result += hexVal;
				return result;
			}
			
			var escString = function(str) {
				if(str == null)
					return "";

				var res = "";
				for(var i=0;i<str.length;i++) {
					res += escSym(str.charAt(i)); 
				}
				return res;
			}

			var checkLoad = function() {
				if(HLoaded && FLoaded) { // Ждем пока загрузятся все iFrame колонтитулов - потом грузим основной документ
					if(isDjvu) {
						// IFrame DJVU
						var printFrameDoc = document.createElement("IFRAME");
						printFrameDoc.id  = "printKodeksFrameDJVU";
						printFrameDoc.src = url;
						printFrameDoc.style.display = "none";
						printFrameDoc.onload = function() {
							mainProgress.stop();
							printIFrame.contentWindow.print(); // DJVU сам себе не вызовет window.print(). Печатаем главный фрейм
						}						
						printIFrame.contentDocument.body.appendChild(printFrameDoc);
					}
					else if (selectionHTML) {
						var docContent = selectionHTML;

						// IFrame документа для печати
						// Созданный фрейм должен сам вызвать window.print()
						var printFrameDoc = document.createElement("IFRAME");

						// По-умолчанию, создается iframe без DOCTYPE, но с пустым DOCTYPE не подхватываются некоторые стили
						printFrameDoc.id  = "printKodeksFrameDoc";
						printIFrame.contentDocument.body.appendChild(printFrameDoc);
						printFrameDoc.contentWindow.document.open();
						printFrameDoc.contentWindow.document.write(
							'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">' +
							'<html xmlns="http://www.w3.org/1999/xhtml" lang="ru" xml:lang="ru"><head></head><body>' +
							docContent + 
							'</body></html>'
						);
						printFrameDoc.contentWindow.document.close();

						mainProgress.stop();
						printFrameDoc.contentWindow.print();

					} else {
						// IFrame документа для печати
						// Созданный фрейм должен сам вызвать window.print()
						var printFrameDoc = document.createElement("IFRAME");
						printFrameDoc.id  = "printKodeksFrameDoc";
						printFrameDoc.style.width = "100%";
						printFrameDoc.src = url;
						printFrameDoc.onload = function() {
							mainProgress.stop();
							printFrameDoc.contentWindow.print();
						}
						printIFrame.contentDocument.body.appendChild(printFrameDoc);
					}
				}
			}

			// Внесение <div> элемента с информацией о документе
			var printIFrame = document.getElementById("printIFrame");
			var colontitleInfoDiv = document.createElement("div");
			colontitleInfoDiv.id = "printInfo";
			var strResult = "";
			for(var i in headerInfo) {
				strResult += '<span whatreplace="$'+i+'" title="'+escString(headerInfo[i])+'">'+escString(headerData[i])+'</span>\n';
			}
			colontitleInfoDiv.innerHTML = strResult;
			printIFrame.contentDocument.body.appendChild(colontitleInfoDiv);
		
			var docLoaded = false;
			var HLoaded   = false;
			var FLoaded   = false;

			// Создание IFrame-ов конлонтитулов
			var printFrameH = document.createElement("IFRAME");
			printFrameH.id = "kHeader";
			printFrameH.src = "content_templates/printHeader.html";
			if (self.ClearTextOn) {
				printFrameH.src += '?clear_text=1';
			}
			printFrameH.onload = function(){ 
				HLoaded = true; checkLoad();
			}
			printIFrame.contentDocument.body.appendChild(printFrameH);

			var printFrameF = document.createElement("IFRAME");
			printFrameF.id = "kFooter";
			printFrameF.src = "content_templates/printFooter.html";
			printFrameF.onload = function(){ 
				FLoaded = true; checkLoad();
			}
			printIFrame.contentDocument.body.appendChild(printFrameF);

		}
		document.body.appendChild(printMainFrame);
	}
	
	this.printFromBrowser = function(url,headerData,headerInfo) {
		if (utils.isLocal())
			return;
			
		if (!url){
			var url = this.getUrlToPrint();
			if($.browser.msie) {
				url = encodeURI(url);
			}
		}
		
		var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
		var is_safari = navigator.userAgent.indexOf("Safari") > -1;
		
		if(is_chrome && is_safari) { // Chrome
			this.printThrowIFrame( url, headerData, headerInfo, false); // DJVU печатается простой картинкой
		} else {
			window.open(url);
		}
	}

	this.saveFromBrowser = function(url, html, openWord) {
		if (utils.isLocal() && !utils.isKBrowser())
			return;

		var POST_URL    = {};
		var POST_PARAMS = {};
		POST_PARAMS.url = "";
		var title       = this.getTitleForSave();
		var filename    = '';
		
		if (!url){
			var listSelection = this.getListSelection();
			if (listSelection && listSelection.length > 0 && $('.iSearchItem:visible').size() == 0 /*урл для истории запросов генерируется по другому*/) {
				title = utils.strCrop(this.main.history.list[this.main.history.active].title); //title = utils.strCrop(this.doc_info.title);
				//для СА делаем спец. title аналогичный код записал в getTitleForSave
				if (title == "Судебный Аналитик") {
					title = "Поиск в Судебном Аналитике";
				} else if(title != "Поиск в Картотеке НТИ"){ //и для НТИ
					title += '_' + this.main.tabs.getActiveTab().title;
				}
				title = title.replace(/[\^!;?~"@#&<>\/]/g, '');
				var url = 'list_export?list=' + listSelection.join(';');
				POST_URL = this.main.path.URL_SAVE_SELECTED;
				POST_PARAMS.url = url;
			} else {
				var url = this.getUrlToPrint();
				POST_URL = this.main.path.URL_DOCUMENT_SAVE;
				POST_PARAMS.url = encodeURI(url);
			}
		} else {
			filename = this.getFilenameFromUrl(url);
			POST_URL = this.main.path.URL_DOCUMENT_SAVE;
			POST_PARAMS.url = encodeURI(url);
			if (filename.length > 0)
				POST_PARAMS.filename = filename;
		}

		var ua = navigator.userAgent.toLowerCase();
		var isChrome = /chrome/.test(ua);
		var isKBrowser = /kodeks/.test(ua);
		var isSafari = /safari/.test(ua);
		var translate = 0;
		
		if(this.main.tabs.active != null)
			var fn_suffix = this.main.tabs.tabs[this.main.tabs.active].title;

		if (this.isOriginalForm == 'file'){ //бага с попаданием выделенного html при выгрузке в word, что приводит к падению
			html = null;
		} else if (html && html.length > 0) {
		    html = '<html><head></head><body>' + html + '</body></html>'
			POST_PARAMS.html = html;
		}
		
		if (this.isDocument()) {
			if (html) {
				var tmpElem = document.createElement('span');
				tmpElem.innerHTML = html;
				POST_PARAMS.maxWidth = this.getMaxWidth(tmpElem);
			}
			else {
				POST_PARAMS.maxWidth=this.getMaxWidth($('.scrollBlock')[0]);
			}
		}

		POST_PARAMS.save            = "1";
		POST_PARAMS.translate       = translate;
		POST_PARAMS.title           = title;
		POST_PARAMS.filename_suffix = fn_suffix;

		if (this.djvu.isDjvu())
			POST_PARAMS.djvu = 'true';

		if (this.isDocument()) {
			if (!this.djvu.isDjvu())
				POST_PARAMS.maxWidth = this.getMaxWidth($('.scrollBlock')[0]);
			else {
				POST_PARAMS.maxWidth = '0';
				if (this.djvu.getRatio() > 1) 
					POST_PARAMS.isDjvu = 'lands';
				else 
					POST_PARAMS.isDjvu = 'portr';
			}
		}

		if (utils.isKBrowser() && openWord)
			POST_PARAMS.toword = "1";

		//================================
		// Сделать POST запрос
		//================================
		function post_to_url(path, params) {
			var form = document.createElement("form");
			form.setAttribute("method", "post");
			form.setAttribute("action", path);

			for(var key in params) {
				if(params.hasOwnProperty(key)) {
					var hiddenField = document.createElement("input");
					hiddenField.setAttribute("type", "hidden");
					hiddenField.setAttribute("name", key);
					hiddenField.setAttribute("value", params[key]);

					form.appendChild(hiddenField);
				}
			}
			document.body.appendChild(form);
			form.submit();
		}
		
		if (false/*isSafari*/) {
			var fname = POST_PARAMS.filename;
			if (!fname) {
				fname = POST_PARAMS.title + (POST_PARAMS.djvu ? '.tif' : '.rtf');
			}
			if (fname) {
				POST_URL += '/' + encodeURIComponent(fname);
			}
		}
		
		post_to_url(POST_URL, POST_PARAMS);
	}

	this.print = function (url) {
		if (this.checkUnPrint() == true) {
			return;
		}
		var el = this;
		if (utils.isKBrowser()) {
			this.getAnnotPrint(this.nd);  // this *must*	be synchronous query (in KBrowser PrintDoc
			// do not work if called from asynchronous ajax callback)
			this.printReady(url, el);
		} else {
			var self = this;
			this.getAnnotPrint(self.nd, function () { self.printReady(url, el); });
		}
	}

	this.printReady = function(url,el){
		var self = this;
		if (!utils.isKBrowser() && !utils.isLocal() &&  this.djvu.isDjvu() && el!=null){
			self.printDlg(el,function(){
				self.printPage(url);
			});
			return;
		}
		this.printPage(url);
	}
	
	this.printPage = function(url) {
		var parts = this.getPrintParts(false, url, false);
		var fullTitle = this.main.history.list[this.main.history.active].title;
		
		if (this.doc_info!=null) {
			var title =  this.doc_info.title!= null ? '<p>' + this.doc_info.title + '</p>'  : '';
			var info  =  this.doc_info.info != null ? '<em>'+ this.doc_info.info  + '</em>' : '';
		}
		
		if (!fullTitle || fullTitle == '') {
			fullTitle = title + info;

			if (!fullTitle || fullTitle == '')
				fullTitle = this.getTitleForSave();
		}
		
		var listSelection = this.getListSelection();
		if (listSelection && listSelection.length > 0 
				&& $('.iSearchItem:visible').size() == 0 /*урл для истории запросов генерируется по другому*/
				&& !$('#tree ul.historyTree:visible').length && !$('#tree ul.FoldersTree:visible').length/*история и папки печатаются по-другому */) {
			if ($('#main .list.table').size() != 0)	{
				//"Табличные" списки (из "Указатель стандартов России". Бд 8853, 88531)
				for (var i = 0; i < parts.length;i++){
					parts[i].URL += '&list=' + listSelection.join(';');
				}
			} else {
				//"Обычные" списки
				for (var i = 0; i < parts.length;i++){
					parts[i].URL = 'list_export?list=' + listSelection.join(';');
				}	
			}
		}

		if (info == null || info == '')
			info = this.warning;
		
		var date = new Date();
		var d = date.getDate();
		var m = date.getMonth() + 1;
		var y = date.getFullYear();
		var dateStr = '' + d + '/' + m + '/' + y;
		
		var headerData = {
			n: title,
			m: (this.annotInfo) ? this.annotInfo : fullTitle,	//annotInfo заполняется при вызове getAnnotPrint
			s: (this.annotStatus) ? this.annotStatus : '',	      //annotStatus заполняется при вызове getAnnotPrint
			a: info,
			d: dateStr,
			k: utils.productName
		}
				
		var headerInfo = {
			n: 'Краткое наименование',
			s: 'Статус документа',
			m: 'Полное наименование',
			a: 'Информационная строка',
			d: 'Текущая дата',
			k: 'Название продукта'
		}

		if (!utils.isLocal() && !utils.isKBrowser()) {
			this.printFromBrowser(url,headerData,headerInfo);
			return;
		}
		
		// Печать К-Клиента
		if (!url)
			var url = this.getUrlToPrint();
			
		this.printThrowIFrame( url, headerData, headerInfo, this.djvu.isDjvu() );		
	};

	this.getAnnotPrint = function (nd, callback) {	
		var self = this;		

		var printUrl = this.getUrlToPrint();
		if (printUrl.indexOf('list') != -1) {
			self.annotInfo = null;
			self.annotStatus = null;
			if(!utils.isKBrowser() && callback != null)
				callback();
			return;
		}

		if (!utils.isKBrowser()) {
			if (callback == null || nd == null)
				return;
			if (this.annotInfo != null ||
				!this.main.document.isDocument()) {
				callback();
				return;
			}
		} else {
			if (this.annotInfo != null) {
				return;
			}
		}
		
		this.main.progress.start();
		
		var asyncType = true;
		if (utils.isKBrowser())
			asyncType = false;   // *must* be synchronous query
		
		$.ajax({
			url: 'get_printannot',
			dataType : "json",			
			async :  asyncType,
			data : {
				nd:this.nd
			},
			type : "get",
			success: function (json) {
				self.main.progress.stop();
				self.annotInfo = json.annot;
				self.annotStatus = json.status;
				if (!utils.isKBrowser())
					callback();
			},
			error: function () {
				self.main.progress.stop();
			}			
		});
	}


	//Копипаста из wtlbrowser\res\isWideDoc.js. Нужно что-нибудь придумать.
	this.getMaxWidth = function(root) {
		var sizeInPx = function(inp) {
			var em2pxRatio = 16;
			var reEm = /(\d+(\.\d+)?)em/i;
			var rePx = /(\d+(\.\d+)?)px/i;
			if (reEm.test(inp)){
				var reres = reEm.exec(inp);
				if (reres == null) return 0;
				var sizepx = parseFloat(reres[1]) * em2pxRatio;
				return sizepx;
			}
			else {
				var reres = rePx.exec(inp);
				if (reres == null) return 0;
				var sizepx = parseFloat(reres[1]);
				return sizepx;
			}
		}

		var getMaxWidth = function(root) {
			if (root == null)
				root = document;

			var maxWidth = 0;

			var tables = root.getElementsByTagName('table');

			for (var i = 0; i < tables.length; ++i) {
				var curWidth = 0;
				
				var trs = tables[i].getElementsByTagName('tr');
				var tds = trs[0].getElementsByTagName('td');
				for (var j = 0; j < tds.length; ++j) {
					curWidth += sizeInPx(tds[j].style['width']);
				}

				if ( curWidth > maxWidth )
					maxWidth = curWidth;
			}

			var imgs = root.getElementsByTagName('img');

			for (var i = 0; i < imgs.length; ++i) {
				var curWidth = 0;
				if (window.getComputedStyle && typeof window.getComputedStyle == 'function' && window.getComputedStyle(imgs[i])){
					curWidth = sizeInPx(window.getComputedStyle(imgs[i]).width);
				}
				
				if ( curWidth > maxWidth )
					maxWidth = curWidth;
			}

			return maxWidth;
		}
		return getMaxWidth(root);
	}

	this.escapeFileName = function (str, tabTitle) {
		str = str + '';
		if (str.length > 100){
			str = str.substring(0, 100);
			var pos = str.lastIndexOf(' ');
			if (pos > 10)
				str = str.substring(0, pos);
			str = str + '...';
		}
		str += tabTitle;
		return str.replace(/[\/\\\|\&\"\<\>\:\*\n\r]/g, '');
	}
	
	//Если saveImgs == true, то изображения, попавшие в выделение, сохраняются
	//пользователю на компьютере во временную папку. В результирующем выделении
	//ссылки меняются на новые изображения
	this.getSelectionText = function(saveImgs) {
		var isDjVu = this.djvu.isDjvu();
		
		if (typeof(saveImgs) == "undefined") {
			saveImgs = true;
		}
	
		if(typeof(window.getSelectionHTML) != "undefined"){
			var sel = getSelection();
			if (sel.type === "Range" &&  !this.inputInSelection()) {
				var html = getSelectionHTML(saveImgs);

				if (html && !this.main.iSearch.focus && !isDjVu) {
					return html;
				}
			}
		}
		return "";
		
	}
	
	this.getTitleForSave = function() {
		var tabTitle;
		var title;
		
		if (this.main.tabs.active != null)
			tabTitle =	 '_' + this.main.tabs.tabs[this.main.tabs.active].title;
		else
			tabTitle =	 '';
		
		if (this.main.history.active != null)
			title = this.main.history.list[this.main.history.active].title;	/// can be also $('title').text();
		else
			title =	 '';

		//для СА делаем спец. title 
		if(title == "Судебный Аналитик"){
			title = "Поиск в Судебном Аналитике";
			tabTitle = "";
		} else if(title == "Поиск в Картотеке НТИ"){ //и для НТИ
			tabTitle = "";
		}

		title = this.escapeFileName(title, tabTitle);
		return title;
	}

	this.getFilenameFromUrl = function (url) {
		var filename = utils.getUrlParam(url, 'filename');
		if (null == filename) { // try to retrieve from url
			var match = /\?([^\/\&=]+)\&/.exec(url);
			if (match) {
				filename = match[1];
			} else if (match = /([^&\/\\\*\:"\?<>]+\.[^ \f\n\r\t\v&]{3,})/.exec(url)) {
				filename = match[1];
			} else {
				/* TOHACK obsolete sh$t */
				var formAttr = utils.getUrlParam(url, 'form_attr');
				if (null != formAttr) {
					filename = this.getTitleForSave();
					if (formAttr == 133 || formAttr == 21) {
						filename += '.xls';
					} else {
						filename += '.doc';
					}
				}
				//* TOHACK */
				else {
					alert("Cannot find filename");
					return null;
				}
			}
		}
		return filename;
	}

	this.isReport = function (url) {	// отчет ли это из sysinfo.add (url non encoded!)	
		return this.sysInfoNd && (this.sysInfoNd == utils.getUrlParam(url, 'nd'));
	}
	
	this.saveFile = function(el,inline) {
		el=$(el);
		if (inline == true) {
			var urlToSave  =
			this.main.path.URL_DOCUMENT_SAVE+'?url=' + el.attr('href') +
				'&save=1&open_directly=true';
			
			if(inline === true)
				urlToSave += '&inline=true';

			var filename = this.getFilenameFromUrl(el.attr('href'));
			if(filename && filename != '')
				urlToSave += '&filename=' + filename;

			if(typeof(title) != "undefined")
				urlToSave += '&title=' + title;
		
			// [3771] 
			// Ссылка могла быть открыта в новом окне и открывать новое окно - лишнее.
			// Если нет активной вкладки - значит документ уже был открыт в новом окне.
			// Поэтому просто откроем в текущем.
			//
			//urlToSave = encodeURI(urlToSave);
			//if(this.main.tabs.active == null) {
			//  window.parent.window.location.href = urlToSave;
			//} else {
			//  window.open(urlToSave);
			//}

			window.open(urlToSave);
		} else {
			this.save(el.attr('href'))
		}
	}
	
	this.saveNotice = function (notice, noCallback) {
		if (this.isOriginalForm && $.trim(this.main.tabs.tabs[this.main.tabs.active].title.toLowerCase()) == 'текст') {
			if (this.isOriginalForm == "file") {
				noCallback.apply(this);
				this.isOriginalForm = true;
				return true;
			}
			var notice = msg.get(notice);
			if (notice != null) {
				this.main.contextMenu.closeAll();
				this.showAlert(notice, null, null, {
					yes : function () {
						return;
					},
					no : noCallback,
					defaultButton : "last"
				});
			}
		} else {
			noCallback.apply(this);
		}
	}
	
	this.save = function(url, no_direct_run) {
		// this routine is for local version who can create documents
		if (this.checkUnPrint() == true) {
			return;
		}
		var self = this;
		if (true || utils.isLocal() || utils.isKBrowser()) {
			this.saveNotice('saveNotice', function(){
				self.saveFromBrowser(url, self.getSelectionText(false));
			});
			return;
		}
		var parts = this.getPrintParts(true, url, true);
		if (0 == parts.length)
			return;

		var filter = 'Все файлы(*.*)';
		var filename;
		if (url) {
			filename = this.getFilenameFromUrl(url);
			var match;
			if (match = /\.(\w+)$/.exec(filename)) {
				filter = 'Файлы ' + match[1].toUpperCase() + '(*.' + match[1] + ');' + filter;
				if ('EXE' == match[1].toUpperCase()) { // не запускаем EXE сразу
					no_direct_run = true;
				}
			}
		} else { // значит нажали "сохранить в файл"
			filter = 'Файлы RTF(*.RTF);' + filter;
			no_direct_run = true;
		}
	
		// указание открывать файл сразу
		// применятся только для бинарных, так что ничего особенно не проверяем (sic!)
		var open_directly = utils.getUrlParam(url, 'open_directly');
		if (!no_direct_run && (open_directly || true)) {
			var data = {url: url, open_directly: true, filename: filename};
			var callback = function(context) {
				return function(json) {
					if (json && json.type == -1) {
						context.save(url, true);
					}
				}
			};
			
			$.post(this.URL_SAVE, data, callback(this), "json");
			return;
		}

		var title;
		if (typeof(filename) !== 'undefined' && filename != null)
			title = filename;
		else
			title = this.getTitleForSave();
		
		// если сохраняем отчет, допишем к имени файла текущую дату и регномер
		for (var i in parts) {
			if (parts[i].URL && this.isReport(parts[i].URL)) {
				function addZeroToTime(i) {     return (i < 10)? "0" + i: i;     }
				var date = new Date();
				var d = addZeroToTime(date.getDate()); 
				var m = addZeroToTime(date.getMonth() + 1);
				var y = date.getFullYear();
				var h = addZeroToTime(date.getHours());
				var min = addZeroToTime(date.getMinutes());
				var regNum = this.RegInfo.RegNumber;
				title = "report"
				if (regNum)
					title += '_' + regNum;
				title += '_'+ y + m + d + '_' + h + min;
				filter = 'Файлы ZIP(*.ZIP);';
				break;
			}
		}

		title = title.replace(/[\/]/g,'_');
		title = title.replace(/[\\]/g,'_');
		title = title.replace(/[|]/g,'_');
		title = title.replace(/[>]/g,'_');
		title = title.replace(/[<]/g,'_');
		title = title.replace(/[*]/g,'_');
		title = title.replace(/[?]/g,'_');
		title = title.replace(/[:]/g,'_');
		title = title.replace(/["]/g,'_');

		var fileDlg = window.external.CreateFileDlg(false, 'Сохранить как', filter, title, 'save_to_file');

		fileDlg.parts = parts;
		var showPartsWidget = fileDlg.parts.length > 1;
		var isDjVu = false;
		if (showPartsWidget) {
			var names = external.CreateArray();		
			var current = 0;
			for (var i = 0; i < fileDlg.parts.length; i++){
				names[names.length] = fileDlg.parts[i].Name;
				if (fileDlg.parts[i].isPrint) {			
					current = i;				
					isDjVu = fileDlg.parts[i].isDjVu;
				}
			}
			fileDlg.onComboChanged = function() {
				var parts = fileDlg.parts;
				var part  = parts[fileDlg.comboValue];
				if (part.onActivate != null) {
					try {
						part.onActivate(parts);
					} catch (err){
					}
				} else {
					for (var i = 0; i < parts.length; i++) {
						parts[i].isPrint = (i == fileDlg.comboValue);
					}
				}
			}
			fileDlg.AddCombo('&Сохранить', names, '&Выберите части документа для сохранения');
			fileDlg.comboValue = current;
		} else {
			isDjVu = fileDlg.parts[0].isDjVu;
		}

		if (isDjVu)
			fileDlg.filter = 'TIFF (*.tif;*.tiff)';

		if (!fileDlg.Show()) {
			return;	
		}
			
		var sparts = fileDlg.parts;

		var selectedPart;
		for (var i = 0; i < sparts.length; i++) {
			if (sparts[i].isPrint) {
				selectedPart = sparts[i];
				break;
			}
		}
		if (null == selectedPart) {
			return;
		}
		// Иногда [3714] fileDlg возвращает путь без расширения. Надо проверить эту ситуацию и дописать в ручную (при необходимости).
		//if(fileDlg.filter.indexOf('*.*') == -1) { // Если допустим (*.*) - значит пропускаем проверку
			var saveFileExtension;
			if(fileDlg.file.lastIndexOf('.') != -1) // Если точка в названии есть - значит можно получить расширение
				saveFileExtension = '*'+fileDlg.file.substr(fileDlg.file.lastIndexOf('.')).toUpperCase(); // Получим его
			else // Если точки нет - значит расширения нет
				saveFileExtension = 'noExtension'; 
				
			// если нет расширения или расширение не присутствует в фильтре - значит необходимо его дописать
			if( saveFileExtension == 'noExtension' || (fileDlg.filter.toUpperCase().indexOf(saveFileExtension+';') == -1 && fileDlg.filter.toUpperCase().indexOf(saveFileExtension+')') == -1)) {
				var startExtensionsIndex = fileDlg.filter.indexOf('(')+1;
				var endExtensionsIndex = fileDlg.filter.indexOf(')');
				var extensionToWrite = fileDlg.filter.substring( startExtensionsIndex , startExtensionsIndex+endExtensionsIndex-startExtensionsIndex );
				extensionToWrite = extensionToWrite.split(';');
				fileDlg.file += extensionToWrite[0].replace('*','');
			}
		//}

		var data = { path: fileDlg.file };
		
		if (selectedPart.URL != null && selectedPart.URL != '')
			data.url = selectedPart.URL;
		else
			data.html = selectedPart.HTML;

		if (this.isReport(data.url)) { // Ссылка для отчета из sysinfo
			data.url = this.URL_SAVE+"?isreport=1"
		}

		var listSelection = this.getListSelection();
		if (listSelection && listSelection.length > 0 && $('.iSearchItem:visible').size() == 0 /*урл для истории запросов генерируется по другому*/) {
			if ($('#main .list.table').size() != 0) {
				//"Табличные" списки (из "Указатель стандартов России". Бд 8853, 88531)
				data.url += '&list=' + listSelection.join(';');
			} else {
				//"Обычные" списки
				data.url = 'list_export?list=' + listSelection.join(';');
			}
		}

		if (this.isDocument()) {
			if (data.html) {
				var tmpElem = document.createElement('span');
				tmpElem.innerHTML = data.html;
				data.maxWidth = this.getMaxWidth(tmpElem);
			}
			else {
				data.maxWidth=this.getMaxWidth($('.scrollBlock')[0]);
			}
		}
	
		$.post(this.URL_SAVE, data, function(json) {
			if (json && json.type == -1) {
				alert(json.message);
			}
		}, "json");
	}
	
	
	this.copyToWord = function () {
		var self = this;
		if (this.checkUnPrint() == true) {
			return;
		}
		this.saveNotice('wordNotice', function(){
			if (utils.isKBrowser()) {
				self.saveFromBrowser(null, self.getSelectionText(false), true);
				return;
			}
			
			var parts = this.getPrintParts(true, null, false);
			if (0 == parts.length) 
				return;	

			var title = this.getTitleForSave();
			var data = { title: title };
			
			for (var i = 0; i < parts.length; i++) {
				if (parts[i].isPrint) {			
					var listSelection = this.getListSelection();
					
					if (parts[i].URL != null && parts[i].URL != '') {
						data.URL = parts[i].URL;
					}
					else {
						data.HTML = parts[i].HTML;
					}
						
					if (listSelection && listSelection.length > 0 && $('.iSearchItem:visible').size() == 0 /*урл для истории запросов генерируется по другому*/) {
						//data.url = 'list_export?list=' + listSelection.join(';');
						if ($('#main .list.table').size() != 0)	{
							//"Табличные" списки (из "Указатель стандартов России". Бд 8853, 88531)
							data.URL += '&list=' + listSelection.join(';');
						}
						else {
							//"Обычные" списки
							data.URL = 'list_export?list=' + listSelection.join(';');
						}
					} 

					// если сохраняем отчет, допишем к имени файла текущую дату и регномер	
					if (data.URL && this.isReport(data.URL))
						data.title += this.getRepFnSuffix();
					
					//Для DJVU документов со вкладки "Документация" передается специальный флаг
					//для того, чтобы при экспорте листы автоматически переворачивались в альбомный или
					//книжный режимы для лучшего вписывания изображения
					if(this.djvu.isDjvu() === true && this.main.tabs.getActiveTab().title == 'Документация') {
						data.djvuDocTab = 1;
					}

					if (!this.djvu.isDjvu()) {
						if (data.HTML) {
							var tmpElem = document.createElement('span');
							tmpElem.innerHTML = data.HTML;
							data.maxWidth = this.getMaxWidth(tmpElem);
						} else {
							data.maxWidth = this.getMaxWidth($('.scrollBlock')[0]);
						}
					} else {
						data.maxWidth = 0;
						if (this.djvu.getRatio() > 1)
							data.isDjvu='lands';
						else
							data.isDjvu='portr';
					}
					
					$.post(this.URL_WORD, data);
					break;
				}
			}
		});
	}

	this.getPrintParts = function(save, url, allPages) {

		var res = [];
		var activeTab = this.main.tabs.getActiveTab();

		if (!url) {
			if (this.main.listDocument.isListDocuments()) {	// АП				
				url = this.main.listDocument.getActiveState().url;
				if (this.main.listDocument.getActiveState().filter) {
					url += '&' + this.main.listDocument.getActiveState().filter;
				}
				url = encodeURI(url); // necessary for IS query
				url = utils.setUrlParam(url, 'print', '1');			
			} else { // ИП
				url = activeTab.urlParams;
				if (activeTab.filter) {
					url += '&' + activeTab.filter;
				}
				url = encodeURI(url); // necessary for IS query
				url = utils.setUrlParam(url, 'print', '1');
			}
		}
		
		if (typeof addPrintSysInfoParams != 'undefined') 
			url += addPrintSysInfoParams; // Добавление параметров из информации о системе
		
		if (url.indexOf('list')!=-1 && url.indexOf('ifind_list')==-1) {
			url += '&part=0';
			this.main.document.resetInfo();
		}
		
		if($('.contents').length) {
			var openItems = $('.contents span.close');
			var openItemsIds = '';
			for (var i = 0; i < openItems.length; i++) {
				var itemId = openItems[i].parentNode.id;
				openItemsIds += itemId.split('_')[1];
				if(i < openItems.length-1)
					openItemsIds +=';';
			}
			url +='&openNode='+openItemsIds;
		}

		if (url.indexOf('ifind_list')!=-1) {
			this.main.document.resetInfo();
		}
		
//		if ('list' == activeTab.contentType) {
//			url += '&type=doclist';
//		}
		
		if (this.djvu.isDjvu()) {
			if (allPages || $('.tabBody:visible #alldjvu').length > 0)
				url += '&page=-1';
			else
				url += '&page='+this.djvu.page;
		}

		if (save) {
			url += '&save=1';
		}

		var printParts = false;
		var isDjVu = this.djvu.isDjvu();
		var docTitle = 'Документ';
		
		
		var html = this.getSelectionText(false);
		if (html.length > 0) {
			res[res.length] = {
				Name:   'Выделение',
				HTML:    html,
				BaseURL: document.URL,
				isPrint: true,				
				isTab:   false
			};
			printParts = true;
		}
		
		res[res.length] = {
			Name: docTitle,
			isPrint: !printParts,
			isTab: true,
			URL: url,
			isDjVu: isDjVu
		};

		this.selectedText = null;
		return res;
	}
	
	this.saveInfo = function(json) {
	}
	
	this.resetInfo = function() {
		this.doc_info = null;	
	}
	
	this.content_expand = function() {
		var self=this;
		var elems = $('div.contents ul:visible li span.open');
		elems.each(function (i) {
			self.openNode(elems[i]);
		})
	}
	
	this.content_collapse = function() {
		var self=this;
		var elems = $('div.contents ul:visible li span.close');
		elems.each(function (i) {
			self.closeNode(elems[i]);
		})
	}
	this.noDoc = function(self) {
		this.main.tooltip.create($(self), 'Установленные у Вас продукты не содержат этого документа. Обратитесь в сервисный центр', 150000, 'noDocument');
	}
	
	this.isDocument = function() {
		if ($('.activeDoc').length > 0) {
			return true
		}
		return false;
	}

	this.hideForm = function(callback){
		var self = this;
		$('#hideForm').fadeIn(300,callback);
		setTimeout(function(){
			self.main.resize.run('header');
		});
		this.main.tooltip.reset();
		
	
	}
	this.showForm = function(callback){
		var self = this;
		$('#hideForm').fadeOut(300,callback);
		setTimeout(function(){
			self.main.resize.run('header');
		});
		this.main.tooltip.reset();
	}
	
	this.ctrlHeaderList = function(){
		return;
		var activeDoc = $('.activeDoc');
		var panelAnnotation = $('.activeDoc .panelAnnotation');
		var headerList = $('.activeDoc .headerList');
		var height = headerList.height()+10;
		activeDoc.css('padding-top',height+'px');
		var html = '<div class="headerList" style="display:none;">'+headerList.html()+'</div>'
		headerList.remove();
		panelAnnotation.before(html);		
		var headerList2 = $('.activeDoc .headerList');
		headerList2.show();
		headerList2.css('margin-top','-'+height+'px');
	}
	this.ctrlSwfObject = function(){
		var height = $('.tabBody:visible').height()-40;
		var width= Math.round(height*8/6);
		$('.tabBody .swfObject').each(function(){
			var el = $(this);
			el.attr('height',height).attr('width',width);
			$('embed',el).attr('height',height).attr('width',width);
		})
	}
	
	this.restyleMark = function(mark){
		var parent = mark.parent();
		if (this.isMarkStyle() && parent.get(0).nodeName=='P'){
			parent.addClass('bookmark');
			mark.remove();
		}
	}
	this.isMarkStyle = function(){
		for (var item in this.params){
			if(this.params[item]=='style=bookmark'){
				return true;
			}
		}
		return false;
	}
	this.ctrlPicsTabs = function(pics,tabs){
		if (pics && pics.length==0 && tabs && tabs.length && tabs.length==1){
			this.main.tabs.hidePanel();
		}else{
			this.main.tabs.showPanel();
		}
	}
	
	this.printDlg = function(el,callback){
		var self = this;
		$.ajax({
			url: this.main.path.URL_PRINT_DIALOG,
			dataType: "html",
			type: "get",
			success: function(html){

				self.main.tooltip.createSearchTooltip($('#icons'), html, 1500, 'printDjvuDlg', false, 0);
				$('.realSize').show();
//				if (callback){
//					callback();
//				}

			}
		});
		return false;
	}
	this.mobileScroll = function(){
		if (!window.mobile) return;
		var scrollContainer = function(el){
			var res = null;
			var list = $('> div',el);
			list.each(function(){
				var el = $(this);
				if ((el.css('overflow-y') == 'auto' || el.css('overflow-y') == 'scroll') && this.scrollHeight > this.clientHeight){
					res = el;
					return false;
				}
			});
			if (res == null && list.length>0){
				res = scrollContainer(list.eq(0));
			}
			return res;
		}
		var container = scrollContainer($('.tabBody:visible'));
//		if (this.iScroll && this.iScroll.destroy){
//			this.iScroll.destroy();
	    //		}
		if (container != null) {
		    container.wrapInner('<div class="iScroller"></div>');
		    var el = $('> .iScroller', container);
		    el.append('<div style="clear:both"></div>');
		    //iScrollDispetcher.reg(el,new iScroll(el.get(0)))
		}
	}
	
	/*Функция добавления документов к контролируемым*/
	this.addToControlled = function () {
		var tab = this.main.tabs.getActiveTab();
		if (tab.ContentType == "docList") {
			this.addToControlledList(true);
			return;
		}
		if (this.main.listDocument.isListDocuments() == false && this.main.bookmarks.area == 'doc') {
			this.addToControledDoc();
		}
		else {
			this.addToControlledList(false);
		}
	}

	this.docClassesToControl = {
		'active': 'onControl',
		'inactive': 'onControlInactive',
		'project': 'onControlProject',
		'card_undefined': 'onControlCard_undefined',
		'card_active': 'onControlCard_active',
		'card_inactive': 'onControlCard_inactive'
	};
	this.getFilteredList = function () {
		var res = [];
		for (var i in this.docClassesToControl) {
			res.push('.' + i);
		}
		return $('.scroll ul li.selected').filter(':visible').filter(res.join(', '));
	}
	this.addToControlledList = function (folder) {
		var self = this;
		var list = this.getFilteredList();
		if (list.length) {
			$('div#icons').prepend('<div class="waitControlDoc">Выбранные документы ставятся на контроль</div>');
			if (folder == true) {
				var strNd = '' + utils.getNd(list.eq(0).attr('state'));
				for (var tmp = 1; tmp < list.length; tmp++) {
					strNd = strNd + ',' + utils.getNd(list.eq(tmp).attr('state'));
				};
			} else {
				var strNd = '' + utils.getId(list[0].id, 'array')[0];
				for (var tmp = 1; tmp < list.length; tmp++) {
					strNd = strNd + ',' + utils.getId(list[tmp].id, 'array')[0];
				};
			}
			
			var data = { 'type': 'ControlledDocument', 'nd': strNd };
			$.ajax({
				url: self.main.path.URL_FOLDER_ADDRECORD,
				dataType: 'json',
				type: "post",
				data: data,
				success: function (json) {
					if (json.type == (-1)) {
						// alert("Внимание! Выбранные документы на контроль НЕ поставлены!");
						self.showAlert("Выбранные документы на контроль НЕ поставлены!", "Внимание!");
					} else {
						if (json.manyDoc == true) {
							// alert("Количество документов, поставленных на контроль, превышает 500, что может замедлить работу программного комплекса");
							self.showAlert("Количество документов, поставленных на контроль, превышает 500, что может замедлить работу программного комплекса.", '');
						}
					
						if (json.result == true || json.result[0] == "<ul></ul>") {
							for (var tmp = 0; tmp < list.length; tmp++) {
								self.changeIconsToControl(list.eq(tmp));
							}
						
							if (json.manyDoc != true) {
								// alert("Выбранные документы успешно поставлены на контроль");
								self.showAlert("Выбранные документы успешно поставлены на контроль.", '');
							}
						} else if (json.result != false) {
							for (var tmp = 0; tmp < list.length; tmp++) {
								if (json.result[tmp] != 0) {
									self.changeIconsToControl(list.eq(tmp));
								}
							}
							
							//alert("Внимание! Некоторые из выбранных документов не могут быть поставлены на контроль!");
							self.showAlert("Некоторые из выбранных документов не могут быть поставлены на контроль!", "Внимание!");
						}
					}
					
					$('div.waitControlDoc').remove();
				}
			});
		} else {
			if (folder == true) {
				// alert("Внимание! Выбранные документы не могут быть поставлены на контроль!");
				self.showAlert("Выбранные документы не могут быть поставлены на контроль!", "Внимание!");
			}
		}
	}

	this.addToControledDoc = function () {
		var self = this;
		var ndDoc = (typeof (self.nd) == "number") ? self.nd : self.nd.split('&')[0];
		data = { 'type': 'ControlledDocument', 'nd': ndDoc };
		$.ajax({
				url: self.main.path.URL_FOLDER_ADDRECORD,
				dataType: 'json',
				type: "post",
				data: data,
				success: function (json) {
					if (json.type == (-1)) {
						//alert("Внимание! Документ на контроль НЕ поставлен!");
						self.showAlert("Документ на контроль НЕ поставлен!", "Внимание!");
					} else {
						if (json.manyDoc == true) {
							//alert("Количество документов, поставленных на контроль, превышает 500, что может замедлить работу программного комплекса");
							self.showAlert("Количество документов, поставленных на контроль, превышает 500, что может замедлить работу программного комплекса.", '');
						}
					
						if (json.firstDoc == true && $('#FoldersTree').length > 0) {
							$('#FoldersTree').remove();
						}
					
						self.main.icons.remove('put_control');
						self.main.icons.add('remove_control', 'document_remove_control');
						self.controlDoc = true;
						self.main.tabs.showChangedDoc(false);
						self.controlDocChanged = false;
						self.controlDocChangedList = ['<ul></ul>', '<ul></ul>']; // только поставили на контроль и изменений нет.
						self.main.tabs.createChangedDocList(self.controlDocChangedList);
						if (json.manyDoc != true) {
							//alert("Документ успешно поставлен на контроль");
							self.showAlert('Документ успешно поставлен на контроль.', '');
						}
					}
				}
		});
	}

	this.showAlert = function(txt, header, textAlign, confirm){
		var dialog = $("#dialog"), self = this, html;

		if (txt == null || txt == ''){
			return;
		}
		if ( header == null){
			header = "Уважаемый пользователь!";
		}
		if (textAlign == null) {
		    textAlign = "center";
		}
		html = '<div class="alert">'+
			'<span title="Закрыть окно" class="closeBookmarkDialog"></span>'+
			'<div class="header">'+
				'<h4 class="title">' + header + '</h4>'+
				'<p style="text-align:' + textAlign + ';">' + txt + '</p>'+
			'</div>'+
			'<div class="confirmDelete"></div>'+
		'</div>';
		dialog.html(html);
		utils.hideFlash();
		this.main.list.lock = true;
		var options = {
			autoOpen: true,
			width: 350,
			closeOnEscape: true,
			position: 'center',
			modal: true,
			draggable: false,
			close: function() {
				self.main.list.lock = false;
				$(this).dialog('destroy');
				dialog.empty();
				utils.showFlash();
				return;
			},
			open: function() {
				dialog.next().attr("id","kodeksDialog");
				if(confirm == null) {
					$("body").bind('click.nn',function() {
						self.closeDialog();
					});
				}
				$("body").bind('keyup.nn',function(event){
					if(event.keyCode == 13) {
						dialog.next().find("button:"+confirm.defaultButton).click();
					}
				});
				
			},
			buttons : {
				"Ок" : function() {
					self.closeDialog();
				}
			}
		};
		if(confirm != null && confirm.yes != null) {
			options = $.extend(options, {
				buttons : {
					"Да": function() {
						if(confirm.yes != null) {
							confirm.yes();
						}
						self.closeDialog();
					},
					"Нет": function() { 
						if(confirm.no != null) {
							confirm.no();
						}
						self.closeDialog();
					}
				},
				width : 580,
				position : {
					my : "center",
					at : "center",
					of : window
				}
			});
		}
		this.dialog = dialog.dialog(options);
	};

	this.closeDialog = function(){
		$('body').unbind('click.nn');
		$('body').unbind('keyup.nn');
		if (this.dialog!=null){
			this.dialog.dialog('destroy');
			this.dialog=null;
			$('#dialog').empty();
			$('#dialog').hide();
			utils.showFlash();
			this.container = $('#panel');
			this.activeFolder = $('#panel ul.FoldersTree li.selected').length ? $('#panel ul.FoldersTree li.selected') : null;
			this.main.document.selection = null;
			this.main.list.lock = false;
			this.marker = null;
		};
	};

	this.changeIconsToControl = function (element) {
		element	= $(element);
		for (var i in this.docClassesToControl) {
			var oldName = '' + i;
			var newName = '' + this.docClassesToControl[i];
			if (element.hasClass(oldName)) {
				element.removeClass(oldName);
				element.addClass(newName);
			}
		}
	}

	/*Функция снятия документов с контроля*/
	this.removeFromControlled = function () {
		var self = this;
		var ndDoc = (typeof (self.nd) == "number") ? self.nd : self.nd.split('&')[0];
		data = { 'type': 'ControlledDocument', 'nd': ndDoc };
		$.ajax({
			url: this.main.path.URL_FOLDER_REMOVERECORD,
			dataType: 'json',
			type: "post",
			data: data,
			success: function (json) {
				if (json.type == (-1)) {
					//alert("Внимание! Документ c контроля НЕ снят!");
					self.showAlert("Документ c контроля НЕ снят!", "Внимание!");
				} else {
					self.main.icons.remove('remove_control');
					self.main.icons.add('put_control', 'document_put_control');
					self.controlDoc = false;
					self.main.tabs.hideChangedDoc();
					self.controlDocChanged = null;
					//alert("Документ успешно снят с контроля.");
					self.showAlert("Документ успешно снят с контроля.", '');
					if (json.endDoc == true && $('#FoldersTree').length > 0) {
						$('#FoldersTree').remove();
					}
				}
			}
		});
	}
	/**/

	this.redactionsCbFilter = function () {
		if ($('ul.redactionsUl li input.cbRedactions:checked').length >= 2) {
			$('ul.redactionsUl li input.cbRedactions:enabled').not(':checked').attr("disabled", "disabled");
		} else {
			$('ul.redactionsUl li input.cbRedactions').removeAttr("disabled");
		}
	}

	this.redactionsBtClick = function () {
		var cbChecked = $('ul.redactionsUl li input.cbRedactions:checked');
		
		if (cbChecked.length != 2) {
			alert("Выберите 2 редакции для сравнения!");
			return;
		}
		
		var nd1 = cbChecked.eq(0).attr('id');
		var nd2 = cbChecked.eq(1).attr('id');
		var diffWindow = window.open('diff?ndoc1=' + nd1 + '&ndoc2=' + nd2, 'diff', 'width=800,height=600,resizable=1,toolbar=0,scrollbars=1');
	}

	this.setParams = function(obj){
		this.prs = obj;
	}
	
	this.getParams = function(obj){
		if (obj == null) {
			obj = {};
		}
		
		for (var i in this.prs) {
			if (obj[i]==null){
				obj[i] = this.prs[i];
			}
		}
		
		for (var i in obj) {
			if (obj[i] == 'null'){
				//console.log('delete obj[i];')
				delete obj[i];
			}
		}
		
		return obj;
	};
	
	this.clearParams = function(){
		this.prs = {};
	};
	
	this.diffLink = function(el){
		var jEl = $(el);
		var linkTooltip = jEl.find(".tooltip.docAnnotation");
		if(linkTooltip.length != 0) {
			jEl.data('simpletip',null);
			linkTooltip.remove();
		}
		var text = $.trim(jEl.text());
		if ((text == 'предыдущую редакцию' || text == 'новая редакция') && !this.main.tabs.excludFromRev) {
			var nd = jEl.attr('nd');
			var marker = jEl.attr('mark');
			if (!marker){
				marker = jEl.attr('marker');
			}
			if (!marker){
				marker = '';
			}
			if (text == 'новая редакция' || marker==''){
				window.open('diff?marker='+marker+'&ndoc1='+this.nd+'&ndoc2='+nd,'diff','width=800,height=600,resizable=1,toolbar=0,scrollbars=1')
			}else{
				this.diff(marker,nd)
			}
			return true;
		}
		return false;
	};
	
	this.diffClose = function(){
		this.dialog.dialog('destroy');
		var dialog = $("div#dialog")
		dialog.empty();
		dialog.removeClass('diff');
		utils.showFlash();
	};
	
	this.diff = function(marker,nd){
		var self = this;
		self.dialog = $("div#dialog")
		var src = 'diff?marker='+marker+'&ndoc1='+this.nd+'&ndoc2='+nd+'&only=1';
		var html = '<iframe class="diff"> </iframe>'
		self.dialog.addClass('diff');
		self.dialog.empty();
		self.dialog.html(html);
		utils.hideFlash()
		$('.diff',self.dialog).attr('src',src)
		
		var body = $('body');
		var height = Math.round(body.height()*0.85);
		var width =Math.round(body.width()*0.85);
		
		'width=800,height=600,resizable=1,toolbar=0,scrollbars=1'
		self.dialog.dialog({
			autoOpen: true,
			width: width,
			height: height,
			resizable:true,
			position: 'center',
			closeOnEscape: true,
			modal: true,
			draggable: false,
			close: function() {
				self.diffClose();
				//$(this).dialog('destroy');
				//var dialog = $("div#dialog")
				//dialog.empty();
				//dialog.removeClass('diff');
				//utils.showFlash()
				return false;
			}
		}); 
	};
/**/

	this.checkTestTools = function () {
		var self = this;
		$.ajax({
			url: this.main.path.URL_CHECK_TEST_TOOLS,
			dataType: 'json',
			type: "get",
			success: function (json) {
				if (json.success == false) {
					//alert("База testTools не подключена!!!");
				} else {
					self.TestToolsUrl.Url = json.url;
					self.TestToolsUrl.Name = json.nameUrl;
				}
			}
		});
	}

	this.startTestTools = function () {
		if (this.TestToolsUrl.Url != null) {
			var TestToolsUrl_ = utils.setUrlParam(this.TestToolsUrl.Url, 'nd', this.nd);
			window.open(TestToolsUrl_);
		}
	};

	this.openTestTolls = function (el) {
		var url = $(el).attr('id');
		$.ajax({
			url: url,
			type: "GET",
			dataType: "html",
			success: function (html) {
				$('#workspace #tabBody_0').html(html);
			}
		});
	};
	
	this.saveOffset = function(body) {
		var self = this;
		if (this.to1 == null){
			this.to1 = setTimeout(function(){
				self.to1 = null;
			},600) 
		}else{
			clearTimeout(this.to1)
			this.to1 = setTimeout(function(){
				self.saveOffset(body);
				self.to1 = null;
			},600) 
			return;
		}
		
//		console.log('>>>>>');
		
		var top = body.offset().top;
		var list = $('.scrollBlock',body).children(':not(style)');
		if (list.length == 0) return 0;
		var stop=list.length;
		var step=stop;
		var res = true;
		var i = Math.ceil(stop/2);
		var min = 10000;
		var current = list.eq(i-1);
		var offset;
		while(res){
			offset = current.offset();
			step-=Math.ceil(step/2);

			if (offset.top>top){
				i-=step;
			}else{
				i+=step;
			}
			if(i > stop || i < 0){
				res  = false;
			} else {
				current = list.eq(i-1);
				if (step<1)	res  = false;
			}
//			console.log(offset.top);
//			console.log(i-1);
//			console.log(current);
		}
		this.currentDOMMEl = current;
	};

	this.restoreOffset = function(body) {
		if (this.currentDOMMEl!=null){
			var el = $(this.currentDOMMEl);
			while (!el.is('div, p')){
				el = el.parent();
			}
			body.scrollTo(el.get(0));
		}
	};
	
	this.clearTextToogle = function(on){
		var body = this.activeText();
		var currentOffset = this.longDocument.currentOffset;
		if (this.params && this.params.length){
			for (var i = 0 ; i < this.params.length ; i++){
				if (this.params[i] == 'clearText=true' || this.params[i] == 'clearText=false' ){
					this.params.splice(i,1);
					i--;
				}
			}
		}
		if (on == true){
			//$('div.scrollBlock span.comment').hide();
			$('#workspace .tabBody').filter(':visible').addClass('clearText');
			//$('#workspace').removeClass('clearText');
			this.ClearTextOn = true;
			this.params.push('clearText=true');
			this.rewriteHistory();
			this.main.icons.disable('hide_notes');
			this.main.icons.add('show_notes','show_notes');
			this.main.icons.active('show_notes');
			if (this.sameDoc != true ){
				this.main.tabs.showClearTextAlert();
			} else {
				this.sameDoc = false; 
			}
		} else {
			//$('div.scrollBlock span.comment').show();
			$('#workspace .tabBody').filter(':visible').removeClass('clearText');
			//$('#workspace').removeClass('clearText');
			this.ClearTextOn = false;
			this.params.push('clearText=false');
			this.rewriteHistory();
			this.main.icons.disable('show_notes');
			this.main.icons.add('hide_notes','hide_notes');
			this.main.icons.active('hide_notes');
			this.main.tabs.closeClearTextAlert(true);
		}
		if (currentOffset != null){
			if (currentOffset.el != null){
				var el = $(currentOffset.el);
				while (!el.is('div, p')){
					el = el.parent();
				}
				body.scrollTo(el.get(0));
			}
		}
	}
	
	this.loadNewDocuments = function() {
		var a = 2;
	}
	this.openListItemInNewWindow = function(e,el){
		var elem = $(el);
		var ids = elem.attr('id').split('_');
		var nd = ids[1];
		if(ids[2] != null ){
			nd += '&nh=' + ids[2];
		}
		if(elem.parent().hasClass('iSearchList') == true){
			this.main.iSearch.openInNewWindow(nd);
		} else {
			this.main.listDocument.openInNewWindow(nd);
		}
	}
	this.init();
}