/**
 * --------------------------------------------------------------------
 * jQuery-Plugin "daterangepicker.jQuery.js"
 * by Scott Jehl, scott@filamentgroup.com
 * http://www.filamentgroup.com
 * reference article: http://www.filamentgroup.com/lab/update_date_range_picker_with_jquery_ui/
 * demo page: http://www.filamentgroup.com/examples/daterangepicker/
 * 
 * Copyright (c) 2008 Filament Group, Inc
 * Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) and GPL (filamentgroup.com/examples/gpl-license.txt) licenses.
 *
 * Dependencies: jquery, jquery UI datepicker, date.js library (included at bottom), jQuery UI CSS Framework
 * Changelog:
 * 	10.23.2008 initial Version
 *  11.12.2008 changed dateFormat option to allow custom date formatting (credit: http://alexgoldstone.com/)
 *  01.04.09 updated markup to new jQuery UI CSS Framework
 *  01.19.2008 changed presets hash to support different text 
 * --------------------------------------------------------------------
 */
 
 // Очистка поля календарика- Кодекс
 jQuery.fn.datepickerclear = function(param_clear) {
	var input_date_id = this.attr("id");
	var rangeStart = $(".range-start[id_date='"+input_date_id+"']");
	var rangeEnd = $(".range-end[id_date='"+input_date_id+"']");
	
	if (param_clear == 'clear') {
		rangeStart.val('');
		rangeEnd.val('');
		$("div[id_date='"+input_date_id+"'] td").removeClass('ui-datepicker-current-day');
		return;
	}
	
	if (param_clear == 'destroy') {
 		rangeStart.datepicker('destroy');
		rangeEnd.datepicker('destroy'); 
		$("div[class='ui-daterangepickercontain']:has([id_date='"+input_date_id+"'])").remove();
		return;
	}
 }

