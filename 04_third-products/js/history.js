function  History(main){
	
	this.main=main;
	this.list = new Array();
	this.active = null;
	this.timer = null;
	this.lenTitle = 38;
	this.lenSearchTitle = 48;
	this.paused = false;



	this.init = function(){
		var self = this;
		$('#prev').live("click", function() { self.prev(this); });
		$('#next').live("click", function() { self.next(this); });
		$('#nextTo.active').live("click", function() { self.nextTo(this); });
		$('#prevTo.active').live("click", function() { self.prevTo(this); });
		$('#nextHistoryList li').live("click", function() { self.go(this); });
		$('#prevHistoryList li').live("click", function() { self.go(this); });
		
		
	};
	
	this.pause = function () {
		this.paused = true;
	}
	this.unpause = function () {
		this.paused = false;
	}
	
	this.getAction = function(){
		return this.list[this.active].action;
	}
	
	this.setButton = function(){
		this.main.restore.lastId = this.list[this.active].id;
//		console.log('READ '+kApp.restore.lastId);
		if (this.list.length<=1){
			$('#prev').removeClass('active');
			$('#prevTo').removeClass('active');
			$('#next').removeClass('active');
			$('#nextTo').removeClass('active');
			return;
		}
		if (this.list.length==(this.active+1)){
			$('#next').removeClass('active');
			$('#nextTo').removeClass('active');
			$('#prev').addClass('active');
			$('#prevTo').addClass('active');
		}
		if (this.active==0){
			$('#prev').removeClass('active');
			$('#prevTo').removeClass('active');
		}
		if (this.active>0){
			$('#prev').addClass('active');
			$('#prevTo').addClass('active');
		}
		if (this.list.length>(this.active+1)){
			$('#next').addClass('active');
			$('#nextTo').addClass('active');
		}
	
	}
	this.removeLast = function(){
	//	this.list.splice(this.list.length-1);
		this.active--;
	}

	this.add = function(link){
//		dbg.msg('add_'+this.active,'his');
		if (this.paused)
			return this.active;
		if (this.list.length>0){
			while (this.list.length>this.active+1){
				this.list.pop();
			}
		}
		if (this.main.restore.lastId!=null){
			link.id = this.main.restore.lastId;
			//console.log('WRITE '+kApp.restore.lastId);
		}
		
		this.list.push(link);
		this.active=this.list.length-1;
		this.setButton();
		
		if (this.main.utils.getUrlParam(document.location.href, 'help') == 'true') {
			this.main.history.setTitle('Справка');
		} else {
			this.setTitle(link.title);
		}
		
		return this.active;		
	};
	this.rewrite = function(link){
		this.setTitle(link.title);
		link.id = this.main.restore.lastId;
		if (this.list.length > 0){
			if((this.list[this.active].type == 'document') && (link.type==null)) {
				if((this.main.tabs.tabs[0] != null) && (this.main.tabs.tabs[4] != null) && (this.main.tabs.tabs[4].title == 'Статус')) {
					this.list[this.active].type = 'plainDocument';
				}
			} 
			if (link.type==null){
				link.type=this.list[this.active].type;
			}
			if(link.title==null) {
				link.title=this.list[this.active].title;
				this.setTitle(link.title);
			}
			if (link.action==null){
				link.action=this.list[this.active].action;
			}
			this.list[this.active]=link;		
		}
		
	}
	this.reload = function(element){
		var jqElem;
		
		if (element == null) jqElem = $('#prev');
		else jqElem = $(element);
		
		this.list[this.active].action();
		this.setButton();	
		this.setTitle(this.list[this.active].title);	
	};		
	this.prev = function(element){
		var jqElem;
		
		if (element == null) jqElem = $('#prev');
		else jqElem = $(element);
		
		if (!jqElem.hasClass('active')){
			this.main.progress.stop();
			return;
		}
		this.active-=1;
		this.list[this.active].action();
		this.setButton();	
		this.setTitle(this.list[this.active].title);	
	};	
	this.next = function(element){
		var jqElem;
		
		if (element == null) jqElem = $('#next');
		else jqElem = $(element);
		
		if (!jqElem.hasClass('active')){
			return;
		}
		this.active+=1;
		this.list[this.active].action();
		this.setButton();	
		this.setTitle(this.list[this.active].title);	
	};	
	this.prevTo = function(element){
		$('#prevHistoryList ul').addClass('historyContainer').html('');
		if (!$(element).hasClass('active')){
			return;
		}
		for (var i in this.list){
			if (i>=(this.active)){
				continue;
			}
			$('#prevHistoryList ul').prepend(this.getHistoryContent(i));
		}
		if (this.main.checkNoUserData() == true) {
			$('#prevHistoryList .showAllHistory').remove();
		}
		this.showHistoryList($('#prevHistoryList'));		
	};
	this.nextTo = function(element){
		$('#nextHistoryList ul').addClass('historyContainer').html('');
		if (!$(element).hasClass('active')){
			return;
		}
		for (var i in this.list){
			if (i<=(this.active)){
				continue;
			}
			$('#nextHistoryList ul').append(this.getHistoryContent(i))		
		}
		if (this.main.checkNoUserData() == true) {
			$('#nextHistoryList .showAllHistory').remove();
		}
		this.showHistoryList($('#nextHistoryList'));
	};
	this.getHistoryContent = function(i){
		var name= (this.list[i].title==null) ? this.list[i].type : this.list[i].title;
		var content;
		if(this.list[i].type == 'search' || this.list[i].type == 'searchResult') {
			var SerchOrResult;
			if(this.list[i].title == "Поиск в Картотеке НТИ"){
				SerchOrResult = (this.list[i].type == 'searchResult') ? 'Результат поиска в Картотеке НТИ' : 'Поиск в Картотеке НТИ';	
			} else if(this.list[i].title == "Судебный Аналитик"){
				SerchOrResult = (this.list[i].type == 'searchResult') ? 'Результат поиска в Судебном Аналитике' : 'Судебный Аналитик';
			} else {
				SerchOrResult = (this.list[i].type == 'searchResult') ? 'Результат атрибутного поиска' : 'Атрибутный поиск';
			}
			if (this.list[i].params != null && typeof(this.list[i].params) == 'object'){				 
				content = '<li id="historyItem_'+i+'" class="historyItem_search" title="' + SerchOrResult + '">' + SerchOrResult;
				if (this.list[i].params && this.list[i].params.length){
					for (var j = 0; j < this.list[i].params.length; j++){
						content += '<div class="addinf">' + this.lenTitleControl(this.list[i].params[j].title + this.list[i].params[j].value, true) + '</div>'
					}
				}
				content+='</li>';
			} else {
				content = '<li id="historyItem_'+i+'" class="historyItem_search" title="' + SerchOrResult + '">' + SerchOrResult + '</li>';
			}
		} else if(this.list[i].type == 'iSearch') {
			content = '<li id="historyItem_'+i+'" class="historyItem_search" title="Интеллектуальный поиск">Интеллектуальный поиск<div class="addinf">'+this.lenTitleControl(name, true)+'</div></li>';
		} else if(this.list[i].type == 'plainDocument') {
			content = '<li id="historyItem_'+i+'" title="'+name+'">Документ<div class="addinf">'+this.lenTitleControl(name)+'</div></li>';
		} else if(this.list[i].type == 'document') {
			content = '<li id="historyItem_'+i+'" title="'+name+'">'+this.lenTitleControl(name)+'</li>';
		}
		return content;
	};
	this.go = function(element,params){
		var id = null;
		if (element.id){
			id = utils.getId(element.id);
		} else{
			id=element;
		}
		if (id < this.list.length){
			this.active=id;
			this.list[this.active].action(params);
			this.setButton();	
			this.setTitle(this.list[this.active].title);	
		}
		this.hideHistoryList();
	};	
	
	this.hideHistoryList = function(){
		$("body").unbind("click",function(){self.hideHistoryList()});
		$('#nextHistoryList').hide();
		$('#prevHistoryList').hide();
		if (window.isEda && (this.main.eda.onHideHistory != null))
			this.main.eda.onHideHistory();
	}
	this.showHistoryList = function(list){
		var self = this;
		$(list).show();
		$("body").bind("click", function(){self.hideHistoryList()})
		list.live('mouseout',function(e){
			$("body").bind("click", function(){self.hideHistoryList()})
		});
		list.live('mousemove',function(e){
			$("body").unbind("click",function(){self.hideHistoryList()});
		});
		/*if ($.browser.msie) {
			$('div#header div#prevHistoryList').css('border','1px solid LightSteelBlue');
			$('div#header div#nextHistoryList').css('border','1px solid LightSteelBlue');
		}*/
		//$('.historyContainer:visible').width(390);
		if (window.isEda && (this.main.eda.onShowHistory != null))
			this.main.eda.onShowHistory();
	}
	this.lenTitleControl = function(title, SearchTitle){
		var length = (SearchTitle == true) ? this.lenSearchTitle : this.lenTitle;
		if(title.length>length){
			return title.substr(0, length)+'...';
		}
		return title;
	}
	
	this.setTitle = function(title) {
		if (!title) title = lex('MainPage');
		title = utils.makeFullTitle(title);
		if (window.parent != null) {
			window.parent.document.title = title;
		}else{
			window.document.title = title;
		}
		
	}
	
	this.init();
}
