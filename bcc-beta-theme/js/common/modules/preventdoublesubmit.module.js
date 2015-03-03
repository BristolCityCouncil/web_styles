/*****************************************************************\
  Prevent Double Submit
/*****************************************************************\
 * This module blocks buttons submitting a form twice and 
 * provides a loading "spinner" when clicked. Falls back to
 * "Loading..." on lesser browsers.
 *
 * TODO: Use feature detection instead of IE hack.
\*****************************************************************/

YUI().use(['module'], function(Y){
    var PreventDoubleSubmit = Y.uk.gov.bristol.module.extend({
    		DOM: {
    			'linkButton' : 'a.js--prevent-double',
            },
            events: {
                'submit $el' : 'preventSecondSubmission',
                'click $linkButton' : 'disableButton',
            },
            render: function(){
                if (!Modernizr.csstransitions) {
                    this.template = '<center>loading...</center>';
                }
            },
            // Spinner Template
            template: '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>',
            pluginName: "preventDoubleSubmit",
            preventSecondSubmission: function(e){
                // Grab all the buttons that prevent a double submit
                var $preventDoubleButtons = $(e.currentTarget).find(".js--prevent-double"),
                    // Grab the button that has been clicked
                    $btn = $(e.currentTarget).data('clicked');

                // If its a submit button, copy the options on it for Spring Webflow.
                if($btn.is('[type="submit"]')){
                    $(e.currentTarget).append($("<input/>", {
                        type: 'hidden',
                        value: $btn.attr('value'),
                        name: $btn.attr('name'),
                    }));
                }
                // If its not a prevent double button then allow the submit
                if(!$btn.hasClass('js--prevent-double')) return true;

                // ... if not disable the button
                this.disableButton($preventDoubleButtons);

                // Ensure the submit is continued
                return true;
            },
            disableButton: function($jpd){

                // Grab button if its from an event
                $jpd = ($jpd.currentTarget)? $($jpd.currentTarget) : $jpd;

                // Disable the button
                $jpd.attr("disabled", "disabled").addClass("disabled").closest(".form__actions").addClass("form__actions--disabled");

                // ... and disable the parent group
                $jpd.closest(".cta-group").addClass("cta-group--disabled");

                // Loop through to preserve height and width
                $jpd.each(function(){
                    var btnh = $(this).innerHeight(),
                        btnw = $(this).innerWidth(),
                        btnmt = $(this).css('margin-top');
                    $(this).css({
                        "height": btnh,
                        "width" : btnw,
                        'margin-top' : btnmt
                    });
                });
                $jpd.attr('data-html-value', $jpd.html());
                // Inject the template (spinner)
                $jpd.html(this.template);

                // Remove the icon
                $jpd.removeClass("cta--icon");
                return true;
            }
    	});
    	//module = new PreventDoubleSubmit('form:has(.js--prevent-double)').PreventDoubleSubmit();
});