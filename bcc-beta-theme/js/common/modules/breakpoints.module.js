/*****************************************************************\
  Breakpoint Event Wrapper
/*****************************************************************\
 * This module reacts  different breakpoints using media queries
 * and opens up the functionality of enquire.js to the other
 * modules using simple subscription events.
 * Usage:
	
	var breakpoints = new Y.uk.gov.bristol.Breakpoints();
	breakpoints.on('mobile', function(){
		// this code only executed on mobile
	});
	breakpoints.off('mobile', function(){
		// this code only executed when transitioning 
		// from mobile->tablet/desktop
	})
 
 * The three breakpoints available are:
 * 	- mobile (0px - 480px)
 *	- tablet (481px - 769px)
 *	- desktop (769px +)
 *
\*****************************************************************/

//console.log("Yo");

YUI().add(['breakpoints'], function(Y){

	var breakpoints = Y.uk.gov.bristol.module.extend({

		DOM: {
			'primarySlab' : ".span4.priority--primary",
			'secondarySlab': ".span8.priority--secondary",
			'complaintsItem' : '.tiled.js--matchHeight .tiled__item__title',
			'slab' : '.js--matchHeight .slab',
			'permit' : '.js--matchHeight.permit .permit__inner',
		},
		breakpoints: {
			mobile: "screen and (max-width: 480px)",
			tablet: "screen and (min-width: 481px) and (max-width: 769px)",
			dekstop: "screen and (min-width: 769px)"
		},
		render: function(){

			
			this.on('dekstop', function(){
				
				// Match Desktop
				//console.log("DESKTOP: match");

				if (this.DOM.primarySlab.length){
	    			this.DOM.primarySlab.insertAfter(this.DOM.secondarySlab);
				}
				this.DOM.complaintsItem.matchHeight();

		    	this.DOM.slab.matchHeight();
		    	
		    	this.DOM.permit.matchHeight();
		    	

			}, function(){
				
				// Unmatch Desktop
				//console.log("DESKTOP: unmatch");
				
				
				
				this.DOM.slab.matchHeight('remove');

		    	this.DOM.permit.matchHeight('remove');
		    	
			});

			
			
			this.on('tablet', function(){

				// Match Tablet
				//console.log("TABLET: match");
				
				if (this.DOM.primarySlab.length){
	    			this.DOM.primarySlab.insertBefore(this.DOM.secondarySlab);
				}
				
				this.DOM.complaintsItem.matchHeight();
				
			}, function(){
				
				// Unmatch Mobile
				//console.log("TABLET: unmatch");
				
			});
			
			this.on('mobile', function(){
				
				// Match Mobile
				//console.log("MOBILE: match");
				
				if (this.DOM.primarySlab.length){
	    			this.DOM.primarySlab.insertBefore(this.DOM.secondarySlab);
				}
				
			}, function(){
				
				// Unmatch Mobile
				//console.log("MOBILE: unmatch");
				
			});

			
		},
		
		on: function(device, fnon, fnoff){
			/* Lightweight wrapper around enquire, usage:
				this.on('mobile', funciton(){
					// mobile matched
				}, function(){
					// mobile unmatched
				});
			 */
			// Check breakpoint exists
			if(!this.breakpoints[device]) return false;

			// Make a wee object
			obj = {};

			// if the match function exists, add it
			if(fnon)
				obj.match = fnon.bind(this);

			// if the unmatch function exists, add it too
			if(fnoff)
				obj.unmatch = fnoff.bind(this);

			// do the enquire
			enquire.register(this.breakpoints[device], obj);

			// Success!
			return true;
		},
		off: function(device, fnoff){
			return this.on(device, null, fnoff);
		},


	});

	Y.namespace('uk.gov.bristol').Breakpoints = new breakpoints();

},'1.0.0' , {
    requires: ['module']
});