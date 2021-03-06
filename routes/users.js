var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/check',function (req, res, next) {
    console.log('get usercheck---');
    res.end()
});

router.post('/reg', function(req,res,next) {
  var data = req.body;

  // 这个回调黑洞真是要命！！！ 想用Promise！！！！想用await！！！
  User.findOne({user_name: data.user_name},function(err,user){
    if (err) {
        res.send(new Error(err));
    } else {
      if (user) {
        console.log('user---',user);
        res.send({msg:"exist"})
      } else {

       User.findOne({email: data.email}, function(err,user){
           if (err) {
               res.send(new Error(err));
           } else {
               if (user) {res.send({msg: 'email_exist'})} else {
                   var newUser = new User({
                       user_name: data.user_name,
                       email: data.email,
                       password: data.password,
                   });
                   newUser.save();
                   res.send({msg: 'success'})
               }
           }
       })
      }
    }
  })

});

router.post('/login', function(req, res, next) {
    var data = req.body;
    console.log('data---',data);
    User.findOne({email: data.email},function(err,user){
        console.log('err',err,'user',user);
        if (err) {
            res.send(new Error(err))
        } else {
            if (user) {
                if (user.password == data.password) {
                    // 登录成功的后端操作 todo
                    res.send({msg:'success',token:user._id});
                } else {
                    res.send({msg: 'pass_err'})
                }
            } else {
                res.send({msg:'not_exist'})
            }
        }
    })
});

module.exports = router;
