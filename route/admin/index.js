const express=require('express');
const common=require('../../libs/common');

module.exports=function (){
  var router=express.Router();

  //检查登录状态
  router.use((req, res, next)=>{
    if(!req.session['admin_id'] && req.url!='/login'){ //没有登录
      res.redirect('/admin/login');
    }else{
      next();
    }
  });
  router.get('/view/Home/index',(req,res)=>{
    common.setLogInMysql(req,'Home','check');
    res.render('admin/view/Home/index.ejs',{})
  });
  
  //登录逻辑
  router.use('/login',require('./Login/index')());
  //菜单栏逻辑
  router.use('/',require('./Menu/index')());
  //Home页逻辑
  //router.use('/view/Home', require('./Home/index')());
  //权限管理逻辑
  router.use('/view/Authen', require('./Authen/index')());
  //首页管理逻辑
  router.use('/view/Index',require('./Index/index')());
  //产品管理逻辑
  router.use('/view/Product',require('./Product/index')());
  //联系我们逻辑
  router.use('/view/Contact',require('./Contact/index')());
  //个人资料逻辑
  router.use('/view/UserInfo',require('./UserInfo/index')())
  //日志管理逻辑
 router.use('/view/Journal',require('./Journal/index')())
  return router;
};
