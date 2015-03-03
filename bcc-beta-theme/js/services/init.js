YUI().use(
	'waste', 
	'button-states', 
	'breakpoints', 
	'address-lookup',
	'contact-method',
	/*'complaints',*/
	'parking',
	'smoothscroll',
function(Y){
	// JQuery FN (temp)
	$.fn.nextThrough = function(selector) {
	    // Our reference will be the last element of the current set
	    var $reference = $(this).last();
	    // Add the reference element to the set the elements that match the selector
	    var $set = $(selector).add($reference);
	    // Find the reference position to the set
	    var $pos = $set.index($reference);
	    // Return an empty set if it is the last one
	    if ($set.length == $pos) return $();
	    // Return the next element to our reference
	    return $set.eq($pos + 1);
	};
	
	// Bintable Module
	$('.bintable').binTable();

	// Smooth Sroll
	$("body").smoothScroll(); 

	$('.js--permitTotal').permitDetails();

	// Button States 
	$('body:has(button.cta)').buttonStates();

	// Address Lookup
	$('.js--address-lookup').addresslookup();

	// Parking - slab outline on focus.
	$('#parking__visitor-permits__choose').parkingFocusSlab();

	// JS Prevent Double Submit
	$('form:has(.js--prevent-double)').preventDoubleSubmit();

	// Enable docupload
	$(".docupload--enhanced").fileUpload();
	
	

	(function hideEmptyColumns(){

		if ($('.portlet-body').length > 0) { 

			// Bug #CPDP-4686, #CPDP-4686
			var side = $('.portlet-column.side');
			var isEmpty = $.trim( side.find('.portlet-body').html() ).length;
			
			if( isEmpty === 0 ) {
				//console.log("c");
				side.hide();
			}

		}

	})();
	
	
	
	
		
	// Form errors at the top of the page
	$("#errors a.error__item__link").headerErrors();
	
	$('.open-validation .open-validation__error').pageLoadValidation();


	$('[data-validate-max-characters]').openValidation({
		keyup: true,
		validation: function($el, $fieldset){
			var total = $fieldset.attr('data-validate-max-characters'),
				current = $el.val().length;
			
			if(current > total) return "You have used too many characters";
			$fieldset.find('.js--character-count').text(total - current);
		},
	});

	$('[data-validate-password]').openValidation({
		requiredMessage: 'Please fill this in',
		keyup: false,
		validation: function($el){
			
			// Check length of password
			if($el.val().length < 7)
				return 'Your password must be 8 characters long';

			//Make sure passwords match
			var match = $el.val(), showerror = false, oneempty = false;

			this.DOM.textFormElements.each(function(){
				if($(this).val() === "")
					oneempty = true;
				if(match != $(this).val())
					showerror = true;
			});

			if(!oneempty && showerror)
				return 'Passwords must match';

		},
	});

	$('[data-validate-expect]').openValidation({
		validation: function(el, parent){
			if(el.val() !=  parent.attr('data-validate-expect') )
				return (parent.attr('data-validate-expect-message')) ? parent.attr('data-validate-expect-message')  : 'Please choose a valid option';
			return false;
		}
	});

	$('.field:has([required]), .field[required]').openValidation();

	$('[data-validate-postcode]').openValidation({
		requiredMessage: 'Please enter a valid UK postcode',
		validation: function(el){
			var reg = "^(GIR ?0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]([0-9ABEHMNPRV-Y])?)|[0-9][A-HJKPS-UW]) ?[0-9][ABD-HJLNP-UW-Z]{2})$";
			if(el.val().toUpperCase().match(reg))
				return false;
			return "You must enter a valid UK postcode";
		},
	});

	$('.form__item:has(.js--controls--country)').contactMethod();

	// Keep session alive.
	if($('[data-extend-session]').length){
		var extendLink = $('[data-extend-session]').attr('data-extend-session');
		setTimeout(function(){ Liferay.Session.extend(); }, (1000*extendLink) );
	}

});
// Safari Bugfixing on submits
var fixcache = function(){ $('.js--prevent-double').prop("disabled", false).removeAttr("disabled").removeClass('disabled').html($('.js--prevent-double').attr('data-html-value')); };
window.pageshow = function(event){ if (event.persisted) fixcache(); };
window.onpageshow = function(event) { if (event.persisted) fixcache(); };
$(window).on('unload', function(){ /*$(this).unbind('unload'); fixcache(); */
	   }).on('load',   function(){
	
	// More scroll Fixes.
	if (window.location.hash) window.location = window.location.hash;
	// IE 7-8 Loading fix see Bug #CPDP-2761 & #CPDP-3187
	if('\v'=='v'){
		setTimeout(function(){
			$('.icon--bcc').addClass('iefixicons').removeClass('iefixicons');							
		}, 150);
		$('html').addClass('ie8');
	}
});



// IE8 Class
if('\v'=='v'){$('html').addClass('ie8');}

// Windows Chrome bugfix for Sticky Nav
// This fix is not needed
$(window).trigger('resize');

// VALIDATION
$('.js--validate').validate();

// form placeholders
// Are we using these?
$('input, textarea').placeholder();




// TABS
// !! Change to js--
$('.js--tabs').tabs();

//COLLAPSIBLE TABLE
$('.js--collapse').collapsible();

//COLLAPSE TABLE
$('.js--collapse-table').collapsetable();


$('select.form__item__field--select--block, .form__item__field[type=radio], .form__item__field[type=checkbox]')
	.uniform({
		wrapperClass: 'uniform',
		selectClass: 'uniform__select--block',
		radioClass: 'uniform__radio',
		checkboxClass: 'uniform__checkbox'
	});
	
$('select.form__item__field--select--inline')
	.uniform({
		wrapperClass: 'uniform',
		selectClass: 'uniform__select--inline'
	});

//@TODO: Next line needs explaining as to why... and probably needs refactoring as it's brittle
$('.uniform__checkbox:has(.form__item__field--checkbox--large)').addClass('uniform__checkbox--large');






(function MobileFormFix(){
	// See bugs #CPDP-2338 #CPDP-2740
	 if(window.innerWidth > 1024) return;
	$('*[data-primary-submit]').each(function(){
		var $btn = $(this),
			$form = $btn.closest("form"),
			$el = $(this).clone();

		$el.css({
			'position' : 'absolute',
			'visibility' : 'hidden',
		});
		$form.prepend($el);
	});

})();

//Mobile Tabs - fluid
(function MobileTabs () {
	// Only for smaller windows
	if(window.innerWidth > 480) return;
	// Bunched to avoid thrashing
	var count = 0, // original overflowing width of tabs
	 	$tablist = $('*[role="tablist"]').children(), // tablist
	    tabListWidth = $('*[role="tablist"]').width(); // width of tablist (100% of window minus padding)

	$tablist.each(function(e) {
	    count += $(this).width(); // add the widths of tabs
	});

	if (count > tabListWidth) { //if the tabs overflow
	 	// loop over the tabs
	    $tablist.each(function(e) {
	     	// Bunched to avoid thrashing
	        var $tab = $(this),
	         	$tablinks = $tab.find('a'),
	         	owid = ($tab.width() / count) * 100; // new % value for fluid tabs

	         // Add width CSS to tabs
	         $tab.css({
	            width: owid + '%',
	         });

	         // OPTIMISATION: Make CSS Class?
	         // Some fluid changes to tabs
	         $tablinks.css({
	            'padding': '0px',
	            'width': '100%',
	            'text-align': 'center',
	            'font-size' : '16px',
	        });
	    });
	}

	
})();