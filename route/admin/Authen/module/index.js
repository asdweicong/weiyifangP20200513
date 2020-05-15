const express=require('express');
const common=require('../../../../libs/common');
var db = common.Mysql();

module.exports=function (){
  var router=express.Router();

  //页面渲染接口
  router.get('/index',(req,res)=>{
    common.setLogInMysql(req,'module','check');
    res.render('admin/view/Authen/module/index.ejs',{})
  });
  router.get('/create',(req,res)=>{
    res.render('admin/view/Authen/module/create.ejs',{})
  });
  router.get('/edit',(req,res)=>{
    var id= req.query.id;
    var select=[
      {key:'父级节点',val:0},
      {key:'权限管理',val:1},
      {key:'首页管理',val:2},
      {key:'产品展示',val:3},
      {key:'联系我们',val:4},
      {key:'日志管理',val:5}
    ];
    db.query(`SELECT * FROM moduleList WHERE id=${id}`,(err,data)=>{
      res.render('admin/view/Authen/module/edit.ejs',{mod_data:data[0],selcetData:select})
    })
  });

  //表格渲染
  router.get('/moduleList',(req,res)=>{
    var sql = common.splicGetData(req);
    db.query(`SELECT * FROM moduleList  ${sql.selectAllList}`,(err,dataLimit)=>{
      db.query(`SELECT * FROM moduleList  ${sql.selectAllList} ${sql.selectWhere}`,(err,data)=>{
        if(err){
          console.error(err);
          res.status(500).send('database error').end();
        }else{
          for(var i=0;i<data.length;i++){
            if(data[i].parentId==''){
              data[i].name=`<i class='layui-icon layui-icon-list'></i>${data[i].name}`
            }else{
              data[i].name=`<i class='layui-icon'>&nbsp;&nbsp;&nbsp;&nbsp;</i>${data[i].name}`
            }
          }
          var tableList={
            "code": 0,
            "msg": "",
            "count": dataLimit.length,
            "data": data
          };
          res.send(tableList).end();
        }
      });
      
    });
 });
 
 //新增
 router.post('/create',(req,res)=>{
  var fromData = req.body;
    if(fromData.Isenabled=='' || fromData.Isenabled==undefined){
      fromData.Isenabled = 0;
    }else{
      fromData.Isenabled = 1;
    }
    if(fromData.IsMenu=='' || fromData.IsMenu==undefined){
      fromData.IsMenu = 0;
    }else{
      fromData.IsMenu = 1;
    }
    if(fromData.parentId==0){
      fromData.parentId='';
      fromData.parentName = '父级节点';
    }else if(fromData.parentId==1){
      fromData.parentName = '权限管理';
    }else if(fromData.parentId==2){
      fromData.parentName = '首页管理';
    }else if(fromData.parentId==3){
      fromData.parentName = '产品展示';
    }else if(fromData.parentId==4){
      fromData.parentName = '联系我们';
    }else if(fromData.parentId==5){
      fromData.parentName = '日志管理';
    }
    console.log(fromData)
    db.query(`INSERT INTO moduleList (name, code, parentId,icon,parentName,linkUrl,orderSort,Isenabled,IsMenu) VALUE('${fromData.name}', '${fromData.code}', '${fromData.parentId}', '${fromData.icon}', '${fromData.parentName}', '${fromData.linkUrl}', '${fromData.orderSort}', '${fromData.Isenabled}', '${fromData.IsMenu}')`, (err, data)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{
        common.setLogInMysql(req,'module','creata');
        res.send({
          resultType:0,
          message:'添加成功'
        }).end();
      }
    }) ;
 });
//修改
 router.post('/edit',(req,res)=>{
  var fromData = req.body;
  if(fromData.Isenabled=='' || fromData.Isenabled==undefined){
    fromData.Isenabled = 0;
  }else{
    fromData.Isenabled = 1;
  }
  if(fromData.IsMenu=='' || fromData.IsMenu==undefined){
    fromData.IsMenu = 0;
  }else{
    fromData.IsMenu = 1;
  }
  if(fromData.parentId==0){
    fromData.parentId='';
    fromData.parentName = '父级节点';
  }else if(fromData.parentId==1){
    fromData.parentName = '权限管理';
  }else if(fromData.parentId==2){
    fromData.parentName = '首页管理';
  }else if(fromData.parentId==3){
    fromData.parentName = '产品展示';
  }else if(fromData.parentId==4){
    fromData.parentName = '联系我们';
  }else if(fromData.parentId==5){
    fromData.parentName = '日志管理';
  }
  console.log(fromData)
  db.query(`UPDATE moduleList SET name='${fromData.name}',code='${fromData.code}',parentId='${fromData.parentId}' , icon='${fromData.icon}' , parentName='${fromData.parentName}' , linkUrl='${fromData.linkUrl}' , orderSort='${fromData.orderSort}' , Isenabled='${fromData.Isenabled}' , IsMenu='${fromData.IsMenu}'  WHERE id=${fromData.id}`,(err, data)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{
        common.setLogInMysql(req,'module','edit');
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
    db.query(`DELETE FROM moduleList WHERE ID=${id}`, (err, data)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{
        common.setLogInMysql(req,'module','del');
        res.send({
          resultType:0,
          message:'删除成功'
        });
      }
    });
  });
  return router;
};
