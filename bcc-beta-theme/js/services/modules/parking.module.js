/*****************************************************************\
  Title of the module
/*****************************************************************\
 * Anything thats not immediately obvious at a glance goes here.
 *
 * TODO: Any improvements/technical debt goes here.
\*****************************************************************/

YUI().use(['module'], function(Y){
    var MyModule = Y.uk.gov.bristol.module.extend({
    		DOM: {
                "formItem" : '.form__item__field--string',
            },
            events: {
                "focus $formItem" : "focusFormItem",
                "focusout $formItem" : "unfocusFormItem",
            },
            pluginName: 'parkingFocusSlab',
            slabFocusClass: 'slab--white',
            //slabDefaultClass: '',
            render: function(){
                
            },
            focusFormItem: function(e){
                $(e.currentTarget).parents('.slab').removeClass(this.slabFocusClass);
                
                //console.log("focus");
            },
            unfocusFormItem: function(e){
                if($(e.currentTarget).val().length === 0 || $(e.currentTarget).val() === '0'){
                    $(e.currentTarget).parents('.slab').addClass(this.slabFocusClass);
                } else {
                    $(e.currentTarget).parents('.slab').removeClass(this.slabFocusClass);
                }
                //console.log("unfocus");
            }
    	});
    	// module = new MyModule('#parking__visitor-permits__choose').parkingFocusSlab();
    // Any more stuff here.
});



//Parking Bugfixes
/*
$('#parking__visitor-permits__choose .form__item__field--string')
.on('focus', function () {

	$(this).parents('.slab').removeClass('slab--outline');

})
.on('focusout', function(){

	if($(this).val().length === 0 || $(this).val() === '0'){
		$(this).parents('.slab').addClass('slab--outline');
    } else {
	    $(this).parents('.slab').removeClass('slab--outline');
    }

});
*/

//CPDP-2744
//$('#parking__visitor-permits__choose .form__item__field')
//  .on("change", function(){

//   $(this).closest(".slab").removeClass("form__item--error");

//});
//!! Why broken? What is .wrap doing?
//THIS IS COMPLETELY BROKEN
//add span wrapper to all radio button and check box text nodes.
/*
$('.uniform__radio, .uniform__checkbox').each(function(){
	var text = $(this).parent().contents().filter(function() {
	    return this.nodeType == 3 && this.nodeValue != " ";
	}).wrap('<span class="wrap"/>');
	// .wrap?
});
*/

