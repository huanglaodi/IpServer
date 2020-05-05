var idlistpk = 0;           //人员列表包id
var userinfopk = 0;        //人员信息包id
var isfirstidlist = "yes";   //是否首次查询人员列表
var isfirstuserinfo = "yes";  //是否首次查询人员信息（应该可以忽略，每页5个人不可能分包）
var useridlist = [];        //所有人员id列表数组
var userslist = [];     //所有人员数组
var usersid = [];         //每页人员id数组
var nowpage = 1;     //当前页,默认1
var allpage = 0;     //总页数
var pagesize = 100;    //默认每页100条
var isupimgs = false;   //是否图片上传

//ajax获取用户信息
function ajax_getuserinfo() {
    var mCmd = "GetUserInfo";
    var mjson = JSON.stringify({"cmd": mCmd, "data": {"packageId": userinfopk, "usersId": usersid}})

    var defer = $.Deferred();
    $.ajax({
        type: "post",
        url: "/bin/cmd",
        data: mjson,
        contentType: "application/json",
        async: true,
        success: function (msg, textStatus, jqXHR) {
            var jsonstr = JSON.parse(msg);
            var returncode = jsonstr["result_code"];
            //执行成功
            if (returncode == 0) {
                var resultdata = jsonstr["result_data"];
                userinfopk = resultdata["packageId"];
                var users = resultdata["users"];
                var html = $(".users").html();
                for (var key in users) {
                    var userid = users[key]["userId"];
                    var name = users[key]["name"];
                    if (name == null) {
                        name = "";
                    }
                    var privilege = users[key]["privilege"];
                    if (privilege == 0) {
                        privilege = "用户";
                    } else if (privilege == 1) {
                        privilege = "管理员";
                    }
                    var card = users[key]["card"];
                    if (card == null) {
                        card = "";
                    }
                    var pwd = users[key]["pwd"];
                    if (pwd == null) {
                        pwd = "";
                    }
                    var fps = users[key]["fps"];
                    if (fps != null) {
                        fps = fps.length;
                    } else {
                        fps = 0;
                    }
                    var face = users[key]["face"];
                    if (face != null) {
                        face = 1;
                    } else {
                        face = 0;
                    }
                    var palm = users[key]["palm"];
                    if (palm != null) {
                        palm = 1;
                    } else {
                        palm = 0;
                    }
                    var photo = users[key]["photo"];
                    if (photo != null) {
                        photo = "data:image/jpg;base64," + users[key]["photo"];
                    }
                    var vaildStart = users[key]["vaildStart"];
                    vaildStart = vaildStart.substring(0, 4) + "-" + vaildStart.substring(4, 6) + "-" + vaildStart.substring(6, 8);
                    var vaildEnd = users[key]["vaildEnd"];
                    vaildEnd = vaildEnd.substring(0, 4) + "-" + vaildEnd.substring(4, 6) + "-" + vaildEnd.substring(6, 8);

                    html = html
                        + "<tr class='uinfo'>"
                        + "<td class='noExl'><input class='usercheck' type='checkbox'><img src=" + photo + " onerror='nofind()'></td>"
                        + "<td class='usid'>" + userid + "</td>"
                        + "<td>" + name + "</td>"
                        + "<td>" + privilege + "</td>"
                        + "<td>" + card + "</td>"
                        + "<td>" + pwd + "</td>"
                        + "<td class='noExl'>" + fps + "</td>"
                        + "<td class='noExl'>" + face + "</td>"
                        + "<td class='noExl'>" + palm + "</td>"
                        + "<td>" + vaildStart + "</td>"
                        + "<td>" + vaildEnd + "</td>"
                        + "<td class='noExl'><input class='updateuser' type='button' value='修改'></td>"
                        + "</tr>"
                }
                $(".users").html(html);
                if(userinfopk !=0){
                    ajax_getuserinfo();
                }else{
                    $(".progress", window.parent.document).hide();
                    $(".progress2").hide();
                }
            }else
           {
            alert("获取用户信息错误");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
           // alert("获取用户信息 upload fail");
            // document.getElementById("myControl").disabled = false;
        }
    });
   return defer;
}

//ajax获取人员列表
function ajax_getuseridlist() {
    var mCmd = "GetUserIdList";
    var mjson = JSON.stringify({"cmd": mCmd, "data": {"packageId": idlistpk}});
    var defer = $.Deferred();
    $.ajax({
        type: "post",
        url: "/bin/cmd",
        data: mjson,
        contentType: "application/json",
        async: true,
        success: function (msg, textStatus, jqXHR) {
            var jsonstr = JSON.parse(msg);
            var returncode = jsonstr["result_code"];
            //执行成功
            if (returncode == 0) {
                var resultdata = jsonstr["result_data"];
                idlistpk = resultdata["packageId"];
                var users = resultdata["users"];
                Array.prototype.push.apply(userslist, users);
                for (var key in users) {
                    useridlist.push(parseInt(users[key]["userId"]));
                }
                if(idlistpk!=0){
                    ajax_getuseridlist();
                }else{
                    $(".progress", window.parent.document).hide();
                    //id排序
                    useridlist = useridlist.sort(
                        function(a, b){
                            return parseInt(a) - parseInt(b);
                        }
                    );
                    if(!isupimgs) {
                        pageinfo();
                        getusersid();
                        selectuserinfo();
                    }else{
                        isupimgs = false;
                    }
                }
            }else{
                alert("获取人员列表错误");
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
           // alert("获取人员列表 upload fail");
            // document.getElementById("myControl").disabled = false;
        }
    });
   return defer;
}

//循环查询人员列表id
function selectidlist() {
    $(".progress", window.parent.document).show();
    $(".progress2").show();
    $("#progressImgage").show();
    useridlist = [];
    userslist = [] ;
    if (isfirstidlist == "yes") {
        isfirstidlist = "no";
        $.when(ajax_getuseridlist()).done(function (ret) {
            //ajax递归之后这里不再执行？
        })

    }
}

//分页信息
    function pageinfo() {
        allpage = useridlist.length / pagesize;
        if (allpage <= 1) {
            allpage = 1;
        } else {
            if (((useridlist.length) % pagesize) != 0) {
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
            $("#ye2").text("共" + allpage + "页/" + useridlist.length + "条");
        } else {
            $("#firstye").hide();
            $("#beforeye").hide();
            $("#nextye").hide();
            $("#lastye").hide();
            $("#fanye").hide();
            $("#ye2").text("共" + allpage + "页/" + useridlist.length + "条");
        }

    }

//当前页的人员id数组,当前设定一页5人
    function getusersid() {
        usersid = [];
        var firstindex = (nowpage - 1) * parseInt(pagesize);
        var endindex = 0;
        if (nowpage == allpage) {
            if (useridlist.length > 0) {
                endindex = useridlist.length - 1;
            } else {
                endindex = 0;
            }
        } else {
            endindex = firstindex + parseInt(pagesize) - 1;
        }
        for (var i = firstindex; i <= endindex; i++) {
            usersid.push(""+useridlist[i]);
        }

    }


//循环查询当前页人员信息
    function selectuserinfo() {
        $(".progress", window.parent.document).show();
        $(".progress2").show();
        $("#progressImgage").show();
        if (isfirstuserinfo == "yes") {
            isfirstuserinfo = "no";
            $.when(ajax_getuserinfo()).done(function (ret) {
                //ajax递归之后这里不再执行？
            })
        }
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
        selectpage();
    })

//上一页
    $("#beforeye").click(function () {
        nowpage = nowpage - 1;
        $("#fanye").val(nowpage);
        selectpage();
    })

//下一页
    $("#nextye").click(function () {
        nowpage = nowpage + 1;
        $("#fanye").val(nowpage);
        selectpage();
    })

//末页
    $("#lastye").click(function () {
        nowpage = allpage;
        $("#fanye").val(nowpage);
        selectpage();
    })

//翻页
    $("#fanye").change(function () {
        nowpage = $("#fanye").val();
        selectpage();
    })


//查询当前页
    function selectpage() {
        isfirstuserinfo = "yes";   //每次翻页重置人员信息包的状态yes
        $(".users").find(".uinfo").remove();   //翻页清除原表单
        changpage();
        getusersid();
        selectuserinfo();
    }


//点击修改
    $(".users").on("click", ".updateuser", function () {

        $(".right4-insertuser").show();
        $(".progress", window.parent.document).show();
        $(".progress2").show();
        $("#progressImgage").hide();
        $(".userdiv").text("修改人员");
        $(".uid").hide();
        $(".enroll").show();

        isfirstuserinfo = "yes";
        var userid = $(this).parents("tr").find(".usid").text();
        var uid = [userid];

        var mCmd = "GetUserInfo";
        var mjson = JSON.stringify({"cmd": mCmd, "data": {"packageId": 0, "usersId": uid}})

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
                    var resultdata = jsonstr["result_data"];
                    userinfopk = resultdata["packageId"];
                    var users = resultdata["users"];
                    for (var key in users) {
                        var userid = users[key]["userId"];
                        $(".userid").val(userid);
                        var name = users[key]["name"];
                        $(".uname").val(name);
                        var privilege = users[key]["privilege"];
                        $(".quanxian").val(privilege);
                        var card = users[key]["card"];
                        if (card == null) {
                            $(".card").val("");
                        } else {
                            $(".card").val(card);
                        }
                        var pwd = users[key]["pwd"];
                        if (pwd == null) {
                            $(".pwd").val("");
                        } else {
                            $(".pwd").val(pwd);
                        }
                        var photo = users[key]["photo"];
                        if (photo != null) {
                            photo = "data:image/jpg;base64," + users[key]["photo"];
                            $(".photoshow").attr("src", photo);
                        } else {
                            $(".photoshow").attr("src", "../images/people.png");
                        }
                        var vaildStart = users[key]["vaildStart"];
                        vaildStart = vaildStart.substring(0, 4) + "-" + vaildStart.substring(4, 6) + "-" + vaildStart.substring(6, 8);
                        var vaildEnd = users[key]["vaildEnd"];
                        vaildEnd = vaildEnd.substring(0, 4) + "-" + vaildEnd.substring(4, 6) + "-" + vaildEnd.substring(6, 8);
                        $(".starttime").val(vaildStart);
                        $(".endtime").val(vaildEnd);
                    }
                }
            }
        })

    })