jQuery.fn.daterangepicker = function(settings){
	var rangeInput = jQuery(this);
	//defaults
	var options = jQuery.extend({
		type_date_input: 'date', // "date" - одиночная дата, "period" - период
		elem_click: this, // Элемент, к которому привязываем открытие календарика
		rangeStartTitle: 'начальная дата',
		rangeEndTitle: 'конечная дата',
		nextLinkText: '>>',
		prevLinkText: '<<',
		earliestDate: Date.parse('-15years'), //earliest date allowed 
		latestDate: Date.parse('+15years'), //latest date allowed 
		rangeSplitter: 'по', //string to use between dates in single input
		dateFormat: 'dd.mm.yy', // date formatting. Available formats: http://docs.jquery.com/UI/Datepicker/%24.datepicker.formatDate
		closeOnSelect: true, //if a complete selection is made, close the menu
		arrows: false,
		posX: rangeInput.offset().left, // x position
		posY: rangeInput.offset().top + rangeInput.outerHeight(), // y position
		appendTo: 'body',
		onClose: function(){
			var val = rangeInput.val();
			if (!rangeInput.hasClass('active')){
				date_str = rangeInput.val();
				if (date_str != "") {
					if (date_str.length == 10) {
						if ((date_str != "") && (date_str != "__.__.____")) {
							if (!checkExistenceDate(date_str)) {
								showTooltipForDateInput(rangeInput, 'Дата введена некорректно. Даты '+rangeInput.val()+' не существует.');
								rangeInput.focus();
							}
						}
					}
					else {
						var date1_str = val.substr(2, 10);
						var date2_str = val.substr(16, 21);
						var message = "";

						var date1 = new Date(date1_str.substr(6,10), date1_str.substr(3,5)-1, date1_str.substr(0,2), 0, 0, 0);
						var date2 = new Date(date2_str.substr(6,10), date2_str.substr(3,5)-1, date2_str.substr(0,2), 0, 0, 0);
						
						if (date1.getTime() > date2.getTime()) {
							message = 'Нижняя граница диапазона даты должна быть меньше, чем верхняя граница.<br/>';
						}
			
						if (!checkExistenceDate(date1_str)) message += 'Первая дата введена некорректно. Даты '+date1_str+' не существует.<br/>';
						if (!checkExistenceDate(date2_str)) message += 'Вторая дата введена некорректно. Даты '+date2_str+' не существует.';
			
						if (message != '') {
							if ($("div.ui-daterangepicker:has(div[id_date='"+options.input_date_id+"'])").css('display') == 'none') {
								showTooltipForDateInput(rangeInput, message);
								rangeInput.focus();
							}
						}
					}	
				}
			}
			checkSaveSearchAttrQuery(); // Проверка КОДЕКС - изменен ли запрос поиска
		},
		onChange: function(){},
		datepickerOptions: null, //object containing native UI datepicker API options
		input_date_id: rangeInput.attr("id"),
		onOpen: function onOpenFunction() {
			hideTooltipForDateInput();
			var inputValue = rangeInput.attr("value");
			var inputDateId = options.input_date_id;

			if (type_date_input == "period") {
				if (inputValue.length == 26) {
					var date1 = parsePeriod (inputValue, 1);
					var date2 = parsePeriod (inputValue, 2);
					date1 = checkExistenceDate(date1);
					date2 = checkExistenceDate(date2);
					if (date1) $(".range-start[id_date='"+inputDateId+"']").datepicker('setDate', date1);
					if (date2) $(".range-end[id_date='"+inputDateId+"']").datepicker('setDate', date2); 
				}
			}
			else if (type_date_input == "date") {
				var tempDate = checkExistenceDate(inputValue);
				if (tempDate) {
					$(".range-start[id_date='"+inputDateId+"']").datepicker('setDate', tempDate);
				}
			}
		}
	}, settings);
	
	// Функция для разбора значения input периода
	// str - строка для разбора
	// number = 1 - возвращает первую дату
	// number = 2 - возвращаем вторую дату
	function parsePeriod (str, number) {
		if (number == 1) {
			return str.substr(2, 10);
		}
		else if (number == 2) {
			return str.substr(16, 21);
		}
		return 0;
	}

	// другие опции календарика, расширенные опции
	var datepickerOptions = {
		// Здесь происходит событие при клике на дату (при выборе даты)
		onSelect: function(dateText, inst) { 
				var startValue = rp.find('.range-start').datepicker('getDate');
				var endValue = rp.find('.range-end').datepicker('getDate');
					
				if (type_date_input == "period") {
					if ((startValue == null) || (endValue == null))				
					return;		
					
					var rangeB = fDate(endValue);					
				}				
				
				var rangeA = fDate(startValue);
		
				//send back to input or inputs
				if(rangeInput.length == 2){
					rangeInput.eq(0).val(rangeA);
					rangeInput.eq(1).val(rangeB);
				}
				else{
					if (type_date_input == "period") {
						//rangeInput.val((rangeA != rangeB) ? 'с '+rangeA+' '+ options.rangeSplitter +' '+rangeB : rangeA);
						// Заменили строчку. Теперь можно ввести период с одним и тем же числом в двух датах.
						rangeInput.val('с '+rangeA+' '+ options.rangeSplitter +' '+rangeB);
					}
					else if (type_date_input == "date") {
						rangeInput.val(rangeA);
					}
				}
				
				// если опция closeOnSelect выставлена в true
				if(options.closeOnSelect){
					if(!rp.find('li.ui-state-active').is('.ui-daterangepicker-dateRange') && !rp.is(':animated') ){
						hideRP();
					}
				}	
				options.onChange();		
				rangeInput.focus();			
			},
			defaultDate: +0,
			inputElemId: options.input_date_id
	};
	
	//change event fires both when a calendar is updated or a change event on the input is triggered
	rangeInput.change(options.onChange);
	
	
	//datepicker options from options
	options.datepickerOptions = (settings) ? jQuery.extend(datepickerOptions, settings.datepickerOptions) : datepickerOptions;
	
	//Захват дат(ы) из инпута (инпутов)
	var inputDateA, inputDateB;
	var inputDateAtemp, inputDateBtemp;
	if(rangeInput.size() == 2){
		inputDateAtemp = Date.parse( rangeInput.eq(0).val() );
		inputDateBtemp = Date.parse( rangeInput.eq(1).val() );
		if(inputDateAtemp == null){inputDateAtemp = inputDateBtemp;} 
		if(inputDateBtemp == null){inputDateBtemp = inputDateAtemp;} 
	}
	else {
		inputDateAtemp = Date.parse( rangeInput.val().split(options.rangeSplitter)[0] );
		inputDateBtemp = Date.parse( rangeInput.val().split(options.rangeSplitter)[1] );
		if(inputDateBtemp == null){inputDateBtemp = inputDateAtemp;} //if one date, set both
	}
	if(inputDateAtemp != null){inputDateA = inputDateAtemp;}
	if(inputDateBtemp != null){inputDateB = inputDateBtemp;}

		
	//Строим datepicker
	var rp = jQuery('<div class="ui-daterangepicker ui-widget ui-helper-clearfix ui-widget-content ui-corner-all"></div>');
	
	
	//Рисуем календарики
	if (options.type_date_input == "period") {
		var rpPickers = jQuery('<div class="ranges ui-widget-header ui-corner-all ui-helper-clearfix"><div class="range-start"><span class="title-start">Start Date</span></div><div class="range-end"><span class="title-end">End Date</span></div></div>').appendTo(rp);
	}
	else {
		var rpPickers = jQuery('<div class="ranges ui-widget-header ui-corner-all ui-helper-clearfix"><div class="range-start"></div><div class="range-end"></div></div>').appendTo(rp);
	}
	
	var rpPickersRangeStart = rpPickers.find('.range-start');
	var rpPickersRangeEnd = rpPickers.find('.range-end');
	
	rpPickers.find('.range-start, .range-end').datepicker(options.datepickerOptions);
	rpPickersRangeStart.datepicker('setDate', inputDateA);
	rpPickersRangeEnd.datepicker('setDate', inputDateB);
	rp.find('.ui-state-active').removeClass('ui-state-active');
	
	// Смотрим по переданному параметру что показать
	var type_date_input = options.type_date_input;
		
	// Показываем календарь с периодом
	if (type_date_input == "period") {
		jQuery(options.elem_click).addClass('ui-state-active').click(function(){
		rp.show();
		rpPickers.show();
		rp.find('.title-start').text(options.rangeStartTitle);
		rp.find('.title-end').text(options.rangeEndTitle);
		rpPickersRangeStart.show();
		rpPickersRangeEnd.show(); 
	});
	}
	// Показываем календарь с датой
	else if (type_date_input == "date") {
		jQuery(options.elem_click).addClass('ui-state-active').click(function(){	
		rp.show();
		rpPickers.show();
		rpPickersRangeStart.show();
	});
	}
				
	//Функция изменения формата даты
	function fDate(date){
	   if(!date.getDate()){return '';}
	   var day = date.getDate();
	   var month = date.getMonth();
	   var year = date.getFullYear();
	   month++; // adjust javascript month
	   var dateFormat = options.dateFormat;
	   return jQuery.datepicker.formatDate( dateFormat, date ); 
	}
	
	//show, hide, or toggle rangepicker
	function showRP(){
		if(rp.data('state') == 'closed'){ 
			rp.data('state', 'open');
			rp.fadeIn(0);
			options.onOpen(); 
		}
	}
	function hideRP(){
		if(rp.data('state') == 'open'){ 
			rp.data('state', 'closed');
			rp.fadeOut(0);
			options.onClose();
		}
	}
	function toggleRP(){
		if( rp.data('state') == 'open' ){ hideRP(); }
		else { showRP(); }
	}

	rp.data('state', 'closed');	
	
	//inputs toggle rangepicker visibility
	jQuery(options.elem_click).click(function(){
		$("div.ui-daterangepicker").css('display', 'none');
		rangeInput.focus();
		toggleRP();
		return false;
	});
	//hide em all
	rpPickers.css('display', 'none').find('.range-start, .range-end, .btnDone').css('display', 'none');
	
	//вводим rp
	jQuery(options.appendTo).append(rp);
	
	//wrap and position
	rp.wrap('<div class="ui-daterangepickercontain"></div>');
	if(options.posX){
		var posX;
		// Немного сдвигаем календарик под наши нужды
		if (type_date_input == "date") posX = options.posX - 125;
		else posX = options.posX - 240;
		rp.parent().css('left', posX);
	}
	if(options.posY){
		posY = options.posY - 20;
		rp.parent().css('top', posY);
	}

	//add arrows (only available on one input)
	if(options.arrows && rangeInput.size()==1){
		var prevLink = jQuery('<a href="#" class="ui-daterangepicker-prev ui-corner-all" title="'+ options.prevLinkText +'"><span class="ui-icon ui-icon-circle-triangle-w">'+ options.prevLinkText +'</span></a>');
		var nextLink = jQuery('<a href="#" class="ui-daterangepicker-next ui-corner-all" title="'+ options.nextLinkText +'"><span class="ui-icon ui-icon-circle-triangle-e">'+ options.nextLinkText +'</span></a>');
		jQuery(this)
		.addClass('ui-rangepicker-input ui-widget-content')
		.wrap('<div class="ui-daterangepicker-arrows ui-widget ui-widget-header ui-helper-clearfix ui-corner-all"></div>')
		.before( prevLink )
		.before( nextLink )
		.parent().find('a').click(function(){
			var dateA = rpPickers.find('.range-start').datepicker('getDate');
			var dateB = rpPickers.find('.range-end').datepicker('getDate');
			var diff = Math.abs( new TimeSpan(dateA - dateB).getTotalMilliseconds() ) + 86400000; //difference plus one day
			if(jQuery(this).is('.ui-daterangepicker-prev')){ diff = -diff; }
			
			rpPickers.find('.range-start, .range-end ').each(function(){
					var thisDate = jQuery(this).datepicker( "getDate");
					if(thisDate == null){return false;}
					jQuery(this).datepicker( "setDate", thisDate.add({milliseconds: diff}) ).find('.ui-datepicker-current-day').trigger('click');
			});
			
			return false;
		})
		.hover(
			function(){
				jQuery(this).addClass('ui-state-hover');
			},
			function(){
				jQuery(this).removeClass('ui-state-hover');
			})
		;
	}
	
	
	jQuery(document).click(function(){
		if (rp.is(':visible')) {
			hideRP();
		}
	}); 

	rp.click(function(){return false;}).hide();
	return this;
}


