const express=require('express');
const common=require('../../libs/common');
var db = common.Mysql();
module.exports=function (){
  var router=express.Router();
  //前端调用接口
  console.log(0);

  //请求获取banner图
  router.get('/bannerList',(req,res)=>{
      db.query('SELECT * FROM bannerList', (err, data)=>{
        if(err){
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          res.send(data).end();
        }
      });
  });
  //请求获取产品展示图
  return router;
};