//确定修改人员,
    $(".ok").click(async function () {
        var userid = $(".userid").val();
        var user = {"userId": userid};
        var uname = $(".uname").val();
        var quanxian = $(".quanxian").val();
        var card = $(".card").val();
        var pwd = $(".pwd").val();
        var photo = $(".photoshow").attr("src");
        var reg = /-/g;
        var starttime = $(".starttime").val().replace(reg, "");
        var endtime = $(".endtime").val().replace(reg, "");
        var photoEnroll = $(".usephoto").val();

        if (uname != "" && uname != null) {
            user.name = uname;
        }
        if (quanxian != "" && quanxian != null) {
            user.privilege = parseInt(quanxian);
        }
        if (card != "" && card != null) {
            user.card = card;
        }
        if (pwd != "" && pwd != null) {
            user.pwd = pwd;
        }
        if (photo != "" && photo != null) {
            photo = photo.split(",")[1];
            user.photo = photo;
        }
        if (starttime != "" && starttime != null) {
            user.vaildStart = starttime;
        }
        if (endtime != null && endtime != "") {
            user.vaildEnd = endtime;
        }
        user.photoEnroll = parseInt(photoEnroll);
        user.update = 1;     //覆盖修改，防止提交错误人员被删除

        var users = [user];
        var title = $(".userdiv").text();
        if (title == "添加人员") {
            if (userid == "") {
                alert("人员id为必填")
            } else {
                if ($.inArray(parseInt(userid), useridlist) < 0) {
                  await  setuserinfo(users);
                } else {
                    alert("已存在此ID用户");
                }
            }
        } else {
            await setuserinfo(users);
        }

    })