/* ****************************************************************************************************************** */
 
/* 
 * TimeSpan(milliseconds);
 * TimeSpan(days, hours, minutes, seconds);
 * TimeSpan(days, hours, minutes, seconds, milliseconds);
 */
var TimeSpan = function (days, hours, minutes, seconds, milliseconds) {
    var attrs = "days hours minutes seconds milliseconds".split(/\s+/);
    
    var gFn = function (attr) { 
        return function () { 
            return this[attr]; 
        }; 
    };
	
    var sFn = function (attr) { 
        return function (val) { 
            this[attr] = val; 
            return this; 
        }; 
    };
	
    for (var i = 0; i < attrs.length ; i++) {
        var $a = attrs[i], $b = $a.slice(0, 1).toUpperCase() + $a.slice(1);
        TimeSpan.prototype[$a] = 0;
        TimeSpan.prototype["get" + $b] = gFn($a);
        TimeSpan.prototype["set" + $b] = sFn($a);
    }

    if (arguments.length == 4) { 
        this.setDays(days); 
        this.setHours(hours); 
        this.setMinutes(minutes); 
        this.setSeconds(seconds); 
    } else if (arguments.length == 5) { 
        this.setDays(days); 
        this.setHours(hours); 
        this.setMinutes(minutes); 
        this.setSeconds(seconds); 
        this.setMilliseconds(milliseconds); 
    } else if (arguments.length == 1 && typeof days == "number") {
        var orient = (days < 0) ? -1 : +1;
        this.setMilliseconds(Math.abs(days));
        
        this.setDays(Math.floor(this.getMilliseconds() / 86400000) * orient);
        this.setMilliseconds(this.getMilliseconds() % 86400000);

        this.setHours(Math.floor(this.getMilliseconds() / 3600000) * orient);
        this.setMilliseconds(this.getMilliseconds() % 3600000);

        this.setMinutes(Math.floor(this.getMilliseconds() / 60000) * orient);
        this.setMilliseconds(this.getMilliseconds() % 60000);

        this.setSeconds(Math.floor(this.getMilliseconds() / 1000) * orient);
        this.setMilliseconds(this.getMilliseconds() % 1000);

        this.setMilliseconds(this.getMilliseconds() * orient);
    }

    this.getTotalMilliseconds = function () {
        return (this.getDays() * 86400000) + (this.getHours() * 3600000) + (this.getMinutes() * 60000) + (this.getSeconds() * 1000); 
    };
    
    this.compareTo = function (time) {
        var t1 = new Date(1970, 1, 1, this.getHours(), this.getMinutes(), this.getSeconds()), t2;
        if (time === null) { 
            t2 = new Date(1970, 1, 1, 0, 0, 0); 
        }
        else {
            t2 = new Date(1970, 1, 1, time.getHours(), time.getMinutes(), time.getSeconds());
        }
        return (t1 < t2) ? -1 : (t1 > t2) ? 1 : 0;
    };

    this.equals = function (time) {
        return (this.compareTo(time) === 0);
    };    

    this.add = function (time) { 
        return (time === null) ? this : this.addSeconds(time.getTotalMilliseconds() / 1000); 
    };

    this.subtract = function (time) { 
        return (time === null) ? this : this.addSeconds(-time.getTotalMilliseconds() / 1000); 
    };

    this.addDays = function (n) { 
        return new TimeSpan(this.getTotalMilliseconds() + (n * 86400000)); 
    };

    this.addHours = function (n) { 
        return new TimeSpan(this.getTotalMilliseconds() + (n * 3600000)); 
    };

    this.addMinutes = function (n) { 
        return new TimeSpan(this.getTotalMilliseconds() + (n * 60000)); 
    };

    this.addSeconds = function (n) {
        return new TimeSpan(this.getTotalMilliseconds() + (n * 1000)); 
    };

    this.addMilliseconds = function (n) {
        return new TimeSpan(this.getTotalMilliseconds() + n); 
    };

    this.get12HourHour = function () {
        return (this.getHours() > 12) ? this.getHours() - 12 : (this.getHours() === 0) ? 12 : this.getHours();
    };

    this.getDesignator = function () { 
        return (this.getHours() < 12) ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
    };

    this.toString = function (format) {
        this._toString = function () {
            if (this.getDays() !== null && this.getDays() > 0) {
                return this.getDays() + "." + this.getHours() + ":" + this.p(this.getMinutes()) + ":" + this.p(this.getSeconds());
            }
            else { 
                return this.getHours() + ":" + this.p(this.getMinutes()) + ":" + this.p(this.getSeconds());
            }
        };
        
        this.p = function (s) {
            return (s.toString().length < 2) ? "0" + s : s;
        };
        
        var me = this;
        
        return format ? format.replace(/dd?|HH?|hh?|mm?|ss?|tt?/g, 
        function (format) {
            switch (format) {
            case "d":	
                return me.getDays();
            case "dd":	
                return me.p(me.getDays());
            case "H":	
                return me.getHours();
            case "HH":	
                return me.p(me.getHours());
            case "h":	
                return me.get12HourHour();
            case "hh":	
                return me.p(me.get12HourHour());
            case "m":	
                return me.getMinutes();
            case "mm":	
                return me.p(me.getMinutes());
            case "s":	
                return me.getSeconds();
            case "ss":	
                return me.p(me.getSeconds());
            case "t":	
                return ((me.getHours() < 12) ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator).substring(0, 1);
            case "tt":	
                return (me.getHours() < 12) ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
            }
        }
        ) : this._toString();
    };
    return this;
};    

