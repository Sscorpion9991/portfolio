$(document).ready(function(){

	kApp.document.initHelpByOid(true,'sysinfo',kApp.document.nd);
	$('#saveUserData').click(function() {
		window.location = '/makeudatacopy';
	});
});
