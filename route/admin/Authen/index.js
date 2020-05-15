const express=require('express');
const common=require('../../../libs/common');

module.exports=function (){
  var router=express.Router();

  //管理员管理逻辑
  router.use('/user', require('./user/index')());
  router.use('/module', require('./module/index')());
  
  return router;
};
