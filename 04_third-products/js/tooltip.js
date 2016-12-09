function  Tooltip(main){	
	this.context=null;
	this.timeoutId=null;
	this.ajaxQuery = false;
	this.start=false;
	this.main=main;
	this.hintTooltips = new Array();
	this.afterClosing = new Array();
	this.lastTimeId = 0;
	this.request = null;

	this.init = function(){
		var self = this;
		$('.suggest li').live('mouseover',function(event) { self.select(this) });
		$('.suggest li').live('click',function(event) { self.choice(this) });
		
	}
	this.getContext = function(allwords){
		if (this.context==null){
			return '';
		}
		if(allwords != null)
			return this.context; 
		var context = this.context.split(' ');
		return context[context.length-1] 
	}
	// Для всплывающих подсказок к полям поиска
	this.setEvent = function(element,timer){		
		var self = this;
		var event = null;
		var eMouseover =  function(e){
			//dbg.msg('UNBIND');
			$("body").unbind("click", event);
			clearTimeout(self.timeoutId);
//			dbg.msg('TimeOutId(over): '+self.timeoutId);
		}
		
		var eMouseout =function(e){
			//dbg.msg('BIND');
			$("body").bind("click", event);
			if (timer!=null){
				clearTimeout(self.timeoutId);
				//dbg.msg('TimeOutId(out-clr): '+self.timeoutId);
				self.timeoutId = setTimeout(event,timer);
				//dbg.msg('TimeOutId(out-set): '+self.timeoutId);
			} else {
				clearTimeout(self.timeoutId);
				//dbg.msg('TimeOutId(out-clr): '+self.timeoutId);
			}
		};
		
		event = function(){
			self.hideSuggest();
			element.unbind("mouseenter", eMouseover);
			element.unbind("mouseleave", eMouseout);
			$("body").unbind("click", event);
		};

				
		element.bind("mouseenter", eMouseover);	// Мышь в тултипе	
		
		element.bind("mouseleave", eMouseout);	// Мышь вне тултипа
		
		//dbg.msg('BIND');
		$("body").bind("click", event);
	}
	
	this.setEventHint = function(element, timer, parentSetEvent){
		var self = this;
		var event = true;
		var id_tooltip = $(element).attr('id');

		// Получаем таймер из массива по идшнику
		function getTimerFromArr(id) {
			for (var cnt in self.hintTooltips) {
				if (self.hintTooltips[cnt].id == id) return self.hintTooltips[cnt].timer;
			}
			return null;
		}
		
		// Устанавливаем таймер в массив по идшнику
		function setTimerInArray(id, timer_elem) {
			for (var cnt in self.hintTooltips) {
				if (self.hintTooltips[cnt].id == id) return self.hintTooltips[cnt].timer = timer_elem;
			}
		}		
		
		// Событие на наведение мышки на элемент
		var eMouseover = function(e){
			$("body").unbind("click", event);
			clearTimeout(getTimerFromArr(id_tooltip));
		}
		var eMouseout = function(e){
//			dbg.msg('eMouseout');
			if ($('.tooltip:visible').length) {
				$("body").bind("click", event);
				clearTimeout(getTimerFromArr(id_tooltip));
				var timer_id = setTimeout(event,timer);
				setTimerInArray(id_tooltip, timer_id);
			} else {
				clearTimeout(getTimerFromArr(id_tooltip));
			}
		};
		
		event = function(){
			setTimeout(function(){
				//console.log('! ! !');
				self.killHint(id_tooltip, getTimerFromArr(id_tooltip));
				element.unbind("mouseover", eMouseover);
				element.unbind("mouseout", eMouseout);
				if (parentSetEvent) {
					parentSetEvent.unbind("mouseover", eMouseover);
					parentSetEvent.unbind("mouseout", eMouseout);
				}
				$("body").unbind("click", event);
			},200);
					
		};
		
		element.bind("mouseover", eMouseover);	// Мышь в тултипе			
		element.bind("mouseout", eMouseout);	// Мышь вне тултипа
		
		if (parentSetEvent) {
			parentSetEvent.bind("mouseover", eMouseover);
			parentSetEvent.bind("mouseout", eMouseout);
		}	
		if (parentSetEvent==null){
			$("body").bind("click", event	);
		}
		
	}

	this.suggest = function (event, input, url, above, allwords, setAutoCompile) {
	    var self = this;
	    var input = $(input);
	    //dbg.msg('key code'+event.keyCode);
	    if (event.keyCode == 38 || event.keyCode == 40) {
	        return;
	    };
	    if (event.keyCode == 13) {
	        this.breakRequest();
	        return;
	    };
		
		input.removeAttr('check');
	    //this.reset();
	    var killSuggest = true;
	    var inputId = input.attr('id');
	    if (input.val().length == 1) {
	        if (inputId == 'context' || inputId == 'context2' || input.hasClass("number")) {
	            if (isNaN(parseInt(input.val())) == false) {
	                killSuggest = false;
	            }
	        }
	    }
	    //console.log('?');
	    if (input.val().length < 2 || input.hasClass('noSuggest') || input.val() == '' || input.val() == input.attr('default')) {
		    //console.log('--');
	        if (killSuggest != false) {
	            this.killSuggest();
	            clearTimeout(this.timeoutId);
	            return;
	        }
	    }
	    self.ajaxQuery = true;
	
	    this.timeoutId = setTimeout(function () {
	        if (self.context != input.val() && url) {
	            self.context = input.val();

	            var data;
	            if (input.hasClass("number")) {
					data = { word: self.getContext(true) };
	                data.as_is = true;
	            } else {
					data = { word: self.getContext(allwords) };
				}	

	            self.breakRequest();
	            self.request = $.ajax({
	                url: url,
	                dataType: "html",
	                data: data,
	                type: "get",
	                complete: function () { },
	                success: function (html) {
	                    if (self.ajaxQuery) {
						    self.killSuggest();
	                    }
						console.log(self.context,self.ajaxQuery);
	                    if (html != '' && html != '<ul></ul>') {
	                        if (self.ajaxQuery) {
	                            self.setSuggest(input, html, above);
	                            self.ajaxQuery = false;
	                            if (setAutoCompile) {
	                                if (!/[0-9a-zA-Z]/.test(String.fromCharCode(event.which)) && event.which != 219 && event.which != 221 && event.which != 222 && event.which != 59 && event.which != 190 && event.which != 188) {
	                                    return;
	                                }
	                                var currLen = 0;
	                                var tmpString;
	                                var str;
	                                var hint = $('.suggest ul');
	                                currLen = $(event.target).val().length;
	                                var jElList=$('li:eq(0)', hint);
	                                if (jElList.length == 1 && !jElList.attr('thesitem') && !jElList.attr('doclink')  ){
										tmpString = $('li:eq(0)', hint).text().substring(currLen, jElList.text().length);
										tmpString = /[^\s]*/.exec(tmpString)[0];
										str = $(event.target).val();
										if (tmpString != null && tmpString.length > 0) {
											$(event.target).val(str + tmpString);
										}
										utils.createSelection(event.target, str.length, $(event.target).val().length);
		                           }
	                            }
	                        }
	                    } else {
	                        if (input.hasClass('classificator')) {
	                            input.css('color', 'red');
	                        }
	                    }
	                },
	                error: function () {
	                    self.ajaxQuery = false;
	                }
	            });
	        }
	    }, 300);
	}
	this.breakRequest = function(){
		//dbg.msg('breakRequest');
		if(this.request && this.request.abort){
			//dbg.msg('!! breakRequest');
			this.request.abort();
			this.ajaxQuery = true;
		}	
	}
	this.ctrlSuggest = function(key,input,action,type){
		var input=$(input);
		var hiddenInput = input.next();
		var self = this;
		switch (key.keyCode) {
			case 40:{
					if ($('.suggest li').length) {
						key.preventDefault();
						var current =  $('.suggest li.selected');
						if(current.next().is('hr') || current.next().hasClass('searchDocsHeader'))
							var next = current.next().next('li');
						else
							var next = current.next('li');
						$('.suggest li.selected').removeClass('selected');
						if (next.length == 0) {
							next = $('.suggest li:first');
						}
						next.addClass('selected');
						var suggest = $('.suggest');
						var height = parseInt(suggest.height())
						
						var site = parseInt(next.get(0).offsetTop) + parseInt(next.height());
						var scroll = site - height + 15;
						if (scroll > 0) {
							if (suggest.get(0).scrollTop+height<site){
								suggest.scrollTo(scroll);
							}
						} else {
							suggest.scrollTo(0);
						}							
					}
				break;
			}
			case 13:{
				
				if(type == 'textSearch'){
					if(self.main.document.textSearch.isLastSearch() == true){
						var elem = $('.textSearch .cross .next');
	      				if (elem.length > 0) {
	        				self.main.document.textSearch.nextMatch(true);
							break;
	       				}
					}
				}
				
				var select = $('.suggest li.selected',input.parent())
				
				if (select.length==0){
					select.removeClass('selected');
					if (action){
						this.hideSuggest();
						clearTimeout(self.timeoutId);
						action();
						return;
					}
				}
				
				var item = $('.suggest li.selected');
				
				if (item.length!=0){
					var textVal = item.text();
					
					if (input.hasClass('classificator')
						  || input.attr('id')=='context' || input.attr('id')=='context2'
						  || (item.hasClass("history")) || (input.hasClass("number"))) {
					//	input.val(textVal);
						var run = item.data('run');
						if ($.isFunction(run)) run(item,input); 
					} else {
						var val = input.val();
						if (val.trim){
							val = val.trim();
						}
						val = val.split(' ');
						val[val.length-1] = this.cutEnding(textVal);
						input.val(val.join(' '));
					}
					
					hiddenInput.val(item.attr('id')+'?'+'or'+'?'+textVal);
				}
				
				//this.hideSuggest();
				this.reset();
				return true;		
				break;
			}
			case 38:{
					if ($('.suggest li').length) {
						key.preventDefault();
						var current =  $('.suggest li.selected');
						if(current.prev().is('hr') || current.prev().hasClass('searchDocsHeader'))
							var prev = current.prev().prev('li');
						else
							var prev = current.prev('li');
						$('.suggest li.selected').removeClass('selected');
						if (prev.length == 0) {
							prev = $('.suggest li:last');
						}
						prev.addClass('selected');
						var suggest = $('.suggest');
						var height = parseInt(suggest.height())
						var site = parseInt(prev.get(0).offsetTop);
						var scrollTop = parseInt(suggest.get(0).scrollTop)
						var scroll = scrollTop + (site - height);
						if (site < scrollTop) {
							suggest.scrollTo(site);
						} else {
							if (site - (height + scrollTop) > 0) {
								suggest.scrollTo(prev);
							}
						}
					}
				break;
			}
			case 37:{
				if(type == 'textSearch'){
					if (key.ctrlKey){
						var elem = $('.textSearch .cross .prev');
	       				if (elem.length > 0) {
	            			self.main.document.textSearch.prevMatch(true);
	        			}
					}
					break;	
				}				
			}
			case 39:{
				if(type == 'textSearch'){
					if (key.ctrlKey){
	       				var elem = $('.textSearch .cross .next');
	      				if (elem.length > 0) {
	        			    self.main.document.textSearch.nextMatch(true);
	       				}
					}
					break;	
				}				
			}
			
		}	
			
		return false;		
	}
	this.select = function(eliment){
		$('.suggest li.selected').removeClass('selected');
		$(eliment).addClass('selected');
	}
	this.choice = function(element){
		var jqElem = $(element);
		var input = $('input',jqElem.parent().parent().parent());
		var hiddenInput = input.next();
		var selectVal = jqElem.text();
		
		if (input.hasClass('classificator')
			  || (input.attr('id')=='context') || (input.attr('id')=='context2')
			  || jqElem.hasClass("history") || input.hasClass("number")) {
		//	input.val(selectVal);
			var run = jqElem.data('run');
			if ($.isFunction(run)) run(jqElem,input); 
	//		hiddenInput.val(jqElem.attr('id')+'?'+'or'+'?'+selectVal);
	//		input.css('color', 'black');
	//		this.checkClassificatorValue()r;
		} else {
		//	input.val(this.cutEnding(selectVal));
		
			var val = input.val();
			
			val = val.split(' ');
			val[val.length-1] = this.cutEnding(selectVal);
			input.val(val.join(' '));
			input.focus();
//			input.val(selectVal);
		}
		this.hideSuggest();
	}
	this.setSuggest = function(input,html, above){
		var self = this;
		var rand=Math.round(Math.random() * (1000 - 100) + 100);
		var inputWidth = ( input.attr('name')=='iSearch' )? 10 : 30 ; // для правильного отображения всплывающей подсказки
		var width = parseInt(input.width()) - 3;
		var widthStandard = 500;
		if(input.attr('id') != 'context' && input.attr('id') != 'context2'){
			widthStandard = 300;
		}
		var minWidth = (width < widthStandard) ? widthStandard : width;
		var maxWidth = minWidth;
		var isTight = input.parents('.tight');
		if(input.attr('id') == "context"){
			if(isTight.length > 0){
				var left = (width < 340) ? (340 - width) * (-1) : 0;
			} else {				
				var left = (width < 140) ? (140 - width) * (-1) : 0;
			}
		} else {
			if(isTight.length > 0){
				var left = (width < 300) ? (300 - width) * (-1) : 0;
			} else {				
				var left = (width < 80) ? (80 - width) * (-1) : 0;
			}
		}
		//console.log('input width:', width);
		input.parent().prepend('<div id="suggest_'+rand+'" style="min-width:' + minWidth + 'px; max-width:' + maxWidth +'px; margin-left:' + left + 'px;" class="suggest '+(above != null? 'suggestAbove' : '' )+'">'+html+'</div>');	
		
		self.remakeList(rand);

		$('li',input.parent()).data('run',function(el,input){
			self.main.iSearch.selSuggest(el,input);
		})

		if(input)

		var block = $('#suggest_'+rand);

		if (block.length == 0){
			setTimeout(function(){
				self.setSuggestStyle(input, html, above, rand);
			},300);
		}else{
			self.setSuggestStyle(input, html, above, rand);
		}
//		var li = $('.suggest li', input.parent()).eq(0);
//		if (li.length>0){
//			var word = li.html();
//			var len = input.val().length;
//			word.substring(len)
//			input.val(word);
//			utils.createSelection(input.get(0),len,word.length);
//		}
	}
	this.addchapli = function(docli, before){

		var doc = $(docli);

		if(doc.length == 0) return;

		var refchapname = $('.refchapname', doc);

		if(refchapname.length == 0) return;

		var liHtml = '<li class="searchDoc chapSearchDoc" style="text-transform: none" doclink="' + doc.attr("doclink") + '"chapter="' + doc.attr("chapter") + '">';
		liHtml += '<span class="refchapname">' + refchapname.text() + '</span>';
		liHtml += '</li>';


		if(before != true){
			doc.after(liHtml);
			doc.removeAttr("chapter");
			refchapname.remove();
		} else {
			doc.before(liHtml);
			doc.remove();
		}

	}

	this.remakeList = function(rand){
		var self = this;
		var block = $('#suggest_'+rand);
		if (block.length == 0) return;
		var docs = $('li.searchDoc', block);
		if(docs.length == 0) return;
		self.addchapli(docs[0], false);
		for (var i = 1; i < docs.length; i++) {
			var doc_1 = $(docs[i-1]);
			var doc_2 = $(docs[i]);
			var refdocname_1 = $('.refdocname', doc_1);
			var refdocname_2 = $('.refdocname', doc_2);
			self.addchapli(doc_1, false);
			if(refdocname_1.text() == refdocname_2.text()){
				self.addchapli(doc_2, true);
				docs.splice(i, 1);
				i--;
			} else if(i == docs.length - 1){
				self.addchapli(doc_2, false);
			}
		};
	}

	this.setSuggestStyle = function(input, html, above, rand){
		var block = $('#suggest_'+rand);
		if (block.length==0) return;
		if (above!=null){
			var li = $('li',block);
			var height = 20;
			if ($.browser.msie){
				height = 22 * (li.length==0 ? 1 : li.length );
				block.height(height+'px');
				li.css('white-space','nowrap');
			}else{
				height = block.height();
			}
			block.css('margin-top', ((height-2)*-1)+'px');
		}
		
		this.setEvent(block);	
		this.show(block);
		var margin = input.get(0).offsetLeft-block.get(0).offsetLeft;
		//block.css('margin-left', margin+'px');
		if (!$.browser.msie && above!=null) {
			block.css('margin-top', ((block.height() - 2) * -1) + 'px');
		}
		if ( input.hasClass('classificator') ) {
			input.css('color', 'black');
		}

	}
	this.annotationVisiblePercentage = function(annotation, scrollableArea) {
		// приблизительно расчитывает процент видимой области тултипа с аннотацией.
		//Первый параметр - jquery объект тултипа
		//Второй параметр - jquery объект скроллируемой области
		if (!(scrollableArea && scrollableArea.length)) return 100
		var element = annotation.parent().parent().get(0);
		var element = annotation.parent().parent().get(0);
		var offset = element.offsetTop-scrollableArea.get(0).scrollTop;
//		var offset = this.main.list.offsetTop(element, scrollableArea);
		var bottomBorder = offset
			+ parseInt(/\d+/.exec(annotation.css('margin-top'))[0])
			+ parseInt(/\d+/.exec(annotation.height())[0])
			+ parseInt(/\d+/.exec(annotation.parent().css('padding-top'))[0])
			+ parseInt(/\d+/.exec(annotation.css('border-bottom-width'))[0])
			+ parseInt(/\d+/.exec(annotation.css('border-top-width'))[0]);
		if (bottomBorder < scrollableArea.height()){
			return 100;
		}
		var res = Math.ceil(100-(Math.abs(bottomBorder) - scrollableArea.height()) / annotation.height() * 100) 
		//console.log("annotationVisiblePercentage:"+res+"%");
		return res;
	}
	
	this.dropUpAnnotation = function(annotation) {
		var annotationTop  = 0;
		try{
			annotationTop = parseInt(/\d+/.exec(annotation.css('top'))[0]);
		}catch(e){
			annotationTop  = 0;
		}
		annotation.css('top', annotationTop
				- annotation.height()
				- parseInt(/\d+/.exec(annotation.css('padding-top'))[0])
				- parseInt(/\d+/.exec(annotation.css('margin-top'))[0])
				- parseInt(/\d+/.exec(annotation.css('border-top-width'))[0])
				+'px');
	}
	
	this.create = function (parent, html, timer, className, prepend, delay, parentSetEvent, after, onShow) {
		var self = this;
		this.killSuggest();

		if (!className) {
			className = '';
		}
		var rand=Math.round(Math.random() * (1000 - 100) + 100);
		var html='<div id="tooltip_'+rand+'"  class="tooltip '+className+'" style="display:none;">'+html+'</div>';
		if (prepend==true){
			parent.prepend(html);	
		}else{
			parent.append(html);	
		}
	
		if (this.start!=true && (className=='contextEmpty' || className=='asearchTooltip'|| className=='ssearchTooltip' )){
			return;
		}
		var toolbox = $('#tooltip_'+rand);

		this.setEventHint(toolbox,timer, parentSetEvent);		
		if (after!=null){
			this.afterClosing[rand] = function(){
				after();	
			}
		}
		//срабатывает create, не доходит до mouseout (или mouseout срабатывает до create)
		if (delay == null) {
			var elemArr = {'id': 'tooltip_'+rand, 'timer':null};
			self.show($('#tooltip_' + rand));
			try {
				var visiblePercent = this.annotationVisiblePercentage($('.tooltip:visible'), $('.scroll:visible'));
			}catch(e){
				visiblePercent = 100;	
			}
			if ((visiblePercent < 80) && (this.enoughPlace())){
				this.dropUpAnnotation($('.tooltip:visible'));
			}
			//dbg.msg('Visible area = '+visiblePercent);
			if (onShow != null)
				onShow($('#tooltip_' + rand));
		}
		else {
			var time_id = setTimeout(function(){
				self.show($('#tooltip_' + rand));
				if (onShow != null)
					onShow($('#tooltip_' + rand));
			}, delay);
			var elemArr = {'id': 'tooltip_'+rand, 'timer':time_id};
		}
		this.lastTimeId = time_id;
		self.hintTooltips.push(elemArr); // Создаем элемент

		height = toolbox.height();
		if (toolbox.length) scrollHeight = toolbox.get(0).scrollHeight;
		
		toolbox.bind('mousewheel', function(e, d) {
			console.log('>>>>');
			if((this.scrollTop === (scrollHeight - height - 20) && d < 0) || (this.scrollTop === 0 && d > 0)) {
				e.preventDefault();
			}
			console.log('this.scrollTop: '+this.scrollTop+'| scrollHeight - height: '+(scrollHeight - height))
		});

		
		return $('#tooltip_'+rand);
	}
	
	this.enoughPlace = function(){
		var islOffset = $('.iSearchList:visible').offset();
		return $('.tooltip:visible').offset().top - (islOffset != null ? islOffset.top : 0) > $('.tooltip:visible').height();
	}
	
	this.clearLastTimer = function(){
		clearTimeout(this.lastTimeId);
		//dbg.msg('lastTimer: '+this.lastTimeId);
	}

	this.createSearchTooltip = function(parent, html, timer, className, prepend, delay, parentSetEvent, after, onShow) {
		var self = this;
		return self.create(parent, html, timer, className, prepend, delay, parentSetEvent, after, onShow);
	}

	this.show = function(elem) {
		elem.css('display', 'block');
	}
	
	this.setCenter = function(elem) {
		var html = $('html');
		var width = html.width();
		var height = html.height();
		
		setLeft = width/2 - elem.width()/2;
		setTop = height/2 - elem.height()/2;
		
		elem.css('position', 'absolute');
		elem.css('left', setLeft);	
		elem.css('top', setTop);	
	}
	
	// Скрывание с таймаутом для того чтобы успелось выбраться значение
	this.hideSuggest = function(input,html){
		setTimeout(function(){
			$('.suggest').remove();	
			$('.tooltip').not('.iSearchWarning').remove();	
			$("body").unbind("click",this.hideSuggest);
		}, 50);	
	}
	
	// Убивание без таймаута
	this.killSuggest = function(){
		$('.suggest').remove();	
		$('.tooltip').remove();	
//		dbg.msg('tooltipSuggest');
		$("body").unbind("click",this.hideSuggest);
	}
	
	// Убивание подсказки к кнопкам поиска
	this.killHint = function(id, timer){
//		dbg.msg('tooltipkillHint '+id+' - '+timer);
		$('#'+id).remove();	
		if (timer) clearTimeout(timer);
		if (id) {
			id = utils.getId(id);
			if (this.afterClosing[id]) {
				this.afterClosing[id]();
			}
		}
	}
	
	// Убиваем все тултипы и очищаем таймауты
	this.reset = function() {
		//console.log('reset');
		this.ajaxQuery = false;
		clearInterval(this.timeoutId);
//		dbg.msg('tooltipRemove');
		$('.statInfo').hide();
		$('.tooltip').remove();	
		$('.suggest').remove();	
		$('.settingsDialog').remove();
	}
	
	// Проверка - если поле классификатор то нужно выполнить дополнительную проверку
	// после вставки значения из тултипа
	this.checkClassificatorValue = function() {
		this.main.search.isEmpty();
	}
	
	// Функция которая вырезает текст до скобок
	// Нужна для отпиливания окончаний в скобках в подсказках при подстановке
	this.cutEnding = function (str) {
		var re = new RegExp("([^\(\)]*)", "ig");
		var result = str.match(re);
		return jQuery.trim(result[0]);
	}
	
	
	this.init();
}
