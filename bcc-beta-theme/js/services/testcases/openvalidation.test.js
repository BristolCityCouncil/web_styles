YUI().use('test','test-console', function(Y){

    var OpenValidationSuite = new Y.Test.Suite({
        name: "Open Validation",
    });

    // Test Case 1
    OpenValidationSuite.add(new Y.Test.Case({

        name: "Open Validation Basic",


        inputs: {
            bubbleInput:        'input[type="text"][required]',
            delegateInupt:      '.field[required] input[type="text"]',
            bubbleTextarea:     'textarea[required]',
            delegateTexarea:    '.field[required] textarea',
            bubbleDrop:         '.drop select[required]',
            delegateDrop:       '.field[required] .drop select',
            bubbleRadio:        'input[type="radio"][required]',
            delegateRadio:      '.field[required] input[type="radio"]',
            bubbleCheckbox:     'input[type="checkbox"][required]',
            delegateCheckbox:   '.field[required] input[type="checkbox"]',
        },

        testBubbleInput: function(){
            var self = this;
            $(this.inputs.bubbleInput).each(function(){
                $(this).trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasError($(this)), "All text inputs should bubble up an error when required");
            });
        },
        testBubbleInputResolution: function(){
            var self = this;
            $(this.inputs.bubbleInput).each(function(){
                $(this).val('test').trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasNoError($(this)), "When text is entered, bubble error should be resolved");
            });
        },
        testDelegateInput: function(){
            var self = this;
            $(this.inputs.delegateInupt).each(function(){
                $(this).trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasError($(this)), "All fields should delegate an error to a text input when required");
            });
        },
        testDelegateInputResolution: function(){
            var self = this;
            $(this.inputs.delegateInupt).each(function(){
                $(this).val('test').trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasNoError($(this)), "When text is entered, delegate error should be resolved");
            });
        },
        testBubbleTextarea: function(){
            var self = this;
            $(this.inputs.bubbleTextarea).each(function(){
                $(this).trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasError($(this)), "All textareas should bubble up an error when required");
            });
        },
        testBubbleTextareaResolution: function(){
            var self = this;
            $(this.inputs.bubbleTextarea).each(function(){
                $(this).val('test').trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasNoError($(this)), "When text is entered, bubble error should be resolved on textarea");
            });
        },
        testDelegateTextarea: function(){
            var self = this;
            $(this.inputs.delegateTextarea).each(function(){
                $(this).trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasError($(this)), "All fields should delegate an error to a textarea when required");
            });
        },
        testDelegateTextareaResolution: function(){
            var self = this;
            $(this.inputs.delegateTextarea).each(function(){
                $(this).val('test').trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasNoError($(this)), "When text is entered, delegate error should be resolved on textarea");
            });
        },
        testBubbleDropdown: function(){
            var self = this;
            $(this.inputs.bubbleDrop).each(function(){
                $(this).trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasError($(this)), "All fields should bubble up an error when required");
            });
        },
        testBubbleDropResolution: function(){
            var self = this;
            $(this.inputs.bubbleDrop).each(function(){
                $(this).prop('selectedIndex', 1).trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasNoError($(this)), "When a choice is entered, bubble error should be resolved");
            });
        },
        testDelegateDropdown: function(){
            var self = this;
            $(this.inputs.delegateDrop).each(function(){
                $(this).trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasError($(this)), "All fields should delegate an error to a dropdown when required");
            });
        },
        testDelegateDropResolution: function(){
            var self = this;
            $(this.inputs.delegateDrop).each(function(){
                $(this).prop('selectedIndex', 1).trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasNoError($(this)), "When choice is changed, delegate error should be resolved");
            });
        },
        testBubbleRadio: function(){
            var self = this;
            $(this.inputs.bubbleRadio).each(function(){
                $(this).trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasError($(this)), "All radios should bubble up an error when required");
            });
        },
        testBubbleRadioResolution: function(){
            var self = this;
            $(this.inputs.bubbleRadio).each(function(){
                $(this).prop('checked', 'checked').trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasNoError($(this)), "When choice is changed, bubble error should be resolved");
            });
        },
        testDelegateRadio: function(){
            var self = this;
            $(this.inputs.delegateRadio).each(function(){
                $(this).trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasError($(this)), "All fields should delegate an error to a radio when required");
            });
        },
        testDelegateRadioResolution: function(){
            var self = this;
            $(this.inputs.delegateRadio).each(function(){
                $(this).prop('checked', 'checked').trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasNoError($(this)), "When choice is changed, bubble error should be resolved");
            });
        },
        testBubbleCheckbox: function(){
            var self = this;
            $(this.inputs.bubbleCheckbox).each(function(){
                $(this).trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasError($(this)), "All checkboxes should bubble up an error when required");
            });
        },
        testBubbleCheckboxResolution: function(){
            var self = this;
            $(this.inputs.bubbleCheckbox).each(function(){
                $(this).prop('checked', 'checked').trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasNoError($(this)), "When choice is changed, bubble error should be resolved");
            });
        },
        testDelegateCheckbox: function(){
            var self = this;
            $(this.inputs.delegateCheckbox).each(function(){
                $(this).trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasError($(this)), "All fields should delegate an error to a checkbox when required");
            });
        },
        testDelegateCheckboxResolution: function(){
            var self = this;
            $(this.inputs.delegateCheckbox).each(function(){
                $(this).prop('checked', 'checked').trigger('blur');
                Y.Assert.isTrue(self.parentFieldHasNoError($(this)), "When choice is changed, delegate error should be resolved");
            });
        },
        parentFieldHasError: function($el){
            return !!$el.closest('.field').hasClass('field--error');
        },
        parentFieldHasNoError: function($el){
            return !$el.closest('.field').hasClass('field--error');
        }
    }));
    // exports
    Y.namespace('Suites').OpenValidation = OpenValidationSuite;

    window.OpenValidation = OpenValidationSuite;
    
});