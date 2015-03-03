
var triggresp = function(){
	setTimeout(function(){
		if(!$('#choice3').is(':checked') && $('#corr').is(':checked')){
    		//console.log('Send Response: Triggered reshowing');
       		$('#corr').trigger('check');
   	 	}
	}, 200);
    
};

$('#choice1').on('uncheck', triggresp);
$('#choice2').on('check', triggresp);
$('#choice3').on('uncheck', triggresp);

$('#choice1').on('check', function(){
	setTimeout(function(){
		if($('#confirm-your-email').is(':checked')){
			//console.log('SHOULD BE HIDING');
			$('#field-addmyaddressCheckbox').attr('style', 'display:none');
		}
	});
});

$('#corr').on('check', function(){
	//console.log('====== Checked + showing');
    $('#path1').show();
    //console.log('======================== Completed');
});
$('#corr').on('uncheck', function(){
	//console.log('====== Unchecked + hiding');
    $('#path1').hide();
});
if($("input[name='actor']").is(":checked")){
	$('#field-submitPathway').hide();
}
$("input[name='actor']").on('change', function(){
	$('#field-submitPathway').show();
});
if ($(".path").length === 0){
	// Server refresh
    $( "#complaintsJSSubmit").trigger("click");
}
var isch = false;
$("input[name='actor']").each(function(){
	if($(this).is(':checked')){
		isch = true;
	}
});
if(!isch){
	$('#field-submitPathway').hide();
	setTimeout(function(){
		$('#path1').hide();
	}, 300);
}else{
	//console.log('========== SHOULD BE SHOWN');
	$('#field-submitPathway').show();
}

$("input[name='actor']").on('change', function(){
	$('#field-submitPathway').show();
});
if($("#choice1").is(':checked') && $('#confirm-your-email').is(':checked')){
    $('#field-addmyaddressCheckbox').hide(); console.log('yehhhh');
}
triggresp();
//DEBUG

// $('#myaddresschk').on('check', function(){
// 	//console.log('====== Address Checked');
// });
// $('#myaddresschk').on('uncheck', function(){
// 	//console.log('====== Address Unchecked');
// });
(function StatComplaintsBug() {
    var $stat = $('html'),
        $choice1 = $stat.find('#choice1'),
        $choice2 = $stat.find('#choice2'),
        $check = $stat.find('#myaddresschk'),
        stateOfCheck = !!$check.is(':checked');

    $choice1.on('uncheck', function() {
        if (!stateOfCheck) {
            $check.trigger('hsa_uncheck');
        }
    });
    $choice1.on('check', function() {
        stateOfCheck = !!$check.is(':checked');
        if (stateOfCheck) {
            $check.trigger('hsa_check');
        }
    });
    setTimeout(function(){
    	if(stateOfCheck && $choice2.is(':checked')){
        	$check.trigger('hsa_uncheck');
        }
    }, 150);
})();