	function  ListDocument(main){
		this.main=main;
		this.stateList = new Array();
		this.active = null;
		this.list = null;
		this.filter = null;
		this.indent=400;
		this.yScroll=null;
		this.timer = null;
		this.delay = 100; // ms
		this.timeout = null; // ms
		this.delayF = 200; // ms
		this.timeoutF = null; // ms
		this.cross = null;
		this.request = null;
		this.partRequest = new Array();
		this.quickFilterTimer = null;
		this.quickFilterContext = null;
		this.quickFilterRequest = null;
		this.lastContext = '';
		this.currentContext;
		this.timeoutId = null;
		this.scrToItem = null;
		this.linkHistory;
		this.HEIGHT_LIST_ITEM = 67;
		this.saveOffsetTimeout = null;
		this.iContext = {listDocument:this};
		this.searchType = null;
//		this.timeout1 = null; // ms
			
		this.setEvent = function(){
			var self = this;
			$('.list li.docItem').live('click', function(event) {
				if (window.isEda) {
					if (event.isPropagationStopped())
						return;
				}
				if (window.isEda) {
					self.main.eda.beforeListSelect(this, event, self);
				}
				self.main.list.select(
					this,
					event,
					function(element,event,offset){
						if (window.isEda) {
							self.main.eda.openDocFromList(element, self, event, offset);
						} else {
							self.openDoc(element, event, offset);
						}
					},
					null,
					function(cnt,el){
						self.showCntInfo(cnt,el);
					}
				);
			});
			if ($.browser.msie){
				$('.list li.docItem').live('dblclick',function(event){
					self.openDoc(this,event);
				});
			}
			$('.docList .showInfoCntItem').live('click',function() { self.controlBlockInfoCntItem(true)	});
			$('.docList .hideInfoCntItem').live('click',function() { self.controlBlockInfoCntItem(false)	});

			$('.ico_prevDoc').live("click", function(){self.crossDoc(this,'prev')});
			$('.ico_listDoc').live("click", function(){self.crossDoc(this,'list')});
			$('.ico_nextDoc').live("click", function(){self.crossDoc(this,'next')});
			$('.doSort').live("click", function(){self.sort(this)});
			$('.sortList').live("click", function(){self.sortList(this)});
			$('.filterSortOptions .clearFilter').live('click', function(e){
				self.clearFilter();
			});
			$('.searchInfo .quest').live("click", function(){self.getRealSizeDlg(this)});
			$('.searchInfo .getRealSize').live("click", function(){self.getRealSize(this)});
			$('.searchInfo .realSize div.close').live("click", function(){$(this).parent().remove(); return false;});
			
		
		}

		this.initQuickFilter = function(){
			var self = this;

			this.quickFilterTimeout();
			this.quickFilterContext = null;
			$(window).keydown(function(event){self.quickFilterKey(event)});
			$('.quickFilter').keyup(function(event){self.quickFilter(event)});
		}
		
		this.getList = function () {
			return $('#workspace .tabBody:visible div.docList, #dialog div.docList').eq(0);
		}

		this.init = function(url, callback, context){
			var self = this;
			this.selectedElement = null;
			this.currentContext = context;
			if (callback) {
				self.main.progress.start(); //РІ callback РЅР°РґРѕ Р±С‹ СѓР±РёСЂР°С‚СЊ progress
			}
			main.filter.clearFilterStatus();
			if (window.isEda) {
				this.main.eda.initHelp();
			}
			this.resetTimer();
			this.list=this.getList();
			var id = /docList_(\d+)/.exec(this.list.attr('id'));
			if (id!=null && id.length==2){
				this.active=parseInt(id[1]);
				if (this.stateList[this.active]){
					this.setState(callback);
					return;
				}
			}
			this.active=null;
			this.getState(url, callback);
			this.crossReg();
			
//			if (!window.noUserData) { 
//				this.main.contextMenu.remove('Положить в папку');
//				this.main.contextMenu.reg('.docItem.selected','Положить в папку',
//					function(e,el){  self.folderPut(el);  }
//				);
//			}

			if (typeof customizedListDocumentInit != 'undefined')
				customizedListDocumentInit(this);

			
			return;
		}
		
		this.crossReg = function(){
			var self = this;
			this.main.list.crossReg(
				function(event){
					self.cross(event);
				},function(cnt,el){
					if( typeof(el)!='undefined'	) {
						self.showCntInfo(cnt,el);
					}
				}
			)
		}
		
		this.getActiveState = function(){
			return this.stateList[this.active];
		}
		this.setActiveState = function(state){
			this.stateList[this.active]=state;
		}

		this.getState = function (url, callback) {
		    var self = this;
		    var json = null;
		    if (url == null) {
		        var str = this.list.text();
		        if (!/r=\d+/.test(str) && $('p.title a:visible').length) {
		            str += 'r=' + $('p.title a:visible').attr('nd');
		        }
		        var url = this.list.attr('rel');
		        if (url == null || url == "") {
		            url = this.main.path.URL_DOCUMENT_LIST;
		        }
		    }

		    if (this.request != null) {
		        this.request.abort();
		        this.request = null;
		    }

		    //			dbg.msg('READ '+self.scrToItem);

		    if (this.stateList.length > 0) {
		        if (self.scrToItem != null) {
		            self.active = self.scrToItem;
		            self.scrToItem = null;
		            self.list.attr('id', 'docList_' + self.active);
		            try {
		                self.list.addClass('partSize' + self.getActiveState().dpp);
		            } catch (e) {
		                //						dbg.msg('State list is null. Message: '+e.toString());
		            }
		            self.setState(callback);
		            return;
		        }
		    } else {
		        self.scrToItem = null;
		    }
		    //			self.scrToItem = null;
		    str = this.hack(str);

		    if (str) {
		        url += (url.indexOf('?') == -1 ? '?' : '&') + str;
		    }

		    var loc = utils.URLAttrParse(url);

		    this.request = $.ajax({
		        url: loc.location,
		        type: "GET",
		        dataType: "json",
		        data: loc.attr,
		        complete: function () { },
		        success: function (json) {
		            //					alert('STOP 1');
		            var context = null;
		            if (self.isASearchList()) {
		                context = self.main.search.getContext();
		            }
		            var params = {
		                //id : utils.getUrlParam(this.url,'listid'),
		                url: url,
		                dpp: json.dpp,
		                type: json.type,
		                part: 0,
		                context: context,
						listArea: json.listArea
		            }
					self.setListArea(json.listArea)
		            self.main.list.docArea = json.docArea;
		            if (json.sortedListSize) {
		                params.sortedListSize = json.sortedListSize;
		            } else {
		                params.sortedListSize = json.size;
		            }
		            params.size = json.size;

		            self.setStyleList();
		            self.list.addClass('partSize' + json.dpp);
		            self.stateList.push(params);
		            self.active = self.stateList.length - 1;
		            self.list.attr('id', 'docList_' + self.active);
		            self.setState(callback);
		        }
		    });
		}
		
		this.setListArea = function(listArea){
			var self = this;
			self.main.list.listArea = listArea;
			if(self.main.tabs.tabs != null && self.main.tabs.active != null){
				if(self.main.tabs.tabs[self.main.tabs.active] != null){
					self.main.tabs.tabs[self.main.tabs.active].listArea = listArea;
				}
			}
		}
		
		this.reload = function(url, callback){
			var self= this;
			self.main.progress.start(); 
			var filter = '';
			if (this.stateList[this.active].filter!=null){
				filter = '&'+this.stateList[this.active].filter//+'&part=0';
			}
	
	
			var loc = utils.URLAttrParse(url+filter);
	
			$.ajax({
				url: loc.location,
				type: "GET",
				dataType : "json",
				data:loc.attr,
				success: function (json){
//					console.log(this.url);
					self.list.attr('id','docList_'+self.active);
					self.getActiveState().url = url;
					self.getActiveState().context = null;
					self.getActiveState().dpp = json.dpp;
					if (json.sortedListSize){
						self.getActiveState().sortedListSize = json.sortedListSize;	
					}else{
						self.getActiveState().sortedListSize = json.size;	
					}
					self.getActiveState().size = json.size;
					self.getActiveState().type = json.type;
					self.setState(function(){self.main.progress.stop('document');});
		//			if(self.main.filter.dialog) {
		//				self.main.filter.dialog.dialog('destroy');
		//				$("#dialog").empty();
		//			}
					if (callback){
						callback();
					}
				},
				error: function(e){
//					console.log('************');
//					console.log(this.url);
//					console.log(this.data);
//					for (var i in e){
//						console.log(i+':'+e[i]);
//					}
				}
			});						
		}
		
		this.setState = function(callback){
			var self= this;
			var filter = '';
			if (this.stateList.length>0 && this.stateList[this.active].filter!=null){
				filter = '&'+this.stateList[this.active].filter;
			} 
			var url = utils.setUrlParam( this.stateList[this.active].url+filter,'part', 0);	

			var loc = utils.URLAttrParse(url);

			if(window.ARZ['init']) {
				var FoAnT_sort = foreAnalyst.sortND(loc.attr.nd);

				if(FoAnT_sort) {
					loc.attr.sort = FoAnT_sort; // 6 or 1300
				}
				delete FoAnT_sort;
			}
			
			$.ajax({
				url: loc.location,
				data: loc.attr,
				type: "GET",
				dataType : "html",
				success: function (html){
					self.list.html(html);
					self.list.show();
					if (self.stateList[self.active].sortedListSize!= null && self.stateList[self.active].sortedListSize!=self.stateList[self.active].size){
						$('.tabBody:visible .infoCntItem').show();
						$('.tabBody:visible .infoRealCnt').show();
						$('.tabBody:visible .infoRealCnt').html(self.stateList[self.active].size);
					} else {
						$('.tabBody:visible .infoCntItem').hide();
					}
					var step = self.stateList[self.active].dpp;
					var size = self.stateList[self.active].sortedListSize;
					var html = '';
					var li = null;
					var listBody = $('ul',self.list).get(0);
//					dbg.resetTimer('lst');
//					dbg.msg('- - START - - ','lst');
					self.setListArea(self.stateList[self.active].listArea);
					for (var i = 1; i<(size/step); i++){
						var partHeight = step*self.HEIGHT_LIST_ITEM;
						if(($.browser.msie) && ($.browser.version < 9)) {
							var mod = Math.floor((partHeight*size/step)/5000000);
							mod = (mod<1)?1:mod;
							partHeight = partHeight/mod;
						}
						html+='<li id="part_'+i+'" class="part" style="height:'+partHeight+'px"></li>';
					}
					if (listBody) {
					    listBody.innerHTML += html;
					}
				
				//	$('ul',self.list).append(html);

//					dbg.msg('- - FINISH - - ','lst');
					$('.scroll',self.list).scroll(function (event) {
						self.scroll(this);
					});
					$('.scroll',self.list).bind('touchend',function (event) {
						self.scroll(this);
					});

					self.initQuickFilter();
					self.showStatus();
					if (callback) {					
						//dbg.msg('callback='+callback.toString());
						callback();
					}
					if (self.isASearchList()){
						$("#searchList div.searchAttrs .attr").html( self.main.search.strResultListStatus );
						self.iContext.show();
					}
					
					
					if (self.getActiveState().currentItem!=null && !window.mobile) {
						self.scrollToItem(self.getActiveState().currentItem,self.getActiveState().offset)
					//	dbg.msg(self.getActiveState().offset)
					}else{
						if (self.getActiveState().current != null) {
							self.scrollToItem(self.getActiveState().current,0,true)
						}else{
							$('.scroll').scrollTo(0);
						}
					}
					self.ctrlOffset();
					if ($.browser.msie ) {
						self.setStyleList();
					}
					self.mobileScroll();
					
					if((window.ARZ['init'] && window.ARZ['edit'])) {
						ARM_ARZ_OBJ.loadListKodeks6(self.list);
					}
					if ($('.searchInfo .title .quest').hasClass('needLoadRealSize')) {
						self.getRealSize();
					}
				}				
				
			});						
		}
		
		this.buildStatusHTML = function(json){
			
			if(!json || !json.length) return '';
			var title;
			var html = '<div>Условия фильтра:</div><div class="clearFilter">[x] сбросить фильтр</div><table>';
			for(var i=0; i < json.length; i++){
				if((json[i].findType == '3' ||  json[i].findType == '4')&& (json[i+1] && json[i+1].findType==undefined) ){
					if(json[i].findType == '3')
						title = 'период с ';
					else
						title = 'вне периода с ';
					html += '<tr><td class="col1">' + json[i].title + ':</td><td class="col2">' + title + json[i].value + ' по '+ json[i+1].value +'</td></tr>';
					i++;
				} else {
					switch(json[i].findType) {
						case '0':
							if (json[i].type=='number'){
								title = "";
							}else{
								title = "точно ";
							}
							break;
						case '1':
							if (json[i].type=='number'){
								title = "точно  ";
							}else{
								title = "по ";
							}
							break;
						case '2':
							if (json[i].type=='number'){
								title = "cодержит ";
							}else{
								title = "c ";
							}
							break;
						case '4':
							if (json[i].type=='number'){
								title = "начинается с ";
							}else{
								title = "";
							}
							break;
						default:
							title = "";
							break;
					}
					html += '<tr><td class="col1">' + json[i].title + ':</td><td class="col2">' + title + json[i].value + '</td></tr>';
				}
			}
			html+= '</table>'
			return html;
		}
			
		this.showStatus = function(){
			var self = this;
			this.list.each(function (i) {
				var id = utils.getId(this.id);
				var count = $('.searchInfo .count', $(this));
				count.show();
//				$('.value',count).html(self.stateList[id].sortedListSize);
				var filterStatus = self.buildStatusHTML(self.getActiveState().attr);
				$('#docList_'+id+' .searchInfo .title .filterStatus').remove();
				var icoFilter = $('#docList_'+id+' .doFilter');
				if (filterStatus!=''){
					$('#docList_'+id+' .searchInfo .title .filterSortOptions').append(filterStatus).show();
					icoFilter.addClass('on');
				}else{
					$('#docList_'+id+' .searchInfo .title .filterSortOptions').hide();
					icoFilter.removeClass('on');
				}
				//$('#docList_'+id+'  .docList').css('padding-top',(14*(main.filter.currentListStatus.length+1)+24)+'px') ;
				//$('#docList_'+id+'  .searchInfo').css('margin-top',(-14*(main.filter.currentListStatus.length+1)-24)+'px') ;
				var select = $('.searchInfo .select',$(this));
				$('#docList_'+id+' .value',select).html();
			});
		}
		
		this.ctrlOffset = function(){
			var id = utils.getId(this.id);
			$(this.list).css('margin-top', '0px');
			$(this.list).css('padding-top', '0px');
			var parent = $(this.list).parent();
//			var n = parseInt(/\d+/.exec($(this.list).css('padding-top'))[0]);
			var jElList = $(this.list);
			var offset =  0;
			if (jElList && jElList.length) offset = jElList.get(0).offsetTop - parent.children().get(0).offsetTop;
			offset += $('#workspace .searchInfo:visible').height();
			var jqLH = $('#workspace .list_header:visible');
			if (jqLH.length > 0) {
				offset += jqLH.height();
				offset += parseInt(jqLH.css('padding-top')) + 1;
				offset += parseInt(jqLH.css('padding-bottom')) + 1;
				
				var listScroll = jqLH.next();
				var listItem = $('ul > li:first', jqLH.next());
				var rpadding = parseInt(listItem.css('padding-right'));
				rpadding += listScroll.width() - listScroll.attr('clientWidth');
				jqLH.css('padding-right', rpadding);
				jqLH.find("table:first").css('padding-right', rpadding);
			}
//			offset += 4;
			
			var paddingTop = $(this.list).css('padding-top');
			paddingTop = parseInt(paddingTop);
			paddingTop += offset;
			paddingTop += 6;
	
	
			var marginTop = $(this.list).css('margin-top');
			marginTop = parseInt(marginTop);
//			if (marginTop<0){
//				paddingTop+=marginTop;
//				marginTop=0;
//			}
			marginTop -= offset;
			marginTop -= 6;
			$(this.list).css('margin-top', marginTop);			
		
		
		
			$(this.list).css('padding-top', paddingTop);

			//$(this.list).css('overflow','hidden');
		}
		
		this.loadPart = function(id,element,callback){
			var self = this;
			if (id==null){
				id = this.active;
			}
			var part = /part_(\d+)/.exec(element.id);
			if (part!=null && part.length==2){

				$(element).addClass('partLoading');			
				$(element).removeClass('part');			
				part=parseInt(part[1]);
				var filter = '';
				if (this.stateList[this.active].filter!=null){
					filter = '&'+this.stateList[this.active].filter;
				} 
				var url = utils.setUrlParam(this.stateList[id].url+filter,'part', part);
				
				var loc = utils.URLAttrParse(url);
				

				this.partRequest.push({
					req: $.ajax({
						
						url: loc.location,
						element : element,
						type: "GET",
						dataType: "html",
						data: loc.attr,
						success: function(html){

//							console.log(this.element.id);
//							console.log(' - - - * - - - ');
//							console.log($('#part_' + part).length);
//							console.log($('#part_' + part).parent().length);
//							console.log(this.element.id);
//							console.log(' * - - - - - * ');
							
							if ($('#part_' + part).length != 0) {
								$(this.element).after(html);
								if ($(this.element).hasClass('selected')){
									var li = $(this.element).next();
									while(!li.hasClass('selected')){
										li.addClass('selected');
										li = li.next();
									}
								}
								var firstItem = $(this.element).next();
								$(this.element).remove();

								if (callback) {
									callback(firstItem.get(0));
								}
								self.saveOffset();

							}
						},
						error: function(){
							$(element).removeClass('partLoading');
							$(element).addClass('part');			
						}
					}),
					part: element.id
				});		
			}					
					
		}
		this.isListDocuments = function(searchPart){
			if (this.getList().length>0){
				return true;
			}
			return false;
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
		this.partRequestClear = function(element,timer){
			if (this.partRequest!=null && this.partRequest.length){
				for(var i in this.partRequest){
					if (this.partRequest!=null){
						$('#'+this.partRequest[i].part).removeClass('partLoading').addClass('part');;
						this.partRequest[i].req.abort();
						
					}	
				}
				this.partRequest = new Array();
				
			}
		}
		this.scroll = function(element,timer){
			var self = this;
			var t;
			if (timer != false) {
				if ((t = this.isTimeout()) < 0) {
					return false;
				}else{
					clearTimeout(self.timeout);
					self.timeout = setTimeout(function(){
						self.scroll(element,false)	
					},this.delay*2);
					clearTimeout(self.timeoutF);
					self.timeoutF = setTimeout(function(){
						self.scroll(element,false)	
					},this.delayF*2);
					return;
				}
			}else{
//				clearTimeout(self.timeoutF);
//				clearTimeout(self.timeout);
			}
	//		this.partRequestClear();
	
			var list = this.findPart(element);
//			this.saveOffset(list);
			if (list && list.length!=0){
				for(var i in list){
//					console.log(i+':'+list[i].block.id);
					this.loadPart(list[i].id,list[i].block);
				}
			}else{
				this.saveOffset();
			}
		}
		
		this.findPart = function(element,all,indent){
			if ($(element).length!=1){
				return
			}
			this.yScroll= $(element).get(0).scrollTop;	
			var screenHeight = $(element).height();
			
			var eee = $('ul.list',element).get(0).style;
			
			
			if (this.yScroll == 0){
				var arr = /translate3d\(0px, -(\d*)/.exec(eee.cssText);
				if (arr && arr.length == 2){
					this.yScroll = parseInt(arr[1]);
				}
			}
			
			
			var id = /docList_(\d+)/.exec($(element).parent().attr('id'));
			if (id!=null && id.length==2){
				id=parseInt(id[1]);
			}
			var listPart; 
			if (all){
				listPart = $('ul > li',$(element));
			}else{
				listPart = $('ul > li.part',$(element));
			}
			var self=this;
			var h=0;
			var find=null;
			var res=null;
			var start=0;
			var stop=listPart.length+1;
			var step=Math.ceil(stop/2);
			
			while (step>0){
				part=step+start;
				res=this.isVisible(listPart.get(part-1),screenHeight,indent)
				if (res == 2){
					return null;
				}
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
			
			var result = new Array();
//			console.log(find+' - '+find);
			if (find!=null){
				for(var i=find; i<=listPart.length; i++){
					var block=listPart.get(i-1);
//					console.log('z1 - '+block.id+' - '+i);
					if (this.isVisible(block,screenHeight,indent)!=0){
						break;
					}
//					console.log('+');
					result.push({
						id:id,
						block:block
					});
				}				
			}
//			console.log(listPart.length);
			if (find!=null){
				for(var i=(find-1); i>=0; i--){
					var block=listPart.get(i-1);
//					console.log('z2 - '+block.id+' - '+i);
					if (this.isVisible(block,screenHeight,indent)!=0){
						break;
					}
//					console.log('+');
					result.push({
						id:id,
						block:block
					});
				}				
			}
//			dbg.msg('search part','lst');
			return result;
		}

		this.isVisible = function(element,screenHeight,indent){
			if (indent == null) {
				indent = this.indent;
			}
			if (screenHeight == null) {
				screenHeight = screen.height;
			}
			if (element && (element.offsetTop) < (this.yScroll + screenHeight + indent)) {
				if ((element.offsetTop + $(element).height()) > (this.yScroll - indent) && element.offsetTop>0){
					if ($('#'+element.id).length == 0){
						return 2;
					}
					return 0;						
				}
				return 1;						
			}
			return -1;						
		}
		
		
		this.saveOffset = function(){
			var scrollBlock = $('#docList_'+this.active+' .scroll');
			var time = (new Date()).getTime();
			if ((this.saveOffsetTimeout && (this.saveOffsetTimeout+800)<time)) return;
			this.saveOffsetTimeout = time;
			
		
			var list = this.findPart(scrollBlock,true,1);
			var min = -1;
			var n = null;
			for (var i in list){
				var arr = list[i].block.id.split('_');
				n = parseInt(arr[3])*kApp.listDocument.getActiveState().dpp+parseInt(arr[2]);
				if (min<0 || min>n){
					min = n;
				}
			}
			if (this.getActiveState()){
				this.getActiveState().current = n;
			}
		}
	
	
		this.openInNewWindow = function(nd, context){
			var url = 'd?nd='+nd;
			if(context){
				url += '&type=context';
				url += '&query=' + encodeURIComponent(context);
			}
			window.open(url);
		}
		
		this.rewriteHistory = function(){
			var self=this;
			var title;
			if ($('.headerList h1').length){
				title = $('.headerList h1').text();
			}else{
				title = msg.get('listDocumentDefTitle');
			}
			var currentState = this.getActiveState();
			link = new LinkHistory(title, null , function(){
				var params = self.main.utils.getUrlAllParam(currentState.url, true);
				params.part = 0;
				self.main.list.open(params, null, true);
			});
			this.linkHistory = this.main.history.rewrite(link);
		}
		this.openDoc = function(element,event,offset,nd){
//			dbg.msg(offset);
			
			var self = this;
			var stateId = null;
			var state = null;
			var mark = null;
			var prevdoc = null;
			var r = null;
		//	this.getActiveState.selectedElement = $('li.selected').prevAll('li.docItem').length
			var el = $(element)
			if ($('.li_tbl',el).length && nd == null){
				el.nextAll().removeClass('selected');
				el.prevAll().removeClass('selected');
				return;
			}

	
			if (this.getActiveState()){
				if (element.id) {
					var arr = utils.getId(element.id,'array');
					if (arr.length==3){
						this.getActiveState().currentItem = parseInt(arr[2])*this.getActiveState().dpp+parseInt(arr[1]);
					}
				}else{
					this.getActiveState().currentItem = $('li.selected').prevAll('li.docItem').length;
				}
				this.getActiveState().offset = offset;
				if (this.getActiveState().attr){
					for (var i in this.getActiveState().attr){
						if (this.getActiveState().attr[i].title == 'Наименование' || this.getActiveState().attr[i].title == 'По тексту' ){
							this.getActiveState().context = this.getActiveState().attr[i].value;
						}
					}
				}

			}
			var searchType = null;
			if ($('li.selected').length && $('#aSearch').length) {
				this.main.search.saveState();
				this.main.search.rewriteHistory();
				searchType = this.main.search.getStype();
			}else{
			//	if ($('.tabBody > div:hidden').length == 0){
					if (this.main.document.isReferentList()){
						this.main.document.referentListRewriteHistory();
					}else{
						this.main.document.saveState();
						this.main.document.rewriteHistory();
					}
			//	}
			}
			if (element.id){
				r = $(element).attr('r');
				var stateId = {
					listIndex: this.active
				};
				var arr = utils.getId(element.id,'array');
				var active = this.active;
				var state = this.getActiveState();
				
				if(typeof(state) == 'undefined')
					state = this.stateList;
					
				if (nd){
					arr[0] = nd;
					state.notCross = true; 
				}
				state.nd = parseInt(arr[0]);
				state.num = parseInt(arr[1]);
				state.part = parseInt(arr[2]);
				state.history = this.main.history.active;
				if (this.currentContext) {
					state.context = this.currentContext;
				}
				this.setActiveState(state);
			}else{
				var stateId = element;
				var state = this.stateList[stateId.listIndex];
			}
			mark = utils.getUrlParam(state.url,'mark')
			prevdoc = utils.getUrlParam(state.url,'nd')
		//			dbg.msg({stateId:stateId});
			
			if (searchType=='fjpanalyzer'){
				searchType='phrase';
			} else if(self.searchType && !searchType) {
				searchType = self.searchType;
				self.searchType = null;
			}else{
				searchType='context';
			}
			var context = state.context;
			if (state!=null && stateId!=null){
				var callback = null;
				if (state.context!=null){
					callback = function(){
							
							
							var after = function(){
								self.main.document.ready();
								$('.activeDoc .textSearch input').focus();
								self.main.document.textSearch.setType(searchType);
							}
							
							self.main.document.textSearch.open();				
							self.main.document.textSearch.setType(searchType);
							if (searchType=='phrase'){
								// callback, notleftpanel,context,cross){
								self.main.document.textSearch.setContext(context);
								self.main.document.textSearch.context = context;
								self.main.document.textSearch.findPhrase(after,null,context);
							}else{
								self.main.document.textSearch.setContext(context);
								self.main.document.textSearch.findContext((searchType=='strict' ? true : false),null,after,context);
							}
						self.main.document.ready();
					}
				}
				if (event && event.shiftKey && utils.allowNewWindow(state.nd)) {
					this.openInNewWindow(state.nd, this.main.search.getContext());
				}
				else{
					var params = el.attr('params');
					if (params!=null){
						params = params.split('&');
					}else{
						params = new Array();
					}
					
					if (mark){
						params.push('mark=' + mark);
						params.push('point=mark=' + mark);
					}
					if (prevdoc) {
						params.push('prevdoc=' + prevdoc);
					}
					if (r!=null && r!=""){
						params.push('r=' + r);
					}

					if (context!=null){
						params.push('context='+context);
						params.push('searchType='+searchType);
					}
					if(utils.getUrlParam(state.url,'find2') != null) {
						params.push('jpar='+utils.getUrlParam(state.url,'find2'));
					}
					self.main.document.open(state.nd, null, params, callback, stateId);
				}
			}
		}
		
		this.cross = function(event){
			var self = this;
			this.main.list.cross(
				event,
				$('.docList ul.list:visible').eq(0),
				function(element){
					$(element).click();
				},
				true
			);
		};

		this.setIcons = function(stateId){
			var state = this.stateList[stateId];
			if (state.notCross){
				return;
			}
			this.main.icons.add('prevDoc-'+stateId,'ico_prevDoc');
			this.main.icons.add('listDoc-'+stateId,'ico_listDoc');
			this.main.icons.add('nextDoc-'+stateId,'ico_nextDoc');
			if (state.num==0 && state.part==0){
				this.main.icons.disable('prevDoc-'+stateId);
			}
			if (state.part*state.dpp+state.num==state.sortedListSize-1){
				this.main.icons.disable('nextDoc-'+stateId);
			}
			return;
		}
		
		this.crossDoc = function(element,cross){
			var self = this;
			var id = utils.getId(element.id,null,'-');
			var state = this.stateList[id];
			if (cross == 'list') {
				this.main.history.go(state.history);
				return;
			}
			if (cross == 'prev'){
				if (state.num==0){
					if (state.part!=0){
						state.num=state.dpp-1;
						state.part--;
					}else{
						return;
					}
				}else{
					state.num--;
				}
			}
			if (cross == 'next') {
				if (state.num==state.dpp){
					if (Math.ceil(state.sortedListSize/state.dpp)> state.part){
						state.num=0;
						state.part++;
					}
				}else{
					if (state.part*state.dpp+state.num!=state.sortedListSize-1){
						state.num++;
					}else{
						return;
					}
				}
			}
			var url = state.url;
			if (state.filter){
				url+='&'+state.filter;	
			}
			url = utils.setUrlParam (url,'json','1') ;
			url = utils.setUrlParam (url,'part',state.part) ;
			
			var loc = utils.URLAttrParse(url);
			
			$.ajax({
				url: loc.location,
				type: 'GET',
				dataType : 'json',
				data:loc.attr,
				success: function (json){
					state.nd = json.list[state.num].nd;
					self.stateList[id]=state;
					self.openDoc({
						'listIndex' : id,
						'num' : state.dpp * state.part + state.num
					});
			//		state.currentItem = state.dpp*state.part+state.num;
				}
			});										
		}
		this.sort = function(element){
			if ($(element).hasClass('disabled')){
				return;
			}				
			var self = this;
			var urlParam = /\?([^?]*)/.exec(this.getActiveState().url);
			var sort = utils.getUrlParam(this.getActiveState().url, 'sort');
			var url = 'sortmenu?' + urlParam[1];
			if ($('#aSearch').length > 0){
				url = utils.setUrlParam(url, 'attribSearch', '1');
			}
			
			var loc = utils.URLAttrParse(url);
			if (urlParam.length==2){
				$.ajax({
					url: loc.location,
					type: 'GET',
					dataType : 'json',
					data:loc.attr,
					success: function (json){					
						var html = '';
						for(i in json) {
							if (sort==null && json[i].active) {
								sort = json[i].id;
							} 
							html += '<span class="menuCheck" /><p class="sortList" id="sortList_' + json[i].id + '" >' + json[i].text + '</p>';			
						}
						self.main.tooltip.create($(element), html, 1500000);
						var el = document.getElementById('sortList_' + sort);
						if (el.className.indexOf('active') == -1)
							el.className += ' active';
					}
				});
			}								
			return;
		}		
			
		this.sortList = function(element){				
			var self = this;
			this.getActiveState().url=utils.setUrlParam(this.getActiveState().url,'sort', utils.getId(element.id, 'str'));
			
			var callback = function(){
				$("div.searchInfo div.searchAttrs").html(self.main.search.resultListParams);
				self.main.progress.stop()
			}
			var list =  $('ul.list',$(element).parents().filter('.docList'));
			list.parent().addClass('progress');
			list.empty();
			$(element).parent().remove();
			this.reload(this.getActiveState().url,callback);
			return;
		}
		
		this.quickFilterKey = function(event){
			if (event.target && (event.target.id=='context' || event.target.id=='treeQuickFilter')){
				return false;
			}
			if ($('#dialog:visible').length>0){
				return true;
			}
			if (this.iContext && this.iContext.focus==true){
				return;
			}

//			dbg.msg(event.keyCode,'YO');
			if (this.main.iSearch.focus == false && $('.docList:visible').length>0 && $('#dialog:visible').length==0 && $('.quickFilter').length>0 ) {
				$('.quickFilter').focus();
			}
		}
		
		$(document).bind('keydown', 'up', function(event){			
			if ($('#dialog').length>0) return true;
			this.main.hotkeys.keyUpList();
		});
		$(document).bind('keydown', 'down', function(event){			
			if ($('#dialog').length>0) return true;
			this.main.hotkeys.keyDownList();
		});		
		
		this.quickFilter = function(event){
			var self = this;
			this.quickFilterTimeout();
			var list = $('#docList_'+this.active);
			var input = $('.quickFilter',list);
			var value = $('.quickFilterVal');
			value.html(input.val());
			if (input.val()==''){
				self.lastContext = '';
				return;
			}
			if (!value.is(':visible')){
				value.show('slow');
			}
			if (this.active!=null && this.stateList[this.active]!=null && list.length>0 && value.length>0){
				if (input.val() != this.quickFilterContext) {
					var context = this.quickFilterContext = input.val();
					var url = utils.setUrlParam(self.stateList[this.active].url,'context', this.quickFilterContext);
					if (this.quickFilterRequest!=null){
						this.quickFilterRequest.abort();
					}
					if (this.timeoutId!=null){
						clearTimeout(this.timeoutId);
					}
					this.timeoutId = setTimeout(function (){
					
					var loc = utils.URLAttrParse(url);
						self.quickFilterRequest = $.ajax({
						  	url: loc.location,
						    dataType : 'json',
							data:loc.attr,
							complete : function (){},
						    success: function (json) {
								this.quickFilterRequest=null;
								if (json.position!=null && json.position>=0){
						    		self.lastContext = context; 
									self.scrollToItem(json.position);						
									
						    	}else{
									self.quickFilterContext = null;
									value.html(self.lastContext);
									input.val(self.lastContext);								
								}
							}
						});		
					},600);		
				}else{
					value.html(self.lastContext);
					input.val(self.lastContext);
				}
			}
		}		
		this.scrollToItem = function(number,offset,noSelect){
			var self = this;
			var dpp = this.stateList[this.active].dpp;
			var size = this.stateList[this.active].sortedListSize;
			var part = Math.ceil((number+1)/dpp)-1;
			var num = number%dpp;
			var callback = function(){
				self.jump(part,num,offset,noSelect);
			}
			if (size/dpp<part && this.list.attr('crb') == null){
				self.list.attr('crb','true');
				callback = function(){
					self.scrollToItem(number,offset,noSelect);
				}
				part = Math.ceil(size/dpp)-1;
			}
			if ($('#part_'+part).length!=0){
				var additionalPart = part-1
				if (num>25 && part!=0){
					additionalPart = part+1
				}	
				additionalPart = $('#part_'+(additionalPart))		
				if (additionalPart.length>0){
					this.loadPart(this.active,additionalPart.get(0),callback)
				}
				this.loadPart(this.active,$('#part_'+part).get(0),callback)
			}else{
				callback();
				this.scroll($('.scroll',this.list).get(0),false)
			}
		}
		
		this.jump = function(part,num,offset,noSelect){
			var self = this;
			var re = /docItem_([\d]*)_([\d]*)_([\d]*)/;
			var match = null;
			var block = $('#docList_'+this.active+' .scroll');
			$('li.docItem', block).each(function (i) {
				match = re.exec(this.id);
				if (match && match.length==4 && num==parseInt(match[2]) && part==parseInt(match[3])){
				//	dbg.msg(match);		
					$('.docList ul.list .selected').removeClass('selected');
					if (noSelect==null){
						$(this).click();
					}
				//	block.scrollTo(this);
					if (offset && offset>0){
						offset = (this.offsetTop-block.get(0).offsetTop)-offset;
					}else{
						offset = this.offsetTop-block.get(0).offsetTop;
					}
//					dbg.msg('zzzz - START')
//					var onAfter = function(){;
//						dbg.msg('zzzz - STOP')
//						self.scroll($('.scroll',self.list).get(0),false);
//					}
//					block.scrollTo(
//						{top:offset+'px', left:'0px'},0,{onAfter:onAfter}
//					)
					block.scrollTo(
						{top:offset+'px', left:'0px'}
					)
			
				
				}
			});
		}
		this.quickFilterTimeout = function(stop){
			var self = this;
			clearTimeout(this.quickFilterTimer);
			if (stop==null) {
				this.quickFilterTimer = setInterval(function(){
					self.quickFilterEmpty();
				}, 15000);
			}
		}
		this.quickFilterEmpty = function(){
			$('.quickFilter').val('');
			$('.quickFilterVal').html('');
			$('.quickFilterVal').hide('slow');
		}
		this.isASearchList = function(){
			if ($('.tabBody:visible').hasClass('aSearchList')){
				return true;
			}
			return false;
		}
		this.setStyleList = function(){
			var body = $('.tabBody:visible');
//			if ($('.headerList',body).length>0){
//				body.addClass('hList');
//				return;
//			}
//			if ($('.return',body).length>0){
				body.addClass('aList');
//				return;
//			}
//			body.addClass('dList');
		}
			
		this.controlBlockInfoCntItem = function(action){
			var b1 = $('.docList .showInfoCntItem');
			var b2 = $('.docList .hideInfoCntItem, .docList .infoCntItem .txt');
			if (action){
				b1.hide();
				b2.show();
			}else{
				b2.hide();
				b1.show();
			}
			this.ctrlOffset();
		}	
		
		
		this.showCntInfo = function(cnt,el){
			if(this.main.listDocument.active != null) {
				if(cnt == 0) {
					var sel = $('.searchInfo:visible .info');
					sel.hide();
				} else {
					var sel = $('.searchInfo:visible .info');
					var temp = el[0].id;
					var id = utils.getId(temp, 'array');
					var bcnt = null;
					if (id && id.length == 3) bcnt = id[2];
					if (bcnt == null && el.attr('cnt')) bcnt = parseInt(el.attr('cnt'));

					var num = null;
					if (bcnt !== null) num = parseInt(this.main.listDocument.getActiveState().dpp*bcnt)+ parseInt(id[1]) + 1;
					var total = $('.total',sel);
					var val = $('.total .value',sel);
					if (cnt){
						sel.show();
						val.html(cnt);
					}else{
						total.hide();
					}
					var current = $('.current_num',sel);
					var val = $('.current_num .value',sel);
					if (el && el.length && num){
						current.show();	
						val.html(num);
					}else{
						current.hide();	
					}
					this.main.iSearch.controlToScroll();
				}
			}
		};
		
		this.clearFilter = function(){
			this.main.filter.clearFields();
		};
		
		this.getRealSizeDlg = function(el){
			var self = this;
			$.ajax({
				url: this.main.path.MSG_REALSIZE,
				dataType: "html",
				type: "get",
				success: function(html){
					self.main.tooltip.createSearchTooltip($(el), html, 1500, 'realSize', false, 3000);
					$('.realSize').show();
				}
			});
			return false;
		}
		
		
		
		this.getRealSize = function(el){
			var self = this;
			var url = this.getActiveState().url;
			var active = self.active;
			url = utils.setUrlParam(url,'realsize','1');	
			
			$('#docList_'+active+' .quest').remove();
			$('#docList_'+active+' .value').addClass('loading');

			var loc = utils.URLAttrParse(url);
		
			$.ajax({
				url: loc.location,
				dataType : "json",
				type : "get",
				data: loc.attr,
				success: function(json){
					$('#docList_'+active+' .value').removeClass('loading');
					$('#docList_'+active+' .count .value').html(json.sortedListSize);
				}
			});
			return false;
		}
		
		this.hack = function(str){
			if (this.main.tabs.getActiveTab().title=="На него ссылаются"){
				return utils.setUrlParam(str,'r',null)
			}
			return str;
		};	

		this.iContext.show = function(main){
			var form;
			if (this.listDocument.main.search.activeSearch == 1) {
			    form = $('.searchForm.generalTabForm');
			} else {
			    form = $('.searchForm:not(.generalTabForm)');
			}

			var iContext = $('.iContext', form);
			var searchAttrs = $('.searchAttrs');
			this.origInput = $('input',iContext);
			if ($('input',searchAttrs).length == 1){
				this.input.val(this.origInput.val());
				return;
			}
			if (iContext.length==1){
				searchAttrs.append('<div class="iContext">'+iContext.html()+'</div><div style="clear: both; float: none"> </div>');
			}
			var context = this.listDocument.getActiveState().context;
			if ( context && context!=this.origInput.val()){
				this.origInput.val(context);
			}
			this.input = $('input',searchAttrs);
			this.button = $('.button',searchAttrs);
			this.input.focus();
			this.input.val(this.origInput.val());
			this.setEvent();
			this.active(this.input.get(0));
		};
			
		this.iContext.setEvent = function(){
			var self=this;
			this.input.focus(function(){self.active(this);});	
			this.input.blur(function(){self.inactive(this);});	
			this.button.click(function(event){self.submit();});	
			this.input.keyup(function(event){self.keyup(event);});	
			$('.searchAttrs .iContext .clear').click(function(event){self.clear(event);});	
			
			
		};
		
		this.iContext.active = function(el){
			$(el).parent().addClass('active').removeClass('inputBlur');
			this.focus=true;
		}
		
		this.iContext.inactive = function(el){
			el = $(el);
			var parent  = el.parent()
			parent.removeClass('active');
			if ($(el).val()){
				parent.removeClass('active').addClass('inputBlur');
			}else{
				parent.removeClass('active').removeClass('inputBlur');
			}
			this.focus=false;
		}
		this.iContext.keyup = function(event){
			var val = this.input.val();
			if (event.which==13){
				this.submit();
			}else{
				this.origInput.val(val);
			}
			return;
		}
		this.iContext.clear = function(event){
			var self=this;
			this.input.val('');
			this.origInput.val('');
			this.inactive(this.input.get(0));
			this.submit();
		}
		this.iContext.submit = function() {		
			//вызываем заново поиск в СА, а не просто перегружаем список с новым урлом	
			this.listDocument.main.search.find(null, 0, null, true);
			// var inputValue = this.input.val();
			// var url = this.listDocument.getActiveState().url;
			// url = utils.setUrlParam(url,'icontext',inputValue);
			// this.listDocument.currentContext = inputValue;
			// this.listDocument.reload(url);
		}

		this.mobileScroll = function(){
			if (!window.mobile) return;
			if (this.iScroll && this.iScroll.length){
				for (var i in this.iScroll){
					var id = this.iScroll[i].listId;
					var el = $('#docList_'+id).length;
					if (el.length == 1){
						this.iScroll[i].iScroll.destroy();
						this.iScroll.splice(i,1);
					}
				}
			}else{
				this.iScroll = new Array();
			}
			
			this.iScroll.push({
				listId: this.active,
				iScroll: new iScroll($('#docList_'+this.active+' ul.list').get(0))
			});
		}		

		this.folderPut = function(el){
			var nd = utils.getId(el.id, 'array');
			var title = $('.title',el);
			if (nd!=null &&nd.length>0 && title.length>0){
				this.main.bookmarks.showFolderPutDialog(el,nd[0],title.text());
			}
		}
		
		this.setEvent();
	}

	
