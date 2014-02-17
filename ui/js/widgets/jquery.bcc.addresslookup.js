/**
 * @fileOverview A jQuery UI Widget that extends the functionality of BCC addresslookup
 * @author Luke Taylor
 * @name $.bcc.addresslookup
 * @dependencies: jQuery, jQuery UI widget factory
 */
(function($){

  'use strict';

  $.widget('bcc.addresslookup', {
    // default options
    options: {
      advancedClass: 'address-lookup-advanced',
      dynamicAddressClass: 'address-lookup__selected-address',
      dynamicAddressTemplate: '<div class="panel panel--title-reverse panel--affirm $class$"><p class="panel__title--minor">Your selected address:</p><h2 class="panel__title">$message$</h2></div>'
    },

    /**
      * create - private
     */
    _create: function () {
      // target
      var target = this;

      // element
      var element = $(this.element);

      // add advanced class
      $(this.element).addClass(target.options.advancedClass);

      // multiselect containing addresses
      var select = $(this.element).find('.form__field--select');

      // output message dynamically if nessecary
      if (select[0].selectedIndex !== 0 && select[0].selectedIndex !== -1) {
        select.closest('.form__item').append(target.options.dynamicAddressTemplate.replace(/\$class\$/g, target.options.dynamicAddressClass).replace(/\$message\$/g, select.find('option:selected').text()));
      }

      // select change
      select.change(function () {
        element.find('.' + target.options.dynamicAddressClass).remove();
        if (select[0].selectedIndex !== 0) {
          $(this).closest('.form__item').append(target.options.dynamicAddressTemplate.replace(/\$class\$/g, target.options.dynamicAddressClass).replace(/\$message\$/g, select.find('option:selected').text()));
          $(this).closest('.form__item').removeClass('form__item--backend-error');
        }
      });
    }
  });
})(jQuery);