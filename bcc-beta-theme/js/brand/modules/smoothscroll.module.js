/*****************************************************************\
  Smooth Scroll Module
/*****************************************************************\
 * This module enabled smooth scrolling of elements on IAG pages
 *
\*****************************************************************/

YUI().add(['smoothscroll'], function(Y){

	var Smoothscroll = Y.uk.gov.bristol.module.extend({

		DOM: {
			'stickylink' : '.js-sticky a',
		},
		pluginName: 'smoothScroll',
		render: function(){

			var self = this;

			// Messy event delegation, because reasons.
			$('body').on('click', '.js-sticky a', self.handleStickyClick.bind(this));
			
			// Start the plugin
			$('.js-sticky').sticky({
			    'cloned': function(e, elem) {
			      // When the stick is cloned, apply classes to it so that we can make it collapsible.
			    
			      elem.addClass('js-collapse');
			      elem.find('.page-contents__title')
			          .addClass('js-collapse__toggle')
			          .append('<span class="icon icon--bcc icon--bcc--down"></span>');
			      elem.find('.page-contents__list-wrapper')
			          .addClass('js-collapse__area');
			    },
			    'enter': function(e, data) {
			      self.collapseSticky(data.elem);
			    },
			    'exit': function(e, data) {
			      self.collapseSticky(data.elem);
			    }
			});
		},

		handleStickyClick: function(e){
			var $el = $(e.target),
				self = this;

		    e.preventDefault();
		    if ($el.parents('.js-sticky').hasClass('is-clone')) {
				$el.parents('.js-collapse').collapsible('standardCollapse', function(){
					self.handleScroll(e.currentTarget);
				});
		    } else {
		      self.handleScroll(e.target);
		    }
		},

		handleScroll: function(elem){

			var target = $(elem.hash);
		    target = target.length ? target : $('[name=' + elem.hash.slice(1) +']');

			//CRITICAL PART OF THIS CURRENT THING
			var scrollToPosition = $(target).offset().top - $('.js-sticky.is-clone').height() - 20;

			if (target.length) {
		    	$("body, html").animate({
			   		scrollTop: scrollToPosition
		    	}, 400);
		    	return false;
		    }
		},

		collapseSticky: function($el){
			if(!$el.is(':bcc-collapsible')) {
		      $el.collapsible();
		    }
		    $el.collapsible('quickCollapse');
		}
	});

});