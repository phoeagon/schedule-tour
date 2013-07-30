settingAdapter = {};
settingAdapter.setForm = function(){
    $('#toggle_map_style').click(function(){
		$('#map').toggleClass('styledHue');
		current_config.mapStyle ^= 1;
		configClient.saveConfig( current_config );
	    });
}
settingAdapter.setFormTrigger = function(){
    $('#setting_show_button').click(function(){
	    $( "#setting_panel" ).removeClass("hidden")
	    $( "#setting_panel" ).dialog({
		autoOpen: true,
		width: "90%",
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
  $(document).ready( settingAdapter.applyAll );
