const express=require('express');
const common=require('../../../libs/common');
var db = common.Mysql();
module.exports=function (){
  var router=express.Router();
  console.log(0)
  //页面渲染接口
  router.get('/index',(req,res)=>{
    common.setLogInMysql(req,'Home','check');
    res.render('admin/view/Home/index.ejs',{})
  });
  
  return router;
};
