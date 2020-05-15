const express=require('express');
const common=require('../../../libs/common');

module.exports=function (){
  var router=express.Router();
   
  //日志管理逻辑
  router.use('/opertateLog', require('./operateLog/index')());
  router.use('/userLoginLog', require('./userLoginLog/index')());

  return router;
};
