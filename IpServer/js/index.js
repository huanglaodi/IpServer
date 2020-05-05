

/*$(".exit").click(function(){
    window.location.href=" ../../test.html";
})*/

$(".system-left").find("a").click(function(){
    $(this).find("li").css({"background":"#65ABF1","color":"#fff"});
    $(this).siblings().find("li").css({"background":"#D0D8D7","color":"#666"});
    var text = $(this).find("li").eq(0).text();
    var src="";
    if(text=="系统设置"){
        src = "IpServer/html/systemmanager.html";

    }else if(text=="人员管理"){
        src = "IpServer/html/usermanager.html";

    }else if(text=="记录查看"){
        src ="IpServer/html/logmanager.html";

    }else if(text=="门禁管理"){
        src = "IpServer/html/doormanager.html";

    }else if(text=="实时管理"){
        src = "IpServer/html/realtime.html";

    }
    $("#fram").attr("src",src);
    //localStorage.clear();​
})

window.onload = function () {
    window.sessionStorage.clear();
}

