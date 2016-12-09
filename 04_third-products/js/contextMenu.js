function ContextMenu(main){
	
	if (typeof customizedContextMenu != 'undefined') {
		if(customizedContextMenu(this, main) == true)
			return;
	}
	
	this.body = $('body');
	this.cnt = 0;
	ZeroClipboard.setMoviePath( 'ZeroClipboard10.swf' );
	this.classMap = {};
	this.classMap[lex('print')] = 'cxtMenuPrint';
	this.classMap[lex('setBookmark')] = 'cxtMenuBookmark';
	this.classMap[lex('copy')] = 'cxtMenuCopy';
	this.classMap[lex('copyDocLink')] = 'cxtMenuCopyLink';
	this.classMap[lex('closeTwoWindows')] = 'cxtMenuCTW';
	this.classMap[lex('openRightWindow')] = 'cxtMenuOPW';
	this.classMap[lex('openLeftWindow')] = 'cxtMenuOPW';
	this.classMap[lex('openNewWindow')] = 'cxtMenuONW';
	this.classMap[lex('findSimilarTexts')] = 'cxtMenuSimilar';

	this.map = new Array();
	this.main = main;
	this.checkFlash = utils.checkIfFlashEnabled();
	this.sortList = [lex('copy'),'-',lex('print'),lex('openToWord'),lex('saveToFile'),'-', lex('deleteSelItems'),'-',lex('setBookmark'), lex('putToFolder'), lex('putControl'),lex('removeControl'), lex('findSimilarTexts'), '-',lex('openNewWindow'),lex('openRightWindow'),lex('openLeftWindow'),lex('closeTwoWindows'), '-', lex('copyDocLink')]
//	this.body.bind('onmouseup',function(e){
//		return true;
//	});
	var self = this;
	this.body.bind('mouseup', function(event) { // ужасный, ужасный, ужасный костыль для IE - снимает выделение при клике 
		if(($.browser.msie) && (event.which == 3)) {
			self.helpIeReviveSelection();
			setTimeout(function(){
				self.helpIeReviveSelection();
			},80);
	    }
	});
	this.body.live('click',function(){
		self.closeAll();
	});
	this.body.bind('mousedown',function(e){
		var list = null;
		if (window.mobile) return;
		if(e.which == 3) {
			list = self.getMenuItems(e.target);
			self.closeAll();
		}
		if(list == null || list.length==0) {
			this.oncontextmenu=new Function("return true");
			if($.browser.msie) {
				this.onmousedown=function(){return true;};
			} else {
				this.onmouseup=function(){return true;};
				this.oncontextmenu=function(){return true;};
			}
			return true;
		}
		self.open(list,e);
		this.oncontextmenu=new Function("return false");
		var message = "";			
		if ($.browser.msie){
			this.onmousedown=function(){return false;};
		}else{
			this.onmouseup=function(){return false;};
			this.oncontextmenu=function(){return false;};
		}
		return false;
	});
};
ContextMenu.prototype.reg = function(selector, name, action,notRemove){
	if (notRemove == null){
		this.remove(name);
	}
	this.map.push({
		selector:selector,
		name: name,
		action:action
	});
}
ContextMenu.prototype.remove = function(name){
	for (var i in this.map){
		if (this.map[i].name == name){
			this.map.splice(i, 1);
			this.remove(name);
			break;
		}
	}
}
ContextMenu.prototype.getMenuItems = function(el){
	var jEl = $(el);
	var self = this;
	var parents = jEl.parents();
	var list = new Array();
	for (var i in this.map){
		parents.each(function(){
			if($(this).is(self.map[i].selector)){
				self.map[i].el = this;
				list.push(self.map[i]);
			}
		});
		
		if(jEl.is(self.map[i].selector)){
			self.map[i].el = jEl.get(0);
			list.push(self.map[i]);
		}
	}
//	list.push({
//		el:el,
//		name: 'Copy',
//		action:function(){
//			CopiedTxt = document.selection.createRange();
//			CopiedTxt.execCommand("Copy");
//		}
//	});
	return this.sort(list);
}
ContextMenu.prototype.sort = function(list){
	var res = new Array();
	if(list.length == 0){
		return res;
	}
	for(var i in this.sortList){
		if(this.sortList[i]=='-'){
			if(res[res.length - 1]!= null && res[res.length - 1] != "separator"){
				res.push("separator");
			}		
			continue;
		} 
		for(var j in list){
			if (list[j] && list[j].name && list[j].name == this.sortList[i]){
				res.push(list[j]);
				list[j] = null;
			}
		}
		
	}
	for(var i in list){
		if (list[i]!=null){
			res.push(list[i]);
		}
	}
	return res;
}

