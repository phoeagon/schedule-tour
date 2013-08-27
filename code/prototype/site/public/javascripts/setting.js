settingAdapter = {};
settingAdapter.isOn = false;

settingAdapter.setForm = function(){
    $('#toggle_map_style').click(function(){
		$('#map').toggleClass('styledHue');
		current_config.mapStyle ^= 1;
		configClient.saveConfig( current_config );
	    });
}
settingAdapter.setFormTrigger = function(){
    $('#setting_show_button').click(function(){
	if (settingAdapter.isOn){
	    settingAdapter.isOn = false;
	    $( "#setting_panel" ).dialog("close")
	    return
	}
	    $( "#setting_panel" ).removeClass("hidden")
	    settingAdapter.isOn = true;
	    $( "#setting_panel" ).dialog({
		autoOpen: true,
		width: "400px",
		buttons: [
		    {
			text: "Ok",
			click: function() {
			    $( this ).dialog( "close" );
			}
		    }
		]
	    });
	});
}
settingAdapter.applySetting = function(){
    	configClient.getConfig( function(data){
	    current_config = data;
	    configClient.applyConfig( data );
	});
}
settingAdapter.applyAll = function(){
    console.log( "settingAdapter.applyAll" );
    settingAdapter.setForm();
    settingAdapter.setFormTrigger();
    settingAdapter.applySetting();
}
$(window).load( settingAdapter.applyAll );
