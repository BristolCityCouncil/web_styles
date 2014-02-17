(function ($) {

  'use strict';

  // user agent matching

  if (navigator.userAgent.match(/iPad/i) !== null) {
    $('html').addClass('ipad');
  }

  // accessibility

  var link = $('.skiplinks');

  link.focus(function () {
    $(this).addClass('focus');
  });

  link.blur(function () {
    $(this).removeClass('focus');
  });

  link.click(function () {
    $('#main').attr('tabindex', -1).focus();
  });

  // overlays

  $('.js-overlay-open').overlays();
  $('.js-overlay-open-dialog').overlays('dialog');
  $('.js-overlay-open-external-image').overlays('externalImage');
  $('.js-overlay-open-external-image-retina').overlays('externalImageRetina');
  $('.js-overlay-open-external-images').overlays('externalImages');
  $('.js-overlay-open-inline-image').overlays('inlineImage');
  $('.js-overlay-open-iframe').overlays('iframe');
  $('.js-overlay-open-markup').overlays('markup');

  // Validate
  // This is used to display errors on the Form Validation page.
  $('#form-validation-new').validate();

  $('#form-validation-new-alt').validate({
    'errorMessageTemplate': '<p class="form__item__error">Oops! $message$</p>',
    'keyUpValidation': true
  });

  $('.form--validate').validate({
    'keyUpValidation': true
  });

  // form styling

  if (!ie7) {
    $('select, input[type=radio], input[type=checkbox]').uniform({
      wrapperClass: 'uniform',
      selectClass: 'uniform__select',
      radioClass: 'uniform__radio',
      checkboxClass: 'uniform__checkbox'
    });

    // @TODO: Next line needs explaining as to why...
    $('.form__field--checkbox-large').parent().parent().addClass('uniform__checkbox--large');
  }

  // form placeholders

  $('input, textarea').placeholder();

  // list table

  if (!ie7) {
    $('.list-table').listtable();
    $(window).resize(function () {
      $('.list-table').listtable('setHeight');
    });
  }

  // address lookup

  $('.js-address-lookup').addresslookup();

  // tabs

  $('.js-tabs').tabs();

  // bin basket

  if (!ie7) {
    $('.basket--with-checks').binbasket();
  }

})(jQuery);