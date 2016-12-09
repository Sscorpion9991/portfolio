function Restore(main){
	this.main=main;
	this.list=null;
	this.lockId=null;
	this.lastId=0;
	this.request=false;
	this.unlockTime=null;
	this.timeout = 1600;
	this.init = function(){
		var self = this;
	//	unFocus.History.addEventListener('historyChange', function(historyHash){
	//		self.restoreById(historyHash);
	//	}); 
	};
	
	this.start = function(state,e){
		if (!state) { 
			state = $.cookie('state');
			if (state!=null) {
				state = JSON.parse(state);
			}
		}
		if (state!=null){
			if (state.type=='document'){
				this.getDoc(state,e);
			}
			if (state.type=='search'){
				this.getSearch(state);
			}
			if (state.type=='iSearch'){
				this.getISearch(state);
			}
			return true;
		}
		return false;
	}
	this.lock = function(id){
//		dbg.msg('lock');
		this.lockId = id;	
	}
	this.unlock = function(id){
//		dbg.msg('unlock');
		this.lockId = null;
	}
	this.restoreById = function(id){
		var self = this;
		if (!id){
			this.main.document.firstOpen()
		}
		if (this.lockId!=id) {
			this.lastId = id;
			$.ajax({
				url: this.main.path.URL_HISTORY_GET_BY_ID,
				type: 'GET',
				data: 'param1=' + id,
				dataType: 'json',
				success: function(json){
					if (json.result){
						self.start(json.result.state);
					}else{
						self.start();
					}
				}
			});
		}else{
		//	dbg.msg('L0CKED');
		}
	}
	this.getDoc = function (state, e) {
	    var self = this;
	    if (state && state.listId && state.listId != null) {
	        state.listId = null;
	    }
	    var params = state.params;
	    if (params == null)
	        params = [];
	    if (params.r == null && state.r != null)
	        params.push('r=' + state.r);
	    if (state.marker) {
	        params.push('point=mark=' + state.marker);
	        this.main.document.open(state.nd, null, params, null, function () {
	            //	self.main.document.restore(state);
	        }, null, params);
	    } else {
	        this.main.document.open(state.nd, null, params, function () {
	            self.main.document.restore(state);
	        }, null, e);
	    }
	};
	this.excludedOids = ['777712445'];
	this.checkOid = function (nd) {
		for (var i=0;i<this.excludedOids.length;i++) {
			if (('' + nd) == ('' + this.excludedOids[i]))
				return false;
		}
		return true;
	}
	this.setDoc = function(nd,state,link){
		if (state){
			state.type = 'document';
			state.nd = nd;
			var json = JSON.stringify(state);
			$.cookie('state', json);
			var title = this.main.document.doc_info ? this.main.document.doc_info.title : 'Документ';
			if (this.main.document.canPutInUserData && this.checkOid(nd)) {
				this.sendState(title, json, 'd',link);
			}
		}
	};
	this.getSearch = function(state){
		var self = this;
		self.main.search.search(null, function () {

		         if (self.main.search.activeSearch == 1) {
		             self.main.search.classificator.clickForJpATab(1, function () { self.main.search.setState(state); self.main.search.isEmpty(); });
		        } else {
		             self.main.search.setState(state);
		        }

		        //self.main.search.setState(state);

				self.main.progress.stop();
				}, state.sType);
	};
	this.setSearch = function(sType,state){
		state.type='search';
		state.sType=sType;
		var json = JSON.stringify(state);
		$.cookie('state',json);
		var title = this.main.search.resultListStatus();
		title = JSON.stringify(title);
		this.sendState(title,json,'q');
	};
	this.getISearch = function(state){
		var self = this;
		this.main.iSearch.initTabs(state.context,state.idTab,null,null,state.real,state.checkadd,state.archs);
		$('#context').val(state.context);
	};


	this.setISearch = function(context,idTab,real, checkadd, archs){
		var state = {};
		state.type ='iSearch';
		state.context = context;
		state.idTab = idTab;
		state.real = real;
		state.checkadd = checkadd;
		state.archs = archs;
		var json = JSON.stringify(state);
		$.cookie('state',json);
		var title = {
			name: 'Интеллектуальный поиск',
			context: context
		};
		if (archs){
			title.name = 'Интеллектуальный поиск по архивам';		
		}
		title = JSON.stringify(title);
		this.sendState(title,json,'q');
	};
	this.nextPage = function(){
		this.lastId=null;
	}
	this.lock = function(timeout){
		if (timeout==null){
			timeout=this.timeout;
		}
		this.unlockTime = (new Date).getTime()+timeout;
	}
	this.isLock = function(){
		var date = new Date();
		if (this.unlockTime==null) return false;
		if (this.unlockTime > date.getTime()){
			 return true;
		}
		return false;
	}
	this.sendState = function(title,state,type,link){
		if (window.noUserData){
			return;
		}
		var self = this;
		self.link = link;
		this.request = true;
		if (this.lastId==null){
			this.lock();
			if (this.req!=null) return;
			this.req = $.ajax({
				url: this.main.path.URL_HISTORY_EVENT,
				dataType : 'json',
				type : "GET",
				data : {
					action:'create_event',
					param1:title,
					param2:state,
					param3:type
				},
				error: function(){
					self.req = null;
				},
				success: function(json){
					self.req = null;
				//	self.main.restore.lock(json.result);
				//	unFocus.History.addHistory(json.result); 
				//	self.main.history.rewrite(LinkHistory(null, null, function{
				//		;	
				//	}));
				//	self.main.restore.unlock(json.result);
					self.request = false;
					self.lastId = json.result;
					if (self.link!=null){
						self.link.id = self.lastId;
					}
					self.lock();
				}	
			});
		}else{
			if (self.isLock()){
				self.request = false;
				return;
			} 
			this.lock();
			$.ajax({
				url: this.main.path.URL_HISTORY_EVENT,
				dataType : 'json',
				type : "GET",
				data : {
					action:'update_event',
					param1:this.lastId,
					param4:title,
					param2:state,
					param3:type
				},
				success: function(json){
					self.request = false;
					self.lock();
				}	
			});
		}
	}	

	this.init();
}
