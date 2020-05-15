const express=require('express');
const common=require('../../../libs/common');
var db = common.Mysql();

module.exports=function (){
  var router=express.Router();
  //页面渲染接口
  router.get('/', (req, res,next)=>{
    var childList =function(){
        return{
        name:'',
        linkUrl:''
    }
    };
    //处理菜单
    db.query(`SELECT * FROM moduleList`,(err,data)=>{
        var dataList = data;
        var menuList = [];
        for(var i=0;i<dataList.length;i++){
            var modules ={
                parentName:'',
                childList:[],  
            };
            if(dataList[i].parentId==''){
                modules.parentName = dataList[i].name;
                menuList.push(modules);
            }
        }
        for(let t=0;t<menuList.length;t++){
            for(let j=0;j<dataList.length;j++){
            var childLists = new childList();
                (function(j){
                    if(menuList[t].parentName==dataList[j].parentName){
                        if(dataList[j].Isenabled!==0){
                            childLists.name=dataList[j].name;
                            childLists.linkUrl=dataList[j].linkUrl;
                            menuList[t].childList.push(childLists);
                        }
                    }
                })(j);
            }
        }
        req.menuList=menuList;
        next();
      });
    }) ;
    router.get('/',(req,res,next)=>{
        var sessionId = req.session['admin_id'];//获取用户id
        var db =common.Mysql();
        db.query(`SELECT userName FROM userInfoList WHERE id=${sessionId}`,(err,data)=>{
            req.loginName = data[0];
            next();
        });
    });
    router.get('/',(req,res)=>{
        var menuList = req.menuList;
        var loginName = req.loginName;
        res.render('admin/index.ejs',{mod_data:menuList,loginName:loginName});
    });
   
 

  return router;
};
