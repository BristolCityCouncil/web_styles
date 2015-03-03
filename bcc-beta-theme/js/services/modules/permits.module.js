YUI().add(['parking'], function(Y) {

    Y.namespace('uk.gov.bristol').ParkingRenewals = Y.uk.gov.bristol.module.extend({

        DOM: {
            'permits': '[data-permit]',
            'postcode': '#field-postcode',
        },

        pluginName: 'parkingRenewals',

        newPermitTemplate: "<div id='field-addAnotherPermit' class='form__item slab slab--additional'>" + "<a class='cta cta--link' href='#addPermitItem'>" + "+ Add another permit" + "</a>" + "</div>",

        render: function() {

            // Find the additional permits and hide them
            this.DOM.permits.filter(':not(:first)').hide().parent().hide();

            //Create fragment with the new permit button
            this.newPermit = $(this.newPermitTemplate);

            // Bind a wee event on there
            this.newPermit.on('click', function(e) {

                // stop the link working
                e.preventDefault();

                // show the next permit thats hidden
                this.DOM.permits.filter(':hidden:first').show().parent().show();

                // if all the permits are on screen
                if (this.DOM.permits.filter(':hidden').length === 0) {
                    // hide the permit button
                    this.newPermit.hide();
                }

            }.bind(this));

            // Add the permit button to the DOM.
            this.DOM.postcode.before(this.newPermit);

        },
    });

    //
    Y.namespace('uk.gov.bristol').ParkingPermits = Y.uk.gov.bristol.module.extend({

        DOM: {
            "permits": ".permit",
            'activeRadios': '.form__item__field--radio:not(:disabled)',
            "renewalDates": "[data-permit-date]",
        },

        events: {
        	'change $activeRadios': 'recaluateCost',
        	//'load': 'recaluateCost',
        },

        pluginName: 'permitDetails',

        render: function() {
            this.validPermits = this.DOM.activeRadios.length;
            if (0 > this.validPermits < 4) {
                this.$el.after(this.renderTemplate());
            }
            this.recaluateCost();
        },

        renderTemplate: function() {
            if ($('#hide-total').length) return;
            var gridSize = this.DOM.permits.length * 4;
            totalHTML = '';
            totalHTML += '<div class="calculating" id="calculating">';
            totalHTML += "	<div class='calcwidth" + gridSize + "'>";
            //totalHTML += "	<div class='span" + gridSize + "'>";
            totalHTML += "		<div class='total'>Total: <strong>Recalculating...</strong></div>";
            totalHTML += "	</div>";
            totalHTML += "</div>";
            return totalHTML;
        },
        parseValue: function(val) {
            var trimmedVal = $.trim(val),
                str;

            if (trimmedVal == "Free") {
                str = 0;
            } else {
                str = trimmedVal;
                str = str.replace(String.fromCharCode('163'), "");
                str = parseInt(str, 10);
            }
            return str;
        },
        recaluateCost: function() {
            var self = this,
                total = 0,
                radiodisabled = this.$el.find('.form__item__field--radio:not(:disabled):checked'),
                checkthisone = this.$el.find('.form__item__field--radio:not(:disabled)'),
                isOnly = $("p[data-permit-cost]");

            
            // No Choice (Not a radio)
            
            if(isOnly){
            	//var isOnlyCost = isOnly.find('.permit__cost').attr('data-price');
            	//var isOnlyCost = isOnly.parseValue($(this).closest('.form__item__label--group').find('.permit__cost').html());
                //console.log('isOnlyCost: ', isOnlyCost);
                
            	var isOnlyRenewalDate = isOnly.find('.permit__cost').attr('data-permit-date');
            	//console.log('isOnlyRenewalDate: ', isOnlyRenewalDate);
    			isOnly.closest(".permit").find(".permit__end").html('to <span class="date">' + isOnlyRenewalDate + '</span>');
            }
            
            
            this.$el.find('[data-price]').each(function() {

                total += self.parseValue($(this).attr('data-price'));

            });
            
            
            
            radiodisabled.each(function() {
            	
            	var checkedRadio = self.parseValue($(this).closest('.form__item__label--group').find('.permit__cost').html());

            	//console.log('checkedRadio: ', checkedRadio);
            	
                total += checkedRadio;

                //console.log('total: ', total);
                
                var renewalDate = $(this).closest('.form__item__label--group').attr('data-permit-date');

                //console.log('renewalDate: ', renewalDate);
                
                $(this).closest(".permit").find(".permit__end").html('to <span class="date">' + renewalDate + '</span>');

            });
            
            
            if (!isOnly && !total && !checkthisone.length) total = 'unknown';

            total = (total) ? '£ ' + total : 'Free';

            $("#calculating strong").html(total);
        },


    });

});