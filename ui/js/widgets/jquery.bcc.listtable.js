/**
 * @fileOverview A jQuery UI Widget that extends the functionality of BCC listtable
 * @author Luke Taylor
 * @name $.bcc.listtable
 * @dependencies: jQuery, jQuery UI widget factory
 */
(function($){

  'use strict';

  $.widget('bcc.listtable', {
    // default options
    options: {
      advancedClass: 'list-table-advanced'
    },

    /**
     * create - private
     */
    _create: function () {
      // target
      var target = this;

      // add advanced class
      $(this.element).addClass(target.options.advancedClass);

      // set the heights
      this.setHeight();

      // click event (this only affects mobile)
      $(this.element).find('.list-table__row').click(function () {
        $(this).toggleClass('list-table__row--active');
      });

      // inject icons
      $(this.element).find('.list-table__row__item--description').append('<span class="ico ico-right"></span><span class="ico ico-down"></span>');

      // @OPTIMIZE - refactor this is only needed to aid redraw when activity table is hidden inside tab and then revealed
      $('.tabs__list__activity').click(function () {
        setTimeout(function () { target.setHeight(); }, 500);
      });

    },

    /**
      * setHeight - public
    */
    setHeight: function () {
      $(this.element).find('.list-table__row .grid-wrap').each(function () {
        $(this).find('.grid-col').height('auto');
        $(this).find('.grid-col').height($(this).height());
      });
    }
  });
})(jQuery);