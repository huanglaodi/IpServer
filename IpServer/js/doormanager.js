window.onload=function (){
    var html = "<option value=1>1</option>";
    for(var i=2;i<256;i++){
        html = html+"<option value="+i+">"+i+"</option>";
    }
    $(".timezones").html(html);

}

//切换标签
$(".right1-fl").find("a").click(function(){
    $(this).css({"background":"#ff8a3c"});
    $(this).siblings().css({"background":"#fff"});
    var text = $(this).text();
    if(text=="门禁状态"){
        $(".right2-dooropen").show();
        $(".right2-dooropen").siblings().hide();
    }
    if(text=="门禁参数"){
        $(".right2-doorpro").show();
        $(".right2-doorpro").siblings().hide();
    }if(text=="门禁时间组"){
        $(".right2-doortimes").show();
        $(".right2-doortimes").siblings().hide();
    }

})

$(".doorstain").click(function(){
    var doorstate = $(".dstate").val();
    var cmd = "SetDoorStatus";
    var mjson = JSON.stringify({"cmd":cmd,"data":{"doorStatus":doorstate}});
    $.ajax({
        type: "post",
        url: "/bin/cmd",
        data: mjson,
        contentType: "application/json",
        async: false,
        success: function (msg, textStatus, jqXHR) {
            var jsonstr = JSON.parse(msg);
            var returncode = jsonstr["result_code"];
            //执行成功
            if (returncode == 0) {
                alert("设置成功")
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("upload fail");
            // document.getElementById("myControl").disabled = false;
        }
    });
})

//点击门禁参数标签
$(".doorpro").click(function(){
    var devset = JSON.parse(window.sessionStorage.getItem('devset'));
    var update = window.sessionStorage.getItem('update');
    if(devset==null) {
        ajax_getdevsetting();
    }else {
        if (update == "no") {
            $(".doordelay").val(devset["openDoorDelay"]);
            $(".alarmdelay").val(devset["alarmDelay"]);
            $(".antipass").val(devset["antiPass"]);
            $(".tamperalarm").val(devset["tamperAlarm"]);
            $(".weigen").val(devset["wiegandType"]);
        }else{
            ajax_getdevsetting();
        }
    }
})


/*ajax给机器下达获取设备参数指令*/
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

                 $(".doordelay").val(resultdata["openDoorDelay"]);
                 $(".alarmdelay").val(resultdata["alarmDelay"]);
                $(".antipass").val(resultdata["antiPass"]);
                $(".tamperalarm").val(resultdata["tamperAlarm"]);
                $(".weigen").val(resultdata["wiegandType"]);

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

/*---手动设置门禁参数---*/
$(".doorbt").click(function(){
        var doordelay = $(".doordelay").val();
        var alarmdelay = $(".alarmdelay").val();
        var antipass = $(".antipass").val();
        var tamperalarm = $(".tamperalarm").val();
        var weigen = $(".weigen").val();

        var data = {"openDoorDelay":doordelay,"alarmDelay":alarmdelay,"antiPass":antipass,"tamperAlarm":tamperalarm,"wiegandType":weigen};
        ajax_setdevsetting(data);
    })

