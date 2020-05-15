//资源模块引入
const express = require('express');
const static = require('express-static');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate =require('consolidate');
const expressRoute = require('express-route');
const fs = require('fs');

//服务器开启
var server = express();
server.listen(8080);

//设置请求数据参数
server.use(bodyParser.urlencoded());


//文件上传配置
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/upload')
  },
  filename: function (req, file, cb) {
    var str = file.originalname.split('.');
    cb(null, Date.now()+'.'+str[1]);
  }
});
const multerObj = multer({storage:storage});
server.use(multerObj.any());
server.post("/upload",function(req,res){
  var src = '/upload/'+req.files[0].filename;
  res.json({
    code:200,
    msg:'上传成功',
    src:src
  })
});

//删除已上传上图片文件
server.use('/deleteImg',(req,res)=>{
  var name = req.body.name;
  console.log(name);
  fs.unlink('static'+ name, (err)=>{
    if(err){
      console.error(err);
      res.status(500).send('file opration error').end();
    }else{
      res.json({
        code:200,
        message:'删除成功',
      })
    } 
  });
})

//处理cookie 、session            
server.use(cookieParser());
(function(){
   var keys = [];
   for(var i=0;i<10000;i++){
     keys[i]='session_'+Math.random();
   }
   server.use(cookieSession({
     name:"session_id",
     keys:keys,
     maxAge:20*60*1000 //20分钟session过期,需重新登录
   }));
})();

//处理ejs模板
server.engine('html', consolidate.ejs);
server.set('views', 'template');
server.set('view engine', 'html');

//处理路由
server.use('/web',require('./route/web')());
server.use('/admin',require('./route/admin')());

//请求静态文件
server.use(static('./static/'));




