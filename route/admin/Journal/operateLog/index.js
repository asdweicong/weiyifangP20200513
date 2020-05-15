const express=require('express');
const common=require('../../../../libs/common');
var db = common.Mysql();

module.exports=function (){
  var router=express.Router();
  //页面渲染接口
  router.get('/index',(req,res)=>{
    common.setLogInMysql(req,'operateLog','check');
    res.render('admin/view/Journal/operateLog/index.ejs',{})
  });
  
  //表格渲染
  router.get('/operateLogList',(req,res)=>{
     var sql = common.splicGetData(req);
      db.query(`SELECT * FROM operateLogList ${sql.selectAllList}`,(err,listLImit)=>{
        db.query(`SELECT * FROM operateLogList ${sql.selectAllList}  ${sql.selectWhere}`,(err,data)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
        }else{
          var formData = data;
          for(var i=0;i<formData.length;i++){
            formData[i].logTime = common.getStampDate(formData[i].logTime);
          }
          var tableList={
            "code": 0,
            "msg": "",
            "count": listLImit.length,
            "data": formData
          };
          res.send(tableList).end();
        }
        });
      });
  });

  return router;
};
