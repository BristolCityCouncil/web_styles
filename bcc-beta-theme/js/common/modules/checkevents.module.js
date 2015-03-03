/*****************************************************************\
  Check Events (passive)
/*****************************************************************\
 * This is an events extension to Radios and Checkboxes that 
 * adds the events 'check', 'uncheck', 'hsa_check' and
 * 'hsa_uncheck'. 
 * 
 * Check and Uncheck can be used anywhere, but HSA is exclusive
 * to FOI/complaints.
\*****************************************************************/

YUI().use(['module'], function(Y){
	
    var CheckEvents = Y.uk.gov.bristol.module.extend({

    		// Grab different sets of inputs
	    	DOM: {
	    		'radiosAndChecks' : 'input[type="radio"], input[type="checkbox"]',
	    		'radios' : 'input[type="radio"]',
	    		'checks' : 'input[type="checkbox"]'
	    	},

	    	// Different handles for the inputs
	    	events: {
	    		'change $radios' : "triggerRadioCheckUncheck",
	    		'change $checks' : "triggerCheckboxCheckUncheck",
	    		'check $checks' : 'removeError',
	    		'uncheck $checks' : 'addError',
	    	},

	    	checkNames : [],
	    	checkStatus : [],

	    	// Constructor
	    	render: function(){
	    		var self = this;
	    		// Loop through ALL radios and checkboxes and cache their checked value
	    		this.DOM.radiosAndChecks.each(function(){
	    			var name = $(this).attr('name'),
						uid = Math.random().toString(36).substr(2, 9);
					self.checkNames[name] = self.checkNames[name] ? self.checkNames[name] : [] ;
					$(this).attr('data-checkid',  $(this).is(":checked"));
					self.checkNames[name].push($(this));
	    		});
	    		return this;
	    	},
	    	/* Not sure why this is here. */
	    	addError: function(e){
	    		if($(e.currentTarget).attr('data-error') == 'true'){
	    			$(e.currentTarget).closest('form__item').addClass('.form__item--error');
	    		}
	    	},
	    	removeError: function(e){
	    		$(e.currentTarget).attr('data-error', 'true');
	    		$(e.currentTarget).closest('form__item').removeClass('.form__item--error');
	    	},

	    	//
	    	triggerRadioCheckUncheck: function(e){
	    		var check = $(e.currentTarget),
	    			name = check.attr('name'),
	    			delayedCheck = null;
	    		
	    		// Add a queue system here for HSA. The logic being:
	    		// queue the unchecks first, then the checks
				$.each(this.checkNames[name], function(k,v){
					if(v.attr('id')===$(e.currentTarget).attr('id')){
						delayedCheck = v; // delay this:
					}else{
						v.trigger('hsa_uncheck');
						v.trigger('uncheck');
					}
					return true;
				});

				delayedCheck.trigger('hsa_check');
				delayedCheck.trigger('check');
	    	},
	    	triggerCheckboxCheckUncheck: function(e){
	    		var check = $(e.currentTarget),
	    			name = check.attr('name'),
	    			delayedChecks = [];

				$.each(this.checkNames[name], function(k,v){
					if(v.attr('id')===$(e.currentTarget).attr('id')){
						var isc = (v.is(":checked"))? 'true' : 'false' ;
						if(isc === v.attr('data-checkid')) return;
						v.attr('data-checkid', v.is(":checked"));
						if(isc === 'true'){
							delayedChecks.push(v);
						}else{
							v.trigger('hsa_uncheck');
							v.trigger('uncheck');
						}
						return true;
					}
				});
				$.each(delayedChecks, function(k,v){
		    		v.trigger('hsa_check');
					v.trigger('check');
		    	});
	    	}
	    }),
    	module = new CheckEvents('.form');
});