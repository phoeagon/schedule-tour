jQuery UI Tutorial
===================================
phoeagon

## jQuery UI deployment

## jQuery UI dialogs

        <div id="dialog" class="dialog" title="Adding Event">test</div>
        <script type="text/javascript">
        $( "#dialog" ).dialog({
            autoOpen: true,
            width: 400,
            buttons: [
                {
                    text: "Ok",
                    click: function() {
                        $( this ).dialog( "close" );
                    }
                },
                {
                    text: "Cancel",
                    click: function() {
                        $( this ).dialog( "close" );
                    }
                }
            ]
        });
        </script>
