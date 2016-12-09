function UserHistory(main){
	this.main = main;
	this.tabBody = null;
	this.icons = null;
	this.linkHistory = null;
	this.printUrl = null;
	this.printAction = null;
	this.dialog = null;
	this.histListRequest = null;
	this.init = function(){
		var self=this;
		$('#history').live('click', function(){ self.initHistory(null, null, true); });
		$('div.showAllHistory').live('click', function(){ self.initHistory(null, null, true); });
		$('.historyTree span.open').live('click', function(){ self.openNode(this); });
		$('.historyTree span.close').live('click', function(){ self.closeNode(this); });
		
		$('.historyTree p').live('click', function(){ self.select(this); });

	
		$('.historylist ul.forHistory li').live('click', function(event){
			if (window.isEda) {
				if (event.isPropagationStopped())
					return;
			}
			if (window.isEda) {
				self.main.eda.beforeListSelect(this, event, self);
			}
			self.main.list.select(
				this,
				event,
				function(element,event,offset){
					self.openDoc(element,event,offset);
				},
				null, 
				function(cnt,el){
					self.showCntInfo(cnt,el);
				}
			);
		});			


		$('div#dialog .lifetime .button').live('click', function() { self.submitLifetime();	});
		$('.lifetimeHistory').live('click', function(){self.lifetimeHistory(); });
		$('#dialog .closeBookmarkDialog, #dialog .cancel').live('click', function(){ self.closeDialog(); });
	};
	this.setEvent = function(){
		var self = this;
		this.main.icons.reg('print',function(){ self.print(); });
		this.main.icons.reg('save',function(){ self.save(); });
	};
	this.checkSelection = function(){
		var selectedUrl = '&param3=';
		var selectedElements = new Array();
		if ($('ul.forHistory li.selected:visible').length){
			$('ul.forHistory li.selected:visible').each(function(){
				selectedElements.push(/\d+/.exec($(this).attr('id'))[0]);
			});
			return selectedUrl+selectedElements.join(';');
		}else{
			return '';
		}
	}
	
	this.print = function(){
		if (!this.printUrl || !this.printAction){
			return false;
		}
		var selection = this.checkSelection();
		if (selection == '')
			this.main.document.print(this.printUrl + this.printAction);
		else {
			this.main.document.print(this.printUrl + '&action=events_by_idList' + selection);
		}
	}
	
	this.save = function(){
		if (!this.printUrl || !this.printAction){
			return false;
		}
		var selection = this.checkSelection();
		if (selection == '')
			this.main.document.save(this.printUrl + this.printAction + '&filename=Список документов.rtf', true);
		else {
			this.main.document.save(this.printUrl + '&action=events_by_idList' + selection + '&filename=Список документов.rtf', true);
		}
	}
	
	this.openDoc = function (element,event,offset){
		var scr = {
				pos:$(element).prevAll().length,
				offset: offset,
				id:$(element).attr('id')
			};
		this.rewriteHistory(scr);

//		if (event.target.nodeName == 'SPAN') {
//			return false;
//		}
		this.main.progress.start();
		var jqElement = $(element);
		try {
			var state = eval('('+jqElement.attr('state')+')');
		}catch (e){
			this.main.progress.stop();
			this.main.tooltip.create($('body'), msg.get('brokenData'), 3000, 'documentNotFound');
			this.main.tooltip.setCenter($('.documentNotFound'));
			return;
		}
		this.main.restore.start(state,event)
		$('#tabs').hide();
	}
	this.initHistory = function(item, tab, history, callback){
		this.main.document.lastDocNd = null;
		this.main.document.showForm();
		var self = this;

		self.main.resize.unset('document');
		//$('#workspace').empty().css('padding-top', '0');
		if ($('#HistoryTree').length){
			self.show();
			self.initTabs(item, tab, callback);
			
			main.list.crossReg(
				function(event){
					self.cross(event);
				},
				function(cnt,el){
					self.showCntInfo(cnt,el);
				}
			);
			
		} else {
			self.loadHistoryTree();
		}

		this.main.document.initHelpByOid(true,'workhistory',this.main.document.nd);

		if (history) {
			var link = new LinkHistory('История', 'История', function(){
				self.initHistory(0, 0, null);
			});
			self.linkHistory = self.main.history.add(link);
			
			main.list.crossReg(
				function(event){
					self.cross(event);
				},
				function(cnt,el){
					self.showCntInfo(cnt,el);
				}
			);
		}
	};

	this.initTabs = function (item, tab, callback) {
	    var self = this;
	    this.main.document.annotInfo = null;
		this.setEvent();
		var tabs = [
						{
						    ContentType: 'historylist',
						    hidx: 0,
						    hotkey: 'Д',
						    infoKinds: null,
						    state: 'active',
						    title: lex('Documents'),
						    urlParams: 'd',
						    action: function () {
						        self.main.tabs.showTabs(this.hidx);
						        self.main.tabs.hideFunction();						     
						    }
						},
						{
						    ContentType: 'historylist',
						    hidx: 1,
						    hotkey: 'З',
						    infoKinds: null,
						    state: 'inactive',
						    title: lex('Requests'),
						    urlParams: 'q',
						    action: function () {
						        self.main.tabs.showTabs(this.hidx);
						        self.main.tabs.hideFunction();
						    }
						}
					];


	    self.main.tabs.setTabs(tabs, function () {
	        self.loadHistoryList(callback);
	    });
	    self.main.tabs.addBody('0', 'historylist', '');
	    self.main.tabs.addBody('1', 'historylist', '');
	    if (item != null) {
	        self.select(null, item);
	    }
	    var after = function () {
	        self.main.progress.stop();
	    };
	    if (tab == null) {
	        self.main.tabs.openTab(0, after)
	    } else {
	        self.main.tabs.openTab(tab, after);
	    };
		$('#panel').removeClass('taxCal');
		$('#tabs').show();
		self.main.icons.remove("folder_put");
	}
	
	this.loadHistoryTree = function(callback){
		utils.progressOn();
		var self = this;
		var date = new Date();
		var yesterday=new Date();
		yesterday.setDate(yesterday.getDate()-1);
		date = date.getDate()+'.'+(parseInt(date.getMonth())+1)+'.'+date.getFullYear();
		yesterday = yesterday.getDate()+'.'+(parseInt(yesterday.getMonth())+1)+'.'+yesterday.getFullYear();
		var treeurl = 'historytree';
		if (this.main.req!=null){
			this.main.req.abort();
		}
		this.main.req = $.ajax({
			url: treeurl,
			type: 'GET',
			dataType : 'html',
			success: function (html){
				self.main.req = null;
				$('#tree').empty();
				$('#tree').append(html);
				$('#tree .today').attr('id', date);
				$('#tree .yesterday').attr('id', yesterday);
				self.show();
				self.initTabs();
				utils.progressOff();
				if (callback) {
					callback();
				}
			}	
		});
	};

	this.show = function () {
	    $('#tree > div').hide();
	    this.main.panel.activeTree = 'HistoryTree';
	    this.main.panel.open();
	    this.main.panel.initResize();
	    this.main.icons.clear();
	    //this.main.icons.add('tree','tree');
	    if (this.main.utils.isLocal()) {
	        this.main.icons.add('lifetimeHistory', 'lifetimeHistory');
	    }
	    this.main.icons.add('print', 'history_print');
	    this.main.icons.add('save', 'history_save');
	    //$('#ico_tree').hide();
	    $('#HistoryTree').show();
	    this.main.panel.addClassName(null, 'histPanel');
	    $('div.top:visible').addClass('histTop');
		
		if (window.isEda) {
			this.main.eda.initIconsForUserHistory();
		}
	};
	
	this.closeNode = function(element){
		$(element).removeClass('close').addClass('open');
		$(element).parent().find('ul:first').hide();
	};
	
	this.openNode = function(element){
		$(element).removeClass('open').addClass('close');
		$(element).parent().find('ul:first').show();
	};
	
	this.select = function(element, id) {
		if (null==id) {
			var li = $(element).parent();
		} else {
			var li = $("#HistoryTree ul.historyTree li[id='"+id+"']");
			this.openNode( $('> span.open', li.parents('li')[0]) )
		}
		if ( li.attr('id')=='' ) {
			this.openNode($('span:first',li)[0]);
			return false;
		}
		if ( li.hasClass('selected') ) {
			return false;
		}

		$('#panel .historyTree li.selected').removeClass('selected');
		li.addClass('selected');
		$('#tabBody_0, #tabBody_1').empty();
		if (null==id) {
			this.loadHistoryList()
		}
	}
	
	this.loadHistoryList = function(callback) {
		var tab = this.main.tabs.getActiveTab();
		var type = tab.urlParams;
		var li = $('#HistoryTree li.selected');
		
		if (!li.length) {
			li = $('#HistoryTree li:first');
			li.addClass('selected');
		}
		var date = li.attr('id');
		var dateType = 'events_by_date';
		if(date.indexOf('.') > -1) {
			date = Date.UTC(date.split('.')[2], date.split('.')[1] - 1, date.split('.')[0], 0, 0, 1);
		} else if (date.indexOf('/') > -1) {
			date = Date.UTC(date.split('/')[2], date.split('/')[1] - 1, date.split('/')[0], 0, 0, 1);
		} else if (date.indexOf('-') > -1) {
			date = Date.UTC(date.split('-')[0], date.split('-')[1] - 1, date.split('-')[2], 0, 0, 1);
		} else {
			dateType = 'events_by_period';
		}
		this.printUrl = this.main.utils.setUrlParams(this.main.path.URL_HISTORY_EVENT,
				{param1: date,
				param2: type}, true)+'&print=1';
		this.printAction = '&action=' + dateType;
		
		if ($('#tabBody_' + tab.hidx).html() != '') {
			return false;
		}
		utils.progressOn();
		var self = this;
		var periodClass = li.attr('className').split(' ');
		var periodHeader = ('selected'== periodClass[0])?periodClass[1]:periodClass[0];
		var header= periodHeader?periodHeader:li.attr('id');
		
		if (this.histListRequest != null) {		
			this.histListRequest = null;
		}
		
		this.histListRequest = $.ajax({
			cache: false,
			url : this.main.path.URL_HISTORY_EVENT,
			type : 'GET',
			data : { 
				action: dateType ,
				param1: date,
				param2: type,
				param3: header
				},
			dataType : 'html',
			success: function (html){
				if( $('#tabBody_'+tab.hidx)[0])
					$('#tabBody_'+tab.hidx)[0].innerHTML = html;
				self.rewriteHistory();
				if (callback){
					callback();
				}
				utils.progressOff();
			}
		});
	};

	this.rewriteHistory = function(scr){
		var self = this;
		var item = ('#HistoryTree li.selected').length ? $('#HistoryTree li.selected').attr('id') : 0;
		var tab = self.main.tabs.getActiveTab().hidx!=null ? self.main.tabs.getActiveTab().hidx : 0;
		var link = new LinkHistory(lex('UsersHistory'), lex('UsersHistory'), function(){
			self.initHistory(item, tab, null,function(){
				if (scr){
					var el = $('.forHistory #'+scr.id);
					el.addClass('selected');
					var scrollEl = el.parent().parent();
					var offset = (el.get(0).offsetTop-scrollEl.get(0).offsetTop)-scr.offset;
					scrollEl.scrollTo(
						{top:offset+'px', left:'0px'}
					)
				}
			});
		});
		self.linkHistory = self.main.history.rewrite(link);
	}
	
	this.cross = function(event){
		var self = this;

		this.main.list.cross(
			event,
			$('#workspace ul.forHistory:visible').eq(0),
			function(element){
				 $(element).click();
				 return true;
			},
			true
		);
		
	};
	
	this.lifetimeHistory = function(){
		var self = this;	
		$.ajax({
			url: this.main.path.URL_HISTORY_LIFETIME,
			dataType: "html",
			type: "get",
			error: function(er){
				dbg.msg(er);
			},
			success: function(html){
				var dialogEl = $("div#dialog");
				$("div#dialog").append(html);
							
				$('div#dialog .lifetime form').ajaxForm({
					dataType:'json',
					beforeSubmit:function(json){
						$('div#dialog').addClass('progress');
						$('div#dialog .lifetime').hide()
					},
					success: function(json){
						$('div#dialog').removeClass('progress');
						$('div#dialog .lifetime').show();
						if (json.result == 'success') {
							$('div#dialog .lifetime .unsuccess').hide()
							$('div#dialog .lifetime .success').show();
						}
						else {
							$('div#dialog .lifetime .success').hide();
							$('div#dialog .lifetime .unsuccess').html('������: <br/>' + json.result).show();
						}
					}
				});
				utils.hideFlash();
				self.dialog = dialogEl.dialog({
					autoOpen: true,
					width: 495,
					height: 250,
					closeOnEscape: true,
					position: 'center',
					modal: true,
					draggable: false,
					close: function() {
						$(this).dialog('destroy');
						$("#dialog").empty();
						utils.showFlash();
						return;
					}
				});
			}
		});
					
	}
	
	this.closeDialog = function(){
		if (this.dialog!=null){
			this.dialog.dialog('destroy');
			this.dialog=null;
			$('#dialog').empty();
			$('#dialog').hide();
		};
	};

	
	this.submitLifetime = function(){	
		$('#dialog .lifetime form').submit();
	}
	
	this.showCntInfo = function(cnt,el){
		var sel = $('.iSearchInfo:visible .info');
		var total = $('.total',sel);
		var val = $('.total .value',sel);
		if (cnt){
			sel.show();
			total.show();
			val.html(cnt);
		}else{
			total.hide();
		}
		var current = $('.current_num',sel);
		var val = $('.current_num .value',sel);
		if (el && el.length && el.hasClass('selected')){
			current.show();	
			val.html(el.attr('cnt'));
		}else{
			current.hide();	
		}
		
	}

	
	this.init();
}
