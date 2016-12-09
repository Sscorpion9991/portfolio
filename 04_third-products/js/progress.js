function  Progress(main){
	this.main=main;
	this.delay = 0*1;
	this.longDelay = 10*1;
	this.dialogDelay = 60*1;
	this.dialogInterval = null;
	this.waitDialog = null;
	this.historyId = null;
	this.init = function(){
		var self=this;
		this.stop();
		$('.longWaiting a').live('click', function(){
			self.back();		
		});
		$('.hideWaitDialog').live('click', function(){
			self.closeWaitDialog();
		});

		$('.closeBookmarkDialog').live('click', function(){
			if (self.waitDialog && self.waitDialog.dialog){
				self.waitDialog.dialog( 'destroy' );
			}
			if (self.disconnectDialog && self.disconnectDialog.dialog) {
				self.disconnectDialog.dialog('destroy');
			}
		});
	};
	
	this.back = function(){
		if (this.main.iSearch.request!=null){	
			this.main.iSearch.request.abort();		
		}
		if (this.main.listDocument.request!=null){	
			this.main.listDocument.request.abort();		
		}

		if (this.customStop!=null){
			this.customStop();
		}

		if (this.historyId!=null){
			this.main.history.go(this.historyId);
		}else{
			this.main.history.prev();
		}
	}
	
	this.showWaitDialog = function(){
		var self = this;
		clearInterval(self.dialogInterval);
		if (!this.waitDialog){
			utils.hideFlash();
			this.waitDialog = $("#waitDialog").dialog({
				autoOpen: true,
				width: 530,
				height: 200,
				closeOnEscape: true,
				position: 'center',
				modal: true,
				draggable: false,
				close: function() {
					self.waitDialog.dialog('destroy');
					clearInterval(self.dialogInterval);
					self.dialogInterval = setInterval(function(){
						self.showWaitDialog();
					}, self.dialogDelay);
					utils.showFlash();
					return;
				}
			});
		}
	}

	this.disconnectDialog = function(){
		var self = this;
		
		self.main.progress.stop('document');
		$('#workspace').empty();
		$('#icons').empty();
		$('#tabs').hide();
		self.main.tabs.hidePanel();

		$('#workspace').append(' \
		<div style="overflow-y: auto" class="tabBody"> \
			<div class="message notinbase" style="text-align: center;"> \
			<p>Потеряно соединение с сервером.</p> \
			<span class="default"> \
				Скорее всего, это вызвано неполадками сети или временными проблемами на сервере.<br> \
				Нажмите <a href="#" onclick="kApp.history.reload();kApp.progress.start();">"повторить"</a> для отправки повторного запроса на соединение или обратитесь к системному администратору. \
			</span> \
			</div> \
		</div> \
		');
	}
	
	this.closeWaitDialog = function(stop){
		if (this.waitDialog!=null){
			if (stop){
				this.waitDialog.dialog('destroy');
			} else {
				this.waitDialog.dialog('close');
			}
			this.waitDialog=null;
			$('#waitDialog').hide();
		}
	}
	this.start = function(historyId, customStop){
		var self = this;
		this.historyId=historyId;
		this.customStop=customStop;
		if($('#left').is(':visible')) {
			$("#loading div.progress").css('margin-left', ($('#left').width()/2) - 140);
		} else {
			$("#loading div.progress").css('margin-left',"-140px");
		}
		var self = this;
		$('body').addClass('progress');
		$('.longWaiting:visible').hide();
		$('.waitMore').text(self.main.messege.get('waitMessage'));
		$('.waitMore').show();
		
//		if (!self.dialogInterval) {
//			self.dialogInterval = setInterval(function(){
//				self.showWaitDialog();
//			}, self.dialogDelay);
//		}
		$('div.progress').oneTime(self.longDelay, function(){
			if ($('.waitMore:visible').length > 0){
				$('.waitMore:visible').text(self.main.messege.get('longOperation'));
				$('.longWaiting').show();
			}
		});
	};
	this.stop = function(){
		this.historyId=null;
		$('body').removeClass('progress');
		$('div.progress').stopTime();
		$('.waitMore:visible').hide();
		$('.longWaiting:visible').hide();
		clearInterval(this.dialogInterval);
		this.closeWaitDialog(true);
	};
	
	this.waitStart = function(el){
		el.addClass('wait')
		$('body').css('cursor','wait')
	}	

	this.waitStop = function(el){
		el.removeClass('wait')
		$('body').css('cursor','default')
	}	

	this.init();
}
