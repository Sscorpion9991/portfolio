function  Search(main,init){	
	this.main=main;
	this.searchTabs= new SearchTabs(this);
	this.classificator= new Classificator(this);
	this.classificator.init();
	this.title='Поиск: ';
	this.state = null;
	this.states = [null, null];
	this.stype = null;
	this.request = null;
	this.activeSearch = null;
	//this.urlRequestParams = null;
	this.urlRequestParamsArr = [null, null];
	this.resultListParams=null;
	this.urlRequestStats = null;
	this.urlRequestStatsArr = [null, null];
	this.dateType = {0: 'точно', 1: 'по', 2: 'с', 3: 'период', 4: 'вне периода'};
	this.numberType = {1: 'точно', 2: 'содержит', 4: 'начинается с'};
	this.dateValue = '';
	this.intervalId = null;
	this.party2 = null;
	
	this.init = function (tabs) {
	    this.activeSearch = 0;
		var self = this;
		this.resize();
		$('#aSearchBtn').live("click", function() { self.search(null, null, 'asearch'); });
		$('#aSearch .searchTabs li > span').live('click',function() { self.resultList($(this).parent().get(0),null,null,$(this).hasClass('important')) });				
		$('#aSearch .searchForm .btn .classificator').live('click',function() { self.classificator.open(this) });		
		$('#aSearch .searchForm span.empty').live('click',function() { self.clearFields(true) });		
		$('#searchList .return').live('click',function() { self.resultClose() });	
		$('.searchForm .send').live("click", function() {
			if (!$(this).hasClass('gray')){
				self.find();
			}
		});	
	
		$('#aSearch .searchForm .label').live('click',function() { $('input',$(this).parent()).eq(0).focus() });		
	
	
		$('#searchList .showASearchInfoMsg').live('click',function() { self.controlBlockInfo(true)	});
		$('#searchList .hideASearchInfoMsg').live('click',function() { self.controlBlockInfo(false)	});


	
		
		$('#aSearch .searchForm .btn .clear').live('click',function() {			
			self.clearField(this);
			self.checkAcceptedAuthority();
			/*
			var fields = $('.searchForm div.active input');
			if(fields.length > 0) { 
				self.find(); 
			} else {				
				self.clearFields(false);
			}*/			
		});
		
		$('.searchForm .progress').live("click", function() { 
			self.abortRequest();
		});		
		
//		$('#aSearchBtn').live("mouseover", function() { 
//			self.main.tooltip.start = true;	
//			self.setMouseOverEvent('asearch');
//		});

		$('#sSearchBtn').live("mouseover", function() { 
			self.main.tooltip.start = true;	
			self.setMouseOverEvent('ssearch');
			
		});
		$('#aSearchBtn, #sSearchBtn').live("mouseout", function() { 
			self.main.tooltip.start = false;	
		});
	
		// Поиск по ситуациям
		$('#sSearchBtn').live("click", function() { 
				self.search(null, null,'fsit'); 
		});
	
		$('#aSearch .searchForm .datefrom, #aSearch .searchForm .dateto, #filterSearch .datefrom, #filterSearch .dateto').live('click', function(){ self.showCalendar(this) });
		
	    if (typeof customizedSearchInit != 'undefined')
	        customizedSearchInit(this);
	}
	

	this.addNotEmptyClass = function(element){
		$(element).addClass('classificatorsInputBlur_middle');
		$(element).parent().children('.btn').addClass('classificatorsInputBlur_right');
		$(element).parent().addClass('classificatorsInputBlur_left');
	}

	this.checkTypeAct = function () {
		var res = false;
		var inpTypeAct;
		if (this.activeSearch == 1) {
			inpTypeAct = $("#aSearch.jurisprudence .searchForm.generalTabForm input.type_act");
		} else {
			inpTypeAct = $("#aSearch.jurisprudence .searchForm:not(.generalTabForm) input.type_act");
		}
		if (inpTypeAct.length > 0) {
			if (jpa_ExtSearchDocKinds != null || jpa_ExtSearchDocKinds.length > 0) {
				var tmpArr = inpTypeAct.val().split("?");
				if (tmpArr[1] == 'or' || tmpArr[1] == 'and') {
					var numbArr = tmpArr[0].split(";");
					for (var j = 0; j < numbArr.length; j++) {
						for (var i = 0; i < jpa_ExtSearchDocKinds.length; i++) {
							if (numbArr[j] == jpa_ExtSearchDocKinds[i] + '') {
								res = true;
								break;
							} else {
								res = false;
							}
						}
						if (res == false) {
							break;
						}
					}
				}
			}
		}
		return res;
	}

	this.checkAcceptedAuthority = function () {           // проверка на вывод расширенных возможностей по поиску документов Конституционного суда
		// Если в классификаторе"Принявший орган" выбран "конституционный суд"
		var inpHideElem;
		var divAdvCourt;
		if (this.activeSearch == 1) {
			inpHideElem = $('#aSearch.jurisprudence .searchForm.generalTabForm input.accepted_authority');
			divAdvCourt = $('#aSearch.jurisprudence .searchForm.generalTabForm div.advancedCourt');
		} else {
			inpHideElem = $('#aSearch.jurisprudence .searchForm:not(.generalTabForm) input.accepted_authority');
			divAdvCourt = $('#aSearch.jurisprudence .searchForm:not(.generalTabForm) div.advancedCourt');
		}
		
		var enable = this.checkTypeAct();
		if (inpHideElem.length > 0) {
			var tmpArr = inpHideElem.val().split("?");
			if (tmpArr[1] == 'or' || tmpArr[1] == 'and') {
				if (tmpArr[0] == "9000018") {
					enable = true;
				}
			}
		}
		if (enable == true && divAdvCourt.is(':hidden')) {
			divAdvCourt.toggle("fast");
		} else if (enable == false && divAdvCourt.is(':visible')) {
			var divAdvCourtBox
			if (this.activeSearch == 1) {
				divAdvCourtBox = $('#aSearch.jurisprudence .searchForm.generalTabForm div.advancedCourtBox');
			} else {
				divAdvCourtBox = $('#aSearch.jurisprudence .searchForm:not(.generalTabForm) div.advancedCourtBox');
			}
			if (divAdvCourtBox.is(':visible')) {
				divAdvCourtBox.toggle("fast");
				if (this.activeSearch == 1) {
					$('#aSearch.jurisprudence .searchForm.generalTabForm div.advancedCourtBox input').val('').blur();
				} else {
					$('#aSearch.jurisprudence .searchForm:not(.generalTabForm) div.advancedCourtBox input').val('').blur();
				}
			}
			divAdvCourt.toggle("fast");
		}
	}
	
	this.removeNotEmptyClass = function(element){
		var self = this;
		if (element != null){
			$(element).removeClass('classificatorsInputBlur_middle');
			$(element).parent().children('.btn').removeClass('classificatorsInputBlur_right');
			$(element).parent().removeClass('classificatorsInputBlur_left');
		} else {
			$('div.searchForm div.value input:visible').each(function(){
				self.removeNotEmptyClass(this);
			});	
		}
	}
	
	this.initForm = function(tabs,callback, form){
	    var self = this;
	    this.main.document.lastDocNd = null;
		this.initMenu(self);
	    var searchForm = (form == null) ? $('#aSearch .searchForm') : $(form);
		$('input.classificator', searchForm).click(function() {
		 	self.classificator.open(this);
		 });		
		// все input'ы для ввода значений поисковых атрибутов
		var inputs = $('input:text, input:button', searchForm);
		inputs.focus(function(event) { 
			self.removeNotEmptyClass(this);
			self.focusField(this, event);
		});
		inputs.blur(function() {
			if ($(this).val().length > 0 && $(this).val()!='__.__.____'){
				self.addNotEmptyClass(this);
			} else {
				self.isEmpty(null, this);
			}
		});		
		inputs.keyup( function(event) { 
			self.keyupField(this,event);
			if ($(this).hasClass('hasDatepicker')) {
				self.isEmpty();
			}
		});
		
		inputs.keydown(function(event) {
			if (event.keyCode == 13 && !$('.suggest:visible').length) {
				if ( $(this).hasClass('hasDatepicker') ) {
					$(this).blur();
				}
				$('.searchForm .send').click();
			} else {
				self.main.tooltip.ctrlSuggest(event, this);
			}
		});
		
		$('input.date, input.date_to').datepicker( {
			showOn: false,
			onClose: function(){
				self.isEmpty();
			}
		});
		
		$('.period', searchForm).change( function(){ self.togglePeriod(this) });
		$('.numberType', searchForm).change( function(){ self.isEmpty(); });
		
	
		// checkSlider
		$('input.cbCheckSlider:checkbox', searchForm).change( function(){ self.isEmpty(null, this); });
	
		/*
		* Передаем ссылку, чтобы можно было вызывать подсказку(this.main.tooltip)
		* в теле плагина jquery.maskedinput-1.2.2.js
		*/
		$.mask.kApp = self;
		
		$('input.date, input.date_to').mask('39.19.9999');		
		self.main.list.lock = true;
		this.ready(callback);
		
	}
	
	this.initMenu = function(self) {
	    self.main.icons.reg('print', function () { self.main.document.print(); });
	    self.main.icons.reg('save', function () { self.main.document.save(); });
	}
	
	this.search = function(history,callback, stype){
		//dbg.msg(stype);

	    $('#tree .tree').remove();
		this.main.document.annotInfo = null;
		this.main.document.showForm();
		var self = this;
		this.main.resize.unset('document');
		this.main.list.cntSelected = null;
		this.stype = stype;
		this.state = null;
		//this.urlRequestParams = null;
		this.urlRequestParamsArr = [null, null];
		//this.urlRequestStats = null;
		this.urlRequestStatsArr = [null, null]
		this.main.panel.close();
		this.main.icons.clear();
		if (window.isEda) {
			self.main.eda.initIconsForASearch();
		}

		this.main.progress.start();
		this.activeSearch = 0;
		if (stype == 'asearch') {
			//this.main.document.initHelp('Search_Attribute');
			this.title = 'Атрибутный поиск';
		} else if(stype == "NTDPointer"){
			this.title = 'Поиск в Картотеке НТИ';
		} else if(stype == "fjpanalyzer"){
			this.title = 'Судебный Аналитик';
		} else if(stype == "fjpanalyzer2"){
			this.title = 'Судебный Аналитик';
		} else {
			this.title = 'Поиск';
		}
		
		this.main.document.initHelpByOid(true,'search');

		var secondSearch = false;
		if (stype == 'fjpanalyzer2') {
		    stype = 'fjpanalyzer';
		    this.stype = 'fjpanalyzer';
		    secondSearch = true;
		} else if (stype == 'fjpanalyzer') {
		    this.activeSearch = 0;
		}
 
		this.states = [null, null];
		if (history==null){
			this.main.restore.nextPage();
			var link = new LinkHistory(
				this.title,
				'search',
				function () {
					self.search(true, null, stype);
				});
			this.main.history.add(link);
		}
		if (secondSearch == true) {
		    this.setForm(function () {
		        self.activeSearch = 1;
		        if (callback)
		            callback();
		    });
		} else {
		    this.setForm(callback);
		}

	}
	this.setForm = function (callback) {
		var self=this;
		var data = null;
		if (this.stype && this.stype != 'asearch'){
			data = {
				struct: this.stype
			};
		}
	//	dbg.msg(data);
		if (this.main.req!=null){
			this.main.req.abort();
		}
		this.main.req = $.ajax({
			url: this.main.path.URL_ASEARCH_ATTRS,
			type: "GET",
			dataType : "html",
			data : data,
			success: function (html) {
				self.main.req = null; 
				self.main.tabs.empty();
				self.main.tabs.addBody(0, 'searchTabBody', html);
				if($('#aSearch').hasClass("jurisprudence")){
				    if ($('#aSearch.jurisprudence .searchForm').length == 0) {
				        self.classificator.openJpAnalizerTab(null, callback, true);
				        return;
				    }
				}
				self.startForm(callback, true);
				self.setType();
			}
		});						
	}
	
	this.startForm = function (callback, firstTab) {
		var self = this;
		this.initForm(null,function(){;});
		this.setTabs(function() {
		    if (callback != null) {
		      /*  if (self.activeSearch == 1 && firstTab) {
		            self.main.progress.stop();
		            $('#aSearch').show();
		            self.classificator.clickForJpATab(1, callback);
		        } else {
		            callback();
		        }*/
		        callback();
			} else {
				self.main.progress.stop();
				$('#aSearch').show();
				if (self.activeSearch == 1 && firstTab) {
				    $('#aSearch.jurisprudence .juristTab.generalTab').click();
				}
			}
		}, firstTab);
	}
	
	this.getStype = function (firstTab) {
	    if (this.stype == 'asearch') {
	        return this.stype;
	    } else if (this.stype == "fjpanalyzer" && firstTab != true) {
	        if (this.activeSearch == 1) {
	            return "fjpanalyzer2";
	        }
	    }
	    return this.stype;
	}

	this.setTabs = function (callback, firstTab) {
		var url = null;
		var stype = this.getStype(firstTab);
		if (stype == 'asearch') {
			url = this.main.path.URL_ASEARCH_TABS + '?init';
		} else {
			url = this.main.path.URL_ASEARCH_TABS + '?struct='+stype;
		}
		this.setTabsAjax(url, callback, firstTab);
	}
	
	this.setTabsAjax = function (url, callback, firstTab) {
		var self=this;
		$.ajax({
			url: url,
			type: "GET",
			dataType : "json",
			success: function (json) {
			    if (json && json.tabs) {
			        self.searchTabs.setTabs(json.tabs, callback, firstTab);
			        if ((json.tabs.length == 2 && json.tabs[0].title == 'Важные документы') || json.tabs.length == 1) {
			            return;
			        }
			        self.searchTabs.openTab($('.searchTabs li.active').get(0));
			    } else {
			        console.log("В ответе отсутствует json или json.tabs! search.js строка 302");
			    }
			}
		});						
	}
	
	this.hideForm = function () {
	    if (this.activeSearch == 1){
	        $('#aSearch .searchForm.generalTabForm div.infoKinds').hide();
	    } else {
	        $('#aSearch .searchForm:not(.generalTabForm) div.infoKinds').hide();
	    }
	}
	
	this.showForm = function(ids){
		var self = this;
		//console.log(ids);
	    //		console.log('show form');
		var infoKinds;
		if (this.activeSearch == 1) {
		    infoKinds = $('#aSearch .searchForm.generalTabForm div.infoKinds');
		} else {
		    infoKinds = $('#aSearch .searchForm:not(.generalTabForm) div.infoKinds');
		}
		infoKinds.each(function () {
			var found = false;
			var list=$(this).attr('class').split('_');
			for(var i in ids){
				for (var j in list) {
					if (parseInt(list[j], 10) == ids[i]) {
//						console.log(' SHOW TAB '+j);
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
	//	this.createRequest();
		this.isEmpty();
	}
	this.isEmpty = function(exception, element){
	    var self = this;
	    var empty=true;
	    var totalEmpty=true;
	    //		if (this.intervalId && element!=null) {
	    //			dbg.msg('Clear interval for inputs')
	    //			clearInterval(this.intervalId);
	    //		}
	    var period = new Array();
	    $(element).removeClass('classificatorsInputBlur_middle');
	    $(element).parent().children('.btn').removeClass('classificatorsInputBlur_right');
	    $(element).parent().removeClass('classificatorsInputBlur_left');
	    var inputs;
	    if(this.activeSearch == 1){
	        $('.searchForm.generalTabForm .send').addClass('gray').removeClass('yellow');
	        inputs = $('.searchForm.generalTabForm .infoKinds input, .searchForm.generalTabForm .iContext input');
	    } else {
	        $('.searchForm:not(.generalTabForm) .send').addClass('gray').removeClass('yellow');
	        inputs = $('.searchForm:not(.generalTabForm) .infoKinds input, .searchForm:not(.generalTabForm) .iContext input');
	    }
	    
	    
	    inputs.each(function (i) {
	    	var elem = $(this);
	    	if (elem.attr('type') != 'hidden' && elem.attr('type') != 'checkbox') {
				
				
	    		if (elem.hasClass('classificator') || elem.hasClass('slider')) {
	    			if (elem.hasClass('classificator')) {
						if (!self.classificator.isEmpty(this, exception)) {
							empty = false;
						}
					}else{
	    				var checkbox = $('.checkSlider input:checked', elem.parent());
						if (checkbox.length==1){
							//$(this).val($(this).next().find(".jslider-value span").text()+";"+$(this).next().find(".jslider-value-to span").text());
							empty = false;
						}
					}
					
				
				} else {
	    			var id = utils.getId(elem.parent().parent().attr('id'));
	    			//console.log(elem.val());
					if ((elem.val() != '') && (elem.val() != elem.attr('default'))) {
						if (elem.hasClass('hasDatepicker')) {
							var parent = elem.parent().parent()
							$('input.hasDatepicker:visible', parent).each(function() {
								empty = self.emptyDatepicker(id) ? empty : false;
								if(empty == false) {
									if (!(self.dateValidity(elem.val()))) {
										elem.parent().addClass('active');
									} else {
										empty = true;
									}
								}
							});
						}else{
							empty = false;
						}
						if (exception != this) elem.parent().addClass('active');
					} else {
						if (exception != this) {
							elem.parent().removeClass('active');
							if (elem.val() == '') {
								var defval = elem.attr('default');
								elem.val(defval);
							}
						}
					}					
				}
				if (empty==false && totalEmpty == true) {
					totalEmpty = false;
				}
			}
		});

        if (!totalEmpty) {
            if (this.activeSearch == 1) {
                $('.searchForm.generalTabForm .send').removeClass('gray').addClass('yellow');
            } else {
                $('.searchForm:not(.generalTabForm) .send').removeClass('gray').addClass('yellow');
            }
		   
		}
		
		return totalEmpty;
	}
	
	this.emptyDatepicker = function(id){
	    var empty = false;
	    var input;
	    if (self.activeSearch == 1) {
	    	input = $('.searchForm.generalTabForm #infoKinds_' + id + ' input:visible');
	    } else {
	    	input = $('.searchForm:not(.generalTabForm) #infoKinds_' + id + ' input:visible');
	    }
	    input.each(function (id) {
			if ( ($(this).attr('default')==$(this).val()) || (''==$(this).val()) ) {
				empty = true;
				return false;
			}
		});
		return empty;
	}
	this.ready = function(callback){
		var self = this;
		if (callback==null){
			callback = function(){
				self.main.progress.stop('search');
			}
			}
		if (this.stype == 'ssearch') {
			setTimeout(function(){self.find(
				null,
				null,
				callback
			)},1000);
		}else{
			callback();
		}	
	}
	this.setState = function(state, stype){
	    var self = this;
	    var inputs;
	    if (self.activeSearch == 1) {
	        inputs = $('.searchForm.generalTabForm input');
	    } else {
	        inputs = $('.searchForm input');
	    }
	    inputs.each(function (i) {
			if ($(this).attr('type') != 'hidden') {
				var field = $(this).parent().parent();
				var j = field.attr('id').split('_')[1];
				j = parseInt(j);
				
				if ($(this).hasClass('context') && state.context){
					$(this).val(state.context);
					$(this).parent().addClass('active')
				}
				if (state.fields[j]) {
					if (state.fields[j].active) {
						$(this).parent().addClass('active');
					}				
					if ($(this).hasClass('classificator')){
						$(this).next().val(state.fields[j].value);
						self.classificator.setValue($(this));
					}
					if ($(this).hasClass('string')){
						$(this).val(state.fields[j].value);
					}
					if ($(this).hasClass('slider')){
						$(this).val(state.fields[j].value);
						$(this).parent().find('.cbCheckSlider').attr("checked",state.fields[j].checked);
					}
					if ($(this).hasClass('number')) {
						var value = state.fields[j].value.split(';')
						$(this).val(value[0]);
						var parent = $(this).parent().parent();
						parent.find('select').val(value[1]);
					}
					if ($(this).hasClass('date')) {
						var value = state.fields[j].value.split(';')
						$(this).val(value[0]);
						var parent = $(this).parent().parent();
						parent.find('select').val(value[1]);
						if (value.length==3) {
							parent.find('.date_to').val(value[2]).parent().show();
							parent.find('span.to, span.from').show();
						}
					}
		
				}
			}	
		});
		this.searchTabs.openTab(state.active);
		//this.urlRequestStats = state.urlRequestStats;
		this.urlRequestStatsArr[this.activeSearch] = state.urlRequestStats;
		this.filter=state.filter;
		//this.urlRequestParams = state.urlRequestParams;
		this.urlRequestParamsArr[this.activeSearch] = state.urlRequestParams;
		if (state.stype == "fjpanalyzer2") {
		    this.stype = "fjpanalyzer";
		} else {
		    this.stype = state.stype;
		}
		if (state.result){
			this.find(true,state.active, null, true);
		}else{
			$('#aSearch').show();
			this.main.tabs.hidePanel();
			this.find(true);			
		}
		if (state.listId!=null) {
			this.main.listDocument.scrToItem = state.listId;
		}
	}
	this.saveState = function(isBackToFind){
		var fields=Array();	
		var self=this;
		var tabsActive=$('.searchTabs li.active');
		var context = null;
		if (tabsActive.length == 1) {
			tabsActive = parseInt($('.searchTabs li.active').attr('id').split('_')[1]);
		}else {
			return;
		}
		if (this.searchTabs.active==-2){
			tabsActive = -2;	
		}
		var inputs;
		if (this.activeSearch == 1) {
		    inputs = $('.searchForm.generalTabForm div.active input');
		} else {
		    inputs = $('.searchForm:not(.generalTabForm) div.active input');
		}
		inputs.each(function (i) {
			
			var value=null;
			var checked=null;
			var active=null;
			
			if ($(this).hasClass('classificator')){
				value=$(this).next().val();
			}
			if ($(this).hasClass('context')){
				context=$(this).val();
			}
			if ($(this).hasClass('string')){
				value=$(this).val();
			}
			if ($(this).hasClass('slider')){
				value=$(this).val();
				checked=$(this).parent().find('.cbCheckSlider').attr("checked");
			}
			if ($(this).hasClass('number')){
				var typeNumber = $(this).parent().prevAll('select').val()
				value=$(this).val()+';'+typeNumber;				
			}
			if ($(this).hasClass('date')) {
				dateFrom = $(this).val();
				var type = $(this).parent().prevAll('select').val()
				if (type>2) {
					dateTo = $('.date_to', $(this).parent().parent()).val()
					if (utils.compareDate(dateFrom, dateTo)) {
						value = dateTo + ';' + type + ';' + dateFrom;
					} else {
						value = dateFrom + ';' + type + ';' + dateTo;
					}
				} else {
					value = dateFrom+';' + type;
				}
				
			}
			if (value!=null){
				active=$(this).parent().hasClass('active');
				var j=$(this).parent().parent().attr('id').split('_')[1];
				j=parseInt(j);
				var field = {
					value: value,
					active: active
				}
				if(checked != null) {
					field.checked = checked;
				}
				fields[j]=field;
			}
		});
		var state={
			result: ($('#searchList:visible').length == 1 || isBackToFind == true),
//			result:true,
			context: context,
			active: tabsActive,
			stype: this.getStype(),
			filter: this.filter,
			urlRequestStats: this.urlRequestStatsArr[this.activeSearch],
		    //urlRequestParams:this.urlRequestParams,
			urlRequestParams: self.urlRequestParamsArr[self.activeSearch],
			fields: fields,
			listId:this.main.listDocument.active
		}
		if ($('#searchList:visible').length == 0 && isBackToFind != true){
			state.listId = null;
		}
		this.states[this.activeSearch] = state;
	}
	this.createRequest = function(isBackToFind){
	
//		console.log('create request ');
		var self = this;
		var attr = new Array();
		var	tabsActive=$('.searchTabs li.active');
		if (tabsActive.length>0){
			tabsActive=tabsActive.attr('id')
		}else{
			tabsActive=$('.searchTabs li:first').attr('id')
		}
		tabsActive=utils.getId(tabsActive);
	    //	parseInt(.split('_')[1]);		
	    //var tab = this.searchTabs.tabs[tabsActive].urlParams;
		var tab = this.searchTabs.searchers[this.activeSearch][tabsActive].urlParams;
		var fields;
		if ($('.searchForm .checkSlider .cbCheckSlider').attr("checked")) { // не добавляется с .add('') ???
			fields = $(".searchForm div[style*='block'] > div.active input, .searchForm div[style*='block'] > div.active input.slider, .searchForm div.active input");
		} else {
			fields = $(".searchForm div[style*='block'] > div.active input, .searchForm div.active input");
		}
		
		var dateFrom = null;
		var dateTo = null;
		fields.each(function (i) {
			var input = $(this);
			if (input.parent().parent(':visible').length == 0 && isBackToFind != true) {
				if (input.hasClass('noSuggest') && input.val() != input.attr('default')){
					var el;
					if(self.activeSearch == 1){
						el = input.parents('#aSearch.jurisprudence .searchForm.generalTabForm');
					} else {
						el = input.parents('#aSearch.jurisprudence .searchForm:not(.generalTabForm)');
					}
					if(el.length == 0) return;
				} else {
					return;
				}
		    }
			if (input.attr('type') != 'hidden') {
				var id = $(this).parent().parent().attr('id').split('_')[1];
				var type = /[^\s]*/.exec(input.attr('class'))
				if (type && type.length){
					type=type[0];	
				}
				var value = input.val();
				//console.log(id);			
				switch (type) {
					case 'string':
						var tmpVal = 'find' + id + '=';
						if($(this).hasClass('allText') && value.trim().indexOf(" ") > 0 && value.indexOf('"') == -1){
							tmpVal += '"' + value + '"';
						} else {
							tmpVal += value;
						}
						attr.push(tmpVal);
						break;
					case 'number':
						var numberType = $(this).parent().prevAll('select').val();
						attr.push('find' + id + '=' + value);
						attr.push('find' + id + 'type='+numberType);
						break;
					case 'date':
						var findtype = $(this).parent().prevAll('select').val();
						if (!/_/.test(value)){
							dateFrom = {'id':id, 'value':value};
							attr.push('find' + id + 'type=' + findtype); 
						}
						break;
					case 'date_to':
						if (value!='' && value!='__.__.____' && !/_/.test(value)){
							dateTo = {'id':id, 'value':value};
						}
						break;
					case 'classificator':
						var hiddenInput = input.next();
						if (hiddenInput==null){
							break;
						}
						var arr = hiddenInput.val().split('?'); 
						var idList = arr[0];
						var logic = arr[1];
						attr.push('find' + id + '=' + idList + '&find' + id + 'lop='+logic);
						break;
						
					case 'slider':
						var sliderType;
						var val = value.split(';');
						if (val.length != 2) {
							break;
						}
						
						if (val[0].indexOf("Infinity") == 0) {
							sliderType = 3; // строго больше
							var sliderData = input.data("jslider");
							if (!sliderData) {
								break;
							}							
							val[0] = sliderData.settings.to;
						} else if (val[0] == val[1]) {
							sliderType = 1; // равно
						} else if (val[1].indexOf("Infinity") == 0) {
							sliderType = 4; // больше либо равно
						} else {
							sliderType = 7; // в диапазоне
						}
						
						attr.push('find' + id + '=' + val[0]);
						attr.push('find' + id + 'type='+sliderType);
						
						if (sliderType == 7) {
							attr.push('find' + id + 'to=' + val[1]);
						}
						break;
					case 'longdouble':
						var longdoubleType = $(this).parent().prevAll('select').val();
						attr.push('find' + id + '=' + value);
						attr.push('find' + id + 'type='+longdoubleType);
						break;
						
					case 'longdouble_to':
						attr.push('find' + id + 'to=' + value);
						break;
				}
			}						
		});	

		// Проверка на правильность периода
		if ((dateFrom) && (dateTo)) {
			if (utils.compareDate(dateFrom.value, dateTo.value)) {
				var temp = dateFrom.value;
				dateFrom.value = dateTo.value;
				dateTo.value = temp;
			}
			attr.push('find' + dateFrom.id + 'from=' + dateFrom.value);
			attr.push('find' + dateTo.id + 'to=' + dateTo.value);
		} else {
			if (dateFrom) attr.push('find' + dateFrom.id + 'from=' + dateFrom.value);
			if (dateTo) attr.push('find' + dateTo.id + 'to=' + dateTo.value);
		}
		var iContext;
		if (this.activeSearch == 1) {
			iContext = $('#aSearch .searchForm.generalTabForm .iContext input');
		} else {
			iContext = $('#aSearch .searchForm:not(.generalTabForm) .iContext input');
		}
		if (iContext.length>1){
			iContext=iContext.filter(':visible').eq(0);
		}
		if (iContext.length>0 && iContext.val()){
			
			attr.push('&icontext='+iContext.val());
		}
		
		this.urlRequestParamsArr[this.activeSearch] = attr.join('&');
		var stype = this.getStype();
		if (stype == 'asearch') {
		    this.urlRequestStatsArr[this.activeSearch] = this.main.path.URL_ASEARCH_STAT + '?' + tab + attr.join('&');
		} else {
		    this.urlRequestStatsArr[this.activeSearch] = this.main.path.URL_ASEARCH_STAT + '?struct=' + stype + '&' + tab + attr.join('&');
		}
	}
	this.find = function(history, tab, callback, isBackToFind){
		var self=this;
		var addHistory = this.urlRequestStatsArr[this.activeSearch] != null;
		this.createRequest(isBackToFind);
		this.saveState(isBackToFind);
		if (!history){
			this.rewriteHistory(addHistory);
		}
		this.startRequest();
		
		var loc = utils.URLAttrParse(this.urlRequestStatsArr[this.activeSearch]);
		
		this.request = $.ajax({
			url: loc.location,
			type: "GET",
			dataType : "json",
			data: loc.attr,
			complete : function (){},
			success: function (json){
				
				if (json.message){
					self.request=null;
					self.stopRequest();
					self.main.tooltip.create($('body'), json.message, 3000, 'documentNotFound');
					self.main.tooltip.setCenter($('.documentNotFound'));
					return;
				}
				self.searchTabs.setStats(json.tabs);
				self.request=null;
				self.stopRequest();
				if (tab!=null){
					if (tab!=-2){
						self.resultList($('#searchTabs_'+tab).get(0),true);
					}else{
						self.resultList($('#searchTabs_-1').get(0),true,null,true);
					}
				}else{
					self.main.progress.stop();
				}
				if (callback){
					callback();
				}
			
				self.strResultListStatus = self.resultListStatus(true);
			}
		});	
	}
	this.rewriteHistory = function(add){
		var self=this;
		var state = this.states[this.activeSearch];
		if (state == null) {
		    return;
		   // console.log("rewriteHistory fail");
		}
		//console.log("rewriteHistory " + add);
		var stype = this.getStype();
		var params = this.main.search.resultListStatus();
		this.main.restore.setSearch(stype,state);
		var type = (state.result == true) ? 'searchResult' : 'search';
		var link = new LinkHistory(
			this.title,
			type,
			function () {
				var el = $('.docList ul.list');
				if (el.length>0){
					el.get(0).innerHTML="";
				}				
				self.search(true, function () {
				    if (self.activeSearch == 1) {
				        self.classificator.clickForJpATab(1, function () { self.setState(state); self.isEmpty(); });
				    } else {
				        self.setState(state);
				    }
//					self.main.progress.stop();
				}, stype);
			},
			params);
		if (add==true){
		//	this.main.restore.nextPage();
			this.main.history.add(link);
		}else{
			this.main.history.rewrite(link);
		}
	}
	
	this.resultList = function(element,history,createTabs,important){
		var self = this;
		if(element==null){
			return;
		}
		if ($('span',$(element)).hasClass('empty')){
			return
		}
		$('.tabBody:visible').addClass('aSearchList').removeClass('text');
		$('.searchTabs, .searchForm').hide();
		$('#aSearch .head').hide();
		$('#aSearch.pointerNTD').addClass('listView');
		$('#aSearch .juristTabs').hide();
		if (important){
			this.searchTabs.openTab(-2, true);
		}else{
			this.searchTabs.openTab(element, true);
		}
		
		var stype = this.getStype();
	    //var urlParams = this.urlRequestParams+'&'+this.searchTabs.tabs[this.searchTabs.active].urlParams;
		var urlParams = self.urlRequestParamsArr[self.activeSearch] + '&' + this.searchTabs.searchers[this.activeSearch][this.searchTabs.active].urlParams;
		if (stype == 'asearch') {
			var url=this.main.path.URL_ASEARCH_LIST+'?'+urlParams;
			if (this.stypeEx != null)
				url += '&stypeex=' + this.stypeEx;
		} else {
			var url=this.main.path.URL_ASEARCH_LIST+'?struct='+stype+'&'+urlParams;
		}
		
		$('#searchList').show();
		if (this.resultListParams==null ){
			$('#searchList .docList').empty();
			$('#searchList .docList').attr('id','');			
		}

		if (this.main.listDocument.isListDocuments()){
			callback = function () {
				$('#aSearch').show();
				if (self.disableListDocumentCallback != null) {
					if (self.disableListDocumentCallback) {
						self.main.progress.stop();
						return;
					}
				}
				self.mainIconsAdds();
				self.main.bookmarks.area = 'aSearch';		
		//		self.main.icons.init();
				self.main.progress.stop();
				
				if (createTabs == null) {
					var tabs = self.searchTabs.searchers[self.activeSearch];
					for (i in tabs){
						tabs[i].hotkey = tabs[i].hotKey;
						tabs[i].link = $('#searchTabs_'+i).get(0);
						if (i==-2){
							tabs[i].important = true;
							tabs[i].link = $('#searchTabs_-1').get(0);
		//							if (!tabs[i].quantity){
		//								delete tabs[i];	
		//								continue;
		//							}
						}
						tabs[i].action = function(){
							self.searchTabs.setActiveTab(this.link);
							self.resultList(this.link,null,false,this.important);
						}; 
		//						if ($('span', $('#searchTabs_' + i)).hasClass('empty')) {
		//							//$('#tabs li#tab_'+i).hide();
		//							delete tabs[i];
		//						}
						
					}
					self.main.tabs.setTabs(tabs, null, 'asearch');
					self.searchTabs.searchers[self.activeSearch] = tabs;
				}
				//после того как список построен и его id обновился, перепишем его в this.states
				self.setListId();
			};
			this.saveState(true);
			this.main.listDocument.init(url, callback, self.getContext());				
	//		this.main.listDocument.iContext.show();
		}
		if (createTabs==null){ 
			this.main.restore.nextPage();
			this.rewriteHistory(!history);
			//this.rewriteHistory();
		} else {
		    this.rewriteHistory();
		}
		this.main.document.initHelpByOid(true,'lists',this.main.document.nd);
		//this.main.document.resetInfo();
	}
	this.setListId = function(){
		if(this.states[this.activeSearch] && this.main.listDocument.active)
			this.states[this.activeSearch].listId = this.main.listDocument.active;	
	}

	this.mainIconsAdds = function() {
		this.main.icons.clear();
		this.main.icons.add('print', 'document_print');
		this.main.icons.add('word', 'document_word');
		this.main.icons.add('save', 'document_save');
		this.main.icons.add('folder_put','document_folder_put');
		this.main.icons.add('put_control','document_put_control');
		this.main.icons.disable('put_control');
		this.main.icons.disable('folder_put');
		if (window.isEda) {
			this.main.eda.initIconsForASearch();
		}
	}
	
	this.resultClose = function(element){
//		dbg.msg('close');
		$('#tabs').hide();
		$('#aSearch').show();
		$('.tabBody').removeClass('aSearchList');
		$('.tabBody').addClass('text');
		$('.searchTabs').show();
		$('.juristTabs').show();
		if (this.activeSearch == 1) {
		    $('.searchForm.generalTabForm').show();
		} else {		    
		    $('.searchForm:not(.generalTabForm)').show();
		}
		$(window).resize();
		$('#aSearch .head').show();
		$('#aSearch.pointerNTD').removeClass('listView');
		$('#searchList').hide();
		this.main.icons.clear();
		if (window.isEda) {
			this.main.eda.initIconsForASearch();
		}
		this.saveState();
		this.rewriteHistory();
		this.main.tabs.hidePanel();
		this.isEmpty();
	}
	this.clearField = function(element) {
		element = $('input',$(element).parent().parent());
		element.val('').blur();
		//this.isEmpty();
	}
	this.clearFields = function (openTab) {
	    var self = this;

		var searchForm; 

	    if (this.activeSearch == 1) {
			searchForm = $('#aSearch .searchForm.generalTabForm');
		} else {
			searchForm = $('#aSearch .searchForm:not(.generalTabForm)');
		}

	    $('input[class!=slider][type!=checkbox]', $('div.active', searchForm)).val('');

	    var searchTabs =  $('.searchTabs', searchForm);

	    if(searchTabs.length == 0){
	    	searchTabs = $('#aSearch .searchTabs');	
	    }
	    $('li > span', searchTabs).slideToggle('slow', function () {
	        $('span.empty', searchTabs).remove();
	    });

	    $('span.result', searchTabs).empty();

	    $('li', searchTabs).removeClass('locked');

	    $('#aSearch select.numberType').each(function () {
	        $(this).val('4');
	    })
	    $('#aSearch select.period').each(function () {
	        $(this).val('0');
	    })
	    $('span.to, span.from, div.value_to', '#aSearch').hide();
	    //		if (openTab) {
	    //			self.searchTabs.openTab(-1, true);
	    //		}

	    this.removeNotEmptyClass(null);
	    this.isEmpty();
	    var status = $('.status', searchForm);

	    var checkBox = $('input.cbDocToBusinnes');
	    if (checkBox) {
	        if (checkBox.attr('checked')) {
	            checkBox.attr('checked', false);
	        }
	    }
	    $('#aSearch .checkSlider input[type=checkbox]').attr('checked', null).change();
	    if (status && status.length == 1) {
			status.attr('class', 'status');
			status.hide();
			if (self.getStype() == 'fjpanalyzer2' && self.party2 != null){
				self.party2.clear();
			} else {
				party.clear();
			}
	    }
	    this.checkAcceptedAuthority();
	}
	this.cutNumber = function(element){
		var elValue = element.val();

		var result = /^([N|№]\s+(\S+))/.exec(elValue);

		if (result == null || result.length == 0) {
			result = /\s([N|№]\s+(\S+))/.exec(elValue);
		}
 
		if (result && result.length > 0) {
			if(result[2] != "" && result[2] != " " && result[2] != null){
				element.val(result[2]);
			}
		}
	}
	this.keyupField = function(element,event){
//		dbg.msg(event);
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
		
		classElem = /[^\s]*/.exec(classElem)
		if (classElem && classElem.length){
			classElem=classElem[0];	
		}
		
		switch (classElem) {
			case 'string':
				url = main.path.URL_ISEARCH_QUICKRESULTS+'?hid=isearch';
				break;
			
			case 'classificator':
				var tabId=utils.getUrlParam('?'+self.main.search.searchTabs.getActiveTab().urlParams,'tab');
				idClassificator = '&classificator_id=id_'+fieldId+'_'+tabId;
				url = main.path.URL_CLASSIFICATORS+'?'+idClassificator;
				if (this.classificator.checkValue(element)) {
				    $('.searchForm .send:visible').removeClass('gray').addClass('yellow');
				}			
				break;
			case 'number':
//			dbg.msg('keyup on number');
				if ((event.ctrlKey && event.keyCode == '86') || (!event.keyCode)) {
					this.cutNumber(jqElement);
				}
				url = main.path.URL_ISEARCH_QUICKRESULTS+'?hid=num_attr&attr_id='+fieldId;
				break;
			case 'date hasDatepicker':
			//	jqElement.val(this.dateValidator(val));
			//	dateValue = jqElement.val();
				break;
			case 'date_to hasDatepicker':
			//	jqElement.val(this.dateValidator(val));	
			//	dateValue = jqElement.val();			
				break;
				
		}
		 if (classElem.indexOf('date')==-1 && classElem.indexOf('classificator')==-1) {
		 	 this.main.tooltip.suggest(event,element,url);
		 }
		 
		 this.isEmpty(element,null);
	}	
	
	this.focusField = function(element, event){
		this.main.tooltip.killSuggest();
		var self = this;
		var jqElem = $(element);
		var block = jqElem.parent();
		if (!block.hasClass('active')){
			block.addClass('active');
		}

		if (jqElem.val() == jqElem.attr('default')) {
			jqElem.val('');
		}
		
		if (!jqElem.hasClass('hasDatepicker') && !jqElem.hasClass('classificator')) {
//			dbg.msg('Set Interval for inputs');
			if (self.intervalId!=null){
				clearInterval(this.intervalId);
			}						
			$(element).bind('blur',function(){
				clearInterval(self.intervalId);	
			})
			this.intervalId = setInterval(
				function(){
					if (!$(element).is(':visible') || !$(element).parent().hasClass('active')){
						clearInterval(self.intervalId);
						//dbg.msg('clear interval for inputs');
						return;
					}
					//dbg.msg('interval for inputs');
					self.keyupField(element,event);	
				},
				600
			)
		}
	}
	
	this.setMouseOverEvent = function(stype) {
		var self = this;
		var tooltip = self.main.tooltip;
		var searchBtn = null;
		var url;
		var cssClass;
		
		if (stype == 'asearch') {
			searchBtn = $('#aSearchBtn');
			url = self.main.path.MSG_ASEARCH_TOOLTIP;
			cssClass = 'asearchTooltip';
		} else {
			searchBtn = $('#sSearchBtn');
			url = self.main.path.MSG_SSEARCH_TOOLTIP;
			cssClass = 'ssearchTooltip';
		}
		
		$.ajax({
			url: url,
			dataType: "html",
			type: "get",
			success: function(html){
				tooltip.createSearchTooltip(searchBtn.parent(), html, 1500, cssClass, false, 3000, searchBtn);
//				dbg.msg('aSearch tooltip');
			}
		});
		return;
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

	this.showCalendar = function(element) {
		element = $(element).parent().next();
		element.datepicker('show');
	}
	
	// Формирование списка параметров в результатах поиска
	this.resultListStatus = function(toHtml) {
		var self = this;
		if (window.isEda) {
			var result = self.main.eda.resultListStatus(self, toHtml);
			if (result != null)
				return result;
		}
		var result = [];
		var param = '';
		var state = this.states[this.activeSearch];
		if (state && state.fields && state.fields.length) {
		    for (var i in state.fields) {
		        var typeField;
		        if (self.activeSearch == 1) {
		            typeField = $(".searchForm.generalTabForm #infoKinds_" + i + " div.value input").attr('class');
		        } else {
		            typeField = $(".searchForm:not(.generalTabForm) #infoKinds_" + i + " div.value input").attr('class');
		        }
				var value = state.fields[i].value;
				typeField = /[^\s]*/.exec(typeField)
				if (typeField && typeField.length){
					typeField=typeField[0];	
				}		
				switch (typeField) {
					case 'string': {
						break;
					}
					
					case 'classificator': {
						value = self.classificator.getValueString(value);
						break;
					}
					
					case 'number': {
						var arr = value.split(';');
						value = self.numberType[arr[1]]+' '+ arr[0];
						break;
					}
					case 'slider': { 
						var arr = value.split(';');
						if (arr && arr.length == 2){
							if (arr[1].indexOf("Infinity") == 0){
								if (arr[0].indexOf("Infinity") != 0){
									value = 'от '+arr[0];
								}else{
									value = 'от '+window.sliderTo;
								}
							}else if(arr[0] == arr[1]){
								value = arr[0];
							}else if(arr[0] == 0){
								value = 'до '+arr[1];
							}else if(arr[0].indexOf("Infinity") != 0){
								value = 'от '+arr[0]+' до '+arr[1];
							}
						}
			
						break;
					}
					
					// По дефолту берем дату, у неё два класса в инпуте, чтобы не парсить
					default: {
						if (/_/.test(value)) {
							value = null;
						}else{
							value = this.DateAttrToString(value);
						}
						break;
					}
				}
		        //j++;
				var param;

				if (self.activeSearch == 1) {
				    param = $('.searchForm.generalTabForm #infoKinds_' + i + ' div.label').text();
				} else {
				    param = $('.searchForm:not(.generalTabForm) #infoKinds_' + i + ' div.label').text();
				}

				//param = $('#infoKinds_' + i + ' div.label').text();
				//result += '<p>' + $('#infoKinds_' + i + ' div.label').text() + ': <span>' + value + '</span></p>';
				if (value!=null){
					result.push({'title':param ,'value':value});
				}
			}
			
//			var paddingTop = $('#workspace .docList').css('padding-top');
//			paddingTop = parseInt(/\d+/.exec(paddingTop)[0]);
//			var marginTop = $('#workspace .docList').css('padding-top');
//			marginTop = parseInt(/\d+/.exec(marginTop)[0]);
//			$('#workspace .docList').css('padding-top',(14*(result.length+1)+24)+'px') ;
//			$('#workspace .docList').css('margin-top',(14*(result.length+1)+24)+'px') ;
//			$('#workspace .searchInfo').css('margin-top',(-14*(result.length+1)-24)+'px') ;
			
			if (toHtml) {
				result = this.buildStatusHTML(result)
			}
			
			
			return result;
		}
	};
	
	this.buildStatusHTML = function(json){
		var html = '<div>' + lex('SearchCriteria') + ':</div><table>';
		for (var i in json) {
			if($.trim(json[i].title) == 'Цена иска:') json[i].value += ' руб.';
			html += '<tr><td class="col1">' + json[i].title + ' </td><td class="col2"> ' + json[i].value + '</td></tr>';
		//	header = '';
		}	
		html+= '</table>';
		return html;
	};
		
	// Получаем человеческую строку из поискового аттрибута для даты
	this.DateAttrToString = function(value) {
		var result = '';
		var arr = value.split(';');
		if (arr.length == 2) {
			result = this.dateType[arr[1]]+' '+arr[0];
		}
		else {
			result = this.dateType[arr[1]]+' с '+arr[0]+' по '+arr[2];
		}
		
		return result;
	}
	this.getContext = function(value) {
	    var context = new Array();
	    var state = this.states[this.activeSearch];
	    var self = this;
		if (state){
		    for (var i in state.fields) {
		        var lable;
		        var text_;
		        if (self.activeSearch == 1) {
		            lable_ = $('.searchForm.generalTabForm #infoKinds_' + i + ' input.string');
		            text_ = $('.searchForm.generalTabForm #infoKinds_' + i + ' .label').text();
		        } else {
		            lable_ = $('.searchForm:not(.generalTabForm) #infoKinds_' + i + ' input.string');
		            text_ = $('.searchForm:not(.generalTabForm) #infoKinds_' + i + ' .label').text();
		        }
		        
		        if (state.fields[i].active == true && lable_.length > 0 && text_ == 'По тексту: ') {
					context.push(state.fields[i].value);
				}
			}	
			if (state.context){
				context.push(state.context);
			}
		}
		if (context.length==0){
			return null;
		}
		
		
		return context.join(' '); 
	}
	this.startRequest = function () {
		if($('#aSearch').hasClass('pointerNTD')){
			var searchTabs = $('#aSearch.pointerNTD .searchForm .searchTabs');
			searchTabs.addClass('progress');
			$('#aSearch.pointerNTD .searchForm .status').addClass('progress');
			$('#aSearch .searchForm .searchTabs li > span').slideUp('slow');
			$('#aSearch .searchForm .progress').show();
			$('#aSearch .searchForm .send').hide();
			$('#aSearch .searchForm .tooMuch').removeClass('tooMuch');
			$('#aSearch .searchForm div.empty').removeClass('empty');
		} else if (this.activeSearch == 1) {
	        var searchTabs = $('#aSearch .searchForm.generalTabForm .searchTabs');
	        searchTabs.addClass('progress');
	        $('#aSearch.jurisprudence .searchForm.generalTabForm .status').addClass('progress');
	        $('#aSearch .searchForm.generalTabForm .searchTabs li > span').slideUp('slow');
	        $('#aSearch .searchForm.generalTabForm .progress').show();
	        $('#aSearch .searchForm.generalTabForm .send').hide();
	        $('#aSearch .searchForm.generalTabForm .tooMuch').removeClass('tooMuch');
	        $('#aSearch .searchForm.generalTabForm div.empty').removeClass('empty');
	    } else {
	        if ($('#aSearch .searchForm .searchTabs').length == 0) {
	            var searchTabs = $('#aSearch .searchTabs');
	            searchTabs.addClass('progress');
	            $('#aSearch.jurisprudence .status').addClass('progress');
	            $('#aSearch .searchTabs li > span').slideUp('slow');
	            $('#aSearch .progress').show();
	            $('#aSearch .send').hide();
	        } else {
	            var searchTabs = $('#aSearch .searchForm:not(.generalTabForm) .searchTabs');
	            searchTabs.addClass('progress');
	            $('#aSearch.jurisprudence .searchForm:not(.generalTabForm) .status').addClass('progress');
	            $('#aSearch .searchForm:not(.generalTabForm) .searchTabs li > span').slideUp('slow');
	            $('#aSearch .searchForm:not(.generalTabForm) .progress').show();
	            $('#aSearch .searchForm:not(.generalTabForm) .send').hide();
	        }
	        $('#aSearch .searchForm:not(.generalTabForm) .tooMuch').removeClass('tooMuch');
	        $('#aSearch .searchForm:not(.generalTabForm) div.empty').removeClass('empty');
	    }
	}
	this.stopRequest = function () {
	    if($('#aSearch').hasClass('pointerNTD')){
	    	$('#aSearch.pointerNTD .searchForm .status').removeClass('progress');
	        $('#aSearch .searchForm .searchTabs').removeClass('progress');
	        $('#aSearch .searchForm .searchTabs li > span').slideDown('slow');
	        $('#aSearch .searchForm .progress').hide();
	        $('#aSearch .searchForm .send').show();
		} else if (this.activeSearch == 1) {
	        $('#aSearch.jurisprudence .searchForm.generalTabForm .status').removeClass('progress');
	        $('#aSearch .searchForm.generalTabForm .searchTabs').removeClass('progress');
	        $('#aSearch .searchForm.generalTabForm .searchTabs li > span').slideDown('slow');
	        $('#aSearch .searchForm.generalTabForm .progress').hide();
	        $('#aSearch .searchForm.generalTabForm .send').show();
	    } else {
	        if ($('#aSearch .searchForm .searchTabs').length == 0) {
	            $('#aSearch.jurisprudence .status').removeClass('progress');
	            $('#aSearch .searchTabs').removeClass('progress');
	            $('#aSearch .searchTabs li > span').slideDown('slow');
	            $('#aSearch .progress').hide();
	            $('#aSearch .send').show();
	        } else {
	            $('#aSearch.jurisprudence .searchForm:not(.generalTabForm) .status').removeClass('progress');
	            $('#aSearch .searchForm:not(.generalTabForm) .searchTabs').removeClass('progress');
	            $('#aSearch .searchForm:not(.generalTabForm) .searchTabs li > span').slideDown('slow');
	            $('#aSearch .searchForm:not(.generalTabForm) .progress').hide();
	            $('#aSearch .searchForm:not(.generalTabForm) .send').show();
	        }
	    }
	}
	this.abortRequest = function () {
	    if($('#aSearch').hasClass('pointerNTD')){
			$('#aSearch.pointerNTD .searchForm .status').hide('progress');
		} else if (this.activeSearch == 1) {
	        $('#aSearch.jurisprudence .searchForm.generalTabForm .status').hide('progress');
	    } else {
	        if ($('#aSearch .searchForm .searchTabs').length == 0) {
	            $('#aSearch.jurisprudence .status').hide('progress');
	        } else {
	            $('#aSearch.jurisprudence .searchForm:not(.generalTabForm) .status').hide('progress');
	        }
	    }
	    if (this.request!=null){
			this.request.abort();
		}
		this.stopRequest();
	}
	
	this.dateValidity = function(value) {
		if ( (value.indexOf('_') != -1) || ('' == value) ) {
			return true;
		}
		return false;
	}
	this.controlBlockInfo = function(action){
		var self = this;
		var b1 = $('#searchList .searchAttrs, #searchList .hideASearchInfoMsg');
		var b2 = $('#searchList .showASearchInfoMsg');
		if (!action){
			b1.hide();
			b2.show();
		}else{
			b2.hide();
			b1.show();
		}
		self.main.listDocument.ctrlOffset();
		if ($.browser.msie) {
			$('#searchList').hide();
			setTimeout(function(){
				$('#searchList').show();
			}, 300);
		}else{
		}
	}	
	this.resize = function(){
		var self = this;
		var callback = function() { 
			var el = $('#header');
			if (el.width()>800){
				//console.log('--');
				el.removeClass('tight');
			}else{
				//console.log('++');
				el.addClass('tight');
			}
		}
		this.main.resize.set('header',callback);
		callback();
	}
	
	if (init==null){
		this.init();
	}

}