/**
 * Gets the time of day for this date instances. 
 * @return {TimeSpan} TimeSpan
 */
Date.prototype.getTimeOfDay = function () {
    return new TimeSpan(0, this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
};

/* 
 * TimePeriod(startDate, endDate);
 * TimePeriod(years, months, days, hours, minutes, seconds, milliseconds);
 */
var TimePeriod = function (years, months, days, hours, minutes, seconds, milliseconds) {
    var attrs = "years months days hours minutes seconds milliseconds".split(/\s+/);
    
    var gFn = function (attr) { 
        return function () { 
            return this[attr]; 
        }; 
    };
	
    var sFn = function (attr) { 
        return function (val) { 
            this[attr] = val; 
            return this; 
        }; 
    };
	
    for (var i = 0; i < attrs.length ; i++) {
        var $a = attrs[i], $b = $a.slice(0, 1).toUpperCase() + $a.slice(1);
        TimePeriod.prototype[$a] = 0;
        TimePeriod.prototype["get" + $b] = gFn($a);
        TimePeriod.prototype["set" + $b] = sFn($a);
    }
    
    if (arguments.length == 7) { 
        this.years = years;
        this.months = months;
        this.setDays(days);
        this.setHours(hours); 
        this.setMinutes(minutes); 
        this.setSeconds(seconds); 
        this.setMilliseconds(milliseconds);
    } else if (arguments.length == 2 && arguments[0] instanceof Date && arguments[1] instanceof Date) {
        // startDate and endDate as arguments
    
        var d1 = years.clone();
        var d2 = months.clone();
    
        var temp = d1.clone();
        var orient = (d1 > d2) ? -1 : +1;
        
        this.years = d2.getFullYear() - d1.getFullYear();
        temp.addYears(this.years);
        
        if (orient == +1) {
            if (temp > d2) {
                if (this.years !== 0) {
                    this.years--;
                }
            }
        } else {
            if (temp < d2) {
                if (this.years !== 0) {
                    this.years++;
                }
            }
        }
        
        d1.addYears(this.years);

        if (orient == +1) {
            while (d1 < d2 && d1.clone().addDays(Date.getDaysInMonth(d1.getYear(), d1.getMonth()) ) < d2) {
                d1.addMonths(1);
                this.months++;
            }
        }
        else {
            while (d1 > d2 && d1.clone().addDays(-d1.getDaysInMonth()) > d2) {
                d1.addMonths(-1);
                this.months--;
            }
        }
        
        var diff = d2 - d1;

        if (diff !== 0) {
            var ts = new TimeSpan(diff);
            this.setDays(ts.getDays());
            this.setHours(ts.getHours());
            this.setMinutes(ts.getMinutes());
            this.setSeconds(ts.getSeconds());
            this.setMilliseconds(ts.getMilliseconds());
        }
    }
    return this;
};
