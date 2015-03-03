var $_GET = {};
document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});

var numVehicles = $('.vehicle').length;
//console.log("numVehicles: "+ numVehicles);
var numVehiclesOffset = numVehicles - 1;
//console.log("numVehiclesOffset: "+ numVehiclesOffset);
//console.log("$_GET['position']: "+ $_GET["position"]);

if ( $(".vehicle")[0] && numVehicles > 1 && $_GET.position != 1  && !$("#errors").is(":visible")){

	// Move JS to portlet only? page only?
	// Add js--add-vehicle?

    $("body, html").animate({
     scrollTop: $(".vehicle").eq(numVehiclesOffset)
     	.offset().top
    }, 0);
}

if($("#errors").is(":visible")){
	 $("body, html").animate({
	     scrollTop: $("#errors").offset().top
	 }, 0);
}