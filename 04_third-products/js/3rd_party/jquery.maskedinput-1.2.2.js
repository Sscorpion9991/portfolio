/*
	Masked Input plugin for jQuery
	Copyright (c) 2007-2009 Josh Bush (digitalbush.com)
	Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license) 
	Version: 1.2.2 (03/09/2009 22:39:06)
*/
(function($) {
	var pasteEventName = ($.browser.msie ? 'paste' : 'input') + ".mask";
	var iPhone = (window.orientation != undefined);

	$.mask = {
		//Predefined character definitions
		definitions: {
			'9': "[0-9]",
			'a': "[A-Za-z]",
			'*': "[A-Za-z0-9]",
			'0': "[0]",
			'1': "[01]",
			'2': "[012]",
			'3': "[0-3]",
			'4': "[12]"
		}
	};

	$.fn.extend({
		//Helper Function for Caret positioning
		caret: function(begin, end) {
			if (this.length == 0) return;
			if (typeof begin == 'number') {
				end = (typeof end == 'number') ? end : begin;
				return this.each(function() {
					if (this.setSelectionRange) {
						this.focus();
						this.setSelectionRange(begin, end);
					} else if (this.createTextRange) {
						var range = this.createTextRange();
						range.collapse(true);
						range.moveEnd('character', end);
						range.moveStart('character', begin);
						range.select();
					}
				});
			} else {
				if (this[0].setSelectionRange) {
					begin = this[0].selectionStart;
					end = this[0].selectionEnd;
				} else if (document.selection && document.selection.createRange) {
					var range = document.selection.createRange();
					begin = 0 - range.duplicate().moveStart('character', -100000);
					end = begin + range.text.length;
				}
				return { begin: begin, end: end };
			}
		},
		unmask: function() { return this.trigger("unmask"); },
		mask: function(mask, settings) {
			if (!mask && this.length > 0) {
				var input = $(this[0]);
				var tests = input.data("tests");
				return $.map(input.data("buffer"), function(c, i) {
					return tests[i] ? c : null;
				}).join('');
			}
			settings = $.extend({
				placeholder: "_",
				completed: null
			}, settings);

			var defs = $.mask.definitions;
			var tests = [];
			var partialPosition = mask.length;
			var firstNonMaskPos = null;
			var len = mask.length;

			$.each(mask.split(""), function(i, c) {
				if (c == '?') {
					len--;
					partialPosition = i;
				} else if (defs[c]) {
					tests.push(new RegExp(defs[c]));
					if(firstNonMaskPos==null)
						firstNonMaskPos =  tests.length - 1;
				} else {
					tests.push(null);
				}
			});

			return this.each(function() {
				var input = $(this);
				var buffer = $.map(mask.split(""), function(c, i) { if (c != '?') return defs[c] ? settings.placeholder : c });
				var ignore = false;  			//Variable for ignoring control keys
				var focusText = input.val();

				input.data("buffer", buffer).data("tests", tests);

				function seekNext(pos) {
					while (++pos <= len && !tests[pos]);
					return pos;
				};

				function shiftL(pos) {
					while (!tests[pos] && --pos >= 0);
					for (var i = pos; i < len; i++) {
						if (tests[i]) {
							buffer[i] = settings.placeholder;
							var j = seekNext(i);
							if (j < len && tests[i].test(buffer[j])) {
								buffer[i] = buffer[j];
							} else
								break;
						}
					}
					writeBuffer();
					input.caret(Math.max(firstNonMaskPos, pos));
					//$('.send').removeClass('yellow').addClass('gray');
				};

				function shiftR(pos) {
					for (var i = pos, c = settings.placeholder; i < len; i++) {
						if (tests[i]) {
							var j = seekNext(i);
							var t = buffer[i];
							buffer[i] = c;
							if (j < len && tests[j].test(t))
								c = t;
							else
								break;
						}
					}
				};

				function keydownEvent(e) {
					var pos = $(this).caret();
					var k = e.keyCode;
					ignore = (k < 16 || (k > 16 && k < 32) || (k > 32 && k < 41));

					//delete selection before proceeding
					if ((pos.begin - pos.end) != 0 && (!ignore || k == 8 || k == 46))
						clearBuffer(pos.begin, pos.end);

					//backspace, delete, and escape get special treatment
					if (k == 8 || k == 46 || (iPhone && k == 127)) {//backspace/delete
						shiftL(pos.begin + (k == 46 ? 0 : -1));
						return false;
					} else if (k == 27) {//escape
						input.val(focusText);
						input.caret(0, checkVal());
						return false;
					}
				};

				function keypressEvent(e) {
					if (ignore) {
						ignore = false;
						//Fixes Mac FF bug on backspace
						return (e.keyCode == 8) ? false : null;
					}
					e = e || window.event;
					var k = e.charCode || e.keyCode || e.which;
					var pos = $(this).caret();

					if (e.ctrlKey || e.altKey || e.metaKey) {//Ignore
						return true;
					} else if ((k >= 32 && k <= 125) || k > 186) {//typeable characters
						var p = seekNext(pos.begin - 1);
							
						if (p < len) {
							var c = String.fromCharCode(k);
				//			var ch3 = $(input).val().substr(3,1);
					
				//			dbg.msg('---------------------------');
				//			dbg.msg(tests[p].test(c));
				//			dbg.msg(ch3=='0' && c=='0' && p==4);
				//			dbg.msg('---------------------------');
				//			if (p==4){
				//				dbg.msg('---------------------------');
				//					
				//			}
							
							if (tests[p].test(c) ) {
								shiftR(p);
								buffer[p] = c;
								if (writeBuffer(p)) {
									var next = seekNext(p);
									$(this).caret(next);
									if (settings.completed && next == len)
										settings.completed.call(input);
								} else {
									shiftL(p);
								}
								//toggleSendButton(p, $(this));
							}
						}
					}
					return false;
				};
				
				function toggleSendButton(p, input) {
					if (input.val().indexOf('_') == -1) {
						if(dateIsExist(input.val()) != '') {
							$('.send').removeClass('gray').addClass('yellow');
						}
					} else {
						$('.send').removeClass('yellow').addClass('gray');
					}
				}

				function clearBuffer(start, end) {
					for (var i = start; i < end && i < len; i++) {
						if (tests[i])
							buffer[i] = settings.placeholder;
					}
				};

				function writeBuffer(p) { 
					var isValid = true;
					if (null!=p) {
						if (buffer[0]=='3' && buffer[1]!='1' && buffer[1]!='0' && buffer[1]!='_') {
							buffer[1] = '_';
							isValid = false;
						}
						if (buffer[0]=='0' && buffer[1]=='0' && buffer[1]!='_') {
							buffer[1] = '_';
							isValid = false;
						}
						if (buffer[3]=='1' && buffer[4]!='0' && buffer[4]!='1' && buffer[4]!='2' && buffer[4]!='_') {
							buffer[4] = '_';
							isValid = false;
						}
						if (buffer[3]=='0' && buffer[4]=='0' ) {
							buffer[4] = '_';
							isValid = false;
						}/*
						if (buffer[6]!='1' && buffer[6]!='2' && buffer[6]!='_') {
							buffer[6] = '_';
							isValid = false;
						}
						if (buffer[6]=='1' && buffer[7]!='9' && buffer[7]!='8' && buffer[7]!='_') {
							buffer[7] = '_';
							isValid = false;
						}
						if (buffer[6]=='2' && buffer[7]!='0' && buffer[7]!='1' && buffer[7]!='_') {
							buffer[7] = '_';
							isValid = false;
						}
						if (buffer[6]=='2' && buffer[7]=='1' && buffer[8]!='0' && buffer[8]!='_') {
							buffer[8] = '_';
							isValid = false;
						}*/
						
						if (buffer[6]=='1' && buffer[7]<'8' && buffer[8]!='_') {
							buffer[8] = '_';
							isValid = false;
						}
						if (buffer[6]=='0' && buffer[8]!='_') {
							buffer[8] = '_';
							isValid = false;
						}
						if (buffer[6]>'2' && buffer[8]!='_') {
							buffer[8] = '_';
							isValid = false;
						}
						if (buffer[6]=='2' && buffer[7]>'1' && buffer[8]!='_') {
							buffer[8] = '_';
							isValid = false;
						}
						if (buffer[6]=='2' && buffer[7]=='1' && buffer[8]>'0') {
							buffer[8] = '_';
							isValid = false;
						}
						if (buffer[6]=='2' && buffer[7]=='1' && buffer[8]=='0' && buffer[9]>'0') {
							buffer[9] = '_';
							isValid = false;
						}
						
						/*
						if (buffer[6]=='2' && buffer[7]=='1' && buffer[8]=='0' && buffer[9]!='0' && buffer[9]!='_') {
							buffer[9] = '_';
							isValid = false;
						}*/
					}
					input.val(buffer.join('')).val(); 
					return isValid;
				};

				function checkVal(allow) {
					//try to place characters where they belong
					var test = input.val();
					var lastMatch = -1;
					for (var i = 0, pos = 0; i < len; i++) {
						if (tests[i]) {
							buffer[i] = settings.placeholder;
							while (pos++ < test.length) {
								var c = test.charAt(pos - 1);
								if (tests[i].test(c)) {
									buffer[i] = c;
									lastMatch = i;
									break;
								}
							}
							if (pos > test.length)
								break;
						} else if (buffer[i] == test[pos] && i!=partialPosition) {
							pos++;
							lastMatch = i;
						} 
					}
					if (!allow && lastMatch + 1 < partialPosition) {
						if (input.attr('default')) {
							input.val(input.attr('default'));
						} else {
							input.val('');
						}
						clearBuffer(0, len);
					} else if (allow || lastMatch + 1 >= partialPosition) {
						writeBuffer();
						if (!allow) input.val(input.val().substring(0, lastMatch + 1));
					}
					return (partialPosition ? i : firstNonMaskPos);
				};
				
				function check(input, callback){
					var dateValue = input.val().toLowerCase();
					var lastSymbol = dateValue.indexOf(settings.placeholder);
					if (lastSymbol!=-1) {
						dateValue = dateValue.substr(0,lastSymbol);
					}
					//проверяем дату с помощью регекспов, самые испльзуемые идут первыми
					dateValue = dateValue.replace(/\\{1,}/g,'/');
					var reg = [
								//DD.MM.YYYY
								/(([0-2]{1}[1-9]{1})|([1-2]{1}[0-9]{1})|([3]{1}[01]{1}))(\.)([0]{1}[1-9]{1}|([1]{1}[012]{1})|([1-9]{1}))(\.)((19(\d{2}))|(20(\d{2})))/,
								//D.MM.YYYY
								/([1-9]{1})(\.)([0]{1}[1-9]{1}|([1]{1}[012]{1})|([1-9]{1}))(\.)((19(\d{2}))|(20(\d{2})))/,
								//YYYY/MM/DD
								/((19(\d{2}))|(20(\d{2})))(\/)([0]{1}[1-9]{1}|([1]{1}[012]{1})|([1-9]{1}))(\/)(([0-2]{1}[1-9]{1})|([3]{1}[01]{1})|([1-2]{1}[0-9]{1}))/,
								//YYYY/MM/D
								/((19(\d{2}))|(20(\d{2})))(\/)([0]{1}[1-9]{1}|([1]{1}[012]{1})|([1-9]{1}))(\/)([1-9]{1})/,
								//DD.MONTH.YYYY или DD MONTH YYYY (MONTH - сокращенное или полное название месяца по-русски)
								/(([0-2]{1}[1-9]{1})|([1-2]{1}[0-9]{1})|([3]{1}[01]{1}))(\s|\.)(янв\D*|фев\D*|мар\D*|апр\D*|май\D*|июн\D*|июл\D*|авг\D*|сен\D*|окт\D*|ноя\D*|дек\D*)(\s|\.)((19(\d{2}))|(20(\d{2})))/,
								//D.MONTH.YYYY или D MONTH YYYY (MONTH - сокращенное или полное название месяца по-русски)
								/([1-9]{1})(\s|\.)(янв\D*|фев\D*|мар\D*|апр\D*|ма(й|я)\D*|июн\D*|июл\D*|авг\D*|сен\D*|окт\D*|ноя\D*|дек\D*)(\s|\.)((19(\d{2}))|(20(\d{2})))/,
								//DD.MONTH.YYYY или DD MONTH YYYY (MONTH - сокращенное или полное название месяца по-английски)
								/(([0-2]{1}[1-9]{1})|([3]{1}[01]{1})|([1-2]{1}[0-9]{1}))(\s|\.)(jan\D*|feb\D*|mar\D*|apr\D*|may\D*|jun\D*|jul\D*|aug\D*|sep\D*|oct\D*|nov\D*|dec\D*)(\s|\.)((19(\d{2}))|(20(\d{2})))/,
								//D.MONTH.YYYY или D MONTH YYYY (MONTH - сокращенное или полное название месяца по-английски)
								/([1-9]{1})(\s|\.)(jan\D*|feb\D*|mar\D*|apr\D*|may\D*|jun\D*|jul\D*|aug\D*|sep\D*|oct\D*|nov\D*|dec\D*)(\s|\.)((19(\d{2}))|(20(\d{2})))/,
								//YYYY/MONTH/DD (MONTH - сокращенное или полное название месяца по-английски)
								/((19(\d{2}))|(20(\d{2})))(\/)(jan\D*|feb\D*|mar\D*|apr\D*|may\D*|jun\D*|jul\D*|aug\D*|sep\D*|oct\D*|nov\D*|dec\D*)(\/)(([0-2]{1}[1-9]{1})|([3]{1}[01]{1})|([1-2]{1}[0-9]{1}))/,
								//YYYY/MONTH/D (MONTH - сокращенное или полное название месяца по-английски)
								/((19(\d{2}))|(20(\d{2})))(\/)(jan\D*|feb\D*|mar\D*|apr\D*|may\D*|jun\D*|jul\D*|aug\D*|sep\D*|oct\D*|nov\D*|dec\D*)(\/)([1-9]{1})/
					]
					var isValid = false;
		
					var i = 0;
					while (!isValid && i<reg.length){
						isValid = reg[i].exec(dateValue);
						i++;
					}
					if (!isValid) {
						dateValue = '';
					} else {
						var newDate = isValid[0].replace(/\s/g, '');
						//если месяц не числом
						if (i > 4) {
							var regToReplace = [/янв\D*/, /фев\D*/, /мар\D*/, /апр\D*/, /ма(й|я)\D*/, /июн\D*/, /июл\D*/, /авг\D*/, /сен\D*/, /окт\D*/, /ноя\D*/, /дек\D*/, 
												/jan\D*/, /feb\D*/, /mar\D*/, /apr\D*/, /may\D*/, /jun\D*/, /jul\D*/, /aug\D*/, /sep\D*/, /oct\D*/, /nov\D*/, /dec\D*/];
							
							for (var j = 0; j < regToReplace.length; j++) {
								newDate = newDate.replace(regToReplace[j], '.' + ((j % 12) + 1) + '.');
							}
						}
						dateValue = dateIsExist(newDate);
					}
					input.val(dateValue);
					if (dateValue){
						this.kApp.search.isEmpty();
					}
					if (callback)
						callback();
				};
				
				function dateIsExist(date) {
					var year = null, month = null, day = null;
					var dateParams = '';
					date = date.replace(/\.{1,}/,'.');
					dateParams = date.split('/');
					if (dateParams.length == 3) {
						year = dateParams[0];
						month = (dateParams[1] < 10 && dateParams[1].length == 1) ? '0' + dateParams[1] : dateParams[1];
						day = (dateParams[2] < 10 && dateParams[2].length == 1) ? '0' + dateParams[2] : dateParams[2];
					}
					dateParams = date.split('.');
					if (dateParams.length == 3) {
						year = dateParams[2];
						month = (dateParams[1] < 10 && dateParams[1].length == 1) ? '0' + dateParams[1] : dateParams[1];
						day = (dateParams[0] < 10 && dateParams[0].length == 1) ? '0' + dateParams[0] : dateParams[0];
					};
					
					//проверка на существование дня месяца
					switch (day) {
						case '31':  if ( !(month=='01' || month=='03' || month=='05' || month=='07' ||
											month=='08' || month=='10' || month=='12' ) ) {
										date='';
										this.kApp.tooltip.create($('body'), msg.get('dateErrorFormat'), 10, 'dateError', null, null, false);
										this.kApp.tooltip.setCenter($('.dateError'));
										break;
									}
									
						case '30':  if (month=='02') {
										date='';
										this.kApp.tooltip.create($('body'), msg.get('dateErrorFormat'), 10, 'dateError', null, null, false);
										this.kApp.tooltip.setCenter($('.dateError'));
										break;
									}	
									
						case '29':  if ((month=='02')&&(parseInt(year)%4!=0)) {
										date = '';
										this.kApp.tooltip.create($('body'), msg.get('dateErrorFormat'), 10, 'dateError', null, null, false);
										this.kApp.tooltip.setCenter($('.dateError'));
										break;
									}		
						default:	
									date = day+'.'+month+'.'+year;
									break;
					}
					//проверка на формат года - yyyy ии yy
					if(year.indexOf('_') != -1) {
						var parsedYear = year.replace(/_/g,'');
						if(parsedYear.length == 2) {
							if (parsedYear <= 50 ) {
								parsedYear = "20" + parsedYear;
							} else if(parsedYear > 50) {
								parsedYear = "19" + parsedYear;
							} else {
								parsedYear = year;
							}
							date = day+'.'+month+'.'+parsedYear;
						} else {
							date = '';
						}
					}
					return date;
				};
				
				if (!input.attr("readonly"))
					input
					.one("unmask", function() {
						input
							.unbind(".mask")
							.removeData("buffer")
							.removeData("tests");
					})
					.bind("focus.mask", function() {
						focusText = input.val();
						var pos = checkVal();
						writeBuffer();
						setTimeout(function() {
							if (pos == mask.length)
								input.caret(0, pos);
							else
								input.caret(pos);
						}, 0);
					})
					.bind("blur.mask", function() {
						var date = dateIsExist(input.val());
						if (date == '') {
							date = input.attr('default');
							input.parents('div.active').removeClass('active');
							//$('span.send:visible').removeClass('yellow').addClass('gray');
						} else if(date.indexOf('_') == -1) {
							if(dateIsExist(date) == '') {
								input.parents('div.active').removeClass('active');
								date = input.attr('default');
							}
						}
						input.val(date);
						if (input.val() != focusText) 
							input.change();
						kApp.search.isEmpty()
					})
					.bind("keydown.mask", keydownEvent)
					.bind("keypress.mask", keypressEvent)
					.bind(pasteEventName, function() {
						setTimeout(function() { check(input, function(){input.caret(checkVal(true))}) }, 0);
					});

				checkVal(); //Perform initial check for existing values
			});
		}
	});
})(jQuery);