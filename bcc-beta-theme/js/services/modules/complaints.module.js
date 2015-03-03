// Beasting complaints module
/*
YUI().add('complaints', function(Y){

	var complaints = Y.uk.gov.bristol.module.extend({

		DOM: {
			'corr' : '#corr',
			'choiceA' : '#choice1',
			'choiceB' : '#choice2',
			'choiceC' : '#choice3',
			'pathA' : '#path1',
			'pathB' : '#path2',
			'pathC' : '#path3',
			'radios' : "input[name='actor']",
			'jsSubmitButton' : '#complaintsJSSubmit',
			'submitButton' : '#field-submitPathway',
			'confirmEmail' : '#confirm-your-email',
			'addMyAddress' : '#field-addmyaddressCheckbox',
		},

		pluginName: 'complaints',

		events: {
			'uncheck $choiceA' : 'triggerResponse',
			'check $choiceA' : 'handleChoiceA',
			'check $choiceB' : 'triggerResponse',
			'uncheck $choiceC' : 'triggerResponse',
			'check $corr' : 'showPathA',
			'uncheck $corr' : 'hidePathA',
			'change $radios' : 'showSubmit'
		},

		render: function(){

			if(this.DOM.radios.is(":checked"))
				$('#field-submitPathway').attr('style', 'display: none');

			if ($(".path").length === 0)
		    	$( "#complaintsJSSubmit").trigger("click"); // server refresh bug
			
			this.triggerResponse();

			this.setChecks();

			if(this.DOM.choiceA.is(':checked') && this.DOM.confirmEmail.is(':checked'))
    			this.DOM.addMyAddress.attr('style', 'display: none');

    		this.statComplaintsBug();
		},
		statComplaintsBug: function(){
			// leave this messy, it works!
		    var $stat = $('html'),
		        $choice1 = $stat.find('#choice1'),
		        $choice2 = $stat.find('#choice2'),
		        $check = $stat.find('#myaddresschk'),
		        stateOfCheck = !!$check.is(':checked');

		    $choice1.on('uncheck', function() {
		        if (!stateOfCheck) {
		            $check.trigger('hsa_uncheck');
		        }
		    });
		    $choice1.on('check', function() {
		        stateOfCheck = !!$check.is(':checked');
		        if (stateOfCheck) {
		            $check.trigger('hsa_check');
		        }
		    });
		    setTimeout(function(){
		    	if(stateOfCheck && $choice2.is(':checked')){
		        	$check.trigger('hsa_uncheck');
		        }
		    }, 150);

		},
		setChecks: function(){
			// If any radio is selected on load, then show the submit button
			$(function(){
				var isch = false;
				this.DOM.radios.each(function(){
					if($(this).is(':checked')){
						isch = true;
					}
				});
				if(!isch){
					this.DOM.submitButton.attr('style', 'display: none');
					setTimeout(function(){
						this.DOM.pathA.attr('style', 'display: none');
					}.bind(this), 300);
				}else{
					this.DOM.submitButton.attr('style', 'display: block;')
				}
			}.bind(this));

		},
		showSubmit: function(){
			this.DOM.submitButton.attr('style', 'display: block');
		},
		showPathA: function(){
			this.DOM.pathA.attr('style', 'display:block');
		},
		hidePathA: function(){
			this.DOM.pathA.attr('style', 'display:none');
		},
		handleChoiceA: function(){
			setTimeout(function(){
				// If no email check is checked
				if(this.DOM.confirmEmail.is(':checked')){
					console.log('yehhhhhhhhh');
					// Hide address radio
					this.DOM.addMyAddress.attr('style', 'display: none');
				}
			}.bind(this), 250);
			// also trigger response.
			//this.triggerResponse();
		},
		triggerResponse: function(){
			// Trigger the horrible check
			setTimeout(function(){
				// If this...
				if(!this.DOM.choiceC.is(':checked') && this.DOM.corr.is(':checked')){
		    		// Check the button
		       		this.DOM.corr.trigger('check');
		   	 	}
			}.bind(this), 200); // Yes in a timeout, because reasons.
		}

	});



}, '1.0.0', {
	requires: ['module', 'check-events'],
});*/