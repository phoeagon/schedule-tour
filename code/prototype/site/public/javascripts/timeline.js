function updateTimeline(){
    $.getJSON('/calendarentries' , function(data){
            console.log( JSON.stringify(data) )
            for (var ele in data ){
                var t1 = moment( data[ele].start );
                var t2 = moment( data[ele].end );
                var content_tag =
                    "<b>"+data[ele].title+"</b><br/>Start: "+t1.calendar();
                data[ele].start = t1.toDate()
                data[ele].end = t2.toDate()
                if ( data[ele].end.valueOf() - data[ele].start.valueOf() < 1000*3600 )
                    delete data[ele].end;
                data[ele].content = content_tag ;
            
                var timeline = new links.Timeline(document.getElementById("timeline"))
                var options = {
                    zoomable : true ,
                    cluster :  true 
                }
                timeline.draw(data, options);
            };
            }
        )
}

$(document).ready( updateTimeline )
