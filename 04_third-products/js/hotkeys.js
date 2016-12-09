function Hotkeys(main){
	this.main=main;
	this.timeOut = null;

	this.init = function () {
	    var self = this;

		var mouseEvent = 'keydown';
		if($.browser.msie && $.browser.version < 9) {
			var mouseEvent = 'keypress';
		}
	    $(window).bind(mouseEvent, function (event) {
//	    	console.log(event.which);
	        var alt = event.altKey;
	        var ctr = event.ctrlKey;
	        var shif = event.shiftKey;
	        var keyKode = event.which;
	        var f = $('*:focus'); //Элемент в фокусе. Тоже самое: document.activeElement
	        var tool_tip = $('.suggest, .printDjvuDlg').length;
	        if (f.attr('className') == 'quickFilter')
	            var focus_active = ($('.quickFilterVal').attr('innerHTML').length ? true : false);
	        else
	            var focus_active = (f.length ? true : false);


	        if (keyKode == 83 && ctr) { //Ctrl+s			
	            self.defaultFunctionDisable(event);
	            var icon = $('#ico_save');
	            if (self.main.document.isDocument()) { //utils.isLocal()
	                if ($('#ico_save').length) self.main.document.save();
	                return false;
	            } else if (icon.length) {
	                if (icon.attr('className').split('_')[0] == 'bookmarks') {
	                    self.main.document.save(self.main.bookmarks.printUrl + self.main.bookmarks.checkSelection() + '&filename=Список документов.rtf');
	                } else if (icon.attr('className').split('_')[0] == 'history') {
	                    var selection = self.main.userHistory.checkSelection();
	                    if (selection == '') {
	                        self.main.document.save(self.main.userHistory.printUrl + self.main.userHistory.printAction + '&filename=Список документов.rtf');
	                    } else {
	                        self.main.document.save(self.main.userHistory.printUrl + '&action=events_by_idList' + selection + '&filename=Список документов.rtf');
	                    }
	                }
	            }
	        }

	        if (keyKode == 80 && ctr) { //Ctrl+p				
	            //if (self.main.document.isDocument()) {
	            var icon = $('#ico_print');
	            if (icon.length) {
	                if (icon.attr('className').split('_')[0] == 'bookmarks') {
	                    self.main.document.print(self.main.bookmarks.printUrl + self.main.bookmarks.checkSelection());
	                } else if (icon.attr('className').split('_')[0] == 'history') {
	                    var selection = self.main.userHistory.checkSelection();
	                    if (selection == '') {
	                        self.main.document.print(self.main.userHistory.printUrl + self.main.userHistory.printAction);
	                    } else {
	                        self.main.document.print(self.main.userHistory.printUrl + '&action=events_by_idList' + selection);
	                    }
	                } else {
	                    self.main.document.print();
	                }
	            }
	            return false;
	            //}
	        }
	        if (keyKode == 76 && ctr) {
	            if (self.main.icons.state['put_control'] == true) {
	                self.main.document.addToControlled();
	            }
	            return false;
	        }
	        if (keyKode == 84 && ctr) {
	            if (self.main.icons.state['remove_control'] == true) {
	                self.main.document.removeFromControlled();
	            }
	            return false;
	        }
	        if (keyKode == 192 && ctr) {
	            self.main.document.startTestTools();
	            return false;
	        }
	        if (keyKode == 112) { //f1		
	            self.defaultFunctionDisable(event);
	            document.onhelp = new Function("return false;");
	            window.onhelp = new Function("return false;");
	            if ($('#helpUF').length) {
	                var url = $('#helpUF').attr('href');
	            } else if($('#helpLink').length){
	                var url = $('#helpLink').attr('href');
	            } else {
	            	var url = $('#staticHelpLink').attr('href');
	            }
	            window.open(url, 'help');
	            return false;
	        }

	        if (keyKode == 27 && tool_tip) { //На Esc убрать всплывающую подсказку //killSuggest
	            self.main.tooltip.killSuggest();
	            return false;
	        }


	        if (keyKode == 70 && ctr) { //Ctrl+f			
	            self.defaultFunctionDisable(event);
	            if (self.main.document.isDocument()) {
	                if ($('#ico_find').length) {
	                    self.main.document.textSearch.toggle($('#ico_find')[0]);
	                    return false;
	                };
	            }
	        }

	        if (keyKode == 83 && alt) { //Alt+f
	            self.defaultFunctionDisable(event);
	            self.main.search.search(null, null, 'asearch');
	            return false;
	        }

	        if (keyKode == 73 && alt) { //Alt+i		
	            self.defaultFunctionDisable(event);
	            $('#context').focus();
	            return false;
	        }

	        if (keyKode == 37 && alt) { //Alt+left
	            self.defaultFunctionDisable(event);
	            self.main.history.prev();
	            return false;
	        }

	        if (keyKode == 39 && alt) { //Alt+right
	            self.defaultFunctionDisable(event);
	            self.main.history.next();
	            return false;
	        }

	        if (keyKode == 38 && self.main.panel.treeProcessing) { // tree + up
	            self.defaultFunctionDisable(event);
	            self.keyUpTree(event);
	            return false;
	        }
	        if (keyKode == 40 && self.main.panel.treeProcessing) { // tree + down
	            self.defaultFunctionDisable(event);
	            self.keyDownTree(event);
	            return false;
	        }
	        if ((keyKode == 37 || keyKode == 109) && self.main.panel.treeProcessing) { // tree + left или tree + "-"
	            self.defaultFunctionDisable(event);
	            if ($('#tree:visible').length) {
	                var selected = $('#tree li .selected:visible');
	                if (selected) {
	                    self.main.panel.closeNode(selected.find('span.close'));
	                }
	            }
	            return false;
	        }

	        if ((keyKode == 39 || keyKode == 107) && self.main.panel.treeProcessing) { // tree + right или tree + "+"
	            self.defaultFunctionDisable(event);
	            if ($('#tree:visible').length) {
	                var selected = $('#tree li .selected:visible');
	                if (selected) {
	                    self.main.panel.openNode(selected.find('span.open'));
	                }
	            }
	            return false;
	        }

	        if (keyKode == 106 && self.main.panel.treeProcessing) { // tree + "*"
	            self.defaultFunctionDisable(event);
	            if ($('#tree:visible').length) {
	                self.main.panel.tree_expand();
	            }
	            return false;
	        }

	        if (keyKode == 13 && self.main.panel.treeProcessing) { // tree + "enter"
	            if (!$('#tree:visible div#FoldersTree:visible').length) {
	                self.defaultFunctionDisable(event);
	                var selected = $('#tree li .selected:visible').parent();
	                if (selected.length) {
	                    self.main.document.openLink(selected.find('p.doc'), event);
	                }
	                return false;
	            } else if ($('p.folder input.new').length > 0) {
	                var input = $('p.folder input.new');
	                var inputValue = input.attr('value');
	                var p = input.parent();
	                p.empty();
	                p.html(inputValue);
	            }
	        }
	        if (keyKode == 13 && self.main.list.lock) { // folderDialog + "enter"
	            self.defaultFunctionDisable(event);
	            $("#dialog .yes p").click();
	            return false;
	        }

	        if ((keyKode == 8 && shif) || (keyKode == 8 && !focus_active)) {
	            self.defaultFunctionDisable(event);
	            self.main.history.prev();
	            return false;
	        }

	        if (keyKode == 114) {
	            self.defaultFunctionDisable(event);
	            if (shif) { 	// shift+F3
	                if (self.main.document.isDocument() && ($('.textSearch .cross .prev').length > 0)) {
	                    self.main.document.textSearch.prevMatch($('.textSearch .cross .prev'));
	                }
	            } else {	 	// F3
	                if (self.main.document.isDocument() && ($('.textSearch .cross .next').length > 0)) {
	                    self.main.document.textSearch.nextMatch($('.textSearch .cross .next'));
	                }
	            }
	            return false;
	        }

	        if ($('#dialog:visible').length == 0 && $('.activeDoc .text').length && !tool_tip) { //Прокрутка открытого документа когда фокус "свободен", не открыта подсказка при поиске
	            if (keyKode == 38) {
	                $('.activeDoc .text').scrollTo({ top: '-=20px', left: 0 });
	                return false;
	            } else if (keyKode == 40) {
	                $('.activeDoc .text').scrollTo({ top: '+=20px', left: 0 });
	                return false;
	            }
	        }

	        if ($('.activeDoc .text').length) {
	            if (keyKode == 33 || keyKode == 34) {
	                var plu = '+';
	                if (keyKode == 33) plu = '-';
	                $('.activeDoc .text').scrollTo({ top: (plu + '=' + $('.activeDoc .text').height()), left: 0 });
	                return false;
	            }
	        }

	        return true;
	    });


	}
	
	this.selectScrollElement = function(parentNode, event){
		var self = this;
		var parent = parentNode;
		var parent_scroll_top = parent.scrollTop();
		var child = $('ul', parent);
		
		//if(parent_scroll_top > parent.height()) {			
			
			var height_li = 0;
			
			$('ul li.docItem', parent).each(function(i, el){

				var p_top = parseInt($(this).css('padding-top'));
				var p_bottom = parseInt($(this).css('padding-bottom'));
				
				height_li += $(this).height() + p_top + p_bottom;			
				
				if(height_li > parent_scroll_top) {
					$(this).addClass('selected');					
					return false;
				}				
			});			
		//}
	}
	
	// Р¤СѓРЅРєС†РёСЏ РґР»СЏ СѓР±РёРІР°РЅРёСЏ СЃС‚Р°РЅРґР°СЂС‚РЅС‹С… СЃРѕР±С‹С‚РёР№ Р±СЂР°СѓР·РµСЂРѕРІ
	this.defaultFunctionDisable = function(evt) {
		if($.browser.msie) { 
        	event.keyCode = 0; 
	    	event.returnValue = false;
	    	event.cancelBubble = true;
		} else {
        	evt.stopPropagation();
        	evt.preventDefault();
    	}
	}
	
	this.getActivElement = function() {		
		var self = this;
		
		self.timeOut = window.setTimeout(function(){
			return false;												  
		}, 500);		
	}

	this.countChildPosition = function(elem) {
		this.childPos += elem.position().top;
		this.childPos += elem.outerHeight();
		if(elem.parent().parent().hasClass('catalog')) {
			return true;
		} else {
			this.countChildPosition(elem.parent().parent().prev());
		}
	}

	this.scroolItem = function(direction) {
		var child = $('ul.catalog li .selected');
		var parent = $('ul.catalog');
		
		this.childPos = 0;
		this.countChildPosition(child);
		this.childPos = this.childPos - child.height();
		
		var yDiff = parent.innerHeight() - this.childPos;
		var offset = parent.height()-child.outerHeight();
		
		if(this.childPos < 0) { // up
			$('ul.catalog:visible').scrollTo($('ul.catalog li .selected'));
		} else if(yDiff < child.outerHeight()) { // down
			$('ul.catalog:visible').scrollTo($('ul.catalog li .selected'),'',{offset:-offset});
		}
	}
	
	this.keyUpTree = function(event) {
		var selected = $('#tree li .selected:visible').parent();
		$('#treeQuickFilter').blur();
		var self = this;
		if (!selected.length) {
			var last_elem = $('#tree li div:visible:last');
			last_elem.addClass('selected');
			self.scroolItem();
			return;
		}

		$('#tree li div:visible').removeClass('selected');

		if (selected.prev().find('ul li div:visible').last().length) {
			var prev = selected.prev().find('ul li div:visible').last();
			prev.addClass('selected');
			self.scroolItem();
			return;
		}

		if (selected.prev().length) {
			selected.prev().get(0).children[0].className += ' selected';
		} else {
			var prev = selected.parent().parent().filter('li');
			if (prev.length) {
				prev.get(0).children[0].className += ' selected';
			} else {
				var last_elem = $('#tree li:visible:last');
				last_elem.get(0).children[0].className += ' selected';
			}
		}
		self.scroolItem();
	}

	this.keyDownTree = function(event) {
		var selected = $('#tree li .selected').parent();
		$('#treeQuickFilter').blur();
		var self = this;
		if (!selected.length) {
			var first_elem = $('#tree li div:visible:first');
			first_elem.addClass('selected');
			self.scroolItem();
			return;
		}

		$('#tree li div:visible').removeClass('selected');

		var sub_ul = selected.find('ul li div:first:visible');
		if (sub_ul.length) {
			sub_ul.addClass('selected');
			self.scroolItem();
			return;
		}

		if (selected.next().length) {
			selected.next().get(0).children[0].className += ' selected';
		} else {
			var element = selected.parent().parent();
			var next;
			while(!element.hasClass('tree')) {
				if(element.next().filter("li").length) {
					next = element.next().filter("li");
					break;
				}
				element = element.parent().parent(); 
			}
			
			if(!element.hasClass('tree')) {
				next.get(0).children[0].className += ' selected';
			} else {
				var first_elem = $('#tree li:first:visible');
				first_elem.get(0).children[0].className += ' selected';
			}
			
		}
		self.scroolItem();
	}
	
	this.keyUpList = function() {
		var selected = $('ul.list li.selected:visible');
		var self = this;
				
		if (!selected.length) {
			var last_elem = $('ul.list li:visible:last');
			if (!self.isPartList(last_elem)) {
				last_elem.addClass('selected');
				self.scroolItemList(last_elem);
			}
			return;
		}
				
			if (selected.prev().length) {
				if (!self.isPartList(selected.prev())) {
					selected.removeClass('selected');
					selected.prev().addClass('selected');
					self.scroolItemList(last_elem);
				}
			} else {
				var prev = selected.parent().parent().filter('li');
				if (prev.length) {
					if (!self.isPartList(prev)) {
						selected.removeClass('selected');
						prev.addClass('selected');
						self.scroolItemList();
					}
				} else {
					var last_elem = $('ul.list li:visible:last');
					if (!self.isPartList(last_elem)) {
						selected.removeClass('selected');
						last_elem.addClass('selected');
						self.scroolItemList();
					}
				}
					
			}
	}

	this.keyDownList = function() {
		var selected = $('ul.list li.selected');
		var self = this;
				
		if (!selected.length) {
			var first_elem = $('ul.list li:visible:first');
			if (!self.isPartList(first_elem)) {
				selected.removeClass('selected');
				first_elem.addClass('selected');
				self.scroolItemList();
			}
			return;
		}
				
		if (selected.next().length) {
			if (!self.isPartList(selected.next())) {
				selected.removeClass('selected');
				selected.next().addClass('selected');
				self.scroolItemList();	
			}
		} else {
			var next = selected.parent().parent().next().filter('li');
			if (next.length) {
				if (!self.isPartList(next)) {
					selected.removeClass('selected');
					next.addClass('selected');
					self.scroolItemList();
				}
			} else {
				var first_elem = $('ul.list li:first:visible');
				if (!self.isPartList(first_elem)) {
					selected.removeClass('selected');
					first_elem.addClass('selected');
					self.scroolItemList();
				}
			}
					
		}	
	}
	
	this.scroolItemList = function(elem) {
		var self = this;		
		var catalog = $('div.scroll:visible');
		var selected = $('div.scroll li.selected span:first:visible');
		var height = catalog.height();
		if (!selected.get(0)) return;
		var offsetTop = selected.get(0).offsetTop;
		var heigthSelected = selected.height();
		var scroolTop = $('div.scroll').get(0).scrollTop;

		var indent =160;

		if (offsetTop-indent+heigthSelected>height+scroolTop) {
			var scr = offsetTop-height+heigthSelected+30-indent;
			if (scr<0) scr = 0;
			catalog.scrollTo(scr);
			return;
		}		

		if (offsetTop-indent<scroolTop) {
			var scr = offsetTop-heigthSelected-indent;
			if (scr<0) scr = 0;
			catalog.scrollTo(scr);
		}
	}
	
	this.hotKeyCorrelation = function(i) {
	    var obj = {
        'Ё':192,
		'Й':81,
		'Ц':87,
		'У':69,
		'К':82,
		'Е':84,
		'Н':89,
		'Г':85,
		'Ш':73,
		'Щ':79,
		'З':80,	
		'Х':219,
		'Ъ':221,
		'Ф':65,
		'Ы':83,
		'В':68,
		'А':70,
		'П':71,
		'Р':72,
		'О':74,
		'Л':75,
		'Д':76,
		'Ж':186,
		'Э':222,
		'Я':90,
		'Ч':88,
		'С':67,
		'М':86,
		'И':66,
		'Т':78,
		'Ь':77,
		'Б':188,
		'Ю':190
		};
		
		if(obj[i] == 'undefined') alert('Не корректная привязка событий к вкладкам.\nФаил hotkeys.js, строка 484.');		
		return obj[i];
	}
	
	
	this.init();
}
