function  Filter(main) {
	this.main = main;
	this.dialog = null;
	this.classificator = new Classificator(this,false);
	this.currentListStatus = [];
	this.type = [];
	this.store = null;

	var intervalId = null;
	this.init = function(tabs){
		var self = this;
		$('#filterSearch .clear').live('click', function() { self.clearField(this) });
		$('.closeFilter').live('click', function(){ self.close(this) });
		$('.dialogFilter .send.yellow').live('click', function(){ self.submit(this) });
		$('.dialogFilter .empty').live('click', function() { self.clearFields() });
		$('.doFilter').live("click", function(){self.show(this)});			
	}

	this.initForm = function(tabs){
		var self = this;
		$('#filterSearch .classificator').click(function() { self.main.search.classificator.open(this,self.getTabId(),true,self.getFilterParams());  });		
	
	//	$('#dialog .filterSearchForm .btn .classificator').click(function() { self.main.search.classificator.open(this,-1,true);  });		
	
	
		$('#filterSearch input').focus(function(event) { self.focusField(this, event) });		
		$('#filterSearch input').blur(function() { self.isEmpty() });		
		$('#filterSearch input').keyup(function(event) { 
			self.keyupField(this, event);
			if ($(this).hasClass('hasDatepicker')) {
				self.isEmpty();
			}
		});		
		$('#filterSearch input.date, #filterSearch input.date_to').datepicker( {
			showOn: false,
			onClose: function(){
				self.isEmpty();
			}
		});
		$('#filterSearch input.date, #filterSearch input.date_to').mask('39.19.9999');
		$('#filterSearch .period').change( function(){ self.main.search.togglePeriod(this) });


		$('#filterSearch input').keydown(function(event) { 
		    if (event.keyCode == 13 && !$('.suggest:visible').length) {
                if ( $(this).hasClass('hasDatepicker') ) {
                    $(this).blur();
                }
                self.submit();
            } else {
                self.main.tooltip.ctrlSuggest(event, this);
            }
        });
	}
	
	this.show = function(element) {
		var self = this;
		var urlParam = null;
		this.type = null;
		var url = null;
		var tab = null;
		var data = null;
		var listid = null;
		if ($(element).hasClass('isearch')) {
			this.type = 'isearch';
			this.store = this.main.tabs.getActiveTab();
			tab = utils.getUrlParam(this.store.urlParams,'tab');
			if (this.store.listid){
				listid=this.store.listid;
			}else{
				this.store.listid=listid=$('.iSearch:visible [name=listid]').val();
			}
			data = {
				listid: listid
			};
			url = this.main.path.URL_ISEARCH_FILTER_ATTRS+'?tab='+tab;
		} else {
			this.store = this.main.listDocument.getActiveState();
			this.type = 'asearch';						
			urlParam = /\?([^?]*)/.exec(this.store.url);						
			url = 'filter_attrs?'+urlParam[1];
		}
		
			
		$.ajax({
			url: url,
			type: 'GET',
			dataType : 'html',
			data: data,
			success: function (html){			
				self.main.list.lock = true;
				var docList = $("div#dialog .docList");
				if (docList.length>0){
					docList.hide();
				}else{
					$("div#dialog").empty();
				}
				if (self.dialog!=null){
					self.close();
				}
				
				$("div#dialog").append(html);
				self.initForm();
				self.setState();
				self.isEmpty();
				utils.hideFlash();
				self.dialog = $("div#dialog").dialog({
					autoOpen: true,
					width: 750,
					height: 590,
					closeOnEscape: true,
					position: 'center',
					modal: true,
					draggable: false,
					close: function() {
						$(this).dialog('destroy');
						$("#dialog").empty();
						self.main.list.lock = false;
						utils.showFlash();
						return;
					}
				});
				if (tab != null) {
					self.hideForm();
					if (tab == '-1' || tab == '-3') {
						if (tab == '-3'){
							self.showForm([-3]);
						}else{
							self.showForm([-1]);
						}
					} else {
						self.showForm(self.store.infoKinds);
					}
				} else if (window.isEda) {
					self.main.eda.showFilterForm();
					self.isEmpty();
				}
			}
		});			
	}

	this.close = function(id){
		if(this.type == 'asearch')
			this.main.listDocument.crossReg();
		else
			this.main.iSearch.setEvent();
		var docList = $("div#dialog .docList");
		if (docList.length>0){
			$('#filterSearch, .dialogFilter, .closeFilter').remove();
			docList.show();
			return;
		}
		if (this.dialog!=null){
			this.main.list.lock = false;
			this.dialog.dialog( 'destroy' );
			this.dialog=null;
			$('#dialog').empty();
			$('#dialog').hide();
		}
	}

	this.hideForm = function(){
		$('.filterSearchForm > div').hide();	
	}
	
	this.showForm = function(ids){
		var self = this;
		$('.filterSearchForm > div').each(function (i) {
			var found = false;
			var list=$(this).attr('class').split('_');
			for(var i in ids){
				for (var j in list) {
					if (parseInt(list[j], 10) == ids[i]) {
						$(this).show();
						if (window.isEda) {
							self.main.eda.showFormElement(ids[i], this, ids);
						}
						found = true;
						break;
					}
				}
				if (found) {
					break;
				}
			}
		});
		//this.createRequest();
		this.isEmpty();
	}

	this.isEmpty = function(exception, element){
		var totalEmpty=true;
		var self = this;
		var empty=true;
		if (intervalId) {
			//dbg.msg('Clear interval for inputs')
			clearInterval(intervalId);
		}
		$(element).removeClass('classificatorsInputBlur_middle');
		$(element).parent().children('.btn').removeClass('classificatorsInputBlur_right');
		$(element).parent().removeClass('classificatorsInputBlur_left');
		$('#dialog .send').addClass('gray').removeClass('yellow');
		$('#filterSearch .filterSearchForm input').each(function (i) {
			if ($(this).hasClass('classificator')) {
				if (!self.classificator.isEmpty(this, exception)) {
					empty = false;
				}
			} else {
				var id = utils.getId($(this).parent().parent().attr('id'));
				if (($(this).val() != '') && ($(this).val() != $(this).attr('default'))) {
					if ($(this).hasClass('hasDatepicker')) {
						var parent = $(this).parent().parent()
						$('input.hasDatepicker:visible', parent).each(function() {
							empty = self.main.search.emptyDatepicker(id) ? empty : false;
							if ( !(self.main.search.dateValidity($(this).val())) ) {
								$(this).parent().addClass('active');
							} else {
								return true;
							}
						});
					} else {
						empty = false;
					}
					if (exception!=this) $(this).parent().addClass('active');
				} else {
					if (exception != this) {
						$(this).parent().removeClass('active');
						if ($(this).val() == '') {
							var defval = $(this).attr('default');
							$(this).val(defval);
						}
					}
				}		
			}
			if (empty==false && totalEmpty == true) {
				totalEmpty = false;
			}
		});
		if (!totalEmpty) {
			$('#dialog .dialogButton .send').removeClass('gray').addClass('yellow');
		};
		
		return totalEmpty;
	}

	this.clearField = function(element){
		element = $('input',$(element).parent().parent());
		element.val('');
		this.isEmpty(null, element);
	}

	this.clearField = function(element){
		$('input',$(element).parent().parent()).val('');
		this.isEmpty();
	}

	this.clearFields = function(){
		$('#filterSearch div.active input').val('');
		$('#filterSearch select.period').each(function(){
			$(this).val('0');
		})
		$('span.from, span.to, div.value_to','#filterSearch').hide();
		this.isEmpty();
		
		this.store.filter = null;
		this.store.attr = null;
		this.main.tabs.getActiveTab().filter = null;
		this.main.tabs.getActiveTab().attr = null;
		
	//	if(this.dialog != null) {
	//		this.main.list.lock = false;
	//		this.dialog.dialog( 'destroy' );
	//		this.dialog=null;	
	//	}		
		
		if (this.type=='isearch'){
			var unFilteredUrl = this.store.urlParams;
			unFilteredUrl = utils.setUrlParam(unFilteredUrl, 'onlylist', null);
			unFilteredUrl = utils.setUrlParam(unFilteredUrl, 'part', null);
			if (unFilteredUrl.indexOf(this.main.path.URL_ISEARCH_FILTER_LIST) != -1){
				unFilteredUrl = unFilteredUrl.replace(this.main.path.URL_ISEARCH_FILTER_LIST, this.main.path.URL_ISEARCH_LIST);
			}
			this.store.urlParams = unFilteredUrl;
			this.main.tabs.reload();	
		}else{
			var unFilteredUrl = this.store.url;
			if (unFilteredUrl.indexOf(this.main.path.URL_DOCUMENT_LIST_FILTER) != -1){
				unFilteredUrl = unFilteredUrl.replace(this.main.path.URL_DOCUMENT_LIST_FILTER, this.main.path.URL_DOCUMENT_LIST);
			}
			this.store.url = unFilteredUrl;
			this.main.listDocument.reload(unFilteredUrl);
		}
	}
	
	this.keyupField = function(element, event){
		var self = this;
		var jqElement = $(element);
		var url;
		var idClassificator;
		var val = jqElement.val();
		var classElem = jqElement.attr('class');
//		var fieldId = utils.getId(jqElement.parent().parent().attr('id'));
		var fieldId = jqElement.attr('hintid')
		if (val == '' || jqElement.hasClass('hasDatepicker')) {
			return false
		};

		switch (classElem) {
			case 'string':
				url = main.path.URL_ISEARCH_QUICKRESULTS;
				break;
			
			case 'classificator':
				var tabId = -1;
				idClassificator = '&classificator_id=id_'+fieldId+'_'+tabId;
				url = main.path.URL_CLASSIFICATORS+'?'+idClassificator;
				if (this.classificator.checkValue(element)) {
					$('.dialogFilter .send').removeClass('gray').addClass('yellow');
				}		
				break;
			case 'number':
				url = main.path.URL_ISEARCH_QUICKRESULTS+'?hid=num_attr&attr_id='+fieldId;
				break;
			default:
				break;
				
		}
		 if (classElem.indexOf('date')==-1 && classElem.indexOf('classificator')==-1) {
		 	 this.main.tooltip.suggest(event,element,url);
		 }
		 
		this.isEmpty(element);
	}	
	
	this.focusField = function(element, event){
		var self = this;
		var jqElem = $(element);
		var block = jqElem.parent();
		if (!block.hasClass('active')){
			block.addClass('active');
		}

		if (jqElem.val() == jqElem.attr('default')) {
			jqElem.val('');
		}
		
		if (!jqElem.hasClass('hasDatepicker')) {
			//dbg.msg('Set Interval for inputs');
			intervalId = setInterval(
				function(){
					//dbg.msg($(element).length);
					//dbg.msg($(element).is(':visible'));
					if (!$(element).is(':visible')){
						clearInterval(intervalId);
						//dbg.msg('clear interval for inputs');
						return;
					}
					//dbg.msg('Interval for inputs');
					self.keyupField(element,event);	
				},
				600
			)
		}
	}
	
	this.setType = function() {
		
		if (this.stype == 'asearch') {
			$('h2.header.asearch').show();
		} else {
			$('h2.header.ssearch').show();
		}
	}

	this.togglePeriod = function(element) {
		var period = $(element).val();
		switch (period) {
			case '3': 
				case '4': {
					$(element).nextAll('span.from, span.to, div.value_to').show();
					break;
			}
			default: {
					$(element).nextAll('span.from, span.to, div.value_to').hide();
					break;
			}
		}
		this.isEmpty();
	}
	
	
	this.setState = function(element) {
		var field = null;
		var input = null;				
		var type = null;
		var block = null;
		if (!this.store.filterState){
			return;
		}
		var	stateClassficator = this.store.filterState;
		if (this.store.filter!=null){
			var filter = this.store.filter.split('&');
			for (var i in filter){
				field = null;				
				input = null;				
				var match = /^find(\d+)([^=]*)=([^=]*)/.exec(filter[i])
				if ( match!= null &&  match.length==4){
					field = {
						id : parseInt(match[1]),
						postfix : match[2],
						value : match[3]						 
					};		
					block = $('.filterSearchForm #infoKinds_'+field.id);
					input = $('input',block);
					type = input.attr('class');
					if (/^date/.test(type)){
						type='date';
					}
					switch (type) {
						case 'string':
							input.val(unescape(field.value));
							$('.value',block).addClass('active');
							break;
						case 'classificator':
							input.val(stateClassficator[field.id].value);
							input.next().val(stateClassficator[field.id].hidden);
							$('.value',block).addClass('active');
							break;
						case 'number':
							if (field.postfix == 'type') {
								$('.numberType', block).val(field.value);
							}	else {
								input.val(unescape(field.value));
								$('.value',block).addClass('active');
							}
							break;
						case 'date':
							if (field.postfix == 'type') {
								$('.period', block).val(field.value);
								this.togglePeriod($('select', block).get(0));
							}
							if (field.postfix == 'from') {
								$('.value_from',block).addClass('active');
								$('.value_from input',block).val(unescape(field.value));
							}
							if (field.postfix == 'to') {
								$('.value_to',block).addClass('active');
								$('.value_to input',block).val(unescape(field.value));
							}
							break;
							
					}
				}
			}
		}
	}
	this.getListStatus = function() {
		var self = this;
		return self.currentListStatus;
	}
	this.clearFilterStatus = function() {
		var self = this;
		self.currentListStatus = [];
	}
	this.getTabId = function() {
		var id = -1;
		if (this.type == 'isearch') {
			id = this.main.tabs.getActiveTab().id;
		}else{
			if (this.main.tabs.getActiveTab().hidx!=null){
				id = this.main.tabs.getActiveTab().hidx
			}
		}
		return id;
	}
	this.getFilterParams = function() {
		if (this.type == 'isearch') {
			return {
				'context':this.main.iSearch.context,
				'list_id': $('.iSearch:visible [name=listid]').val()
			}
		}
		return null;
	}
	this.submit = function(){
		var self = this;
		var attr = new Array();
		var stateClassficator = Array();
		var list;
		if(self.type == 'isearch'){
			this.main.iSearch.rewriteHistory(true);
		}else{
			var state = this.store = utils.clone(this.main.listDocument.getActiveState());
			this.main.listDocument.stateList.push(state);
			this.main.listDocument.active = this.main.listDocument.stateList.length-1;
			this.main.document.rewriteHistory(true);
		}
		if (this.main.listDocument.list){
			list =  this.main.listDocument.list;
			list.parent().addClass('progress');
			list.empty();
		}
		self.currentListStatus = [];
		$('#filterSearch .filterSearchForm input').each(function (i) {
			var id = $(this).parent().parent().attr('id').split('_')[1];
			var input = $(this);
			var type = input.attr('class');
			var value = input.val();

			if ($(this).parent().hasClass('active')) {
				var type = /[^\s]*/.exec(input.attr('class'))
				if (type && type.length){
					type=type[0];	
				}
				switch (type) {
					case 'string':
						attr.push('find' + id + '=' + value);
						break;
					case 'number':
						var findtype = $(this).parent().prevAll('select').val();
						attr.push('find' + id + '=' + value);
						attr.push('find' + id + 'type=' + findtype);
						break;
					case 'date':
						var findtype = $(this).parent().prevAll('select').val();
						attr.push('find' + id + 'from=' + value);
						attr.push('find' + id + 'type=' + findtype);
						break;
					case 'date_to':
						attr.push('find' + id + 'to=' + value);
						break;
					case 'classificator':
						var hiddenInput = input.next();
						if (hiddenInput == null) {
							break;
						}
						stateClassficator[id] = {value:value,hidden:input.next().val()};
						var arr = hiddenInput.val().split('?');
						var idList = arr[0];
						var logic = arr[1];
						attr.push('find' + id + '=' + idList + '&find' + id + 'lop=' + logic);
						break;
				}
				param = $('div.label', input.parent().parent()).text();
				if (value!=null && input.attr('type') != 'hidden'){
					self.currentListStatus.push({'title':param ,'value':input.val(), 'findType':findtype, type:input.attr('class')});
				}
			}
		});
		
		var listParams = null;
		self.main.progress.start(); 
		//self.main.iSearch.storeIPanel();
		var callback = function(){
			self.main.list.lock = false;
			//self.main.iSearch.recallIPanel();
			self.main.progress.stop(); 
			self.main.document.rewriteHistoryLinkedTo(true);
		}
		if (this.type=='isearch'){
			listParams = /\?([^?]*)/.exec(this.store.urlParams);
			this.store.urlParams = this.main.path.URL_ISEARCH_FILTER_LIST+'?'+listParams[1];
			this.store.urlParams = utils.setUrlParam(this.store.urlParams,'onlylist',null);
			this.store.urlParams = utils.setUrlParam(this.store.urlParams,'part',0);
			this.store.prevPage = null;
			this.store.nextPage = null;
			this.store.filter = attr.join('&');
			this.store.filterState = stateClassficator;
			this.store.attr = self.currentListStatus;
			this.main.tabs.reload(callback);	
		}else{
			var callback = function(){
				self.main.list.lock = false;
				self.main.document.rewriteHistoryLinkedTo(true);
			}
			this.store.filter=attr.join('&');
			this.store.filterState = stateClassficator;
			this.store.attr = self.currentListStatus;
			listParams = /\?([^?]*)/.exec(this.store.url);
			this.main.listDocument.reload(	this.main.path.URL_DOCUMENT_LIST_FILTER+'?'+listParams[1], callback);	
		}
		
		//Тестовые запросы
		
		//Запрос на получение размеров списка		
//		$.ajax({
//			url: 'filter_list?' + this.main.listDocument.filter + '&' + listParams[1],
//			type: "GET",
//			dataType : "json",
//			success: function (json){
//			
//			}
//		});
//
//		//Запрос на получение списка				
//		$.ajax({
//			url: 'filter_list?' + this.main.listDocument.filter + '&' + listParams[1] + '&part=0',
//			type: "GET",
//			dataType : "html",
//			success: function (html){
//			
//			}
//		});
					
		this.close();
	}
	this.removeParamById = function(url,id){
		var expr = new RegExp('find'+id+'[^=]*=[^&]*');
		if (!url){
			return '';
		}
		var res = expr.exec(url);
		if (res && res.length){
			url = url.replace(res[0],'');
			url = this.removeParamById(url,id);
		}
		return url;
	}


	this.init();
}