//取消修改
    $(".no").click(function () {
        $(".right4-insertuser").find("input").val("");
        $(".ok").val("确定");
        $(".no").val("取消");
        $(".photoshow").attr("src", "");
        $(".right4-insertuser").hide();
        $(".progress", window.parent.document).hide();
        $(".progress2").hide();
    })

//写入人员
var isEnroll = false;
var setuserok = true;
    function ajax_setuserinfo(users) {
        var mCmd = "SetUserInfo";
        var mjson = JSON.stringify({"cmd": mCmd, "data": {"users": users}})

        var defer = $.Deferred();
        $.ajax({
            type: "post",
            url: "/bin/cmd",
            data: mjson,
            contentType: "application/json",
            async: true,
            success: function (msg, textStatus, jqXHR) {
                var jsonstr = JSON.parse(msg);
                var returncode = jsonstr["result_code"];
                //执行成功
                if (returncode == 0) {
                    if (!isEnroll) {
                        $(".right4-insertuser").find("input").val("");
                        $(".ok").val("确定");
                        $(".no").val("取消");
                        $(".photoshow").attr("src", "");
                        $(".right4-insertuser").hide();
                        $(".xlsdiv").hide();
                        //更新当前页
                        isfirstuserinfo = "yes";   //每次翻页重置人员信息包的状态yes
                        $(".users").find(".uinfo").remove();   //翻页清除原表单
                        //若是修改
                        var title = $(".userdiv").text();
                        if (setuserok) {
                            if (title == "修改人员") {
                                selectuserinfo();
                                $(".progress", window.parent.document).hide();
                                $(".progress2").hide();
                            } else {
                                //若新增
                                isfirstidlist = "yes";
                                nowpage = 1;
                                selectidlist();
                                $(".progress", window.parent.document).hide();
                                $(".progress2").hide();
                                window.sessionStorage.setItem('update', "yes");
                            }
                        }
                        defer.resolve();
                    }else{
                        defer.resolve();
                    }
                }else {
                    alert("修改人员失败");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("写入人员 upload fail");

            }
        })
  return defer;
    }

//选择照片
    $(".photo").click(function () {
        $(this).prev().click();
    })

//照片显示
    function imgchanges(e) {
        var file = e.files[0];
        var type = file.type;
        var size = file.size;
        var ty2 = type.split("/")[1];
        if (ty2 !="jpg" && ty2 !="jpeg" && ty2 !="png"){
            alert("不是正确图片格式");
        } else {
            if (size > 300 * 1024) {
                alert("图片不能超过300k")
            } else {
                var photo = $(e).parent("div").find(".photoshow");
                uploadFile2(file, photo);
            }
        }
    }

//文件转base64
    function uploadFile(file, dom) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            var base_64 = this.result;
            dom.val(base_64.split(",")[1]);

        }
    }

