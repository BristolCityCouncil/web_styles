/*****************************************************************\
  Contact method
/*****************************************************************\
 * This module reacts to the country choosing dropdown menu and
 * shows an 'other' input box if they selected other from the
 * menu. 
 *
 * NOTE: This is a port of previous code and may still need 
 * optimised to support ALL dropdowns that may have a option for
 * other.
 * 
\*****************************************************************/
YUI().add('contact-method', function(Y){

	Y.namespace("uk.gov.bristol");

	// .form__item:has(.js--controls--country)

	Y.uk.gov.bristol.contactMethod = Y.uk.gov.bristol.module.extend({

		DOM: {
			'country' : '.js--controls--country',
			'otherbox' : ' ~ .js--controls--other > *',
			'errorMessage' : '.form__item__message--error',
		},
		events: {
			'change $country' : 'changeCountry'
		},
		render: function(){
			var value = this.$el.find("option:selected").val();
			if(value != "other")
				this.DOM.otherbox.hide();
			// hack
			$( ".js--controls-group .js--controls--country" ).trigger('change');
		},
		changeCountry:function(e){
			var value = this.$el.find("option:selected").val();
			if(value == "other"){
				this.DOM.otherbox.show();
				this.DOM.errorMessage.attr('style', '');
			}else{
				this.DOM.otherbox.hide();
			}

		},
		pluginName: 'contactMethod',

	});

}, "1.0.0" ,{
	'requires' : ['module']
});