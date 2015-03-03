/**
 * @fileOverview A jQuery UI Widget to make page elements sticky to the screen
 * @name $.bcc.sticky
 * @dependencies: jQuery, jQuery UI widget factory
 */

(function($) {
	'use strict';

	$.widget('bcc.sticky', {

		options: {
			stickyClass: 'is-sticky',
			cloneClass: 'is-clone',
			borderlessClass: 'is-borderless',
			invisibleClass: 'is-invisible',
			visibleClass: 'is-visible'
		},

		widgetEventPrefix: 'sticky_',

		/**
		* Constructor
		*/
		_create: function() {
			var self = this;
			// Create new element for showing/hiding
			self._new = self.element.clone();
			self._new
				.addClass(self.options.cloneClass)
				.addClass(self.options.invisibleClass)
				.addClass(self.options.borderlessClass) 
				.addClass('is-collapsed')
				.find('.page-contents__list-wrapper').attr('style', 'display:none');
			self._new.appendTo($('body'));

			// Add collapse classes
			// Specific to page contents - useful to be able to reuse elsewhere
			
			

			//Add sticky class to new element
			self._new.addClass(self.options.stickyClass);

			self._addGrid(self._new);

			self._timeoutId = null;

			self._trigger('cloned', {}, self._new);
			self._checkVisibility();
			self._on(self.window, {
				'resize': self._resizeHandler, 
				'orientationchange': self._resizeHandler, 
				'load': self._resizeHandler, 
				'scroll': self._checkVisibility 
			});
		},

	    /**
	     * Function to add grid so that fixed element has correct width
	     *
	     * @param elem
	     * @private
	     */
	    _addGrid: function(elem) {
	    	var self = this;
	    		
	    	var the_html = 	'';
	      		the_html += '	<div data-test="test1" class="row-fluid">';
	      		the_html += '	</div>';
	      		
	      		
			elem.wrapInner(the_html);
			
			
	    },


	    /**
	     * @param delay
	     * @private
	     */
	    _resizeHandler: function (delay) {

	    	var self = this;

	    	if (typeof (delay) === 'undefined') {
	        	delay = 200;
	    	}

	    	clearTimeout(self._timeoutId);

	    	// running a throttled resize
	    	self._timeoutId = 
	    		setTimeout(function (){
	        		self._topPosition = self.element.offset().top;
	        		self._checkVisibility();
	      		}, delay);

	    },

	    /**
	     * Check to see if the top of the page is passes the sticky element's top.
	     * @private
	     * @fires enter
	     * @fires exit
	     */
	     _checkVisibility: function() {
      		
      		var self = this;
      
			self._windowTop = $(window).scrollTop();

			if (self._windowTop >= self._topPosition) {
				//Specific to page contents
				if(self._new.hasClass(self.options.invisibleClass)) {
					self._trigger('enter', {}, {
						elem: self._new
					});
				}

				self._new
					.removeClass(self.options.invisibleClass)
					.addClass(self.options.visibleClass);

			} else {
				
				//Specific to page contents
				
				if(self._new.hasClass(self.options.visibleClass)) {
					self._trigger('exit', {}, {
						elem: self._new
					});
				}

				self._new
					.removeClass(self.options.visibleClass)
					.addClass(self.options.invisibleClass);
			}
			
			//Specific to page contents
			self._bottomPosition = self._topPosition + self.element.height() - self._new.height();
				
			// @OPTIMIZE ^^^^ look at how to take the height values out (should they be variables?)
			if (self._windowTop >= self._bottomPosition) {
				self._new.removeClass(self.options.borderlessClass);
			} else {
				self._new.addClass(self.options.borderlessClass);
			}
			
			
		},

		/**
		* Destroy
		*/
		_destroy: function() {
			this._new.remove();
		}
	});

})(jQuery);