ContextMenu.prototype.open = function(list,event){
	var self = this;
	this.cnt++;
	var html = '<div id="contextMenu_'+this.cnt+'" class="contextMenu"><ul>';
	var flashButton = false;
	var selectedText = utils.getSelectedText();
	var txt = self.checkFlash ? selectedText : null;
	var copyLinkItemId = '';
	for (var i = 0 ; i < list.length ; i++){
		if (list[i] == "separator"){
			if(i != 0 && i != list.length-1 && list[i-1] != "separator"){
				html += '<div class="separator"> </div>';
			}
			continue;
		}

		var className = '';
		if (this.classMap[list[i].name]) className = ' '+this.classMap[list[i].name];

		if(list[i].name == lex('findSimilarTexts')){			
			if(self.main.document.similarTexts != true){
				//если до него быд сепаратор и его нет, то перескакиваем сепаратор
				if(list[i-1] == "separator" && list[i+1] == "separator")
					i++;
				continue;
			} else {
				if(selectedText != null){
					//если текст выделенный есть, то кнопку надо показывать и вставляем перед ней сепаратор если его перед ней нет
					if(list[i-1] != "separator")
						html += '<div class="separator"> </div>';
				} else {
					if(list[i-1] == "separator" && list[i+1] == "separator")
						i++;
					continue;
				}
			}
		}

		if (list[i].name == lex('copy')){
			if(!window.isLocal && !window.isClient && self.checkFlash){
				if(txt != null && txt != ''){
					html+= 	'<li id="item_' + this.cnt + '_' + i + '" class="flashMenu ' + className + '">' +
								'<div id="copyButtonContainer" style="position:relative">' +
									'<button id="copyButton">' +
										lex('copy') +
									'</button>' +
								'</div>' +
							'</li>';
					flashButton = true;
				} else {
					i++;//перескакиваем сепаратор
				}
				continue;
			} else if(selectedText == null){
				i++;//перескакиваем сепаратор
				continue;
			}
			
		}
		if (list[i].name == lex('copyDocLink')){
			if(!window.isLocal && !window.isClient){
				copyLinkItemId = 'item_' + this.cnt + '_' + i;
				html+=	'<li id="' + copyLinkItemId + '" class="flashMenu '+className+'">' +
							'<div id="copyLinkButtonContainer" style="position:relative">' +
								'<button id="copyLinkButton">' +
									list[i].name +
								'</button>' +
							'</div>' +
						'</li>';
				flashButton = true;
				continue;
			}
		}
		html+= '<li id="item_'+this.cnt+'_'+i+'" class="'+className+'">'+list[i].name+'</li>';
	}
	html+= '</ul> </div>';
	this.body.append(html);
	var menu = $('#contextMenu_'+this.cnt);
	this.selection = utils.getSelection();
	menu.css({
		top: parseInt(event.clientY -20),
		marginLeft: parseInt(event.clientX)
	});
	var h = menu.height();
	var w = menu.width();
	
	if (event.pageY > $(window).height()-h){
		menu.css('top',event.clientY-h - 20);
	}
	if (event.pageX > $(window).width()-w){
		menu.css('left',event.clientX-w);
		menu.css('margin-left','0px');
	}
	for (var i in list){
		var el = $('#item_'+this.cnt+'_'+i);
		this.run(list[i], el);
	}
	this.cnt++;
	menu.click(function(e){
		self.closeAll();
		return false;
	});
	setTimeout(function(){
		self.helpIeReviveSelection();
		if (flashButton == true){
			var txt = utils.getSelectedText();
			if (!txt){
				return;
			}
			var clip = new ZeroClipboard.Client();
			clip.setText(txt.toString());
			clip.glue('copyButton','copyButtonContainer');
			// clip.addEventListener('onMouseOver', function(){console.log( "мышь над флешкой!" );});
			// clip.addEventListener('onMouseOut', function(){console.log( "мышь ушла от флешки!" );});
			// clip.addEventListener('onMouseDown', function(){console.log( "нажата кнопка мыши!" );});
			clip.addEventListener('onComplete', self.my_complete);
			
			// clip.addEventListener('onLoad', function(){console.log( "Флешка загрузилась!" );});
		}
	},80);
	setTimeout(function(){
		if (flashButton == true){
			var clip = new ZeroClipboard.Client();
			clip.setText(self.main.document.getLink());
			clip.glue('copyLinkButton', 'copyLinkButtonContainer');
			// clip.addEventListener('onMouseOver', function(){console.log( "мышь 2 над флешкой!" );});
			// clip.addEventListener('onMouseOut', function(){console.log( "мышь 2 ушла от флешки!" );});
			// clip.addEventListener('onMouseDown', function(){console.log( "нажата 2 кнопка мыши!" );});
			clip.addEventListener('onComplete', self.my_complete);
		
			// clip.addEventListener('onLoad', function(){console.log( "Флешка 2 загрузилась!" );});
		}
	},80);	
}
ContextMenu.prototype.my_complete = function( client, text ) {
    // console.log("Copied text to clipboard: " + text );
	$('body').click();
}

ContextMenu.prototype.helpIeReviveSelection = function() {
	if($.browser.msie) {
		if(this.selection) {
			var range = this.selection.selection;
			if (range) {
		        if (window.getSelection) {
		            sel = window.getSelection();
		            sel.removeAllRanges();
		            sel.addRange(range);
		        } else if (document.selection && range.select) {
		            range.select();
		        }
		    }
			this.main.document.selection = this.selection;
		}
    }
};

ContextMenu.prototype.run = function(item,el){
	var self = this;
	el.mousedown(function(){
		if(!el.hasClass("flashMenu")){
			return false;
		}
	});
	el.mouseup(function(e){
		self.helpIeReviveSelection();
		if($.browser.opera && el.hasClass("cxtMenuSimilar")){
			item.action(e,item.el);
			setTimeout(function(){
				self.closeAll();
			},200);
		} else if(!el.hasClass("flashMenu")){
			return false;
		}
	});
	el.click(function(e){
		var jEl = $(item.el);
		if (jEl.is('a')){
			if (self.main.document.longDocument.currentOffset != null){
				self.main.document.longDocument.currentOffset.el = item.el;
			}
		}
		if($.browser.opera && el.hasClass("cxtMenuSimilar")){
			return false
		}
		
		item.action(e,item.el);
		setTimeout(function(){
			self.closeAll();
		},200);
		
		return false;
	});
};

ContextMenu.prototype.closeAll = function() {
	$('.contextMenu').remove();
}