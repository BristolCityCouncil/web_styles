/*****************************************************************\
  Check Events (passive)
/*****************************************************************\
 * This is an events extension to Radios and Checkboxes that 
 * adds the events 'check', 'uncheck', 'hsa_check' and
 * 'hsa_uncheck'. 
 * 
 * Check and Uncheck can be used anywhere, but HSA is exclusive
 * to FOI/complaints.
\*****************************************************************/

YUI().use(['module'], function(Y){
	
    var Header = Y.uk.gov.bristol.module.extend({
    	DOM: {
    		'mobileMenuToggle' : '.bcc-header__mobile-nav--menu',
    		'mobileSearchToggle' : '.bcc-header__mobile-nav--search',
    		'mobileMenu': '.bcc-header__menu',
    		'mobileSearch': '.bcc-header__search--mobile',
    		'allMenus' : '.bcc-header__mobile-nav',
    	},
    	activeClass: 'bcc-header__mobile-nav--active',
    	events: {
    		'mousedown $mobileMenuToggle' : "toggleMenu",
    		'mousedown $mobileSearchToggle' : "toggleSearch",
    	},
    	toggleMenu: function(e){
    		if($(e.currentTarget).hasClass(this.activeClass)){
    			this.DOM.allMenus.removeClass(this.activeClass);
    			return this.hideMenu($(e.currentTarget));
    		}
    		this.DOM.allMenus.removeClass(this.activeClass);
    		return this.showMenu($(e.currentTarget));
    	},
    	hideMenu: function(el){
    		if(el) el.removeClass(this.activeClass);
    		this.DOM.mobileMenu.removeClass('bcc-header__menu--showmobile');
    	}, 
    	showMenu: function(el){
    		if(el) el.addClass(this.activeClass);
    		this.hideSearch();
    		this.DOM.mobileMenu.addClass('bcc-header__menu--showmobile');
    	},

    	toggleSearch: function(e){
    		if($(e.currentTarget).hasClass(this.activeClass)){
    			this.DOM.allMenus.removeClass(this.activeClass);
    			return this.hideSearch($(e.currentTarget));
    		}
    		this.DOM.allMenus.removeClass(this.activeClass);
    		return this.showSearch($(e.currentTarget));
    	},
    	hideSearch: function(el){
    		if(el) el.removeClass(this.activeClass);
    		this.DOM.mobileSearch.removeClass('bcc-header__search--showmobile');
    	}, 
    	showSearch: function(el){
    		if(el) el.addClass(this.activeClass);
    		this.hideMenu();
    		this.DOM.mobileSearch.addClass('bcc-header__search--showmobile');
    	},
    	
    }),
	module = new Header('.bcc-header');
});