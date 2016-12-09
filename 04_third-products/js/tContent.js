
function TContent(main){
	this.main = main;
	this.url = null;
	this.setEvent();
};

TContent.prototype.init = function(tabs){
	var self = this;
	
	if (tabs!=null){
		this.url = null;
		for (var i in tabs){
			//console.log("-"+tabs[i].title+"-");
			if (this.checkTab(tabs[i]) && (tabs.length > 1)) {
				if (this.checkForIcon(tabs[i])) {
					this.main.icons.add('table_content', 'tContent');
					this.main.icons.reg('table_content', function(){ self.open('Оглавление'); });
				//	$('#tree .openTab').live('click', function () { self.main.tabs.openTab(utils.getId($(this).attr('id'))) });
				}
				this.url = tabs[i].urlParams;
				this.main.document.tContentOn = true;
				//console.log("-"+tabs[i].title+"-");
				//console.log();
				//delete tabs[i];
				break;
			} else {
				this.main.document.tContentOn = false;
			}
		}
	}
	return tabs;	
}

TContent.prototype.checkTab = function (tab) {
	return (tab.title=='Оглавление');
}
TContent.prototype.checkForIcon = function (tab) {
	return (this.main.document.isDemoOrBill != true);
}

TContent.prototype.open = function(title){
	if (this.url==null) return;
	var pClass = $('#panel').attr('class');
	
	var self = this;
	var prevTree = $('#tree > div:visible');
	this.main.panel.open(true);
	this.main.panel.initResize();
	self.main.panel.show();
	$('#tree > div').hide();
	if ($('#tree .tContentTree').length != 0) {
		this.close();
		return;
	};
	if (prevTree.length == 1){
		this.prevClass = pClass;
		prevTree.addClass('prevTree');
	}
	self.main.panel.startRequest();
	this.request = $.ajax({
		url: this.url,
		type: "GET",
		dataType : "html",
		complete : function (){},
		success: function (html){
			$('#tree > div').hide();
			self.main.panel.stopRequest();
			//$('#tree').empty();
			
			$('#tree').append('<div class="tree  yellow tContentTree">'+html+'</div>');
			var html = $('#tree .document .contents').html();
			var tmpHtml = '<div class="top"><div title="Закрыть панель" class="close notIco" ></div>';
			if ( self.main.document.tContentNum ){
				tmpHtml += '<div id="openTab_' + self.main.document.tContentNum + '" class="openTab" title="Для печати оглавления перейти на ярлык"></div>'
			}
			tmpHtml = tmpHtml +'<div class="title">' + title + '</div></div><div class="tContentBody">'+html+'</div>'
						+'<div class="tree_filter"><div class="value"><div class="btn">'
						+'<span class="clear" title="Очистить поле"></span>'
						+'<span class="treeFilterSearch" title="Остановить поиск"></span>'
						+'</div>'
						+'<input id="treeQuickFilter" type="text" value="поиск" defaultvalue="поиск" name="treeQuickFilter">'
						+'</div></div>';
			var el = $('#tree .tContentTree').html(tmpHtml);
						
			self.main.panel.addClassName(null,'tContent');
			
			self.setEvent();
			self.mark();
			return;
		}
	});
};
TContent.prototype.mark = function(context){
	var re = /^\S+\s+\d\S*\s/;
	var list = null;
	if (context){	
		list = $('a.goTo:visible',context);
	}else{
		list = $('.tContentBody a.goTo:visible');
	}
	list.each(function(){
		if (this.innerHTML && (this.innerHTML.indexOf('Статья ') === 0 || this.innerHTML.indexOf('Глава ') === 0 || this.innerHTML.indexOf('Раздел ') === 0 )){
			var str = this.innerHTML.replace(re,'<strong>$&</strong>');
			$(this).html(str);
		}
	});
};

TContent.prototype.goToFirstFindItem = function(){
	var el = $('#panel.tContent span.match');
	if (el.length > 0){
		var parent = el.eq(0).parent().parent().parent();
		var parents = el.parent().parent().parent();
		var li = $(parents.parent().parent()).filter('.closed');
		if(li.length > 0){
			li.removeClass('closed').addClass('opened');
		}
		$('.tContentBody ul').eq(0).scrollTo(parent, 0);
	}
	this.mark();
}

TContent.prototype.close = function(el){
	$('#tree > div').hide();
	this.main.panel.hide();
	var prevTree = $('#tree .prevTree');

	if (prevTree.length == 1){
		$('#tree > div').hide();
		$('#panel').attr('class',this.prevClass);
		prevTree.show();
		prevTree.removeClass('prevTree');
		this.main.panel.open();
		this.main.panel.initResize();
		this.main.panel.show();
	}
};

TContent.prototype.setEvent = function(){
	var self = this;
	$('.tContentTree .ctrl #collapse').die('click').live('click',function(){
		$('.tContentTree .opened').removeClass('opened').addClass('closed');
	});
	$('.tContentTree .ctrl #expand').die('click').live('click',function(){
		$('.tContentTree .closed').removeClass('closed').addClass('opened');
	});

	$('.tContentTree .close').die('click').live('click',function(){
		self.close();
		return false;
	});
	
	var bind = function(){
		$('.tContentTree .opened .opener').unbind('click').bind('click',function(){
			var jEl = $(this);
			var parent = jEl.parent().parent();
			parent.removeClass('opened');
			parent.addClass('closed');
			bind();
		});
		$('.tContentTree .closed .opener').unbind('click').bind('click',function(){
			var jEl = $(this);
			var parent = jEl.parent().parent();
			parent.removeClass('closed');
			parent.addClass('opened');
			self.mark(parent);
			bind();
		});
	};
	bind();
	self.main.panel.initSearchButton();
}
