function Console(){
	
	this.timestamp = new Array();
	
	this.init = function(){
		 this.timestamp[0] = (new Date()).getTime();
	}
	this.msg = function(variable,keyTimer,level){
		if (!level){
			level=1;
		}
		try{
			if (console!=null){
				console.log(this.showLine(keyTimer,level)+this.toStr(variable));
			}
		} catch(e) {
			return e;
		}
	}
	this.log = function(variable){
		try{
			if (console){
				console.log(variable);
			}
		} catch(e) {
			return e;
		}
	}
	this.dir = function(variable){
		try{
			if (console){
				console.dir(variable)
			}
		} catch(e) {
			return e;
		}
	}
	
	this.toStr = function(variable){
		if (typeof(variable) == 'object') {
			var str= new Array;
			for (var i in variable) {
				str.push(i+':'+variable[i]);	
			}
			return '[ '+str.join(';   ')+' ]';
		}
		return variable==null ? '' : variable.toString();
	}
		
	
	this.resetTimer = function(key,msg){
		if(!key){
			return;
		}
		if (msg!=false){
			this.msg({'reset timeout key':key,'time':this.getTime()},2);
		} 
		this.timestamp[key]=(new Date()).getTime();	
	}
	this.getTime = function(key){
		if(!key){
			key=0;
		}
		if (!this.timestamp[key]){
			this.timestamp[key]=(new Date()).getTime();
		}
		return ((new Date()).getTime()-this.timestamp[key])/1000;	
	}
	this.showLine = function(keyTimer,level,tab){
		if (level==null){
			level=1;
		}
		var result=this.getTime(keyTimer)+'s';
		if (keyTimer!=null){
			keyTimer=keyTimer.toString();
			if (keyTimer.length>3){
				keyTimer=keyTimer.substr(0,3)+'*';
			}
		}
		if (keyTimer){
			result+='('+keyTimer+')'
		}
		while (result.length<14){
			result+=' ';
		}
		result+='| ';
		
		if (tab==null){
			tab=40;
		}
		var stack;
		try{
		   throw new SyntaxError();
		} catch(e) {
			if (e.stack) {
				stack = e.stack
			}
		}
		var re = new RegExp('[^//]*.js:[\\d]*','g');
		for (var i = 0; i < level && stack.length<5000; i++) {
			re.exec(stack);
			re.exec(stack);
		}
		result+=re.exec(stack);
		while (result.length<tab){
			result+=' ';
		}
		return result;	
	}
	this.init();
}
