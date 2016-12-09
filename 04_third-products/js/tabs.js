function  Tabs(main){
	this.main=main;
	this.tabs=null;
	this.active=null;
	this.type=null;
	this.changeTab=null;
	this.saveKeyAjax = new Array();
	this.request = null;
	this.carousel= new Carousel(this);
	this.tabsAnimateSpeed = 300;
	this.numberInfo = null;
	this.infoArray = null;
	this.infoTitleArray = null;
	this.changedDocList = new Array();
	this.tabsPartsLoad = null;
	this.tabsPartsLoadReq = null;
	
	
	this.init = function(tabs){
		this.unAnimate();
		var self = this;
		self.animate();
		$('#tabs #carousel li').die();
		$('#tabs #carousel li').live('click', function () {
			self.openTab(this)
		});
		$(document).unbind('keydown.allTabs');
		$(document).bind('keydown.allTabs', function(event){return self.addEventKey(event)});	
		
	};
	this.openTabById = function(el,callback){
		var jEl = $(el);
		var id = utils.getId(el.id);
		var target = jEl.attr('tab');
		var tabIndex = null;
		this.main.history.add(new LinkHistory())
		for (var i in this.tabs){
			if (id!=undefined){
				if (this.tabs[i].id==id){
					tabIndex = i;		
				}
			}else{
				if ( target == this.tabs[i].title){
					tabIndex = i;		
				}		
			}
		}
		if (tabIndex!=null){
			var el = $('#tab_'+tabIndex).get(0);
			this.carousel.scroll(el);
			return this.openTab(el,callback);
		}
	}
	this.getFirstTabIndex = function () {
		for (var i in this.tabs) {
			return parseInt(i, 10);
		}
		return null;
	}
	this.getTabIndex = function (tabIndex) {
		if ((tabIndex == null) || ((tabIndex.id == null) && isNaN(tabIndex)))
			return this.getFirstTabIndex();
		if (tabIndex.id)
			tabIndex = parseInt(tabIndex.id.split('_')[1], 10);
		if (!this.tabs[tabIndex])
			return this.getFirstTabIndex();
		return tabIndex;
	}
	this.prepareUrl = function (tabIndex) {
		var self = this;
		var data = utils.getUrlAllParam(this.tabs[tabIndex].urlParams, true);
		var url = /[a-z, 0-9, =, \/, \:, \., \_]*[^\?]*/.exec(this.tabs[tabIndex].urlParams);
		url = url[0];
		if (data['point']) {
			url += '?point=' + data['point'];
			if (this.getActiveTab().filter)
				url += '&' + self.tabs[tabIndex].filter;
			delete data.point;
			delete data.mark;
		} else {
			if (this.getActiveTab().filter)
				url += '?' + self.tabs[tabIndex].filter;
		}
		return utils.URLAttrParse(url, data);
	}
	this.openTab = function (tabIndex, callback, notAbort) {
		if(window.ARZ['init']) {
			if(!ARM_ARZ_OBJ.openTabKodeks6(tabIndex))
				return;
		}

		tabIndex = this.getTabIndex(tabIndex);

		if (window.isEda) {
			if (this.main.eda.fixTab != null) {
				tabIndex = this.main.eda.fixTab(tabIndex, this);
			}
			if (this.main.eda.canOpenTab != null) {
				if (!this.main.eda.canOpenTab(tabIndex, this))
					return;
			}
		}

		if (this.request != null) {
			if (notAbort != null) {
				this.request.onabort = notAbort;
			}
			if (window.isEda && (this.main.eda.removeLastTab != null))
				this.main.eda.removeLastTab(this, tabIndex);
			this.request.abort();
		}
		this.savePos();
		var self = this;
		self.main.list.cntSelected = null;
		this.active = tabIndex;
		if (this.tabs[tabIndex].action) {
			$('#tabs li').removeClass('active');
			$('li#tab_' + tabIndex).addClass('active');
			this.tabs[tabIndex].action();
			return;
		}
		for (var i in this.tabs) {
			if (parseInt(this.active) != parseInt(i)) {
				this.tabs[i].urlParams = this.tabs[i].urlParams.replace(/part=\d*/, 'part=0');
			}
		}
		var body = $('#tabBody_' + tabIndex);
		if (body.length == 0) {
			if (window.isEda && (this.main.eda.saveLastTab != null))
				this.main.eda.saveLastTab(this, tabIndex);
			if (this.tabs[tabIndex]) {
				this.hideFunction();
				var loc = this.prepareUrl(tabIndex);
				self.addBody(tabIndex, self.tabs[tabIndex].contentType);
				self.showTabs(tabIndex);

				if (loc) {
					this.request = $.ajax({
						url: loc.location,
						dataType: "html",
						data: loc.attr,
						type: "get",
						error: function (er) { },
						complete: function () { },
						success: function (html) {
	                    	self.request = null; 
							self.rewriteBody(tabIndex, html);
							$('#tabBody_' + tabIndex).html(html);
							$('.document:visible').addClass('activeDoc');

							if (callback) {
								callback(tabIndex);
							}

							if (self.tabs[tabIndex].callback) {
								self.tabs[tabIndex].callback(tabIndex);
							}
							if (self.main.iSearch.currentDjvuPage && self.main.document.djvu.isDjvu()) {
								self.main.document.djvu.setPageDocument(self.main.iSearch.currentDjvuPage);
								self.main.iSearch.currentDjvuPage = null;
								$('.document:visible .text').addClass('djvu');
							} else {
								if (self.main.document.djvu.isDjvu()) {
									self.main.document.djvu.firstLoad = true;
									self.main.document.djvu.setSrc();
								}
							}
							//							self.main.icons.init();
							//							self.main.list.changeTab();
							var text = $('.text:visible');
							if (text.length > 0) {
								text.focus();
							}
							self.main.iSearch.annotationEvents();
							setTimeout(self.main.document.initLinkTitles, 100);
						}
					});
					this.request.onabort = function () {
						$('#tabBody_' + tabIndex).remove();
					}

				}
			}
		} else {
			this.showTabs(tabIndex);
			this.restorePos();
			if (callback) {
				callback();
			}
			//			if (this.tabs[tabIndex].action) {
			//			
			//			}

			//			self.main.icons.init();
			//			self.main.list.changeTab();
		}
		this.carousel.scroll();
	};
	this.reload = function(callback){
		var self = this;
		var url = this.getActiveTab().urlParams;
		if (this.getActiveTab().filter){
			url+='&'+this.getActiveTab().filter;
		}
	//	var data = utils.getUrlAllParam(url, true);
	//	url=/[a-z, 0-9, \/, \:, \., \_]*[^\?]/.exec(url);
	
		var loc = utils.URLAttrParse(url);
		$.ajax({
			url: loc.location,
			dataType: "html",
			data: loc.attr,
			type: "get",
			error: function(er){
				alert(er);
			},
			success: function(html){
				self.rewriteBody(self.active, html);
				$('#tabBody_' + self.active).html(html)
				if (self.tabs[self.active].callback) {
					self.tabs[self.active].callback();
				}
				if (callback) {
					callback();
				}
//				self.main.icons.init();
				$('.text:visible').focus();
			}
		});
	}
	this.showTabs = function(index){
		var self = this;
		$('#tabs li').removeClass('active');
		$('li#tab_'+index).addClass('active');
		$('.tabBody').hide();
		$('#tabBody_'+index).show();
		this.active = index;
		this.main.document.textSearch.nh = this.active;
		if (this.changeTab){
//			setTimeout(function(){
				self.changeTab(index);
//			},100);
		}
		if (this.main.bookmarks.area!='doc') {
			this.main.list.controlPics()
		}
		if (this.main.document.djvu.isDjvu()){
			this.main.document.djvu.ctrlOffset();
			this.main.document.djvu.ctrlPage();
			this.main.document.djvu.setButtonPaginator();
			this.main.document.djvu.setSearchResultButtonPaginator();
			$('.document:visible .text').addClass('djvu');
		}
		if (this.tabs[index].contentType == 'list') {
			if((this.tabs[index].title.toLowerCase().indexOf("тематики") != -1) || (this.tabs[index].title.toLowerCase().indexOf("рубрики") != -1)) {
				this.main.document.initHelpByOid(true,'lists',this.main.document.nd); // тематики
			} else {
				this.main.document.initHelpByOid(true,'lists',this.main.document.nd); // рубрики
			}
		} else if (this.tabs[index].contentType == 'djvu') {
			this.main.document.initHelpByOid(true,'document_graf',this.main.document.nd);
		}
		this.animate();

		if (window.isEda) {
			this.main.eda.initHelp();
		}
	};
	this.needTabsPartsLoad = function(nd){
		return (parseInt(nd) == 9080007) ? true : false;
	}
	this.setTabs = function (tabs, changeTab, type) {
		this.tabsPartsLoad = this.needTabsPartsLoad(this.main.document.getNd());
		this.type = type;
		this.unAnimate();
		this.changeTab=changeTab;
		
		this.setTabsStyle(type);
		tabs = this.main.tContent.init(tabs);

		this.tabs=tabs;
		var self = this;
		var ul = $('#tabs ul');
		var is = 0;
		ul.empty();
		if (type != 'asearch') {
			$('.tabBody').empty().remove();
		}
		this.active = 0;
		var hideTab = false;
		if (tabs.length < 2){
			hideTab = true;
			if ($('#icons').children().length == 0){
				this.hidePanel()
			}else{
				this.showPanel();
			}
		}else{
			this.showPanel();
		}
		var pre = '';
		var ap = '';
		for(var i in tabs){
			if (tabs[i].quantity==0){
				continue;
			}
			if (tabs[i].state=='active'){
				this.active=i;
			}
			
			if (this.tabsPartsLoad != true || tabs[i].state == 'active') {
				
				var html = this.getTabHtml(tabs[i], i, hideTab);

				if (i < 0) {
					pre += html;
				} else {
					ap += html;
				}
			}
			var getKeyKode = self.main.hotkeys.hotKeyCorrelation(tabs[i].hotkey.toUpperCase());
			self.saveKeyAjax[is] = new Array(getKeyKode, i);
			is++;
		}
		
		if (this.tabsPartsLoad == true) {
			if(this.tabs[this.active].title != 'Важные документы'){
				ul.append(ap);
				ul.prepend(pre);
			} else {
				this.checkImpNewDocTab(ap);
			}
			this.loadNewDocsTabs();
		} else {
			ul.append(ap);
			ul.prepend(pre);
			this.init();
			this.carousel.init();
		}
		if (window.isEda) {
			this.main.eda.initHelp();
		}
		
	};
	this.setTabsStyle = function(type) {
		$("#tabs").removeClass("asearchTabs").removeClass("isearchTabs");
		if(type) {
			$("#tabs").addClass(type+'Tabs');
		}
	}
	this.getTabHtml = function (tab, i, hideTab) {
		var textTab = tab.title.replace(tab.hotkey, ('<u>' + tab.hotkey + '</u>'));

		var title = '';
		if (tab.title.length > 40){
			title='title="' + tab.title+'"';
		}
		
		var html = '<li ' + title + ' id="tab_' + i + '" class="' + tab.state + '" ' + (hideTab ? 'style="display: none;"' : '') + '><p>' + textTab + '</p></li>'
			
		return html;
	}

	this.checkImpNewDocTab = function(ap){
		var self = this;
		var html = '';
		var data = { 'tabs_urls': this.getActiveTab().urlParams.split('?')[1] };
		$.ajax({
			url: 'newDocs?action=check_tabs',
			dataType: "json",
			data: data,
			type: "get",
			error: function (er) {
				console.log(er);
			},
			success: function (json) {
				if (json && json.tabs) {
					if (json.tabs[0] == true) {
						html = ap;
					} else{
						var active = parseInt(self.getActive());
						self.tabs[active + 1].state = 'active';
						self.tabs[active].state = 'inactive';
						var hideTab = (self.tabs.length < 2) ? true : false;
						html = self.getTabHtml(self.tabs[active + 1], active + 1, hideTab);
						self.openTab(active + 1);						
					}
					$('#tabs ul').prepend(html);
				}
			}
		});

	}

	this.loadNewDocsTabs = function () {
		var self = this;
		var ul = $('#tabs ul');
		var ap = '';
		var pre = '';
		var hideTab = (this.tabs.length < 2) ? true : false;
		var active = parseInt(this.getActive());
		var params = [];
		for (var i in this.tabs) {
			params.push(this.tabs[i].urlParams.split('?')[1]);
		}
		if (params.length > 0) {
			 if (self.tabsPartsLoadReq != null){
				self.tabsPartsLoadReq.abort();
			}
			if($('.loadTabsSpiner', ul).length == 0){
				ul.append('<li class="loadTabsSpiner"><div></div></li>');				
			}
			var data = { 'tabs_urls': params.join(';') };
			self.tabsPartsLoadReq = $.ajax({
									url: 'newDocs?action=check_tabs',
									dataType: "json",
									data: data,
									type: "get",
									error: function (er) {
										console.log(er);
									},
									success: function (json) {
										if (json && json.tabs) {
											for (var i in self.tabs) {
												if (self.tabs[i].state != 'active') {
													if (json.tabs[i] == true) {
														var html = self.getTabHtml(self.tabs[i], i, hideTab);
														if (self.tabs[i].hidx < active) {
															pre += html
														} else {
															ap += html;
														}
													}
												}
											}
											$('.loadTabsSpiner', ul).remove();
											ul.append(ap);
											ul.prepend(pre);
											self.init();
											self.carousel.init();
											var timer = setTimeout(function () { self.carousel.init(); }, 2000);
											
										}
									}
								});
		} else {
			self.carousel.init();
		}
	}
	this.isFirstTab = function(){
		for(var i = 0 ; i < this.tabs.length; i++){
			if(this.tabs[i]){
				if(i == this.active)
					return true;
				else
					return false;
			}
		}
		return false;
	}
	this.getActiveTab = function(){
		if (this.tabs != null && this.tabs[this.active] != null ){
			return this.tabs[this.active];
		}
		for (var i in this.tabs){
			return this.tabs[i];
		}
		return false;
	}
	this.getActive = function(){
		if (this.tabs != null && this.tabs[this.active] != null ){
			return this.active;
		}
		for (var i in this.tabs){
			return i;
		}
		return false;
	}
	
	this.addBody = function(index,type,html){
		var styleClass = 'tabBody '+type;
		if (html==null){
			styleClass+=' loadingTab';
			html='';
		}
		$('table.message').remove();
		$('#workspace').append('<div id="tabBody_'+index+'" class="'+styleClass+'">'+html+'</div>');			
	}
	
	this.rewriteBody = function(index,html){
		$('#tabBody_'+index).html(html);
		$('#tabBody_'+index).removeClass('loadingTab');
	}

	this.empty = function () {
	    this.hideFunction();
	    $('#tabs ul').empty();
	    $('#tabs .selector').hide();
	    $('#workspace .tabBody').remove();
	    this.tabs = null;
	    this.active = null;
	    this.carousel.init();
	}
	/***************Информационные строки*************/
	this.showWarning = function(msg, style, infoTitle) {	
		if (msg){
		
			msgArr = msg.split("\n");
			
			var info_style;
			if (style!=null)
				info_style = style;	
			if ($('#infodiv').length == 0)	
				$('#workspace').prepend('<div id="infodiv"></div>');				
			$('#warning').remove();
				var str = '<div id="warning" class="'+info_style+'">'+ '<div class="warning_left"></div>' + '<div class="warning_right">'
						+ '<span class="icon_back_inf"></span>' + '<span class="icon_forward_inf"></span>'+'<span class="icon_close_inf"></span></div>'
						+ '<div class="warning_inf"><div class="warning_text">'+msgArr[0]+'</div></div></div>';
				if ($('#controlDocChanged').length)		
					$('#infodiv').append(str);	
				else
					$('#infodiv').prepend(str);
								
				var line = $('#warning');
				$('#workspace').css('padding-top',line.height()+'px');	
				line.css('margin-top','-'+line.height()+'px');
		
				if(msgArr.length <= 1)
				{
					$('.icon_back_inf').remove();
					$('.icon_forward_inf').remove();
				}
				
				this.numberInfo = 0;
				this.infoArray = msgArr;
				this.infoTitleArray = infoTitle.split("\n");
				var self = this;	
				$('.icon_close_inf').bind("click",function(){ 	self.hideWarning(true); return true; });	
				$('.icon_back_inf').bind("click",function(){ self.moveInfoBack(); return true; });
				$('.icon_forward_inf').bind("click",function(){ self.moveInfoForward(); return true;});
				$('.icon_back_inf').css("visibility","hidden");
				$('.warning_inf').attr({title: this.infoTitleArray[0]});
		}
	}
	this.hideWarning = function(close) {
		$('#warning').remove();
		$('#workspace').css('padding-top','0px');	
		if ($('#controlDocChanged').length) {
			$('#controlDocChanged').removeClass("withWarningInf");
			var line = $('#controlDocChanged');
			$('#workspace').css('padding-bottom',line.height()+'px');
		//	$('#workspace').css('padding-top','-'+line.height()+'px');
		}
		if (close == true) {
			this.main.document.warning = null;
		}
		if($('.infWindow').length > 0){
			$('.infWindow').css('top', '80px');
		}
	}
	this.moveInfoBack = function() {
		if( (this.infoArray.length > 1) && ( (this.numberInfo - 1) >= 0) ){
			this.numberInfo--;
			$('.warning_text').html(this.infoArray[this.numberInfo]);
			$('.icon_forward_inf').css("visibility","visible");
			if (this.numberInfo == 0)
				$('.icon_back_inf').css("visibility","hidden");
			$('.warning_inf').attr({title: this.infoTitleArray[this.numberInfo]});
			 
		}		
	}
	
	this.moveInfoForward = function() {
		if( (this.infoArray.length > 1) && ( (this.numberInfo + 1) < this.infoArray.length) ){
			this.numberInfo++;
			$('.warning_text').html(this.infoArray[this.numberInfo]);
			$('.icon_back_inf').css("visibility","visible");
			if (this.numberInfo == (this.infoArray.length - 1) )
				$('.icon_forward_inf').css("visibility","hidden");
			$('.warning_inf').attr( {title: this.infoTitleArray[this.numberInfo]});
		}		
	}
	
	/**************Документы на контроле****************/
	this.showChangedDoc = function(changed) {
		var self = this;
		$('#controlDocChanged').remove();
		if ($('#warning').length == 0 && $('#infodiv').length == 0)
			$('#workspace').prepend('<div id="infodiv"></div>');
		if (changed == true)
			$('#infodiv').prepend('<div id="controlDocChanged" class = "controlDocChangedNew withWarningInf"></div>');
		else
			$('#infodiv').prepend('<div id="controlDocChanged" class = "controlDocChanged withWarningInf"></div>');
		if ($('#warning').length == 0) {
			$('#controlDocChanged').removeClass("withWarningInf");	
			var line = $('#controlDocChanged');
			$('#workspace').css('padding-top',line.height()+'px');	
			line.css('margin-top','-'+line.height()+'px');
		}
			
		$('#controlDocChanged').bind("click",function(){ self.showChangedDocList(); return true;});	
	}
	this.hideChangedDoc = function() {
		$('#controlDocChanged').remove();
		if ($('#warning').length == 0) {
			$('#workspace').css('padding-top','0px');
			$('#workspace').css('padding-bottom','0px');
		}
		$('#listChanged').remove();
	}
	this.createChangedDocList = function(changedlist) {
		var self = this;
		self.changedDocList = changedlist;
		$('#listChanged').remove();
		$('#workspace').append('<div id="listChanged"><span id="whiteTriangle"></span>'
								+'<span id="closeChangedList"></span>'
								+'<div class="topChangedList"></div>'
								+'<div id="listChangedContent"></div>'
								+'<div class="bottomChangedList"></div></div>');
		var str = '';
		if 	(changedlist[0] == '<ul></ul>' && changedlist[1] == '<ul></ul>')
		    str += '<div class="changedNone">С момента постановки документа на контроль информации об изменениях нет</div>';
		else if (changedlist[0] != '<ul></ul>') 
				str += changedlist[0];
		else if (changedlist[0] == '<ul></ul>' && changedlist[1] != '<ul></ul>')
				str += changedlist[1];
		$('#listChangedContent').html(str);
		$('#listChanged').hide();
		$('#closeChangedList').bind("click",function(){ self.hideChangedDocList(); return true;});	
		$('#listChanged a').bind("click",function(){ self.showAllChangedDocList(); return true;});	
	}
	this.showAllChangedDocList = function() {
		var self = this;
		$('#listChangedContent').html(self.changedDocList[1]);
	}
	this.showChangedDocList = function() {
		var self = this;
		$('#listChanged').show();
		if (window.isEda && (self.main.eda.onShowChangedDocList != null))
			self.main.eda.onShowChangedDocList();
		$('#controlDocChanged').unbind("click");	
		$('#controlDocChanged').bind("click",function(){ self.hideChangedDocList(); return true;});
		$('.scrollBlock').bind("click",function(){ self.hideChangedDocList(); return true;});
		if ($('#controlDocChanged').hasClass('controlDocChangedNew')) {
			var data = {'type' : 'ControlledDocument', 'nd' : self.main.document.nd};
			$.ajax({
				url: self.main.path.URL_FOLDER_REWRITE_RECORD,
				dataType : 'text',
				type : "get",
				data : data,
				success: function (text) {
					self.main.document.controlDocChanged = false;
					$('#controlDocChanged').removeClass('controlDocChangedNew');
					$('#controlDocChanged').addClass('controlDocChanged');
				}
			});
		}
	}
	this.hideChangedDocList = function() {
		var self = this;
		$('#listChanged').hide();
		if (window.isEda && (self.main.eda.onHideChangedDocList != null))
			self.main.eda.onHideChangedDocList();
		$('#controlDocChanged').unbind("click");	
		$('#controlDocChanged').bind("click",function(){ self.showChangedDocList(); return true;});	
		$('.scrollBlock').unbind("click",function(){ self.hideChangedDocList(); return true;});
	}




	this.showInfWindow = function(params){
		if(!params) return false;
		var str = '<div class="infWindow ' + params.infType + '"><span class="infClose"></span>';
		str += '<div class="infText">';

		if(params.headText)
			str += '<div class="headText">' + params.headText + '</div>';

		str += params.infText + '</div>';

		if(params.buttons){
			str += '<div class="infButtons">';
			str += '<div class="infActionBut infBtn">' + getBtnParts(params.buttons[0]) + '</div>';
			if(params.buttons[1])
				str += '<div class="infCloseBut infBtn">' + getBtnParts(params.buttons[1]) + '</div>';
			str += '</div>';
		}

		str += '</div>';

	    $('#workspace').append(str);

	    if($('#warning').length > 0){
			$('.infWindow').css('top', '120px');
		} else {
			$('.infWindow').css('top', '80px');
		}

	    function getBtnParts(name){
	    	return '<div class="infBtnL"></div><div class="infBtnC">' + name + '</div><div class="infBtnR"></div>'	
	    }

	    return true;
	}
	this.closeInfWindow = function (){
		$('#workspace .infWindow').remove();	
	}

    /*******************Сообщение об оперативной информации в новом фрейме*************************************/
	this.showLinkForOperInf = function (linkForOperInf) {
		if (this.main.document.nd != null) {
			var nd = (typeof(this.main.document.nd) == 'string') ? this.main.document.nd.split('&')[0] : this.main.document.nd+'';
			if(this.main.document.lastDocNd == nd){
				return;
			}
			this.main.document.lastDocNd = nd;
		}
	    var self = this;
	    var params = {infType: 'linkForOperInf',
						headText: 'Внимание!',
						infText: linkForOperInf,
						buttons: ['Оценить изменения', 'Закрыть']
					};
	    self.showInfWindow(params);
	    $('.infWindow span.infClose').bind('click', function () { self.closeLinkForOperInf(true); });
	    $('.infWindow .infText a.newFrame').bind('click', function () { self.closeLinkForOperInf(true); });
	    $('.infWindow .infButtons .infCloseBut').bind('click', function () { self.closeLinkForOperInf(true); });
	    $('.infWindow .infButtons .infActionBut').bind('click', function (event) { self.main.document.openLink($('.infWindow .infText a.newFrame').get(0), event); self.closeLinkForOperInf(true); });
	}
	this.closeLinkForOperInf = function (close) {
		$('#workspace .infWindow').remove();
		if (close == true) {
			this.main.document.linkForOperInf = null;
		}
	}

	/*******************Сообщение об включения режима чистых текстов*************************************/
	this.showClearTextAlert = function () {
	    var self = this;
	    var infText = 'Вы работаете с текстом документа, в котором скрыты все примечания. В ряде случаев в примечаниях содержится важная информация, влияющая на применение документа.'
	    var params = {infType: 'clearTextAlertDiv',
						headText: 'Внимание!',
						infText: infText,
						buttons: ['Показать все примечания', 'Закрыть']
					};
	    self.showInfWindow(params);
	    $('.clearTextAlertDiv span.infClose').bind('click', function () { self.closeClearTextAlert(true); });
	    $('.clearTextAlertDiv .infButtons .infCloseBut').bind('click', function () { self.closeClearTextAlert(true); });
	    $('.clearTextAlertDiv .infButtons .infActionBut').bind('click', function (event) { self.main.document.clearTextToogle(false); self.closeClearTextAlert(true); });
	}
	this.closeClearTextAlert = function (close) {
		if ($('#workspace .clearTextAlertDiv').length > 0){
			$('#workspace .clearTextAlertDiv').remove();
		}
	}
	/*******************Сообщение наличии ссылок на недействующие и/или изменившиеся правовые акты*************************************/
	this.showLinkForActMessage = function () {
		var self = this;
		var infText = '<br>В тексте есть ссылки на правовые акты, которые изменились с даты создания данного материала (выделены '
		infText += '<span class="greyText">серым цветом</span>';
		infText += '). <br><br> Перед применением материала рекомендуем ознакомиться с изменениями, внесенными в правовые акты.';
		var params = {infType: 'linkForActMessage',
						headText: 'Обращаем ваше внимание!',
						infText: infText,
						buttons: ['Закрыть']
					};
		self.showInfWindow(params);
	    $('.linkForActMessage span.infClose').bind('click', function () { self.closeLinkForActMessage(true); });
	    $('.linkForActMessage .infButtons .infActionBut').bind('click', function () { self.closeLinkForActMessage(true); });
	}
	
	this.closeLinkForActMessage = function (close) {
		if ($('#workspace .linkForActMessage').length > 0){
			$('#workspace .linkForActMessage').remove();
		    if (close == true) {
				this.main.document.LinkForAct = null;
			}
		}
	}
	/*******************Сообщение cо ссылками на сервис "Системы стандартов на продукцию"*************************************/
	this.showSystemStandartLinks = function (systemStandartLinks) {
		var self = this;

		var infText = 'Этот документ является одним из ГОСТов на данный вид продукции.<br><br>';
		infText += 'Хотите ознакомиться с расширенным перечнем ГОСТов?';
		infText += '<div class="systemStandartLinksBlock"><ul>';

		for (var i = 0; i < systemStandartLinks.length; i++) {			 
			  infText += '<li>';
			  if(i==0) 
			  	infText += '<span>Cм. </span>';
			  infText += '<a class="systemStandartLink" href="javascript:;" nd="' + systemStandartLinks[i].nd + '">' + systemStandartLinks[i].name + '</a></li>';
		};
		infText += '</ul></div>';

	    var params = {infType: 'systemStandartLinks',
						headText: null,
						infText: infText,
						buttons: ['Закрыть']
					};
	    self.showInfWindow(params);
	    $('.systemStandartLinks span.infClose').bind('click', function () { self.closeSystemStandartLinks(true); });
	    $('.systemStandartLinks .infButtons .infActionBut').bind('click', function () { self.closeSystemStandartLinks(true); });
	}
	
	this.closeSystemStandartLinks = function (close) {
		if ($('#workspace .systemStandartLinks').length > 0){
			$('#workspace .systemStandartLinks').remove();
		    if (close == true) {
				this.main.document.systemStandartLinks = null;
			}
		}
	}

	/*******************Сообщение о том, что документ входит в несколько справочников"*************************************/

	this.showSeveralTree = function (panels) {
		var self = this;
		if($('.several_tree').length > 0){
			return;
		}
		var infText = 'Данный материал входит в состав нескольких справочников:<br><br>';
		infText += '<ul>';
		for (var i = 0; i < panels.length; i++) {
 			infText += '<li><span class="load_several_tree" id="' + i + '">' + panels[i].title + '</span></li>';
		}

		infText += '</ul><br>Перейдите в интересующий Вас справочник, чтобы получить специализированную информацию по этой теме.';

		var params = {infType: 'several_tree',
						headText: null,
						infText: infText,
						buttons: ['Закрыть']
					};

	    self.showInfWindow(params);

	    $('.several_tree span.infClose').bind("click", function () { self.closeSeveralTree(); });
       	$('.several_tree .load_several_tree').bind("click", function () { self.main.panel.loadSeveralTree(this); });
       	$('.several_tree .infButtons .infActionBut').bind('click', function () { self.closeSeveralTree(); });

    }
    this.closeSeveralTree = function (hide) {

        if ($('.several_tree').length > 0) {
            $('.several_tree').remove();
            if (hide != true){
            	this.main.panel.Panels = null;
            }
        }
    }
	/********************************************************/



	this.hideFunction = function () {
	    
		if(window.ARZ['init']) {
			ARM_ARZ_OBJ.arzHints.hideToolTip();
		}
		
		this.hideWarning();
	    this.hideChangedDoc();
	    this.closeInfWindow();
	}

	this.savePos = function() {
		var tab = $('#tabBody_'+this.active+' > .document > .text');
		if (tab.length==0){
			tab = $('#tabBody_'+this.active);
		}
		if (tab.length>0) {
			this.tabs[this.active].scroll = tab.get(0).scrollTop;
		}
	}
	
	this.restorePos = function() {
		var tab = $('#tabBody_'+this.active+' > .document > .text');
		if (tab.length==0){
			tab = $('#tabBody_'+this.active);
		}
		if (this.tabs[this.active].scroll){
			tab.scrollTo(
				{top:this.tabs[this.active].scroll+'px', left:'0px'}
			);
		}
	}
	
	this.addEventKey = function(e){
		
		var self = this;
		var sK = null;
		var sId = null;

		for(var i = 0; i < self.saveKeyAjax.length; i++) {
			if(self.saveKeyAjax[i][0] == e.which) {
				sK = self.saveKeyAjax[i][0];
				sId = self.saveKeyAjax[i][1];
				break;
			}
		}
		if(sK != null && e.altKey){
			var bc = $('#tab_'+sId);
			if(bc.length > 0) self.openTab(bc.get(0));
			this.carousel.scroll($('#tab_'+sId).get(0));
			return false;
		}else if((e.ctrlKey || e.shiftKey) && e.which == 9){
			var all_tab = $('#tabs li');
			var cc = $('#tabs li.active');
			
			if(all_tab.length > 1) {
				var nextTab = cc.next();
				if (nextTab.length == 0) //Если последняя вкладка, то открываем первую.
					nextTab = all_tab.first();
				while (nextTab.hasClass('invisible')) {
					nextTab = nextTab.next();
					if (nextTab.length == 0) //Если последняя вкладка, то открываем первую.
						nextTab = all_tab.first();
				}
				self.openTab(nextTab.get(0));
				this.carousel.scroll($('#tab_'+sId).get(0));
			}			
			return false;
		}			
		return true;
	}
	this.hidePanel = function(offset){
		if ($('#header:visible').length==0){
			return;			
		}
		if (offset == null){
			offset = 47;
		}
		$('#container').css('padding-top',offset+'px');	
		this.main.icons.hide();
//		$('#icons').hide();
		$('#tabs').hide();
	}
	this.showPanel = function(){
		if ($('#header:visible').length==0){
			return;			
		}
		$('#container').css('padding-top','73px');	
		this.main.icons.show();
//		$('#icons').show();
		$('#tabs').show();
	}
	this.animate = function(){
		var self = this;
		setTimeout(function(){
		  	$("#carousel ul:first").animate({"margin-top":"3px"}, self.tabsAnimateSpeed);
			$("#tabs .selector:visible").animate({"margin-top":"3px","height":"30px"}, self.tabsAnimateSpeed);
			$("#tabs .selector:visible div:visible, #tabs .selector:visible div:visible p:visible").animate({"height":"30px"}, self.tabsAnimateSpeed);
			//$("#tabs .selector div:first:visible,#tabs .selector div p:visible").animate({"margin-top":"0px"}, this.tabsAnimateSpeed);
		}, ((self.type=="isearch")?1000:1) );
	}
	this.unAnimate = function(){
		$("#carousel ul").css({"margin-top":"33px"});
		$("#tabs .selector").css({"margin-top":"33px","height":"0px"});
		$("#tabs .selector div, #tabs .selector div p").css({"height":"0px"});
		//$("#tabs .selector div:first:visible").css({"margin-top":"30px"});
	}
}
