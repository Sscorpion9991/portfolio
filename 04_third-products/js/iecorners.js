function IeCorners() {
	this.JSDir = 'js/3rd_party/';
	this.init = function() {
		var self = this;
		if ($.browser.msie) {
			this.load(function(){
				self.ctrl();
			});
		}
	};
	this.load = function(callback) {
		var self = this;
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
		var rnd = (new Date).getTime();

		script.setAttribute("type","text/javascript");
		script.setAttribute("src",this.JSDir+"jquery.corner.js"+'?rnd='+rnd);
		if (document.all) {
			script.onreadystatechange  =  function(){
				if (script.readyState == 'loading') {
					callback();
				}
	        }
		} else {
  			script.onload = callback;
		}
		head.appendChild(script);
	};
	
	this.ctrl = function() {
		return true;
	}
	this.init();
};