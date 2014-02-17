/**
 * @fileOverview A jQuery UI Widget that handles overlays
 * @author Luke Taylor
 * @name $.bcc.overlays
 * @dependencies: jQuery, jQuery UI widget factory, magnificpopup
 */
(function($){

  'use strict';

  $.widget('bcc.overlays', {
    // default options
    options: {
      initClass: 'js-overlay-init'
    },

    /**
     * create - private
     */
    _create: function () {
      // target
      var target = this;

      // add advanced class
      $(this.element).addClass(target.options.initClass);
    },

    /**
     * dialog - public
     */
    dialog: function () {
      $(this.element).magnificPopup({
        type: 'inline',
        midClick: true
      });
    },

    /**
     * external image - public
     */
    externalImage: function () {
      $(this.element).magnificPopup({
        type: 'image',
        closeBtnInside: false
      });
    },

    /**
     * external image retina - public
     */
    externalImageRetina: function () {
      $(this.element).magnificPopup({
        type: 'image',
        closeBtnInside: false,
        midClick: true,
        retina: {
          ratio: 2
        }
      });
    },

    /**
     * external images - public
     */
    externalImages: function () {
      $(this.element).magnificPopup({
        type: 'image',
        closeBtnInside: false,
        midClick: true,
        delegate: 'a',
        gallery: {
          enabled: true,
          navigateByImgClick: true
        }
      });
    },

    /**
     * inline image - public
     */
    inlineImage: function () {
      $(this.element).magnificPopup({
        type: 'inline',
        closeBtnInside: false,
        midClick: true
      });
    },

    /**
     * inline image - public
     */
    iframe: function () {
      $(this.element).magnificPopup({
        type: 'iframe',
        closeBtnInside: false,
        midClick: true
      });
    },

    /**
     * markup - public
     */
    markup: function () {
      $(this.element).magnificPopup({
        type: 'inline',
        closeBtnInside: true,
        midClick: true
      });
    }

  });
})(jQuery);