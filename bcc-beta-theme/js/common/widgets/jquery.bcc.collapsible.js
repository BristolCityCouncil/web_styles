/**
 * @fileOverview A jQuery UI Widget to make a collapsible element
 * @author Mark Skinner
 * @name $.bcc.collapsible
 * @dependencies: jQuery, jQuery UI widget factory
 */

(function($) {
  'use strict';

  $.widget('bcc.collapsible', {

    options: {
      collapseToggleClass: '.js-collapse__toggle',
      collapseAreaClass: '.js-collapse__area',
      collapsedClass: 'is-collapsed',
      expandedClass: 'is-expanded',
      duration: 300
    },

    widgetEventPrefix: 'collapsible_',

    /**
     * Constructor
     */
    _create: function() {
      var self = this,
          toggleTrigger = self.element.find(self.options.collapseToggleClass);

      self._on(toggleTrigger, {
        'click': function() {
          if(self.element.hasClass(self.options.expandedClass)) {
            self.standardCollapse();
          } else {
            self.standardExpand();
          }
        }
      });
    },

    /**
     * Collapse the element
     *
     * @param duration
     * @param complete
     * @private
     */
    _collapse: function(duration, complete) {
      var self = this;
      self.element
          .addClass(self.options.collapsedClass)
          .removeClass(self.options.expandedClass);

      self.element.find(self.options.collapseAreaClass)
          .slideUp(duration, function() {
            if ( typeof complete !== 'undefined' ) {
              complete();
            }
          });
    },

    /**
     * Expand the element
     *
     * @param duration
     * @param complete
     * @private
     */
    _expand: function(duration, complete) {
      var self = this;
      self.element
          .addClass(self.options.expandedClass)
          .removeClass(self.options.collapsedClass);

      self.element.find(self.options.collapseAreaClass)
          .slideDown(duration, function() {
            if ( typeof complete !== 'undefined' ) {
              complete();
            }
          });
    },

    /**
     * Standard collapse with default duration
     * @param complete
     */
    standardCollapse: function(complete) {
      this._collapse(this.options.duration, complete);
    },

    /**
     * Quick collapse with no duration
     * @param complete
     */
    quickCollapse: function(complete) {
      this._collapse(0, complete);
    },

    /**
     * Standard expand with default duration
     * @param complete
     */
    standardExpand: function(complete) {
      this._expand(this.options.duration, complete);
    },

    /**
     * Quick expand with no duration.
     * @param complete
     */
    quickExpand: function(complete) {
      this._expand(0, complete);
    },

    /**
     * Destroy
     */
    _destroy: function() {
      var self = this;

      self.element
          .removeClass(self.options.expandedClass)
          .removeClass(self.options.expandedClass);
    }
  });

})(jQuery);
