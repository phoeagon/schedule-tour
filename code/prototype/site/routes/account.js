/*
 * Login.
 */

var crypto = require('crypto');
var User = require('../models/types/user');
var utility = require('../models/utility');
var passwordHash = utility.passwordHash;

var setRouter = function(app) {
  
  //app.get('/reg', checkNotLogin);
  app.get('/reg', function(req, res) {
    res.render('reg', {
      title: '用戶註冊',
    });
  });
  
  app.post('/reg', checkNotLogin);
  app.post('/reg', function(req, res) {
    //檢驗用戶兩次輸入的口令是否一致
    if (req.body['password-repeat'] != req.body['password']) {
      req.flash('error', '兩次輸入的口令不一致');
      return res.redirect('/?action=reg');
    }
  
    //生成口令的散列值
    var password = passwordHash( req.body.password , req.body.username );
    
    var newUser = new User({
      _id: req.body.username,
      password: password
    });
    
    //檢查用戶名是否已經存在
    User.findOne(
      {
        _id: newUser.name
      },
      function(err, user) {
        if (user) {
          err = 'Username already exists.';
        }
        if (err) {
          req.flash('error', err);
          return res.redirect('/?action=reg');
        }
        //如果不存在則新增用戶
        newUser.save(function(err) {
          if (err) {
            req.flash('error', err);
            return res.redirect('/?action=reg');
          }
          req.session.user = newUser;
          req.flash('success', '註冊成功');
          res.redirect('/');
        });
      }
    );
  });
  
  //app.get('/login', checkNotLogin);
  app.get('/login', function(req, res) {
    res.render('login', {
      title     :   '用戶登入',
      error     :   req.flash('error'),
      success   :   req.flash('success')
    });
  });
  
  app.post('/login', checkNotLogin);
  app.post('/login', function(req, res) {
    //生成口令的散列值
    var password = passwordHash( req.body.password , req.body.username );
    
    //req.flash("error", "erro");
    User.findOne(
      {
        _id: req.body.username
      },
      function(err, user) {
        if (!user) {
          req.flash('error', '用戶不存在');
          return res.redirect('/');
        }
        if (user.password != password) {
          req.flash('error', '用戶口令錯誤');
          return res.redirect('/');
        }
        req.session.user = user;
        req.flash('success', '登入成功');
        res.redirect('/');
      }
    );
  });
  
  app.get('/logout', checkLogin);
  app.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
  });
  app.get('/changePassword', checkLogin);
  app.get('/changePassword', function(req,res){
      res.render( 'changePassword' , {} );
      });
  app.post('/changePassword', checkLogin);
  app.post('/changePassword', doChangePassword);

  app.post('/friend/add', checkLogin);
  app.post('/friend/add', friends.addFriend);
  app.post('/friend/del', checkLogin);
  app.post('/friend/del', friends.delFriend);
  app.post('/friend/list', checkLogin);
  app.post('/friend/list', friends.listFriends);
};

function checkLogin(req, res, next) {
  console.log(req.session);
  console.log(req.session.user);
  if (!req.session.user) {
    req.flash('error', '未登入');
    return res.redirect('/');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登入');
    return res.redirect('/');
  }
  next();
}

function doChangePassword( req , res , next ) {
  //生成口令的散列值
  var oldpassword = passwordHash( req.body.oldpassword , req.body.username );
  var newpassword = passwordHash( req.body.newpassword , req.body.username );
  var newPassword = passwordHash
    if ( req.body.newpassword !== req.body.newpassword2 ){
      req.session.error = "Repetition of new password mismatch!"
        res.redirect('/changePassword');
      return;
    }
  User.findOne(
      {
        _id: req.body.username
      },
      function(err, user) {
        if (!user) {
          req.flash('error', 'Account not exists!');
          return res.redirect('/login');
        }
        if ( user.password != oldpassword ) {
          req.flash('error', 'Invalid current Password!');
          return res.redirect('/changePassword');
        }
        user.password = newpassword;
        req.session.user = user;
        user.save(function(err) {
          if (err) {
            req.session.error = 'Operation failed';
          } else {
            req.session.success = 'Successfully changed password!';
          }
          res.redirect('/');
        });
      }
  );
}


