/**
 * @fileOverview A jQuery UI Widget to handle form validation
 * @author Luke Taylor
 * @name $.bcc.validate
 * @dependencies: jQuery, jQuery UI widget factory
 */
(function($){
	
	'use strict';
	
	// !! Can we remove?
	// This is not an elegant solution
	$(".js--controls-group .js--required").prop('required', true);

  	$.widget('bcc.validate', {

  		// default options
  		options: {
  			
  			// template used for errors
  			errorMessageTemplate: '<div class="form__item__error">$message$</div>',
      
  			// use aria for accessibility
  			useAria: true,
  			
  			// error message element
  			errorMessageElement: '.form__item__message--error',
      
  			// attribute for match validation
  			matchAttribute: 'data-match',
      
  			// element to add error class too
  			errorElement: '.form__item',
      
  			// error class to add to above element
  			errorClass: 'form__item--error',
      
  			// blurred indicator class
  			blurIndicatorClass: 'form__item--blurred',

  			// Fieldset Class
  			fieldSetClass: '.form__set',

  			fieldSetErrorClass : 'form__set--error',
      
  			// whether or not to validate on key up
  			keyUpValidation: true
      
  			// backend error class
  			//backendErrorClass: 'form__item--backend-error'
    	  
  		},

		/**
		 * create - private
		 */
  		_create: function () {

  			// element and target
  			var element = $(this.element);
  			var target = this;

  			// disable html5 form validation
  			element.attr('novalidate', 'novalidate');

  			// validate all inputs / textareas that are required
  			this._requiredValidate(element, target);
	
  			// validate all inputs / textareas with a pattern attribute
  			this._patternValidate(element, target);
	
  			// validate appropriate selects
  			this._selectValidate(element, target);
	
  			// validate appropriate checkboxes
  			this._checkboxValidate(element, target);
	
  			// validate match elements
  			this._matchValidate(element, target);
  		},


	    /**
	     * requiredValidate - private
	     */
	    _requiredValidate: function (element, target) {

		    // function to check if valid and style accordingly
		    function check(e) {
		    	
		    	//console.log("checking...");
		    	if (e.val() !== '') {
		    		
		    		// If not empty
		    		
		    		e.closest(target.options.errorElement).removeClass(target.options.errorClass);
		    		//console.log("NOT EMPTY:target.options.errorElement:  "+target.options.errorElement);
		    		
		    		// if we are using aria tags to hide content from screenreaders
		    		if (target.options.useAria) {
		    			e.closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', true);
		    		}
		    		if(e.closest(target.options.fieldSetClass).length && !(e.closest(target.options.fieldSetClass).find("."+target.options.errorClass).length)){
		    			var fieldset = e.closest(target.options.fieldSetClass);
		    			fieldset.removeClass(target.options.fieldSetErrorClass);
		    			fieldset.parent().find('h2').removeClass('invalid');
		    		}
		    		
		    	} else {
		    		
		    		// If empty
		    		
		    		e.closest(target.options.errorElement).addClass(target.options.errorClass);
		    		//console.log("EMPTY:target.options.errorElement: "+target.options.errorElement);
		    		// if we are using aria tags to hide content from screenreaders
		    		if (target.options.useAria) {
		    			e.closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', false);
		    		}
		    		if(e.closest(target.options.fieldSetClass).length){
		    			e.closest(target.options.fieldSetClass).addClass(target.options.fieldSetErrorClass);
		    			e.closest(target.options.fieldSetClass).parent().find('h2').addClass('invalid');
		    		}
		    		
		    	}
		    }
		    
		    // validate appropriate elements on blur
		    element.find('input[required], textarea[required]').blur(function () {
	        
		    	// check
		    	check($(this));
	        
		    	// add class that allows keyup validation
		    	$(this).addClass(target.options.blurIndicatorClass);
	        
		    	// remove backend error class
		    	//$(this).closest(target.options.errorElement).removeClass(target.options.backendErrorClass);
		    
		    });
	
		    // validate appropriate elements on keyup
		    if (target.options.keyUpValidation) {
	        
		    	element.find('input[required], textarea[required]').keyup(function () {
		    	
			    	if ($(this).is('.' + target.options.blurIndicatorClass)) {
			    		// check
			    		check($(this));
			    	}
			    	
			    });
		    }
		},
	
	    /**
	     * patternValidate - private
	     */
	    _patternValidate: function (element, target) {
	
	    	// function to check if valid and style accordingly
	    	function check(e, re) {
	    		
	    		if (re.test(e.val())) {
	    		
	    			e.closest(target.options.errorElement).removeClass(target.options.errorClass);
	    			
	    			// if we are using aria tags to hide content from screenreaders
	    			if (target.options.useAria) {
	    				e.closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', true);
	    			}

	    			if(e.closest(target.options.fieldSetClass).length && !(e.closest(target.options.fieldSetClass).find("."+target.options.errorClass).length)){
		    			e.closest(target.options.fieldSetClass).removeClass(target.options.fieldSetErrorClass);
		    			e.closest(target.options.fieldSetClass).parent().find('h2').removeClass('invalid');
		    		}
	    			
	    		} else {
	    			
	    			e.closest(target.options.errorElement).addClass(target.options.errorClass);
	          
	    			// if we are using aria tags to hide content from screenreaders
	    			if (target.options.useAria) {
	    				e.closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', false);
	    			}

	    			if(e.closest(target.options.fieldSetClass).length){
		    			e.closest(target.options.fieldSetClass).addClass(target.options.fieldSetErrorClass);
		    			e.closest(target.options.fieldSetClass).parent().find('h2').addClass('invalid');
		    		}
	    		}
	    	}
	
	    	// validate appropriate elements on blur
	    	element.find('input[pattern], textarea[pattern]').blur(function () {
	        
	    		// get value and create reg ex from pattern
	    		var re = new RegExp($(this).attr('pattern'));
	        
	    		// check
	    		check($(this), re);
	        
	    		// add class that allows keyup validation
	    		$(this).addClass(target.options.blurIndicatorClass);
	        
	    		// remove backend error class
	    		//$(this).closest(target.options.errorElement).removeClass(target.options.backendErrorClass);
	    	});
	
	    	// validate appropriate elements on keyup
	    	if (target.options.keyUpValidation) {
	    		
	    		element.find('input[pattern], textarea[pattern]').keyup(function () {
	    		
		    		if ($(this).is('.' + target.options.blurIndicatorClass)) {
		    			
		    			// get value and create reg ex from pattern
		    			var re = new RegExp($(this).attr('pattern'));
		    			check($(this), re);
		    		}
		    	});
		    }
	    },
	
	    /**
	     * selectValidate - private
	     */
	    _selectValidate: function (element, target) {
	
	    	// remove / show error on appropriate select change
	    	element.find('.form__item__field--select[required]').change(function () {
	    		
	    		// if first option is selected show error and add error styling else hide the error and remove error styling
	    		if (this.selectedIndex === 0) {
	    			
	    			$(this).closest(target.options.errorElement).addClass(target.options.errorClass);
	          
	    			// if we are using aria tags to hide content from screenreaders
	    			if (target.options.useAria) {
	    				$(this).closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', false);
	    			}
	    			
	    		} else {
	    			
	    			$(this).closest(target.options.errorElement).removeClass(target.options.errorClass);
	          
	    			// if we are using aria tags to hide content from screenreaders
	    			if (target.options.useAria) {
	    				$(this).closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', true);
	    			}
	    			
	    		}
	    	});
	
	    	// perform same action on blur of appropriate select
	    	element.find('.form__item__field--select').blur(function () { $(this).trigger('change'); });
	
	    },
	
	    /**
	     * checkboxValidate - private
	     */
	    _checkboxValidate: function (element, target) {
	
	    	// remove / show error on appropriate checkbox change
	    	// .form__item__field--checkbox[required]
	    	element.find('.form__item__field--checkbox .js--controls--email').change(function () {
	        
	    		// error logic
	    		// Note: Script can only validate one checkbox
	    		if (!$(this).prop('checked')) {
	    			
	    			//console.log("not :checked");
	          
	    			$(this).closest(target.options.errorElement).addClass(target.options.errorClass);
	          
	    			// if we are using aria tags to hide content from screenreaders
	    			if (target.options.useAria) {
	    				$(this).closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', false);
	    			}
	    		} else {
	    			
	    			//console.log("is :checked");
	    			
	    			$(this).closest(target.options.errorElement).removeClass(target.options.errorClass);
	    			
	    			// if we are using aria tags to hide content from screenreaders
	    			if (target.options.useAria) {
	    				$(this).closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', true);
	    			}
	    		}
	      });
	
	      // perform same action on blur of appropriate checkbox
	      element.find('.form__item__field--checkbox').blur(function () { $(this).trigger('change'); });
	   },
	
	    /**
	     * matchValidate - private
	     */
	    _matchValidate: function (element, target) {
	
		    // validate appropriate match element
	    	element.find('input[' + target.options.matchAttribute + '], textarea[' + target.options.matchAttribute + ']').blur(function () {
	        
	    		// define the element to match
	    		var elementToMatch = '#' + $(this).attr(target.options.matchAttribute);
	
	    		// error logic
	    		if ($(this).val() !== $(elementToMatch).val()) {
				   
	    			$(this).closest(target.options.errorElement).addClass(target.options.errorClass);
				   
	    			// if we are using aria tags to hide content from screenreaders
	    			if (target.options.useAria) {
	    				$(this).closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', false);
	    			}
	    			if($(this).closest(target.options.fieldSetClass).length){
		    			$(this).closest(target.options.fieldSetClass).addClass(target.options.fieldSetErrorClass);
		    			$(this).closest(target.options.fieldSetClass).parent().find('h2').addClass('invalid');
		    		}
				   
	    		} else {
				   
	    			$(this).closest(target.options.errorElement).removeClass(target.options.errorClass);
				   
	    			// if we are using aria tags to hide content from screenreaders
	    			if (target.options.useAria) {
	    				$(this).closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', true);
	    			}

	    			if($(this).closest(target.options.fieldSetClass).length && !($(this).closest(target.options.fieldSetClass).find("."+target.options.errorClass).length)){
		    			
		    			$(this).closest(target.options.fieldSetClass).removeClass(target.options.fieldSetErrorClass);
		    			$(this).closest(target.options.fieldSetClass).parent().find('h2').removeClass('invalid');
		    		}
	    		}
			   
	    		// add class that allows keyup validation
	    		$(this).addClass(target.options.blurIndicatorClass);
	        
	    		// remove backend error class
	    		//$(this).closest(target.options.errorElement).removeClass(target.options.backendErrorClass);
	    	});
	
	    	// validate appropriate elements on keyup
	    	if (target.options.keyUpValidation) {
	    		
	    		element.find('input[' + target.options.matchAttribute + '], textarea[' + target.options.matchAttribute + ']').keyup(function () {
	          
	    			//console.log("A");
	    			
	    			if ($(this).is('.' + target.options.blurIndicatorClass)) {
	    				
	    				// define the element to match
	    				var elementToMatch = '#' + $(this).attr(target.options.matchAttribute);
	            
	    				// error logic
	    				if ($(this).val() !== $(elementToMatch).val()) {
	    					
	    					//console.log("B");
	    					
	    					$(this).closest(target.options.errorElement).addClass(target.options.errorClass);
	    					
	    					// if we are using aria tags to hide content from screenreaders
	    					if (target.options.useAria) {
	    						$(this).closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', false);
	    					}
	    					
	    				} else {
	              
	    					$(this).closest(target.options.errorElement).removeClass(target.options.errorClass);
	    					
	    					// if we are using aria tags to hide content from screenreaders
	    					if (target.options.useAria) {
	    						$(this).closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', true);
	    					}
	    					
	    				}
	    				
	    			}
	    		});
	    	}
    	}
  	});
})(jQuery);