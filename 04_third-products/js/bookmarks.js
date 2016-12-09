function Bookmarks(main){
	this.main=main;
	this.dialog=null;
	this.activeFolder = null;
	this.container = null;
	this.name = null;
	this.tabBody = null;
	this.area = null;
	this.marker = null;
	this.query = null;
	this.linkHistory = null;
	this.printUrl = null;
	this.dialogOpened = false;
	this.drop = false;
	this.DoubleClick = false;
	this.shareFoldersLength = null;
	
	this.init = function(){
		var self=this;
		
		$('#userdata').live('click', function(){ self.loadContent(null, null, true); });
		
		$('ul.FoldersTree span.open').live('click', function(){ self.openNode(this); });
		$('ul.FoldersTree span.close').live('click', function(){ self.closeNode(this); });
		
		
		if (!window.noUserData) { 
			this.main.icons.reg('folder_put',function(){  self.showFolderPutDialog(this);  });
			this.main.contextMenu.reg('.document .text',lex('putToFolder'),function(){  self.showFolderPutDialog(this);  });
				
			this.main.icons.reg('bookmark_set',function(){  self.showBookmarkDialog(this);  });
			this.main.contextMenu.reg('.document .text',lex('setBookmark'),function(){  self.showBookmarkDialog(this);  });
		}
			
		
		$('#dialog .closeBookmarkDialog, #dialog .cancel').live('click', function(){ self.closeDialog(); });
		
		$('#dialog .bookmarks_add .apply .yellow').live('click', function(){ self.setBookmark(); });
		
		$('#dialog .put_to_folder .apply .yellow').live('click', function(){ self.putToFolder(this); });
		
		$('#dialog p.folder, #panel p.folder').live('click', function(){ self.selectFolder(this); });
	
		$('#dialog p.folder, #panel p.folder').live('dblclick', function(){ self.renameFolder(this); });
				
		// Подтверждение переименования папки пользователя в разделе "Папки пользователя"
		$('#panel p.folder input.new').live('change', function(){ self.submitRenameFolder(this,false); });
		$('#panel p.folder input.new').live('blur', function(){ self.submitRenameFolder(this,false); });
		// Подтверждение переименования папки пользователя в диалоговом окне
		$('#dialog p.folder').live('change', function(){ self.submitRenameFolder(this,true); });
		$('#dialog p.folder').live('blur', function(){ self.submitRenameFolder(this,true); });
		
		$('a.link_AddFolder').live('click', function(){ self.newFolder(); });
		$('a.link_DeleteFolder').live('click', function(){ self.removeFolder(); });
		$('a.folder_sort_name').live('click', function(){ self.sort('name'); });
		$('a.folder_sort_created').live('click', function(){ self.sort('created'); });
		
		$('.link_DeleteFromList').live('click', function(e){ self.removeItem(this); });
		$('.removeItem').live('click', function(e){ self.removeItemFromDialog(this); });
		
	// $('ul.listRecords li').live('click', function(e){ self.openBookmark(this,
	// e); });
		
		$('.foldersList li.docItem').live('click', function(event) {
			self.main.list.select(
				this,
				event,
				function(element,event,offset){
					self.openBookmark(element,event,offset);
				},
				null,
				function(cnt,el){
					self.showCntInfo(cnt,el);
				}
			);
		});
		
		$('div#dialog .importBase .submitFile').live('click', function() { self.submitImportBase(this);	});


		$("#File1").change(self.dialogPathFile);

		$('div#dialog .changeBase .udatafilepath').live('click', function() { self.changeUdataPathFile();	});
		
		$('div#dialog .okbutton').live('click', function() { 
			self.onSaveOptions();			
		});
		
		$('div#dialog .confirmDelete .yes').live('click', function() {
			self.removeItem($('ul.foldersList li.selected:visible'));
			//$('ul.foldersList li.selected:visible').each(function(i){
			//	self.removeItem($(this), true);
			//});
			//$('.FoldersTree li.selected > p.folder ').click();
			//self.closeDialog();
		});
		$('div#dialog .confirmDelete .no').live('click', function() { 
			self.closeDialog();	
		});
		
		$('.importUData').live('click', function(){self.importUData(); });
		$('.exportUData').live('click', function(){self.exportUDataDlg(); });
		
		this.main.icons.reg('removeBookmarks', function () {
	        self.removeSelectedItems();
	        return false;
	    });
		
		/*$('.removeBookmarks').live('click', function(){ self.removeSelectedItems(); });*/
		
		$('div#dialog .expUDataOkBtn').live('click', function() { 
			self.exportUDataDlg_OnOk();			
		});
		
		$('#dialog input[type=radio]').live('click', function(){
			switch(this.id) {
				case 'expDataOptAll':
					if($.browser.msie) {
						$('input[type=checkbox]', $('#dialog')).attr('disabled', 'disabled');
					} else {
						$('input[type=checkbox]', $('#dialog')).attr('disabled', true);
					}
				break;
				case 'expDataOptSel':
					if($.browser.msie) {
						$('input[type=checkbox]', $('#dialog')).removeAttr('disabled');
					} else {
						$('input[type=checkbox]', $('#dialog')).attr('disabled', false);
					}
				break;
			}
			
		});
	};
	

	this.onSaveOptions = function() {
		this.closeDialog();
	}
	
	this.checkSelection = function(){
		var selectedUrl = '&param3=';
		var selectedElements = new Array();
		if ($('ul.foldersList:visible li.selected').length){
			$('ul.foldersList:visible li.selected').each(function(){
				selectedElements.push(/\d+/.exec($(this).attr('id'))[0]);
			});
			return selectedUrl+selectedElements.join(';');
		}else{
			return '';
		}
	}
	
	this.print = function(){
		if (!this.printUrl){
			return false;
		}
		this.main.document.print(this.printUrl+this.checkSelection());
	}
	
	this.save = function(){
		if (!this.printUrl){
			return false;
		}
		this.main.document.save(this.printUrl+this.checkSelection() + '&filename=Список документов.rtf', true);
	}

	this.initForm = function () {
	    var self = this;

	    if (this.main.tabs.getActiveTab().ContentType == "docList") {
	        this.main.icons.reg('print', function () { self.print(); });
	        this.main.icons.reg('save', function () { self.save(); });
	        this.main.document.lastDocNd = null;
	    }

	    $('li.folderName form').submit(function () {
	        self.createFolder($('input.name', $(this))[0]);
	        return false;
	    });
		//так как submit на форму в диалоговом окне оказалось работать, то сделал пока так
		 $('#dialog li.folderName form input.name').live('keypress', function (e) {
			if(e.which == 13){
				self.createFolder(this);
				return false;
			}
	    });
		/*******************************************************/
	    $('li.folderName form  input.name').live("blur", function () {
	        var input = $(this).eq(0);
			if (input.is(":visible") == true){
				self.createFolder(input);
				return false;
			}
	    });
	    $('li.folderName form input.name').live('change', function () {
	        self.createFolder(this);
	        return false;
	    });
	    $('li.folderName form input.name').live('keypress', function (e) {
	        return self.ctrlKeypress(e);
	    });
	    $('.BookmarkName #name').live('keyup', function () {
	        if ($.trim($(this).val()) != '') {
	            self.enableButton();
	        } else {
	            self.disableButton();
	        }
	    });
		this.checkAddFolder();
	};
	
	this.ctrlKeypress = function(e,submitAction){
		var c = String.fromCharCode(e.which);
		if (!/[a-zа-я0-9-_\,\.\)\( ]/i.test(c)
				&& e.which != 8
				&& e.which != 0
				&& e.which != 37
				&& e.which != 39
				&& e.which != 13){
			return false;
		}
		if (e.which==13 && submitAction!=null && typeof submitAction == 'function'){
			submitAction(e.target,false)
		}
	};
	
	this.loadContent = function(folderId, tab, history,callback){
		this.main.resize.unset('document');
		$('#workspace').empty().css('padding-top', '0');
		var self = this;
		
		this.main.icons.clear();
		
		main.list.crossReg(
			function(event){
				self.cross(event);
			},
			function(cnt,el){
				self.showCntInfo(cnt,el);
			}
		);
		
		if ($('#FoldersTree').length) {
			this.showPanel();
			this.updateShareFolders($('#tree'));
			this.initTabs(folderId, tab,callback);
		} else {
			this.loadFolders($('#tree'), true, null , folderId);
		}
		if (history) {
			this.main.document.initHelpByOid(true,'userfolder',this.main.document.nd);
			var link = new LinkHistory(lex('UserFolders'), lex('UserFolders'), function(){
				self.loadContent(0, 0, null);
			});
			self.linkHistory = self.main.history.add(link);
		}
	
	};
	
	this.updateShareFolders = function(parent){
		/*if(this.shareFoldersLength == null){
			return;
		}*/
		if(utils.isLocal()){
			return;
		}
		var sharedList = $('#-1 ul.storageFolderUl p');
		
		 var items = [];

	    sharedList.each(function () {
	        var id = $(this).parent().attr('id');
	        if (id) {
	            items.push(id)
	        }
	    });
		
		var itemsStr = items.join(';');
		
		var data ={"param1": itemsStr};
		
		var self = this;
		
		var url = self.main.path.URL_FOLDERS_GET_SHARE;
		
		 $.ajax({
	        url: url,
	        type: "GET",
			data: data,
	        dataType: "html",
	        success: function (html) {
				if(html.length != 0){
					var sharedFoldersTree = $('.storageFolderUl');
					if (sharedFoldersTree.length > 0){
						sharedFoldersTree.empty();
						sharedFoldersTree.html(html);
						if ($('#-1 li', parent).length) {
							$('#-1 > p', parent).addClass('hasChild');
							$('#-1 > span', parent).addClass('close');
							self.openNode($('#-1 > span', parent)[0]);
						}
					}
				}
				/*if(html){
					if(html.length != 0){
						if(self.shareFoldersLength != html){
							self.shareFoldersLength = html;
							var sharedFoldersTree = $('.storageFolderUl');
							if (sharedFoldersTree.length > 0){
								sharedFoldersTree.empty();
								sharedFoldersTree.html(html);
								if ($('#-1 li', parent).length) {
									$('#-1 > p', parent).addClass('hasChild');
									$('#-1 > span', parent).addClass('close');
									self.openNode($('#-1 > span', parent)[0]);
								}
							}
						}
					}
			   }*/
	        }
	    });
		return;
	}


	this.foldersCount = function(){
		return $('ul.FoldersTree ul li').length;
	};
	
	this.loadFolders = function (parent, showPanel, callback, folderId, tab) {
	    if (showPanel) {
	        utils.progressOn();
	    }
	    var self = this;
	    var url = self.main.path.URL_FOLDERS_GET_ALL;
	    
	    
	    if (this.main.req!=null){
			this.main.req.abort();
		}
		this.main.req = $.ajax({
	        url: url,
	        type: 'GET',
	        dataType: 'html',
	        data: { 'header': showPanel ? 1 : 0, 'dialog': (parent.selector == "#dialog .FoldersList") ? true : false },
	        success: function (html) {
	        	self.main.req = null;
	        	parent.empty();
	            parent.append(html);
	            if ($('#0 li', parent).length) {
	                $('#0 > p', parent).addClass('hasChild');
	                $('#0 > span', parent).addClass('close');
	                self.openNode($('#0 > span', parent)[0]);
	            }
				var sharedFoldersTree = $('.storageFolderUl');
				/*if (sharedFoldersTree.length > 0){
					self.shareFoldersLength = sharedFoldersTree.html();
					self.updateShareFolders(parent);
				} else */if ($('#-1 li', parent).length) {
	                $('#-1 > p', parent).addClass('hasChild');
	                $('#-1 > span', parent).addClass('close');
	                self.openNode($('#-1 > span', parent)[0]);
	            }
	            if (showPanel) {
	                self.container = $('#panel');
	                self.showPanel();
	                self.initTabs(folderId, tab);
	                utils.progressOff();
	            } else {
	                self.container = parent;
	            };
	            self.activeFolder = null;

	            self.initForm();

	            if (self.foldersCount() && $('.FoldersTree li.selected:last').filter(':visible').attr('id') == '0') {
	                $('a.link_DeleteFolder').removeClass('active').addClass('inactive');
	            }
	            self.sortFolders();
	            //				if (typeof callback == 'function'){
	            //					callback();
	            //				}
	        }
	    });
	};

    this.initTabs = function (folderId, tab, callback) {
        this.main.icons.reg('print', function () { self.print(); });
        this.main.icons.reg('save', function () { self.save(); });
		this.main.document.showForm();
		var self = this;
		this.main.document.annotInfo = null;
		var tabs = [
						{
							ContentType: 'docList', 
							hidx:0,
							hotkey:'Д', 
							infoKinds: null,
							state:'active',
							title: lex('Documents'),
							urlParams: 'document',
							action: function() {
								self.main.tabs.showTabs(this.hidx);
							}
						},
						{
							ContentType:'docList', 
							hidx:1,
							hotkey:'З', 
							infoKinds: null,
							state:'inactive',
							title: lex('Bookmarks'),
							urlParams: 'bookmark',
							action: function() {
								self.main.tabs.showTabs(this.hidx);
							}
						}
					];
			self.main.tabs.setTabs(tabs, function(){
				self.loadRecords(callback);
			});
			self.main.tabs.addBody('0', 'docList','');
			self.main.tabs.addBody('1', 'docList','');
			
			if (null != folderId) {
				self.selectFolder(null, folderId);
			} else {
				self.selectFolder(null, 0);
			}
			
			// self.main.tabs.showTabs(0);
			if (null == tab) {
				self.main.tabs.openTab(0)
			} else {
				self.main.tabs.openTab(tab);
			};
	
			// $('#tabs').hide();
	};

	this.loadRecords = function (callback) {
	    utils.progressOn();
	    var folderId = $('#FoldersTree ul li.selected').attr('id');
	    var url = this.main.path.URL_FOLDER_LIST + '&param1=' + folderId;
	    /*если папка называеться "Документы на контроле, то изменяем тип"*/
	    if ($('#FoldersTree ul li.selected').attr('name') == 'Documents_on_control') {
	        url += '&param2=ControlledDocument';
	    }
	    else {
	        url += '&param2=' + this.main.tabs.getActiveTab().urlParams;
	    }
	    /**/
	    this.printUrl = url + '&print=1';
	    var self = this;
	    $.ajax({
	        url: url,
	        type: "GET",
	        dataType: "html",
	        success: function (html) {
	            $('#workspace div.tabBody').filter(':visible').html(html);
	            if ($('#FoldersTree ul li.selected').attr('name') == 'Documents_on_control') {
	                $('#carousel li#tab_0,#carousel li#tab_1 ').hide();
	            }
	            else {
	                $('#carousel li#tab_0,#carousel li#tab_1 ').show();
	            }
	            self.rewriteHistory();
	            utils.progressOff();
	            if (callback != null && typeof callback == 'function') {
	                callback();
	            }
	            //		if(!$.browser.msie) { // заблокировать функционал DRAG & DROP в IE
	            self.draggable();
	            self.droppable();
	            if ($('ul > li.selected').filter(':visible').not('.FoldersTree li').length == 0) {
	                self.main.icons.remove("folder_put");
	                self.main.icons.remove("removeBookmarks");
	                self.main.icons.remove("put_control");
	            }
	            //		}
	        }
	    });
	};
	this.droppable = function(){
		var self = this;
		var target = $('.FoldersTree .folder').not(".notDropDown");
		target.hover(
			function(event){
				var el = $(this);
				if (self.dropFolder){
					el.addClass('hoverFolder');
					self.droppableElFolder=$(this);
					return;
				}
			
				if (!self.drop) return;
				el.addClass('hover');
				self.droppableEl=$(this);
			},
			function(event){
				var el = $(this);
				el.removeClass('hover');
				el.removeClass('hoverFolder');
				if (!self.drop) return;
				self.droppableEl=null;
			}
		);
		target.mousemove(
			function(event){
				var el = $(this);
				var offset = event.pageY - el.offset().top;
				
				el.removeClass('ddt');
				el.removeClass('ddc');
				el.removeClass('ddb');
				if (offset>el.height()*0.66){
					el.addClass('ddb');					
				}else{
					if (offset<el.height()*0.33){
						el.addClass('ddt');
					}else{
						el.addClass('ddc');
					}		
				}
			}
		);
	}
	
	this.draggable = function(list){
		if ($('#FoldersTree ul li.selected').attr('name') == 'Documents_on_control') {
			return;				
		}
		var self = this;
		if (list==null){
			list = $('ul.listRecords li');
		}
		function drag_helper(event) {
	
			var el = $(this);
			var body = $('body')
			
			el.removeClass('active');
			var list = $('li.selected',el.parent());
			var newEl = el.clone();
			self.draggableList = null;
			$('body').append(newEl);
			el.removeClass('ui-draggable');
			if (el.hasClass('selected')){
				var html = '<ul>';
				var id = new Array();
				list.each(function(i){
					var element = $(this);
					id.push(utils.getId(element.attr('id')));
					var text = $('.title',element).text();
					var className = '';
					if (i==0){
						className = 'first';
					}
					text = utils.strCrop(text, 76);
					html+= '<li class="'+className+'">'+text+'</li>';
				}); 
				html += '</ul>';
				newEl.html(html);
				self.draggableList = id.join(',');
				newEl.addClass('ui-draggable-el-group');
								
			}else{
				newEl.addClass('ui-draggable-el');				
			}
			var offset = el.offset()
			// self.draggable(newEl);
			newEl.css('position','absolute');
	
			return newEl;
		}

		//		var helper = $('#userdata').draggable( "option", "helper" );
		list.draggable({
			appendTo: 'body',
			helper  : drag_helper,
			start: function(event, ui) { 
				self.drop=true;
				self.droppableEl=null;
				var el = $(this);
				
				$(this).data('draggable').offset.click.top = -1;
				$(this).data('draggable').offset.click.left = -1;		
			},
			stop: function(event, ui) {
				var el = $(this);
				if (self.droppableEl!=null){
					if (event.ctrlKey){
						self.move(el,self.droppableEl,self.main.path.URL_FOLDER_COPYRECORD);
					}else{
						self.move(el,self.droppableEl);
					}
				}
				self.drop=false;
				self.droppableEl=null;
				self.draggableList = null;
		//		el.remove();
				
			}
		});
	};
	
	this.move = function(rec,parent,url){
		var self = this;
		var recId;
		if (!parent) return;
		if (rec.hasClass('ui-draggable-el-group')){
			recId = rec.attr('id');
		}else{
			recId = utils.getId(rec.attr('id'));
		}
		var parentId = parseInt(parent.parent().attr('id'));
		if (url == null){
			url = this.main.path.URL_FOLDER_MOVERECORD;
		}
		if (this.draggableList!=null){
			recId = this.draggableList;
		}
		self.main.progress.start();
		$.ajax({
			url: url,
			type: "GET",
			data: {
				'param1':recId,
				'param2':parentId
				},
			dataType : "json",
			success: function (json){
				self.main.progress.stop();
				$('.FoldersTree li.selected > p.folder').click();
			},
			error: function (){
				self.main.progress.stop();
			}			
		});	
	};

	this.moveToFolder = function(IDs,toFolder){
		IDs = IDs.replace(/;/g,',');
		var self = this;
		//var url = this.main.path.URL_FOLDER_MOVERECORD;
		var url = this.main.path.URL_FOLDER_COPYRECORD; //баг 3998 - копирование вместо перемещения
		if (!toFolder) return;

		self.main.progress.start();
		$.ajax({
			url: url,
			type: "GET",
			data: {
				'param1':IDs,
				'param2':toFolder
				},
			dataType : "json",
			success: function (json){
				self.main.progress.stop();
				$('.FoldersTree li.selected > p.folder:first').click();
			},
			error: function (){
				self.main.progress.stop();
			}			
		});	
	};
	
	this.sortFolders = function(){
	//	if(!$.browser.msie) { // заблокировать функционал DRAG & DROP в IE
			this.draggableFolders();
	//	}
	};
	
	this.draggableFolders = function(list){
		var self = this;
		if (list==null){
		    list = $('#tree .FoldersTree .folder').not('#0 > p').not(".notDropDown").not(".notDrag");
		}
		
		function drag_helper_folders(event) {
			var el = $(this);
			var newElFolders = el.clone();
			el.removeClass('ui-draggable')
			var offset = el.offset()
	//		self.draggableFolders(newElFolders);
			$('body').append(newElFolders);
			newElFolders.css('position','absolute');
			newElFolders.addClass('ui-draggable-folder');
			self.dropFolder=true;
			self.droppableElFolder=null;			
			return newElFolders;
		}
		
		list.draggable({
			appendTo: 'body',
			helper  : drag_helper_folders,
			start: function(event, ui) {
				var el = $(this);
				el.data('draggable').offset.click.top = -1;
				el.data('draggable').offset.click.left = -1;		
			},
			stop: function(event, ui) {
				var el = $(this);
				self.moveFolder(el,self.droppableElFolder);
				self.dropFolder=false;
				self.droppableElFolder=null;
		//		el.remove();
			}
		});
	};
	
	this.moveFolder = function(rec,parent){
		var self = this;
		if (!(parent && rec && rec.hasClass('open') && parent.hasClass('open') )){
			return;	
		}
		var activeFolderId = $('.FoldersTree li.selected').attr('id')
		var recId = parseInt(rec.parent().attr('id'));
		var parentId = parseInt(parent.parent().attr('id'));
		var url = this.main.path.URL_FOLDER_CH_ORDER;
		if (parent.hasClass('ddc')){
			url = this.main.path.URL_FOLDER_MOVEFOLDER;
		}		
		
		this.main.progress.start();
		$.ajax({
			url: url,
			type: "GET",
			data: {
				'param1':recId,
				'param2':parentId,
				'param3':parent.hasClass('ddt')
			},
			dataType : "json",
			success: function (json){
				self.main.progress.stop();
				rec.removeClass('ddb');
				rec.removeClass('ddt');
			
				$('#FoldersTree').remove();
				var folderId = self.activeFolder.attr('id');
				var tab = self.main.tabs.getActiveTab().hidx;
	
				self.loadFolders($('#tree'), true,null,folderId, tab);
				
	//			self.loadContent(folderId, tab);
			},
			error: function (){
				self.main.progress.stop();
			}			

		});	
	};

	this.showPanel = function(callback) {
		$('#tree > div').hide();
		$('#panel').removeClass('taxCal');
		this.main.panel.activeTree = 'FoldersTree';
		this.main.panel.open();
		this.main.panel.initResize();
		this.main.icons.clear();
		this.main.icons.add('importUData', 'importUData');
		this.main.icons.add('exportUData', 'exportUData');
		//this.main.icons.add('tree','tree');
		this.main.icons.add('print', 'bookmarks_print');
		this.main.icons.add('save', 'bookmarks_save');
		this.main.icons.add('removeBookmarks', 'bookmarks_removeBookmarks');
		this.main.icons.disable('removeBookmarks');
		//$('#ico_tree').hide();
		$('#FoldersTree').show();
		
		this.main.panel.addClassName(null,'folderPanel');
		
//		$('#panel:visible').removeClass('tContent');
//		$('#panel div.top:visible').removeClass('tContentTop');
//		$('#panel:visible').removeClass('histPanel');
//		$('div.top:visible').removeClass('histTop');
//		$('#panel:visible').addClass('folderPanel');
//		$('div.top:visible').addClass('folderTop');
		
		if (window.isEda) {
			this.main.eda.initIconsForBookmarks();
		}

		if(window.ARZ['init']) {
			legAnalysis.bookmark_icon();
		}
		
		if (callback) {
			callback();
		}
	};

	this.selectFolder = function (element, id) {
	    var self = this;
	    $('#FoldersTree li.folderName form input.name, #dialog li.folderName form input.name').blur();
	    var name = $(".BookmarkName #name");
	    var folderElements = $("#dialog .MaterialsList");
	    if (name.length) {
	        if ($.trim(name.val()) == '') {
	            name.val('').focus();
	            self.disableButton();
	            return false;
	        }
	    }
	    if (folderElements.length) {
	        if (!folderElements.find("ul").length) {
	            self.disableButton();
	            return false;
	        }
	    }

	    if (null != id) {
	        element = $('#panel #' + id + ' > p')[0];
	    }

	    if (!$(element).length) {
	        element = $('#panel #0 > p')[0];
	    }

	    $('ul.FoldersTree li.selected > p.close', self.container).addClass('open').removeClass('close');
	    $('ul.FoldersTree li.selected', self.container).removeClass('selected');

	    var parent = $(element).parent();
	    parent.addClass('selected');
	    self.activeFolder = parent;

	    if ($(element).hasClass('hasChild')) {
	        self.openNode($('> span.open', parent)[0]);
	    };

	    //		$(element).addClass('close').removeClass('open');
	    if (self.container.attr('id') == 'panel') {
	        if (null == id) {
	            self.loadRecords();
	        } else {
	            self.openThread(id);
	        }
	    } else {
	        $('#dialog .gray').addClass('yellow').removeClass('gray');
	    };
	    this.checkAddFolder(this.activeFolder);
	};
	
	this.checkAddFolder = function(folder){
		var activeFolder;
		if (folder){
			activeFolder = $(folder);
		} else if ($('.FoldersTree li.selected').length > 0) {
			activeFolder = $('.FoldersTree li.selected');
		}
		if (activeFolder){
			if (activeFolder.attr("name") == 'Documents_on_control'	|| activeFolder.attr('id') == '-1') {
				if(activeFolder.attr("name") == 'Documents_on_control') {
					$('a.link_AddFolder').removeClass('active').addClass('inactive');
				} else {
					$('a.link_AddFolder').removeClass('inactive').addClass('active');
				}
	    	    $('a.link_DeleteFolder').removeClass('active').addClass('inactive');
	    	} else {
	    	    $('a.link_AddFolder').removeClass('inactive').addClass('active');
	    	    if (activeFolder == null || activeFolder.attr('id') == '0') {
	    	        $('a.link_DeleteFolder').removeClass('active').addClass('inactive');
	    	    } else {
	    	        $('a.link_DeleteFolder').removeClass('inactive').addClass('active');
	    	    }
	    	}
		}
	}
	
	this.renameFolder = function(el){
	    if (this.activeFolder.attr("name") == 'Documents_on_control' || this.activeFolder.attr('id') == '-1') {
			return;
		}
		var self = this;
		var input = $('.folder .new');
		if (input.length>0){
			var inputValue = input.attr('value');
			var p = input.parent();
			p.empty();
			p.html(inputValue);
		}
		if ($('input',$(el)).length>0){
			return;
		}
		var val = $(el).html();
		if($(el).parent()[0].id == '0'){
			alert(msg.notEditMainFolder);
			return;
		}
		if($(el).hasClass('saved')) {
			$(el).removeClass('saved');
		}
		$(el).html('<input class="new" old="'+val+'" value="'+val+'" />');
		$('#dialog p.folder, #panel p.folder input.new').focus();
		$('input',$(el)).keypress( function (e){ 
			return self.ctrlKeypress(e,function(input,fromDialog){
				self.submitRenameFolder(input,fromDialog)
			});			
		});
	}
	this.submitRenameFolder = function(input,fromDialog){
		var self = this;
		input = $(input);
		if(input[0].tagName != 'INPUT') {
			input = $(input[0].firstChild); 
		}
		var name = input.val();
		var parent = input.parent();
		if(parent.hasClass('saved')) {
			return;
		}
		parent.addClass('saved');
		name = name.replace(/[^a-zа-я0-9-_\,\.\)\( ]/ig, '');
		if (name == '') {
			var oldVal = input.attr('old');
			parent.append(oldVal);
			input.remove();
		}
		var parentId = this.activeFolder.attr("id")
		var url = this.main.path.URL_FOLDER_RENAME;
		var activeFolder = self.activeFolder;
		input.addClass('waiting');
		if (name==''){
			return;
		};	
		$.ajax({
			url: url,
			type: "GET",
			data: {
				'param1':parentId,
				'param2':name
			},
			dataType : "json",
			success: function (json){
				input.removeClass('waiting');
				if (json.type == 0) {
					name = input.val();		
				} else {
					name = input.attr('old');
				}
				if(fromDialog)
					self.loadFolders($('#tree'), false);
				input.parent().append(name);
				input.remove();
				self.query = false;
			}
		});			
	}

	this.createFolder = function(input) {
		var self = this;
		
		var name = $(input).val();
		name = name.replace(/[^a-zа-я0-9-_\,\.\)\( ]/ig, '');
		var li = $(input).parent().parent();
		if (name=='') {
			$(input).val("");
			li.hide();
			return;
		};
		if (self.query == true) {
			return;
		};
		var parentId = this.activeFolder.attr("id")
		var url = this.main.path.URL_FOLDER_ADD;
		
		var activeFolder = self.activeFolder;
		self.query = true;
		$.ajax({
			url: url,
			type: "GET",
			data: {
				'param1':parentId,
				'param2':name
				},
			dataType : "json",
			success: function (json){
				if (json.type == 0) {
					var parent_ = activeFolder.find('p').eq(0);
					var html = '<li id="' + json.result + '"><span></span><p class="open folder';
					if (parent_.hasClass("notDrag")){
						html += " notDrag";
					}					
					html += '">' + name + '</p><ul style="display: block;"></ul></li>';
					self.container.find('ul:last').append(li);
					$(input).val('');
					li.hide();
					activeFolder.find('ul').eq(0).append(html);
					self.addNodeButton(activeFolder);
					self.selectFolder($('#'+json.result+' p').get(0));
					if (self.container.attr('id') != 'panel') {
						var onPanel = $('#panel ul.FoldersTree li[id=' + parentId + ']');
						if (onPanel.find('ul:visible:first').length) {
							onPanel.find('ul:visible:first').append(html);
						} else {
							onPanel.find('ul:first').show().append(html);
						}
						self.addNodeButton(onPanel);
					}
					if (self.foldersCount() && ($('#FoldersTree ul li.selected').attr('name') != 'Documents_on_control') && ($('#FoldersTree ul li.selected').hasClass('storageFolder') == false) )
					{
						$('a.link_DeleteFolder').removeClass('inactive').addClass('active');
					}
				} else {
					$(input).focus();
					self.error(json.errText);
				}
				self.query = false;
				self.droppable();
				self.draggableFolders();
				
				if(window.ARZ != null) {
					//ARM_ARZ_OBJ.bookmarksEvent('createFolder', json);
				}				
			}
		});	
		return;
	};
	
	this.newFolder = function() {
		if ($('a.link_AddFolder').hasClass('inactive')){
			return;
		}
		this.setActiveFolder();
		var parent = this.container;
		if (this.activeFolder == null || !this.activeFolder.length || !$('.FoldersTree li.selected:visible').length) {
			$('.FoldersTree li.selected').removeClass('selected');
			this.activeFolder = parent.find('ul.FoldersTree li:first');
			this.activeFolder.addClass('selected');	
		}
		var li = this.container.find('li.folderName');
		this.activeFolder.find('ul:first').append(li).show();
		li.show(function() {
			$('input.name',li).focus();
		});
		this.openNode(this.activeFolder.find('> span.open:first'));
	};

	this.removeFolder = function () {
	    var self = this;
	    var id = this.activeFolder.attr('id');
	    if ($('a.link_DeleteFolder').hasClass('inactive')) {
	        return;
	    }
	    if (self.activeFolder == null || self.activeFolder.length == 0) {
	        return;
	    }
	    if (id == 0) {
	        alert('Нельзя удалить главную папку');
	        return;
	    };
		if (id == -1) {
	        alert('Нельзя удалить основную общую папку');
	        return;
	    };
	    var url = this.main.path.URL_FOLDER_IS_EMPTY + '&param1=' + id;
	    $.ajax({
	        url: url,
	        type: "GET",
	        dataType: "json",
	        success: function (json) {
	            var name = self.activeFolder.find('p').html();

	            var str = 'Удалить папку ' + name + ' и всё её содержимое?';
	            if (json.result) {
	                var str = 'Удалить папку ' + name + ' и все ее содержимое?';
	            }
	            if (!confirm(str)) {
	                return;
	            };
	            var url = self.main.path.URL_FOLDER_DELETE + '&param1=' + id;
	            $.ajax({
	                url: url,
	                type: "GET",
	                dataType: "json",
	                success: function (json) {
	                    if (json.type == 0) {
	                        var parent = self.activeFolder.parents('li:first');
							var hasNewFolder = self.activeFolder.find('li.folderName');
	                        self.activeFolder.remove();
	                        parent.addClass('selected');
	                        self.activeFolder = parent;
							var li = parent.find('ul li');
	                        if (li.length == 0) {
	                            $('p', parent).removeClass('hasChild');
	                            $('span', parent).removeAttr('class');
	                        } else if (li.length == 1 && li.hasClass("folderName")){
								$('p', parent).removeClass('hasChild');
	                            $('span', parent).removeAttr('class');
							}
							if (hasNewFolder.length > 0){
								parent.prepend(hasNewFolder[0]);
								$('li.folderName form').submit(function () {
									self.createFolder($('input.name', $(this))[0]);
									return false;
								});
							}
	                        if (self.container.attr('id') != 'panel') {
	                            var onPanel = $('#panel ul.FoldersTree li[id=' + id + ']');
	                            parent = onPanel.parents('li:first');
	                            onPanel.remove();
	                            if (parent.find('ul li').length == 0) {
	                                $('p', parent).removeClass('hasChild');
	                                $('span', parent).removeAttr('class');
	                            };
	                        };
	                        var tab = self.main.tabs.getActiveTab()
	                        var act = $('.FoldersTree .selected');
	                        if (tab != null) {
	                            if (act.length != 0 && tab.ContentType == "docList") {
	                                self.loadRecords(act.attr('id'));
	                            }
	                        }
	                        if ($('#folders:visible').length != 0) {
	                            parent.addClass('selected');
	                            //								self.loadRecords(parent.attr('id'));
	                            self.selectFolder($('> p', parent)[0])
	                        };
							self.checkAddFolder(self.activeFolder);
	                        /*if (($('#FoldersTree ul li.selected').attr('name') != 'Documents_on_control') && ($('#FoldersTree ul li.selected').hasClass('storageFolder') == false)) {
	                            if (self.foldersCount()) {
	                                $('a.link_DeleteFolder').removeClass('inactive').addClass('active');
	                            } else {
	                                $('a.link_DeleteFolder').removeClass('active').addClass('inactive');
	                            }
	                        }*/
							
							if(window.ARZ != null) {
								//ARM_ARZ_OBJ.bookmarksEvent('removeFolder', json);
							}
							
	                    } else {
	                        self.error(json.errText);
	                    };
	                }
	            });
	        }
	    });
	};

	this.showFolderPutDialog = function (element, nd, title) {
	    var self = this;
	    if ($(element).hasClass('disable')) {
	        return;
	    }
	    if (nd == null) {
	        nd = self.main.document.nd;
	    }
	    if (title == null && self.main.document.doc_info != null) {
	        title = self.main.document.doc_info.title;
	    }
	    var url = self.main.path.URL_FOLDER_PUT_DIALOG;
	    $.ajax({
	        url: url,
	        type: "GET",
	        dataType: "html",
	        success: function (html) {
	            $("#dialog").html(html);
	            utils.hideFlash();
	            self.main.list.lock = true;
	            self.dialog = $("#dialog").dialog({
	                autoOpen: true,
	                width: 630,
	                height: 440,
	                closeOnEscape: true,
	                position: 'center',
	                modal: true,
	                draggable: false,
	                close: function () {
	                    self.main.list.lock = false;
	                    $(this).dialog('destroy');
	                    $("#dialog").empty();
	                    utils.showFlash()
	                    return;
	                }
	            });
	            var html = '';
	            var list = $('.scroll ul li.selected').filter(':visible');
	            var isBookmarks;
	            if (self.main.list.cntSelected || list.length) {
	                html = '<ul>';
	                list.each(function () {
	                    isBookmarks = $(this).hasClass('bookmark');
	                    html += '<li id="' + utils.getId($(this).attr('id'), 'array')[0] + '"> \
								<div class="material"> \
									<span class="title">' +
										$('.title', $(this)).text() +
									'</span> \
								</div> \
								<span class="removeItem">X</span> \
								</li>';
	                });
	                html += '</ul>';
	            } else {
	                html = '<ul>';
	                html += '<li id="' + nd + '"> \
									<div class="material"> \
										<span class="title">' +
											title +
										'</span> \
									</div> \
									<span class="removeItem">X</span> \
									</li>';
	                html += '</ul>';
	            }
	            $('#dialog .MaterialsList').html(html);
	            if (isBookmarks == true) {
	                $('#dialog .MaterialsList ul li').css("background-position", "-3px -16146px");
	            }
	            self.loadFolders($('#dialog .FoldersList'), false);
	            self.main.document.initHelpByOid(true, 'userfolder');
	        }
	    });
	};	

	this.getBookmarkName = function () {
		var name = this.getNameByArea();
		if (window.isEda && (this.main.eda.getBookmarkName != null)) {
			var edaName = this.main.eda.getBookmarkName(name);
			if (edaName != null)
				return edaName;
		}
		if (this.main.document.selection)
			return name + '\r\n' + this.main.document.selection.name;
		if ((this.main.tabs != null) && (this.main.tabs.active != null))
			return name + '\r\n' + this.main.tabs.tabs[this.main.tabs.active].title;
		return name;
	}
	this.showBookmarkDialog = function(element){
		if ($(element).hasClass('disable')){
			return;
		}
		var self = this;
		var url = self.main.path.URL_BOOKMARK_DIALOG;
		$.ajax({
			url: url,
			type: "GET",
			dataType : "html",
			success: function (html){
				$("#dialog").html(html);
				utils.hideFlash();
				self.main.list.lock = true;
				self.dialog = $("#dialog").dialog({
					autoOpen: true,
					width: 630,
					height: 440,
					closeOnEscape: true,
					position: 'center',
					modal: true,
					draggable: false,
					close: function() {
						self.main.list.lock = false;
						$(this).dialog('destroy');
						$("#dialog").empty();
						utils.showFlash();
						return;
					}
				});
				self.loadFolders($('#dialog .FoldersList'), false);
				var partId = self.main.document.selection ? self.main.document.selection.partId : null;
				if (partId) {
					self.createMarker(partId);
				}
				var name = self.getBookmarkName();
				if ($.browser.opera) // хак для оперы - требуется ререндер textarea после изменения значения.
					$('.BookmarkName #name').val(name).css('display','block');
				else
					$('.BookmarkName #name').val(name);

				self.main.document.initHelpByOid(true,'userfolder');
			}
		});	
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
			this.activeFolder = $('ul.FoldersTree:visible li.selected').length ? $('ul.FoldersTree:visible li.selected') : null;
			this.main.document.selection = null;
			this.main.list.lock = false;
			this.marker = null;
		};
	};

	this.openBookmark = function (element, e, offset) {
	    var scr = {
	        pos: $(element).prevAll().length,
	        offset: offset
	    };
	    this.rewriteHistory(scr);

	    // if (e.target.nodeName == 'SPAN') {
	    // return false;
	    // }
	    this.main.progress.start();
	    var jqElement = $(element);
	    var state = eval('(' + jqElement.attr('state') + ')');
	    if (state) {
	        if (state.params == null) {
	            state.params = new Array();
	        }
	        state.params.push('style=bookmark');
	    }

	    this.main.restore.start(state, e)
	    $('#tabs').show();
	};
	
	this.removeSelectedItems = function (){
		var self = this;
		if (this.main.list.cntSelected==null){
			return;
		}
		if ($('ul.foldersList li.selected').length == 0){
			return;
		}

		this.showRemoveItemDialog();
	}

	this.removeItem = function (elements, all) {
	    var ids = [];
	    var data = null;
	    if (this.activeFolder.eq(0).attr('name') == "Documents_on_control") {
	        elements.each(function () {
	            ids.push(utils.getNd($(this).attr('state')));
	        });
	        data = { 'type': 'ControlledDocument', 'nd': ids.join(',')};
	    } else {
	        elements.each(function () {
	            ids.push(utils.getId($(this).attr('id')));
	        });
	        data = { 'param1': ids.join(',') };
	    }
	    /*
	    var id = utils.getId($(element).parent().attr('id'));
	    if (all){
	    id = utils.getId($(element).attr('id'));
	    }
	    */
	    var self = this;
	    $.ajax({
	        url: this.main.path.URL_FOLDER_REMOVERECORD,
	        data: data,
	        dataType: 'json',
	        type: 'GET',
	        success: function (json) {
	            if (json.type == -1) {
	                self.error(json.errText);
	            }
				$('.FoldersTree li.selected > p.folder').eq(0).click();
	        }
	    });
	    self.closeDialog();
	};
	
	this.showRemoveItemDialog = function(callback) {
		var self = this;
		
		html = '<span title="Закрыть окно" class="closeBookmarkDialog"></span>	<div class="header">		 	<h4 class="title">'+msg.get('deleteSelectedBookmarks')+'</h4>		</div>'+
		'<div class="confirmDelete">'+
		'<div class="yes macButton"> <p>Да</p> </div> <div class="no macButton"> <p>Нет</p> </div>'+
		'</div>';
			
		$("#dialog").html(html);
		utils.hideFlash();
		this.main.list.lock = true;
		this.dialog = $("#dialog").dialog({
			autoOpen: true,
			width: 350,
			closeOnEscape: true,
			position: 'center',
			modal: true,
			draggable: false,
			close: function() {
				self.main.list.lock = false;
				$(this).dialog('destroy');
				$("#dialog").empty();
				utils.showFlash();
				return;
			}
		});
		
		if(callback)
			callback();
	};	
	
	this.removeItemFromDialog = function(element) {
		$(element).parent().remove();
		if (!$('#dialog .MaterialsList > ul > li').length) {
			$('#dialog .MaterialsList > ul').remove();
			this.disableButton();
		}
	};
	
	this.showEmptyFolder = function(){
		var self = this;
		$.ajax({
			url: self.main.path.MSG_FOLDER_EMPTY,
			type: 'GET',
			dataType: 'html',
			success: function(html){
				$('#workspace div.tabBody:visible').html(html);
			}
		});
	}
	
	this.createMarker = function(partId) {
		var self = this;
		$.ajax({
			url: this.main.path.URL_CREATE_MARKER,
			data: {
				'nd': this.main.document.nd,
				'nh': this.main.tabs.getActiveTab().hidx,
				'id': partId
			},
			type: 'GET',
			dataType : 'html',
			success: function (html){
				self.marker = html ? html : null;
			}
		});
	};
	
	this.setBookmark = function() {
		this.setActiveFolder();
		var id = this.activeFolder.attr('id');
		var name = $.trim($('.BookmarkName #name').val());
		if(name == '') return false;
		var state = this.getStateByArea();
		if (this.marker) {
			state.marker = this.marker;
		}	
		var url = this.main.path.URL_FOLDER_ADDRECORD;
		var self = this;
		var data = {
				'param1': id,
				'param2': state.nd,
				'param3': name,
				'param4': $.json.encode(state),
				'param5': 'bookmark'
        }
        this.closeDialog();
		$.ajax({
			url: url,
			data: data,
			type: 'POST',
			dataType : 'json',
			success: function (json){
				if (json.type == 0) {
					//self.closeDialog();
				} else {
					self.error(json.errText);
				}
			}
		});
	};

	this.putToFolder = function (el) {
	    var self = this;
	    el = $(el);
	    this.setActiveFolder();
	    var id = this.activeFolder.attr('id');

	    var items = [];

	    $('#dialog div.MaterialsList ul > li').each(function () {
	        var id = $(this).attr('id');
	        if (id) {
	            items.push(id)
	        }
	    });
	    var itemsStr = items.join(';');

	    if (parent.window.document.title.indexOf(lex('UserFolders')) == 0) { // Если так, то значит в папках пользователя и нужно переместить документы.
	        this.moveToFolder(itemsStr, id);
	        self.closeDialog();
	        return;
	    }

	    var url = this.main.path.URL_FOLDER_ADDLIST;
	    var dataToSave = {
	        'param1': id,
	        'param2': itemsStr,
	        'param3': 'document'
	    };

	    if (this.main.tabs.active != null && this.main.tabs != null && this.main.document.nd == itemsStr)
	        dataToSave.param4 = this.main.tabs.active; // если есть активная вкладка и сохраняется открытый документ (а не выделенный в списке), то сохраняем и вкладку
	    if (this.main.document.params != null && this.main.document.params.length > 0) {
	        dataToSave.param5 = this.main.document.params.join(",");
	    } else {
	        var listDoc = $('.scroll ul li.selected').filter(':visible').filter('.docItem');
	        if ( listDoc.length > 0) {
	            var r = listDoc.eq(0).attr('r');
	            if (r != null && r != '') {
	                dataToSave.param5 = "r=" + r;
	            }
	        }
	    }
	    this.main.progress.waitStart(el);
	    $.ajax({
	        url: url,
	        data: dataToSave,
	        type: 'POST',
	        dataType: 'json',
	        success: function (json) {
	            self.main.progress.waitStop(el);
	            if (json.type == 0) {
	                self.closeDialog();
					if (json.result != 0){
						self.showFailAddToFolderDialog(json.result, items.length);
					}
	            } else {
	                self.error(json.errText);
	            }
	        }
	    });
	};
	
	this.showFailAddToFolderDialog = function(result, items){
		var self = this;
		var txt;
		var isOne =  (items >= 2) ? false : true;
		if (typeof(result) == 'string'){
			txt = result;
		} else if (isOne == false) {
			if (items == result){
				txt = 'Все выбранные документы уже содержатся в данной папке.';
			} else {
				txt = 'Некоторые из выбранных Вами документов уже содержатся в данной папке, все новые документы добавлены.';
			}
		} else {
			txt = 'Документ уже содержится в данной папке.';
		}
		
		html = '<div class="alert"><span title="Закрыть окно" class="closeBookmarkDialog"></span>	<div class="header">'
		+'<h4 class="title">&nbsp;</h4><p>' + txt + '</p></div>'+
		'<div class="confirmDelete">'+
		'<div class="no macButton one"> <p>Oк</p> </div></div></div>';
			
		$("#dialog").html(html);
		utils.hideFlash();
		this.main.list.lock = true;
		this.dialog = $("#dialog").dialog({
			autoOpen: true,
			width: 350,
			closeOnEscape: true,
			position: 'center',
			modal: true,
			draggable: false,
			close: function() {
				self.main.list.lock = false;
				$(this).dialog('destroy');
				$("#dialog").empty();
				utils.showFlash();
				return;
			}
		});
		$('body').bind('click.nn',function(){ self.closeDialog();});
		$("body").bind('keyup.nn',function(event){
			if(event.keyCode == 13){
				self.closeDialog();
			}
		});
	};	
	
	this.setActiveFolder = function(){
		this.activeFolder = $('.FoldersTree li.selected:last').filter(':visible'); 
	}
	
	this.addNodeButton = function(jqElement) {
		var span = $('span',jqElement).eq(0);
		span.removeClass('open').addClass('close');
		$('p',jqElement).eq(0).addClass('hasChild');
	};
	
	this.getNameByArea = function() {
		var name = '';
		switch (this.area) {
			case 'doc': 	name = ''+this.main.document.doc_info.title;
							break;
							
			case 'iSearch': name = 'Результат интеллектуального поиска \r\n' + 
									'Вы искали: '+this.main.iSearch.getStat().split('=')[0];
							break;
							
			case 'aSearch': name = 'Результат поиска';
							break;
							
			default: 		break;
		}
		return name;
	};
	
	this.getStateByArea = function() {
		var state = '';
		switch (this.area) {
			case 'doc': 	state = this.main.document.saveState();
							state.type = 'document';
							state.nd = this.main.document.nd;
							break;
							
			case 'iSearch': 
							state = {};
							state.context = this.main.iSearch.context;
							state.type = 'iSearch';
							state.tab = this.main.tabs.active;
							break;
							
			case 'aSearch': state = this.main.search.state;
							state.type = 'search';
							break;
							
			default: 		break;
		}
		return state;
	};
		
	this.closeNode = function(element){
		$(element).removeClass('close').addClass('open');
		$(element).parent().find('ul:first').hide();
	};
	
	this.openNode = function(element){
		$(element).removeClass('open').addClass('close');
		$(element).parent().find('ul:first').show();
	};
	
	this.openThread = function(id) {
		var self = this;
		$('#'+id).parents('li').each( function(){
			self.openNode( $('> span.open',$(this))[0] )
		})
	}
	
	this.disableButton = function(){
		$('#dialog .yellow').addClass('gray').removeClass('yellow');
	}
	
	this.enableButton = function(){
		if ($('#dialog .FoldersTree li.selected').length) {
			$('#dialog .gray').addClass('yellow').removeClass('gray');
		}
	};
	
	this.rewriteHistory = function(scr) {
		var self = this;
		this.setActiveFolder();
		if (null != self.activeFolder && self.main.tabs.getActiveTab()) {
			var folderId = self.activeFolder.attr('id');
			var tab = self.main.tabs.getActiveTab().hidx;
			var link = new LinkHistory(lex('UserFolders'), lex('UserFolders'), function(){
				self.loadContent(folderId, tab, null,function(){
					var el = $('.foldersList li').eq(scr.pos);
					el.click();
					var scrollEl = el.parent().parent();
					var offset = (el.get(0).offsetTop-scrollEl.get(0).offsetTop)-scr.offset;
					scrollEl.scrollTo(
						{top:offset+'px', left:'0px'}
					)
				});
			});
			self.linkHistory = self.main.history.rewrite(link);
		}
	};

	this.cross = function(event){
		var self = this;
		this.main.list.cross(
			event,
			$('#workspace ul.foldersList:visible').eq(0),
			function(element){
				 $(element).click();				 
				 return true;
			},
			true
		);
	};

	this.changeUdataPathFile = function() {
		var path = external.Application.GetSaveFileName('Укажите путь, куда будет перемещен файл с материалами пользователя', '*.sqlite', 'udata.sqlite');
		if (path) {
			$('#udb_input').val(path);
		}
	}

	this.dialogPathFile = function(){
		var path = $('#File1').val();
		if(path != '') {
			this.ctrlBtnSubmit();
		}
	}

	this.ctrlBtnSubmit = function(){
		if ($('#File1').attr('type')=='file' || ( $('#File1').val().length>0 && $('#File1').val()!=$('#File1').attr('default'))){
			$('div#dialog .importBase .macButton').removeClass('inactive');
			$('div#dialog .importBase .macInput').removeClass('inactive');
		}else{
			$('div#dialog .importBase .macButton').addClass('inactive ');
			$('div#dialog .importBase .macInput').addClass('inactive ');
		}
	}

	this.importUData = function(){
		var self = this;	
		$.ajax({
			url: this.main.path.URL_IMPORT_UDATA,
			dataType: "html",
			type: "get",
			error: function(er) {
				dbg.msg(er);
			},
			success: function(html){
				var dialog = $("div#dialog");
				$("div#dialog").append(html);
				$('div#dialog .importBase form').ajaxForm({
					beforeSubmit:function(html){
						$('div#dialog').addClass('progress');
						$('div#dialog .importBase').hide()
					},
					success: function(html){
						$('div#dialog').removeClass('progress');
						$('div#dialog .importBase').show();
						if (html == 'success') {
							$('div#dialog .importBase .unsuccess').hide()
							$('div#dialog .importBase .success').show();
							$('#FoldersTree').remove();
							self.loadContent(0, null, true);
						}
						else {
							$('div#dialog .importBase .success').hide();
							$('div#dialog .importBase .unsuccess').html('Ошибка: <br/>' + html).show();
						}
					}
				});
				self.ctrlBtnSubmit();
				utils.hideFlash();		
				self.dialog = $("div#dialog").dialog({
					autoOpen: true,
					width: 565,
					height: 259,
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
	
	this.submitImportBase = function(el) {
		if ($(el).hasClass('inactive')) {
			return;
		}
		
		$('#dialog .importBase form').submit();
	}
	
	this.exportUDataDlg_OnOk = function() {
		var subFldrs = false;
		
		if ($(':checkbox:checked', this.dialog).length > 0) {
			subFldrs = true;
		}
		
		switch($(':radio:checked', this.dialog)[0].id) {
			case 'expDataOptAll':
				this.exportUData();
				break;
				
			case 'expDataOptSel':
				this.exportUData( $('li.selected', $('#FoldersTree ul.FoldersTree'))[0].id, subFldrs );
				break;
		}
		
		this.closeDialog();
	}
	
	this.exportUDataDlg = function() {
		var unexportable = false;
		var el = $('li.selected', $('#FoldersTree ul.FoldersTree'));
		while ( !el.parent().hasClass('FoldersTree') ) {
			el = el.parent().parent();
		}
		if (el[0].id == -1) {
			unexportable = true;
		}
	
		var html=
[
'<span title="Закрыть окно" class="closeBookmarkDialog"></span>',
'<label><input type=radio name="expDataOpt" id="expDataOptAll" checked>Экспортировать все материалы</label><br>',
'<label><input type=radio name="expDataOpt" id="expDataOptSel"',
(unexportable ? ' disabled' : ''),
'>Экспортировать выделенную папку</label><br>',
'<label><input type=checkbox name="expDataSubOpt" style="margin-left: 20px;" checked disabled>включая подпапки</label>',
'<div style="clear: both; margin-top: 20px;"></div>',
'<span class="expUDataOkBtn button yellow">\
	<span type="button">Экспортировать</span>\
</span>'
];

		//dlg.html(html);
		this.dialog = $("div#dialog")
			.html(html.join(''))
			.dialog({
				autoOpen: true,
				width: 310,
				height: 170,
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
	
	this.exportUData = function(folderId, subFldrs) {
		var s = '?';
		var url = this.main.path.URL_EXPORT_UDATA;
		if (folderId != null) {
			url += s + 'folder_id=' + folderId;
			if (subFldrs != null) {
				url += '&with_children=' + subFldrs;
			}
			s = '&';
		}
		// Если настольная версия и урл не гигантский!!!
		location = url;
	}
	
	this.sort = function(col){
		var self = this;
		var url = this.main.path.URL_FOLDER_SORT;
		$.ajax({
			url: url,
			type: "GET",
			data: {
				'param1':col
			},
			dataType : "json",
			success: function(json){
				$('#FoldersTree').remove();
				var folderId = self.activeFolder.attr('id');
				var tab = self.main.tabs.getActiveTab().hidx;
				self.loadContent(folderId,tab)
			}				
		});	
		
	};
	
	this.showCntInfo = function(cnt,el){
		var sel = $('.iSearchInfo:visible .info')
		var total = $('.total',sel)
		var val = $('.total .value',sel)
		if (cnt){
			sel.show();
			total.show();
			val.html(cnt);
			this.main.icons.active('removeBookmarks');
		}else{
			total.hide()
			this.main.icons.disable('removeBookmarks');
		}
		var current = $('.current_num',sel)
		var val = $('.current_num .value',sel)
		if (el && el.length && el.hasClass('selected')){
			current.show();	
			val.html(el.attr('cnt'));
		}else{
			current.hide();	
		}
	}
	
	this.error = function(errText) {
		alert(errText);
	};
	
	this.init();
}
