/*****************************************************************\
  Address Lookup Module
/*****************************************************************\
 * This module reacts to the address lookup dropdown menu and
 * shows a green affirmation panel of the current address.
 *
\*****************************************************************/

YUI().add(['address-lookup'], function(Y){

    Y.namespace('uk.gov.bristol').AddressLookup = Y.uk.gov.bristol.module.extend({

        // Grab the DOM elements
    	DOM: {
    		'dropdown' : 'select',
    	},
    	
        // Delegate the dropdown changing event
        events: {
    		'change $dropdown' : 'renderTemplate',
    	},

        // Assign jQuery plugin name
    	pluginName : "addresslookup",

        // Default options
    	options: {
    		advancedClass: 'address-lookup--isActive',
			dynamicAddressClass: 'address-lookup--isSelected',
			dynamicAddressTemplate: function(klass, message){ 
				return '<div class="panel panel--affirm panel--date info info--affirm info--reverse '+klass+'"><span class="panel__title">Your selected address:</span><strong class="panel__copy info__copy">'+message+'</strong></div>'; 
			},
    	},

        // Constructor
    	render: function(){

    		this.$el.addClass(this.options.advancedClass);
    		if(this.DOM.dropdown)
				this.renderTemplate();
    	},

        // Renders the address using the passed in template from options
    	renderTemplate: function(){

            // remove the old templates
    		this.removeOldTemplate();
            
            // Dont render if there is no selected address
            if (this.optionNoSelected()) return;

            // Find the parent formitem (Old form elements)
    		this.DOM.dropdown.closest('.form__item').append(
                // add the dynamic template passing in the selected option
				this.options.dynamicAddressTemplate(this.options.dynamicAddressClass, this.$el.find('option:selected').text())
			);

            // Find the closest field (New form elements)
            this.DOM.dropdown.closest('.field').append(
                // add the dynamic template passing in the selected option
                this.options.dynamicAddressTemplate(this.options.dynamicAddressClass, this.$el.find('option:selected').text())
            );
    	},

        // Checks to see if an address was selected
    	optionNoSelected: function(){
    		return !!(this.DOM.dropdown[0].selectedIndex === 0 || this.DOM.dropdown[0].selectedIndex === -1);
    	},

        /// Removed the old address from DOM.
    	removeOldTemplate: function(){
    		if($('.'+this.options.dynamicAddressClass).length)
    			$('.'+this.options.dynamicAddressClass).remove();
    	}
        
    });

});