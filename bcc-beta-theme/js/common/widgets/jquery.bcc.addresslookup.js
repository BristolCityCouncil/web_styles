/**
 * @fileOverview A jQuery UI Widget that extends the functionality of BCC addresslookup
 * @author Luke Taylor
 * @name $.bcc.addresslookup
 * @dependencies: jQuery, jQuery UI widget factory
 */
// (function($){
// 	return;

// 	'use strict';

// 	$.widget('bcc.addresslookup', {
// 		// default options
// 		options: {
// 			advancedClass: 'address-lookup--isActive',
// 			dynamicAddressClass: 'address-lookup--isSelected',
// 			dynamicAddressTemplate: '<div class="panel panel--affirm panel--date $class$"><span class="panel__title">Your selected address:</span><strong class="panel__copy">$message$</strong></div>'
// 		},

// 		/**
// 		 * create - private
// 		 */
// 		_create: function () {
			
// 			// target
// 			var target = this;
// 			// element
// 			var elem = $(this.element);

// 			// add advanced class
// 			elem.addClass(target.options.advancedClass);
			
// 			if( elem.find('.form__item__field--select').length !== 0) {
// 			// multiselect containing addresses
// 			var select = $(this.element).find('.form__item__field--select');
      
// 			// console.log(select[0]).selectedIndex;
      
// 			// output message dynamically if nessecary
// 			if (select[0].selectedIndex !== 0 && select[0].selectedIndex !== -1) {
				
// 				select.closest('.form__item').append(
// 					target.options.dynamicAddressTemplate
// 						.replace(/\$class\$/g, target.options.dynamicAddressClass)
// 						.replace(/\$message\$/g, select.find('option:selected').text())
// 				);
// 			}

// 			// select change
// 			select.change(function () {
// 				elem.find('.' + target.options.dynamicAddressClass).remove();
// 				if (select[0].selectedIndex !== 0) {
// 					$(this).closest('.form__item')
// 						.append(
// 								target.options.dynamicAddressTemplate
// 								.replace(/\$class\$/g, target.options.dynamicAddressClass)
// 								.replace(/\$message\$/g, select.find('option:selected').text())
// 						);
// 					$(this).closest('.form__item').removeClass('form__item--error');
// 				}
// 			});
// 			}
			
			
// 		}
// 	});
// })(jQuery);