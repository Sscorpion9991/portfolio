$(document).ready(function(){  
	
	$('.kodeksesV2_Choose_book1').click(function (){
		$(".kodeksesV2_windowleft").fadeIn(300);
		$(".kodeksesV2_podlozka").fadeIn(300);
		$(".kodeksesV2_window").fadeIn(300);
		$(".kodeksesV2_Button_close").fadeIn(300);
		$(".kodeksesV2_windowright").fadeIn(300);
		});
		
	$('.kodeksesV2_Button_close').click(function (){
		$(".kodeksesV2_windowleft").fadeOut(300);
		$(".kodeksesV2_window").fadeOut(300);
		$(".kodeksesV2_Button_close").fadeOut(300);
		$(".kodeksesV2_windowright").fadeOut(300);
		$(".kodeksesV2_podlozka").fadeOut(300);
		});
		
	$('.kodeksesV2_podlozka').click(function (){
		$(".kodeksesV2_windowleft").fadeOut(300);
		$(".kodeksesV2_window").fadeOut(300);
		$(".kodeksesV2_Button_close").fadeOut(300);
		$(".kodeksesV2_windowright").fadeOut(300);
		$(".kodeksesV2_windowleft_book2").fadeOut(300);
		$(".kodeksesV2_window_book2").fadeOut(300);
		$(".kodeksesV2_Button_close_book2").fadeOut(300);
		$(".kodeksesV2_windowright_book2").fadeOut(300);
		$(".kodeksesV2_podlozka").fadeOut(300);
		});
		
	$('.kodeksesV2_Choose_book2').click(function (){
		$(".kodeksesV2_windowleft_book2").fadeIn(300);
		$(".kodeksesV2_window_book2").fadeIn(300);
		$(".kodeksesV2_Button_close_book2").fadeIn(300);
		$(".kodeksesV2_windowright_book2").fadeIn(300);
		$(".kodeksesV2_podlozka").fadeIn(300);
		});
		
	$('.kodeksesV2_Button_close_book2').click(function (){
		$(".kodeksesV2_windowleft_book2").fadeOut(300);
		$(".kodeksesV2_window_book2").fadeOut(300);
		$(".kodeksesV2_Button_close_book2").fadeOut(300);
		$(".kodeksesV2_windowright_book2").fadeOut(300);
		$(".kodeksesV2_podlozka").fadeOut(300);
		});
		
		
});