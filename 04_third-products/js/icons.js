function  Icons(main){	
	this.main=main;
	this.action = {};
	this.state = {};
		this.rus = {
		'find' : lex('TextFind'),
		'table_content' : lex('Contents'),
		'print' : lex('print'),
		'save' : lex('saveToFile'),
		'bookmark_set' : lex('setBookmark'),
		'folder_put' : lex('putToFolder'),
		'prevDocISearch' : 'Перейти к предыдущему документу',
		'listDocISearch' : 'Вернуться в список',
		'nextDocISearch' : 'Перейти к следующему документу',
		'prevDoc' : 'Перейти к предыдущему документу',
		'listDoc' : 'Вернуться в список',
		'nextDoc' : 'Перейти к следующему документу',
		'word' : lex('openToWord'),
		'removeBookmarks' : lex('deleteSelItems'),
		'importUData' : lex('ImportMaterials'),
		'exportUData' : lex('ExportMaterials'),
		'lifetimeHistory' : lex('ConfigureHistory'),
		'tree': lex('ShowPahel'),
		'put_control':lex('putControl'),
		'remove_control':lex('removeControl')
	};
	this.toRemove = ['bookmark_set', 'folder_put'];
	this.position = ['print', 'save', 'word',  '-', 'find', '-', 'bookmark_set', 'folder_put', 'put_control' , 'remove_control' , '-', 'nextDoc', 'listDoc', 'prevDoc', 'nextDocISearch', 'listDocISearch', 'prevDocISearch' ];
	
	this.init = function() {
		var self = this;
		
		this.re = /^[^_]*_([\S]*)/;
		$('#icons > span').live("click",function(){
			self.click(this);
		});
	}

	this.click = function(el){
		var id = el.id;
		id =id.match(this.re);
		if (id.length==2 && this.action[id[1]] && typeof this.action[id[1]] == 'function'){
			this.action[id[1]]();
		}
		this.main.tooltip.reset();
	}
	/*****************************************/
	//Не удалять кнопку, а отключать. На какой либо вкладке документа, например, можно отключать кнопку
	//пришедшую из tabs.ks, а потом на другой вкладке включить.
	//ToDo переделать некоторые
	this.onIcon = function(id){
		if(this.state && this.state[id] == false){
			this.state[id] = true;
		}
	}
	this.offIcon = function(id){
		if(this.state && this.state[id] == true){
			this.state[id] = false;
		}	
	}
	/****************************************/

	this.reg = function(key,action){
		this.action[key] = action;
	}

	this.setEvent = function(id){
		$('#'+id).mousedown(function(){
			return false;
		});
	};
	this.clear = function(){
		//console.log('clear');
		$('#icons').empty();
		this.state = {};
		this.redraw();
	};
	this.remove = function(id){
		this.state[id] = null;
		this.redraw();
	}
	this.add = function(name, className){
		if (name == null)
			return;
		if (name=='word' && !utils.isKBrowser() && !utils.isLocal()) {
			return;
		}
		this.state[name] = ((className.indexOf('disable') == -1) ? true : null);
		if ($('#ico_'+name).length>0) {
			return;
		}
		tmp_name = name.match(/\w+/);
		var classNameHtml = className!=null ? 'class="'+className+'"' : '';
		title = this.rus[tmp_name] ? 'title="'+this.rus[tmp_name]+'"' : '';
		this.append(name,className,'<span id="ico_'+name+'" '+classNameHtml+' '+title+'></span>');
		this.setEvent('ico_'+name);
		this.sort();
		if (window.noUserData) {
			this.removeIcons();
		}
		this.redraw();
	};
	this.append = function(name,className,html){
		$('#icons').append(html);
	};
	this.addList = function(icons){
		for(i in icons){
			this.add(icons[i].type, icons[i].className);
		}
	};
	this.disable = function(id){
		$('#icons #ico_'+id).addClass('disable');
		this.state[id]=null;
		this.redraw();
	};
	this.active = function(id){
		$('#icons #ico_'+id).removeClass('disable');
		this.state[id]=true;
		this.redraw();
	};
	this.addUrl = function(id, url, newWindow){
		var target = newWindow ? '_blank' : '';
		if (!utils.isLocal()){
			$('#icons #ico_'+id).empty().append('<a href="'+url+'" target="'+target+'"></a>');
		}
	};
	this.sort = function() {		
		var container = $('#icons');
		$('#icons .separator').remove();
		var cnt = 0;
		for(var i in this.position){
			if (this.position[i]=='-' && cnt!=0){
				container.append('<div class="separator"> </div>');
			}
			var icon = $('#ico_'+this.position[i]);
			if (icon.length == 0) {
				icon = $('.ico_'+this.position[i]);
			}
			if (icon.length>0){
				
				cnt++;
				container.append(icon);
			}
		}
	};

	this.showIcons = function() {
		$('#icons > span').show();
	};
	
	this.hideIcons = function() {
		$('#icons > span').hide();
	};
	this.hide = function(){
		$('#icons').hide();
	};
	this.show = function(){
		$('#icons').show();
	};
	this.removeIcons = function() {
		//console.log('removeIcons');
		for (var i in this.toRemove) {
			$('#ico_'+this.toRemove[i]).remove();
			this.state[this.toRemove[i]] = null;
		}
		this.redraw();
	};	
	this.redraw = function(){
		
	};
	this.init();
}
