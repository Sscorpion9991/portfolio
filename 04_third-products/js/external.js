function External(preffix) {
	
	this.init = function(preffix) {
		this.urlPreffix = (preffix == null)?'':"/"+preffix+"/";
		this.getProperties();
	}
	this.getProperties = function() {
		var self = this;
		this.ajaxQuery = $.ajax({
			url: this.urlPreffix+'external?query=getProperties',
			type: 'get',
			dataType:'json',
			async:false,
			success: function (json) {
				self.setProperties(json);
				self.setMethods();
				self.setApplicationMethods();
			}, error: function() {
				console.log('error');
			}
		});
	}
	this.setProperties = function(json) {
		for (var i in json) {
			this[i] = json[i];
		}
	}
	this.setMethods = function() {
		var self = this;
		
		this.CreateFilePath = function(path, name) {
			var err_msg = "";
			this.ajaxQuery = $.ajax({
				url: self.urlPreffix+'external',
				data: {
					'query': 'createFilePath',
					'path': path,
					'name': name
				},
				dataType:'json',
				type: 'get',
				async: false,
				success: function (response) {
					err_msg = response.err_msg;
				}, error: function() {
					console.log('error');
				}
			});
			return err_msg;
		}
		this.CreateFileDlg = function(someflag, name, filter, title, someclass) {
			console.log(someflag+name+filter+title+someclass);
		}
	}
	this.setApplicationMethods = function() {
		var self = this;
		
		if (typeof(this.Application) == 'undefined') {
			this.Application = {};
		}
		
/*		
		this.Application.GetOpenFileNames = function(message,fileType) {
			var files = "";
			this.ajaxQuery = $.ajax({
				url: self.urlPreffix+'external?query=getOpenFileNames',
				data: {
					'message': message,
					'fileType': fileType
				},
				dataType:'json',
				type: 'get',
				async: false,
				success: function (response) {
					files = response.files;
				}, error: function() {
					console.log('error');
				}
			});
			return files;
		}

		this.Application.GetFolder = function(title, action) {
			var folder = "";
			this.ajaxQuery = $.ajax({
				url: self.urlPreffix+'external',
				data: {
					'query': 'getFolder',
					'title': title,
					'action': action
				},
				dataType:'json',
				type: 'get',
				async: false,
				success: function (response) {
					folder = response.folder;
				}, error: function() {
					console.log('error');
				}
			});
			return folder;
		}
*/
		this.Application.RefreshWindows = function() {
			this.ajaxQuery = $.ajax({
				url: self.urlPreffix+'external',
				data: {
					'query': 'refreshWindows'
				},
				dataType:'json',
				type: 'get',
				success: function (response) {
					return true;
				}, error: function() {
					console.log('error');
				}
			});
		}
		this.Application.CreateScheduler = function(scheduleCheck,path,time) {
			this.ajaxQuery = $.ajax({
				url: self.urlPreffix+'external',
				data: {
					'query': 'createScheduler',
					'scheduleCheck': scheduleCheck,
					'path': path,
					'time': time
				},
				dataType:'json',
				type: 'get',
				async: false,
				success: function (response) {
					return true;
				}, error: function() {
					console.log('error');
				}
			});
		}
		this.Application.SetConfig = function(property, value, async) {
			if(async == null) {
				async = true;
			}
			if(property != null && property != "") {
				self.Application.Config[property] = value;
				this.ajaxQuery = $.ajax({
					url: self.urlPreffix+'external',
					data: {
						'query': 'setConfig',
						'property': property,
						'value': value
					},
					dataType:'json',
					type: 'get',
					async: async,
					success: function (json) {
						//self.setProperties(json);
					}, error: function() {
						console.log('error');
					}
				});
			}
		}
		this.Application.getUpdateStatus = function(){
			this.ajaxQuery = $.ajax({
				url: self.urlPreffix+'external',
				data: {
					'query': 'UpdateStatus'
				},
				dataType:'json',
				type: 'get',
				async: false,
				success: function (json) {
					self.Application.UpdateStatus = json.updateStatus;
				}, error: function() {
					console.log('error');
				}
			});
		};
		this.Application.setUpdCancelFlag = function(val) {
			this.updCancelFlag = val;
			self.ajaxQuery = $.ajax({
				url: self.urlPreffix+'external',
				data: {
					'query': 'updCancelFlag',
					'value': val
				},
				dataType:'json',
				type: 'get',
				async: false,
				success: function (json) {
					return true
				}, error: function() {
					console.log('error');
				}
			});
		};
	}
	this.getLicenseManager = function() {
		var self = this;
		var lm = {};
		this.ajaxQuery = $.ajax({
			url: self.urlPreffix+'external',
			data: {
				'query': 'getLicenseManagerProperties'
			},
			dataType:'json',
			type: 'get',
			async: false,
			success: function (json) {
				lm = json.licenseManager;
			}, error: function() {
				console.log('error');
			}
		});
		this.LicenseManager = lm;
		this.LicenseManager.AddOnChange = function(func) {
			this.ajaxQuery = $.ajax({
				url: self.urlPreffix+'external',
				data: {
					'query': 'addOnChange'
				},
				dataType:'json',
				type: 'get',
				async: false,
				success: function (json) {
					return true;
				}, error: function() {
					console.log('error');
				}
			});
			this.changeInterval = setInterval(function() {
				$.ajax({
					url: self.urlPreffix+'external',
					data: {
						'query': 'checkLicenseChange'
					},
					dataType:'json',
					type: 'get',
					success: function (json) {
						if (json.check) {
							func();
						}
					}, error: function() {
						console.log('error');
					}
				});
			}, 10000);
		}
		this.LicenseManager.RemoveOnChange = function() {
			this.ajaxQuery = $.ajax({
				url: self.urlPreffix+'external',
				data: {
					'query': 'removeOnChange'
				},
				dataType:'json',
				type: 'get',
				success: function (json) {
					return true;
				}, error: function() {
					console.log('error');
				}
			});
			clearInterval(this.changeInterval);
		}
		this.LicenseManager.serverEnumerator = function(val, licenseManagerComputer) {
			self.LicenseManager.licenseManagerComputer = licenseManagerComputer;
			var response;
			this.ajaxQuery = $.ajax({
				url: self.urlPreffix+'external',
				data: {
					'query': 'serverEnumerator',
					'value': val
				},
				dataType:'json',
				type: 'get',
				success: function (json) {
					if (json.comp != null) {
						self.LicenseManager.compReady(json.comp);
					}
				}, error: function() {
					console.log('error');
				}
			});
		}
		this.LicenseManager.compReady = function(comp) {
			if(comp == null || comp.length == 0) {
				var query = document.getElementById('query');
				query.value = '';
			} else { 
				for(var i=0; i<comp.length; i++) {
					var sComp = document.getElementById('comp');
					var oOption = document.createElement("OPTION");
					sComp.options.add(oOption);
					oOption.innerText = comp[i];
					oOption.value = comp[i];
					document.getElementById('gen').disabled = (document.getElementById('comp').selectedIndex < 0);
/*					if (comp[i] == self.LicenseManager.licenseManagerComputer) {
						sComp.selectedIndex = sComp.options.length - 1;
					}
*/
				}
			}
		}
		this.LicenseManager.ProtectString = function(type, comp) {
			var response;
			this.ajaxQuery = $.ajax({
				url: self.urlPreffix+'external',
				data: {
					'query': 'getProtectString',
					'type': type,
					'comp': comp
				},
				dataType:'json',
				type: 'get',
				async: false,
				success: function (json) {
					if(json != null) {
						response = json.protectString;
					} else {
						console.log('error');
					}
				}, error: function() {
					console.log('error');
				}
			});
			return response;
		}
		this.LicenseManager.SetAnswerString = function(answer) {
			var response;
			this.ajaxQuery = $.ajax({
				url: self.urlPreffix+'external',
				data: {
					'query': 'setAnswerString',
					'answer': answer
				},
				dataType:'json',
				type: 'get',
				async: false,
				success: function (json) {
					response = json.answerString;
				}, error: function() {
					console.log('error');
				}
			});
			return response;
		}
		this.LicenseManager.getError = function() {
			var response;
			this.ajaxQuery = $.ajax({
				url: self.urlPreffix+'external',
				data: {
					'query': 'getLicenseError'
				},
				dataType:'json',
				type: 'get',
				async: false,
				success: function (json) {
					response = json.error;
				}, error: function() {
					console.log('error');
				}
			});
			return response;
		}
		this.LicenseManager.AddLicense = function() {
			var response;
			this.ajaxQuery = $.ajax({
				url: self.urlPreffix+'external',
				data: {
					'query': 'addLicense'
				},
				dataType:'json',
				type: 'get',
				async: false,
				success: function (json) {
					response = json.status;
				}, error: function() {
					console.log('error');
				}
			});
			return response;
		}
	}
/******* TEST FUNCTIONS *******/


/******* ENDOF TEST FUNCTIONS *******/
}
/*if(typeof(window.external) == "undefined" || !$.browser.msie) {
	window.external = new External();
	window.external.init();
}*/