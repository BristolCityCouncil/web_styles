$(function(){
	return;
	// Breakpoints
	var mobile 		= "screen and (max-width: 480px)";
	var tablet 		= "screen and (min-width: 481px) and (max-width: 769px)";
	var desktop 	= "screen and (min-width: 769px)";
	
	// Rearrange templates based on priority
	if ($(".span4.priority--primary")[0]){
		var span4 = $(".span4.priority--primary");
		var span8 = $(".span8.priority--secondary");
	}
	
	enquire
		.register(mobile, {
	
		    // OPTIONAL
		    // If supplied, triggered when a media query matches.
		    match : function() {
		    	//console.log("MOBILE: match");
		    	
		    	if ($(".span4.priority--primary")[0]){
		    		span4.insertBefore(span8);
		    	}
		    },
		                                
		    // OPTIONAL
		    // If supplied, triggered when the media query transitions 
		    // *from a matched state to an unmatched state*.
		    unmatch : function() {
		    	//console.log("MOBILE: unmatch");
		    	
		    	if ($(".span4.priority--primary")[0]){
		    		span4.insertAfter(span8);
		    	}
		    	
		    	// NavigationLists: tiled lists
		    	$('.tiled.js--matchHeight .tiled__item__title').matchHeight('remove');
		    	
		    },    
		    
		    // OPTIONAL
		    // If supplied, triggered once, when the handler is registered.
		    setup : function() {
		    	
		    },    
		                                
		    // OPTIONAL, defaults to false
		    // If set to true, defers execution of the setup function 
		    // until the first time the media query is matched
		    deferSetup : true,
		                                
		    // OPTIONAL
		    // If supplied, triggered when handler is unregistered. 
		    // Place cleanup code here
		    destroy : function() {}
		      
		})
		.register(tablet, {
			
			// TABLET
		    match : function() {
		    	//console.log("TABLET: match");
		    	
		    	// NavigationLists: tiled lists
		    	$('.tiled.js--matchHeight .tiled__item__title').matchHeight();
		    },
		    
		    unmatch : function() {
		    	console.log("TABLET: unmatch");
		    }
		      
		})
		.register(desktop, {
			
			// DESKTOP
		    match : function() {
		    	//console.log("DESKTOP: match");
		    	
		    	// NavigationLists: tiled lists
		    	$('.tiled.js--matchHeight .tiled__item__title').matchHeight();
		    	
		    	// Parking: visitor permits
		    	$("#parking__visitor-permits__choose.js--matchHeight .slab").matchHeight();
		    	
		    	// Parking: permit details
		    	$(".permit.js--matchHeight > .permit__inner").matchHeight();
		    },
		    
		    unmatch : function() {
		    	//console.log("DESKTOP: unmatch");
		    	
		    	// Parking: visitor permits
		    	$("#parking__visitor-permits__choose.js--matchHeight .slab").matchHeight('remove');
		    	
		    	// Parking: permit details
		    	$(".permit.js--matchHeight > .permit__inner").matchHeight('remove');
		    }
		      
		});

	
});

	