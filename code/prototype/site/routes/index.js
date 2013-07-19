
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Schedule-tour' ,
                        error : req.flash("error")[0] ,
                        success : req.flash("success")[0]
                       }
            );
};
