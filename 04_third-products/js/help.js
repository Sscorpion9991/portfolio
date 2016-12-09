function  Help(main){
	this.main = main;
	this.volume = 'root';
	if(this.main != null) {
		this.version = this.main.utils.isLocal()?'desktop':'server';
	} else {
		this.version = 'services';
	}
	this.init = function() {
		this.setEventToStaticLinks();
	};
	this.getHelpIdByName = function(volume,nd) {
		this.volume = volume;
		if (this.main.document != null && this.main.document.isTestDB && nd != null) {
			var url = utils.setUrlParam(this.main.path.URL_TESTDBDOCINFO,'nd',nd);
			url = url.replace('#', '');
			var helplink = $('#helpLink,#helpLink2');
			helplink.attr('href', url).attr('target', '_blank');
			helplink.unbind('click');
			helplink.bind('click', function(){
				window.open(url, 'help');
				return false;
			});			
			return false;
		}
		if( typeof(volume)!='undefined' && this.nameToIdComparison[volume] ){
			return this.nameToIdComparison[volume][this.version];
		} else {
			return this.nameToIdComparison.root[this.version];
		}
	};
	this.flashOpen = function(href) {
		if (this.version == 'desktop') {
			showModalDialog(href,"", "dialogWidth=850px, dialogHeight=616px");
			return false;
		}
		return true;
	};
	this.setEventToStaticLinks = function() {
		var self = this;
		$('#staticHelpLink, #helpUF, #additionalInfo').live("click", function () {
			var volume = $(this).attr("class").replace("HelpLink","");
			var path = document.location.href;
			if(self.version == 'services') {
				path = path.split('/');
				path.splice(path.length-2,2);
				path = path.join('/');
				path += "/"+ $(this).attr('href')+"/";
			}
			if( self.nameToIdComparison[volume] ){
				var url = utils.setUrlParam(path,'nd',self.nameToIdComparison[volume][self.version]);
			} else {
				var url = utils.setUrlParam(path,'nd',self.nameToIdComparison.root[self.version]);
			}
			url = utils.setUrlParam(url,'help','true');
			url = url.replace('#', '');
			
			$(this).attr('href', url).attr('target', '_blank');
			
			$(this).unbind('click');
			$(this).bind('click', function(){
				window.open(url, 'help');
				return false;
			});
			if(self.version != 'services') {
				window.open(url, 'help');
			}
/*
			if(($(this).attr('href').indexOf("help") == -1)) {
				if(self.version == 'services') {
					$(this).attr('href',$(this).attr('href') + href);
				} else {
					$(this).attr('href',href);
				}
			}
*/
		});
	};
	
	this.nameToIdComparison = {
		analyst : { desktop : 818100003, server : 818100053 },
		controldoc : { desktop : 818100004, server : 818100054 },
		desktop : { root : 818100050 },
		document : { desktop : 818100005, server : 818100055 },
		document_graf : { desktop : 818100006, server : 818100056 },
		document_link : { desktop : 818100007, server : 818100057 },
		document_search : { desktop : 818100008, server : 818100058 },
		document_sravn : { desktop : 818100009, server : 818100059 },
		document_toc : { desktop : 818100010, server : 818100060 },
		'interface' : { desktop : 818100011, server : 818100061 },
		interface_accelerator : { desktop : 818100012, server : 818100062 },
		interface_cont : { desktop : 818100013, server : 818100063 },
		interface_func : { desktop : 818100014, server : 818100064 },
		interface_list : { desktop : 818100015, server : 818100065 },
		interface_nav : { desktop : 818100016, server : 818100066 },
		interface_window : { desktop : 818100017, server : 818100067 },
		lists : { desktop : 818100018, server : 818100068 },
		lists_filtr : { desktop : 818100019, server : 818100069 },
		lists_open : { desktop : 818100020, server : 818100070 },
		lists_selection : { desktop : 818100021, server : 818100071 },
		lists_sort : { desktop : 818100022, server : 818100072 },
		lpp : { desktop : 818100023, server : 818100073 },
		mainpage : { desktop : 818100024, server : 818100074 },
		operation : { desktop : 818100025, server : 818100075 },
		operation_copy : { desktop : 818100026, server : 818100076 },
		operation_print : { desktop : 818100027, server : 818100077 },
		operation_savetofile : { desktop : 818100028, server : 818100078 },
		product : { desktop : 818100029, server : 818100079 },
		regionalanalyst : { server : 818100080 },
		regionalanalyst_anti : { server : 818100081 },
		regionalanalyst_gapsregulation : { server : 818100082 },
		regionalanalyst_legalanalysis : { server : 818100083 },
		regionalanalyst_monitoring : { server : 818100084 },
		root : { desktop : 818100050, server : 818100051, services : 818100052 },
		scenario : { desktop : 818100030, server : 818100085 },
		search : { desktop : 818100031, server : 818100086 },
		search_attribute : { desktop : 818100032, server : 818100087 },
		search_attribute_forming : { desktop : 818100033, server : 818100088 },
		search_attribute_forming_classifier : { desktop : 818100034, server : 818100089 },
		search_attribute_forming_date : { desktop : 818100035, server : 818100090 },
		search_attribute_forming_number : { desktop : 818100036, server : 818100091 },
		search_attribute_forming_word : { desktop : 818100037, server : 818100092 },
		search_attribute_result : { desktop : 818100038, server : 818100093 },
		search_smart : { desktop : 818100039, server : 818100094 },
		search_smart_forming : { desktop : 818100040, server : 818100095 },
		search_smart_result : { desktop : 818100041, server : 818100096 },
		server : { root : 818100051 },
		services : { root : 818100052 },
		setup_reg : { services : 818100106 },
		setup_strdb : { services : 818100107 },
		setup_sysinfo : { services : 818100108 },
		setup_updatedb : { services : 818100109 },
		sysinfo : { server : 818100097, desktop : 818100108 },  // same as setup_sysinfo 
		userfolder : { desktop : 818100042, server : 818100098 },
		userfolder_control : { desktop : 818100043, server : 818100099 },
		userfolder_deleteobject : { desktop : 818100044, server : 818100100 },
		userfolder_export : { desktop : 818100045, server : 818100101 },
		userfolder_import : { desktop : 818100046, server : 818100102 },
		userfolder_savebookmark : { desktop : 818100047, server : 818100103 },
		userfolder_savedoc : { desktop : 818100048, server : 818100104 },
		workhistory : { desktop : 818100049, server : 818100105 }
	};
	this.init();
}