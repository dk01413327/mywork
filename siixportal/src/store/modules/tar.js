import pub from '../../api/tar'
const state={

}
const getters={

}
const actions={
    saveRepairGroup(context,params){pub.saveRepairGroup(params.data,params.cb)},
    getRepairGroup(context,params){pub.getRepairGroup(params.data,params.cb)},
    saveGroupUser(context,params){pub.saveGroupUser(params.data,params.cb)},
    delGroupUser(context,params){pub.delGroupUser(params.data,params.cb)},
    
    getRepairArea(context,params){pub.getRepairArea(params.data,params.cb)},
    saveRepairArea(context,params){pub.saveRepairArea(params.data,params.cb)},
    enableRepairArea(context,params){pub.enableRepairArea(params.data,params.cb)},

    getDeviceData(context,params){pub.getDeviceData(params.data,params.cb)},
    saveDeviceData(context,params){pub.saveDeviceData(params.data,params.cb)},
    saveTypeData(context,params){pub.saveTypeData(params.data,params.cb)},
    getTarStat(context,params){pub.getTarStat(params.data,params.cb)},
    
}
const mutations={

}
export default{
    state,
    getters,
    actions,
    mutations
}