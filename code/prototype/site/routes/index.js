
/*
 * GET home page.
 */

exports.index = function(req, res){
    if (req.query.action)
        req.flash("action",req.query.action)
  res.render('index', { title: 'Schedule-tour' ,
                        error : req.flash("error")[0] ,
                        success : req.flash("success")[0],
                        action  : req.flash("action")[0]
                       }
            );
};