//照片
    function uploadFile2(file, dom) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            var base_64 = this.result;
            dom.attr("src", base_64);

        }
    }

//新增人员
    $(".insert").click(function () {
        $(".right4-insertuser").show();
        $(".progress", window.parent.document).show();
        $(".progress2").show();
        $("#progressImgage").hide();
        $(".uid").show();
        $(".userdiv").text("添加人员");
        $(".photoshow").attr("src", "../images/people.png");
        if(isfirstidlist=="yes"){
            isupimgs = true;
            selectidlist();
        }

    })

//人员删除,
    $(".delete").click(function () {

        var userid = [];
        var usercount = "";
        $(".users").find(".usercheck").each(function () {
            var ischeck = $(this).prop("checked");
            if (ischeck) {
                var uid = $(this).parents("tr").find(".usid").text();
                userid.push(uid);
            }
        })
        if (userid.length > 0) {
            usercount = userid.length;
            deleteusers(usercount, userid);
        } else {
            alert("请勾选删除人员")
        }


    })


//整页删除
    $(".deleteall").click(function () {
        var count = usersid.length;
        if (count > 0) {
            deleteusers(count, usersid);
        }

    })

//提交人员删除
    function deleteusers(ucount, uids) {

        var mCmd = "DeleteUserInfo";
        var mjson = JSON.stringify({"cmd": mCmd, "data": {"usersCount": ucount, "usersId": uids}})

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
                    alert("人员删除成功")
                    isfirstuserinfo = "yes";
                    $(".users").html("");
                    isfirstidlist = "yes";
                    nowpage = 1;
                    selectidlist();
                    window.sessionStorage.setItem("update", "yes");
                }
            }
        })
    }


