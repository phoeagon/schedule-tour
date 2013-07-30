$.getJSON('/calendarentries' , function(data){
            console.log( JSON.stringify(data) )
            for (var ele in data ){
                var content_tag =
                    "<b>"+data[ele].title+"</b><br/>Start: "+data[ele].start;
                data[ele].start = new Date( data[ele].start )
                data[ele].end = new Date( data[ele].end )
                if ( data[ele].end.valueOf() - data[ele].start.valueOf() < 1000*3600 )
                    delete data[ele].end;
                data[ele].content = content_tag ;
            $(document).ready(function() {
                var timeline = new links.Timeline(document.getElementById("timeline"))
                var options = {
                    zoomable : true ,
                    cluster :  true 
                }
                timeline.draw(data, options);
            });
            }
        })
