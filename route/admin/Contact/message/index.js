const express=require('express');
const common=require('../../../../libs/common');
var db = common.Mysql();

module.exports=function (){
  var router=express.Router();

  //页面渲染接口
  router.get('/index',(req,res)=>{
    common.setLogInMysql(req,'message','check');
    res.render('admin/view/Contact/message/index.ejs',{})
  });
  router.get('/edit',(req,res)=>{
    var id = req.query.id;
    console.log(id);
    db.query(`SELECT * FROM messageList WHERE id=${id}`,(err,data)=>{
      res.render('admin/view/Contact/message/edit.ejs',{mod_data:data[0]})
    });
  });
  
  //渲染表单
  router.get('/messageList',(req,res)=>{
     var sql = common.getMessageLimit(req);
     db.query(`SELECT * FROM messageList ${sql.selectAllList}`,(err,dataLimit)=>{
      db.query(`SELECT * FROM messageList ${sql.selectAllList}  ${sql.selectWhere}`,(err,data)=>{
        if(err){
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          var formData = data;
          for(var i=0;i<formData.length;i++){
            formData[i].time = common.getStampDate(formData[i].time);
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
     })
  });

  return router;
};
