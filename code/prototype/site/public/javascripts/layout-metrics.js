var layoutMetrics ={ };
layoutMetrics.calHeight = '90%';
layoutMetrics.calAnimationTime = '300ms';
layoutMetrics.sideWid = '25%';
layoutMetrics.sideAnimationTime = '300ms';

layoutMetrics.getSideWid = function(){
    var dist = parseFloat( layoutMetrics.sideWid );
    if ( layoutMetrics.sideWid.indexOf('%') )
        dist /= 100;
    if ( !screen || screen.width*dist >= 300 )
        return layoutMetrics.sideWid;
    else if ( screen.width*(dist=0.5) >=300 )
        return '50%';
    return screen.width+'px'
}
