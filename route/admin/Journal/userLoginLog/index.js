const express=require('express');
const common=require('../../../../libs/common');
var db = common.Mysql();

module.exports=function (){
  var router=express.Router();
  //页面渲染接口
  router.get('/index',(req,res)=>{
      common.setLogInMysql(req,'userLoginLog','check');
      res.render('admin/view/Journal/userLoginLog/index.ejs',{})
  });
  //表格渲染
  router.get('/userLoginLogList',(req,res)=>{
     var sql = common.splicGetData(req);
      db.query(`SELECT * FROM userLoginLogList ${sql.selectAllList}`,(err,dataLimit)=>{
        db.query(`SELECT * FROM userLoginLogList ${sql.selectAllList} ${sql.selectWhere}`,(err,data)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else{
            var formData = data;
            for(var i=0;i<formData.length;i++){
              formData[i].loginTime = common.getStampDate(formData[i].loginTime);
            }
            var tableList={
              "code": 0,
              "msg": "",
              "count": dataLimit.length,
              "data": formData
            };
            res.send(tableList).end();
          }
        });
      });
  });


  return router;
};
