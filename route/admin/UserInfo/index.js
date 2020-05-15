const express=require('express');
const common=require('../../../libs/common');
const mysql = require('mysql');
var db= mysql.createPool({
      host:'101.200.85.12',
      user:'monaijie',
      password:'mnj19950421',
      database:'weiyifang',
    });
module.exports=function (){
  var router=express.Router();
  //页面渲染接口
  router.get('/index', (req, res)=>{
    res.render('admin/view/UserInfo/index.ejs', {});
  });
  return router;
};
