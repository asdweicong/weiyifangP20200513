const express=require('express');
const common=require('../../../../libs/common');
var db = common.Mysql();

module.exports=function (){
  var router=express.Router();

  //页面渲染接口
  router.get('/index',(req,res)=>{
    res.render('admin/view/Product/customiz/index.ejs',{})
  });
  router.get('/create',(req,res)=>{
    res.render('admin/view/Product/customiz/create.ejs',{})
  });
  router.get('/edit',(req,res)=>{
    var id= req.query.id;
    var selectList = [
      {key:'浴室柜定制',val:'浴室柜定制'},
      {key:'浴室定制',val:'浴室定制'},
      {key:'卫生间定制',val:'卫生间定制'},
     ]; 
     var isNew = [
       {key:'是',val:1},
       {key:'否',val:0},
     ]; 
    db.query(`SELECT * FROM customizList WHERE id=${id}`,(err,data)=>{
      console.log(data);
      res.render('admin/view/Product/customiz/edit.ejs',{mod_data:data[0],selectList:selectList,isNew:isNew})
    })
  });

  //渲染表格列表
  router.get('/customizList',(req,res)=>{
    var sql = common.splicGetData(req);
    db.query(`SELECT * FROM customizList  ${sql.selectAllList}`,(err,dataLimit)=>{
        if(err){
          res.status(500).send('database error').end();
        }else{
          db.query(`SELECT * FROM customizList  ${sql.selectAllList}  ${sql.selectWhere}`,(err,data)=>{
            var tableList={
              "code": 0,
              "msg": "",
              "count": dataLimit.length,
              "data": data
            };
            res.send(tableList).end();
          });    
        }
    });
  });
  
  //新增
  router.post('/create',(req,res)=>{
    var fromData = req.body;
     console.log(fromData)
      db.query(`INSERT INTO customizList (name, coverSrc, productSrc,series,type,color,size,style,material,location,sort,isNew,isSelect,introduct) VALUE('${fromData.name}', '${fromData.coverSrc}', '${fromData.productSrc}', '${fromData.series}', '${fromData.type}', '${fromData.color}', '${fromData.size}', '${fromData.style}', '${fromData.material}', '${fromData.location}', '${fromData.sort}', '${fromData.isNew}', '${fromData.isSelect}', '${fromData.introduct}')`, (err, data)=>{
        if(err){
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          common.setLogInMysql(req,'bathroom','creata');
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
    db.query(`UPDATE customizList SET name='${fromData.name}',coverSrc='${fromData.coverSrc}',productSrc='${fromData.productSrc}',series='${fromData.series}',type='${fromData.type}',color='${fromData.color}',size='${fromData.size}',style='${fromData.style}',material='${fromData.material}',location='${fromData.location}',sort='${fromData.sort}',isNew='${fromData.isNew}',isSelect='${fromData.isSelect}',introduct='${fromData.introduct}'  WHERE id=${fromData.id}`,(err, data)=>{
        if(err){
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          common.setLogInMysql(req,'bathroom','edit');
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
    db.query(`DELETE FROM customizList WHERE id=${id}`, (err, data)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{
        common.setLogInMysql(req,'bathroom','del');
        res.send({
          resultType:0,
          message:'删除成功'
        });
      }
    });
  });
  return router;
};
