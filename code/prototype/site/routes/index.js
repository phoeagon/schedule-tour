
/*
 * GET home page.
 */

exports.index = function(req, res){
  //req.flash("error","Hello world");
  res.render('index', { title: 'Schedule-tour' ,
                        error : req.flash("error") ,
                        success : req.flash("success")
                       }
            );
};
