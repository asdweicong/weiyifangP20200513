/*******清除表单数据*********/
function ClearForm() {
    $('input').val('');
    $('select').val('');
    window.location.reload();
}

//触发事件
function setfromModom(title,id,url,callback){
    var that = this;
    var areas = [];
    layer.open({
        type: 2, //此处以iframe举例
        title: title,
        area: ['600px', '450px'],
        shade: 0.5,
        maxmin: true,
        resize: false,
        id:id,
        offset: [ //为了演示，随机坐标
                //Math.random() * ($(window).height() - 300)
                //, Math.random() * ($(window).width() - 390)
        ],
        content: url,
        btn: ['保存', '关闭'], //只是为了演示
        yes: function (index,layero) {
            callback(index,layero)
            //var body = layer.getChildFrame('body', index).contents().serialize(); //巧妙的地方在这里哦
            //update(body, table, _cur_page, index);
        },
        btn2: function () {
            layer.closeAll();
        },
        zIndex: layer.zIndex, //重点1
        success: function (layero, index) {
          
            //layer.iframeAuto(index);
            layer.setTop(layero); //重点2
        }
    });
}

//查看详情
function checkDetalis(title,id,url){
    var that = this;
    var areas = [];
    layer.open({
        type: 2, //此处以iframe举例
        title: title,
        area: ['600px', '450px'],
        shade: 0.5,
        maxmin: true,
        resize: false,
        id:id,
        offset: [ //为了演示，随机坐标
                //Math.random() * ($(window).height() - 300)
                //, Math.random() * ($(window).width() - 390)
        ],
        content: url,
        btn: ['关闭'], //只是为了演示
        btn2: function () {
            layer.closeAll();
        },
        zIndex: layer.zIndex, //重点1
    });
}


/*******保存表单，局部表格刷新*********/
function SaveModal(index, layero, url, tableIns) {
    var iframeWindow = window['layui-layer-iframe' + index], submitID = 'LAY-user-front-submit'
        , submit = layero.find('iframe').contents().find('#' + submitID);
    iframeWindow.layui.form.on('submit(' + submitID + ')', function (data) {
        var field = data.field; //获取提交的字段
        console.log(field)
        $.ajax({
            type: "POST",
            url: url,
            data: field,
            success: function (data) {
                layer.msg(data.message);
                if (data.resultType == 0) {
                    layer.close(index); //关闭弹层
                    ReloadDataTable(tableIns);
                }
            }
        });
        //window.location.reload();
    });
    submit.trigger('click');
}

/*******表格数据修改弹窗*********/
function SaveTableModalShow(obj, layer, tableIns, callback) {
    layer.open({
        type: 1,
        resize: false,
        title: '温馨提示',
        closeBtn: false,
        area: '335px;',
        shade: 0.4,
        id: 'LAY_TipShow',
        btn: ['确定', '取消'],
        moveType: 1,
        content: '<div style="padding: 20px 0; line-height: 22px;text-align: center;">' +
            '是否修改当前数据为<span style="color:red;font-weight: 700;">' + obj.value + '</span>' + '?' + '</div>',
        yes: function (layer) {
            callback();
        },
        btn2: function () {
            //window.location.reload();
            ReloadDataTable(tableIns);
            layer.closeAll();
        }
    });
}

/*******表格数据开关修改弹窗*********/
function SaveSwitchModalShow(id, checked, layer, tableIns, callback) {
    var CheckedName;
    if (checked) {
        CheckedName = "开启";
    } else {
        CheckedName = "关闭";
    }
    layer.open({
        type: 1,
        resize: false,
        title: '温馨提示',
        closeBtn: false,
        area: '335px;',
        shade: 0.4,
        id: 'LAY_TipShow',
        btn: ['确定', '取消'],
        moveType: 1,
        content: '<div style="padding: 20px 0; line-height: 22px;text-align: center;">是否<span style="color:red;font-weight: 700;">' + CheckedName+'</span>' + '?' + '</div>',
        yes: function (layer) {
            callback();
        },
        btn2: function () {
            // window.location.reload();
            ReloadDataTable(tableIns)
            layer.closeAll();
        }
    });
}

/*******刷新表格*********/
function ReloadDataTable(tableIns) {
    try {
        tableIns.reload();  
    } catch (e) {
        console.log("未实例化");
    }
}

