const express=require('express');
const common=require('../../../libs/common');
var db = common.Mysql();
module.exports=function (){
  var router=express.Router();
  //页面渲染接口
  router.get('/', (req, res)=>{
    res.render('admin/view/Login/index.ejs', {});
  });
  router.post('/', (req, res)=>{
    var username=req.body.username;
    var password=common.md5(req.body.password+common.MD5_SUFFIX);
    db.query(`SELECT * FROM userInfoList WHERE userName='${username}'`, (err, data)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{
        if(data.length==0){
          var tip = {
            resultType:1,
            message:'账号不存在',
          };
          res.send(tip).end();
        }else{
          if(data[0].newLoginPwd==password){
            //成功
            var tip = {
              resultType:0,
              message:'登录成功',
            };
            req.session['admin_id']=data[0].id;
            common.setUserLoginLog(data[0]);
            res.send(tip).end();
          }else{
            var tip = {
              resultType:2,
              message:'账号或密码错误',
            };
            res.send(tip).end();
          }
        }
      }
    });
  });
  //退出登录
  router.get('/signOut', (req, res)=>{
    res.render('admin/view/Login/index.ejs', {});
  });

  return router;
};
