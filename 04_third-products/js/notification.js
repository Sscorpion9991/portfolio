function  Notification(main){
	this.main = main;
	this.options = {
		style: {
			cursor:"pointer",
			bottom:-122,
			position:"fixed",
			width:189,
			height:122,
			display:'none'
		},
		url:"http://www.kodeks.ru/livezilla/chat.php",
		close:true
	};
	this.init = function(container, options) {
		var self = this;
		this.options = options?$.extend(true, this.options, options):this.options;
		if(container) {
			if(!window.showOnlineConsult && this.options.demoMode) {
				return;
			}
			$("#notification").remove();
			var notification = '<div id="notification" class="'+(this.options.className?this.options.className:"")+'">';
			notification+= '<div class="girl" alt="Онлайн консультант"></div><div id="shadows"></div>';
			if(this.options.close) {
				notification+= '<div class="close"></div>';
			}
			notification+=	'</div>';
			container.append(notification);
			var element = $("#notification"+(this.options.className?"."+this.options.className:"")+"", container);
			element.css(this.options.style);
			$(".close", element).die().live("click", function() {
				if(self.options.close) {
					element.animate({
						bottom:self.options.style.bottom
					},600, function(){
						element.remove();
					});
					return false;
				}
			});
			element.die().live("click", function() {
				var url = self.options.url;
				window.open(url,"","width=590,height=530,left=0,top=0,resizable=yes,menubar=no,location=no,status=yes,scrollbars=yes");
			}).show().animate({
				bottom:4
			},900);
		}
	}
}