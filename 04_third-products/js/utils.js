
function  Utils(main, urlPreffix){	
	this.main = main;
	this.urlPreffix = (urlPreffix == null)?'':"/"+urlPreffix+"/";

//	this.zzz = function(arr){
//		var tmp = 0;
//		var list = $('.partSize50 li');
//		list.each(function(i){
//			tmp+=$(this).height();
//		});	
//		dbg.msg(tmp/list.length);
//	}
	this.uniqueArray = function(arr){
		for (var i in arr){
			for (var j in arr) {
				if (arr[i]==arr[j] && i!=j){
					arr.splice(j,1);
					arr=this.uniqueArray(arr);					
					return arr;
				}
			}
		}	
		return arr;
	}
	this.progressOn = function(){
		//$('body').addClass('progress')
		this.main.progress.start();
	}
	this.progressOff = function(){
		//$('body').removeClass('progress')
		this.main.progress.stop();
	}
	this.intVal = function(str){
		var arr = /([-\d]*)/.exec(str);
		var res = null;
		if (arr && arr.length){
			try{
				res = parseInt(arr[0]);	
			}catch(e){
//		;		dbg.log(e)
			}
		}
		return res;
			
	}
	
	this.getId = function(name,type,separator){
		if (type==null){
			type='num';
		}
		
		if (separator==null){
			separator='_'
		}
		if (name){
			var arr = name.split(separator);
			if (arr == null) {
				return null;
			}
			if (arr.length==2 && type=='num'){
				return parseInt(arr[1]);
			}
			if (arr.length==2 && type=='str'){
				return arr[1];
			}
			if (arr.length>1 && type=='array'){
				return arr.slice(1,arr.length) 
			}
			return null;
		}
    }
    this.getNd = function (elemState) {
        var nd;
        nd = elemState.split(',')[0];
        nd = nd.split(':')[1];
        return nd;
    }
	this.getUrlAllParam = function(url, needobject){
		var re = new RegExp('([?|&])([^&]*)=([^&]*)', 'g')
		var res = Object();
		var m = null;
		var match;
		while((match= re.exec(url)) && match.length==4){
			
			while (m=(/([^=]*)=([^=]*)/.exec(match[2]))){
				match[2]=m[1];
				match[3]=m[2]+'='+match[3];
			}
			if (needobject) {
				res[match[2]] = match[3];
			}
			else {
				res.push(match[2] + '=' + match[3]);
			}
		}
		return res;
	}

	this.getUrlParam = function(url,key){
		pattern =new RegExp('([?|&])'+key+'=([^&]*)', 'g');
		var match = pattern.exec(url);
		if (match!=null && match.length==3){
			return match[2];
		}
		return null;
	}
	this.setUrlParam = function(url,key,value){		
//		if (value!=null){
//			value=escape(value)
//		}
//		console.log(value);
		url = url.replace(/[&|?]$/, '');
		pattern =new RegExp('([?|&])'+key+'=[^&]*', 'g');
		var match = pattern.exec(url);
		if(match){
			if (value!=null){
				url=url.replace(pattern, match[1]+key+'='+value);
			}else{
				url=url.replace(pattern, '');
			}
		}else{
			var separator='?';
			if (url && url.indexOf('?')>0){
				var separator='&';
			}

			if (value!=null){
				url+=separator+key+'='+value;
			}
		}
		return url;
	}
	this.setUrlParams = function(url, params, fromObject){
		if (params.length){
			for(var i in params){
				url=this.setUrlParam(url,params[i].key,params[i].value);
			}
		}else{
			if (params && fromObject){
				for (var key in params){
					url=this.setUrlParam(url, key, params[key]);
				}
			}else{
				url=this.setUrlParam(url,params.key,params.value)
			}
		}
		return url;
	}
	
	this.isLocal = function() {
		return window.isLocal;
	}

	this.isKBrowser = function() {
		var UAgent = navigator.userAgent.toLowerCase();
		if(UAgent.indexOf('kodeks') >= 0)
			return true;
		else
			return false;
	}
	
	this.isNumber = function (str) {
		var number = /[0-9]/;
		if (!number.test(str)) {
			return false;
		} else {
			return true;
		}
	}
	
	// Функция сравнения дат
	// date1 и date2 - строки, содержащие даты
	// Если функция возвращает true - то первая дата больше второй
	this.compareDate = function (date1_str, date2_str) {
		var date1 = new Date(date1_str.substr(6,10), date1_str.substr(3,5)-1, date1_str.substr(0,2), 0, 0, 0);
		var date2 = new Date(date2_str.substr(6,10), date2_str.substr(3,5)-1, date2_str.substr(0,2), 0, 0, 0);
		
		if (date1.getTime() > date2.getTime()) {
			return true;
		}
		
		return false;
	}
	
	this.getSelection = function() {
		var text = '';
		var selection = null;
		var node = null;
		var partId = null;
		
		if (window.getSelection) {
			selection = window.getSelection();
			text = selection.toString();
			if (text.length==0) {
				return null;
			};
			node = selection.anchorNode.parentNode;
			selection = selection.getRangeAt(0);
		} else {
			selection = document.selection.createRange();
			text = selection.text;
			if (text.length==0) {
				return null;
			};
			node = selection.parentElement();
		}
		if (node.nodeName=='P' && node.nodeName=='SPAN' && node.nodeName=='A') {
			if (node.nodeName!='P') {
				var parent = $(node).parent('P');
				if (parent.length == 0)
					return null;
				partId = parent[0].id;
			} else {
				partId = node.id;
			}

			selection = {
				'partId':partId,
				'name': text,
				'selection':selection
			};
		} else {
			selection = {
				'partId':node.id,
				'name': text,
				'selection':selection
			};
		}
		return selection;
	}
	
	this.getSelectedText = function() {
		var text = window.getSelection ? window.getSelection().toString() : document.selection.createRange().text;
		return (text!=''&&text!=null) ? '<HTML><HEAD></HEAD><BODY>' + text + '</BODY></HTML>' : null;
	};
	this.createSelection = function(field, start, end){
		// get a reference to the input element
		if (start != end) {
			if (field.createTextRange) {
				var selRange = field.createTextRange();
				selRange.collapse(true);
				selRange.moveStart("character", start);
				selRange.moveEnd("character", end);
				selRange.select();
			}
			else 
				if (field.setSelectionRange) {
					field.setSelectionRange(start, end);
					return;
				}
				else {
					if (field.selectionStart) {
						field.selectionStart = start;
						field.selectionEnd = end;
					}
				}
//			dbg.msg('focus');
			field.focus();
		}else{
//			dbg.msg('not focus');
	
		}
	};
	this.hideFlash = function(){
		$('object:visible').addClass('hideFlash');
	}
	this.showFlash = function(){
		$('object.hideFlash').removeClass('hideFlash');
	}
	this.clone = function(obj){
		if(obj == null || typeof(obj) != 'object')
			return obj;
		var temp = new obj.constructor();
		for(var key in obj)
			temp[key] = this.clone(obj[key]);
		return temp;
	}
	this.URLAttrParse = function(url, attr){
		var re = new RegExp("([^\?]*)\\?([^\n]*)", "g");
		var arr = re.exec(url);
		
		if (arr && arr.length==3){
			url = arr[1]
//			attr = arr[2];
			arr = arr[2].split('&');
			if (attr==null || typeof attr != 'object'){
				attr={};
			}
			for (var i in arr){
//				console.log(arr[i]);
				
//				arr[i] = /([^=]*(=mark)?)=([^=]*)?/.exec(arr[i]);
				arr[i] = /([^=]*)=([^&]*)?/.exec(arr[i]);
				
//				arr[i]=arr[i].split('=');
				if (arr[i] && arr[i].length==3){
					attr[arr[i][1]]=arr[i][2];
				}
			}
		}
		return {location:url,attr:attr};
	}
	this.escape = function(str){
		if ($.browser.safari){
			return str;
		}
		if ($.browser.msie){
			return escape(str);
		}
		
		return str;
	}
	
	this.getAppProperty = function(propName) {				
		var ret;
		$.ajax({
			url: this.urlPreffix+'urlutils',
			dataType : 'text',
			async : false,
			type : "get",
			data :  { appprop : propName },
			success: function (propValue) {
				ret = propValue;			
			}				
		});				
		return ret;
	}
	
	// init in conctructor
	this.productName = this.getAppProperty('ProductName');
	
	this.makeFullTitle = function(title) {
		title += ' - '  + this.productName;		
		return title;
    }
	this.strCrop = function(str,n){
		if (!(str && str.length)) return;
		if (n==null) n = 99;
		if (str.length>n){
			return str.substr(0,n)+'...';
		}
		return str;
	}
	
	this.allowNewWindow = function (nd) {
		if (window.isEda)
			return this.main.eda.allowNewWindow(nd);
		return true;
	}
	this.stopBubble = function(oEvent){
	       if(oEvent && oEvent.stopPropagation)
	               oEvent.stopPropagation();       // для DOM-совместимых браузеров
	       else
	               window.event.cancelBubble = true; //для IE
	}
	this.getSelectedText = function(){
		var selection;
		if (window.getSelection) {
			selection = window.getSelection();
		} else if (document.getSelection) {
			selection = document.getSelection();
		} else if(document.selection && document.selection.type != "None"){
			var ieRang = document.selection.createRange();
			selection = ieRang.text;
			return selection != '' ? selection : null;
		} else {
			return null;
		}
		
		if (selection) {
			return (selection.isCollapsed == true)? null : selection.toString();
		}
		
		return null;
	}

	this.getSelectedTextMarker = function(){

		var selection;
		var isIe8Selection;
		if (window.getSelection) {
			selection = window.getSelection();
		} else if (document.getSelection) {
			selection = document.getSelection();
		} else if(document.selection && document.selection.type != "None"){
			var ieRang = document.selection.createRange();
			selection = ieRang.text;
			if(selection == '')
				return null;
			isIe8Selection = true;
		} else {
			return null;
		}	
		if(selection != null){
			function fixIERangeObject(range) { //Only for IE8 and below.
				
				if(!range) return null;
				if(!range.startContainer && document.selection) { //IE8 and below
				
					var _findTextNode=function(parentElement,text) {
						var container=null,offset=-1;
						for(var node=parentElement.firstChild; node; node=node.nextSibling) {
							if(node.nodeType==3) {//Text node
								var find=node.nodeValue;
								var pos=text.indexOf(find);
								if(pos==0 && text!=find) { //text==find is a special case
									text=text.substring(find.length);
								} else {
									container=node;
									offset=text.length-1; //Offset to the last character of text. text[text.length-1] will give the last character.
									break;
								}
							}
						}
						return {node: container,offset: offset}; //nodeInfo
					}
				
					var rangeCopy1=range.duplicate(), rangeCopy2=range.duplicate(); //Create a copy
					var rangeObj1=range.duplicate(), rangeObj2=range.duplicate(); //More copies 
					rangeCopy1.collapse(true); //Go to beginning of the selection
					rangeCopy1.moveEnd('character', 1); //Select only the first character
					var needNextParent = false;
					if(rangeCopy1.htmlText == "<BR>" || rangeCopy1.htmlText == "" || rangeCopy1.htmlText == "br")
						needNextParent = true;
					rangeCopy2.collapse(false); //Go to the end of the selection
					rangeCopy2.moveStart('character', -1); //Select only the last character
					
					var parentElement1=rangeCopy1.parentElement(), parentElement2=rangeCopy2.parentElement();
					
					if(needNextParent == true){
						parentElement1 = parentElement1.nextSibling;
					}
					//If user clicks the input button without selecting text, then moveToElementText throws an error.
					if(parentElement1 instanceof HTMLInputElement || parentElement2 instanceof HTMLInputElement) {
						return null;
					}
					rangeObj1.moveToElementText(parentElement1); //Select all text of parentElement
					rangeObj1.setEndPoint('EndToEnd',rangeCopy1); //Set end point to the first character of the 'real' selection
					rangeObj2.moveToElementText(parentElement2);
					rangeObj2.setEndPoint('EndToEnd',rangeCopy2); //Set end point to the last character of the 'real' selection
					
					var text1=rangeObj1.text; //Now we get all text from parentElement's first character upto the real selection's first character	
					var text2=rangeObj2.text; //Here we get all text from parentElement's first character upto the real selection's last character
					
					var nodeInfo1=_findTextNode(parentElement1,text1);
					var nodeInfo2=_findTextNode(parentElement2,text2);
					
					range.startContainer=nodeInfo1.node;
					range.startOffset=nodeInfo1.offset;
					range.endContainer=nodeInfo2.node;
					range.endOffset=nodeInfo2.offset+1; //End offset comes 1 position after the last character of selection.
				}
				return range;
			}

			function getPforContainer(container){
				var p = $(container);
				var i = 0;
				if(p.is('p') == false){
					while(p.is('p') != true){
						if(container.parentNode != null){
							container = container.parentNode;
						} else {
							break;
						}
						p = $(container);
						if(i > 10){
							break;
						} else {
							i++;
						}
					}
				}
				return p;	
			}

			function selectP(p1, p2){
				 if ($.browser.msie) {			 	

					var range = document.body.createTextRange();
					range.moveToElementText(p1[0]);
					if(p2){
						var p2Elem = $(p2);
						var p1Elem = $(p1);
						var length_ = 0;
						while(p1Elem.next()[0] != p2Elem[0]){
							p1Elem = p1Elem.next();
							length_ += p1Elem.text().length;
						}

						range.moveEnd('character', p2Elem.text().length + length_);
					}
					range.select();

			    } else if ($.browser.mozilla || $.browser.opera) {
					var selection = window.getSelection();
					var range = document.createRange();

					range.selectNodeContents(p1[0]);
					//selection.removeAllRanges();
					selection.addRange(range);
					if(p2){
						var range2 = document.createRange();
						range2.selectNodeContents(p2[0]);
						selection.addRange(range2);
					}

			    } else if ($.browser.safari) {
					var selection = window.getSelection();
					selection.setBaseAndExtent(p1[0], 0, (p2 != null) ? p2[0] : p1[0], 500);					
			    }	
			}
			if(isIe8Selection == true){
				var range =  fixIERangeObject(document.selection.createRange());
			} else {
				var range = selection.getRangeAt(0);
			}

			if(range != null){
				var startContainer = (range.startContainer.nodeValue != null) ? range.startContainer : range.startContainer.nextElementSibling;
				var endContainer;				
				if(range.startContainer == range.endContainer){
					endContainer = null;
				} else if(range.startContainer.nodeValue == null && range.startContainer.nextElementSibling == range.endContainer){
					endContainer = null;
				} else if(range.startContainer.nodeValue == null && range.startContainer.nextElementSibling == range.endContainer.parentElement){
					endContainer = null;
				} else if(range.endContainer.nodeValue == "" || range.endContainer.nodeValue == "\n"){
					endContainer = null;
				} else {
					endContainer = range.endContainer;
				}

				var StartP = getPforContainer(startContainer);


				

				var EndP;
				if(endContainer != null){
					EndP = getPforContainer(endContainer);
					selectP(StartP, EndP);
				} else {
					selectP(StartP);
				}

				if(EndP && StartP.attr('id') == EndP.attr('id')){
					EndP = null;
					endContainer = null;
				}

				var markerStart;
				var prevStartP;

				if(StartP.is('p') == true){
					prevStartP = $(StartP).prev();
					var span = prevStartP.find('span.referent');
					if(span.length > 0){
						markerStart = span.attr('mark');
						if(markerStart == null || markerStart == ''){
							return null;
						}
					}
				}

				if(endContainer == null){
					return markerStart;	
				}

				var markerEnd;
				var prevEndP;

				if(EndP.is('p') == true){
					prevEndP = $(EndP).prev();
					var span = prevEndP.find('span.referent');
					if(span.length > 0){
						markerEnd = span.attr('mark');
					}
				}

				while(prevStartP.next()[0] != prevEndP[0]){
					prevStartP = prevStartP.next();
					var span = prevStartP.find('span.referent');
					if(span.length > 0){
						markerStart = (markerStart + '_' + span.attr('mark'));
					}
				}

				return(markerStart + '_' + markerEnd);
			}
		}
		return null;
	}

	this.checkIfFlashEnabled = function() { 
	   var isFlashEnabled = false; 
	   // Проверка для всех браузеров, кроме IE 
	   if (typeof(navigator.plugins)!="undefined" 
		   && typeof(navigator.plugins["Shockwave Flash"])=="object" 
	   ) { 
		  isFlashEnabled = true; 
	   } else if (typeof  window.ActiveXObject !=  "undefined") { 
		  // Проверка для IE 
		  try { 
			 if (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) { 
				isFlashEnabled = true; 
			 } 
		  } catch(e) {}; 
	   }; 
	   return isFlashEnabled; 
	} 
}
