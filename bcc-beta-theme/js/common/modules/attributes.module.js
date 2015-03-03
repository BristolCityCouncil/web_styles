/*****************************************************************\
  Events Binding
/*****************************************************************\
 * This class allows us to bind a lot of custom events on the DOM
 * and keep our code clean. It also encourages us to reuse events
 * that we use often. 
 * 
 * This has since been added to the Module class.
 *
 * Usage:
 
 	Y.uk.gov.bristo.events.bind({	
		'click' : {
			'.myselector' : functon(){ ... },
		},
		'mousein' : {
			'.myselector' : function(){ ... },
		}
 	});
 	
\*****************************************************************/
YUI.add('bccevents', function(Y){

 	Y.namespace("uk.gov.bristol");

    Y.uk.gov.bristol.events = (function(){
		var _bE = function(k,v){ // private::bindEvents
			$.each(v, function(l, m){ $(l).on(k, m); });
		},
			_bA = function(k,v){ // private::bindAttributes
			$.each(v, function(p, c){ $("*["+p+"]").each(function(){ c($(this)); }); });
		};
		return {
			bind: function(events){ // events.bind({});
				$.each(events, function(k, v){
					if(k == "attributes"){
						_bA(k,v); // bind attributes
					}
					_bE(k,v); // bind events
				});
			}
		};
	})();

});