resultPad = {
    opened : false ,
    ele : null ,
    showResultList : null ,
    destroyResultList : null
}

resultPad.show = function(dataList) {
    var theList = $('#result_list');
    theList.empty();
    var data = dataList;
    for (var i = 0; i < data.length; i++) {
	theList.append('<h3>'+data[i]['title']+'</h3>');
	theList.append('<div>'+data[i]['content']+'</h3>');
    }
    theList.accordion({active : 0});
    theList.addClass('shown');

    this.opened = true
    this.ele = theList
};

resultPad.destroy= function() {
    var theList = $('#result_list');
    theList.accordion('destroy');
    theList.empty();
    theList.removeClass('shown');
    
    this.opened = true
    this.ele = null
}
