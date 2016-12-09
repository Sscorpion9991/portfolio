function  Resize(){	
	this.events=new Array();

	this.init = function(){
		var self = this;
		this.winHeight = $(window).height();
		this.winWidth = $(window).width();
		
		$(window).resize(function(){
			self.resize();
		});
		
		this.set('workspace',function(){
			self.wsResize();
		});
		setInterval(function(){
			self.wsResize();
		},10000);
	}	
	
	this.resize = function (changeOrientation) {
		var self = this;
		var date = new Date();
		if(this.lastCall != null && date.getTime() - this.lastCall.getTime() < 200) {
			clearTimeout(this.timeoutId);
			this.timeoutId = setTimeout(function(){
				self.resize();
			}, 200);
			return;
		}
		this.lastCall = date;
		var winNewWidth = $(window).width()
		var winNewHeight = $(window).height();

		if (self.winWidth != winNewWidth || self.winHeight != winNewHeight || changeOrientation) {
		    self.run();
		}
		
		//Update the width and height
		self.winWidth = winNewWidth;
		self.winHeight = winNewHeight;

		var prevHistoryList = $('div#header div#prevHistoryList ul');
		var nextHistoryList = $('div#header div#nextHistoryList ul');
		var allHistoryLists = prevHistoryList.add(nextHistoryList);

		if((self.winHeight < (prevHistoryList.height() + 45)) || (self.winHeight < (nextHistoryList.height() + 45))){
			allHistoryLists.css("max-height",self.winHeight-45 + 'px');
		} else if ((nextHistoryList.height() < 500) || (prevHistoryList.height() < 500)){
			if (self.winHeight - 45 <= 500) {
				allHistoryLists.css("max-height",self.winHeight-45 + 'px');
			} else {
				allHistoryLists.css("max-height",'500px');
			}
		}
		this.kNavListResize();
		var dialog = $('#dialog');
		if(dialog.length > 0 && dialog.is(":visible")){
			dialog.dialog("option", "position", 'center');
		}

		if($('#panel.preview:visible').length > 0){
			kApp.preview.showPreviews();
		}

	}
	this.kNavListResize = function() {
		var self = this;
		var kNavList = $('div#header div.kNavList ul');
		height = kNavList.height()
		if(self.winHeight <= (height + 75)) {
			kNavList.css("max-height",self.winHeight - 75 + 'px');
		} else {
			kNavList.css("max-height",'500px');
		}
	}
	this.run = function(key){
		for (var i in this.events){
			if (key==null || key==this.events[i].key){
				if (typeof this.events[i].event == 'function'){
					this.events[i].event();
				}
			}
		}
	}
	
	this.set = function(key,event){
		if (event!=null && event!=null && typeof event == 'function'){
			this.unset(key);
			this.events.push({'key':key,'event':event});
		}	
	}

	this.unset = function(key){
		for (var i in this.events){
			if (this.events[i].key==key){
				this.events.splice(i,1);
			}
		}
	}
	
	this.wsResize =  function(key){
		var ws = $('#workspace');
		if (ws.width()<760){
			ws.addClass('narrow');
		}else{
			ws.removeClass('narrow');
		}
		var panelDJVU = $('.panelDjvu:visible');
		if (panelDJVU.length != 0) {
			if (panelDJVU.width() < 534) {
				panelDJVU.addClass('miniPanel');
			} else {
				panelDJVU.removeClass('miniPanel');
			}
			if (panelDJVU.width() < 914) {
				panelDJVU.addClass('mediumPanel');
			} else {
				panelDJVU.removeClass('mediumPanel');
			}
		}
		var pointerNTD = $('#aSearch.pointerNTD');
		if (pointerNTD.length != 0) {
			if (pointerNTD.width() <= 860 /*|| $('#searchList.NTDSearch').is(":visible")*/) {
				pointerNTD.addClass('miniView');
			} else {
				//if($('#searchList.NTDSearch').is(":visible") == false){
					pointerNTD.removeClass('miniView');
				//}
			}
		    if (pointerNTD.width() <= 975) {
		    	pointerNTD.addClass('midleView');
		    } else {
		    	pointerNTD.removeClass('midleView');
		    }
		}
	}

	this.init();
}
