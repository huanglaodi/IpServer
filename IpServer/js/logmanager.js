var begintime = new Date();    //默认开始日期
var endtime = new Date();  //默认结束日期
var packageid = 0;        //默认分包id;
var isfirstlogs = "yes";   //是否首次查询记录；
var logs = [];         //记录数组，缓存（数据过多可能页面会卡）
var allpage = 0;   //总页数
var pagesize = 100;   //每页条数
var nowpage = 1;   //当前页

//获取记录数据
function ajax_selectlogs() {
    var stime = gettime(begintime);
    var etime = gettime(endtime);
    var cmd = "GetLogData";
    var mjson = JSON.stringify({
        "cmd": cmd,
        "data": {"packageId": packageid, "beginTime": stime, "endTime": etime, "newLog": 0, "clearMark": 0}
    });
    var defer = $.Deferred();
    $.ajax({
        type: "post",
        url: "/bin/cmd",
        data: mjson,
        contentType: "application/json",
        async: true,
        success: function (ret) {
            var jsonstr = JSON.parse(ret);
            var returncode = jsonstr["result_code"];
            //执行成功
            if (returncode == 0) {
                var resultdata = jsonstr["result_data"];
                packageid = resultdata["packageId"];
                var loglist = resultdata["logs"];
                Array.prototype.push.apply(logs, loglist);

                if(packageid != 0){
                    ajax_selectlogs();
                }else{
                    $(".progress", window.parent.document).hide();
                    $(".progress2").hide();
                    pageinfo();
                    nowpagelogs();
                }
            } else {
                alert("错误");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("upload fail");
            // document.getElementById("myControl").disabled = false;
        },
    })
    return defer;
}

//循环查询记录数据
function selectlogs() {
    $(".progress", window.parent.document).show();
    $(".progress2").show();
    $("#progressImgage").show();
        if (isfirstlogs == "yes") {
            isfirstlogs = "no";
            $.when(ajax_selectlogs()).done(function (ret) {
                    //ajax递归之后这里不再执行？
            })

        }
    }


//分页信息
    function pageinfo() {
        allpage = logs.length / pagesize;
        if (allpage <= 1) {
            allpage = 1;
        } else {
            if (((logs.length) % pagesize) != 0) {
                allpage = parseInt(allpage) + 1;
            } else {
                allpage = parseInt(allpage);
            }
        }
        if (allpage > 1) {
            $("#firstye").hide();
            $("#beforeye").hide();
            $("#nextye").show();
            $("#lastye").show();
            $("#fanye").show();
            var html = "";

            for (var i = 1; i <= allpage; i++) {
                html = html
                    + "<option value=" + i + ">第" + i + "页</option>"
            }
            $("#fanye").html(html);
            $("#fanye").val(nowpage);
            $("#ye2").text("共" + allpage + "页/" + logs.length + "条");
        } else {
            $("#firstye").hide();
            $("#beforeye").hide();
            $("#nextye").hide();
            $("#lastye").hide();
            $("#fanye").hide();
            $("#ye2").text("共" + allpage + "页/" + logs.length + "条");
        }

    }


//当前页记录
    function nowpagelogs() {
        var firstindex = (nowpage - 1) * parseInt(pagesize);
        var endindex = 0;
        if (nowpage == allpage) {
            if (logs.length > 0) {
                endindex = logs.length - 1;
            } else {
                endindex = 0;
            }
        } else {
            endindex = firstindex + parseInt(pagesize) - 1;
        }
        var html = "";
        var log = "";
        if (logs.length > 0) {
            for (var i = firstindex; i <= endindex; i++) {
                log = logs[i];
                var logphoto = log.logPhoto;
                if (logphoto != null) {
                    logphoto = "data:image/jpg;base64," + logphoto;
                } else {
                    logphoto = "";
                }
                var uid = log.userId;
                var utime = log.time;
                utime = utime.substring(0, 4) + "-" + utime.substring(4, 6) + "-" + utime.substring(6, 8) + " " + utime.substring(8, 10) + ":" +
                    "" + utime.substring(10, 12) + ":" + utime.substring(12, 14);
                var vmode = log.verifyMode;
                if (vmode == null) {
                    vmode = "";
                }
                var iomode = log.ioMode;
                if (iomode == null) {
                    iomode = "";
                }
                var inout = log.inOut;
                if (inout == null) {
                    inout = "";
                }
                var doormode = log.doorMode;
                if (doormode == null) {
                    doormode = "";
                }
                html = html
                    + "<tr class='log'>"
                    + "<td class='noExl'><img onerror='nofind()' src="+logphoto+"></td>"
                    + "<td>" + uid + "</td>"
                    + "<td>" + utime + "</td>"
                    + "<td>" + vmode + "</td>"
                    + "<td>" + iomode + "</td>"
                    + "<td>" + inout + "</td>"
                    + "<td>" + doormode + "</td>"
                    + "</tr>";
            }
        }
        $(".logs").html(html);

    }

//页面切换
    function changpage() {
        if (nowpage == 1 && allpage > 1) {
            $("#firstye").hide();
            $("#beforeye").hide();
            $("#nextye").show();
            $("#lastye").show();
            $("#fanye").show();
        } else if (nowpage == 1 && allpage == 1) {
            $("#firstye").hide();
            $("#beforeye").hide();
            $("#nextye").hide();
            $("#lastye").hide();
            $("#fanye").hide();
        } else if (nowpage == allpage && allpage > 1) {
            $("#firstye").show();
            $("#beforeye").show();
            $("#nextye").hide();
            $("#lastye").hide();
            $("#fanye").show();
        } else {
            $("#firstye").show();
            $("#beforeye").show();
            $("#nextye").show();
            $("#lastye").show();
            $("#fanye").show();
        }
    }


//首页
    $("#firstye").click(function () {
        nowpage = 1;
        $("#fanye").val(nowpage);
        changpage();
        nowpagelogs();
    })

//上一页
    $("#beforeye").click(function () {
        nowpage = nowpage - 1;
        $("#fanye").val(nowpage);
        changpage();
        nowpagelogs();
    })

//下一页
    $("#nextye").click(function () {
        nowpage = nowpage + 1;
        $("#fanye").val(nowpage);
        changpage();
        nowpagelogs();
    })

//末页
    $("#lastye").click(function () {
        nowpage = allpage;
        $("#fanye").val(nowpage);
        changpage();
        nowpagelogs();
    })

//翻页
    $("#fanye").change(function () {
        nowpage = $("#fanye").val();
        changpage();
        nowpagelogs();
    })

//更改pagesize,
    $("#pagesize").change(function () {
        pagesize = parseInt($("#pagesize").val());
        nowpage = 1;
        //重新查询分页信息
        pageinfo();
        nowpagelogs();

    })


//按日期区间查询
    $(".selectlog").click(function () {
        begintime = new Date($(".begintime").val());
        endtime = new Date($(".endtime").val());

        if (parseInt(gettime(endtime)) < parseInt(gettime(begintime))) {
            alert("结束日期不能小于开始日期")
        } else {
            packageid = 0;
            isfirstlogs = "yes";
            logs = [];
            allpage = 0;
            nowpage = 1;
            selectlogs();
        }

    })


//获取时间字符串
    function gettime(time) {
        var lyear = time.getFullYear();
        var lmonth = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0"
            + (time.getMonth() + 1);
        var ldate = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();

        time = "" + lyear + lmonth + ldate;
        return time;
    }

//获取时间字符串2
    function gettime2(time) {
        var lyear = time.getFullYear();
        var lmonth = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0"
            + (time.getMonth() + 1);
        var ldate = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();

        time = lyear + "-" + lmonth + "-" + ldate;
        return time;
    }

//导出记录到excel
    $(".daochu").click(function () {
        var html = "<tr class='xhead' style='display:none'>"
            + "<td class='noExl'>打卡照片</td>"
            + "<td>ID</td>"
            + "<td>时间</td>"
            + "<td>打卡方式</td>"
            + "<td>打卡模式</td>"
            + "<td>进出模式</td>"
            + "<td>开门模式</td>"
            + "</tr>"
        $(".logs").prepend(html);
        $(".logs").table2excel({            //exceltable为存放数据的table
            // 不被导出的表格行的CSS class类
            exclude: ".noExl",
            // 导出的Excel文档的名称
            name: "表格_" + new Date().getTime(),
            // Excel文件的名称
            filename: "记录_" + new Date().getTime() + ".xls",
            bootstrap: false
        });
        $(".xhead").remove();
    })

//页面加载
    window.onload = function () {
        $(".begintime").val(gettime2(begintime));
        $(".endtime").val(gettime2(endtime));
    }

function nofind(){
    var img = event.srcElement;
    img.src = "../images/people.png";
    img.onerror = null; //控制不要一直跳动
}


