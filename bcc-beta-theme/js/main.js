window.devenv = true; 
YUI().use('get', function(A){
	
	A.Get.script([

		// Priority Vendor
		'/bcc-beta-theme/js/common/vendor/priority/matchmedia.a.js',
		'/bcc-beta-theme/js/common/vendor/priority/matchmedia.addListener.js',
		'/bcc-beta-theme/js/common/vendor/priority/matchmedia.polyfill.js',


		// Vendor
		'/bcc-beta-theme/js/common/vendor/enquire.js',
		'/bcc-beta-theme/js/common/vendor/jquery-ui-1.10.3.custom.js',
		'/bcc-beta-theme/js/common/vendor/jquery.forms.js',	
		'/bcc-beta-theme/js/common/vendor/jquery.matchHeight.js',
		'/bcc-beta-theme/js/common/vendor/jquery.tabbable.js',
		'/bcc-beta-theme/js/common/vendor/module.js',
		
		
		// Widgets
	 	'/bcc-beta-theme/js/common/widgets/jquery.bcc.addresslookup.js',
		'/bcc-beta-theme/js/common/widgets/jquery.bcc.collapsetable.js',
	 	'/bcc-beta-theme/js/common/widgets/jquery.bcc.collapsible.js',
	 	'/bcc-beta-theme/js/common/widgets/jquery.bcc.listtable.js',
	 	'/bcc-beta-theme/js/common/widgets/jquery.bcc.overlays.js',
	 	'/bcc-beta-theme/js/common/widgets/jquery.bcc.sticky.js',
	 	'/bcc-beta-theme/js/common/widgets/jquery.bcc.validate.js',
	 	'/bcc-beta-theme/js/common/widgets/jquery.forms.js',
	 	'/bcc-beta-theme/js/common/widgets/jquery.placeholder.js',


	 	// Common Modules
	 	'/bcc-beta-theme/js/common/modules/attributes.module.js',
	 	'/bcc-beta-theme/js/common/modules/breakpoints.module.js',
	 	'/bcc-beta-theme/js/common/modules/buttonstates.module.js',
	 	'/bcc-beta-theme/js/common/modules/checkevents.module.js',
	 	'/bcc-beta-theme/js/common/modules/header.module.js',
	 	'/bcc-beta-theme/js/common/modules/hideshowattributes.module.js',
	 	'/bcc-beta-theme/js/common/modules/openValidation.module.js',
	 	'/bcc-beta-theme/js/common/modules/preventdoublesubmit.module.js',


	 	// Brand Elements
	 	'/bcc-beta-theme/js/brand/modules/addresslookup.module.js',
	 	'/bcc-beta-theme/js/brand/modules/errorhandling.module.js',
	 	'/bcc-beta-theme/js/brand/modules/events.module.js',
	 	'/bcc-beta-theme/js/brand/modules/fileupload.module.js',
	 	'/bcc-beta-theme/js/brand/modules/smoothscroll.module.js',


	 	// Services
	 	'/bcc-beta-theme/js/services/modules/complaints.module.js',
	 	'/bcc-beta-theme/js/services/modules/contactmethod.module.js',
	 	'/bcc-beta-theme/js/services/modules/parking.module.js',
	 	'/bcc-beta-theme/js/services/modules/permits.module.js',
	 	'/bcc-beta-theme/js/services/modules/waste.module.js',
	 	
	 	// Temp
	 	//'/bcc-beta-theme/js/services/testcases/waste.test.js',


	 	// Service (Non-Module)
	 	'/bcc-beta-theme/js/services/temp/vehicles.js',
	 	'/bcc-beta-theme/js/services/temp/zcomplaints.js', // refactored, not working

	 	// Config
	 	'/bcc-beta-theme/js/common/config.js',
	 	'/bcc-beta-theme/js/services/config.js',

	 	// Init
	 	'/bcc-beta-theme/js/common/init.js',
	 	'/bcc-beta-theme/js/brand/init.js',
	 	'/bcc-beta-theme/js/services/init.js'

	],
	{
		onSuccess: function(){

			// This function is not called on DEV, SIT, PREPROD or LIVE.
			
			//WasteSuite.run();
		}
	});
});
