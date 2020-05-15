const express=require('express');
const common=require('../../../../libs/common');
var db = common.Mysql();

module.exports=function (){
  var router=express.Router();

  //页面渲染接口
  router.get('/index',(req,res)=>{
    common.setLogInMysql(req,'product','check');
    res.render('admin/view/Index/product/index.ejs',{})
  });
  router.get('/create',(req,res)=>{
    res.render('admin/view/index/product/create.ejs',{})
  });
  router.get('/edit',(req,res)=>{
    var id = req.query.id;
    db.query(`SELECT * FROM productList WHERE id=${id}`,(err,data)=>{
      var select = [
        {key:'pc端',val:'1'},
        {key:'移动端',val:'2'}
      ]; 
       res.render('admin/view/index/product/edit.ejs',{mod_data:data[0],selcetData:select})
    })
  });

  //表格渲染
  router.get('/productList',(req,res)=>{
    var sql = common.splicGetData(req);
     db.query(`SELECT * FROM productList  ${sql.selectAllList}`,(err,dataLimit)=>{
      db.query(`SELECT * FROM productList  ${sql.selectAllList}  ${sql.selectWhere}`,(err,data)=>{
        if(err){
          res.status(500).send('database erro').end();
        }else{
          var fromData =data;
          for(var i=0;i<fromData.length;i++){
            if(fromData[i].type==1){
              fromData[i].type = 'pc端'
            }else if(fromData[i].type==2){
              fromData[i].type = '移动端'
            }
          }
          var tableList={
            "code": 0,
            "msg": "",
            "count": dataLimit.length,
            "data": fromData
          };
          res.send(tableList).end();
        }
      });
     });
  });

//新增
router.post('/create',(req,res)=>{
  var fromData = req.body;
    db.query(`INSERT INTO productList (src, type, sort) VALUE('${fromData.src}', '${fromData.type}', '${fromData.sort}')`, (err, data)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{
        common.setLogInMysql(req,'banner','creata');
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
  db.query(`UPDATE productList SET src='${fromData.src}',type='${fromData.type}',sort='${fromData.sort}'  WHERE id=${fromData.id}`,(err, data)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{
        common.setLogInMysql(req,'product','edit');
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
  db.query(`DELETE FROM productList WHERE id=${id}`, (err, data)=>{
    if(err){
      console.error(err);
      res.status(500).send('database error').end();
    }else{
      common.setLogInMysql(req,'product','del');
      res.send({
        resultType:0,
        message:'删除成功'
      });
    }
  });
});
  return router;
};
