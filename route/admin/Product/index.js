const express=require('express');
const common=require('../../../libs/common');

module.exports=function (){
  var router=express.Router();
  //产品管理逻辑
  router.use('/bathroom', require('./bathroom/index')());
  router.use('/customiz', require('./customiz/index')());
  router.use('/hardware', require('./hardware/index')());
  router.use('/intellect', require('./intellect/index')());
  router.use('/other', require('./other/index')());

  return router;
};
