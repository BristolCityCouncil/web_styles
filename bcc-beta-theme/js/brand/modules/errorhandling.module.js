/*****************************************************************\
  Error Handling (passive)
/*****************************************************************\
 * This is a method that checks if there is errors in the error
 * panel at the top of pages which require validation.
\*****************************************************************/

YUI().use(['module','open-validation'], function(Y){

    var ErrorHandling = Y.uk.gov.bristol.module.extend({
		pluginName: 'headerErrors',
		render: function(){

			var href = this.$el.attr("href"),
				text = this.$el.text(),
				$formitem = $(".form " + href),
				$formset = $formitem.closest(".form__set"),
				$isformitemgroup = $formitem.is('.form__item--permit-group');


			if($formitem.is('.field')){
				return this.shimNewFormFields($formitem, text);
			}

			// Add error class
			$formitem.addClass("form__item--error");
			if(!$isformitemgroup){
				if($formitem.closest('.form__item--permit-group').length){
					$formitem.next('.form__item__message').show();
				}
				if($formitem.is('.form__set--showafter')){
					$formitem.next('.form__item__message').addClass('.form__item__message--error').text(text).show();
				}else{
					$formitem.find(".form__item__message--error").text(text);
				}
			}else{
				$formitem.addClass('form__item-permit-group--error');
				$formitem.append('<div class="form__item__message--error">'+text+'</div>');
			}
			$formitem.find('input').on('change', function(){
				$(this).closest('.form__item--error').removeClass('form__item--error');
			});
			// Add error to form__set if it exists.
			if($formset.length) $formset.addClass("form__set--error").parent().find('h2').addClass('invalid');
		},
		shimNewFormFields: function(target, message){

				if($.trim(message) == "??????") message = false;
				this.showError(target, message);

		},

		bindResolution: function(field){
			if(field.is('.field--group'))
				return this.bindGroupResolution(field);

			var inputs = field.children("input, textarea");
				numberOfErrors = inputs.length;
			inputs.one('change', function(){
				numberOfErrors--;
				if(numberOfErrors <= 0){
					field.removeClass('field--error');
				}
			});
		},

		bindGroupResolution: function(field){
			// Look into combining group resolution and group observation
			var inputs = field.find("input, textarea");
			inputs.change(function(e){
				if(field.find('.field--error').length == 1){
					field.removeClass('field--error');
					field.next('.field__message--error').remove();
					$(this).off(e);
				}
			});
		},

		showError: function(target, message){
			// @TODO, find all fields and add the un-error thing.
			var self = this;
			$(target).each(function(){
				var tag = $(this);
				if(!tag.is('.field'))
					tag = $(this).closest('.field');
				if(tag.is('.field--group')){
					tag.addClass('field--error');
					if(message) tag.after(self.generateMessage(message));
					
				}else if(message){
					tag.append(self.generateMessage(message));
				}
				tag.addClass('field--error');
				self.bindResolution(tag);
			});
		},
		showIndividualError: function(target, message){
			var self = this;
			$(target).each(function(){
				var tag = $(this);
				if(message)
					tag.after(self.generateMessage(message));
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
	//module = new ErrorHandling("#errors a.error__item__link");
});