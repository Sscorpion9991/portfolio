function  SearchTabs(search){	
    this.search = search;
    this.searchers = [null, null];
	this.tabs=null;
	this.active=null;
//	this.lookupTable=new Array()
	this.NOT_FOUND= lex('NotFound');
	this.ALL=lex('All') + ': ';
	this.FOUND=lex('Found')+ ': ';
	this.matches = {
		'Региональное законодательство' : 'RegionalLegislation',
		'Regional legislation' : 'RegionalLegislation',
		'Международное право' : 'InternationalLegislation',
		'International law' : 'InternationalLegislation',
		'Нормы, правила, стандарты' : 'TechnicalLegislation',
		'Norms, rules, standards' : 'TechnicalLegislation',
		'Судебная практика' : 'JudgementPractice',
		'Judicial practice' : 'JudgementPractice',
		'Законодательство России' : 'RussianLegislation',
		'Russian legislation' : 'RussianLegislation',
		'Электронные публикации' : 'DigitalPeriodics',
		'Electronic publications' : 'DigitalPeriodics',
		'Все' : 'AllLegislation',
		'All' : 'AllLegislation',
		'Справки' : 'UsefulInformation',
		'References' : 'UsefulInformation',
		'Комментарии, консультации' : 'CommentsAndConsultations',
		'Comments, consultations' : 'CommentsAndConsultations',
		'Техническая документация' : 'TechnicalDocumentation',
		'Technical documentation' : 'TechnicalDocumentation',
		'Проектная документация' : 'ProjectDocumentation',
		'Project documentation' : 'ProjectDocumentation',
		'Образцы и формы' : 'SamplesAndForms',
		'Samples and forms' : 'SamplesAndForms',
		'Технические описания' : 'TechnicalDescriptions',
		'Technical descriptions' : 'TechnicalDescriptions',
		'Корреспонденция счетов' : 'Correspondence',
		'Correspondence of accounts' : 'Correspondence',
		
		'Ситуации' : 'fake',
		'Кодекс: Банк Документов' : 'EDArchive',
		'Техэксперт: Банк Документов' : 'EDArchive',
		'Картотека конституционного суда' : 'RussianLegislation',
		
		'Законопроекты ЗС СПб' : 'SPbLegislativeAssemblyBills',
		'Сопроводительные материалы ЗС СПб' : 'SPLegislativeAssemblySupportMats'
		
	};
	
	this.init = function (tabs, firstTab) {
		var self = this;
		var searchTabsLi;
		if (self.search.activeSearch == 1 && firstTab != true) {
			searchTabsLi = $('#aSearch .searchForm.generalTabForm .searchTabs li');
		} else {
			searchTabsLi = $('#aSearch .searchForm:not(.generalTabForm) .searchTabs li');
		}
		if (searchTabsLi.length == 0) {
			searchTabsLi = $('#aSearch .searchTabs li');
		}
		searchTabsLi.click(function () {
			if (!$(this).hasClass('locked')) {
				self.openTab(this, true);
			}
		});
		if (searchTabsLi.length == 1) {
			if (!$(this).hasClass('locked')) {
				self.openTab(searchTabsLi[0], true);
			}
		}
	};
	
	this.setActiveTab = function(tabIndex){
		if (!tabIndex){
			tabIndex=0;
		}
		$('.searchTabs li').removeClass('active').addClass('inactive');
		if (tabIndex.id){
			$(tabIndex).addClass('active');
			tabIndex=parseInt(tabIndex.id.split('_')[1]);
		}else{
			if (tabIndex==-2){
				$('#searchTabs_-1').removeClass('inactive').addClass('active');
			}else{
				$('#searchTabs_'+tabIndex).removeClass('inactive').addClass('active');
			}
		}
		this.active=tabIndex;
		return tabIndex;
	}
	this.openTab = function(tabIndex, needaction){
		var self = this;
		tabIndex = this.setActiveTab(tabIndex);
		var tabs = this.searchers[this.search.activeSearch];
		if (tabs[tabIndex]){
			if (tabs[tabIndex].action && !needaction){
				tabs[tabIndex].action();
				return;		
			}
			tabs[tabIndex];
			for (var i in tabs){
				tabs[i].state='inactive';
			}
			tabs[tabIndex].state='active';
			this.search.hideForm();
			if (tabs[tabIndex].infoKinds.length == 0 || tabIndex == -1 || tabIndex == -2){
				this.search.showForm([-1]);
			}else{
				this.search.showForm(tabs[tabIndex].infoKinds);
			}			
		}
		this.searchers[this.search.activeSearch] = tabs;
	};
	this.setTabs = function (tabs, callback, firstTab) {
		var tabs_ = new Array();
		var tabId;
		var ul;
		if (this.search.activeSearch == 1 && firstTab != true) {
		    ul = $('#aSearch .searchForm.generalTabForm .searchTabs ul');
		} else {
		    ul = $('#aSearch .searchTabs ul');
	    }
		ul.empty();
		this.active=0;
		var important = '';
		for (var i in tabs) {
			if (tabs[i].state=='active'){
				this.active=i;
			}
			tabId=utils.getUrlParam('?'+tabs[i].urlParams,'tab');
			tabs_[tabId + ""] = tabs[i];
			if (tabId==-2){
				important = '<span class="result important" style="display: block;"></span>'
				continue;
			}
			if (tabId!=-2){
				var html = '<li id="searchTabs_'+tabId+'" class="'+tabs[i].state+'" ><p class="'+this.matches[tabs[i].title]+'"><span>'+tabs[i].title+'</span></p><div style="clear: left"></div>'+important+'</li>'
				ul.append(html);
			}
			important = '';
		}
		if (tabs_.length==0){
			$('#aSearch div').hide();
			this.search.main.document.error404(null,true,"В системе нет ни одного продукта, по которому возможно провести поиск");
			return;
		}
		if (firstTab) {
		    this.searchers[0] = tabs_;
		} else {
		    this.searchers[this.search.activeSearch] = tabs_;
		}
		this.init(null, firstTab);
		if (callback) {
		    callback();
		}

		
	};
	this.setStats = function (tabs) {
	    var li;
	    if (this.search.activeSearch == 1) {
	        li = $('#aSearch .searchForm.generalTabForm .searchTabs li');
	    } else {
	        li = $('#aSearch .searchForm:not(.generalTabForm) .searchTabs li');
	        if (li.length == 0) {
	            var li = $('#aSearch .searchTabs li');
	        }
	    }
		var important = Array();
		$('> span',li).not('.important').remove();
		var html='';
		var j=-1;
		if (li.length != tabs.length){
			important = $('#searchTabs_-1 .important');
		}
		$('#aSearch span.important').empty();

		var tabs_ = this.searchers[this.search.activeSearch];

		for (var i in tabs_) {
			tabs_[i].quantity=0;
		}
		for (var i in tabs) {
			if (tabs[i].id==-2 && important.length==0){
				continue;		
			}			
			if (tabs_[tabs[i].id]){
				tabs_[tabs[i].id].quantity = tabs[i].quantity;	
			}
			if (i==0 && important.length>0){
				important.remove();
				li.eq(0).append('<span class="result important" style="display: block;">'+ lex('SignificantDocuments') + ': ' + tabs[i].quantity + '</span>');
				continue;	
			}else{
				j++;	
			}
			if (tabs[i].quantity != 0) {
				if (tabs[i].id==-1){
					html = this.ALL + tabs[i].quantity;
				}else{
					html = this.FOUND + tabs[i].quantity;
				}
				li.eq(j).append('<span style="display:none" class="result">' + html + '</span>');
			} else {
				html = this.NOT_FOUND;
				li.eq(j).append('<span style="display:none" class="empty">' + html + '</span>');
			}
		}
		var status;
		if (this.search.activeSearch == 1) {
			status = $('#aSearch.jurisprudence .searchForm.generalTabForm .status');
		} else {
			status = $('#aSearch.jurisprudence .searchForm:not(.generalTabForm) .status');
		}
		if(status.length == 0){
	    	status = $('#aSearch.pointerNTD .searchForm .status');
	    }
		if (status.length==1 && tabs_[this.active]) {
			status.show();
			var max;
			if($('#aSearch.pointerNTD').length > 0){
				max = 200;
			} else {
				max = 10000;
			}

			if (tabs_[this.active].quantity > max) {
				status.addClass('tooMuch');
			} else {
				status.removeClass('tooMuch');
			}
			
			if (tabs_[this.active].quantity==0) {
				status.addClass('empty');
				var context = $('input.context', status);
				if (context.attr('value') != '') {
					status.removeClass('nocontext');
				} else {
					status.addClass('nocontext');
				}
			} else {
				status.removeClass('empty nocontext');
			}
			
			if (!status.hasClass('nocontext')) {
				setTimeout(function() {
					$('.iContext input', status).focus();
				}, 0);
			}
			this.searchers[this.search.activeSearch] = tabs_;
		}
		
//		if (this.active != -1) {
//			li.addClass('locked');
//			$('#searchTabs_'+this.active).removeClass('locked');
//		} else {
//			li.removeClass('locked');
//		}
	};
	
	this.getActiveTab = function(){
		//return this.tabs[this.active];
	    return this.searchers[this.search.activeSearch][this.active];
	}
}
