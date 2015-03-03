YUI().add(['waste'], function(Y){
	
	console.log("Waste");

    var Breakpoints = Y.uk.gov.bristol.Breakpoints;

    Y.namespace('uk.gov.bristol').Waste = Y.uk.gov.bristol.module.extend({
        DOM: {
            'toggle' : '.bintable-toggle',
            'title' : '.bintable-checkbox ~ .bintable-body .bintable-title',
            'checkbox' : '.bintable-checkbox',
            'rows' : '.bintable-row',
            'reason' : '.form__item__field--select--reason',
            'quantity' : '.form__item__field--quantity',
            'hiddenQuantity' : '#ff-wheeled-rubbish-bin__qtyhdn',
        },
        events: {
            'click $toggle' : 'toggleBasket',
            'click $title' : 'toggleBasket',
            'click $checkbox' : 'toggleBasket',
            'change $reason' : 'handleReason',
            'change $quantity' : 'handleQuantity',
        },
        pluginName: 'binTable', /* Exports as JQuery Plugin */
        preventDouble: false,
        render: function(){
            Breakpoints.on('mobile', function(){
                //console.log("You are on mobile on waste");
            });
            
            // Sanity Checks
            var self = this;
            this.DOM.rows.each(function(k, v){
            	
                if($(this).find('.bintable-checkbox').length === 0 && !$(this).hasClass('bintable-row--nocheckbox')){
                    console.log('Missing Class on bintable-row ('+(k+1)+'): bintable-row--nocheckbox');
                    $(this).addClass('bintable-row--nocheckbox');
                }
                if($(this).find('.bintable-options').length === 0 && !$(this).hasClass('bintable-row--nooptions')){
                    console.log('Missing Class on bintable-row ('+(k+1)+'): bintable-row--nooptions');
                    $(this).addClass('bintable-row--nooptions');
                }
                if($(this).find('.bintable-totalrow').length !== 0 && !$(this).hasClass('bintable-row--total')){
                    console.log('Missing Class on bintable-row ('+(k+1)+'): bintable-row--total');
                    $(this).addClass('bintable-row--total');
                }
                //console.log($(this).find('.form__item__field--quantity').val());
                
                // If .bintable-row is NOT EQUAL to 0
                if($(this).find('.form__item__field--quantity').val() !== "0"){
                    self.selectBasket($(this));
                }
                if($(this).find('.form__item__field--select--reason').val() == "damaged"){
                    self.showRemoveBin($(this));
                }
                
            });
            if(this.DOM.hiddenQuantity.closest('.bintable-row').hasClass('bintable-row--selected')){
                this.DOM.hiddenQuantity.val('1').trigger('change');
            }
        },
        toggleBasket: function(e){
            e.preventDefault();
            var $row = $(e.currentTarget).closest('.bintable-row'),
                $isSelected = $row.hasClass('bintable-row--selected');
            return $isSelected ? this.deselectBasket($row) : this.selectBasket($row);
        },
        handleReason: function(e, preventDouble){

            var $dropdown = $(e.currentTarget),
                $row = $dropdown.closest('.bintable-row'),
                $qdropdown = $row.find('.form__item__field--quantity');


            ($dropdown.val() == "damaged") ? this.showRemoveBin($row) : this.hideRemoveBin($row);

            if(preventDouble) return true;

            if($dropdown.val() !== 'invalid'){
                this.selectBasket($row); 
            }else{
                this.deselectBasket($row);
            }


        },
        handleQuantity: function(e, preventDouble){
            if(preventDouble) return true;

            var $dropdown = $(e.currentTarget),
                $row = $dropdown.closest('.bintable-row'),
                $hdnqty = $row.find('#ff-wheeled-rubbish-bin__qtyhdn');
            if($dropdown.val() != '0'){
                if($hdnqty) $hdnqty.val('1').trigger('change');
                this.selectBasket($row);
            }else{
                if($hdnqty) $hdnqty.val('0').trigger('change');
                this.deselectBasket($row);
            }
        },
        deselectBasket: function($row, force){
            if($row.find('#ff-wheeled-rubbish-bin__qtyhdn').length) this.DOM.hiddenQuantity.val('0').trigger('change');
            $row.removeClass('bintable-row--selected');
            $row.find('input[type="checkbox"]').removeAttr('checked');
            $row.find('.bintable-checkbox span').removeClass('checked');
            $row.find('.form__item__field--select--reason').val('invalid').trigger('change', [true]);
            $row.find('.form__item__field--quantity').val('0').trigger('change', [true]);
        },
        getTotalSelected: function(){
            return this.$el.find('.bintable-row--selected').length;
        },
        selectBasket: function($row){
            var $qdropdown = $row.find('.form__item__field--quantity');
            //if($row.find('#ff-wheeled-rubbish-bin__qtyhdn').length) $row.find('#ff-wheeled-rubbish-bin__qtyhdn').val('1').trigger('change');
            $row.addClass('bintable-row--selected');
            $row.find('input[type="checkbox"]').prop('checked','checked'); 
            $row.find('input[type="checkbox"] + field__label').addClass('field__label--checked');
            $row.find('.bintable-checkbox span').addClass('checked'); // Look into css
            if($row.find('#ff-wheeled-rubbish-bin__qtyhdn').length){
                if($qdropdown.val() == '0') $qdropdown.val('180L').trigger('change');
            }else{
                if($qdropdown.val() == '0') $qdropdown.val('1').trigger('change');
            }
        },
        showRemoveBin: function($row){
            $row.find('.bintable-select--oldbin').addClass('bintable-select--oldbin_active');
        },
        hideRemoveBin: function($row){
            var ob = $row.find('.bintable-select--oldbin');
            ob.removeClass('bintable-select--oldbin_active');
            ob.find('input').removeProp('checked').trigger('change').closest('span').removeClass('checked');
        }
    });
},'1.0.0' , {
    requires: ['module', 'breakpoints']
});