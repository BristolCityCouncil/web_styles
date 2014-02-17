/**
 * @fileOverview A jQuery UI Widget that extends the functionality of BCC binbasket
 * @author Luke Taylor
 * @name $.bcc.binbasket
 * @dependencies: jQuery, jQuery UI widget factory
 */


(function($, window, ie7){

  'use strict';

  $.widget('bcc.binbasket', {
    // default options
    options: {
      advancedClass: 'basket--advanced',
      includeMessage: 'Include this item',
      excludeMessage: 'Don\'t include this item',
      checkerMarkup: '<a href="#" class="uniform__checkbox checker--fake uniform__checkbox--large basket__check"><span></span><em class="visuallyhidden"></em></a>',
      basketSummaryMarkup: '<div class="basket__summary">' +
                             '<h3 class="basket__summary__title">You are ordering:</h3>' +
                             '<ul class="basket__summary__list">' +
                               '<li>Nothing selected</li>' +
                             '</ul>' +
                            '</div>',
      basketSummaryListClass: 'basket__summary__list',
      countClass: 'basket__count',
      showAdditional: 'js-show-additional'
    },

    /**
      * create - private
     */
    _create: function () {
      // cache basket and basketElem
      var basket = this;
      var basketElem = $(this.element);

      // add advanced class to setup styling
      basketElem.addClass(basket.options.advancedClass);

      // add fake checkbox for each basket item
      basketElem.find('.basket__item').each(function () {
        $(this).find('.grid-wrap:first').prepend('<div class="grid-col grid-col-check desktop-grid-one-ninth">' + basket.options.checkerMarkup + '</div>');
        $(this).find('.visuallyhidden').html(basket.options.includeMessage);
      });

      // remove hidden quantity for black wheelie bin from tab order
      basketElem.find('.form__field--select--black-wheelie-bin').attr('tabindex', '-1');

      // click event for fake checkbox
      basketElem.find('.basket__check').click(function () {
        // cache span, em, item and select
        var span = $(this).find('span'), em = $(this).find('em'), item = $(this).closest('.basket__item'), select = item.find('.form__field--select--quantity');

        // toggle checked class on fake checkbox
        span.toggleClass('checked');

        // if span is checked style then set dropdowns
        if (span.is('.checked')) {
          item.addClass('basket__item--is-selected');
          select.find('option:eq(0)').remove();
          select.find('option:eq(0)').prop('selected', true);
          if (!ie7) {
            $.uniform.update(select);
          }
          em.html(basket.options.excludeMessage);
        } else {
          item.removeClass('basket__item--is-selected');
          select.prepend('<option value="0">0</option>');
          select.find('option').removeAttr('selected');
          select.find('option:eq(0)').prop('selected', true);
          if (!ie7) {
            $.uniform.update(select);
          }
          item.find('.form__field--select--reason option').removeAttr('selected');
          item.find('.form__field--select--reason option:eq(0)').prop('selected', true);
          item.find('.form__field--select--reason').change();
          item.find('.form__item').removeClass('form__item--error');
          em.html(basket.options.includeMessage);
        }

        // update the basket summary
        basket.updateBasketSummary();

        return false;
      });

      // space key event for fake checkbox
      basketElem.find('.basket__check').keydown(function (e) {
        if (e.which === 32) {
          $(this).trigger('click');
        }
      });

      // stop space scrolling the page
      $(document).keydown(function (e) {
        if (basketElem.find('.basket__check').is(':focus')) {
          console.log('block');
          if (e.which === 32) {
            window.scrollTo(window.scrollX, window.scrollY);
            e.preventDefault();
            return false;
          }
        }
      });

      // hover states for fake checkbox
      basketElem.find('.basket__check').hover(function () {
        $(this).addClass('hover');
      }, function () {
        $(this).removeClass('hover');
      });

      // focus state for checkbox
      basketElem.find('.basket__check').focus(function () {
        $(this).addClass('focus');
      });

      // blur state for checkbox
      basketElem.find('.basket__check').blur(function () {
        $(this).removeClass('focus');
      });

      basketElem.find('.form__field--select--quantity').change(function () {
        var item = $(this).closest('.basket__item'), check = item.find('.basket__check span');
        if ($(this).val() !== 0) {
          item.addClass('basket__item--is-selected');
          check.addClass('checked');
        } else {
          item.removeClass('basket__item--is-selected');
          check.removeClass('checked');
        }

        // update the basket summary
        basket.updateBasketSummary();
      });

      basketElem.find('.form__field--select--reason').change(function () {
        var target = $(this).closest('.basket__item__field').next('.basket__item__field--old');
        if ($(':selected', $(this)).hasClass(basket.options.showAdditional)) {
          target.show();
        } else {
          target.hide();
          target.find('input').prop('checked', false);
          if (!ie7) {
            $.uniform.update(target.find('input'));
          }
        }
      });

      // check all appropriate fake checkboxes based on whether quantity is greater than 0
      basketElem.find('.form__field--select--quantity').each(function () {
        if ($(this).find('option:selected').text() !== '0') {
          $(this).find('option:eq(0)').remove();
          $(this).find('option:eq(0)').prop('selected', true);
          var basketItem = $(this).closest('.basket__item');
          basketItem.addClass('basket__item--is-selected');
          basketItem.find('.basket__check span').addClass('checked');
          basketItem.find('.basket__check em').html(basket.options.excludeMessage);
        }
      });

      // append dynamic basket update
      basketElem.find('.basket__actions:last').before(basket.options.basketSummaryMarkup);

      // update basket summary
      basket.updateBasketSummary();
    },

    /**
      * updateBasketSummary - public
     */
    updateBasketSummary: function () {
      // create items array, defne i and totalItems, cache basketSummaryList and basketCount
      var items = [], i, totalItems = 0, basketSummaryList = $(this.element).find('.' + this.options.basketSummaryListClass), basketCount = $(this.element).find('.basket__count');

      // loop through each checked item and push details into items array
      $(this.element).find('.basket__check .checked').each(function () {
        var itemName = $(this).closest('.basket__item').find('.basket__item__title').html();
        var itemCount = $(this).closest('.basket__item').find('.form__field--select--quantity').val();
        items.push({
          'itemName': itemName,
          'itemCount': itemCount
        });
      });

      // empty the list
      basketSummaryList.empty();

      // empty the count
      basketCount.html('');

      // if nothing is selected add list item stating this, else loop through all items and append
      if (items.length <= 0) {
        basketSummaryList.append('<li>Nothing selected</li>');
      } else {
        for (i = 0; i < items.length; i++) {
          basketSummaryList.append('<li>' + items[i].itemCount + ' x ' + items[i].itemName + '</li>');
          totalItems = totalItems + parseInt(items[i].itemCount, null);
        }
        basketCount.html(totalItems);
      }
    }
  });
})(jQuery, window, ie7);