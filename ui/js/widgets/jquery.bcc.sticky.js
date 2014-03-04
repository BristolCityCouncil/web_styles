/**
 * @fileOverview A jQuery UI Widget to make page elements sticky to the screen
 * @author Mark Skinner
 * @name $.bcc.sticky
 * @dependencies: jQuery, jQuery UI widget factory
 */

(function($) {
  'use strict';

  $.widget('bcc.sticky', {

    options: {
      stickyClass: 'is-sticky',
      cloneClass: 'is-clone',
      layoutWrapClass: 'layout layout-constrained',
      gridClass: 'grid-col',
      gridWrapClass: 'grid-wrap',
      borderlessClass: 'is-borderless',
      invisibleClass: 'is-invisible',
      visibleClass: 'is-visible',
      collapseToggle: '.page-contents__title',
      collapseArea: '.page-contents__list-wrapper',
      collapseClass: 'js-collapse',
      collapseToggleClass: 'js-collapse__toggle',
      collapseAreaClass: 'js-collapse__area',
      collapseArrow: '<span class="ico ico-down" title="expand"></span>'

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
        .attr({"aria-hidden":"true"})
        .addClass(self.options.invisibleClass)
        .addClass(self.options.borderlessClass) //Specific to page contents
        .appendTo($('body'));

      // Add collapse classes
      // Specific to page contents - useful to be able to reuse elsewhere
      self._makeCollapsible(self._new);

      //Add sticky class to new element
      self._addStickyClass(self._new);

      self._timeoutId = null;

      self._on(self.window, {
        'resize': self._resizeHandler,
        'orientationchange': self._resizeHandler,
        'load': self._resizeHandler,
        'scroll': self._checkVisibility
      });

    },

    /**
     * Function to add sticky class when needed
     */
    _addStickyClass: function(elem) {
      //Look to refactor this to be in create function??
      var self = this;

      elem.addClass(self.options.stickyClass);

      self._addGrid(elem);
    },

    /**
     * Function to add grid so that fixed element has correct width
     */
    _addGrid: function(elem) {
      var self = this;
      var htmlArray = [];
      var htmlTemp = '';
      var htmlOpening = '';
      var htmlClosing = '';

      htmlOpening += '<div class="' + self.options.layoutWrapClass + '">';

      self.element.parents('.grid-col').each(function(e){

        var parentClass = $(this).attr('class');
        var loopHtml = '';

        loopHtml += '<div class="' + self.options.gridWrapClass + '">';
        loopHtml += '<div class="' + parentClass + '">';

        htmlArray.push(loopHtml);


        htmlClosing += '</div></div>';
      });
      htmlArray.reverse();

      htmlOpening += htmlArray.join('');
      htmlClosing += '</div>';
      htmlTemp = htmlOpening + htmlClosing;



      elem.wrapInner(htmlTemp);
    },

    _makeCollapsible: function(elem) {
      // Specific to page contents (but could be reused elsewhere)
      var self = this;

      elem.addClass(self.options.collapseClass);

      elem.find(self.options.collapseToggle)
        .addClass(self.options.collapseToggleClass)
        .append(self.options.collapseArrow);

      elem.find(self.options.collapseArea).addClass(self.options.collapseAreaClass);
    },

    _resizeHandler: function (delay) {

      var self = this;

      if (typeof (delay) === 'undefined') {
        delay = 200;
      }

      clearTimeout(self._timeoutId);

      // running a throttled resize
      self._timeoutId = setTimeout(function () {
        self._elPos();
        self._checkVisibility();

      }, delay);

    },

    _elPos: function() {
      // Does this need to be a function?
      var self = this;
      self._topPosition = self.element.offset().top;
    },

    _checkVisibility: function() {
      var self = this;
      self._windowTop = $(window).scrollTop();

      if (self._windowTop >= self._topPosition) {
        //Specific to page contents
        if(self._new.hasClass(self.options.invisibleClass)) {
          self._new.collapsible('quickCollapse'); //Could be event listener
        }

        //Unspecific
        self._new.removeClass(self.options.invisibleClass).addClass(self.options.visibleClass);


      } else {
        //Specific to page contents
        if(self._new.hasClass(self.options.visibleClass)) {
          self._new.collapsible('quickCollapse'); //Could be event listener
        }

        //Unspecific
        self._new.removeClass(self.options.visibleClass).addClass(self.options.invisibleClass);
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
      var self = this;
      //Haven't destroyed yet, but doesn't get destroyed in this context (delete cloned element to solve?)

    }
  });

})(jQuery);
