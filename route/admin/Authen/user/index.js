const express=require('express');
const common=require('../../../../libs/common');
var db = common.Mysql();

module.exports=function (){
  var router=express.Router();

  //页面渲染接口
  router.get('/index',(req,res)=>{
    common.setLogInMysql(req,'user','check');
    res.render('admin/view/Authen/user/index.ejs',{})
  });
  router.get('/create',(req,res)=>{
    res.render('admin/view/Authen/user/create.ejs',{})
  });
  router.get('/ChangePwd',(req,res)=>{
    var id = req.query.id;
    db.query(`SELECT id,userName,email FROM userInfoList WHERE id=${id}`,(err,data)=>{
       var fromData = data[0];
       res.render('admin/view/Authen/user/ChangePwd.ejs',{mod_data: fromData})
    });
  });
  router.get('/edit',(req,res)=>{
    var id = req.query.id;
    db.query(`SELECT * FROM userInfoList WHERE id=${id}`,(err,data)=>{
       var fromData = data[0];
       if(fromData.enabledText==0){
        fromData.enabledText = false;
       }else{
        fromData.enabledText = true;
       }
       res.render('admin/view/Authen/user/edit.ejs',{mod_data: fromData})
    });
  });
  
  //表格渲染
  router.get('/userInfoList',(req,res)=>{
    var sql = common.splicGetData(req);
    db.query(`SELECT * FROM userInfoList  ${sql.selectAllList}`,(err,dataLimit)=>{
      db.query(`SELECT * FROM userInfoList  ${sql.selectAllList}  ${sql.selectWhere}`,(err,data)=>{
        if(err){
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          var formData = data;
          for(var i=0;i<formData.length;i++){
            formData[i].registerTime = common.getStampDate(formData[i].registerTime);
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

  //新增
  router.post('/create',(req,res)=>{
    var fromData = req.body;
    var newDate = parseInt(new Date().getTime()/1000);
    if(fromData.newLoginPwd !== fromData.NewLoginPwdConfirm){
      res.send({
        resultType:1,
        message:'两次输入密码不一致'
      }).end();
    }else{
      if(fromData.enabledText==false || fromData.enabledText==undefined){
        fromData.enabledText=0;
      }else{
        fromData.enabledText = 1;
      }
      db.query(`INSERT INTO userInfoList (userName, email, fullName,enabledText,phone,newLoginPwd,registerTime) VALUE('${fromData.userName}', '${fromData.email}', '${fromData.fullName}', '${fromData.enabledText}', '${fromData.phone}', '${fromData.newLoginPwd}', '${newDate}')`, (err, data)=>{
        if(err){
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          common.setLogInMysql(req,'user','creata');
          res.send({
            resultType:0,
            message:'添加成功'
          }).end();
        }
      });
    }
    
  });
  //修改密码
  router.post('/ChangePwd',(req,res)=>{
    var fromData = req.body;
    if(fromData.NewLoginPwd !== fromData.NewLoginPwdConfirm){
      res.send({
        resultType:1,
        message:'两次输入密码不一致'
      }).end();
    }else{
      var password=common.md5(fromData.NewLoginPwd+common.MD5_SUFFIX);
        db.query(`UPDATE userInfoList SET newLoginPwd='${password}' WHERE id=${fromData.id}`,(err, data)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else{
            common.setLogInMysql(req,'user','checkPas');
            res.send({
              resultType:0,
              message:'修改成功'
            });
          }
      });
    }
  });
  //修改
  router.post('/edit',(req,res)=>{
    var fromData = req.body;
    if(fromData.enabledText==false || fromData.enabledText==undefined){
      fromData.enabledText=0;
    }else{
      fromData.enabledText = 1;
    }
    db.query(`UPDATE userInfoList SET userName='${fromData.userName}',email='${fromData.email}',fullName='${fromData.fullName}' , enabledText='${fromData.enabledText}' , phone='${fromData.phone}' WHERE id=${fromData.id}`,(err, data)=>{
        if(err){
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          common.setLogInMysql(req,'user','edit');
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
    db.query(`DELETE FROM userInfoList WHERE ID=${id}`, (err, data)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{
        common.setLogInMysql(req,'user','del');
        res.send({
          resultType:0,
          message:'删除成功'
        });
      }
    });
  });

  return router;
};
