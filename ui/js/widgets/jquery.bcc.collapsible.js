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
      expandedClass: 'is-expanded'
    },

    widgetEventPrefix: 'collapsible_',

    /**
    * Constructor
    */
    _create: function() {
      var self = this;

      self.element.find(self.options.collapseToggleClass).on('click',function(){
        if(self.element.hasClass(self.options.expandedClass)){
          self.standardCollapse();
        } else {
          self.standardExpand();
        }
      })

    },
    standardCollapse: function(callback) {
      var self = this;
      self.element.addClass(self.options.collapsedClass).removeClass(self.options.expandedClass);
      self.element.find(self.options.collapseAreaClass).slideUp(300, function() {
        if (callback != undefined) {
          callback();
        }

      });
    },

    quickCollapse: function() {
      var self = this;
      self.element.addClass(self.options.collapsedClass).removeClass(self.options.expandedClass);
      self.element.find(self.options.collapseAreaClass).slideUp(0);
    },

    standardExpand: function() {
      var self = this;
      self.element.addClass(self.options.expandedClass).removeClass(self.options.collapsedClass);
      self.element.find(self.options.collapseAreaClass).slideDown(300);
    },

    quickExpand: function() {
      var self = this;
      self.element.addClass(self.options.expandedClass).removeClass(self.options.collapsedClass);
      self.element.find(self.options.collapseAreaClass).slideDown(0);
    },

    /**
     * Destroy
     */
    _destroy: function() {

    }
  });

})(jQuery);
