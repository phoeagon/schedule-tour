
/*
 * GET home page.
 */

exports.index = function(req, res){
  //console.log( "error: " + JSON.stringify(req.flash("error")))
  res.render('index', { title: 'Schedule-tour' ,
                        error : req.flash("error")[0] ,
                        success : req.flash("success")[0]
                       }
            );
};