/*******表格数据修改保存*********/
function SaveTableModal(data, url, tableIns, layero) {
    if (data.Enabled === '是') {
        data.Enabled = true;
    } else if (data.Enabled === '否') {
        data.Enabled = false;
    }
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function (data) {
            if (data.resultType == 0) {
                ReloadDataTable(tableIns);
            } else {
                layer.msg(data.message);
                return false;
            }
        }
    });
    layer.closeAll();
}

/*******批量修改提交*********/
function saveSwitch(data, url, tableIns) {
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function (data) {
            ReloadDataTable(tableIns);
            layer.msg('修改成功', {
                time: 2000, //2s后自动关闭
            });
        }
    });
}


/*******删除操作*********/
function DeleteRecord(url, Id, tableIns) {
    $.ajax({
        type: "POST",
        url: url,
        data: {"id":Id},
        success: function (data) {
            layer.msg(data.message);
            if (data.resultType ==0) { 
                ReloadDataTable(tableIns); 
            }
        }
    });
}

/*******弹窗checkbox value值修改*********/
function Init() {
    layui.use(['form'], function () {
        var $ = layui.$
        , form = layui.form;
        form.on('switch', function (data) {
            if (data.value == 'true')
                $(data.elem).val(false);
            else
                $(data.elem).val(true);
        });
    })
}


/*******获取搜索表单数据*********/
function getFormData(id) {
    var formData = {};
    var formArray = $("#" + id).serializeArray();
    $.each(formArray, function () {
        if (formData[this.name] !== undefined) {
            if (!formData[this.name].push) {
                formData[this.name] = [formData[this.name]];
            }
            formData[this.name].push(this.value || '');
        } else {
            formData[this.name] = this.value || '';
        }
    });
    return formData;
}

/*******保存表单，全局刷新*********/
function SaveModalReload(index, layero, url) {
    var iframeWindow = window['layui-layer-iframe' + index], submitID = 'LAY-user-front-submit'
        , submit = layero.find('iframe').contents().find('#' + submitID);
    iframeWindow.layui.form.on('submit(' + submitID + ')', function (data) {
        var field = data.field; //获取提交的字段
        $.ajax({
            type: "POST",
            url: url,
            data: field,
            success: function (data) {
                layer.msg(data.message);
            }
        });
        window.location.reload();
        layer.close(index); //关闭弹层
    });
    submit.trigger('click');
}

/*******下拉框填充*********/

function getDataList(url, id,form) {
    $.ajax({
        type: 'post',
        url: url,
        success: function (data) {
            $('#' + id).empty();
            $('#' + id).append(new Option("全部", ""));
            $.each(data, function (index, item) {
                $('#' + id).append(new Option(item.text, item.value));// 下拉菜单里添加元素
            });
            form.render('select');// 再次渲染select
            //var t="";
            //$('#' + id).empty();
            //for (var j = 0; j < data.length; j++) {
            //    t += '<option value="' + data[j].value + '" selected="' + data[j].selected + '">' + data[j].text + '</option>'
            //}
            //$('#' + id).append(t);
            //form.render('select');
            //var select = 'dd[lay-value="0"]';// 设置value
            //$('#' + id).siblings("div.layui-form-select").find('dl').find(select).click();// 查找点击
           
        }
    })
}

/*******查询api接口*********/
function setData(index, layero, url, tableIns, callback) {
    var iframeWindow = window['layui-layer-iframe' + index],
        submitID = 'LAY-user-front-submit'
        , submit = layero.find('iframe').contents().find('#' + submitID);
    iframeWindow.layui.form.on('submit(' + submitID + ')', function (data) {
        var field = data.field; //获取提交的字段
        $.ajax({
            type: "POST",
            url: url,
            data: field,
            success: function (data) {
                ReloadDataTable(tableIns);
                callback(data);
            }
        });
        layer.close(index); //关闭弹层
    });
    submit.trigger('click');
}


/*********触发事件,自定义长度，宽度*********/
function setfromModom1(title, id, width,height,url,callback) {
    var that = this;
    var areas = [];
    layer.open({
        type: 2, //此处以iframe举例
        title: title,
        area: [width + 'px', height+'px'],
        shade: 0.5,
        maxmin: true,
        resize: false,
        id: id,
        offset: [ //为了演示，随机坐标
            //Math.random() * ($(window).height() - 300)
            //, Math.random() * ($(window).width() - 390)
        ],
        content: url,
        btn: ['保存', '关闭'], //只是为了演示
        yes: function (index, layero) {
            callback(index, layero)
            //var body = layer.getChildFrame('body', index).contents().serialize(); //巧妙的地方在这里哦
            //update(body, table, _cur_page, index);
        },
        btn2: function () {
            layer.closeAll();
        },
        zIndex: layer.zIndex, //重点1
        success: function (layero, index) {

            //layer.iframeAuto(index);
            layer.setTop(layero); //重点2
        }
    });
}

