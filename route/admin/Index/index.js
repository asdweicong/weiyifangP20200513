const express=require('express');
const common=require('../../../libs/common');

module.exports=function (){
  var router=express.Router();

  //首页管理逻辑
  router.use('/banner', require('./banner/index')());
  router.use('/product', require('./product/index')());

  return router;
};
