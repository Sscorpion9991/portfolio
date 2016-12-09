function  Classificator(search,init){
	this.search=search;
}
	Classificator.prototype.dialog=null;
	Classificator.prototype.list = new Array();
	Classificator.prototype.result = new Array();
	Classificator.prototype.openNode = new Array();
	Classificator.prototype.logic = null;
	Classificator.prototype.input = null;
	Classificator.prototype.id = null;
	Classificator.prototype.shortType = null;
	Classificator.prototype.ru = {OR: 'ИЛИ', AND: 'И', NOT: 'КРОМЕ'};
	Classificator.prototype.class_name = null;
	Classificator.prototype.filterValue = null;
	Classificator.prototype.timeoutId = null;
	Classificator.prototype.cacheList = null;
	Classificator.prototype.shortCacheList = null;
	Classificator.prototype.cross;
	Classificator.prototype.tmp = 0;
	Classificator.prototype.offsetTop = null;
	Classificator.prototype.currentElement = null;
	Classificator.prototype.init = function () {
		var self=this;
		classif = this; // такая схема нужна в КБД при редактировании карточки
		$('#dialog .closeDialog').live('click',function() { classif.close(this) });
		$('#dialog .cancel').live('click',function() { classif.close() });
		$('#dialog .submit').live('click',function() { classif.submit() });
		$('#dialog .dlist ul li > p[class!=haschild]').live('click',function() { classif.select(this) });
		$('#dialog .dlist li .open').live('click',function() { classif.openNode(this) });
		$('#dialog .dlist li .close').live('click',function() { classif.closeNode(this) });
		$('#dialog .result li').live('click',function() { classif.remove(this) });
		$('#dialog .reset').live('click',function() { classif.clear() });
		$('#dialog input').live('change',function() {  classif.setLogic(this) });
		$('#dialog .dlist ul li > p.haschild').live('click', function(){ classif.openClass(this) });
		$('#dialog .select_all').live('click', function(){ classif.selectAll() });
		$('#dialog .back').live('click', function(){ classif.hideSubClass() });
		$('div.advancedCourt').live('click', function() { self.showAdvancedCourts(this); });//открытие расширенных возможностей по 
																								//поиску док-в Конституционного. суда
		$('#aSearch.jurisprudence .juristTab').live('click', function () { self.openJpAnalizerTab(this) });
	};
	
	Classificator.prototype.clickForJpATab = function (numTab, callback) {
		if ($('#aSearch.jurisprudence .juristTab').length == 0) {
			if (callback) {
				callback();
			}
			return;
		}
		if (numTab == 1) {
			this.openJpAnalizerTab($('#aSearch.jurisprudence .juristTab.generalTab'), callback);
		} else if (numTab == 0) {
			this.openJpAnalizerTab($('#aSearch.jurisprudence .juristTab.arbitrTab'), callback);
		}
	}

	Classificator.prototype.openJpAnalizerTab = function (el, callback, withoutFirstSearch) {
		var self = this;
		if (withoutFirstSearch != null) {
			var isFirst = false;
		} else {
			var elem = $(el);
			var isFirst = elem.hasClass('arbitrTab');
		}
		if (isFirst) {
			changeTabsViews(true);
			self.search.strResultListStatus = self.search.resultListStatus(true);
			self.search.rewriteHistory();
		} else {
			var data = { 'struct': 'fjpanalyzer2' };
			var form = $('#aSearch.jurisprudence .generalTabForm');
			if (form.length > 0) {
				form.show();
				changeTabsViews();
				self.search.strResultListStatus = self.search.resultListStatus(true);
				self.search.rewriteHistory();
			} else {
				$.ajax({
					url: this.search.main.path.URL_ASEARCH_ATTRS,
					type: "GET",
					dataType: "html",
					data: data,
					success: function (html) {
						var form = $('#aSearch.jurisprudence .generalTabForm');
						if (form.length == 0) {
							$('#aSearch.jurisprudence').append('<div class="searchForm generalTabForm"></div>');
							form = $('#aSearch.jurisprudence .generalTabForm');
						} else {
							form.empty();
						}
						form.append(html);
						var header = $('#JPAHeader2');
						if (header.length > 0) {
							$('.stats .replasedBlock').hide();
							$('.stats').append(header.detach());
						}
						$('#aSearch.jurisprudence div.infoKinds').show();
						if (withoutFirstSearch == null) {
							changeTabsViews();
						} 	                    
						self.search.party2 = null;
						self.search.activeSearch = 1;
						self.search.initForm(null, null, form);
						self.search.setTabs(function () {
							if (callback) {
								callback();
							}
							if (Party) {
								self.search.party2 = new Party();
								self.search.party2.init(true);
							}
							if (withoutFirstSearch == null) {
								self.search.strResultListStatus = self.search.resultListStatus(true);
							}
						});
						if (withoutFirstSearch != null) {
							self.search.main.progress.stop();
							$('#aSearch').show();
						}
						//$('input.classificator', form).live('click', function () { self.open(this); });
					}
				});
			}
	        
		}
		function changeTabsViews(first) {
			elem.addClass('checked');
			if (first == true) {
				$('#aSearch.jurisprudence .generalTabForm').hide();
				$('#aSearch.jurisprudence .arbitrTabForm').show();
				$('#aSearch.jurisprudence .generalTab').removeClass('checked');
				$('.stats .replasedBlock').show();
				$('#JPAHeader2').hide();
				self.search.activeSearch = 0;
			} else {
				$('#aSearch.jurisprudence .arbitrTabForm').hide();
				$('#aSearch.jurisprudence .arbitrTab').removeClass('checked');
				$('#JPAHeader2').show();
				$('.stats .replasedBlock').hide();
				self.search.activeSearch = 1;
			}
		}
	}

	Classificator.prototype.showAdvancedCourts = function (elem) {
		var box;
		if (this.search.activeSearch == 1) {
			box = $('#aSearch.jurisprudence .searchForm.generalTabForm div.advancedCourtBox');
		} else {
			box = $('#aSearch.jurisprudence .searchForm:not(.generalTabForm) div.advancedCourtBox');
		}
		box.toggle("fast");
	}
	
	Classificator.prototype.initForm = function () {
		var self = this;
		this.offsetTop = null;
		this.currentElement = null;
		var inputFilter = $('#dialog .filter .value input');
		inputFilter.focus(function() { self.quickSearchFocus(this); });			
		inputFilter.blur(function(event) { self.quickSearchBlur(this); self.actEvent($(this).val(), event); });
		
		$('#dialog .filter .clear').click(function() {
//			var defVal = inputFilter.attr('defaultvalue');
			inputFilter.val('');
			self.quickSearch('');
			inputFilter.parent().removeClass('active');
//			inputFilter.val(defVal);
			self.actEvent('');
		});
		this.tmp++;
		
		self.search.main.list.crossReg(function(event){
			self.cross(event);
		});

		inputFilter.focus();
	}


	Classificator.prototype.actEvent = function(word, event) {
		
		var self = this;
		var filterMatch = $('#dialog .filterMatch');
		if (!event){
			return false;
		}
//		console.log(String.fromCharCode(event.which));
		if(word == 'фильтр списка') return false;
//		if(!/[0-9a-zA-Z]/.test(String.fromCharCode(event.which)) && event.which!=8 && event.which!=9 && event.which!=219 && event.which!=221 && event.which!=222 
//		   && event.which!=59 && event.which!=46 && event.which!=190 && event.which!=188 && event.which != 37 && event.which != 39) {
//			console.log('>>');
//			return false;
//		}
		if (event.which == 40 || event.which == 38 ) return;
		if((event.which == 37 || event.which == 39) ||  (event.type == 'blur')) {		
			if(filterMatch.length) {
				if(jQuery.trim($(filterMatch[0]).html()) == $('#dialog .filter input').val()) return false;				
			}
		}
		
	//	if (word.length > 0) {
			this.quickSearch(word, event);
	//	}	
	}
	
	
	Classificator.prototype.quickSearch = function(word,event) {
		var self = this;		
		
		var inShort = null!=this.shortType ? 1 : '';
		var id  = this.id +  (null==this.shortType ? '' : ('n' + this.shortType));
		if (this.timeoutId!=null){
			clearTimeout(this.timeoutId);
		}
		this.timeoutId = setTimeout(function (html){
			if (word == "") {
				if (self.shortCacheList != null) {
					self.quickSearchResult(self.shortCacheList, true);
				} else {
					self.quickSearchResult(self.cacheList);
				}
			}else {
				var data = {
					'classificator_id': id,
					'classificator_name': self.class_name,
					'filter': true,
					'word': word,
					'stype': self.getSType(),
					'inshort': inShort
				};
				if (self.context){
					data.context = self.context;
				}
				if (self.params){
					for (var j in self.params){
						data[j] = self.params[j];
					}
				}
				var stype = self.getSType();
				if (stype && stype != 'asearch')
					data.struct = stype;

				var listId = self.getIdList();
				if (listId) {
					data.list_id = listId;
				}
			
				$.ajax({
					url: self.search.main.path.URL_CLASSIFICATORS,
					type: "GET",
					data : data,
					dataType: "html",
					success: function(html){
						var list = self.quickSearchResult(html);
						var filter = $('.listHeader .filter input');
						if (list != null){
							var hint = $('.hint',list).text();
							if (filter.val()==word && hint && event.which!=8){
						      if (word.toLowerCase() != hint.substr(0,word.length).toLowerCase())//если в нач. найденного слова присутствует 
						      	    hint = hint.substr(1,hint.length-1);							// символ, то удаляем его(убирает вывод лишних букв)
								self.quickSearchSuggest(filter,hint);
							}
						}
						if (word == "") {
							self.cacheList = html;
						}
					}
				});
			}	
		},300);		
	}
	Classificator.prototype.quickSearchSuggest = function(field, hint){
		var str = field.val();
		field.val(str+hint.substring(str.length));
		utils.createSelection(field.get(0),str.length,field.val().length)
	}
	Classificator.prototype.quickSearchResult = function(html, fromShortCache){
		var jqList = null;
		if (null == this.shortType || fromShortCache) {
			jqList = $('#dialog .dlist')
		} else {
			jqList = $('#dialog ul.subClass');
		}
		if (html != '') {
			if (fromShortCache) {
				$('#dialog ul.subClass').remove();
				jqList.append(html)
			} else {
				jqList.html(html);
			}
			this.setResultList();
		} else {
			jqList.html('<p class="notFound">Ничего не найдено.</p>');
		}
		return jqList;
	};
	
	Classificator.prototype.quickSearchFocus = function(input) {
		var jqInput = $(input);
		jqInput.parent().addClass('active');
	//	if (jqInput.attr('defaultvalue') == jqInput.val()) {
	//		jqInput.val('');
	//	}
	}
	
	Classificator.prototype.quickSearchBlur = function(input) {
		var jqInput = $(input);
	//	var defVal = jqInput.attr('defaultvalue');
		var inputVal = jqInput.val();
		
	//	if ((defVal == inputVal) || (inputVal == '')) {
		if (inputVal == '') {
	//		jqInput.val(defVal);
			jqInput.parent().removeClass('active');
		}
	}
	
	Classificator.prototype.submit = function(){
		var arr = new Array(); 
		var hiddenInput = this.input.next();
		if (this.list.length != 0) {
			this.setLogic();
			//		if (this.logic == 'NOT') {
			//			this.input.val(this.ru[this.logic]+' '+this.result.join(' ' + this.ru['AND'] + ' '));
			//		}
			//		else {
			//			this.input.val(this.result.join(' ' + this.ru[this.logic] + ' '));
			//		}
			hiddenInput.val(this.list.join(';') + '?' + this.logic.toLocaleLowerCase() + '?' + this.result.join(';'))
			this.setValue(this.input);
		}else{
			hiddenInput.val("");
			this.search.removeNotEmptyClass(this.input);
		}
		this.close();
		this.search.main.filter.isEmpty();
		this.search.isEmpty();
	}
	Classificator.prototype.setValue = function(input){
		if (input==null){
			return;
		}
		
		var resultVal = '';
		var value = $(input).next().val();
		resultVal = this.getValueString(value);		
		input.val(resultVal);
		this.search.addNotEmptyClass(input);
	}
	
	Classificator.prototype.getValueString = function(value) {
		var resultVal = '';
		var arr = value.split('?');
		if (arr.length!=3){
			return null;
		}
		
		var logic = arr[1].toString().toLocaleUpperCase();
		var result = arr[2].toString().split(';'); 

		if (logic == 'NOT') {
			resultVal = this.ru[this.logic]+' '+result.join(' ' + this.ru['AND'] + ' ');
		}
		else {
			resultVal = result.join(' ' + this.ru[logic] + ' ');
		}
		return resultVal;
	}
	
	Classificator.prototype.getClassifTabId = function () {
		return utils.getUrlParam('?'+this.search.searchTabs.getActiveTab().urlParams, 'tab');
	}
	Classificator.prototype.getSType = function (){
		if (window.isEda) {
			var sType = this.search.main.eda.getSType();
			if (sType != null)
				return sType;
		}
	//	if ($('#aSearch').length || $('#iSearch').length) {
		if ($('#aSearch').length) {
		    return this.search.getStype();
		}else{
			return 'f';
		}
	}
	Classificator.prototype.open = function (element, tabId, noDialog, params, openClassifCallback) {
	    var self = this;
	    classif = this;
	    element = $(element);

	    var nextHideElement = element.next();

	    while (!element.hasClass('value') && element.length != 0) {
	        element = element.parent();
	    }

	    this.shortType = null;
	    if (tabId == null) {
	        tabId = this.getClassifTabId();
	    }

	    this.input = $('input.classificator', element);
	    var parent = element.parents()
	    var block = element.parent().parent();

	    var id = utils.getId(parent.attr('id'));
	    var quickSearchOff = false;
	   /* if (element.attr('quicksearch') == 'off') {
	        quickSearchOff = true;
	    }*/
	    var maxSize = false;
	    if (element.attr('maxsize') == 'on') {
	        maxSize = true;
	    }
	    this.params = params;
	    this.id = 'id_' + id + '_' + tabId;

	    	this.class_name = $('#infoKinds_' + id + ' div.label', block).html();

	    var data = {
	        'classificator_id': this.id,
	        'classificator_name': this.class_name
	    };
	    if (this.params) {
	        for (var j in this.params) {
	            data[j] = this.params[j];
	        }
	    }
	    var listId = this.getIdList();
	    if (listId) {
	        data.list_id = listId;
	    }

	    var sType = this.search.getStype();
	    if (sType && sType != 'asearch') {
	        data.struct = sType;
	    }
	    data.stype = this.getSType();
	    $.ajax({
	        url: this.search.main.path.URL_CLASSIFICATORS,
	        type: "GET",
	        data: data,
	        dataType: "html",
	        success: function (html) {
	            if (self.search.main.onStartDialog != null) {
	                if (self.search.main.onStartDialog(html))
	                    return;
	            }
	            if (noDialog == null) {
	                if ($('#dialog .edaDialog').length > 0)
	                    noDialog = true;
	            }
	            if (noDialog == null) {
	                self.close();
	                $("div#dialog").empty();
	                $("div#dialog").html(html);
	                if (self.dialog != null) {
	                    self.close()
	                }
	            } else {
	                $('div#dialog').append(html);
	                $('div#dialog .closeFilter').hide();
	                $('div#dialog #filterSearch').hide();
	                $('div#dialog .dialogButton ').hide();
	                $('div#dialog .edaDialog').hide();
	            }
	            self.getList(function () {
	                self.initForm();
	                self.setLogic();
	                var hiddenInput = self.input.next();
	                if (hiddenInput != null) {
	                    self.setParams(hiddenInput.val());
	                }
	                if ($('#dialog .dlist li.selected:visible').length == 0) {
	                    $('#dialog .dlist li:visible').eq(0).addClass('selected');
						//console.log("Зафинтим и выделем первый эллемент классификатора!");
	                }

	            }, nextHideElement)
	            var height = 590;
	            if (maxSize) {
	                if ($('body').height() > 590) {
	                    height = $('body').height() - 80;
	                    $("div#dialog .dlist").height(height - 320);
	                }
	            }
	            if (quickSearchOff) {
	                $("div#dialog .filter").hide();
	            }
	            utils.hideFlash()
	            self.dialog = $("div#dialog").dialog({
	                autoOpen: true,
	                width: 750,
	                height: height,
	                position: 'center',
	                closeOnEscape: true,
	                modal: true,
	                draggable: false,
	                close: function () {
	                    if ($('#dialog .edaDialog').length > 0)
	                        return false;
	                    $(this).dialog('destroy');
	                    $("#dialog").empty();
	                    utils.showFlash()
	                    return false;
	                }
	            });


	            $('#dialog .filter').keyup(function (event) {
	                var word = $('#dialog .filter .value input').val();
	                //console.log(word);
	                self.actEvent(word, event);
	            });

	            if (openClassifCallback != null)
	                openClassifCallback();
	        }
	    });
	}	
	Classificator.prototype.getList = function(callback, nextHideElem){
		var self = this;
		nextHideElem = $(nextHideElem);
		var data = {'list': 'yo', 'classificator_id': this.id, 'classificator_name': this.class_name};
		if (this.context){
			data.context = this.context;
		}
		if (this.params){
			for (var j in this.params){
				data[j] = this.params[j];
			}
		}

		var sType = this.search.getStype();
		if (sType && sType != 'asearch') {
		    data.struct = sType;
		}
		
		var listId = this.getIdList();
		if (listId) {
			data.list_id = listId;
		}
		
		data.stype = this.getSType();
		if (nextHideElem)
			if (nextHideElem.val()!='') 
				data.selected_items = nextHideElem.val().split("?")[0];
				
		$.ajax({
			url: this.search.main.path.URL_CLASSIFICATORS,
			type: "GET",
			data: data,
			dataType : "html",
			success: function(html){
				self.cacheList = html;
				$("div#dialog .dlist").html(html);
				$('div#dialog .loading').removeClass('loading');
				self.mobileScroll();
				if (callback){
					callback();
				}
			}
		});
	}
	
	Classificator.prototype.setParams = function(str){
		
		this.list = new Array();
		this.logic = null;
		if (str==null){
			return;
		}
		var arr = str.split('?');
		if (arr.length!=3)
			return null;
		this.logic = arr[1].toString().toLocaleUpperCase();

		if (arr[0]=='')
			return null;
		var ids = arr[0].toString().split(';');
		this.result = arr[2].toString().split(';'); 
		for (var i in ids){
			this.list.push(parseInt(ids[i]));
		}
		this.setResultList();
	}
	Classificator.prototype.close = function (element) {
	    this.cacheList = null;
	    var dialog = $('#dialog');
	    /*if ($('ul.subClass', dialog).filter(':visible').length) {
	    this.shortType = null;
	    this.hideSubClass();
	    return;
	    }*/
	    this.shortType = null;
	    this.shortCacheList = null;
	    this.search.checkAcceptedAuthority();
	    if ($('.filterSearchForm', dialog).length > 0) {
	        if (element != null) {
	            $(element).remove();
	        }
	        $('#dialog > div, #dialog > span').not('#filterSearch').not('.dialogFilter').not('.closeFilter').remove();
	        $('#dialog > div, #dialog > span').show();
	    } else if ($('.edaDialog', dialog).length > 0) {
	        if (element != null) {
	            $(element).remove();
	        }
	        $('#dialog > div, #dialog > span').not('.edaDialog').not('.closeEdaDialog').remove();
	        $('#dialog > div, #dialog > span').show();
	    } else {
	        if (this.dialog != null) {
	            this.dialog.dialog('destroy');
	            this.dialog = null;
	            dialog[0].innerHTML = '';
	            dialog.hide();
	            this.search.isEmpty();
	        }
	    }
	    this.result = new Array();
	}	
	Classificator.prototype.select = function(element){
		var p = $(element);
		if(p.hasClass('notSelect')){
			return;
		}
		element = p.parent();
		var ul = element.parent();
		//если до этого нажали "выбрать все"
		if (ul.hasClass('choice')) {
			ul.find('li').removeClass('choice');
			this.remove(ul[0]);
			this.add(element[0]);
		};
		if (element.hasClass('choice')) {
			this.remove(element.get(0));
		} else {
			this.add(element.get(0));
		}
	}
	Classificator.prototype.remove = function(element){
		var id = null;
		if (id=utils.getId(element.id)){
			$(element).removeClass('choice');
			for (var i in this.list) {
				if (this.list[i]==id){
//					dbg.msg('remove '+id)
					$('#dialog #item_'+this.list[i]).removeClass('choice');
					this.list.splice(i,1);
					this.result.splice(i,1);
				}
			}
			this.setResultList()
		}
	}
	Classificator.prototype.selectAll = function() {
		var self = this;
		var parentOid = $('#dialog ul.subClass').attr('id');
		$('ul.subClass li.choice').each(function(){
			self.remove(this);
		});
		this.select($('#'+parentOid+' > p')[0]);
		this.hideSubClass();
	}
	Classificator.prototype.clear = function(element){
		this.list.splice(0,this.list.length);
		this.result.splice(0,this.result.length);
		this.setResultList();
		var selectedlist = $('.treeSelectSection');//очистка развернутых секций
		if (selectedlist.length > 0)				//деревьев в которых были
			selectedlist.remove();					//выделенные эллементы
	}
	Classificator.prototype.add = function(element){
		var id = null;
		if (id=utils.getId(element.id)){
			if (this.single) {
				this.list.splice(0, this.list.length);
				this.result.splice(0, this.result.length);
			}
			this.list.push(id);
			var text = decodeURIComponent($('#dialog .dlist #item_' + id + ' p:first').text());
			this.result.push(text.split(';')[0]);
//			dbg.msg({'element.id' : element.id, id : id});
//			dbg.msg(this.list);
	//		this.list=utils.uniqueArray(this.list);
			this.setResultList()
		}
	}	
	Classificator.prototype.setResultList = function(){
		var self = this;
		if ($('#dialog .dlist li.selected:visible').length==0){
			$('#dialog .dlist li:visible').eq(0).addClass('selected');
		}
	//	$('#dialog input:checked').removeAttr('')
		$('#dialog input[type=radio]').each(function (i) {
			if (utils.getId(this.id,'str').toLocaleUpperCase()==self.logic){
				$(this).attr('checked','checked')	
			}	
		});
		var resultList = $('#dialog .result ul');
		resultList.empty();
		$('#dialog .dlist li').removeClass('choice');
		for (var i in this.list) {
			$('#dialog #item_'+this.list[i]).addClass('choice');
			resultList.append('<li id="sItem_'+this.list[i]+'">'+this.result[i]+'</li>');
		}
		this.mobileScroll(1);
	}
	Classificator.prototype.setLogic = function(element){
		this.logic=$("#dialog input:checked").val();
	}	
	
	Classificator.prototype.openNode = function(element){
		var self = this;
		$(element).removeClass('open');
		$(element).addClass('close');
		var node=$(element).parent();
		if (node.children('.treeSelectSection').length > 0){
			node.children('.treeSelectSection').remove();
		}
		var childs = node.children('.treeSection');
		if (childs.length > 0) {
				childs.show();
		} else {
			var nd=utils.getId(node.attr('id'));
			var data = {'classificator_id': this.id+'n'+nd, 'list': 1};
			if (this.context){
				data.context = this.context;
			}
			if (this.params){
				for (var j in this.params){
					data[j] = this.params[j];
				}
			}
			var sType = this.search.getStype();
			if (sType && sType != 'asearch') {
			    data.struct = sType;
			}
			
			if (this.list.length!=0) {
				data.selected_items = '';
				for(var j in this.list){
					data.selected_items += this.list[j] +',';
				}
			}
			if ($(self.input).next().val()!='')
			{
				data.selected_items = $(self.input).next().val().split('?')[0];
			}
		
			$.ajax({
				url: this.search.main.path.URL_CLASSIFICATORS,
				type: "GET",
				data: data,
				dataType : 'html',
				success: function(html){
					node.append(html);
					self.setResultList();
					self.mobileScroll();
	
				}
			});
		}
	}
	Classificator.prototype.closeNode = function(element){
		$(element).removeClass('close');
		$(element).addClass('open');
		$(element).parent().children('.treeSection').hide();
		this.mobileScroll();
	}	
	
	Classificator.prototype.openClass = function(element){
		clearTimeout(this.timeoutId);
		this.offsetTop = this.search.main.list.offsetTop(element, $(element).parent().parent());
		this.currentElement = element;
		var url = this.search.main.path.URL_CLASSIFICATORS;
		var self = this;
		var li = $(element).parent();
		var element_id = li.attr('id');
		element_id = element_id.match(/\d+/);
		this.shortType = element_id;
		var id = this.id+'n'+element_id;
		var data = {
			'classificator_id': id,
			'classificator_name': this.class_name,
			'shortClass' : 1, 'list' : 1
		};
		if (this.context){
			data.context = this.context;
		}
		var listId = this.getIdList();
		if (listId) {
			data.list_id = listId;
		}
		var sType = this.search.getStype();
		if (sType && sType != 'asearch') {
		    data.struct = sType;
		}
		if (this.params){
			for (var j in this.params){
				data[j] = this.params[j];
			}
		}

		$.ajax({
			url: url,
			type: 'GET',
			data: data,
			dataType : 'html',
			success: function (html){
				self.shortCacheList = html;
				$('#dialog div.dlist ul').hide();
				$('#dialog div.dlist').append(html);
				self.setResultList();
				if (li.hasClass('choice')) {
					$('#dialog div.dlist ul.subClass li').addClass('choice');
				};
				$('a.select_all').show();
				$('#dialog .listHeader .title').text($(element).text());
				self.filterValue = $('#dialog .filter input').val();
				$('#dialog .filter input').val('').blur().focus();
				$('#dialog .back').show();
				$('#dialog .buttons').css('padding-left', '82px');
				self.mobileScroll();
		}
		});
	}
	
	Classificator.prototype.hideSubClass = function(){
		this.shortType = null;
		this.shortCacheList = null;
		
		$('#dialog div.dlist ul.subClass').remove();
		$('#dialog a.select_all, #dialog .back').hide();
		
		$('#shortClassificators').show();
		$('#dialog .listHeader .title').text('Вид документа/материала');
		$('#dialog .filter input').val(this.filterValue).focus();
		$('#dialog .buttons').css('padding-left', '150px');
		if (this.offsetTop && this.currentElement){
			var scrollEl = $('div.dlist');
			var el = $(this.currentElement);
			var offset = (el.get(0).offsetTop-scrollEl.get(0).offsetTop)-this.offsetTop;
			scrollEl.scrollTo(
					{top:offset+'px', left:'0px'}
				)
		}
		this.mobileScroll();

	}
	
	Classificator.prototype.isEmpty = function(input, exception){
		var empty = true;
		var jqInput = $(input);
		var defVal = jqInput.attr('default');
				
		if (jqInput.next().val() != '') {
			empty = false;
			if (exception!=input) jqInput.parent().addClass('active');
		} else {
			if (exception != input) {
				jqInput.parent().removeClass('active');
	//			jqInput.css('color', '#AAAAAA');
				jqInput.val(defVal);
			}
		}		
		return empty;
	}
	
	// Проверка значения классификатора, если строка совпадает с одним из классификаторов
	// то возвращаем oid 
	Classificator.prototype.checkValue = function(input) {
		var self = this;
		var jqInput = $(input);
		var hiddenInput = jqInput.next();
		var value = jqInput.val();
		var suggest = $('.suggest',jqInput.parent());
		if (value != '' && !suggest.length) {
			if (self.search.searchTabs) {
				var tabId = self.getClassifTabId();
			} else {
				var tabId = -1;
			}
			var fieldId = 'id_' + utils.getId(jqInput.parent().parent().attr('id')) + '_' + tabId;
			var result = null;
			$.ajax({
				url: this.search.main.path.URL_CLASSIFICATORS_DATA + fieldId + '&name=' + encodeURIComponent(value),
				dataType: "json",
				type: "get",
				async: false,
				success: function(_json){
					var selected = [];
					if (_json && _json.type != -1) {
						if (_json.oid != null) {
							hiddenInput.val(_json.oid + '?' + 'or' + '?' + value);
							jqInput.css('color', 'black');
							result = true;
						}
					}
					else {
						// Нет такого классификатора
						hiddenInput.val('');
						jqInput.css('color', 'red');
						result = false;
					}					
				}
			});
		} else {
			hiddenInput.val('');
			jqInput.css('color', 'black');
			result = false;
		}
		return result;
	}
	Classificator.prototype.cross = function (event) {
	    if (event.which == 38 || event.which == 40) {
	        var inputFilter = $('#dialog .filter .value input');
	        inputFilter.blur();
	        /* var defVal = inputFilter.attr('defaultvalue');
	        if (inputFilter.val() == '') {
	        inputFilter.val(defVal);
	        inputFilter.parent().removeClass('active');
	        $('#dialog .dlist').focus();
	        }*/

	    }
	    var self = this;
	    this.search.main.list.cross(
			event,
			$('#dialog .dlist ul:visible'),
			function (element) {
			    $('p', $(element)).click();
			},
			false,
			true
		);
	};
	
	Classificator.prototype.getIdList = function(){
		var list  = $('.docList:visible');
		
		if (list.length > 0) {
			var store = this.search.main.listDocument.getActiveState();
			var urlParam = /\?([^?]*)/.exec(store.url);
			return urlParam[1];
		}
		
		return null;
	}
	
	Classificator.prototype.mobileScroll = function(id){
		if (!window.mobile) return;
		if (this.iScroll && this.iScroll.length){
			if(id === undefined){
				for(var i in this.iScroll){
					this.iScroll[i].destroy();
				}
			}else{
				if(this.iScroll[id]){
					this.iScroll[id].destroy();
				}
			}
		}else{
			this.iScroll = new Array();
		}
		if (id === undefined) {
			this.iScroll.push(new iScroll($('#dialog .dlist  > ul:visible').get(0)));
			this.iScroll.push(new iScroll($('#dialog .result > ul:visible').get(0)));
		}else{
			if (id==0){
				this.iScroll[0]= new iScroll($('#dialog .dlist  > ul:visible').get(0));
			}
			if (id==1){
				this.iScroll[1] = new iScroll($('#dialog .result > ul:visible').get(0));
			}
		}
	}		
