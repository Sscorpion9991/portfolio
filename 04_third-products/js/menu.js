function  Menu(main){
	this.appList = new Array();
	// Порядок элементов в этом массиве определяет порядок вывода в основном меню
	this.properties = {
		'find' : {
			title: lex('TextFind'),
			spec: true,
			code: 'ctrl+f'
		},
		'table_content' : {
			title: lex('Contents'),
			spec: true
		},
		'show_preview' : {
			title:'Предпросмотр',
			spec: true,
			mobile: false
		},
		'hide_notes' : {
			title:'Скрыть примечания',
			spec: true
		},
		'show_notes' : {
			title:'Показать примечания',
			spec: true
		},		
		'print' : {
			title:lex('print'),
			description:'распечатать весь текст документа или выбранный фрагмент',
			hotKey: ['Ctrl','P'],
			code: 'ctrl+p',
			mobile: false
		},
		'word' :{
			title: lex('openToWord'),
			description:'отправить текст документа в Microsoft Word',
			hotKey: ['Ctrl','M'],
			code: 'ctrl+m',
			mobile: false
		},
		'save' : {
			title: lex('saveToFile'),
			hotKey: ['Ctrl','S'],
			code: 'ctrl+s',
			mobile: false
		},
		'bookmark_set' :{
			title: lex('setBookmark'),
			description:'Поставить закладку на выбранный фрагмент документа',
			hotKey: ['Ctrl','B'],
			code: 'ctrl+b'
		},
		'folder_put' :{
			title: lex('putToFolder'),
			description:'Сохранить документ в «Папках пользователя»',
			hotKey: ['Ctrl','U'],
			code: 'ctrl+u'
		},
		'prevDocISearch' :{
			title: 'Перейти к предыдущему документу',
			specAlter: true
		},
		'listDocISearch' :{
			title: 'Вернуться в список',
			specAlter: true
		},
		'nextDocISearch' :{
			title: 'Перейти к следующему документу',
			specAlter: true
		},
		'prevDoc' :{
			title: 'Перейти к предыдущему документу',
			specAlter: true
		},
		'listDoc' :{
			title: 'Вернуться в список',
			specAlter: true
		},
		'nextDoc':{
			title: 'Перейти к следующему документу',
			specAlter: true
		},
		'removeBookmarks' :{title: lex('deleteSelItems')},
		'importUData' :{title: lex('ImportMaterials')},
		'exportUData' :{title: lex('ExportMaterials')},
		'lifetimeHistory' :{title: lex('ConfigureHistory')},
		'tree':{
			title: lex('ShowPanel'),
			spec:true
		},
		'put_control':{
			title: lex('putControl'),
			description:'получать оперативные уведомления обо всех изменениях данного документа',
			hotKey: ['Ctrl','L'],
			code: 'ctrl+l'						
		},
		'remove_control':{
			title: lex('removeControl'),
			description:'отказаться от получения оперативных уведомлений обо всех изменениях данного документа',
			hotKey: ['Ctrl','T'],
			code: 'ctrl+t'
		},
		'closeFrame':{
			title: lex('closeTwoWindows'),
			mobile: false
		}
		/*
		Горячие клавиши, занятые сервисом «АРЗ» в связи с требованием СКК.
		'arzToArhiv':{
			hotKey: ['Ctrl','G']
			code: 'ctrl+g'
		},
		'arzDelToArh': {
			hotKey: ['Ctrl','H']
			code: 'ctrl+h'
		}*/
	};

	this.cMenu2Menu = {
		'print':['.docItem','.document .text'],
		'word':['.docItem','.document .text'],
		'save':['.docItem','.document .text'],
		'bookmark_set':['.docItem','.document .text'],
		'folder_put':['.docItem','.document .text'],
		'removeBookmarks':['.docItem','.document .text'],
		'put_control':['.docItem','.document .text'],
		'remove_control':['.document .text']
	}

	this.properties['copy'] = {
		title: lex('copy'),
		mobile: false
	};
	this.properties['copyLink'] = {
		title: lex('copyDocLink'),
		mobile: false
	};
	this.properties['similarTexts'] = {title: lex('similarTexts')};
	
	this.main = main;
	
	this.init = function(){
		var self = this;
		this.hotkeys();
		$('#kMenu').mousedown(function(){return false;})
		$('.kMenuButton li').mousedown(function(){return false;})
		
		if (!$('#header').hasClass('kMenu')) return;
		this.body = $('#kMenu .kMenuList');
		$('body').live('click',function(){
			self.close();
		});
		$('#kMenu .kMenuButton').hover(function(){
			$('#kMenu').addClass('hover');
//			self.timeoutId = setTimeout(
//			,400)
		},function(){
			$('#kMenu').removeClass('hover');
			clearTimeout(self.timeoutId);
		});
		
		$('#kMenu .kMenuButton').click(function(){
			self.selection = utils.getSelection();
			if (self.body.is(':visible')){
				self.close(el);
				self.main.contextMenu.helpIeReviveSelection();
				return;
			};
			var el = $(this);
			if (el.parent().hasClass('kMenuInactive')) return; 
			setTimeout(function(){
				self.open(el);
			},100);
		});	

		this.main.icons.redraw = function(){
			self.redraw();
		};
		
		$('.kMenuList li, #icons.kMenu .ico').live("click",function(){
			self.main.icons.click(this);
		});
		this.main.icons.sort = function(){};
//		this.main.icons.hide = function(){};
//		this.main.icons.show = function(){};
		$('#icons').addClass('kMenu');
		this.main.icons.append = function(name, html){
			self.append(name, html)
		};
		if (/help=true/.test(window.location)){
			this.properties['print'].spec = true;
		}
		
		this.initNavigators();
	};
	this.redraw = function(){
		var res = false;
		for (var i in this.main.icons.state){
			if(this.main.icons.state[i] == true){
				res = true;
				break;
			}
		}
		var offset = null;
//		if (res){
			$('#header').addClass('kMenu');
			offset = 57;
//		}else{
//			$('#header').removeClass('kMenu');
//		}
		
		if (this.main.tabs.tabs && this.main.tabs.tabs.length<2 && $('#icons .ico:visible').length == 0){
			this.main.tabs.hidePanel(offset);
		}else{
			this.main.tabs.showPanel();
		}
		var list = this.getList();
		var html = this.tmpl(list);
		this.body.html(html);
		this.ie();
		this.ctrlContextMenu();
	
	};
	this.open = function(el){
		this.selection = utils.getSelection();
		$('#kMenu').addClass('kMenuOpen');
		this.body.show();
		if (window.isEda && (this.main.eda.onOpenMenu != null))
			this.main.eda.onOpenMenu();
		this.main.contextMenu.helpIeReviveSelection();
	};
	this.close = function(el){
		var self = this;
		$('#kMenu').removeClass('kMenuOpen');
		this.body.hide();
		if (window.isEda && (this.main.eda.onCloseMenu != null))
			this.main.eda.onCloseMenu();
	};
	this.getList =  function(){
		var list = new Array();
		for (var i in this.main.icons.state){
			if(this.main.icons.state[i] == true){
				list.push(i);
			}
		}
		for (var i in this.appList){
			list.push(this.appList[i]);
		}
		return this.sort(list);
	};
	
	this.sort = function(list){
		var res = new Array();
		for (var i in this.properties){
			for (var j in list){
				if (list[j] == i){
					res.push(list[j]);
				}
			}
		}
		return res;
	}
	
	this.append = function(name,className,html){
		var nameSpec = (this.main.document.isTestDB)? name.split('-')[0] : name;
		if (this.properties[nameSpec]) {
			if (this.properties[nameSpec].spec)
				$('#icons').append('<div title="' + this.properties[nameSpec].title + '"  id="ico_'+name+'" class="ico '+className+'" ><span class="pic"> </span>'+this.properties[nameSpec].title+'</div>');
			else if (this.properties[nameSpec].specAlter)
				$('#icons').append('<div id="ico_'+name+'" class="ico '+className+'" title="' + this.properties[nameSpec].title + '" ><span class="pic"> </span></div>');
		}
	}
	
	this.tmpl = function(list){
		var html = '<div class="menuCorner"></div>';
		html += '<ul>';
		var cnt = 0;
		for (var i in list){
			if (this.properties[list[i]] == null) continue; 
			if (this.properties[list[i]] && this.properties[list[i]].spec) continue;
			if (window.mobile && this.properties[list[i]].mobile === false) continue;
			var className = '';
			if (i==0){
				className = ' first';
			}
			if (i==list.length-1){
				className = ' last';
			}
			var des = this.properties[list[i]].description;
			var hotKey = this.properties[list[i]].hotKey;
			var hotKeyHtml = ""
			if (hotKey!=null && typeof (hotKey)== 'object'){
				hotKeyHtml = '<div class="hotkey">';
				for(var j in hotKey){
					if (j!=0) hotKeyHtml+='+';
					hotKeyHtml+= '<span>'+hotKey[j]+'</span>';
				}
				hotKeyHtml+='</div>';
			}
			if (!des) des = '';
			cnt++;
			html += '<li id="ico_'+list[i]+'" class="'+list[i]+className+'">'+
				'<div class="pic"> </div>'+hotKeyHtml+
				'<p class="title">'+this.properties[list[i]].title+'</p>'+
				'</li>';
		}
		//console.log(">>"+cnt);
		if (cnt>0){
			$('#kMenu').removeClass('kMenuInactive')
		}else{
			$('#kMenu').addClass('kMenuInactive')
		}
		html += '</ul>';
		return html;
	};
	this.ie = function(name,html){
		if ($.browser.msie ) {
			$('.kMenuList').css('border','1px solid grey');
		}
	}
	this.add = function(code,action){
		this.remove(code);
		this.main.icons.action[code]=action;
		this.appList.push(code);
		this.redraw();
	}
	this.remove = function(code){
		for (var i in this.appList){
			if (code==this.appList[i]){
				this.appList.splice(i,1);
				this.redraw();
				break;
			}
		}
	}
	this.hotkeys = function(){
		var self = this;
		for (var i in this.properties){
			if (this.properties[i].code != null){
				key(this.properties[i].code, function(event, handler){
					//console.log(handler.shortcut);
					return self.hotkeysRun(handler.shortcut);
				});			}
		}
	}
	this.hotkeysRun = function(code){
		var self = this;
		for (var i in this.properties){
			if (this.properties[i].code == code){
				if (this.main.icons.state[i] == true && this.main.icons.action[i]!= null && typeof this.main.icons.action[i] == 'function'){
					this.main.icons.action[i]();
					return false;
				}
			}
		}
		return true;
	}
	this.ctrlContextMenu = function(){
		var state = this.main.icons.state;
		for(var i in this.cMenu2Menu){
			//console.log('REMOVE:'+this.properties[i].title)
			this.main.contextMenu.remove(this.properties[i].title);
		}
		for(var i in state){
			if(state[i] == true){
				this.regContextMenu(i);
			}
		}
	}
	this.regContextMenu = function(key){
		var self = this;
		if (this.cMenu2Menu[key]==null){
			return;
		}
		var action = function(){
			if (self.main.icons.action[key] && typeof self.main.icons.action[key] == 'function'){
				self.main.icons.action[key]();
			}
		}
		
		var name = key;
		if (this.properties[key] && this.properties[key].title){
			name = this.properties[key].title;
		}
		
		this.main.contextMenu.remove(name);
		for (var i in this.cMenu2Menu[key]){
			this.main.contextMenu.reg(
				this.cMenu2Menu[key][i],
				name,
				action,
				true
			);
		}
	}
	this.initNavigators = function() {
		if($('.kNavList li').length > 0) {
			var self = this;
			$('.kNavContainer').unbind('mouseenter mouseleave');
			$('.kNavContainer').hover(function(){
				$('.kNavContainer').addClass('hover');
				$('.kNavList').css('opacity','0').css('display','block');
				$('.kNavList').css('display','none').css('opacity','1');
				self.navTimeoutShow = setTimeout(function() {
					$('.kNavList').fadeIn(200, function () {
						if (window.isEda && (self.main.eda.onShowNavigator != null))
							self.main.eda.onShowNavigator();
					});
					clearTimeout(self.navTimeoutHide);
				}, 800);
				clearTimeout(self.navTimeoutHide);
			},function(){
				$('.kNavContainer').removeClass('hover');
				self.navTimeoutHide = setTimeout(function() {
					$('.kNavList').fadeOut(200, function () {
						if (window.isEda && (self.main.eda.onHideNavigator != null))
							self.main.eda.onHideNavigator();
					});
					clearTimeout(self.navTimeoutShow);
				}, 200);
				clearTimeout(self.navTimeoutShow);
			});
			$('.kNavContainer').live('click',function() {
				$('.kNavContainer').removeClass('hover');
				$('.kNavList').fadeOut(10);
				clearTimeout(self.navTimeoutShow);
				clearTimeout(self.navTimeoutHide);
				if (window.isEda && (self.main.eda.onHideNavigator != null))
					self.main.eda.onHideNavigator();
			});
		}
	}
	this.init();
}