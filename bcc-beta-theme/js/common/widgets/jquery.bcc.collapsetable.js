/**
 * @fileOverview A jQuery UI Widget to make a collapsible table
 * @author Edward Silverton
 * @name $.bcc.collapsible
 * @dependencies: jQuery, jQuery UI widget factory
 */

(function($) {
  'use strict';

  $.widget('bcc.collapsetable', {

	options: {
		collapseWidth: 769,
		collapseClass: 'collapse',
		collapseCol: '.table__col--details'
	},

	_create: function() {
		var that = this;
		
		$(window).resize(function(){
			that._widthChange();
		});
		
		this._widthChange();
	},
	
	_widthChange: function () {
		
		var $el = $(this.element),
			$collapseCols = $($el.find(this.options.collapseCol));
		
		if(document.body.clientWidth < this.options.collapseWidth) {
		
			if (!$el.hasClass(this.options.collapseClass)){
				$el.addClass(this.options.collapseClass);
				
				// move collapseCol content to first col
				$collapseCols.each(function(i){
					var $this = $(this),

					// get previous sibling and move content into it
						$prevCol = $this.prev(),
						$contents = $this.contents(),
						$wrapper = $('<span class="wrapper wrapper--td" />');
					
					// if it's a th, add '& ' to wrapper.
					if ($this.is('th')){
						$wrapper = $('<span class="wrapper wrapper--th" />');
						//$wrapper.append('<span class="and"> and </span>');
					}

					$wrapper.append($contents);
					$prevCol.append($wrapper);
					
					$this.hide();
				});
			}

		} else {
			$el.removeClass(this.options.collapseClass);

			// if collapseCol is empty, move contents back from first col
			$collapseCols.each(function(i){
				var $this = $(this);
				
				if ($this.is(':empty')){
					var $prevCol = $this.prev(),
						$wrapper = $prevCol.find('.wrapper');
					//$wrapper.find('.and').remove();
					$this.append($wrapper.contents());
					$wrapper.remove();
				}
				
				$(this).show();
			});
		}
		
	}

  });

})(jQuery);
