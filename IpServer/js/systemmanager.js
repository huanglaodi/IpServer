

$(".right1-fl").find("a").click(function(){
    $(this).css({"background":"#ff8a3c"});
    $(this).siblings().css({"background":"#fff"});
    var text = $(this).text();
    if(text=="时间"){
        $(".right2-time").show();
        $(".right2-time").siblings().hide();
    }else if(text=="识别设置"){
        $(".right2-shibie").show();
        $(".right2-shibie").siblings().hide();
    }else if(text=="声音及显示"){
        $(".right2-sound").show();
        $(".right2-sound").siblings().hide();
    }else if(text=="网络参数"){
        $(".right2-webpro").show();
        $(".right2-webpro").siblings().hide();
    }else if(text=="数据管理"){
        $(".right2-datamag").show();
        $(".right2-datamag").siblings().hide();
    }else if(text=="数据管理"){
        $(".right2-datamag").show();
        $(".right2-datamag").siblings().hide();
    }
    else if(text=="设备信息"){
        $(".right2-devinfo").show();
        $(".right2-devinfo").siblings().hide();
    }else if(text=="设备维护"){
        $(".right2-devres").show();
        $(".right2-devres").siblings().hide();
        $('.progress > div').css('width', 0);
        $(".progress").hide();
    }else if(text=="设备参数"){
        $(".right2-devpro").show();
        $(".right2-devpro").siblings().hide();
    }

})

$(".right2-datamag").find("input").click(function(){
    var text = $(this).val();
    $(".jinggao").show();
    $(".intitl").val(text);

})

//弹出框确认
$(".queren").click(function(){
    var cmdtext = $(".intitl").val();
    var cmd="";
    var data="";
    if(cmdtext=="删除全部管理员权限"){
        cmd = "ClearManager";
    }else if(cmdtext=="删除全部用户"){
        cmd = "DeleteUserInfo";
        data = {"usersCount":0};
    }else if(cmdtext=="删除全部记录"){
        cmd = "ClearLogData";
    }else if(cmdtext=="恢复出厂设置"){
       cmd = "ResetDevice";
       $(".jinggao").hide();
    }
    dldata(cmd,data);
})

//弹框取消
$(".cancel").click(function(){
    $(".jinggao").hide();
})


//页面加载
window.onload=function (){
    settime();
    /*setrevtime();
    setsleep();
    setscran();*/
}

//重复确认时间下拉框填充
/*function setrevtime(){
    html = "<option value='0'>0</option>";
    for(var i=1;i<61;i++){
       html = html
       +"<option value="+i+">"+i+"分钟</option>" ;
    }
    $(".revtime").html(html);
}*/

//屏保时间下拉填充
/*function setscran(){
    html = "<option value='0'>关闭屏保</option>";
    for(var i=1;i<61;i++){
        html = html
            +"<option value="+i+">"+i+"秒</option>" ;
    }
    $(".devscran").html(html);
}*/

//睡眠时间下拉框填充
/*function setsleep(){
    html = "<option value='0'>关闭睡眠</option>";
    for(var i=1;i<61;i++){
        html = html
            +"<option value="+i+">"+i+"分钟</option>" ;
    }
    $(".devsleep").html(html);
}*/

//手动设置时间
$(".baocuntime").click(function(){
    var settime = $(".uptime").val();
    settime = new Date(settime);
    ajax_settime(settime);
})

//手动设置开门方式
$(".shibiebut").click(function(){
    var verfymode = $(".vermode").val();
    var revtime = $(".revtime").val();
   var data = {"reverifyTime":revtime,"verifyMode":verfymode};
   ajax_setdevsetting(data);
})

//手动设置声音及显示
$(".soundbut").click(function(){
    var vol = $(".devvol").val();
    var scrantime = $(".devscran").val();
    var sleeptime = $(".devsleep").val();
    var data = {"volume":vol,"screensaversTime":scrantime,"sleepTime":sleeptime};
    ajax_setdevsetting(data);
})

//手动设置网络参数
$(".webprobut").click(function(){
    var dname = $(".dname").val();
    var serverip = $(".serverip").val();
    var serverport = $(".serverport").val();
    var tsip = $(".tsip").val();
    var tsport = $(".tsport").val();
    var ispush = $(".ispush").val();
    var data = {"devName":dname,"serverHost":serverip,"serverPort":serverport,"pushServerHost":tsip,"pushServerPort":tsport,"pushEnable":ispush};
    ajax_setdevsetting(data);
})

