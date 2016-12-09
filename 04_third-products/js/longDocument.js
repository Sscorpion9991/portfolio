	function  LongDocument(document){
		this.document=document;
		this.nd = null;
		this.nh = 0;
		this.indent=400;
		this.yScroll=null;
		this.url='text';
		this.context='';
		this.approve=false;
		this.approveList=Array();
		this.runparams=null;
		this.searchPart=null;
		this.strict=null;
		this.icoMark = false;
		this.limit = 10;
		this.timer = null;
		this.delay = 600; // ms
		this.timeout = null; // ms
		this.delayF = 250; // ms
		this.timeoutF = null; // ms
		this.lock = false;
		this.pointList = new Array();
		this.exprCSSTranslate3d = new RegExp('translate3d\\(([\\d-]*)[^\\d-]*([\\d-]*)[^\\d-]*([\\d-]*)[^\\d-]*');
			

		this.setSearchPart = function(searchPart){
			this.searchPart=searchPart;
		};
		
		this.setStrict = function(strict){
			this.strict=strict;
		};
		
		this.setNh = function(nh){
			this.nh=nh;
		};
		
		this.unsetStrict = function(){
			this.strict=null;
		};
		
		this.isLongDocuments = function(tabId){
			var body = null;
			if (tabId!=null){
				body = $('#tabBody_'+tabId+' document .text');
			}else{
				body = this.document.activeText();
			}
			if (body.length==0){
				body = $('#workspace .tabBody:visible .text')	
			}
			if (body.hasClass('longDoc')) {
				return true;
			}
			return false;
		};
		
		this.approvedNd= function(nd) {
			for(var item in this.approveList){
				if (this.nd==this.approveList[item]){
					this.approveControll();
					return;
				}
			}
			this.approveList.push(nd);
			this.approveControll();
		};
		
		this.setRunparams  = function(runparams) {
			this.runparams=runparams;
		};
		
		this.setNd  = function(nd) {
			this.nd=nd;
			this.runparams=null;
			this.searchPart=null;
			this.context='';
			if (this.ctxt!=null){
				this.context=this.ctxt;
				this.ctxt==null;
			} 
			this.approveControll();
		};
		
		this.setContext  = function(context) {
			this.context=context;
		};
		
		this.approveControll= function() {
			this.approve=false;
			for(var item in this.approveList){
				if (this.nd==this.approveList[item]){
					this.approve=true;
				}
			}
		};
		
		this.scrollToPartAfterLoading = function(part, offset, tabId){
			var self = this;
			if (tabId==null){
				tabId = this.document.main.tabs.active;
			}
			var body = $('#tabBody_'+tabId+' .text');
			var element=$("#tabBody_"+tabId+" [id="+part+"]");
		
			
			
			var onAfter = function(){
				var list = self.findPart(this,true);
				if (list.length>self.limit){
					list.splice(self.limit,list.length-self.limit);	
				}
				var afterLoading = function (){
					self.lock=true;
					var callback = function(){
						self.lock=false;
					}
			
					var p = $('#tabBody_'+tabId+' #'+part);
					var body = $('#tabBody_'+tabId+' .text');
					var element=$("#tabBody_"+tabId+" [id="+part+"]");
			
					if (offset && offset.offset){
						offset=offset.offset;
					}
					
					self.lock=false;
					if (element.length>0){
						var top = element.offset().top - 70;
						var offsetTop = element.get(0).offsetTop;
						if (offset!=null && offset.top!=null){
							top+=offset.top;	
						}
//						offsetTop-=140;
//						body.scrollTo({top:offsetTop, left:0});
						body.scrollTo({top:'+='+top+'px', left:0});
//						setTimeout(function(){
//							body.scrollTo(element,0,{offset: offset,onAfter:callback});	
//						},1000)
					}
				}
			
				if (list.length==0){
					afterLoading();	
				}
				for (var i in list) {
					if (list[i] == null) continue;
					var el = $(list[i]);
					var className = el.attr('class');
					className = className.replace('pload','punload');
					el.css('height',el.height()+'px')
					el.empty();
					el.attr('class',className);
					self.loadPart(list[i], afterLoading);
				}	
			}
			if (body.length>0 && element.length>0){
				this.lock=true;	
				body.scrollTo(element,0,{offset: offset,onAfter:onAfter});
			}
			
	}
		
		this.reload = function(parent){
			if (parent && parent.length == 1){
				parent.children().each(function(){
					var el = $(this);
					var styleClass = el.attr('class');
					el.attr('class',styleClass.replace('pload','punload'));
				})
			}
		}
		
		this.resetPart = function(part,range){
			part = /^P[0]*(\w{4,4})/.exec(part.attr('id'));
			part=parseInt(part[1],16);
			var attr = null;
			if (attr = this.includedInRange(part,range.attr('class'))){
				range.attr('class','punload_'+attr[2][0]+'_'+attr[3][0]);
			}
		}
		this.includedInRange = function(part,range){
			var attr=/^(\w+)_(\w+)_(\w*)/.exec(range);
			if (part!=null && attr != null && attr.length == 4 && (attr[1] == 'punload' || attr[1] == 'pload')) {
				attr[2] = /^P[0]*(\w+)/.exec(attr[2]);
				if (attr[3]) {
					attr[3] = /^P[0]*(\w+)/.exec(attr[3]);
				}
				else {
					attr[3] = ['PFFFF','FFFF'];
				}
			//	dbg.msg('!!!!!!!!!!!!!!!!!!!!!');
			//	dbg.msg(parseInt(attr[2][1], 16));
			//	dbg.msg(part);
			//	dbg.msg(parseInt(attr[3][1], 16));
			//	dbg.msg('!!!!!!!!!!!!!!!!!!!!!');
				if (part >= parseInt(attr[2][1], 16) && (attr[3][1] == '' || part < parseInt(attr[3][1], 16))) {
					return attr;
				}
			}
			return false;
		}		
			
		this.scrollToPart= function(part,offset,forcibly, tabId) {
			var self = this;
			if (offset==null){
				offset={
					top: -60,
					left: 0
				}
			}
			if (tabId==null){
				tabId = this.document.main.tabs.active;
			}
			var body = $('#tabBody_'+tabId+' .text');
			var element=$("#tabBody_"+tabId+" [id="+part+"]");
		
		
			if (element.length>0){
				if (forcibly) {
					this.resetPart(element,element.parent());		
				}
				this.scrollToPartAfterLoading(part, offset, tabId);
				return;
			}
			element=part;	
			part = /^P(\w{4,4})/.exec(part);
			part=parseInt(part[1],16);
			var self = this;
			var list = this.document.activeText(' > div');
			if (list.length == 1 && list.hasClass('scrollBlock')){
				list = $(' > div',list);
			}
			list.each(function (i) {
					var attr = self.includedInRange(part,$(this).attr('class')); 
				
					if(attr!=false ){
						var selfPart = this;
						if (attr[1]=='punload'){
							self.loadPart(this, function() {
//								$('#workspace .activeDoc .text').scrollTo(selfPart,0,{
//									offset: offset
//								});
								self.scrollToPartAfterLoading(element, offset);
							});
						}else{
							self.document.activeText().scrollTo(selfPart,0,{
								offset: offset
							});
						}
					}
//				}		
			});
		}
		
		this.correctionScroll = function(element, block){
			
		}
		
		this.setUrl = function (_url) {
			this._url = _url;
		}
		this.getUrl = function () {
			if (this._url != null)
				return this._url;
			return this.document.main.tabs.getActiveTab().urlParams;
		}
		this.loadPart  = function(element,callback,url){
			var self=this;
			var callback=callback;
			var attr=/^(\w+)_((\w+)_\w*)/.exec($(element).attr('class'));
			if (attr!=null && attr.length==4 && attr[1]=='punload'){
				var styleClass=$(element).attr('class');
				$(element).attr('class',styleClass.replace('punload','pload'));
				if (url==null){
					url = self.getUrl();
				}
				
				if(url==null || !/^text/.test(url)){
					return;
				}
	//			return;
				var data = 'part='+attr[2]+'&context='+self.context+((this.strict)? '&strict='+this.strict :'') + '&div_id='+$(element).attr('id');
				var contextForPart = null;
				if (this.document.textSearch.contextForPart) {
					var part = /^P[0]*(\w{4,4})/.exec(this.document.textSearch.contextForPart.part);
					part=parseInt(part[1],16);
					contextForPart = self.includedInRange(part, attr[0]);
					if (this.document.textSearch.contextForPart.nd && this.document.textSearch.contextForPart.nd!=this.document.nd){
						contextForPart = false;	
					}
					if (this.document.textSearch.contextForPart.tab && this.document.textSearch.contextForPart.tab!=this.document.main.tabs.active){
						contextForPart = false;	
					}
				}
				if (!self.context && contextForPart ){
					data = utils.setUrlParam(data,'context',this.document.textSearch.contextForPart.context);		
				}
				var loc = utils.URLAttrParse(url+"&"+data);
				var request = $.ajax({
					url: loc.location,
					element: element,
					attr: attr,
					type: "GET",
					dataType : "html",
					data: loc.attr,
					error: function (data){
//						dbg.msg('fq');
					},
					complete : function (){},
					success: function (data){
//						if (data==''){
//							return;
//						}
					//	var attr=/^(\w+)_((\w+)_\w+)/g.exec($(this.element).attr('class'));
						$('a#c'+this.attr[3]).remove();
						var textBody = $(this.element).parent().parent();
						var height=$(this.element).height();
						var correction = false;
						if (textBody.length > 0) {
							var scrollTop = textBody.get(0).scrollTop;
							var offsetTop = $(this.element).get(0).offsetTop;
							if (scrollTop > offsetTop) {
								var correction = true;
							}
						}
						//dbg.msg({id:this.element.id,correction:scrollTop-offsetTop,scrollTop:scrollTop,offsetTop:offsetTop});
						var showMark = $('#mark',$(this.element));
						if (showMark.length>0 && $(this.element).children().length == 1 ){
							self.icoMark = true;
							$(this.element).append(data);
						}else{
							$(this.element).html(data);
						}
						var inactiveLinks = $(".inactiveLink",this.element);
						inactiveLinks.each(function(){
							if($(this).text() == "предыдущую редакцию") { // необходимо точное совпадение
								$(this).removeClass('inactiveLink');
								$(this).attr("title","");
							}
						});
						
						var marks = $('[id=mark]');
				//		dbg.msg('marks:'+marks.length);
						var findMarker = function(){};
						if (marks.length>1){
							marks.eq(0).remove();
							findMarker = function(){self.document.findMarker()};
						}
						
						if(window.ARZ['init'] != null) {
							ARM_ARZ_OBJ.loadPartDoc(this.element);
						}
						
						$(this.element).css('height','auto');
						if (correction) {
							correction = $(this.element).height() - height - 70;
							textBody.scrollTo({
								top: (correction < 0 ? '-' : '+') + '=' + Math.abs(correction) + 'px',
								left: '+=0px'
									},
								{
								onAfter: function(){
									findMarker();
									if (callback) {
										callback();
									}
								}
							});
							
						} else {
							findMarker();
							if (callback) {
								callback();
							}
						}
						self.document.initLinkTitles();
//						if (self.runparams!=null){
//							for(var i = 0; i < self.runparams.after.length; i++)
//								self.runparams.after[i](self.runparams.afterParams,mark);
//						}	
						
					}
				});	
				if (this.requestLoadPart==null){
					this.requestLoadPart = new Array();
				}
				this.requestLoadPart.push({element:element, request:request});
//				this.clearRequestList();				
			}else{
				if (callback!=null && typeof callback == 'function') {
					callback();
				}
			} 		
		}
		
		this.loadNextPart  = function(callback) {
			if (this.searchPart.length==0) {
				if (callback) {
					callback();
				}
				return false;
			}
			for(var i in this.searchPart){
				if (this.searchPart[i]!=null){
					var element = this.document.activeText(' #P'+this.searchPart[i]).filter(':visible');
					if (/^punload/.test(element.attr('class'))){
						this.loadPart(element.get(0),callback);
						return true;
					}else{
						this.searchPart.splice(i,1);
						return false;
					}
				}
			}
		}
		this.reset  = function() {
			var element = this.document.activeText();
			element.children().each(function (i) {
				var attr=/^(\w+)_(\w+)_(\w*)/.exec($(this).attr('class'));
				if (attr!=null && attr.length==4 && attr[1]=='pload'){		
					var styleClass=$(this).attr('class');
					$(this).attr('class',styleClass.replace('pload','punload'));
					$(this).empty();
				}				
			});					
		}
		
		this.getPartsDiv = function (element) {
			return $('.scrollBlock > div', $(element));
		}

		this.findPart = function(element,all) {
			if (window.isEda) {
				this.document.main.eda.beforeLongDocumentFindPart();
			}
			if (all){
//				console.log('NEW');
				this.pointList = new Array();
			}
//			dbg.resetTimer('fnd',false);
			var self=this;
			this.yScroll= $(element).get(0).scrollTop;
//			console.log('offsetTop: '+eee.offsetTop);
			
			
			var el = $('.scrollBlock',element);
			if (window.mobile && el){
				var expr = new RegExp('translate3d\\(([\\d-]*)[^\\d-]*([\\d-]*)[^\\d-]*([\\d-]*)[^\\d-]*')
				var arr = this.exprCSSTranslate3d.exec(el.css('-webkit-transform'));
				if (arr && arr.length == 4 && arr[2]<0){
					this.yScroll = parseInt(arr[2])*-1;
				}
			}

			
			
			var listPart = new Array();
			this.getPartsDiv(element).each(function (i) {
				if (all!=null || /^punload/.test(this.className)) {
					listPart.push(this);
				}
				if (window.isEda) {
					self.document.main.eda.addListPart(this, listPart);
				}
			});
			var h=0;
			var limit=10;
			var find=null;
			var res=null;
			var start=0;
			var stop=listPart.length;
			var step=Math.ceil(stop/2);
			while (step>0){
				part=step+start;
				res=this.isVisible(listPart[part-1])
				if (res==0){
					find=step+start;
					step=0;
					break;
				}
				if (res==1){
					start=part;
				}
				if (res==-1){
					stop=part;
				}
				step=Math.floor((stop-start)/2);
			}
			start++;
			if (find==null && this.isVisible(listPart[start-1])==0){
				find=start;
			}
			var result = new Array();


			if (find!=null){
			
				result.push(listPart[find]);
				for(var i=find; i<=listPart.length; i++){
					var block=listPart[i-1];
					if (this.isVisible(block)!=0 ){
						break;
					}
					result.push(block);
					limit--;
				}				
				for(var i=(find-1); i>=0; i--){
					var block=listPart[i-1];
					if (this.isVisible(block)!=0 ){
						break;
					}
					result.push(block);
					limit--;
				}				
			}
	//		dbg.msg({'find': find,'cnt': result.length,'listPart': listPart.length},'fnd');
			
	
			if (all){
				this.ctrlPointList();
			}
			return result;
		}

		this.isVisible = function(element,indent){
			var self = this;
			if (!element){
				return;
			}
			if (indent==null){
				indent=this.indent;
			}
			
			if ( (element.offsetTop) < (this.yScroll + screen.height + indent)) {
				if ((element.offsetTop + $(element).height()) > (this.yScroll - indent)){
//					console.log(element);
//					console.log(element.offsetTop - this.yScroll);
					
					//console.log('00 '+this.offsetTop - self.yScroll);
					var offset = element.offsetTop - self.yScroll
					self.pointList.push({
						el:element,
						offset:offset,
						width:$(window).width() 
					})

					return 0;						
				}
				return 1;						
			}
			return -1;						
		}
		this.resetTimer = function(){
			this.timer = ( new Date()).getTime();
		}
		this.isTimeout = function(element){
			if (this.timer==null){
				this.resetTimer();		
				return 1;		
			}
			var result = ( new Date()).getTime()- this.delay - this.timer;
			if (result>0){
				this.resetTimer();		
			} 
			return result;
		}
	
		this.init  = function(element,timer,mark,callback) {
			
			if (this.lock){
				return;
			}
			var self = this;
			//	this.yScroll= $(element).get(0).scrollTop;	
			var t;
			if (timer != false) {
				if ((t = this.isTimeout()) < 0) {
					return false;
				}else{
					clearTimeout(self.timeout);
					self.timeout = setTimeout(function(){
						self.init(element,false)	
					},this.delay*2);
					clearTimeout(self.timeoutF);
					self.timeoutF = setTimeout(function(){
						self.init(element,false)	
					},this.delayF*2);
				}
			}
			
			this.document.rewriteHistory();
			if (mark!=false){
				this.ctrlMark();
			}
			var list = this.findPart(element);
			var h=0;
			if (list.length>this.limit){
				list.splice(0,list.length-this.limit);	
			}
			var body = $(element).parents().filter('.tabBody').eq(0);
			var tabId = utils.getId(body.attr('id'));
			var url = '';
			
			if(typeof(tabId) != 'undefined') {
				var url = self.document.main.tabs.tabs[tabId].urlParams;
			} else {
				url = this._url;
			}

			for (var i in list) {
				//console.log(list[i].id)
				self.loadPart(list[i], callback, url);
			}															
		};	
		this.ctrlMark = function(){
		//	dbg.msg({'mark': this.icoMark},'fnd');
			if (this.icoMark){
				var mark = $('.activeDoc #mark:visible');
				var isVisible = this.isVisible(mark.get(0),100);
				if (isVisible!=0){
			//		dbg.msg({yScroll:yScroll});
//					dbg.msg('hide');
					
			//		mark.remove();	
				}
			}
		}
		this.clearRequestList = function(){
//			return;
			this.requestLoadPart != null;
			for (var i in this.requestLoadPart){
				var el = $(this.requestLoadPart[i].element);
				el.attr('class',el.attr('class').replace('pload','punload'));
				this.requestLoadPart[i].request.abort();
			}
			this.requestLoadPart=null;
		};
		
		this.ctrlPointList = function(tm){
			var self = this;
			if (this.cplLock){
				clearTimeout(this.cplTimeoutId);
				this.cplTimeoutId = setTimeout(function(){
					self.ctrlPointList();
				},1000);
				return;
			};
			
			
			if (tm == null){
				clearTimeout(this.cplTimeoutId7);
				this.cplTimeoutId7 = setTimeout(function(){
					self.ctrlPointList(true);
				},500);
				return;
			}
			
			this.cplLock = true;
			
			clearTimeout(this.cplTimeoutId);
			//console.log('this.ctrlPointList');
			try{
				
				var min = null;
	//			$('div, p').css('border-right','0px');
				current = null;
				var offset = null;
				for (i in this.pointList){
					var el = this.pointList[i].el;
	//				$(el).css('border-right','1px solid green');
					var list = $('> p, > div',$(el)); 
					if (list.length>0){
						list.each(function(i){
							offset = $(this).offset();
					//		console.log(this);
					//		console.log(offset.top);
							if (offset.top>57 &&  (current == null || (offset.top)<(current.offset.top))){
								current = {
									el: this,
									offset: offset,
									width: $(window).width()
								};
							}
						})
					}
				}
				//console.log('SAVE');
				if (offset!=null){
//					$(current.el).css('border-left','1px solid red');
					this.currentOffset = current
				}
			} finally {
				this.cplLock = false;
			}
		};
		
		this.ctrlOffset = function(body,callback){
			//console.log('ctrlOffset');
			clearTimeout(this.cplTimeoutId);
			clearTimeout(this.cplTimeoutId7);
			if (this.currentOffset!=null){
				var width = $(window).width();
				this.currentOffset.offset.top-=57;
				this.currentOffset.offset.top*=width/this.currentOffset.width;
				var offset = this.currentOffset.el.offsetTop - this.currentOffset.offset.top;
				//console.log('offset: '+offset);
//				$(this.currentOffset.el).css('border','3px solid blue');
//				$(body).scrollTo(this.currentOffset.el);
				$(body).scrollTo({top:''+offset+'px', left:'+=0'});			
			}
			return;
			
			
			var i = null;
			var min = null;
			for (i in this.pointList){
				if (min == null || Math.abs(this.pointList[i].offset)<Math.abs(this.pointList[min].offset)){
					min = i;
				}
			}
			if(min!=null){
				//console.log(this.pointList[i]);
				//console.log(this.pointList[i].el.offsetTop);
				//console.log(this.pointList[i].offset);
				
				var offset = this.pointList[i].el.offsetTop;
				
				offset-= Math.round((this.pointList[i].width/$(window).width()) * this.pointList[i].offset);
				
				//console.log('* * *');
				//console.log(this.pointList[i].offset);
				//console.log(Math.round((this.pointList[i].width/$(window).width()) * this.pointList[i].offset));
						
				//console.log(body);
				//console.log(offset);
				$(body).scrollTo({top: offset+'px',left:'+=0',
					onAfter:function(){
						if (callback!=null && typeof callback == 'function'){
							callback();
						}
					}
				});
				//console.log(this.pointList[i].el);
			}else{
				if (callback!=null && typeof callback == 'function'){
					callback();
				}
			}
		}

	}
	