import pub from '../../api/pub'

const state={
    downloadUrl:process.env.NODE_ENV=='development'?'http://192.168.186.127/app/public':'http://192.168.186.125',
    imageUrl :process.env.NODE_ENV=='development' ?'http://192.168.186.127/app/public':'http://192.168.186.125',
    //downloadUrl:'http://192.168.186.127/app/public',
    //imageUrl :'http://192.168.186.127/app/public',
    //downloadUrl:'http://192.168.186.57/app/public',
    //imageUrl :'http://192.168.186.57/app/public',
    userinfo:null,
    menu:null,
    rooms:[],
    roles:null,
    permission:null,
    
}

const getters = {
    downloadUrl:state=>{return state.downloadUrl},
    imageUrl:state=>{return state.imageUrl},
    userinfo: state => {return state.userinfo;},
    getMenu:state=>{return state.menu;},
    getSubMenu:state=>{
        var arr = Array();
        for(var i = 0; i < state.menu.length; i++){
            for(var j = 0; j <　state.menu[i].children.length; j++){
                var jsonObj = state.menu[i].children[j];
                jsonObj['parentid'] =state.menu[i].menu_id;
                arr.push(jsonObj);
            }
        }
        //console.log(arr);
        return arr;
    },
    getPermission:state=>{return state.permission;},
    getRoom: state => {return state.rooms;},
    roomCount: state => {return state.rooms.length;},
    getRoles: state =>{return state.roles;},
    getPageSize:state=>{
        if (window.innerHeight <= 754) {
            return 9
        }else if(window.innerHeight <= 850){
            return 12
        }else if(window.innerHeight > 850){
            return 20;
        }else{
            return 9
        }
    },
    errTitle:state=>{return '出错了'},
}

const actions={
    getSystemLog(context,params){pub.getSystemLog(params.data,params.cb)},
    setPermission(context,permission){context.commit('setPermission',permission);},
    login (context,params) {
        pub.login(params.data,(res)=>{
            context.commit('login',res);
            params.cb(res);            
        })
    },
    addUseLog(context,params){pub.addUseLog(params.data,params.cb);},
    setUserInfo(context,data){context.commit('setUserInfo',data);},
    logout(context,cb){context.commit('logout'); cb();},
    getUserMenu(context,params){
        pub.getUserMenu(params.data, (res) => {
            context.commit('getUserMenu',res);
            params.cb();
        });
    },
    getCheckRecord(context,params){pub.getCheckRecord(params.data,params.cb);},
    getDept(context,params){
        var data = 'userno='+context.getters.userinfo.emp_no;
        pub.getDept(data,params.cb);
    },
    getUser(context,params){
        var data = 'userno='+context.getters.userinfo.emp_no;
        pub.getUser(data,params.cb);
    },
    saveUser(context,params){pub.saveUser(params.data,params.cb)},
    changePassword(context,params){pub.changePassword(params.data,params.cb)},

    approveRequest(context,params){pub.approveRequest(params.data,params.cb);},
    getCheckDetail(context,params){pub.getCheckDetail(params.data,params.cb)},
    getRoom(context){
        var data = 'userno='+context.getters.userinfo.emp_no;
        pub.getRoom(data, res => {
            context.commit('getRoom',res);
        })
    },
    saveRoom(context,params){
        pub.saveRoom(params.data,(res)=>{
            params.cb(res);
        })
    },
    addRole(context,params){pub.addRole(params.data,params.cb);},
    getRoles(context,cb){
        pub.getRoles((res)=>{
            if(cb != null){
                cb(res.data);
            }
            context.commit('getRoles',res);
        })
    },

    getDeptCheckRoute(context,params){pub.getDeptCheckRoute(params.data,params.cb);},

    saveChkRoute(context,params){pub.saveChkRoute(params.data,params.cb);},
    saveRouteLevel(context,params){pub.saveRouteLevel(params.data,params.cb);},
    getChkRoute(context,params){pub.getChkRoute(params.data,params.cb);},
    saveRolePermission(context,params){pub.saveRolePermission(params.data,params.cb);},
    saveUserRole(context,params){pub.saveUserRole(params.data, params.cb)},
    
    getParts(context,params){pub.getParts(params.data,params.cb);},
    getCustomer(context,params){pub.getCustomer(params.data,params.cb);},
    getEngs(context,params){pub.getEngs(params.cb);},
    saveEng(context,params){pub.saveEng(params.data,params.cb);},
    getEngMan(context,params){pub.getEngMan(params.data,params.cb);},
    saveEngMan(context,params){pub.saveEngMan(params.data,params.cb)},
 
    uploadfile(context,params){pub.uploadfile(params.data,params.cb);},
    clickMenu(context){
        //var parentid = context.state.permission.parentid;
        //$('#'+parentid).addClass('is-opened');
        //$('#'+parentid+' ul').css('display','');
        //var classes = $('#'+parentid).attr('class');
        //if(classes.indexOf('show')>0){
        //    return false;
        //}
        //$('.collapse').collapse('hide');
        //$('.nav-item').removeClass('nav-item-active');
        //$('#'+parentid).prev().addClass('nav-item-active')
        //$('#'+parentid).addClass('show');
    }
}

const mutations={
    setPermission(state,permission){state.permission = permission;},
    login(state,res){
        if(res.errcode == 0){
            state.userinfo = res.data;
            window.sessionStorage.setItem('userinfo',JSON.stringify(res.data));
        }else{
            state.userinfo = null;
        }
    },
    setUserInfo(state,data){state.userinfo = data;},
    logout(state){state.userinfo = null;},
    getUserMenu(state,res){state.menu = res.data;},
    getRoles(state,res){state.roles = res.data;},
    getRoom(state,res){state.rooms = res.data;},
}

export default{
    state,
    getters,
    actions,
    mutations
}