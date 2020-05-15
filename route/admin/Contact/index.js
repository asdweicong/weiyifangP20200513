const express=require('express');
const common=require('../../../libs/common');

module.exports=function (){
  var router=express.Router();

  //管理员管理逻辑
  router.use('/telephone', require('./telephone/index')());
  router.use('/message', require('./message/index')());

  return router;
};