//更改pagesize,useridlist不变
    $("#pagesize").change(function () {
        pagesize = parseInt($("#pagesize").val());
        $(".users").html("");
        //重新查询分页信息
        isfirstuserinfo = "yes";
        nowpage = 1;
        pageinfo();
        getusersid();
        selectuserinfo();
    })

//搜索人员
    $("#search").click(function () {
        var userid = $(".utext").val();
        $(".users").html("");
        if (userid != null && userid != "") {
            nowpage = 1;
            isfirstuserinfo = "yes";
            isfirstidlist = "yes";
            usersid = [userid];
            selectuserinfo();
        } else {
            isfirstuserinfo = "yes";
            isfirstidlist = "yes";
            nowpage = 1;
            selectidlist();
        }
    })

//导入xls;
    $(".daoru").click(function () {
        $(".xlsdiv").show();
        $(".progress", window.parent.document).show();
        $(".progress2").show();
        $("#progressImgage").hide();
    })

//返回人员库
    $(".right-t").click(function () {
        $(".xlsdiv").hide();
    })


    var users = "";

//解析xls
    $(".choosexls").change(function (e) {
        users = "";
        var files = e.target.files;
        var fileReader = new FileReader();

        fileReader.onload = function (ev) {
            try {
                var data = ev.target.result,
                    workbook = XLSX.read(data, {
                        type: 'binary'
                    }), // 以二进制流方式读取得到整份excel表格对象
                    us = []; // 存储获取到的数据
            } catch (e) {
                alert('文件类型不正确');
                $(".choosexls").val("");
                return;
            }
            // 表格的表格范围，可用于判断表头是否数量是否正确
            var fromTo = '';
            // 遍历每张表读取
            for (var sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    fromTo = workbook.Sheets[sheet]['!ref'];
                    console.log(fromTo);
                    us = us.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                   // break; // 如果只取第一张表，就取消注释这行
                }
            }
            users = us;

        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
    });


//导入xls
    $(".uploadxls").click(async function () {
            var xlsusers = [];
            if (users == "") {
                alert("未选择文件");
            } else {
                //将解析得到的users组装成下发给机器的数组
                for (var i = 0; i < users.length; i++) {
                    var us = {};
                    for (var key in users[i]) {
                        if (users[i][key] != "") {

                            if (key == "ID") {
                                us.userId = users[i][key];
                            }
                            if (key == "姓名") {
                                us.name = users[i][key];
                            }
                            if (key == "权限") {
                                var quanxian = users[i][key];
                                if (quanxian == "用户") {
                                    quanxian = 0;
                                }
                                if (quanxian == "管理员") {
                                    quanxian = 1;
                                }
                                us.privilege = parseInt(quanxian);
                            }
                            if (key == "密码") {
                                us.pwd = users[i][key];
                            }
                            if (key == "卡号") {
                                us.card = users[i][key];
                            }
                            if (key == "有效期开始日期") {
                                if (users[i][key] != "0000-00-00") {
                                    var stime = new Date(users[i][key]);
                                    us.vaildStart = gettime(stime);
                                }
                            }
                            if (key == "有效期结束日期") {
                                if (users[i][key] != "0000-00-00") {
                                    var etime = new Date(users[i][key])
                                    us.vaildEnd = gettime(etime);
                                }
                            }
                        }
                    }
                    if (us.userId != null) {
                        var b = parseInt(us.userId);
                        if ((b + "") == us.userId) {
                            us.update = 1;
                            xlsusers.push(us);
                        }
                    }
                }
                if (xlsusers.length > 0) {
                    $(".userdiv").text("新增人员");
                  await setuserinfo(xlsusers);
                }
            }

        }
    )

