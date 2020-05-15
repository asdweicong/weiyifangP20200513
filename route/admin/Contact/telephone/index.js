const express=require('express');
const common=require('../../../../libs/common');
var db = common.Mysql();

module.exports=function (){
  var router=express.Router();

  //页面渲染接口
  router.get('/index',(req,res)=>{
    common.setLogInMysql(req,'telephone','check');
    res.render('admin/view/Contact/telephone/index.ejs',{})
  });
  router.get('/edit',(req,res)=>{
    var id = req.query.id;
    db.query(`SELECT * FROM telephoneList WHERE id=${id}`,(err,data)=>{
      res.render('admin/view/Contact/telephone/edit.ejs',{mod_data:data[0]});
    });
  });
  router.get('/create',(req,res)=>{
    res.render('admin/view/Contact/telephone/create.ejs',{})
  });

  //渲染表格
  router.use('/telephoneList',(req,res)=>{
    var sql = common.splicGetData(req);
    db.query(`SELECT * FROM telephoneList ${sql.selectAllList}`,(err,dataLimit)=>{
      db.query(`SELECT * FROM telephoneList ${sql.selectAllList} ${sql.selectWhere}`,(err,data)=>{
        if(err){
          res.status(500).send('database erro').end();
        }else{
            var tableList={
              "code": 0,
              "msg": "",
              "count": dataLimit.length,
              "data": data
            };
            res.send(tableList).end();
        }
      });
    })
  });
   //新增
   router.post('/create',(req,res)=>{
    var fromData = req.body;
      db.query(`INSERT INTO telephoneList (phone, landline, QQ,weChat,account,address) VALUE('${fromData.phone}', '${fromData.landline}', '${fromData.QQ}', '${fromData.weChat}', '${fromData.account}', '${fromData.address}')`, (err, data)=>{
        if(err){
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          common.setLogInMysql(req,'telephone','creata');
          res.send({
            resultType:0,
            message:'添加成功'
          }).end();
        }
      });
  });
  //修改
  router.post('/edit',(req,res)=>{
    var fromData = req.body;
    db.query(`UPDATE telephoneList SET phone='${fromData.phone}',landline='${fromData.landline}',QQ='${fromData.QQ}' , weChat='${fromData.weChat}' , account='${fromData.account}'  , address='${fromData.address}' WHERE id=${fromData.id}`,(err, data)=>{
        if(err){
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          common.setLogInMysql(req,'telephone','edit');
          res.send({
            resultType:0,
            message:'修改成功'
          });
        }
    });
  });
   //删除
   router.post('/delete',(req,res)=>{
    var id = req.body.id;
    db.query(`DELETE FROM telephoneList WHERE id=${id}`, (err, data)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{
        common.setLogInMysql(req,'telephone','del');
        res.send({
          resultType:0,
          message:'删除成功'
        });
      }
    });
  });
  return router;
};
