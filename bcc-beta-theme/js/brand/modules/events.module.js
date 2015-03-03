/*****************************************************************\
  Title of the module (passive)
/*****************************************************************\
 * Anything thats not immediately obvious at a glance goes here.
 *
 * TODO: Any improvements/technical debt goes here.
\*****************************************************************/

// New Event Module
YUI().use(['bccevents'], function(Y){
	
	// We can now use BCC events
	Y.uk.gov.bristol.events.bind({

		// Bind events when attributes are used
		"attributes" : {

			// When an element has data-scoll-to
			"data-scroll-to" : function($el){
				// scroll to its position (BEING OVERRITTEN BY ANOTHER SCROLLTO)
				$('html, body').animate({
			        scrollTop: $el.offset().top
			    }, 0);
			}


		},

		'click' : {

			// Remove Form Item Error on click, (See #CPDP-2928)
			".form__item--error:has(.uniform__checkbox)" : function(){
				$(this).removeClass("form__item--error");
			},

			// Use for detecting which button was clicked on a form submit
			'form' : function(e){
				e = e || window.e;
				var target = e.target || e.srcElement;
				
				$(this).data('clicked',$(e.target));
			}

		},
		'change' : {

			// Bug fix (See #CPDP-2744)
			// Move to Parking module? --- yes
			"#parking__visitor-permits__choose .form__item__field" : function(){
				$(this).closest(".slab").removeClass("form__item--error");
			}

		}
		

	});

});

