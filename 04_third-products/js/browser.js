function Browser(main) {
	this.main = main;
	
	this.init = function() {
		$('noscript').remove();
		this.checkBrowser();
	};
	
	this.checkBrowser = function () {
		 var self = this;
		// Поддерживаем ie только восьмой версии
		if ($.browser.msie ) {
			if ($.browser.version < 8) {

				// consider IE8 emulates IE7
				var userAgent = navigator.userAgent;
				var isIE7EmulateMode = (userAgent.indexOf("Trident") != -1);
				var url;

//				if (isIE7EmulateMode) {
//					url = self.main.path.MSG_IE_EMULATE_7;
//				} else {
					url = self.main.path.MSG_UNSUPPORTED_BROWSER;
//				}
				if (!isIE7EmulateMode) {
					$.ajax({
						url: url,
						dataType: "html",
						type: "get",
						success: function(html){
							$('body').html(html);
						}
					});
					return;
				}
			}
		}
		$('#container').show();
	};
	
	this.init();
}