//关闭导入框
    $(".right-t").click(function () {
        $(".xlsdiv").hide();
        $(".choosexls").val("");
        $(".progress", window.parent.document).hide();
        $(".progress2").hide();
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


//导出人员到excel
    $(".daochu").click(function (){
        var html = "<tr class='xhead' style='display:none'>"
            + "<td class='noExl'>全选</td>"
            + "<td>ID</td>"
            + "<td>姓名</td>"
            + "<td>权限</td>"
            + "<td>卡号</td>"
            + "<td>密码</td>"
            + "<td class='noExl'>指纹数</td>"
            + "<td class='noExl'>人脸数</td>"
            + "<td class='noExl'>掌纹数</td>"
            + "<td>有效期开始日期</td>"
            + "<td>有效期结束日期</td>"
            + "<td class='noExl'>编辑</td>"
            + "</tr>"
        $(".users").prepend(html);
        $(".users").table2excel({            //exceltable为存放数据的table
            // 不被导出的表格行的CSS class类
            exclude: ".noExl",
            // 导出的Excel文档的名称
            name: "表格_" + new Date().getTime(),
            // Excel文件的名称
            filename: "表格_" + new Date().getTime() + ".xls",
            bootstrap: false
        });
        $(".xhead").remove();
    })

    function nofind() {
        var img = event.srcElement;
        img.src = "../images/people.png";
        img.onerror = null; //控制不要一直跳动
    }

//远程录入
    $(".enluru").click(async function () {
        isEnroll =true;
        var feature = $(".feature").val();
        var userId = $(".userid").val();
        var title = $(".userdiv").text();
        if (userId == "" || userId == null){
            alert("userid必填")
        } else if(title=="添加人员" && $.inArray(parseInt(userId), useridlist) >= 0) {
            alert("有重复人员");
        }else{
                var user = [{"userId": userId}];
                await setuserinfo(user);
                var mCmd = "EnterEnroll";
                var mjson = JSON.stringify({"cmd": mCmd, "data": {"userId": userId, "feature": feature}});
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
                        }
                    }
                })
        }
        isEnroll = false;
    })

//自动新增人
$(".inpl").click(async function() {
    var uid = [];
    var ids = parseInt($(".pilin").val());
    var userid ;
    if(!useridlist.length>0){
        userid =1;
    }else{
        userid = parseInt(useridlist[useridlist.length-1])+1;
    }
    for (var id = userid; id < userid+useridlist.length+ids; id++){
         var user = {"userId": ""+id};
         uid.push(user);
    }
    await setuserinfo(uid);

    $(".right4-insertuser").find("input").val("");
    $(".ok").val("确定");
    $(".no").val("取消");
    $(".inpl").val("批量新增");
    $(".photoshow").attr("src", "");
    $(".right4-insertuser").hide();
})

//写入人员
 async function setuserinfo(user){
    $(".progress", window.parent.document).show();
    $(".progress2").show();
    $("#progressImgage").show();
    await ajax_setuserinfo(user);
}


