window.fiscalCalendar = function(){
/*
	$('.fiscalCalendar .co .close').live('click', function(){
		var jEl = $(this);
		var block = $('.fiscalCalendar .co');
		$('.co_body',block).slideUp(200);
		$('.co_top',block).addClass('co_open');
		$('.fiscalCalendar .guide_body').animate( { 'margin-top':'-100px','padding-top':'100px' }, 200 );
		$('.fiscalCalendar .guide_top .maximize').removeClass('maximize').addClass('default');
		return false;
	});
	$('.fiscalCalendar .guide_top .close').live('click',function(){
		var jEl = $(this);
		var block = $('.fiscalCalendar');
		$('.guide_body',block).slideUp(200);
		$('.tree_filter',block).slideUp(200);
		$('.guide_top',block).addClass('guide_open');
		return false;
	});
*/	
	window.needReloadList = false;
	$('.fiscalCalendar .co .default').live('click',function(){
		$('.co_body','.fiscalCalendar').slideDown(200);
		$('.fiscalCalendar .guide_body').animate( { 'margin-top':'-340px','padding-top':'340px' }, 200 );
	});
	$('.fiscalCalendar .guide_top .default').live('click',function(){
		$('.co_body','.fiscalCalendar').slideDown(200);
		$('.fiscalCalendar .guide_body').animate( { 'margin-top':'-340px','padding-top':'340px' }, 200 );
		$(this).removeClass('default').addClass('maximize');
		$('.fiscalCalendar .guide_top .maximize').attr("title","развернуть");
	});
	
	$('.fiscalCalendar .co .maximize').live('click',function() {
	});
	$('.fiscalCalendar .guide_top .maximize').live('click',function() {
		var jEl = $(this);
		var block = $('.fiscalCalendar .co');
		$('.co_body',block).slideUp(200);
		$('.co_top',block).addClass('co_open');
		$('.fiscalCalendar .guide_body').animate( { 'margin-top':'-100px','padding-top':'100px' }, 200 );
		$('.fiscalCalendar .guide_top .maximize').removeClass('maximize').addClass('default');
		$('.fiscalCalendar .guide_top .default').attr("title","cвернуть");
		return false;
	});
	
	window.fiscalCalendarSettings = function(el){
		var jEl = $(el);
		var url = jEl.attr('rel');
		var parent = jEl.parent();
		$('.settingsDialog').remove();
		$('body').append('<div id="settingsDialog" class="settingsDialog"  > <div class="closeSettings"> </div> <iframe class="fcSettingsDialog" src="'+url+'" > </iframe></div>');
		$('.closeSettings').click(function(){
			window.fiscalCalendarSettingsClose();
		});
	};
	window.submitTCsetings = function() {
		console.log("Bro!");
		alert("Bro!");
		
	}
	window.fiscalCalendarSettingsClose = function() {
		var iframe = document.getElementById('settingsDialog');
		iframe.parentNode.removeChild(iframe);
		if(window.needReloadList == true){ 
			window.kApp.tabs.reload()
		}
		window.needReloadList = false;
	}
	$('.fiscalCalendar .top .settings a').live('click',function(){
		window.fiscalCalendarSettings(this);
	});
	
};