var friends = (function() {
    var resEndJSON = function(res, code, msg) {
        res.end(JSON.stringify({
            code    :   code,
            msg     :   msg
        }));
    };

    var add_friend = function(req, res) {
        var target = req.body.target;
        if (req.session.user._id == target) {
            resEndJSON(res, 'ERR', 'cannot add yourself');
            return;
        }

        User.findOne(
            {
                _id: req.session.user._id
            },
            function(err, user) {
                if (!user) {
                    resEndJSON(res, 'ERR', 'Account Not Exists');
                    return;
                }
                if (-1 !== user.friendsTo.indexOf(target)) {
                    resEndJSON(res, 'ERR', 'Already Friends');
                    return;
                }
                user.friendsTo.push(target);

                user.save(function(err) {
                    if (err) {
                        resEndJSON(res, 'ERR', 'Save Friend Failed');
                        return;
                    }

                    //backwards
                    User.findOne(
                        {
                            _id: target
                        },
                        function(err, targetUser) {
                            if (!targetUser) {
                                resEndJSON(res, 'ERR', 'Target Account Not Exists');
                                return;
                            }
                            if (-1 !== targetUser.friendsFrom.indexOf(user._id)) {
                                resEndJSON(res, 'ERR', 'Already Friends');
                                return;
                            }
                            targetUser.friendsFrom.push(user._id);

                            targetUser.save(function(err) {
                                if (err) {
                                    resEndJSON(res, 'ERR', 'Save Friend Failed');
                                    return;
                                }
                                req.session.user = user;
                                resEndJSON(res, 'OK', 'Save Friend Successfully');
                                return;
                            });
                        }
                    );
                    return;
                });
            }
        );
    };

    var del_friend = function(req, res) {
        var target = req.body.target;
        if (req.session.user._id== target) {
            resEndJSON(res, 'ERR', 'cannot delete yourself');
            return;
        }
        User.findOne(
            {
                _id: req.session.user._id
            },
            function(err, user) {
                if (!user) {
                    resEndJSON('ERR', 'Account Not Exists');
                    return;
                }
                var index = user.friendsTo.indexOf(target);
                if (-1 === index) {
                    resEndJSON(res, 'ERR', 'No Such Friend Found');
                    return;
                }
                user.friendsTo.splice(index, 1);

                user.save(function(err) {
                    if (err) {
                        resEndJSON(res, 'ERR', 'Delete Friend Failed');
                        return;
                    }

                    //backwards
                    User.findOne(
                        {
                            _id: target
                        },
                        function(err, targetUser) {
                            if (!targetUser) {
                                resEndJSON('ERR', 'Target Account Not Exists');
                                return;
                            }
                            var index = targetUser.friendsFrom.indexOf(user._id);
                            if (-1 === index) {
                                resEndJSON(res, 'ERR', 'No Such Friend Found');
                                return;
                            }
                            targetUser.friendsFrom.splice(index, 1);

                            targetUser.save(function(err) {
                                if (err) {
                                    resEndJSON(res, 'ERR', 'Delete Friend Failed');
                                    return;
                                }
                                req.session.user = user;
                                resEndJSON(res, 'OK', 'Delete Friend Successfully');
                                return;
                            });
                        }
                    );
                    return;
                });
            }
        );
    };

    var list_friends = function(req, res) {
        User.findOne(
            {
                _id: req.session.user._id
            },
            function(err, user) {
                if (!user) {
                    resEndJSON(res, 'ERR', 'Account Not Exists');
                    return;
                }
                resEndJSON(res, 'OK', {friendsTo:user.friendsTo, friendsFrom:user.friendsFrom});
                return;
            }
        );
    }

    return {
        addFriend   :   add_friend,
        delFriend   :   del_friend,
        listFriends :   list_friends
    };
})();

module.exports = {
    setRouter   :   setRouter,
    checkLogin  :   checkLogin
};