//批量导入人员照片
var idornames = [];
async function filesupload(e) {
    idornames = [];
    var files = e.files;
    var length = files.length;
    if(length==0){}
    else {
        for (var i = 0; i < length; i++) {
            var file = files[i];
            var size = file.size;
            var type = file.type.split("/")[1];
            var filename = file.name.split(".")[0];
            if (type != "jpg" && type != "png" && type != "jpeg") {
                alert("只能选取jpg/png/jpeg格式图片");
                $(".chooseimgs").val("");
                return;
            } else {
                if (size > 300 * 1024) {
                    alert("图片不能超过300k");
                    $(".chooseimgs").val("");
                    return;
                } else {
                    var us = {};
                    us.name = filename;
                    await getbase64(file);
                    us.photo = photobase;
                    idornames.push(us);
                }
            }
        }
        if(isfirstidlist=="yes"){
            isupimgs = true;
            selectidlist();
        }
    }

}


var errorimg ;
var okimg ;
$(".uploadimgs").click(async function(){
    errorimg = [];
    okimg = [];
    if(idornames.length==0){
        alert("未选择图片")
    }else{
        for(var i=0;i<idornames.length;i++) {
            if(userslist.length==0){
                var user={};
                var userid = i+1;
                var photo = idornames[i]["photo"];
                user.userId = userid+"";
                user.update = 1;
                user.name = idornames[i]["name"];
                user.photo = photo;
                okimg.push(user);
            }else {
                for (var key in userslist) {
                    var id = userslist[key]["userId"];
                    var name = userslist[key]["name"];
                    if (idornames[i]["name"] != id && idornames[i]["name"] != name) {
                        if (key == userslist.length - 1) {
                            var user = {};
                            var userid = parseInt(useridlist[useridlist.length - 1]) + i + 1;
                            var photo = idornames[i]["photo"];
                            user.userId = userid + "";
                            user.update = 1;
                            user.name = idornames[i]["name"];
                            user.photo = photo;
                            okimg.push(user);
                        }
                    } else {
                        var user = {};
                        var userid = id;
                        var photo = idornames[i]["photo"];
                        user.userId = userid + "";
                        user.name = idornames[i]["name"];
                        user.update = 1
                        user.photo = photo;
                        errorimg.push(user);
                        break;
                    }
                }
            }
        }
        if(errorimg.length>0){
            /* ---是否覆盖设备已有人员 -------*/
             $(".jinggao").show();
        }else{
                $(".xlsdiv").hide();
                $(".choosexls").val("");
                $(".chooseimgs").val("");
                if(okimg.length>0) {
                    for (var i = 0; i < okimg.length; i++) {
                        setuserok = false;
                        if(i==okimg.length-1){
                            setuserok = true;
                        }
                        var user = [okimg[i]];
                        await setuserinfo(user);
                    }
                }
        }
    }
})

/*----覆盖设备人员---*/
$(".queren").click(async function(){
    $(".xlsdiv").hide();
    $(".jinggao").hide();
    $(".choosexls").val("");
    $(".chooseimgs").val("");
    $(".progress2").hide();
    Array.prototype.push.apply(okimg, errorimg);
    if(okimg.length>0) {
        for (var i = 0; i < okimg.length; i++) {
            setuserok = false;
            if(i==okimg.length-1){
                setuserok = true;
            }
            var user = [okimg[i]];
            await setuserinfo(user);
        }
    }
})


/*----不覆盖设备人员---*/
$(".cancel").click(async function(){
    $(".xlsdiv").hide();
    $(".jinggao").hide();
    $(".choosexls").val("");
    $(".chooseimgs").val("");
    $(".progress2").hide();
    if(okimg.length>0) {
        for (var i = 0; i < okimg.length; i++) {
            setuserok = false;
            if(i==okimg.length-1){
                setuserok = true;
            }
            var user = [okimg[i]];
            await setuserinfo(user);
        }
    }
})


//获取照片base64
var photobase = "";
function getbase64(file){
    var defer = $.Deferred();
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        photobase = this.result.split(",")[1];
        defer.resolve(e);
    }
    return defer;
}



