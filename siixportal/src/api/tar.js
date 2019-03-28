var cnostdev = "http://192.168.186.127/app/public/tar.php/index/";
//var constprd = "https://www.siix.gd.cn/app/public/tar.php/index/";
var constprd = "http://192.168.186.125/tar.php/index/";
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
    saveRepairGroup(data,cb){callServer('index/save_repair_group',data,cb)},
    getRepairGroup(data,cb){callServer('index/get_repair_group',data,cb)},
    saveGroupUser(data,cb){callServer('index/save_group_user',data,cb)},
    delGroupUser(data,cb){callServer('index/del_group_user',data,cb)},

    getRepairArea(data,cb){callServer('index/get_repair_area',data,cb)},
    saveRepairArea(data,cb){callServer('index/save_repair_area',data,cb)},
    enableRepairArea(data,cb){callServer('index/enable_repair_area',data,cb)},

    getDeviceData(data,cb){callServer('index/get_device_data',data,cb)},
    saveDeviceData(data,cb){callServer('index/save_device_data',data,cb)},

    saveTypeData(data,cb){callServer('index/save_type_data',data,cb)},
    getTarStat(data,cb){callServer('index/get_tar_stat',data,cb)},
}