
function  KApp(){
	this.console = dbg = new Console();
	
	this.messege = msg = new Message();
	this.path = new Path();
	this.browser = new Browser(this);
	this.utils = utils = new Utils(this);
	this.resize = new Resize();
	this.icons = new Icons(this);
	this.contextMenu = new ContextMenu(this); 
	this.tabs = new Tabs(this);
	this.iSearch = new ISearch(this);
	this.search = new Search(this);
	this.history = new History(this);
	this.document = new Document(this);
	this.panel = new Panel(this);
	this.listDocument = new ListDocument(this);
	this.tooltip = new Tooltip(this);
	this.bookmarks = new Bookmarks(this);
	this.restore = new Restore(this);
	this.filter = new Filter(this);	
	this.list = new List(this);
	this.userHistory = new UserHistory(this);
	this.hotkeys = new Hotkeys(this);
	this.progress = new Progress(this);
	this.help = new Help(this);
	this.keyboard = new Keyboard(this);
	this.menu = new Menu(this);
	this.notification = new Notification(this);
	this.iecorners = new IeCorners(this);
	this.tContent = new TContent(this);
	this.preview = new Preview(this);
	
	
	this.noUserData = function() {
		if (window.noUserData) {
			$('#userdata').remove();
			$('#history').remove();
		}
	}
	
	this.checkNoUserData = function() {
		return window.noUserData;
	}
		
	if (window.isEda) {
		this.eda = new Eda(this);
	}

	this.noEda = function () {
		if (window.isEda) {
			this.eda.initEda();
		} else {
			$('#Administration').remove();
			$('#NewDocument').remove();
		}
	}

	this.init = function(){
		var self = this;
		utils.progressOn();
		$('body').removeClass('loading');
		$(window).unload(function(){
			self.close();
		});
		this.noEda();
		this.noUserData();
		var historyHash = null;//unFocus.History.getCurrent()
		if (window.parent.dontLoadStartPage == true){
			window.parent.dontLoadStartPage = false;	
		} else {
			this.restore.restoreById(historyHash);
		}
		//console.log(window.loadKApp);
		if (!!navigator.userAgent.match(/mobile/i)) {
		    if (window.parent != null) {
		        if (window.parent.window != null) {
		            window.parent.window.addEventListener('orientationchange', function () { self.changeOrientation() }, false);
		        }
		    } else {
		        window.addEventListener('orientationchange', function () { self.changeOrientation() }, false);
		    }
		}
		if (window.loadKApp!=null && typeof(window.loadKApp) == 'function'){
			//console.log('loadKApp');
			//setTimeout(function(){
				window.loadKApp(self);
			//},100);
		}
		
	}
	this.changeOrientation = function () {
	    var self = this;
	    var orientation = Math.abs(window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait';
	    self.resize.resize(true);
	}

	this.close = function(){
		if (this.iSearch.request!=null){	
			this.iSearch.request.abort();		
		}
		if (this.search.request!=null){	
			this.search.request.abort();		
		}
	}
	this.init();
	

}
	
var kApp;
var goUrl = function(){return true}
var dbg;
var msg;
var utils;

if (typeof console === 'undefined') {
	var console = {log:function(){
	}}
}

// ������� ���, ��. QC#3013
function navigate(params){
    if (/^getfile1/.test(kApp.tabs.tabs[kApp.tabs.active].urlParams))
        location = 'getfile1?' + params;
}

$(document).ready(function(){
	$.ajaxSetup({
		cache: false
	});
	if ($.browser.opera) {
		$(window).scroll(function(event){
			window.scroll(0, 0);
		})
	}		 
	$.ajaxSetup({
		complete: function(request, exception, errorText){
			// console.log(request.status);
			// В локальной версии дисконнекта сервера не будет. ПК закрывается сразу полностью
			// Если выставлен параметр стелс - диалог не будет показываться

		    var noMe = $.cookie("noMobile");
		    if (noMe) {
		        var date = new Date();
		        date.setTime(date.getTime() + (30 * 60 * 1000));
		        $.cookie("noMobile", "1", { expires: date });
		    }

		    if (window.isEda && kApp && kApp.eda) {
		    	if (kApp.eda.onAjaxComplete(request, exception, errorText))
		    		return;
		    }

		    if ((request.status == 12029 || request.status == 0 && !request.stealth && $.browser.msie || request.status == 500) && !utils.isLocal()) {
				kApp.progress.disconnectDialog();
			}
		}
	});
	
	$.ajaxSetup({
		error: function(request, exception, errorText){
			// В К-клиенте дисконнект сервера проявляется 500-ой ошибкой
			if ( (request.status == 12029 || request.status == 0 || request.status == 500) && !utils.isLocal() ) {
				kApp.progress.disconnectDialog();
			}
			if (request.status == 503){
				if (window.parent != null){
					if (window.parent.window != null){
						window.parent.window.location.reload();
					}
				} else {
					window.location.reload();
				}
			}			
			dbg.dir({
				"url": this.url,
				"exception":exception,
				"errorText": errorText
			});
		}
	})
	
	window.lex = function(key){
		if (window.lexMap && window.lexMap[key]) return window.lexMap[key];
		return '';
	}
	
	$.ajax({
		url: 'variables',
		dataType : "json",
		type : "get",			
		success: function (json) {
			if (json && json.lexMap) window.lexMap = json.lexMap;
			if (json && json.prompt) window.prompt = json.prompt;
			window.kApp = new KApp();
			if (typeof customizedKApp != 'undefined')
			{
				customizedKApp(kApp);
			}
		}
	});
		var w2check = function(){
		if (window.mobile){
			$('body').addClass('mobileDevice')
			if (window.parent != null) {
				window.parent.$('.w2').hide();
			}
		}
	};
	w2check();
	setTimeout(function(){w2check()},2000);
}); 
window.mobile = !!navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)|(mobile)/i);
