function Keyboard(){
	var JSDir = 'js/3rd_party/';
	this.timeoutId = null;
	this.delay = 1200;
	this.JSdocs = [
	 	JSDir+"jquery.keyboard.min.js",
	 	JSDir+"jquery.mousewheel.js"
	];
	this.illegalClass = ['webkit_scroll_fixed','hasDatepicker','ui-keyboard-input','quickFilter','listFilter']
	
	this.layout = 'custom';
	this.display = {
			'alt'    : '123:It\'s all Greek to me',
			'meta1'  : 'en:\u0430\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438\u0439', 
			'shift'	 : '\u21E7',
			'bksp'	 : '\u21E6',
			'accept' : 'OK',  
			'cancel' : '\u043E\u0442\u043C\u0435\u043D\u0430'           
	};

	this.customLayout = {
			'default' : [
				'\u0439 \u0446 \u0443 \u043A \u0435 \u043D \u0433 \u0448 \u0449 \u0437 \u0445 \u044A {bksp}',
				'\u0444 \u044B \u0432 \u0430 \u043F \u0440 \u043E \u043B \u0434 \u0436 \u044D {shift}' ,
				'\u044F \u0447 \u0441 \u043C \u0438 \u0442 \u044C \u0431 \u044E , . ',
				'{meta1} {alt} {space} {accept}'
			],
			'shift' : [
				'\u0419 \u0426 \u0423 \u041A \u0415 \u041D \u0413 \u0428 \u0429 \u0417 \u0425 \u042A {bksp}',
				'\u0424 \u042B \u0412 \u0410 \u041F \u0420 \u041E \u041B \u0414 \u0416 \u042D {shift}' ,
				'\u042F \u0427 \u0421 \u041C \u0418 \u0422 \u042C \u0411 \u042E , . ',
				'{meta1} {alt} {space} {accept}'
			],
			'alt' : [
				'1 2 3 4 5 6 7 8 9 0',
				'@ # \u2116 % & * - + ( )',
				'! " \' : ; / ? < > $',
				'{alt} {sp:4}  {accept} '
			],
			'meta1' : [
				'q w e r t y u i o p {bksp}',
				'a s d f g h j k l {shift}' ,
				'z x c v b n m , . ',
				'{meta1} {alt} {space} {accept}'
			],
			'meta1-shift' : [
				'Q W E R T Y U I O P {bksp}',
				'A S D F G H J K L {shift}' ,
				'Z X C V B N M , . ',
				'{meta1} {alt} {space} {accept}'
			]
	}




	this.init = function() {
		var self = this;
		if (window.showKeyboard===true){
			this.load(function(){
				self.ctrl();	
			});	
		}
	};
	this.load = function(callback){
		var self = this;
		var head = document.getElementsByTagName("head")[0];
		self.cnt = 0;
		for (var i=0; i<this.JSdocs.length; i++) {
			var script = document.createElement("script");
			script.setAttribute("type","text/javascript");
			script.setAttribute("src",this.JSdocs[i]);
			script.onload = function(){
				self.cnt++;
				if (self.cnt == self.JSdocs.length && callback!=null && typeof callback == 'function'){
					setTimeout(function(){callback();},600);
				}
	        };
			head.appendChild(script);
		}
//		this.event();		
	};	
//	this.event = function() {
//		var el = $('input');
//		console.log(el.keyboard);
//	}
	this.ctrl = function() {
		var self = this;
		var list = $("input:visible"); 
		list.each(function(){
			var el = $(this);
			if(el.attr('type')!='text') return;
			if (el.keyboard!=null && typeof el.keyboard == 'function' && el.attr('keyboard')==null){
				el.attr('keyboard','1');
				
				for (var i in self.illegalClass){
					if (el.hasClass(self.illegalClass[i])) return;				
				}
				
				var kb = $(this);
				var inputKeyboard =document.createElement('DIV')
				inputKeyboard.className = 'openKeyboard';
				$(inputKeyboard).click(function(){
					
					el.keyboard({
						restrictInput  : false, 
						layout : self.layout,
						display : self.display,
						customLayout: self.customLayout,
						visible : function(e, el){
							var board = $('.ui-keyboard');
							if ( $(el).val()==$(el).attr('default')) $('.ui-keyboard-input',board).val(''); 
							var offset = $('body').width()-board.width();
							if (offset>0){
								board.css('left',Math.round(offset/2)+'px');	
							}
							board.css('top','80px');	
							board.css('visibility','visible');
						},
						hidden : function(){
							el.getkeyboard().destroy();
							el.keyup();
						}
					});
		
					el.getkeyboard().reveal();
				
		
				});
	
				el.before(inputKeyboard);
		
			
			};
			
		});
		this.timeoutId = setTimeout(function(){
			self.ctrl();	
		},this.delay);	
	}
	this.init();
}; 
