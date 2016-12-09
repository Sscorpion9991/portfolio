function  Djvu(document){

	this.document = document;
	this.src = null;
	this.numPage = null;
	this.page = null;
	this.events=null;
	this.scale=null;
	this.width=null;
	this.height=null;
	this.buttonNext=null;
	this.buttonPrev=null;
	this.searchRes=null;
	this.firstLoad = true;
	this.flag = true;
	
	this.setEvent = function(){
		var self = this;
		if (key!=null && typeof(key)=='function'){
			key('ctrl+right', function(event, handler){
				if (self.isDjvu())	self.setPageDocument('next');
			});			
			key('ctrl+left', function (event, handler) {
				if (self.isDjvu()) self.setPageDocument('prev');
			});
		}
		$('.activeDoc .textSearch .prevAvailable:visible').live('click',function(){self.setPrevMatchPageDocument();});
		$('.activeDoc .textSearch .nextAvailable:visible').live('click',function(){self.setNextMatchPageDocument();});
	}
	
	this.init  = function() {
		var self = this;
		$('.panelDjvu .prev').unbind('click');
		$('.panelDjvu .next').unbind('click');
		$('.activeDoc .textSearch .prevAvailable').unbind('click');
		$('.activeDoc .textSearch .nextAvailable').unbind('click');
		
		$('.panelDjvu .selectPage select').unbind('change');
		
    	$('.panelDjvu .prev').click(function(){self.setPageDocument('prev');});
		$('.panelDjvu .next').click(function(){self.setPageDocument('next');});

		//$('.panelDjvu .value input').live('change',function(){return self.setPageDocument($(this).val());});
		$('.panelDjvu .scale select').change(function(){return  self.setScaleDocument($(this).val());});
		if (window.mobile){
			$('.panelDjvu .scale').hide();
		}
		//очередной костылек для ie8
		if ($.browser.msie && $.browser.version <= 8) {
			$('.text .djvu').unbind('click.blur');
			$('.text .djvu').bind('click.blur', function(){$('.panelDjvu .scale select').blur(); $('.panelDjvu .selectPage select').blur();});
		};

		$('.panelDjvu .selectPage select').change(function(){return self.setPageDocument($('option:selected', this).text()); });
		//$('.activeDoc img.djvu').load(function(){ document.ready() });
		//$('.activeDoc img.djvu').load(function(){ $(this).show() });
		$('.activeDoc img.djvu').bind('load', function(){
			self.ctrlOffset();
		});
		
		
		self.src=null;
		self.numPage=null;
		self.page=null;
		var img=$('.activeDoc img.djvu');
		if (img.length>0){
			img.error(function(e){
				self.error(e);	
			});
		
			var tabBody = img.parents().find('.tabBody');
			if (tabBody.hasClass('url')){
				tabBody.removeClass('url').addClass('djvu');
			}
			params=img.attr('id').split('_');
			self.numPage=parseInt(params[1]);
			self.src=img.attr('url');
			self.imagePageOption();
			if(self.src.indexOf('page')> -1) {
				var page = self.src.split('page=')[1];
				self.setPage(parseInt(page));
			} else {
				self.setPage(parseInt(params[2]));
			}
			$('.activeDoc .panelDjvu .cnt').html(self.numPage);
			self.setButtonPaginator();
			self.scale = 1;
			self.setSize();
			self.setScaleDocument('0');
			//$('.panelDjvu .scale select option').eq(4).attr('selected','true');
		}
	};

	
	this.changeTab = function(){
		var img = $('.activeDoc img.djvu');
//		var scale = utils.getUrlParam(img.attr('src'),'scale');
//		if (scale != null) {
//			this.scale = scale;	
			this.width = parseInt( img.attr('w') ) ;
			this.height = parseInt( img.attr('h') ) ;
//		}
	}
	
	this.setSize = function(){
		var img = $('.activeDoc img.djvu');
//		var scale = utils.getUrlParam(img.attr('src'),'scale');
//		var width = img.attr('w');
//		var height = img.attr('h');
	//	if (scale!=null){
	//		this.scale = scale;
	//		width = Math.round(width/scale);
	//		height = Math.round(height/scale);
	//		return;
	//	}
		this.width = parseInt( img.attr('w') ) ;
		this.height = parseInt( img.attr('h') ) ;
//		dbg.msg({height:height,width:width});
	};

	this.getRatio = function(){
		var img = $('.activeDoc img.djvu');

		if (img.length > 0) return img[0].width / img[0].height;			
		else                return 1;
	};
	
	this.setButtonPaginator = function(){		

		var sel = $('.panelDjvu .selectPage select:visible');
		
		if($('option:selected', sel).length) this.page = parseInt($('option:selected', sel).text()) - 1;

		if (this.page < 1){
			$('.activeDoc .panelDjvu .prev:visible').addClass('disabled');	
		}else{
			$('.activeDoc .panelDjvu .prev:visible').removeClass('disabled');	
		}
		if (this.page >= this.numPage - 1){
			$('.activeDoc .panelDjvu .next:visible').addClass('disabled');	
		}else{
			$('.activeDoc .panelDjvu .next:visible').removeClass('disabled');	
		}
		
	}
	this.setSearchResultButtonPaginator = function(searchRes){
		if(searchRes && searchRes.length > 0) {
			var sel = $('.panelDjvu .selectPage select:visible');
			var max = searchRes[searchRes.length-1];
			var min = searchRes[0];
	
			if($('option:selected', sel).length) this.page = parseInt($('option:selected', sel).text()) - 1;
			if (this.page > min){
				$('.activeDoc .textSearch .prevDisable:visible').addClass('prevAvailable').removeClass('prevDisable');
//				$('.activeDoc .textSearch .prevAvailable:visible').live('click',function(){self.setPrevMatchPageDocument();});
			}else{
				$('.activeDoc .textSearch .prevAvailable').unbind('click');
				$('.activeDoc .textSearch .prevAvailable:visible').removeClass('prevAvailable').addClass('prevDisable');
			}
			if (max > this.page){
//				$('.activeDoc .textSearch .nextAvailable:visible').live('click',function(){self.setNextMatchPageDocument();});
				$('.activeDoc .textSearch .nextDisable:visible').addClass('nextAvailable').removeClass('nextDisable');
			}else{
				$('.activeDoc .textSearch .nextAvailable').unbind('click');
				$('.activeDoc .textSearch .nextAvailable:visible').removeClass('nextAvailable').addClass('nextDisable');
			}
		} else {
			$('.activeDoc .textSearch .prevAvailable:visible').removeClass('prevAvailable').addClass('prevDisable');
			$('.activeDoc .textSearch .nextAvailable:visible').removeClass('nextAvailable').addClass('nextDisable');
		}
		
	}
	this.isDjvu = function(p){
		if ($('.tabBody:visible img.djvu').length>0){
			return true
		}
		//специально для вкладки "Вся копия"
		if ($('.tabBody:visible #alldjvu').length>0){
			return true
		}
		return false;
	}
	this.search = function(links,request,strict){

		this.document.main.tooltip.killSuggest();
		if (links!=null && links[0]!=null && links[0][0] != null) {
			if(links[0][0].length < 0){
				this.document.textSearch.showToolTip();
				return;
			}
		} else {
			this.document.textSearch.showToolTip();
			return;
		}
		
		var i;
		var activePage=null;
		var pages = Array();
		for(i in links){
			pages=pages.concat(links[i]);		
		}
		this.searchRes = pages;
		if (!pages.length>0){
			this.getSrc()
			this.setUrlParam('context',null);		 
			this.setButtonPaginator();
			this.setSearchResultButtonPaginator();
			this.setSrc();
	  		return false;
		}
		
		var firstPage=pages[0];
		for(i in pages){
			if (parseInt(pages[i])==this.page){
				activePage=this.page;
			}
			if (parseInt(pages[i])<firstPage){
				firstPage=parseInt(pages[i]);
			}
		}
		if (activePage==null){
			activePage=firstPage;
		}
		this.getSrc();
		if (strict==true){
			this.setUrlParam('strict',1);
		}else{
			this.setUrlParam('strict',null);
		}
		this.setPage(activePage);
		this.setUrlParam('page',activePage);
		this.setUrlParam('context',encodeURIComponent(request));
		this.setSearchResultButtonPaginator(pages);
		this.setButtonPaginator();
		this.setSrc();
	}
	this.setPageDocument = function(p,context){
		var self = this;
		this.getSrc();
		var img = $('img.djvu:visible');
		if (p<0){
			return;
		}
		if ((p>this.numPage || p<0)&&(p!='next' && p!='prev')){
			//this.setPage(this.page);
			return false;
		}
		var newPage;
		switch (p){
			case  'next':				
				if (this.page<(this.numPage-1)){
					//this.setPage(this.page+1);
					newPage = this.page+1;
				}else{
					return false;
				}				
				break;
			case  'prev':				
				if (this.page>0){
					//this.setPage(this.page-1);
					newPage = this.page-1;
				}else{
					return false;
				}				
				break;
			default: //this.setPage(parseInt(p-1));
					newPage = parseInt(p-1);
		}
		if (newPage != null){
			self.setPage(newPage);
			self.loadPage(newPage,context);
			
			
		}
		
       	return true;
  		
	};
	this.setScaleDocument = function(p){
		if ((!p.match(/^\d+$/g) || p>1000 || p<0)){
			return false;
		}
		var img = $('img.djvu:visible');
		if (img.length==0){
			img = $('.document:visible img.djvu');
		}
		var width = null;
		this.getSrc()
		switch (p){
			case  '0':
					if (!this.height){ return;	}
					this.scale = (img.parent().width()-44)/this.width;
				
					width = Math.round(this.scale*this.width);
					this.scale=null;
					this.setUrlParam('scale',null);	
	    			this.setUrlParam('width',width);	
					break;
			case  '1':
					if (!this.height){ return;	}
					var height = (img.parent().height()-44)/this.height; // 40, because padding: 20
					var width = img.parent().width()/this.width;
					this.scale = (height<width)? height : width;
	    			
					width = Math.round(this.scale*this.width);
					this.scale=null;
					this.setUrlParam('scale',null);	
	    			this.setUrlParam('width',width);	
					break;
			default:
					this.scale=parseInt(p)/100;
					this.setUrlParam('scale',this.scale);	
	    			this.setUrlParam('width',width);	
    	}
       	this.setSrc()
		return true;	
	};
	this.setUrlParam = function(key,value){
	
		if ((this.src) && (this.src.indexOf('&'+key+'=')>0)){
			pattern =new RegExp('&'+key+'=[^&]+', 'g');
			if (value!=null){
				this.src=this.src.replace(pattern, '&'+key+'='+value);
			}else{
				this.src=this.src.replace(pattern, '');
			}
		} else {
			if (value!=null){
				this.src+='&'+key+'='+value;
			}
		}
	};
	this.setPage = function(page){
		//$('.activeDoc .panelDjvu .value input:visible').val(page+1);
		$('.panelDjvu .selectPage select:visible option[text="'+(page + 1)+'"]').attr('selected', true);;
		this.page=page;
//		document.main.icons.init();
	};
	this.ctrlPage = function(){
		//var currentPage = $('.num .value input[type=text]:visible').val();
		var currentPage = $('.panelDjvu .selectPage select:visible option:selected').text();
		var maxPages = $('.cnt:visible').text();
		this.numPage=parseInt(maxPages);
		if (parseInt(currentPage)>parseInt(maxPages)){
			this.page=parseInt(maxPages);
			this.setPageDocument(this.page);
		}
	}
	this.loadPage = function(page,context){
		//$('.activeDoc img.djvu').hide();
		//document.main.progress.start();
		this.firstLoad = true;
		this.getSrc();
		if (page>this.numPage){
			this.page = this.numPage; 
		}else{
			this.page=page;
		}
	    this.setUrlParam('page',page);		 
	    this.setButtonPaginator();
	    this.setSearchResultButtonPaginator(this.searchRes);
		if (context!=null){
	    	this.setUrlParam('context',utils.escape(context));		 
		}
		this.setSrc();
    	this.ctrlOffset();
		//$('.panelDjvu .value input').val((this.page + 1));
		document.rewriteHistory();
		if ($('#tree .previewTree').length != 0){
			if($('#panel.preview .previewBody ul li img').eq(this.page).hasClass('selected') == false){
				this.document.main.preview.selectImage(this.page);
			}
		}
		var img = $('img.djvu');
		if(img.length > 0){
			img.eq(0).parent().scrollTop(0);
		}
	};
	
	this.setSrc = function(){
		var self = this;

		var img =$('.document.activeDoc img.djvu');
		if (img.length==0){
			img = $('.document:visible img.djvu');
		}
		$('.waitDjvuImage').show();
		img.load(function(){$('.waitDjvuImage').hide();});
		img.attr('src',this.src);
		img.attr('url',this.src);
		
	};
	this.getSrc = function(){
		var doc =$('.document.activeDoc img.djvu');
		if (doc.length==0){
			doc = $('.document:visible img.djvu');
		}
		this.src=doc.attr('url');
	};
	this.ctrlOffset = function(){
		$('.activeDoc').css('padding-top','35px');
	}
	this.error = function(e){
		return;
		this.setUrlParam('scale',null);		 
		this.setUrlParam('context',null);		 
		this.setUrlParam('page',null);		 
		this.setPage(0);
		this.setButtonPaginator();
		this.setSearchResultButtonPaginator();
		this.setSrc();
	}
	this.showPanel = function(){
		$('.activeDoc .panelDjvu').show();
		this.ctrlOffset();
	}
	this.hidePanel = function(){
		$('.activeDoc .panelDjvu').hide();
		$('.activeDoc').css('padding-top','0px');
	}
	
	this.imagePageOption = function() {
		var self = this;
		var jEl = $('.panelDjvu .selectPage select:visible');
		if (jEl.length == 0) return;
		var el = jEl.get(0);
		var numPage = parseInt($('.activeDoc .panelDjvu .cnt:visible').html());
		for(var i = 1; i <= numPage; i++) {
			el.options[el.length] = new Option(i);
		}
	}
	this.setPrevMatchPageDocument = function() {
		var newPage;
		this.getSrc();
		var min = this.searchRes[0];
		var max = this.searchRes[this.searchRes.length-1];
		if(max< this.page) {
			newPage = max;
		} else {
			for(var i = 0; i<this.searchRes.length; i++) {
				if(this.searchRes[i] == this.page ) {
					newPage = this.searchRes[i-1];
					break;
				}
				if (this.searchRes[i] < this.page) {
					newPage = this.searchRes[i];
				}
			}
		}
		this.setUrlParam('page',newPage);
		this.setPage(newPage);
		this.setButtonPaginator();
		this.setSearchResultButtonPaginator(this.searchRes);
		this.setSrc();
	}
	this.setNextMatchPageDocument = function() {
		var newPage;
		var min = this.searchRes[0];
		var max = this.searchRes[this.searchRes.length-1];
		this.getSrc();
		if(min> this.page) {
			newPage = min;
		} else {
			for(var i = 0; i<this.searchRes.length; i++) {
				if(this.searchRes[i] == this.page ) {
					newPage = this.searchRes[i+1];
					break;
				}
				if (this.searchRes[i] > this.page) {
					newPage = this.searchRes[i];
					break;
				}
			}
		}
		this.setUrlParam('page',newPage);
		this.setPage(newPage);
		this.setButtonPaginator();	
		this.setSearchResultButtonPaginator(this.searchRes);
		this.setSrc();
	}
	this.setEvent();
}
