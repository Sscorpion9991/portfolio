function  Panel(main){
	this.main=main;
	this.id=main;
	this.activeTree=null;
	this.isClose=false;
	this.filterStr=null;
	this.width=null;
	this.isVisible = false;
	this.timeoutId;
	this.filterInputTimeout = 300;
	this.currentParams;	
	this.filterRequest = null;
	this.request = null;
	this.treeProcessing = false;
	this.Panels = null;

	this.init = function () {
	    var self = this;
	    $('#panel ul.catalog span.close, #panel .open .opener').live("click", function () { self.closeNode(this); });
	    $('#panel ul.catalog span.open, #panel .close .opener').live("click", function () { self.openNode(this); });
	    $('#panel .top .close, #panel .co_top .close').live("click", function () { self.close(this); });
	    $('.tree .calendar .day').live('click', function () {
	        self.calendarOpenDoc(this);
	    })


	    this.main.icons.reg('tree', function () { self.open(this); });

	    //		$('#icons #ico_tree').live("click", function() { self.open(this); });


	    $('#tree_expand').live("click", function () { self.tree_expand(); });
	    $('#tree_collapse').live("click", function () { self.tree_collapse(); });
	    $('[id=treeQuickFilter]').live('keydown', function (e) { self.dispatcher(e) });
	    $('[id=treeQuickFilter]').live('click', function (e) { self.tree_filter(); return false; });
	    $('#tree').live('click', function () {
	        self.startTreeProcessing();
	        self.openedFromTree = true;
	    });
	    $('body').live('click', function () {
	        self.endTreeProcessing();
	        self.openedFromTree = false;
	    });
	};
	
	this.dispatcher = function(event){
		var self = this;
		if (event.which == 13) {
			self.performFilter();
		}
	};

	this.initSearchButton = function(){
		var self = this;
		$('.treeFilterSearch').live("click", function() { 
			self.performFilter();
			return false;
		});
		
		$('.treeFilterSearchCancel').live("click", function() {
			self.performFilterCancel();
			return false;
		});
		
		var inputFilter = $('.tree_filter .value input');

		inputFilter.focus(function(){
			self.filterFocus(this);
		});
		
		inputFilter.blur(function(){
			self.filterBlur(this);
		});
		
		$('.tree_filter .clear').click(function(){
			self.clearFilter(this);
		});				
	}
	
	this.performFilter = function(){
		var self = this;
		//Проверим, а вдруг запрос уже исполняется
		if (self.filterRequest != null)
			return;
		$('.treeFilterSearch').attr('title','Остановить поиск');
		$('.treeFilterSearch').removeClass('treeFilterSearch').addClass('treeFilterSearchCancel');
		var inputFilter = $('div.tree:visible .tree_filter input');
		if (inputFilter.parent().hasClass('active')) {					
			var word = $('div.tree:visible .tree_filter input').val();
			self.filter(word); 
		} else	{
			self.filter('');
		}
	}
	
	this.performFilterCancel = function(){
		var self = this;
		$('.treeFilterSearchCancel').attr('title','Найти');
		$('.treeFilterSearchCancel').removeClass('treeFilterSearchCancel').addClass('treeFilterSearch');										
		
		if (self.filterRequest != null) {				
			self.filterRequest.abort();				
			self.filterRequest = null;		
		}
	}

	this.initResize = function(){
		var self = this;
		this.width = $.cookie('panel');
		if (!this.width){
			this.width = 300;
		}
		
		$(window).unbind('resize.prs').bind('resize.prs',function(){
			var width = $(window).width() - 50;
			if (width  < self.width );
			self.width = 300;
			self.resize(null,self.width);
		})
		
		self.resize(this,this.width)
		$("#panelBorder").draggable({ 
			axis: 'x' ,
			drag: function() {
				self.resize(this);
				self.textSearchResize();
			},
			stop: function() { self.stopResize(this) }
		});
	}
	
	this.textSearchResize = function (){
		this.main.document.textSearch.resize();
	}

	this.load = function(params, noScroll, docNd){
	    if (this.request!=null){
	        this.request.abort();
	        this.request=null;
	    }
	    //		this.type = type
	    //		this.params = params.params;
		
	    this.currentParams = params;
	    if(this.main.document.reloadTreeCheck == false) {			
	        this.main.document.reloadTreeCheck = true;
	        //return;
	    }
	    if (params.params!=null){
	        //	params.params = {'month':7};
	        this.main.document.setParams(params.params);
	    }
	    //		if(!this.openedFromTree) {
	    //			this.cleanTreeForReload();
	    //		}		
		
	    var tree_id = utils.getUrlParam(params.urlParams, 'tree_id');
	    var self = this;

	    var tree = document.getElementById(tree_id);
	    if(tree!=null){
	        if ($(tree).is(':visible') == false && docNd == params.root_oid){
	            $(tree).remove();
	            tree = null;
	        }
	    }
		this.taxCal(params);
		if (this.id==tree_id && tree!=null){
			self.main.document.initHelpByOid(true,'document_toc',self.main.document.nd);
			this.show(noScroll);
			$('#panel .tree').hide();
			$(tree).show();
			this.addClassName();
			
			if (params.type == 'TaxCal' && params.taxCalUrl!=null) {
				this.calendar(params.taxCalUrl, params.params);
			}
			self.selectTreeItem();
			return;
		}
		$('#FoldersTree, #HistoryTree, .tree').hide();
		this.id = tree_id; 
		var tree = $('#tree .tree');
		var isLoad = false;
		tree.each(function (i) {
			if(this.id==tree_id){
				isLoad = true;
				$('#panel .tree').hide();
				$(this).show();
				self.show();	
				self.initTree();
				
				return;
			}
		});

		var callback = null;
		if (params.type == 'TaxCal' && params.taxCalUrl!=null) {
			callback = function(){
				self.calendar(params.taxCalUrl,params.params);
				self.selectTreeItem();
			}
//			$(document.getElementById(this.id)).remove();
//			isLoad = false;
		} else {
			callback = function(){
				self.selectTreeItem();
			}
		};

		if (!isLoad){
			var url = params.urlParams;
//			if (/^tree.json/.test(params.urlParams)){
//				url = url+'&unfold_top=yes';
//			}
			//url+='&search_nd='+this.main.document.nd;
			this.loadTree(url,callback);
		}else{
			if (callback!=null && typeof callback == 'function'){
				callback();
			}
		}
    };

    this.loadSeveral = function (panels) {
			if (this.isVisible == false) {
				this.Panels = panels;
				return;
			}
			
			var panel = null;
			for (var i in panels) {
				var tree_id = utils.getUrlParam(panels[i].urlParams, 'tree_id');
				if (tree_id == this.activeTree) {
					panel = panels[i];
				}
			}
			
			if (panel != null)
				this.load(panel);
    }
    
    this.loadSeveralTree = function (element) {
		element = $(element);
		this.load(this.Panels[Number(element.attr('id'))], null);
		this.Panels = null;
		$('div.several_tree').remove();

    }

	this.loadTree = function(url,callback){
		var self=this;
		this.startRequest();
		this.show();
		if (this.request!=null){
			this.request.abort()
			this.request=null;
		}
		var data = {};
		if (this.currentParams!=null){
			data = this.currentParams.params;
		}
		this.request = $.ajax({
			url: url,
			data: data,
			type: "GET",
			dataType : "html",
			complete : function (){},
			success: function (html){
				self.show();
				self.stopRequest();
				//$('#tree').empty();
				$('#tree').append(html);
				self.addClassName();
				var height = $('#tree .tree:visible .top').height();
				if (height > 32) {
				    $('#tree .tree:visible .guide_body').css('padding-top', height + 'px');
				}
				self.initTree();
				self.ctrlScroll();
				if($("#tree .selected").is(":visible")) {
					self.openNode($("#tree .selected:visible span:first")[0]);
				}
				if (callback!=null && typeof callback == 'function'){
					callback();
				}
		//		var type = this.currentParams.type;
		//		if (type!=null && type == 'TaxCal'){
		//			
		//		}
				return;
			}
		});
	};

	this.initTree = function(){
		this.initResize();
		var self=this;
		self.activeTree=$('#panel div.tree:visible').attr('id');
		this.docSelected(this.main.document.getNd());
		/*
		if ($('#tree ul li.selected').length > 0) {
			this.tree_expand();
			$('ul.catalog').scrollTo($('#tree ul li.selected').get(0),0);
		}else{
			if ($('#tree ul li div.selected').length > 0){
				this.tree_expand();
				$('ul.catalog').scrollTo($('#tree ul li div.selected').get(0),0);
			}
		}*/
		$('#tree ul li.selected').parent().show();
		this.show();
		this.initSearchButton();
	};
	this.clearParams = function () {
	};
	this.close = function(el){
		//this.activeTree=null;
		this.clearParams();
		this.isClose=true;
		//$('#ico_tree').show();
		var panel = $('#panel:visible');
		if (panel.length != 0){
			if (!panel.hasClass('tContent') && !panel.hasClass('annotSearch')){
				if (el == null || !$(el).hasClass('notIco')){
					this.main.icons.add('tree','tree');
					this.main.icons.active('tree');
				}
			}
			this.hide();
		}
	};
	
	this.toggle = function(){
		this.clearParams();
		if (this.isClose){
			this.open();
		}else{
			this.close();
		}
	};
	
	this.open = function(ico){
		this.clearParams();
		this.isClose=false;
		this.show();
		//$('#ico_tree').hide();
		if (ico == null || $('#icons #ico_tree').length > 0){ // под вопросом
			this.main.icons.disable('tree');
		} else {
			this.main.document.initHelpByOid(true,'document_toc', this.main.document.nd);
		}
	};
	this.hide = function(){
		$('#main').css('margin-left','4px');
		$('#main').css('padding-left', '0px');
		$('#left').hide();
		$('#tree .previewTree').remove();
		$('#tree .tContentTree').remove();
		if(this.isVisible !== false) {
			this.main.document.initHelpByOid(true,'document', this.main.document.nd);
		}
		this.isVisible = false;
//		if (this.isClose){
//			this.main.icons.active('tree');
//		}else{
//			this.main.icons.disable('tree');
//		}
		this.main.resize.run('document');
		this.main.resize.run('workspace');

		this.textSearchResize();
	};
	this.addClassName = function(classNameTop,classNameBody){
		$('#panel:visible').removeClass('histPanel');
		$('div.top:visible').removeClass('histTop');
		$('#panel:visible').removeClass('folderPanel');
		$('div.top:visible').removeClass('folderTop');
		$('#panel:visible').removeClass('tContent');
		$('div.top:visible').removeClass('tContentTop');
		$('#panel:visible').removeClass('preview');
		$('div.top:visible').removeClass('previewTop');
		$('#panel:visible').removeClass('annotSearch');
		if (classNameBody!=null){
			$('#panel:visible').addClass(classNameBody);
		}
		if (classNameTop!=null){
			$('#panel div.top:visible').addClass(classNameTop);
		}
	}
	this.show = function(noScroll){
		$('#left').show();
		if (null != this.width) {
			$('#main').css('padding-left', this.width + 'px');
		}
		this.isVisible = true;
		if ($('#tree ul li.selected').length > 0 && (!noScroll)) {
			$('ul.catalog').scrollTo($('#tree ul li.selected').get(0),0);
		}else{
			if ($('#tree ul li div.selected').length > 0){
				$('ul.catalog').scrollTo($('#tree ul li div.selected').get(0),0);
			}
		}
//		if (!this.isClose) {
//			this.main.icons.disable('tree');
//		}else{
//			this.main.icons.active('tree');
//		}
		this.main.resize.run('document');
		this.main.resize.run('workspace');
		
		this.textSearchResize();
	};
	
	this.closeNode = function(element){
		var jEl = $(element); 
		jEl.removeClass('close').addClass('open');
		if (jEl.hasClass('opener')){
			jEl.parent().removeClass('open').addClass('close');
		}
		
		if ($(element).hasClass('filtered') && $(element).hasClass('firstOpen')){
			$(element).parent().next().hide();
			return;
		}
		
		if ($(element).hasClass('filtered')) {
			$('ul', $(element).parent()).hide();
		} else if (jEl.parent().hasClass('firstNode')) {
			$('ul', jEl.parent().parent()).hide();
		} else {
			$('ul', jEl.parent()).hide();
		}
	};
	
	this.openNode = function(element, callback){	
		var jEl = $(element);
		var url = $('div.urlParam',jEl)
		var data = {'subtree':'yes'};
		$(element).removeClass('open').addClass('close');
		if (jEl.hasClass('filtered') && jEl.hasClass('firstOpen')) {
			jEl.parent().next().show();
		}
		else {
			if (jEl.hasClass('filtered')) {
				$('ul',jEl.parent()).show();
				return;
			}
		}
		if (jEl.hasClass('filtered') && url.text().length == 0) {
			jEl.parent().next().show();
			return;
		}
		var subTree=$('ul',$(element).parent());
		if (subTree.length == 0){
			subTree=$('ul',$(element).parent().parent());
		}

		subTree.each(function(){
			var jEl = $(this);
			var opener = $(this).prev().prev();
			if(opener.hasClass('opener') && opener.hasClass('close')){
				jEl.show();
			}
		});

		jEl.parent().removeClass('close');
		jEl.parent().addClass('open');

		if ($('li', subTree).length > 0) {
			return;
		}

		if (url.length != 0) {
			url = url.text();
		} else if (this.currentParams.urlParams != null) {
			var nd = jEl.attr('nd');
			if (nd != null) {
				url = this.currentParams.urlParams;
				data.node = nd;
			} else {
				url = null;
			}
		} else {
			url = null;
		}
		
		if (url != null) {
			subTree.hide()
			$.ajax({
			url: url,
			data: data,
			type: "GET",
			dataType : "html",
			success: function (html){
				subTree.html(html);
				subTree.show()
				if (callback){
					callback();
				}
			}
		});		
		}
	};
	
	this.empty = function(params){
		$('#panel').empty();
	};
	
	this.docSelected = function(nd){
		var self=this;
		$('#tree ul li').removeClass('selected');
		$('#tree ul li div').removeClass('selected');
		$('#tree ul li p#doc_'+nd).parent().addClass('selected');
		var elememt = null;
		$('#tree ul li p#doc_'+nd).parents().filter("li").each(function (i) {
		});
	};
	
	// Развернуть все
	this.tree_expand = function() {
		var self=this;
		var elems = $('#panel ul:visible li span.open');
		var callback = function(){
			var elems = $('#panel ul:visible li span.open');
			elems.each(function(i){
				self.openNode(elems[i], callback);
			})
		};
		elems.each(function(i){
			self.openNode(elems[i], callback);
		})
	}
	
	// Свернуть все
	this.tree_collapse = function() {
		var self=this;
		var elems = $('#panel ul:visible li span.close');
		elems.each(function (i) {
			self.closeNode(elems[i]);
		});
	}
	
	this.filterFocus = function(input) {
		var jqInput = $(input);
		jqInput.parent().addClass('active');
		if (jqInput.attr('defaultvalue') == jqInput.val()) {
			jqInput.val('');
		}
	}
	
	this.filterBlur = function(input) {
		var jqInput = $(input);
		var defVal = jqInput.attr('defaultvalue');
		var inputVal = jqInput.val();
		
		if ((defVal == inputVal) || (inputVal == '')) {
			jqInput.val(defVal);
			jqInput.parent().removeClass('active');
		}
	}

	this.clearFilter = function(){
		var inputFilter = $('#panel .tree:visible .tree_filter input')
		var defVal = inputFilter.attr('defaultvalue');
		inputFilter.val('');
		inputFilter.parent().removeClass('active');
		inputFilter.val(defVal);
		this.filter('');
	}
	/*
	this.keyupFilter = function(key){
		var self = this;
		if (this.timeoutId){
			clearTimeout(this.timeoutId);
		}
		this.timeoutId = setTimeout(function (){
			self.filter($(key).val());
		}, this.filterInputTimeout);
	}
	*/
	
	this.filter = function(word){	
		if (this.filterRequest != null){
			return;
		}
		var self=this;
		var isTContent = $("#panel").hasClass("tContent");
		var data = { word: word };
		if (isTContent == true){
		    var url = self.main.tContent.url;
			if(word!='')
			    data.context = word;
		} else {
			var url = this.currentParams.urlParams;
		}
		this.filterStr = word;
		this.filterRequest = $.ajax({
			url: url,
			type: "GET",
			dataType : "html",
			data : data,
			complete : function (){},
			success: function (html) {
			    if (html) {
			        $('.treeFilterSearchCancel').removeClass('treeFilterSearchCancel').addClass('treeFilterSearch');
			        $('.treeFilterSearch').attr('title','Найти');
			        if (isTContent == true) {
			            $('#tree .tContentBody').empty();
			            $('#tree .tContentBody').append(html);
			            var html = $('#tree .contents').html();
			            var el = $('#tree .tContentBody').html(html);
			            self.filterRequest = null;
			            self.main.tContent.goToFirstFindItem();
			            return;
			        } else {
			            if (html.indexOf('Empty_Tree_After_Filter') != -1) {
			                self.main.tooltip.create($("#tree > div[id=" + self.id + "] .tree_filter"), '<div class="body"><b>Ничего не найдено</b></div>', 300000, 'emptyTreeFilter', null);
			                self.filterRequest = null;
			            } else {
			                var gtree = $("#tree > div[id=" + self.id + "] .guide_tree");
			                $("li", gtree).remove();
			                gtree.append(html);
			                self.filterRequest = null;
			                self.selectTreeItem();
			            }
			            return;
			        }
			    }
			}
		});		
	}	
	
	this.resize = function(self,width){
		var min = 299;
		var max = Math.round($('#container').width()*0.8);
		if (max<300){
			max=300;
		}
		if (width == null) {
			var dis = $(self).css('left');
			dis = /(-*\d+)px/.exec(dis)[1];
			dis = parseInt(dis);
			w = parseInt(w);
			var w = $('#left').width();
		}else{
			dis = width;
			$('#panelBorder').css('left',width+'px');
		}
		if (dis>min && dis<max){
			$('#left').width(dis+'px');
			$('#panel').width();
			if (this.isVisible) {
				$('#main').css('padding-left', dis + 'px');
				$('#main').css('margin-left', '-0px');
			}
			this.width = dis;
		}
		if ($('#panel:visible').hasClass('preview') == true){
			this.main.preview.resizePreviewUl();
		}
		var treeTop = $('#tree .tree:visible .top');
		if(treeTop.length > 0){
			var height = treeTop.height();
			$('#tree .tree:visible .guide_body').css('padding-top', height + 'px');
		}
	}	

	this.stopResize = function(self){
		var w = $('#left').width();
		$(self).css('left',w+'px');
		$.cookie('panel',w);
		this.width = w;
	}
	this.startRequest = function(){
		$('#tree').addClass('loading');
	}
	this.stopRequest = function(){
		$('#tree').removeClass('loading');
	}
	this.ctrlScroll = function(){
		return;
		$('#tree > div:visible').each(function(){
			var el = $(this)
			var width = $('.top .title',el).height()-30;
			if (width>=0){
				el.css('padding-top',width+'px');
			}
			var mt = $('.top',el).css('margin-top');
			mt = utils.intVal(mt);
			$('.top',el).css('margin-top',(mt-width)+'px');
		});
	}
	// снимает выделение с дерева при выделении поля фильтра
	this.tree_filter = function() {
		$('.firstNode.selected').removeClass('selected');
		this.treeProcessing = false;
	}
	this.startTreeProcessing = function() {
		if(this.main.panel.activeTree != 'HistoryTree' && this.main.panel.activeTree !='FoldersTree') {
			this.treeProcessing = true;
		}
	}
	this.endTreeProcessing = function() {
		this.treeProcessing = false;
	}
	this.cleanTreeForReload = function () {
		$("#"+this.activeTree).parent("#tree").empty();
	}
	this.calendarOpenDoc = function (el) {
//		this.main.document.open(this.main.document.nd,null,data);
	}
	
	this.calendar = function (url,data) {
		$.ajax({
			url: url,
			data: data,
			type: "GET",
			dataType : "html",
			complete : function (){},
			success: function (html){
				var body = $('#tree .co_body .calendar');
				body.html(html);
			}	
		});
	}

	this.taxCal = function (params) {
		if(params!=null && params.type == 'TaxCal'){
			$('#panel').addClass('taxCal');
		}else{
			$('#panel').removeClass('taxCal');
		}
	}
	
	this.selectTreeItem = function () {
		//console.log('selectTreeItem');
		
		var nd = /(?:search_nd=)(\d*)/.exec(this.currentParams.urlParams);
		if (nd == null) {
			return;
		}
		nd = nd[1];
		if (nd == null) {
			return;
		}
		
		/*
		$('.guide_tree a').each(function(){
			var jEl = $(this);
			if (jEl.attr('nd').indexOf(nd) === 0){
				var li = jEl.parent().parent();
				li.addClass('selected');
				var ulList = jEl.parents().filter('.guide_tree ul');
				ulList.show();
				var liList = jEl.parents().filter('.guide_tree ul');
				found = true;
				return false;
			}
		})
		*/
		
		var jEl = $('.guide_tree:visible a[nd^="' + nd + '"]');
		if (jEl.length > 0) {
			//var span = jEl.parent();
			var li = jEl.parent().parent();
			//li.removeClass('close').addClass('open');
			//span.removeClass('open').addClass('close');
			li.addClass('selected');
			if (this.openedFromTree) {
				return;
			}
			var liList = jEl.parents().filter('.guide_tree li');
			liList = liList.not(li);
			liList.removeClass('close').addClass('open');
			var spanList = liList.children('span.opener');
			spanList.removeClass('open').addClass('close');
			var ulList = jEl.parents().filter('.guide_tree ul');
			ulList.show();
			var offset = li.offset();
			
			if (offset.top < 100 || offset.top > $('body').height()-80){
				$('.guide_tree:visible').scrollTo(li, {axis: 'y', offset: {top: -80}});
			}
			
			return;
		}
		
		var self = this;
		var url = this.currentParams.urlParams + '&parent_chain';
		var _json, _idx;
		$.ajax({
			url: url,
			type: "GET",
			dataType : "json",
			complete : function (){},
			success: function (json){
				if (json != null) {
					_json = json;
					_idx = 0;
				}
				for (; _idx < _json.length; _idx++) {
					var span = $('.guide_tree:visible span.opener[nd="' + _json[_idx] + '"]');
					if (span.length == 0) {
						return;
					}
					var li = span.parent();
					var children = $('ul > li', li);
					if (children.length == 0) {
						self.openNode(span[0], arguments.callee);
						_idx++;
						return;
					} else {
						li.removeClass('close').addClass('open');
						span.removeClass('open').addClass('close');
						$('ul', li).show();
					}
				}
				
				var jEl = $('a[nd^="' + nd + '"]', li);
				li = jEl.parent().parent();
				li.addClass('selected');
				if (li!=null && li.length){
					$('.guide_tree:visible').scrollTo(li, {axis: 'y', offset: {top: -80}});
				}
			}
		});
	}
	this.init();
}
