(function ($) {

  'use strict';

  // user agent matching
  // @TODO: Consider why this is being added and should feature detection, or size detection be used instead
  if (navigator.userAgent.match(/iPad/i) !== null) {
    $('html').addClass('ipad');
  }

  // accessibility
  // @OPTIMIZE: Make a separate function to this one
  var focusToggle = $('.js-addfocus');
  focusToggle.focus(function () {
    $(this).addClass('focus');
  });
  focusToggle.blur(function () {
    $(this).removeClass('focus');
  });
  focusToggle.click(function () {
    $('#main').attr('tabindex', -1).focus();
  });


  // overlays
  // @OPTIMIZE: Look at optimizing how this runs so that it is one function that then detects a data attribute or similar?
  $('.js-overlay-open').overlays();
  $('.js-overlay-open-dialog').overlays('dialog');
  $('.js-overlay-open-external-image').overlays('externalImage');
  $('.js-overlay-open-external-image-retina').overlays('externalImageRetina');
  $('.js-overlay-open-external-images').overlays('externalImages');
  $('.js-overlay-open-inline-image').overlays('inlineImage');
  $('.js-overlay-open-iframe').overlays('iframe');
  $('.js-overlay-open-markup').overlays('markup');

  // Validate
  // @TODO: Look at refactoring this, as it seems for example pages only?
  // This is used to display errors on the Form Validation page.
  $('#form-validation-new').validate();
  $('#form-validation-new-alt').validate({
    'errorMessageTemplate': '<p class="form__item__error">Oops! $message$</p>',
    'keyUpValidation': true
  });


  $('.js-validation').validate({
    'keyUpValidation': true
    // @TODO: Check if this is the default validation, and if so why is it not set to true by default
  });

  // form styling
  // @TODO: Look at refactoring the if not ie7 check, and also group them
  if (!ie7) {
    $('select, input[type=radio], input[type=checkbox]').uniform({
      wrapperClass: 'uniform',
      selectClass: 'uniform__select',
      radioClass: 'uniform__radio',
      checkboxClass: 'uniform__checkbox'
    });

    // @TODO: Next line needs explaining as to why... and probably needs refactoring as it's brittle
    $('.form__field--checkbox-large').parent().parent().addClass('uniform__checkbox--large');
  }

  // form placeholders
  $('input, textarea').placeholder();

  // list table
  if (!ie7) {
    $('.js-list-table').listtable();
    $(window).resize(function () {
      $('.js-list-table').listtable('setHeight');
    });
  }

  // address lookup
  $('.js-address-lookup').addresslookup();

  // tabs
  $('.js-tabs').tabs();



  // bin basket
  if (!ie7) {
    $('.js-basket').binbasket();
  }
  /*
   * Add parent .basket__item--is-selected class for REAL checkboxes
   */
  $('.basket__item .form__field--checkbox:checked').parents('.basket__item').addClass('basket__item--is-selected');
  $('.basket__item .form__field--checkbox.basket__checks').change(function(){
    // Add class on change to :checked
    $(this).parents('.basket__item').toggleClass("basket__item--is-selected");
  });


  $('.js-collapse').collapsible();

  /**
   * Apply the sticky plugin
   */
  $('.js-sticky').sticky({
    'cloned': function(e, elem) {
      /*
       * When the stick is cloned, apply classes to it so that we can make it collapsible.
       */
      elem.addClass('js-collapse');

      elem.find('.page-contents__title')
          .addClass('js-collapse__toggle')
          .append('<span class="ico ico-down"></span>');

      elem.find('.page-contents__list-wrapper')
          .addClass('js-collapse__area');
    },
    'enter': function(e, data) {
      collapseSticky(data.elem);
    },
    'exit': function(e, data) {
      collapseSticky(data.elem);
    }
  });

  /*
   * Collapse a sticky
   */
  var collapseSticky = function(elem) {
    if(!elem.is(':bcc-collapsible')) {
      elem.collapsible();
    }
    elem.collapsible('quickCollapse');
  };


  // @TODO: Split in to Separate file
  var smoothScroll = function(elem) {
    var target = $(elem.hash);
    target = target.length ? target : $('[name=' + elem.hash.slice(1) +']');
    //CRITICAL PART OF THIS CURRENT THING
    var scrollToPosition = $(target).offset().top - $('.js-sticky.is-clone').height() - 20;
    if (target.length) {
      $('html,body').animate({
        scrollTop: scrollToPosition
      }, 400);
      return false;
    }
  }

  $('.js-sticky a').on("click", function(e) {
    var self = this;
    e.preventDefault();
    if ($(self).parents('.js-sticky').hasClass('is-clone')) {
      $(this).parents('.js-collapse').collapsible('standardCollapse',function(){
        smoothScroll(self);
      });
    } else {
      smoothScroll(self);
    }

  });

})(jQuery);
