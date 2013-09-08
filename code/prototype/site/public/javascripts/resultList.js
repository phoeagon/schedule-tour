ResultPad = function( divSelector ){
    if (!divSelector)
        divSelector = '#result_list';
    var proto = {
        divSelector : divSelector ,
        opened : false ,
        ele : null ,
        showResultList : null ,
        destroyResultList : null
    };
    for (var ele in proto)
        this[ele] = proto[ele];
    return this;
}

ResultPad.prototype.show = function(dataList) {
    var theList = $( this.divSelector );
    theList.empty();
    var data = dataList;
    for (var i = 0; i < data.length; i++) {
	theList.append('<h3 class="result_item_'+i+'">'+data[i]['title']+'</h3>');
    theList.append(data[i].content.addClass('result_item_'+i));
	//theList.append('<div class="result_item_'+i+'">'+data[i]['content']+'</h3>');
    }
    theList.accordion({active : 0});
    theList.addClass('shown');

    this.opened = true
    this.ele = theList
};

ResultPad.prototype.destroy= function() {
    var theList = $( this.divSelector );
    theList.accordion('destroy');
    theList.empty();
    theList.removeClass('shown');
    
    this.opened = true
    this.ele = null
}
resultPad = new ResultPad();//create new instance
messagePad = new ResultPad('#message_list');//create new instance
callPad = new ResultPad('#call_list');//create new instance
stepPad = new ResultPad('#step_list');
