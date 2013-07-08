/*
 * Login.
 */

var crypto = require('crypto');
var User = require('../models/user')
var utility = require('../models/utility')
var passwordHash = utility.passwordHash;

module.exports = function(app) {
  
  app.get('/reg', checkNotLogin);
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
      return res.redirect('/reg');
    }
  
    //生成口令的散列值
    var password = passwordHash( req.body.password , req.body.username );
    
    var newUser = new User({
      name: req.body.username,
      password: password,
    });
    
    //檢查用戶名是否已經存在
    User.get(newUser.name, function(err, user) {
      if (user)
        err = 'Username already exists.';
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      //如果不存在則新增用戶
      newUser.save(function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/reg');
        }
        req.session.user = newUser;
        req.flash('success', '註冊成功');
        res.redirect('/');
      });
    });
  });
  
  app.get('/login', checkNotLogin);
  app.get('/login', function(req, res) {
    res.render('login', {
      title: '用戶登入',
    });
  });
  
  app.post('/login', checkNotLogin);
  app.post('/login', function(req, res) {
    //生成口令的散列值
    var password = passwordHash( req.body.password , req.body.username );
    
    req.flash("error", "erro");
    User.get(req.body.username, function(err, user) {
      if (!user) {
        req.flash('error', '用戶不存在');
        return res.redirect('/login');
      }
      if (user.password != password) {
        req.flash('error', '用戶口令錯誤');
        return res.redirect('/login');
      }
      req.session.user = user;
      req.flash('success', '登入成功');
      res.redirect('/');
    });
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
};

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登入');
    return res.redirect('/login');
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
    User.get(req.body.username, function(err, user) {
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
      user.save( function(err){
            if (err)
                req.session.error = 'Operation failed';
            else req.session.success = 'Successfully changed password!';
            res.redirect('/');
      });
    });
    
}
