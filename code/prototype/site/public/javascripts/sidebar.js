
var Sidebar = (function() {
    //
    //

    var showSidebar = function() {
        //
        $('#sidebar').removeClass('hidden');
        $('#sidebar').hide('slide', {direction: 'right'}, 1000); 
    };

    var hideSidebar = function() {
        //
        $('#sidebar').show('slide', {direction: 'right'}, 1000); 
    };

    return {
        showSidebar    :   showSidebar,
        hideSidebar    :   hideSidebar
    };

}());
