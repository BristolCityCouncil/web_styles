/*****************************************************************\
  Error Handling (passive)
/*****************************************************************\
 * This is a method that checks if there is errors in the error
 * panel at the top of pages which require validation.
\*****************************************************************/

YUI().add(['open-validation'], function(Y){
	

    Y.namespace('uk.gov.bristol').openValidation = Y.uk.gov.bristol.module.extend({

		pluginName: 'openValidation',
		
		// Gran the radios and checks
		DOM: {
			'formElements': 'input[type="radio"], input[type="checkbox"]',
			'textFormElements': 'input[type="text"], input[type="password"], textarea',
			'dropElements': 'select',
			'required' : 'input[type="radio"][required], input[type="checkbox"][required]',
			'requiredText' : 'input[type="text"][required], input[type="password"][required], textarea[required]',
			'requiredDrops': 'select[required]',
			'error' : '.field__message--error',
		},

		// Blur and change events for validation
		events: {
			/** Radios and Checks **/
			'blur $required' : 'validateRequired',
			'change $required' : 'validateRequired',
			'change $formElements' : 'validate',

			/** Text **/
			'blur $requiredText' : 'validateRequiredString',
			//'keydown $requiredText' : 'validateRequiredString',
			'change $textFormElements': 'validateText',
			'keyup $textFormElements': 'validateText',
			//'keydown $textFormElements' : 'validateText',

			/** Dropdowns **/
			'blur $requiredDrops' : 'validateRequiredDrop',
			'change $requiredDrops' : 'validateRequiredDrop',
			'change $dropElements' : 'validateDrop'
		},

		// On startup do things
		render: function(){

			this.$el.attr('data-open-validation-irte', true);

			// check if the parent element has required attribute
			if(this.$el.attr('required')){

				// if it does, bind required events to all elements inside.
				this.DOM.formElements.on('blur', this.validateRequired.bind(this));
				this.DOM.formElements.on('change', this.validateRequired.bind(this));
				this.DOM.textFormElements.on('blur', this.validateRequiredString.bind(this));
				//this.DOM.textFormElements.on('keydown', this.validateRequiredString.bind(this));
				this.DOM.dropElements.on('blur', this.validateRequiredDrop.bind(this));
				this.DOM.dropElements.on('change', this.validateRequiredDrop.bind(this));

			}
			if(this.options.targetError){
				this.DOM.error = $(this.options.targetError);
			}


			// Create the error message, and put it in the right place
			this.createError();

			this.parentGroup = this.$el.closest('.field--group');

			if(!this.parentGroup.length)
				this.parentGroup = 0;
		},
		
		// was there a validation error?
		validateError: 0,
		
		// was there a required error?
		requiredError: 0,

		// default error messages
		options: {
			
			// Default message for when an element is required
			requiredMessage: function(){
				return this.$el.attr('data-validate-required-message') ? this.$el.attr('data-validate-required-message') : "This field is required";
			},

			// Default option for text inputs to validate on keyup
			keyup: true,

			// create an error element
			createErrorElement: false,

			ensureErrorElement: true
		},

		createError: function(){
			if(this.options.createErrorElement || (!this.DOM.error.length && this.options.ensureErrorElement)){
				if(this.$el.next('.field__message').length){
					this.DOM.error = this.$el.next('.field__message');
				}
				this.DOM.error = $("<div/>", { "class" : "field__message field__message--error"}).appendTo(this.$el);
			}
		},

		validateText: function(e){

			if(!this.options.keyup && $(e.currentTarget).is(':focus'))
				return;

			// check for the option
			if(this.options.validation){

				// grab the function & call it
				var error = this.options.validation.call(this, $(e.currentTarget), this.$el);

				// if it returns TRUE then it errored
				if(error){

					// add flag to tell the app that there is an outstanding validation error
					this.validateError = 1;

					// add error to page
					this.addError(error);

				}else{

					// if it returns FALSE then it validated
					this.validateError = 0;

					// Recheck required (since it may have just been checked)
					this.validateRequiredString(e);

					// Remove error
					this.removeError();
				}
			}
		},
		validateRequiredDrop: function(e){

			if(!$(e.currentTarget).prop("selectedIndex")){

				// set required error
				this.requiredError = 1;

				// show the error
				this.addError(this.getRequiredMessage());
			}else{

				// unset required error
				this.requiredError = 0;

				// hide the error(s)
				this.removeError();
			}
		},
		validateRequiredString: function(e){

			// check if input is empty
			if($(e.currentTarget).val() === ""){
			
				// set required error
				this.requiredError = 1;

				// show the error
				this.addError(this.getRequiredMessage());
			
			}else{

				// unset required error
				this.requiredError = 0;

				// hide the error(s)
				this.removeError();
			}

		},
		validateDrop: function(){

		},
		// Validate if required
		validateRequired: function(e){
			// find the checked ones
			if(this.DOM.formElements.filter(':checked').length){

				// reset the required error 
				this.requiredError = 0;

				// and remove the error from the page
				return this.removeError();
			}

			// add flag to tell the app that there is an outstanding required error
			this.requiredError = 1;
			
			// add the error top the page 
			return this.addError(this.getRequiredMessage());
		},

		// Validate if there is an option passed through
		validate: function(e){

			// check for the option
			if(this.options.validation){

				// grab the function & call it
				var error = this.options.validation.call(this, $(e.currentTarget), this.$el);

				// if it returns TRUE then it errored
				if(error){

					// add flag to tell the app that there is an outstanding validation error
					this.validateError = 1;

					// add error to page
					this.addError(error);

				}else{

					// if it returns FALSE then it validated
					this.validateError = 0;

					// Recheck required (since it may have just been checked)
					this.validateRequired(e);

					// Remove error
					this.removeError();
				}
			}
		},

		// Add error to page
		addError: function(error){

			// Adds it to the parent (fieldset or field)
			this.$el.attr('data-error', error);

			// Add error class
			this.$el.addClass('field--error');

			// If there is a parent group
			if(this.parentGroup) 
				this.parentGroup.addClass('field--error'); // add the error
			
			
			// Add error message to predefined error element(s)
			this.DOM.error.html(error);
		},


		// This function removes an error from the parent field if there are no more errors.
		groupObserve: function(){

			// Return if there is no parent group
			if(!this.parentGroup) return;

			// Cache the inputs
			this.parentGroupInputs = (this.parentGroupInputs) ? this.parentGroupInputs: this.parentGroup.find('.field');

			//console.log(this.parentGroup, this.parentGroupInputs.is('.field--error').length);

			// Check for errors
			if(!this.parentGroupInputs.filter('.field--error').length)
				this.parentGroup.removeClass('field--error'); // and remove the class.

		},

		// Remove error
		removeError: function(){
			
			// checks for outstanding errors
			if(this.validateError || this.requiredError) return;

			// then removes from the parent
			this.$el.removeAttr('data-error');

			// Remove the error class, which also hides error element(s)
			this.$el.removeClass('field--error');

			// Observe the changes in the group if there is one
			this.groupObserve();

		},

		getRequiredMessage: function(){
			if(typeof this.options.requiredMessage === 'function'){
				return this.options.requiredMessage.call(this);
			}
			return this.options.requiredMessage;
		},

	});


	
	Y.namespace('uk.gov.bristol').pageLoadValidation = Y.uk.gov.bristol.module.extend({

		pluginName: 'pageLoadValidation',

		render: function(){

			var targets = this.getTargets(),
				message = this.getMessage();

			for (var i = targets.length - 1; i >= 0; i--) {
				this.generateMessage(targets[i], message);
			}
			
		},
		getTargets: function(){
			return (this.$el.attr('data-ov-target')) ? this.$el.attr('data-ov-target').split(',') : [this.$el.find('a').attr('href')] ;
		},
		getMessage: function(){
			return (this.$el.attr('data-ov-error')) ? this.$el.attr('data-ov-error') : this.$el.find('a').html();
		},
		generateMessage: function(selector, message){
			var $el = this.containerAware($(selector));
			$el.field.addClass('field--error');
			$el.message.html(message);
			$el.input.one('change', function(){ $el.message.html(''); });
			if(!$el.field.attr('data-open-validation-irte') && !$el.field.closest('[data-open-validation-irte]').length) {
				this.bindResolution($el);
			}
		},
		bindResolution: function($el){
			$el.target.OpenValidationOrbit();
		},
		containerAware: function($el){

			var input = ($el.is('input') || $el.is('select') || $el.is('.drop') || $el.is('textarea')) ? $el : null;
			if(!input) input = $el.find('input, .drop, textarea');
			
			var field = input.closest('.field'),
				fieldset = (field.closest('.field--set').length) ? field.closest('.field--set') : (
					(field.closest('.field--group').length) ? field.closest('.field--group') : null
				),
				message = (field.find('.field__message').length) ? field.find('.field__message') : (
					(field.next('.field__message').length) ? field.next('.field__message') : (
						$el.next('.field__message').length ? field.next('.field__message') : null
					)
				) ;

			return this.ensureMessageElement({
				'field': field,
				'fieldset': fieldset,
				'input': input,
				'target': $el ,
				'message': message,
				'orbit': (fieldset) ? fieldset:  field,
			});
		},
		ensureMessageElement: function($el){
			if($el.message) return $el;
			$el.message = $('<div class="field__message field__message--error" />');
			if($el.target.is('.field--set') || $el.target.is('.field--group')){
				$el.target.after($el.message);
			}else{
				$el.target.append($el.message);
			}
			return $el;
		},

	});

	Y.namespace('uk.gov.bristol').OVOrbit = Y.uk.gov.bristol.module.extend({

		pluginName: 'OpenValidationOrbit',

		render: function(){
			this.orbiter = this.findOrbiter(this.$el);
			if(!this.orbiter.attr('data-open-validation-orbiter')){
				var self = this;
				this.orbiter.on('change', 'input, textarea, select', function(){
					$(this).closest('.field').removeClass('field--error');
					self.check();
				});
				this.orbiter.attr('data-open-validation-orbiter', true);
			}

		},

		check: function(){
			if(!this.orbiter.find('.field--error').length)
				this.orbiter.removeClass('field--error');
		},

		findOrbiter: function(field){
			return (field.closest('.field--set').length) ? field.closest('.field--set') : (
				(field.closest('.field--group').length) ? field.closest('.field--group') : (
					(field.closest('.field')) ? field.closest('.field') : (
						(field.is('.field')) ? field : null
					)
				)
			);
		},

	});



	/*

	Y.namespace('uk.gov.bristol').pageLoadValidation = Y.uk.gov.bristol.module.extend({

		pluginName: 'pageLoadValidation2',

		DOM: {
			"errors" : ".open-validation__error",
		},

		events: {

		},

		render: function(){

				var target = this.$el.attr('data-ov-target'),
					message = (this.$el.attr('data-ov-error')) ? this.$el.attr('data-ov-error') : false ,
					isIndividual = this.$el.attr('data-ov-individual');

				if(!message)
					message = this.$el.find('a').html();

				if(!target)
					target = this.$el.find('a').attr('href');

				if(isIndividual)
					return this.showIndividualError(target, message);

				this.showError(target, message);


		},

		bindResolution: function(field){
			// Delegate the field group resolution
			if(field.is('.field--group'))
				return this.bindGroupResolution(field);

			var inputs = field.children('input[type="password"], input[type="email"], input[type="text"], textarea'),
				radioschecks = field.children('input[type="radio"], input[type="checkbox"]'),
				selects = field.find(" > .drop select"),
				numberOfErrors = inputs.length,
				self = this,
				singleEvent = function(){
					// reduce the errors
					numberOfErrors--;
					// If we hit zero
					if(numberOfErrors <= 0){
						// remove the message
						field.removeClass('field--error');
					}
				};

			// Bind a single event to the dropdowns (seperate selector)
			selects.one('change', singleEvent);

			// Bind a single event to the inputs
			inputs.one('keyup',singleEvent );

			// Bind a single event to all the radios
			radioschecks.one('change', function(){
				field.removeClass('field--error');
			});
		},

		bindGroupResolution: function(field){
			var allFields = field.find('.field--error');

			field.on('change keyup', 'input, textarea, select', function(e){
				if(field.find('.field--error').length <= 0)
					field.removeClass('field--error').off(e);						
			});

		},
			// Look into combining group resolution and group observation
		// 	var inputs = field.find("input, textarea, select");
		// 	inputs.change(function(e){
		// 		if(!field.find('.field--error').length){
		// 			field.removeClass('field--error');
		// 			$(this).off(e);
		// 		}
		// 	});
		// },
		// setupGroupObserve: function(group){
		// 	var self = this;
		// 	console.log();
		// 	group.find('input, textarea, select').on('change',function(){
		// 		console.log('changed', $(this).closest('.field--group'));
		// 		self.groupObserve($(this).closest('.field--group'));
		// 	});
		// },
		groupObserve: function(parentGroup){
			// Return if there is no parent group
			if(!parentGroup) return;

			// Cache the inputs
			parentGroupInputs = parentGroup.find('.field');

			//console.log(this.parentGroup, this.parentGroupInputs.is('.field--error').length);

			// Check for errors
			if(!parentGroupInputs.filter('.field--error').length)
				parentGroup.removeClass('field--error'); // and remove the class.

		},

		showError: function(target, message){
			// @TODO, find all fields and add the un-error thing.
			if(!message) return;
			var self = this;
			$(target).each(function(){
				var tag = $(this);
				if(!tag.is('.field'))
					tag = $(this).closest('.field');
				var messageTag = tag.find('.field__message--error').first();
				if(!messageTag.length){
					messageTag = self.generateMessage(message);
					if(tag.is('.field--group'))
						tag.after(messageTag);
					else
						tag.append(messageTag);
				}else{
					messageTag.html(message);
				}

				tag.addClass('field--error');

				self.bindResolution(tag);

			});
		},
		newgenMessage: function(tag, message){
			var mtag = tag.closest('.field').find('.field__message');
			if(!mtag.length)
				mtag = tag.next('.field__message');
			if(!mtag.length)
				return mtag = this.generateMessage(message);
			if(message)
				mtag.html(message);
		},
		showIndividualError: function(target, message){
			var self = this;
			$(target).each(function(){
				var tag = $(this);

				self.newgenMessage(tag, message);

				if(!tag.is('.field'))
					tag = $(this).closest('.field');
				// if($(this).is('input'))
				// 	self.bindValidationEvent($(this));
				tag.addClass('field--error');
				self.bindResolution(tag);
			});
		},
		generateMessage: function(message){
			if(!message) return '';
			return '<div class="field__message field__message--error">'+message+'</div>';
		},
		bindValidationEvent: function($el){
			$el.on('change', function(){
				$(this).closest('.field').removeClass('field--error');
			});
		}
	});

	var groupObserver = Y.uk.gov.bristol.module.extend({

		pluginName: 'observe',

		options: {
			'change': null
		},

		render: function(){
			if(this.options.change) {
				var self = this;
				this.$el.on('change', 'input, textarea', function(){
					self.options.change.call(this, $(this), self.$el);
				});
			}
		},


	});
*/

},'1.0.0' , {
    requires: ['module']
});