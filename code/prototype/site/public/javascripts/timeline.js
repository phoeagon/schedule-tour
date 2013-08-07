function updateTimeline(){
    
    $.getJSON('/calendarentries' , function(data){
            //console.log( JSON.stringify(data) )
            if ( /*data.length == undefined ||*/ data.length == 0 )
                data = [{start:new Date() , title:"<b>Sample</b><br/>Add an event to see this"}];
            for (var ele in data ) if (data[ele].start && data[ele].end){
                var t1 = moment( data[ele].start );
                var t2 = moment( data[ele].end );
                var content_tag =
                    "<b>"+data[ele].title+"</b><br/>Start: "+t1.calendar();
                data[ele].start = t1.toDate()
                data[ele].end = t2.toDate()
                if ( data[ele].end.valueOf() - data[ele].start.valueOf() < 1000*3600 )
                    delete data[ele].end;
                data[ele].content = content_tag + "<br/>"+data[ele].place+"<br/>"
                +$('<div>').append( $('<button>').attr('onclick','\
                    ScheduleTour.getMap().panTo( new ScheduleTourMap.Point('
                    +data[ele].position[0]+' ,'
                    +data[ele].position[1]+' ) )' ).html('Go')
                        ).html();

                Timeline.lib_tl = new links.Timeline(document.getElementById("timeline"))
                var options = {
                    zoomable : true ,
                    cluster :  true ,
                    showCurrentTime : false
                }
                Timeline.lib_tl.draw(data, options);
                $('#timeline').css('overflow','auto')
            };
            }
        )
}
Timeline = {
    update : updateTimeline ,
    lib_tl : null
}
$(document).ready( updateTimeline )