//重启设备
$(".restart").click(function(){
   ajax_restart();
})

//手动设置设备参数
$(".prosave").click(function(){
   var dname = $(".dnamed").val();
    var wgen = $(".wgen").val();
    var interval = $(".interval").val();
    var language = $(".language").val();

    var data = {"devName":dname,"wiegandType":wgen,"interval":interval,"language":language};
    ajax_setdevsetting(data);
})

function settime(){
    var date = new Date();
    date = gettime2(date);
    $(".uptime").val(date);

    var syncTime = new Date( $(".uptime").val());
    ajax_settime(syncTime);

}

//ajax给机器下达设置时间指令
function ajax_settime(time){
    syncTime = gettime(time);
    var mCmd="SetTime";
    var data={"syncTime":syncTime};
    var mjson = JSON.stringify({"cmd":mCmd,"data":data});
    $.ajax({
        type: "post",
        url : "/bin/cmd",
        data: mjson,
        contentType : "application/json",
        success: function(msg, textStatus, jqXHR) {
            var jsonstr =  JSON.parse(msg);
            var returncode = jsonstr["result_code"];
            //执行成功
            if(returncode==0){
                var time=  $(".uptime").val();
                time = new Date(time);
                time = gettime2(time);
                $(".devtime").val(time);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("upload fail");

        }
    });

}


//ajax给机器下达获取设备参数指令
function ajax_getdevsetting(){
    var mCmd="GetDeviceSetting";
    var mjson = JSON.stringify({"cmd":mCmd});
    $.ajax({
        type: "post",
        url : "/bin/cmd",
        data: mjson,
        contentType : "application/json",
        //  cache: false,
        success: function(msg, textStatus, jqXHR) {
            var jsonstr =  JSON.parse(msg);
            var returncode = jsonstr["result_code"];
            //执行成功
            if(returncode==0){
                var resultdata = jsonstr["result_data"];

                $(".vermode").val(resultdata["verifyMode"]);
                $(".revtime").val(resultdata["reverifyTime"]);

                $(".devvol").val(resultdata["volume"]);
                $(".devscran").val(resultdata["screensaversTime"]);
                $(".devsleep").val(resultdata["sleepTime"]);

                $(".dname").val(resultdata["devName"]);
                $(".serverip").val(resultdata["serverHost"]);
                $(".serverport").val(resultdata["serverPort"]);
                $(".tsip").val(resultdata["pushServerHost"]);
                $(".tsport").val(resultdata["pushServerPort"]);
                $(".ispush").val(resultdata["pushEnable"]);

                $(".dnamed").val(resultdata["devName"]);
                $(".interval").val(resultdata["interval"]);
                $(".language").val(resultdata["language"]);
                $(".wgen").val(resultdata["wiegandType"]);
                //存储缓存
                window.sessionStorage.setItem('devset', JSON.stringify(resultdata));
               //修改机器状态
                window.sessionStorage.setItem('update', "no");
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("upload fail");
            // document.getElementById("myControl").disabled = false;
        }
    });

}

//ajax给机器下达设置设备参数指令
function ajax_setdevsetting(data){
    var mCmd="SetDeviceSetting";
    var mjson = JSON.stringify({"cmd":mCmd,"data":data});
    $.ajax({
        type: "post",
        url : "/bin/cmd",
        data: mjson,
        contentType : "application/json",
        //  cache: false,
        success: function(msg, textStatus, jqXHR) {
            var jsonstr =  JSON.parse(msg);
            var returncode = jsonstr["result_code"];
            //执行成功
            if(returncode==0){
                //设置成功
               alert("设置成功");
               //修改机器状态
                window.sessionStorage.setItem('update', "yes");
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("upload fail");
            // document.getElementById("myControl").disabled = false;
        }
    });
}

//删除人员，记录，管理员，恢复出厂
function dldata(mCmd,data){
    var mjson ="";
    if(data==null || data=="") {
        mjson = JSON.stringify({"cmd": mCmd});
    }else {
        mjson = JSON.stringify({"cmd": mCmd,"data":data});
    }
        $.ajax({
            type: "post",
            url : "/bin/cmd",
            data: mjson,
            contentType : "application/json",
            //  cache: false,
            success: function(msg, textStatus, jqXHR) {
                var jsonstr = JSON.parse(msg);
                var returncode = jsonstr["result_code"];
                //执行成功
                if (returncode == 0) {
                    alert("执行成功");
                    $(".jinggao").hide();
                    //修改机器状态
                    window.sessionStorage.setItem('update', "yes");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("upload fail");
                // document.getElementById("myControl").disabled = false;
            }
        });

}

//ajax给机器下发获取设备信息指令
function ajax_getdevinfo(){
    var mCmd="GetDeviceInfo";
    var mjson = JSON.stringify({"cmd":mCmd});
    $.ajax({
        type: "post",
        url : "/bin/cmd",
        data: mjson,
        contentType : "application/json",
        //  cache: false,
        success: function(msg, textStatus, jqXHR) {
            var jsonstr =  JSON.parse(msg);
            var returncode = jsonstr["result_code"];
            //执行成功
            if(returncode==0){
                var resultdata = jsonstr["result_data"];

               $(".dvname").val(resultdata["name"]);
               $(".dvId").val(resultdata["deviceId"]);
               $(".fpver").val(resultdata["fpVer"]);
               $(".facever").val(resultdata["faceVer"]);
               $(".pvver").val(resultdata["pvVer"]);
               $(".maxlen").val(resultdata["maxBufferLen"]);
               $(".userlimit").val(resultdata["userLimit"]);
               $(".fplimit").val(resultdata["fpLimit"]);
               $(".facelimit").val(resultdata["faceLimit"]);
               $(".pwdlimit").val(resultdata["pwdLimit"]);
               $(".cardlimit").val(resultdata["cardLimit"]);
               $(".loglimit").val(resultdata["logLimit"]);
               $(".usercount").val(resultdata["userCount"]);
               $(".managercount").val(resultdata["managerCount"]);
               $(".fpcount").val(resultdata["fpCount"]);
               $(".facecount").val(resultdata["faceCount"]);
               $(".pwdcount").val(resultdata["pwdCount"]);
               $(".cardcount").val(resultdata["cardCount"]);
               $(".logcount").val(resultdata["logCount"]);
               $(".alllogcount").val(resultdata["allLogCount"]);
               $(".firmware").val(resultdata["firmware"]);

               //保存本地缓存；
                window.sessionStorage.setItem('devinfo', JSON.stringify(resultdata));
                //修改机器状态
                window.sessionStorage.setItem('update', "no");

            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("upload fail");
            // document.getElementById("myControl").disabled = false;
        }
    });

}

//ajax给机器下达重启指令
function ajax_restart(){
    var mCmd="Restart";
    var mjson = JSON.stringify({"cmd":mCmd});
    $.ajax({
        type: "post",
        url : "/bin/cmd",
        data: mjson,
        contentType : "application/json",
        success: function(msg, textStatus, jqXHR) {

        },
    });

}



//获取时间字符串
function gettime(time) {
    var lyear = time.getFullYear();
    var lmonth = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0"
        + (time.getMonth() + 1);
    var ldate = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();
    var lhours = time.getHours() > 9 ? time.getHours() : "0" + time.getHours();
    var lminutes = time.getMinutes() > 9 ? time.getMinutes() : "0"
        + time.getMinutes();
    var lseconds = time.getSeconds() > 9 ? time.getSeconds() : "0"
        + time.getSeconds();
    time = lyear + lmonth +  ldate +  lhours + lminutes + lseconds;
    return time;
}


//获取时间
function gettime2(time) {
    var lyear = time.getFullYear();
    var lmonth = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0"
        + (time.getMonth() + 1);
    var ldate = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();
    var lhours = time.getHours() > 9 ? time.getHours() : "0" + time.getHours();
    var lminutes = time.getMinutes() > 9 ? time.getMinutes() : "0"
        + time.getMinutes();
    var lseconds = time.getSeconds() > 9 ? time.getSeconds() : "0"
        + time.getSeconds();
    time = lyear+"-"+lmonth+"-"+ldate+" "+lhours+":"+lminutes+":"+lseconds;
    return time;
}

//点击时间标签
$(".time").click(function(){
    settime();
})

//点击识别设置标签
$(".shibie").click(function(){
    var devset = JSON.parse(window.sessionStorage.getItem('devset'));
    var update = window.sessionStorage.getItem('update');
    if(devset==null) {
        ajax_getdevsetting();
    }else {
        if (update == "no") {
           $(".vermode").val(devset["verifyMode"]);
           $(".revtime").val(devset["reverifyTime"]);
        }else{
            ajax_getdevsetting();
        }
    }
})

//点击声音及显示
$(".sound").click(function(){
    var devset = JSON.parse(window.sessionStorage.getItem('devset'));
    var update = window.sessionStorage.getItem('update');
    if(devset==null) {
        ajax_getdevsetting();
    }else {
        if (update == "no") {
            $(".devvol").val(devset["volume"]);
            $(".devscran").val(devset["screensaversTime"]);
            $(".devsleep").val(devset["sleepTime"])
        }else{
            ajax_getdevsetting();
        }
    }

})

//点击网络参数标签
$(".webpro").click(function(){
    var devset = JSON.parse(window.sessionStorage.getItem('devset'));
    var update = window.sessionStorage.getItem('update');
    if(devset==null) {
        ajax_getdevsetting();
    }else {
        if (update == "no") {
            $(".dname").val(devset["devName"]);
            $(".serverip").val(devset["serverHost"]);
            $(".serverport").val(devset["serverPort"]);
            $(".tsip").val(devset["pushServerHost"]);
            $(".tsport").val(devset["pushServerPort"]);
            $(".ispush").val(devset["pushEnable"]);
        }else{
            ajax_getdevsetting();
        }
    }
})

//点击设备信息标签
$(".devinf").click(function(){
    var devinfo = JSON.parse(window.sessionStorage.getItem('devinfo'));
    var update = window.sessionStorage.getItem('update');
    if(devinfo==null) {
        ajax_getdevinfo();
    }else {
        if (update == "no") {
            $(".dvname").val(devinfo["name"]);
            $(".dvId").val(devinfo["deviceId"]);
            $(".fpver").val(devinfo["fpVer"]);
            $(".facever").val(devinfo["faceVer"]);
            $(".pvver").val(devinfo["pvVer"]);
            $(".maxlen").val(devinfo["maxBufferLen"]);
            $(".userlimit").val(devinfo["userLimit"]);
            $(".fplimit").val(devinfo["fpLimit"]);
            $(".facelimit").val(devinfo["faceLimit"]);
            $(".pwdlimit").val(devinfo["pwdLimit"]);
            $(".cardlimit").val(devinfo["cardLimit"]);
            $(".loglimit").val(devinfo["logLimit"]);
            $(".usercount").val(devinfo["userCount"]);
            $(".managercount").val(devinfo["managerCount"]);
            $(".fpcount").val(devinfo["fpCount"]);
            $(".facecount").val(devinfo["faceCount"]);
            $(".pwdcount").val(devinfo["pwdCount"]);
            $(".cardcount").val(devinfo["cardCount"]);
            $(".logcount").val(devinfo["logCount"]);
            $(".alllogcount").val(devinfo["allLogCount"]);
            $(".firmware").val(devinfo["firmware"]);
        } else {
            ajax_getdevinfo();
        }
    }
})

//点击设备参数
$(".devpro").click(function(){
    var devset = JSON.parse(window.sessionStorage.getItem('devset'));
    var update = window.sessionStorage.getItem('update');
    if(devset==null) {
        ajax_getdevsetting();
    }else {
        if (update == "no") {
            $(".dnamed").val(devset["devName"]);
            $(".interval").val(devset["interval"]);
            $(".language").val(devset["language"]);
            $(".wgen").val(devset["wiegandType"]);
        }else{
            ajax_getdevsetting();
        }
    }
})

//选择升级文件
$(".uploadfile").change(function(){
    var file= this.files[0];
    var type = file.type;
    var name = file.name;
    var ty2 = name.split(".")[1];
    if(ty2!="img"){
        alert("文件类型必须是 img");
        $(".uploadfile").val("");
    }
    $('.progress > div').css('width', 0);
    $('.progress').hide();
})

//系统升级
function uplodfile(){
    var form = document.getElementById("uploadform");
    // 用表单来初始化
    var formData = new FormData(form);
    $('.progress').show();
        $.ajax({
            url:"/bin/upload",//后台的接口地址
            type:"post",//post请求方式
            data:formData,//参数
            cache: false,
            processData: false,
            contentType: false,
            xhr: function() {
                var xhr = new XMLHttpRequest();
                //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
                xhr.upload.addEventListener('progress', function (e) {
                    var progressRate = (e.loaded / e.total) * 100 + '%';
                    //通过设置进度条的宽度达到效果

                    $('.progress > div').css('width', progressRate);
                })

                return xhr;
            },error:function () {

                alert("uploadfail");
            }
        })

}

$(".resbut").click(function(){
    if($(".uploadfile").val()==null || $(".uploadfile").val()==""){
        alert("未选择文件")
    }else{
        uplodfile();
    }
})