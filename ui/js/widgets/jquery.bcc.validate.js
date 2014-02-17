/**
 * @fileOverview A jQuery UI Widget to handle form validation
 * @author Luke Taylor
 * @name $.bcc.validate
 * @dependencies: jQuery, jQuery UI widget factory
 */
(function($){
  'use strict';

  $.widget('bcc.validate', {
    // default options
    options: {
      // template used for errors
      errorMessageTemplate: '<div class="form__item__error"><span class="ico ico-attention"></span>$message$</div>',
      // use aria for accessibility
      useAria: true,
      // error message element
      errorMessageElement: '.form__item__error',
      // attribute containing error text
      errorAttribute: 'data-error-message',
      // attribute for match validation
      matchAttribute: 'data-match',
      // element to add error class too
      errorElement: '.form__item',
      // error class to add to above element
      errorClass: 'form__item--error',
      // blurred indicator class
      blurIndicatorClass: 'form__item--blurred',
      // hard coded flag
      hardcodedFlag: 'hardcoded',
      // whether or not to validate on key up
      keyUpValidation: false,
      // backend error class
      backendErrorClass: 'form__item--backend-error'
    },

    /**
     * create - private
     */
    _create: function () {
      // element and target
      var element = $(this.element), target = this;

      // disable html5 form validation
      element.attr('novalidate', 'novalidate');

      // output all errors
      this._outputErrors(element, target);

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
     * outputErrors - private
     */
    _outputErrors: function (element, target) {

      // output errors after appropriate text inputs / textareas
      element.find('input[type=text][' + target.options.errorAttribute + '], input[type=email][' + target.options.errorAttribute + '], textarea[' + target.options.errorAttribute + '], input[type=password][' + target.options.errorAttribute + ']').each(function () {
        // get error message
        var message = $(this).attr(target.options.errorAttribute);

        // if the element is not identified as having a hard coded error message, output one
        if (message !== target.options.hardcodedFlag) {
          // generate custom error message
          var customMessage = target.options.errorMessageTemplate.replace(/\$message\$/g, message);

          // inject the error
          $(this).parent().append(customMessage);

          // if we are using aria tags to hide content from screenreaders
          if (target.options.useAria) {
            $(this).parent().find(target.options.errorMessageElement).attr('aria-hidden', true);
          }
        }
      });

      // output errors after appropriate selects
      element.find('select[' + target.options.errorAttribute + ']').each(function () {
        // get error message
        var message = $(this).attr(target.options.errorAttribute);

        // if the element is not identified as having a hard coded error message, output one
        if (message !== target.options.hardcodedFlag) {
          // generate custom error message
          var customMessage = target.options.errorMessageTemplate.replace(/\$message\$/g, message);

          // inject the error
          $(this).parent().append(customMessage);

          // if we are using aria tags to hide content from screenreaders
          if (target.options.useAria) {
            $(this).parent().find(target.options.errorMessageElement).attr('aria-hidden', true);
          }
        }
      });

      // output errors after appropriate booleans
      element.find('input[type=checkbox][' + target.options.errorAttribute + ']').each(function () {
        // get error message
        var message = $(this).attr(target.options.errorAttribute);

        // if the element is not identified as having a hard coded error message, output one
        if (message !== target.options.hardcodedFlag) {
          // generate custom error message
          var customMessage = target.options.errorMessageTemplate.replace(/\$message\$/g, message);

          // inject the error
          $(this).parent().append(customMessage);

          // if we are using aria tags to hide content from screenreaders
          if (target.options.useAria) {
            $(this).parent().find(target.options.errorMessageElement).attr('aria-hidden', true);
          }
        }
      });

    },

    /**
     * requiredValidate - private
     */
    _requiredValidate: function (element, target) {

      // function to check if valid and style accordingly
      function check(e) {
        if (e.val() !== '') {
          e.closest(target.options.errorElement).removeClass(target.options.errorClass);
          // if we are using aria tags to hide content from screenreaders
          if (target.options.useAria) {
            e.closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', true);
          }
        } else {
          e.closest(target.options.errorElement).addClass(target.options.errorClass);
          // if we are using aria tags to hide content from screenreaders
          if (target.options.useAria) {
            e.closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', false);
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
        $(this).closest(target.options.errorElement).removeClass(target.options.backendErrorClass);
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
        } else {
          e.closest(target.options.errorElement).addClass(target.options.errorClass);
          // if we are using aria tags to hide content from screenreaders
          if (target.options.useAria) {
            e.closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', false);
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
        $(this).closest(target.options.errorElement).removeClass(target.options.backendErrorClass);
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
      element.find('select[' + target.options.errorAttribute + ']').change(function () {
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
      element.find('select[' + target.options.errorAttribute + ']').blur(function () { $(this).trigger('change'); });

    },

    /**
     * checkboxValidate - private
     */
    _checkboxValidate: function (element, target) {

      // remove / show error on appropriate checkbox change
      element.find('input[type=checkbox][' + target.options.errorAttribute + ']').change(function () {
        // error logic
        if (!$(this).prop('checked')) {
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

      // perform same action on blur of appropriate checkbox
      element.find('input[type=checkbox][' + target.options.errorAttribute + ']').blur(function () { $(this).trigger('change'); });
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
        } else {
          $(this).closest(target.options.errorElement).removeClass(target.options.errorClass);
          // if we are using aria tags to hide content from screenreaders
          if (target.options.useAria) {
            $(this).closest(target.options.errorElement).find(target.options.errorMessageElement).attr('aria-hidden', true);
          }
        }
        // add class that allows keyup validation
        $(this).addClass(target.options.blurIndicatorClass);
        // remove backend error class
        $(this).closest(target.options.errorElement).removeClass(target.options.backendErrorClass);
      });

      // validate appropriate elements on keyup
      if (target.options.keyUpValidation) {
        element.find('input[' + target.options.matchAttribute + '], textarea[' + target.options.matchAttribute + ']').keyup(function () {
          if ($(this).is('.' + target.options.blurIndicatorClass)) {
            // define the element to match
            var elementToMatch = '#' + $(this).attr(target.options.matchAttribute);
            // error logic
            if ($(this).val() !== $(elementToMatch).val()) {
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