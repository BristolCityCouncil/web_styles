YUI().use('test','test-console', 'waste', function(Y){
	
	
    var WasteSuite = new Y.Test.Suite({
        name: "Waste",
    });

    // Test Case 1
    WasteSuite.add(new Y.Test.Case({

        name: "Waste Tables",
        
        testBinReset: function(){

            // Unselect currently selected bins
            $('.bintable-row--selected .bintable-checkbox').click();

            // There should now be no more bins
            Y.Assert.areEqual($('.bintable-row--selected').length, 0, "There should be no binrows checked");
        
        },
        testBinSelection: function(){

            var $rows = $('.bintable-row');

            // for each of the bin rows
            $rows.each(function(e){

                // click once, check if it is selected
                $(this).find('.bintable-checkbox').click();
                Y.Assert.isTrue($(this).hasClass('bintable-row--selected'), "Row should be selected when a checkbox is clicked");
                
                // click again, check if it is unselected
                $(this).find('.bintable-checkbox').click();
                Y.Assert.isFalse($(this).hasClass('bintable-row--selected'), "Row should be deselected when a checkbox is clicked");
            
            });
        },
        testQuantityChange: function(){

            var $rows = $('.bintable-row');

            // for each of the bin rows
            $rows.each(function(num){

                // Check if first bin (black bin)
                if(num){
                    // change to 180L
                    $(this).find('.form__item__field--quantity').val('180L').trigger('change');

                }else{
                    // change to 1
                    $(this).find('.form__item__field--quantity').val('1').trigger('change');

                }

                // Make sure the row is selected
                Y.Assert.isTrue($(this).hasClass('bintable-row--selected'), "Row should be selected when quantity is change");
                
                // Change Quantity back to 0
                $(this).find('.form__item__field--quantity').val('0').trigger('change');
                
                // Make sure the row is not selected
                Y.Assert.isFalse($(this).hasClass('bintable-row--selected'), "Row should be deselected when quantity is changed to 0");
            
            });
        },
        testReason: function(){

            var $rows = $('.bintable-row');

            // for each of the bin rows
            $rows.each(function(num){
                var reason = $(this).find('.form__item__field--select--reason');

                // Change reason to lost
                reason.val('lost-stolen').trigger('change');
                Y.Assert.isTrue($(this).hasClass('bintable-row--selected'), 
                    "Row should be selected when reason is changed");

                // change to damaged
                reason.val('damaged').trigger('change');
                Y.Assert.isTrue($(this).find('.bintable-select--oldbin').hasClass('bintable-select--oldbin_active'), 
                    "'Please take my old box' should appear when 'damaged' is selected");

                // change to invalid
                reason.val('invalid').trigger('change');
                Y.Assert.isFalse($(this).hasClass('bintable-row--selected'), 
                    "Row should be deselected when reason is changed back to normal");

            });

        },

        testReasonDeselect: function(){

            var $rows = $('.bintable-row');

            // for each of the bin rows
            $rows.each(function(num){
                var reason = $(this).find('.form__item__field--select--reason');

                // Change reason
                reason.val('lost-stolen').trigger('change');

                // Check bin is selected
                Y.Assert.isTrue($(this).hasClass('bintable-row--selected'));

                // Click bin
                $(this).find('.bintable-checkbox').click();

                // Check that reason is invalid
                Y.Assert.isFalse((reason.val() == "lost-stolen"));
                
            });
        }

    }));
    // exports
    Y.namespace('Suites').Waste = WasteSuite;

    window.WasteSuite = WasteSuite;
    
});