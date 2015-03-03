/*****************************************************************\
  Button States module
/*****************************************************************\
 * This module stops the focus state of buttons lingering when 
 * you drag your mouse off of a button.
\*****************************************************************/

YUI().add(['button-states'], function(Y){

    Y.namespace('uk.gov.bristol').buttonStates = Y.uk.gov.bristol.module.extend({
    	DOM: {
    		'cta' : 'button.cta',
    	},
    	events: {
    		'mousedown $cta' : 'preventFocusState'
    	},
    	pluginName: 'buttonStates',
    	mousedown : false,
    	preventFocusState: function(e){
    		var buttone = e,
				$button = $(buttone.currentTarget),
				self = this;

			if(this.mousedown){
				this.$el.off('mouseup');
			}
			this.mousedown = true;

			this.$el.one('mouseup', function(e){
				if(e.target == buttone.target) return;
				$button.blur();
				self.mousedown = false;
			});
    	}
    });

},'1.0.0' , {
    requires: ['module']
});