/*******判断平台设置表格高度*********/
function setHeight(val) {
    if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { //移动端
        return 'full'
    } else {//pc端
        return val
    }
}
/**********获取URL参数*************/
function getUrlParameter(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}


/*******配置便捷时间*********/
function getDataTime() {
    var currentDate = new Date();
    //一天的毫秒数
    var millisecond = 1000 * 60 * 60 * 24;
    //获得当前年份4位年
    var currentYear = currentDate.getFullYear();
    //获取今天星期几
    var week = currentDate.getDay();
    //昨天的时间
    var day1 = new Date();
    day1.setTime(day1.getTime() - millisecond);
    var s1 = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate() + "  00:00:00";
    //今天的时间
    var day2 = new Date();
    var s2 = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate() + "  00:00:00";
    //明天的时间
    var day3 = new Date();
    day3.setTime(day3.getTime() + millisecond);
    var s3 = day3.getFullYear() + "-" + (day3.getMonth() + 1) + "-" + day3.getDate() + "  00:00:00";
    var lastMonday = new Date(currentDate.getTime() - ((week + 6) * millisecond));
    var lastMondayTime = lastMonday.getFullYear() + "-" + (lastMonday.getMonth() + 1) + "-" + lastMonday.getDate() + "  00:00:00";
    var lastSunday = new Date(currentDate.getTime() - (week * millisecond));
    var lastSundayTime = lastSunday.getFullYear() + "-" + (lastSunday.getMonth() + 1) + "-" + (lastSunday.getDate() + 1) + "  00:00:00";
    var minusDay = week != 0 ? week - 1 : 6;
    var monday = new Date(currentDate.getTime() - (minusDay * millisecond));
    var mondayTime = monday.getFullYear() + "-" + (monday.getMonth() + 1) + "-" + monday.getDate() + "  00:00:00";
    var sunday = new Date(monday.getTime() + (6 * millisecond));
    var sundayTime = sunday.getFullYear() + "-" + (sunday.getMonth() + 1) + "-" + (sunday.getDate() + 1) + "  00:00:00";
    var currentMonth = currentDate.getMonth() - 1;
    var firstDay = new Date(currentYear, currentMonth, 1);
    var lastMonthFirstDay = firstDay.getFullYear() + "-" + (firstDay.getMonth() + 1) + "-" + firstDay.getDate() + "  00:00:00";
    //当为12月的时候年份需要加1
    //月份需要更新为0 也就是下一年的第一个月
    if (currentMonth == 11) {
        currentYear++;
        currentMonth = 0; //就为
    } else {
        //否则只是月份增加,以便求的下一月的第一天
        currentMonth++;
    }
    var nextMonthDayOne = new Date(currentYear, currentMonth, 1);
    var lastDay = new Date(nextMonthDayOne.getTime() - millisecond);
    var lastMonthLastDay = lastDay.getFullYear() + "-" + (lastDay.getMonth() + 2) + "-" + 1 + "  00:00:00";
    var currentMonth = currentDate.getMonth();
    var firstDay = new Date(currentYear, currentMonth);
    var firstDayTime = firstDay.getFullYear() + "-" + (firstDay.getMonth() + 1) + "-" + firstDay.getDate() + "  00:00:00";
    var lastEndDayTime = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + (day2.getDate() + 1) + "  00:00:00";
    var dateTime = {
        currentDate: currentDate,
        millisecond: millisecond,
        currentYear: currentYear,
        week: week,
        day1: day1,
        s1: s1,
        day2: day2,
        s2: s2,
        day3: day3,
        s3: s3,
        lastMonday: lastMonday,
        lastMondayTime: lastMondayTime,
        lastSunday: lastSunday,
        lastSundayTime: lastSundayTime,
        minusDay: minusDay,
        monday: monday,
        mondayTime: mondayTime,
        sunday: sunday,
        sundayTime: sundayTime,
        currentMonth: currentMonth,
        firstDay: firstDay,
        lastMonthFirstDay: lastMonthFirstDay,
        nextMonthDayOne: nextMonthDayOne,
        lastDay: lastDay,
        lastMonthLastDay: lastMonthLastDay,
        currentMonth: currentMonth,
        firstDay: firstDay,
        firstDayTime: firstDayTime,
        lastEndDayTime: lastEndDayTime,

    };
    return dateTime;
}



