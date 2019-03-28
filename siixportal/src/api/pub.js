var cnostdev = "http://192.168.186.127/app/public/index/";
//var constprd = "https://www.siix.gd.cn/app/public/index/";
var constprd = "http://192.168.186.125/index/";
var data = '';
function getServerUrl(method,fun){
    var url = '';
    var callback = '';
    if(method=='GET'){
        callback = '?callback=?'
    }
    if(process.env.NODE_ENV ==='development'){
        url = cnostdev + fun + callback;
    }else{
        url = constprd + fun + callback;
        //url = cnostdev + fun + callback;
    }
    return url
}
function callServer(fun,data,cb){
    var url = getServerUrl('GET',fun);
    $.getJSON(url,data,function(res){
        if(cb){
            cb(res.code);
        }        
    })
    .fail(function(jqXHR, textStatus, ex) { 
        if(cb){
            cb({'errcode':1,'errmsg':'系统错误,请联系管理员'});
        }
        
    })
}
export default{
//公共方法
    chkPart(data,cb){callServer('index/check_part',data,cb)},
//用户相关方法
    getSystemLog(data,cb){callServer('index/get_system_log',data,cb)},
    login(data,cb){callServer('index/login',data,cb);},
    changePassword(data,cb){callServer('index/change_password',data,cb);},
    getUserMenu(data,cb){callServer('index/get_user_menu',data,cb);},
    addUseLog(data,cb){callServer('index/add_use_log',data,cb);},

    approveRequest(data,cb){callServer('index/approve_request',data,cb)},
    getCheckDetail(data,cb){callServer('index/get_check_detail',data,cb)},
    getCheckRecord(data,cb){callServer('index/get_check_record',data,cb)},
//会议室预定
    getRoom(data,cb){callServer('index/get_room_data',data,cb);},
    saveRoom(data,cb){callServer('index/save_meeting_room',data,cb);}, 
    booking_data_overview(data,cb){callServer('index/get_booking_data2',data,cb);},
    saveBookingData(data,cb){callServer('index/save_booking_data',data,cb);},
    cancelBooking(data,cb){callServer('index/cancel_booking',data,cb);},
    getMyBooking(data,cb){callServer('index/get_my_meeting',data,cb);},

//公共数据
    getUser(data,cb){callServer('index/get_employee_data',data,cb);},
    saveUser(data,cb){callServer('index/save_emp_data',data,cb);},        
    addRole(data,cb){callServer('index/add_role',data,cb);},
    getRoles(cb){callServer('index/get_roles',data,cb);},
    getCustomer(data,cb){callServer('index/get_customer',data,cb);},
    saveRolePermission(data,cb){
        var obj = eval('(' + data + ')')
        var roleid= obj.role_id;
        var success = 0
        var ccb = (res)=>{
            if(res.errcode == 0)
            success++;
            if(success == obj.menu.length){
                cb('保存成功')
            }
        }
        $.each(obj.menu,function(idx,item){
            var postdata = 'roleid='+roleid;
            postdata += '&menuid='+item.menu_id+'&permissions='+item.permission;
            callServer('index/save_role_permission',postdata,ccb);
        })  
    },
    saveUserRole(data,cb){callServer('index/save_user_role',data,cb);},
    saveChkRoute(data,cb){callServer('index/save_menu_chk_route',data,cb)},
    getChkRoute(data,cb){callServer('index/get_menu_chk_route',data,cb)},
    getParts(data,cb){callServer('index/get_part_data',data,cb);},
    saveRouteLevel(data,cb){callServer('index/save_route_level',data,cb)},
//工程(部门)
    getEngs(cb){callServer('index/get_eng_data',data,cb);},
    saveEng(data,cb){callServer('index/save_eng',data,cb);},
    getEngMan(data,cb){callServer('index/get_eng_man',data,cb);},
    saveEngMan(data,cb){callServer('index/save_eng_man',data,cb);},
//人力计算
    getPartEngMapping(data,cb){callServer('humanres/get_part_eng_mapping',data,cb);},
    savePartEngMapping(data,cb){callServer('humanres/save_part_eng_mapping',data,cb);},
    delPartEngMapping(data,cb){callServer('humanres/del_part_eng_mapping',data,cb);},
    getProductive(data,cb){callServer('humanres/get_part_productive',data,cb);},
    saveProductive(data,cb){callServer('humanres/save_part_productive',data,cb);},
    getDeliveryPlan(data,cb){callServer('humanres/get_delivery_plan',data,cb);},
    getManReport(cb){callServer('humanres/get_man_report',data,cb);},
    getManRptDetail(data,cb){callServer('humanres/get_man_report_detail',data,cb);},
    saveRecruitData(data,cb){callServer('humanres/save_recriut_data',data,cb)},
    getRecruitData(data,cb){callServer('humanres/get_recriut_data',data,cb)},
    delRecruitData(data,cb){callServer('humanres/del_recriut_data',data,cb)},
    
    
//报关系统
    getBando(data,cb){callServer('index/get_bando_bom',data,cb);},
    saveBandoBom(data,cb){callServer('index/save_bando_bom',data,cb)},
    delBandoBom(data,cb){callServer('index/del_bando_bom',data,cb)},

//仓库系统
    saveDeliveryData(data,cb){callServer('warehouse/save_delivery_data',data,cb)},
    delDeliveryData(data,cb){callServer('warehouse/del_delivery_data',data,cb)},
    getDeliveryData(data,cb){callServer('warehouse/get_delivery_data',data,cb)},
    chkDeliveryNo(data,cb){callServer('warehouse/chk_delivery_no',data,cb)},
//物品外放系统
    getLocations(cb){callServer('others/get_wf_location',data,cb)},
    getWFRequestData(data,cb){callServer('others/get_wf_request_data',data,cb)},
    saveWfRequestData(data,cb){callServer('others/save_wf_request_data',data,cb)},
    delWFRequestData(data,cb){callServer('others/del_wf_request',data,cb)},
    closeWfRequest(data,cb){callServer('others/close_wf_request',data,cb)},

//上传文件
    uploadfile(data,cb){
        var url =  getServerUrl('POST','index/uploadfile');

        $.ajax({
            type : "POST",
            url : url,
            async : true,  //是否异步
            processData : false, // 不处理数据
            contentType : false, // 不设置内容类型
            data : data,
            dataType : 'text', //返回类型json、text
            success : function(data) {
                cb(data);
            },
            beforeSend:function(){
            },
            fail(e){
                console.log('upload error',e)
            }
        })
    },
    
}