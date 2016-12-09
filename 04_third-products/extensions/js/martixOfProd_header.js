$(document).ready(function(){  
	var clc = 1;
	var oclc = 1;
	var ser = 1, prod = 0;
	var sv1 = 1, sv2 = 1, sv3 = 1, sv4 = 1;
	var prod1 = 1, prod2 = 1, prod3 = 1, prod4 = 1;
	var prod21 = 1, prod22 = 1, prod23 = 1, prod24 = 1; 
	var prod31 = 1, prod32 = 1, prod33 = 1, prod34 = 1; 
	var prod41 = 1, prod42 = 1;

// ==================================  MAIN MENU SWITCH  ====================================== //	

		$('.servWight').click(function (){
			$(".martixOfProd_html").css('min-height', '800px');
			$(".first").css({display: "none"});
			$(".second").css({display: "block"});
			$(".collapse").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
			$(".clicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
			$(".isclicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
			$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
			$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
			$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
			$(".martixOfProd_Prod_body, .martixOfProd_serv_body").stop( true, true ).animate({width:'toggle'},'slow', 'easeInOutExpo');
			oclc = 1;sv1 = 1; sv2 = 1; sv3 = 1; sv4 = 1; 
			prod1 = 1; prod2 = 1; prod3 = 1; prod4 = 1; 
			prod21 = 1; prod22 = 1; prod23 = 1; prod24 = 1; 
			prod31 = 1; prod32 = 1; prod41 = 1; prod42 = 1; prod = 1; ser = 0;
		return false;	
		});
		
		$('.infoProdWight').click(function (){
			$(".martixOfProd_html").css('min-height', '1400px');
			$(".first").css({display: "block"});
			$(".clicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
			$(".isclicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
			$(".second").css({display: "none"});
			$(".collapse").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
			$(".martixOfProd_Prod_body, .martixOfProd_serv_body").stop( true, true ).animate({width:'toggle'},'slow', 'easeInOutExpo');
			clc=1;sv1 = 1; sv2 = 1; sv3 = 1; sv4 = 1; 
			prod1 = 1; prod2 = 1; prod3 = 1; prod4 = 1; 
			prod21 = 1; prod22 = 1; prod23 = 1; prod24 = 1; 
			prod31 = 1; prod32 = 1; prod41 = 1; prod42 = 1; prod = 0; ser = 1;
		return false;		
		});	

//----------------------------------------------------------------------------------------------//
		
// ==================================  MENU INVISIBLE  ======================================== //
	
		$('.martixOfProd_menu_Close').click(function (){
			if (prod == 0){
				$(".martixOfProd_html").css('min-height', '1400px');
			}
			else if (ser == 0){
				$(".martixOfProd_html").css('min-height', '800px');
			}
			$(".collapse:not(:animated)").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
			$(".martixOfProd_prod_SecondLine:not(:animated)").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
			$(".martixOfProd_prod_ThirdLine:not(:animated)").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
			$(".martixOfProd_prod_FourthLine:not(:animated)").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
			$(".clicked:not(:animated)").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
			$(".isclicked:not(:animated)").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
			clc=1;oclc = 1;sv1 = 1; sv2 = 1; sv3 = 1; sv4 = 1; 
			prod1 = 1; prod2 = 1; prod3 = 1; prod4 = 1; 
			prod21 = 1; prod22 = 1; prod23 = 1; prod24 = 1; 
			prod31 = 1; prod32 = 1; prod41 = 1; prod42 = 1;
		return false;
		});
		
		
		
	$(".martixOfProd_serv1").click(
		function(){		
					
			if (sv2 == 0 || sv3 == 0 || sv4 == 0){
				$(".martixOfProd_html").css('min-height', '1000px');
				$(".serv2_menu, .serv3_menu, .serv4_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("clicked");	
				$(".martixOfProd_serv1 span").addClass("clicked");				
				$(".clicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".serv1_menu").fadeIn({duration: 'fast',easing: 'easeInOutExpo'});
				clc = -1; 
				sv1 = 0; 
				sv2 = 1;
				sv3 = 1;
				sv4 = 1;
			}
			else{
				$(".specialization span").removeClass("clicked");	
				$(".martixOfProd_serv1 span").addClass("clicked");				
			
				if (clc == -1){
					$(".martixOfProd_html").css('min-height', '800px');
					$(".clicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".serv1_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					clc = 1;
					sv1 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '1000px');
					$(".clicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".serv1_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
					clc = -1;
					sv1 = 0;
				}			
			}
		return false;
		});	

		
	$(".martixOfProd_serv2").click(
		function(){	
			
			if (sv1 == 0 || sv3 == 0 || sv4 == 0){	
				$(".martixOfProd_html").css('min-height', '1100px');
				$(".serv1_menu, .serv3_menu, .serv4_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("clicked");	
				$(".martixOfProd_serv2 span").addClass("clicked");		
				
				$(".clicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".serv2_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				clc = -1;
				sv1 = 1;
				sv2 = 0;
				sv3 = 1;
				sv4 = 1;
			}
			
			else{
			$(".specialization span").removeClass("clicked");	
			$(".martixOfProd_serv2 span").addClass("clicked");
			
			if (clc == -1){
				$(".martixOfProd_html").css('min-height', '800px');
				$(".clicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				$(".serv2_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				clc = 1;
				sv2 = 1;
			}
			else{
				$(".martixOfProd_html").css('min-height', '1100px');
				$(".clicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".serv2_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				clc = -1;
				sv2 = 0;
			}
			}
		return false;
		});	
		
		
	$(".martixOfProd_serv3").click(
		function(){			
			
			if (sv1 == 0 || sv2 == 0 || sv4 == 0){		
				$(".martixOfProd_html").css('min-height', '950px');
				$(".serv1_menu, .serv2_menu, .serv4_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("clicked");	
				$(".martixOfProd_serv3 span").addClass("clicked");
				
								
				$(".clicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".serv3_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				clc = -1;
				sv1 = 1;
				sv2 = 1;
				sv3 = 0;
				sv4 = 1;
			}
			else{
				$(".specialization span").removeClass("clicked");	
				$(".martixOfProd_serv3 span").addClass("clicked");
							
				
				if (clc == -1){
					$(".martixOfProd_html").css('min-height', '800px');
					$(".clicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".serv3_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					clc = 1;
					sv3 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '950px');
					$(".clicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".serv3_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
					clc = -1;
					sv3 = 0;
				}
			}
		return false;
		});
		
		
	$(".martixOfProd_serv4").click(
		function(){
			
			if (sv1 == 0 || sv2 == 0 || sv3 == 0){		
				$(".martixOfProd_html").css('min-height', '930px');
				$(".serv1_menu, .serv2_menu, .serv3_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("clicked");	
				$(".martixOfProd_serv4 span").addClass("clicked");
				
								
				$(".clicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".serv4_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				clc = -1;
				sv1 = 1;
				sv2 = 1;
				sv3 = 1;
				sv4 = 0;
			}
			else{			
				
				$(".specialization span").removeClass("clicked");		
				$(".martixOfProd_serv4 span").addClass("clicked");
				
				if (clc == -1){
					$(".martixOfProd_html").css('min-height', '800px');
					$(".clicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".serv4_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					clc = 1;
					sv4 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '930px');
					$(".clicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".serv4_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
					clc = -1;
					sv4 = 0;
				}
			}
		return false;
		});	
		
		
		
	$(".martixOfProd_prod1").click(
		function(){
			if (prod2 == 0 || prod3 == 0 || prod4 == 0){	
				$(".martixOfProd_html").css('min-height', '1900px');
				$(".prod2_menu, .prod3_menu, .prod4_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod1 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod1_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "795px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1088px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1381px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 0;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;	
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;					
			}
			
			else if (prod21 == 0 || prod22 == 0 || prod23 == 0 || prod24 == 0){
				$(".martixOfProd_html").css('min-height', '1900px');
				$(".prod21_menu, .prod22_menu, .prod23_menu, .prod24_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
			
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod1 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod1_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
			
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "795px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1088px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1381px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 0;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
		
			else if (prod31 == 0 || prod32 == 0 || prod33 == 0 || prod34 == 0){
				$(".martixOfProd_html").css('min-height', '1900px');
				$(".prod31_menu, .prod32_menu, .prod33_menu, .prod34_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod1 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod1_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "795px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1088px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1381px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 0;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;			
			}
		
		
			else if (prod41 == 0 || prod42 == 0){
				$(".martixOfProd_html").css('min-height', '1900px');
				$(".prod41_menu, .prod42_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});		
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod1 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod1_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "795px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1088px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1381px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 0;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;			
			}

		
			else{
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod1 span").addClass("isclicked");
				
				if (oclc == -1){
					$(".martixOfProd_html").css('min-height', '1400px');
					$(".isclicked, .prod1_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
					oclc = 1;
					prod1 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '1900px');
					$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".prod1_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
					$(".martixOfProd_prod_SecondLine").animate({marginTop: "795px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1088px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "1381px"}, 'slow', 'easeInOutExpo');
					oclc = -1;
					prod1 = 0;
				}
			}
		return false;
	});	
		
	$(".martixOfProd_prod2").click(
		function(){
			
			if (prod1 == 0 || prod3 == 0 || prod4 == 0){			
				$(".martixOfProd_html").css('min-height', '1700px');
				$(".prod1_menu, .prod3_menu, .prod4_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod2_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "575px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "868px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1161px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 0;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;					
			}
			
			else if (prod21 == 0 || prod22 == 0 || prod23 == 0 || prod24 == 0){
				$(".martixOfProd_html").css('min-height', '1700px');
				$(".prod21_menu, .prod22_menu, .prod23_menu, .prod24_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
			
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod2_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "575px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "868px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1161px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 0;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
			
			}
			
			else if (prod31 == 0 || prod32 == 0 || prod33 == 0 || prod34 == 0){
				$(".martixOfProd_html").css('min-height', '1700px');
				$(".prod31_menu, .prod32_menu, .prod33_menu, .prod34_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod2_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "575px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "868px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1161px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 0;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
			
			}
			
			else if (prod41 == 0 || prod42 == 0){
				$(".martixOfProd_html").css('min-height', '1700px');
				$(".prod41_menu, .prod42_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});		
			
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod2_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "575px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "868px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1161px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 0;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
			
			}
		
			else{
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2 span").addClass("isclicked");
							
				if (oclc == -1){
					$(".martixOfProd_html").css('min-height', '1400px');
					$(".isclicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".prod2_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
					oclc = 1;
					prod2 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '1700px');
					$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".prod2_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
					$(".martixOfProd_prod_SecondLine").animate({marginTop: "575px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "868px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "1161px"}, 'slow', 'easeInOutExpo');
					oclc = -1;
					prod2 = 0;
				}
			}
		return false;
		});	
		
		$(".martixOfProd_prod3").click(
		function(){
			if (prod1 == 0 || prod2 == 0 || prod4 == 0){			
				$(".martixOfProd_html").css('min-height', '2100px');
				$(".prod1_menu, .prod2_menu, .prod4_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod3_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "980px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1273px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1566px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 0;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;				
			}
			
			else if (prod21 == 0 || prod22 == 0 || prod23 == 0 || prod24 == 0){
				$(".martixOfProd_html").css('min-height', '2100px');
				
				$(".prod21_menu, .prod22_menu, .prod23_menu, .prod24_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
			
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod3_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "980px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1273px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1566px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 0;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
			
			}
			
			else if (prod31 == 0 || prod32 == 0 || prod33 == 0 || prod34 == 0){
				$(".martixOfProd_html").css('min-height', '2100px');
				$(".prod31_menu, .prod32_menu, .prod33_menu, .prod34_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod3_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "980px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1273px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1566px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 0;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
			
			}
			
			else if (prod41 == 0 || prod42 == 0){
				$(".martixOfProd_html").css('min-height', '2100px');
				$(".prod41_menu, .prod42_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});		
			
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod3_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "980px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1273px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1566px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 0;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
			
			}
		
			else{
				
				$(".martixOfProd_prod1 span").removeClass("isclicked");
				$(".martixOfProd_prod2 span").removeClass("isclicked");		
				$(".martixOfProd_prod3 span").addClass("isclicked");		
				$(".martixOfProd_prod4 span").removeClass("isclicked");		
				$(".martixOfProd_prod2_1 span").removeClass("isclicked");
				$(".martixOfProd_prod2_2 span").removeClass("isclicked");
				$(".martixOfProd_prod2_3 span").removeClass("isclicked");
				$(".martixOfProd_prod2_4 span").removeClass("isclicked");
				$(".martixOfProd_prod3_1 span").removeClass("isclicked");
				$(".martixOfProd_prod3_2 span").removeClass("isclicked");
				$(".martixOfProd_prod3_3 span").removeClass("isclicked");
				$(".martixOfProd_prod3_4 span").removeClass("isclicked");
				$(".martixOfProd_prod4_1 span").removeClass("isclicked");
				$(".martixOfProd_prod4_2 span").removeClass("isclicked");
				
				
				if (oclc == -1){
					$(".martixOfProd_html").css('min-height', '1400px');
					$(".isclicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".prod3_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
					oclc = 1;
					prod3 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '2100px');
					$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".prod3_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
					$(".martixOfProd_prod_SecondLine").animate({marginTop: "980px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1273px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "1566px"}, 'slow', 'easeInOutExpo');
					oclc = -1;
					prod3 = 0;
				}
			}
		return false;
		});	
		
		$(".martixOfProd_prod4").click(
		function(){
			if (prod1 == 0 || prod2 == 0 || prod3 == 0){			
				$(".martixOfProd_html").css('min-height', '2100px');
				$(".prod1_menu, .prod2_menu, .prod3_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod4 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod4_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "1005px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1298px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1591px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 0;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;				
			}
			
			else if (prod21 == 0 || prod22 == 0 || prod23 == 0 || prod24 == 0){
				$(".martixOfProd_html").css('min-height', '2100px');
				$(".prod21_menu, .prod22_menu, .prod23_menu, .prod24_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
						
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod4 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod4_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "1005px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1298px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1591px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 0;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
			
			}
			
			else if (prod31 == 0 || prod32 == 0 || prod33 == 0 || prod34 == 0){
				$(".martixOfProd_html").css('min-height', '2100px');
				$(".prod31_menu, .prod32_menu, .prod33_menu, .prod34_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
							
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod4 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod4_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "1005px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1298px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1591px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 0;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
			
			}
			
			else if (prod41 == 0 || prod42 == 0 || prod23 == 0 || prod24 == 0){
				$(".martixOfProd_html").css('min-height', '2100px');
				$(".prod41_menu, .prod42_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});		
			
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod4 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod4_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "1005px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1298px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1591px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 0;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
			
			}
		
			else{
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod4 span").addClass("isclicked");
				
				if (oclc == -1){
					$(".martixOfProd_html").css('min-height', '1400px');
					$(".isclicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".prod4_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
					oclc = 1;
					prod4 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '2100px');
					$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".prod4_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
					$(".martixOfProd_prod_SecondLine").animate({marginTop: "1005px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1298px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "1591px"}, 'slow', 'easeInOutExpo');
					oclc = -1;
					prod4 = 0;
				}
			}
		return false;
		});	
		
		$(".martixOfProd_prod2_1").click(
		function(){
			
			if (prod1 == 0 || prod2 == 0 || prod3 == 0 || prod4 == 0){			
				$(".martixOfProd_html").css('min-height', '3050px');
				$(".prod1_menu, .prod2_menu, .prod3_menu, .prod4_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_1 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod21_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "2218px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "2511px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 0;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
				
			else if (prod22 == 0 || prod23 == 0 || prod24 == 0){			
				$(".martixOfProd_html").css('min-height', '3050px');
				$(".prod22_menu, .prod23_menu, .prod24_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_1 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod21_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "2218px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "2511px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 0;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;			
			}
				
			else if (prod31 == 0 || prod32 == 0 || prod33 == 0 || prod34 == 0){			
				$(".martixOfProd_html").css('min-height', '3050px');
				$(".prod31_menu, .prod32_menu, .prod33_menu, .prod34_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});

				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_1 span").addClass("isclicked");	
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod21_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "2218px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "2511px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 0;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
			
			else if (prod41 == 0 || prod42 == 0){			
				$(".martixOfProd_html").css('min-height', '3050px');
				$(".prod41_menu, .prod42_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});		
			
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_1 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod21_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "2218px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "2511px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 0;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
		
			else{
		
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_1 span").addClass("isclicked");			
				
				if (oclc == -1){
					$(".martixOfProd_html").css('min-height', '1400px');
					$(".isclicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".prod21_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
					oclc = 1;
					prod21 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '3050px');
					$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".prod21_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
					
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "2218px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "2511px"}, 'slow', 'easeInOutExpo');
					oclc = -1;
					prod21 = 0;
					
				}
			}
		return false;
		});	
		
		$(".martixOfProd_prod2_2").click(
		function(){
			
			if (prod1 == 0 || prod2 == 0 || prod3 == 0 || prod4 == 0){			
				$(".martixOfProd_html").css('min-height', '3050px');
				$(".prod1_menu, .prod2_menu, .prod3_menu, .prod4_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_2 span").addClass("isclicked");
					
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod22_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "2248px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "2541px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 0;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;				
			}
			
			else if (prod21 == 0 || prod23 == 0 || prod24 == 0){			
				$(".martixOfProd_html").css('min-height', '3050px');
				$(".prod21_menu, .prod23_menu, .prod24_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_2 span").addClass("isclicked");

				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod22_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "2248px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "2541px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 0;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;			
			}
				
			else if (prod31 == 0 || prod32 == 0 || prod33 == 0 || prod34 == 0){			
				$(".martixOfProd_html").css('min-height', '3050px');
				$(".prod31_menu, .prod32_menu, .prod33_menu, .prod34_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});

				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_2 span").addClass("isclicked");	

				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod22_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "2248px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "2541px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 0;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
			
			else if (prod41 == 0 || prod42 == 0){			
				$(".martixOfProd_html").css('min-height', '3050px');
				$(".prod41_menu, .prod42_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});		
			
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_2 span").addClass("isclicked");

				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod22_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "2248px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "2541px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 0;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
		
			else{
					
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_2 span").addClass("isclicked");
				
				if (oclc == -1){
					$(".martixOfProd_html").css('min-height', '1400px');
					$(".isclicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".prod22_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
					oclc = 1;
					prod22 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '3050px');
					$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".prod22_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
					
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "2248px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "2541px"}, 'slow', 'easeInOutExpo');
					oclc = -1;
					prod22 = 0;
					
				}
			}
		return false;
		});
		
		
		$(".martixOfProd_prod2_3").click(
		function(){
			
			if (prod1 == 0 || prod2 == 0 || prod3 == 0 || prod4 == 0){			
				$(".martixOfProd_html").css('min-height', '2500px');
				$(".prod1_menu, .prod2_menu, .prod3_menu, .prod4_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_3 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod23_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1698px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1991px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 0;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;		
				
			}
			
			else if (prod21 == 0 || prod22 == 0 || prod24 == 0){			
				$(".martixOfProd_html").css('min-height', '2500px');
				$(".prod21_menu, .prod22_menu, .prod24_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_3 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod23_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1698px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1991px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 0;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;			
			}
				
			else if (prod31 == 0 || prod32 == 0 || prod33 == 0 || prod34 == 0){			
				$(".martixOfProd_html").css('min-height', '2500px');
				$(".prod31_menu, .prod32_menu, .prod33_menu, .prod34_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});

				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_3 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod23_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1698px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1991px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 0;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
			
			else if (prod41 == 0 || prod42 == 0){			
				$(".martixOfProd_html").css('min-height', '2500px');
				$(".prod41_menu, .prod42_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});		
			
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_3 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod23_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1698px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1991px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 0;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
		
			else{
		
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_3 span").addClass("isclicked");
				
				if (oclc == -1){
					$(".martixOfProd_html").css('min-height', '1400px');
					$(".isclicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".prod23_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
					oclc = 1;
					prod23 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '2500px');
					$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".prod23_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1698px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "1991px"}, 'slow', 'easeInOutExpo');
					oclc = -1;
					prod23 = 0;
					
				}
			}
		return false;
		});	
		
		$(".martixOfProd_prod2_4").click(
		function(){
			
			if (prod1 == 0 || prod2 == 0 || prod3 == 0 || prod4 == 0){			
				$(".martixOfProd_html").css('min-height', '2350px');
				$(".prod1_menu, .prod2_menu, .prod3_menu, .prod4_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_4 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod24_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1498px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1791px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 0;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
			
			else if (prod21 == 0 || prod22 == 0 || prod23 == 0){			
				$(".martixOfProd_html").css('min-height', '2350px');
				$(".prod21_menu, .prod22_menu, .prod23_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_4 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod24_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1498px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1791px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 0;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;			
			}
				
			else if (prod31 == 0 || prod32 == 0 || prod33 == 0 || prod34 == 0){			
				$(".martixOfProd_html").css('min-height', '2350px');
				$(".prod31_menu, .prod32_menu, .prod33_menu, .prod34_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});

				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_4 span").addClass("isclicked");	
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod24_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1498px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1791px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 0;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
			
			else if (prod41 == 0 || prod42 == 0){			
				$(".martixOfProd_html").css('min-height', '2350px');
				$(".prod41_menu, .prod42_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});		
			
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_4 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod24_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1498px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1791px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 0;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
		
			else{
			
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod2_4 span").addClass("isclicked");
				
				if (oclc == -1){
					$(".martixOfProd_html").css('min-height', '1400px');
					$(".isclicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".prod24_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
					oclc = 1;
					prod24 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '2350px');
					$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".prod24_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
					
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "1498px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "1791px"}, 'slow', 'easeInOutExpo');
					oclc = -1;
					prod24 = 0;
					
				}
			}
		return false;
		});	
		
		$(".martixOfProd_prod3_1").click(
		function(){
			
			if (prod1 == 0 || prod2 == 0 || prod3 == 0 || prod4 == 0){			
				$(".martixOfProd_html").css('min-height', '2000px');
				$(".prod1_menu, .prod2_menu, .prod3_menu, .prod4_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_1 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod31_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1461px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 0;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
			
			else if (prod21 == 0 || prod22 == 0 || prod23 == 0 || prod24 == 0){			
				$(".martixOfProd_html").css('min-height', '2000px');
				$(".prod21_menu, .prod22_menu, .prod23_menu, .prod24_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_1 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod31_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1461px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 0;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;			
			}
				
			else if (prod32 == 0 || prod33 == 0 || prod34 == 0){			
				$(".martixOfProd_html").css('min-height', '2000px');
				$(".prod32_menu, .prod33_menu, .prod34_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
					
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_1 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod31_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1461px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 0;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
			
			else if (prod41 == 0 || prod42 == 0){			
				$(".martixOfProd_html").css('min-height', '2000px');
				$(".prod41_menu, .prod42_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});		
			
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_1 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod31_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1461px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 0;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
		
			else{
			
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_1 span").addClass("isclicked");		
				
				if (oclc == -1){
					$(".martixOfProd_html").css('min-height', '1400px');
					$(".isclicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".prod31_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
					oclc = 1;
					prod31 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '2000px');
					$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".prod31_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});

					$(".martixOfProd_prod_FourthLine").animate({marginTop: "1461px"}, 'slow', 'easeInOutExpo');
					oclc = -1;
					prod31 = 0;
					
				}
			}
		return false;
		});	
		
		$(".martixOfProd_prod3_2").click(
		function(){
			
			if (prod1 == 0 || prod2 == 0 || prod3 == 0 || prod4 == 0){			
				$(".martixOfProd_html").css('min-height', '2200px');
				$(".prod1_menu, .prod2_menu, .prod3_menu, .prod4_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_2 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod32_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1631px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 0;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
			
			else if (prod21 == 0 || prod22 == 0 || prod23 == 0 || prod24 == 0){			
				$(".martixOfProd_html").css('min-height', '2200px');
				$(".prod21_menu, .prod22_menu, .prod23_menu, .prod24_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_2 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod32_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1631px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 0;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;			
			}
				
			else if (prod31 == 0 || prod33 == 0 || prod34 == 0){			
				$(".martixOfProd_html").css('min-height', '2200px');
				$(".prod31_menu, .prod33_menu, .prod34_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
								
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_2 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod32_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1631px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 0;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
			
			else if (prod41 == 0 || prod42 == 0){			
				$(".martixOfProd_html").css('min-height', '2200px');
				$(".prod41_menu, .prod42_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});		
			
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_2 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod32_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1631px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 0;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
		
			else{
		
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_2 span").addClass("isclicked");		
				
				if (oclc == -1){
					$(".martixOfProd_html").css('min-height', '1400px');
					$(".isclicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".prod32_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					
					$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
					oclc = 1;
					prod32 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '2200px');
					$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".prod32_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
					
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "1631px"}, 'slow', 'easeInOutExpo');
					oclc = -1;
					prod32 = 0;
					
				}
			}
		return false;
		});	
		
		$(".martixOfProd_prod3_3").click(
		function(){
			
			if (prod1 == 0 || prod2 == 0 || prod3 == 0 || prod4 == 0){			
				$(".martixOfProd_html").css('min-height', '1800px');
				$(".prod1_menu, .prod2_menu, .prod3_menu, .prod4_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_3 span").addClass("isclicked");
								
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod33_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1261px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 0;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
			
			else if (prod21 == 0 || prod22 == 0 || prod23 == 0 || prod24 == 0){			
				$(".martixOfProd_html").css('min-height', '1800px');
				$(".prod21_menu, .prod22_menu, .prod23_menu, .prod24_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
								
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_3 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod33_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1261px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 0;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;			
			}
				
			else if (prod31 == 0 || prod32 == 0 || prod34 == 0){			
				$(".martixOfProd_html").css('min-height', '1800px');
				$(".prod31_menu, .prod32_menu, .prod34_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
								
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_3 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod33_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1261px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 0;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
			
			else if (prod41 == 0 || prod42 == 0){			
				$(".martixOfProd_html").css('min-height', '1800px');
				$(".prod41_menu, .prod42_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});		
							
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_3 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod33_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1261px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 0;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 1;
				
			}
		
			else{
		
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_3 span").addClass("isclicked");
				
				if (oclc == -1){
					$(".martixOfProd_html").css('min-height', '1400px');
					$(".isclicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".prod33_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
										
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
					oclc = 1;
					prod33 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '1800px');
					$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".prod33_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
					
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "1261px"}, 'slow', 'easeInOutExpo');
					oclc = -1;
					prod33 = 0;
					
				}
			}
		return false;
		});	
		
		$(".martixOfProd_prod3_4").click(
		function(){
			
			if (prod1 == 0 || prod2 == 0 || prod3 == 0 || prod4 == 0){			
				$(".martixOfProd_html").css('min-height', '1650px');
				$(".prod1_menu, .prod2_menu, .prod3_menu, .prod4_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_4 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod34_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1091px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 0;		
				prod41 = 1;
				prod42 = 1;
				
			}
			
			else if (prod21 == 0 || prod22 == 0 || prod23 == 0 || prod24 == 0){			
				$(".martixOfProd_html").css('min-height', '1650px');
				$(".prod21_menu, .prod22_menu, .prod23_menu, .prod24_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_4 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod34_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1091px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 0;		
				prod41 = 1;
				prod42 = 1;			
			}
				
			else if (prod31 == 0 || prod32 == 0 || prod33 == 0){			
				$(".martixOfProd_html").css('min-height', '1650px');
				$(".prod31_menu, .prod32_menu, .prod33_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_4 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod34_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1091px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 0;		
				prod41 = 1;
				prod42 = 1;
				
			}
			
			else if (prod41 == 0 || prod42 == 0){			
				$(".martixOfProd_html").css('min-height', '1650px');
				$(".prod41_menu, .prod42_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});		
			
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_4 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod34_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "1091px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 0;		
				prod41 = 1;
				prod42 = 1;
				
			}
		
			else{
		
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod3_4 span").addClass("isclicked");
				
				if (oclc == -1){
					$(".martixOfProd_html").css('min-height', '1400px');
					$(".isclicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".prod34_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
										
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
					oclc = 1;
					prod34 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '1650px');
					$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".prod34_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
					
					$(".martixOfProd_prod_FourthLine").animate({marginTop: "1091px"}, 'slow', 'easeInOutExpo');
					oclc = -1;
					prod34 = 0;
					
				}
			}
		return false;
		});	
		
		$(".martixOfProd_prod4_1").click(
		function(){
			
			if (prod1 == 0 || prod2 == 0 || prod3 == 0 || prod4 == 0){			
				$(".martixOfProd_html").css('min-height', '1850px');
				$(".prod1_menu, .prod2_menu, .prod3_menu, .prod4_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod4_1 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod41_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 0;
				prod42 = 1;
				
			}
			
			else if (prod21 == 0 || prod22 == 0 || prod23 == 0 || prod24 == 0){			
				$(".martixOfProd_html").css('min-height', '1850px');
				$(".prod21_menu, .prod22_menu, .prod23_menu, .prod24_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod4_1 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod41_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 0;
				prod42 = 1;			
			}
				
			else if (prod31 == 0 || prod32 == 0 || prod33 == 0 || prod34 == 0){			
				$(".martixOfProd_html").css('min-height', '1850px');
				$(".prod31_menu, .prod32_menu, .prod33_menu, .prod34_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod4_1 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod41_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 0;
				prod42 = 1;
				
			}
			
			else if (prod42 == 0){			
				
				$(".martixOfProd_html").css('min-height', '1850px');
				$(".prod42_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod4_1 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod41_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 0;
				prod42 = 1;
				
			}
		
			else{
					
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod4_1 span").addClass("isclicked");
				
				if (oclc == -1){
					$(".martixOfProd_html").css('min-height', '1400px');
					$(".isclicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".prod41_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});				
					oclc = 1;
					prod41 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '1850px');
					$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".prod41_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
					oclc = -1;
					prod41 = 0;
					
				}
			}
		return false;
		});	
		
		$(".martixOfProd_prod4_2").click(
		function(){
			
			if (prod1 == 0 || prod2 == 0 || prod3 == 0 || prod4 == 0){			
				$(".martixOfProd_html").css('min-height', '1650px');
				$(".prod1_menu, .prod2_menu, .prod3_menu, .prod4_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod4_2 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod42_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 0;
				
			}
			
			else if (prod21 == 0 || prod22 == 0 || prod23 == 0 || prod24 == 0){			
				$(".martixOfProd_html").css('min-height', '1650px');
				$(".prod21_menu, .prod22_menu, .prod23_menu, .prod24_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod4_2 span").addClass("isclicked");
			
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod42_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
			
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 0;			
			}
				
			else if (prod31 == 0 || prod32 == 0 || prod33 == 0 || prod34 == 0){			
				$(".martixOfProd_html").css('min-height', '1650px');
				$(".prod31_menu, .prod32_menu, .prod33_menu, .prod34_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod4_2 span").addClass("isclicked");	
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod42_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 0;
				
			}
			
			else if (prod41 == 0){			
				$(".martixOfProd_html").css('min-height', '1650px');
				$(".prod41_menu").fadeOut({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod4_2 span").addClass("isclicked");
				
				$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
				$(".prod42_menu").fadeIn({duration: 'slow',easing: 'easeInOutExpo'});
				
				$(".martixOfProd_prod_SecondLine").animate({marginTop: "293px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_ThirdLine").animate({marginTop: "586px"}, 'slow', 'easeInOutExpo');
				$(".martixOfProd_prod_FourthLine").animate({marginTop: "879px"}, 'slow', 'easeInOutExpo');
				
				oclc = -1;
				prod1 = 1;
				prod2 = 1;	
				prod3 = 1;
				prod4 = 1;	
				prod21 = 1;
				prod22 = 1;
				prod23 = 1;
				prod24 = 1;		
				prod31 = 1;
				prod32 = 1;	
				prod33 = 1;
				prod34 = 1;		
				prod41 = 1;
				prod42 = 0;
				
			}
		
			else{
		
				$(".specialization span").removeClass("isclicked");					
				$(".martixOfProd_prod4_2 span").addClass("isclicked");		
				
				if (oclc == -1){
					$(".martixOfProd_html").css('min-height', '1400px');
					$(".isclicked").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					$(".prod42_menu").slideUp({duration: 'slow',easing: 'easeInOutExpo'});
					oclc = 1;
					prod42 = 1;
				}
				else{
					$(".martixOfProd_html").css('min-height', '1650px');
					$(".isclicked").slideDown({duration: 'fast',easing: 'easeInOutExpo'});
					$(".prod42_menu").slideDown({duration: 'slow',easing: 'easeInOutExpo'});
					oclc = -1;
					prod42 = 0;
				}
			}
		return false;
		});	
//----------------------------------------------------------------------------------------------//		
});