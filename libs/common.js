/**
 *Created by 莫乃杰 on 2020/05/11
 **/
const express = require('express'); 
const crypto=require('crypto');
const mysql = require('mysql');
var router=express.Router();
module.exports={
  MD5_SUFFIX: 'FDSW$t34tregt5tO&$(#RHuyoyiUYE*&OI$HRLuy87odlfh是个风格热腾腾)',
  TIME_STAMP:new Date().getTime(),

  md5: function (str){
    var obj=crypto.createHash('md5');
    obj.update(str);
    return obj.digest('hex');
  },
  Mysql:function(){
    var db= mysql.createPool({
      host:'101.200.85.12',
      user:'monaijie',
      password:'mnj19950421',
      database:'weiyifang',
    });
    return db;
  },
  splicGetData:function(req){
    var page = req.query.page;
    var limit = req.query.limit;
    var formData = req.query;
    var str = '';
    var sql = {
      selectAllList:'',//查询总条数
      selectWhere:''//查询条件
    };
    for (var key in formData) {
        if (formData[key] !== '' && key!=='page' && key!=='limit') {
            str += key + '=' + `"${formData[key]}"` + ' and ';
        }
    }
    str = str.substring(0, str.length - 4);
    if(str!==''){
     sql.selectAllList = `WHERE ${str}`;
    }
    sql.selectWhere = `LIMIT ${(page-1)*10},${limit}`;

    return sql;
  },
  getMessageLimit:function(req){
    var page = req.query.page;
    var limit = req.query.limit;
    var formData = req.query;
    var startTime = formData.startTime;
    var endTime = formData.endTime;
    var sql = {
      selectAllList:'',//查询总条数
      selectWhere:''//查询条件
    };
   if(startTime!==undefined && endTime!==undefined){
     startTime = new Date(startTime).getTime();
     endTime = new Date(endTime).getTime();
    if(startTime!=='' && endTime!==''){
     sql.selectAllList = `WHERE  time>${startTime} and time<${endTime}`;
    }else if(startTime=='' && endTime!==''){
     sql.selectAllList = `WHERE  time<${endTime}`;
    }else if(startTime!=='' && endTime==''){
      sql.selectAllList = `WHERE  time>${endTime}`;
    }else if(startTime=='' && endTime==''){
      sql.selectAllList = '';
    }
   }
    sql.selectWhere = `LIMIT ${(page-1)*10},${limit}`;
    return sql;
  },
  getStampDate:function(res){
    var time='';
    var stampDate = new Date(parseInt(res));
    var year =stampDate.getFullYear();
    var month =stampDate.getMonth()+1;
    var date =stampDate.getDate();
    var hours =stampDate.getHours();
    var minutes =stampDate.getMinutes();
    var milliseconds = stampDate.getSeconds();
    if(month<10){
      month = '0'+month;
    }
    time = year+'-'+month+'-'+date+' ' +  hours+':'+minutes+':'+milliseconds;
    return time;
  },
  getIPAdress :function (){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
  },
  setUserLoginLog:function(data){
    var db =this.Mysql();
     db.query(`INSERT INTO userLoginLogList (userId, loginName, fullName,loginTime,loginIP) VALUE( '${data.id}', '${data.userName}', '${data.fullName}', '${this.TIME_STAMP}', '${this.getIPAdress()}')`, (err, data)=>{
        if(err){
          console.error(err);
        }
      }) ;
  },
  setOperationLog:function(VAl){
    var db =this.Mysql();
    var formData = VAl;
    db.query(`SELECT userName,fullName FROM userInfoList WHERE id=${formData.id}`,(err,data)=>{
        db.query(`INSERT INTO operateLogList (loginName, fullName, module,operate,logTime) VALUE( '${data[0].userName}', '${data[0].fullName}', '${formData.module}', '${formData.operate}', '${this.TIME_STAMP}')`, (err, data)=>{
        if(err){
          console.error(err);
        }
      }) ;
    });
  },
  operation:function(){
    var operation = {
      Home:{
        check:{
          id:'',
          module:'主页',
          operate:'查看',
        },
      },
      user:{
        check:{
          id:'',
          module:'管理员管理',
          operate:'查看',
        },
        edit:{
          id:'',
          module:'管理员管理',
          operate:'编辑',
        },
        creata:{
          id:'',
          module:'管理员管理',
          operate:'新增',
        },
        del:{
          id:'',
          module:'管理员管理',
          operate:'删除',
        },
        checkPas:{
          id:'',
          module:'管理员管理',
          operate:'修改密码',
        },
      },
      module:{
        check:{
          id:'',
          module:'模块管理',
          operate:'查看',
        },
        edit:{
          id:'',
          module:'模块管理',
          operate:'编辑',
        },
        creata:{
          id:'',
          module:'模块管理',
          operate:'新建',
        },
        del:{
          id:'',
          module:'模块管理',
          operate:'删除',
        },
      },
      banner:{
        check:{
          id:'',
          module:'banner管理',
          operate:'查看',
        },
        edit:{
          id:'',
          module:'banner管理',
          operate:'编辑',
        },
        creata:{
          id:'',
          module:'banner管理',
          operate:'新建',
        },
        del:{
          id:'',
          module:'banner管理',
          operate:'删除',
        },
      },
      product:{
        check:{
          id:'',
          module:'产品展示',
          operate:'查看',
        },
        edit:{
          id:'',
          module:'产品展示',
          operate:'编辑',
        },
        creata:{
          id:'',
          module:'产品展示',
          operate:'新增',
        },
        del:{
          id:'',
          module:'产品展示',
          operate:'删除',
        },
      },
      bathroom:{
        check:{
          id:'',
          module:'浴室系列',
          operate:'查看',
        },
        edit:{
          id:'',
          module:'浴室系列',
          operate:'编辑',
        },
        creata:{
          id:'',
          module:'浴室系列',
          operate:'新增',
        },
        del:{
          id:'',
          module:'浴室系列',
          operate:'删除',
        },
      },
      customiz:{
        check:{
          id:'',
          module:'定制系列',
          operate:'查看',
        },
        edit:{
          id:'',
          module:'定制系列',
          operate:'编辑',
        },
        creata:{
          id:'',
          module:'定制系列',
          operate:'新增',
        },
        del:{
          id:'',
          module:'定制系列',
          operate:'删除',
        },
      },
      hardware:{
        check:{
          id:'',
          module:'五金系列',
          operate:'查看',
        },
        edit:{
          id:'',
          module:'五金系列',
          operate:'修改',
        },
        creata:{
          id:'',
          module:'五金系列',
          operate:'新增',
        },
        del:{
          id:'',
          module:'五金系列',
          operate:'删除',
        },
      },
      intellect:{
        check:{
          id:'',
          module:'智能系列',
          operate:'查看',
        },
        edit:{
          id:'',
          module:'智能系列',
          operate:'编辑',
        },
        creata:{
          id:'',
          module:'智能系列',
          operate:'新增',
        },
        del:{
          id:'',
          module:'智能系列',
          operate:'删除',
        },
      },
      other:{
        check:{
          id:'',
          module:'其他',
          operate:'查看',
        },
        edit:{
          id:'',
          module:'其他',
          operate:'编辑',
        },
        creata:{
          id:'',
          module:'其他',
          operate:'新增',
        },
        del:{
          id:'',
          module:'其他',
          operate:'删除',
        },
      },
      telephone:{
        check:{
          id:'',
          module:'联系方式',
          operate:'查看',
        },
        edit:{
          id:'',
          module:'联系方式',
          operate:'编辑',
        },
        creata:{
          id:'',
          module:'联系方式',
          operate:'新增',
        },
        del:{
          id:'',
          module:'联系方式',
          operate:'删除',
        },
      }, 
      message:{
        check:{
          id:'',
          module:'留言列表',
          operate:'查看',
        },
      },
      userLoginLog:{
        check:{
          id:'',
          module:'登录日志',
          operate:'查看',
        }
      },
      operateLog:{
        check:{
          id:'',
          module:'操作日志',
          operate:'查看',
        }
      },
      userinfo:{
        check:{
          id:'',
          module:'个人中心',
          operate:'查看',
        },
        edit:{
          id:'',
          module:'个人中心',
          operate:'编辑',
        },
      }

      };
    return operation;  
  },
  setLogInMysql:function(req,title,key){//添加操作记录到数据库
    var sessionId = req.session['admin_id'];//获取用户id
    var operation = this.operation();
    operation[title][key]['id'] = sessionId;
    this.setOperationLog(operation[title][key]);
  }
};
